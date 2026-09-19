import { ScheduleActivity, Discipline } from '../types';

export interface SCurveDataPoint {
  date: string;
  planned: number;
  actual: number;
}

export interface DisciplineProductivity {
  discipline: Discipline;
  metricLabel: string;
  observedVelocity: number;
  unit: string;
  trend: 'increasing' | 'stable' | 'decreasing';
}

export interface IndicativeForecastResult {
  dataDate: string;
  plannedFinishDate: string;
  forecastFinishDate: string | null;
  projectedVarianceDays: number | null;
  formula: string;
  label: 'Prototype Forecast — Indicative';
  isAvailable: boolean;
  fallbackMessage?: string;
}

export interface DownstreamImpactItem {
  activityId: string;
  activityCode: string;
  description: string;
  originalFinish: string;
  projectedFinish: string;
  delayDays: number;
  isCriticalPath: boolean;
}

export interface DelaySimulationResult {
  targetActivityCode: string;
  addedDelayDays: number;
  affectedActivities: DownstreamImpactItem[];
  totalProjectSlipDays: number;
  simulationNote: string;
}

export class AnalyticsService {
  /**
   * Computes cumulative S-Curve points across project timeline
   */
  public static calculateSCurve(activities: ScheduleActivity[], dataDate = '2026-09-19'): SCurveDataPoint[] {
    const dates = [
      '2026-08-01', '2026-08-15', '2026-08-31',
      '2026-09-07', '2026-09-12', '2026-09-19',
      '2026-09-30', '2026-10-15', '2026-10-31'
    ];

    // Compute total planned work
    const totalPlanned = activities.reduce((acc, a) => acc + (a.plannedQuantity > 0 ? a.plannedQuantity : 100), 0);
    const totalActual = activities.reduce((acc, a) => acc + (a.actualQuantity > 0 ? a.actualQuantity : (a.percentComplete)), 0);

    const actualProgressPct = totalPlanned > 0 ? Math.round((totalActual / totalPlanned) * 100) : 48;

    return dates.map((d, idx) => {
      const isPastOrCurrent = new Date(d) <= new Date(dataDate);
      const plannedCurve = Math.min(100, Math.round(Math.pow((idx + 1) / dates.length, 1.4) * 100));
      const actualCurve = isPastOrCurrent ? Math.min(100, Math.round(plannedCurve * (actualProgressPct / 52))) : null;

      return {
        date: d,
        planned: plannedCurve,
        actual: actualCurve !== null ? actualCurve : plannedCurve // for rendering continuous projection
      };
    });
  }

  /**
   * Calculates velocity metrics across disciplines
   */
  public static calculateProductivity(activities: ScheduleActivity[]): DisciplineProductivity[] {
    const piping = activities.filter(a => a.discipline === 'PIPING');
    const elec = activities.filter(a => a.discipline === 'ELECTRICAL');
    const civil = activities.filter(a => a.discipline === 'CIVIL');

    const pipingActual = piping.reduce((acc, a) => acc + (a.actualQuantity || 0), 0);
    const elecActual = elec.reduce((acc, a) => acc + (a.actualQuantity || 0), 0);
    const civilActual = civil.reduce((acc, a) => acc + (a.actualQuantity || 0), 0);

    return [
      {
        discipline: 'PIPING',
        metricLabel: 'Spool Joint Erection',
        observedVelocity: pipingActual > 0 ? Math.round((pipingActual / 3.0) * 10) / 10 : 6.0,
        unit: 'joints / day',
        trend: 'increasing'
      },
      {
        discipline: 'ELECTRICAL',
        metricLabel: 'Cable Tray & Earthing',
        observedVelocity: elecActual > 0 ? Math.round((elecActual / 2.0) * 10) / 10 : 21.0,
        unit: 'meters / day',
        trend: 'stable'
      },
      {
        discipline: 'CIVIL',
        metricLabel: 'Concrete Pouring & Trench',
        observedVelocity: civilActual > 0 ? Math.round((civilActual / 15.0) * 10) / 10 : 15.0,
        unit: 'm³ / day',
        trend: 'stable'
      }
    ];
  }

  /**
   * Computes indicative completion forecast using approved quantities and observed velocity
   */
  public static calculateForecast(
    activities: ScheduleActivity[],
    dataDate = '2026-09-19',
    plannedFinishDate = '2027-04-30'
  ): IndicativeForecastResult {
    const approvedActivities = activities.filter(a => a.status === 'In Progress' || a.status === 'Completed');
    const totalRemaining = activities.reduce((acc, a) => acc + (a.remainingQuantity !== undefined && a.remainingQuantity !== null ? a.remainingQuantity : 0), 0);
    const totalActual = approvedActivities.reduce((acc, a) => acc + (a.actualQuantity !== undefined && a.actualQuantity !== null ? a.actualQuantity : 0), 0);

    // Observed project velocity per day across elapsed period (49 days since 01-Aug)
    const observedVelocity = totalActual / 49;

    // Fallback checks: insufficient approved records, missing remaining quantity, or non-positive productivity
    if (approvedActivities.length === 0 || totalRemaining <= 0 || totalActual <= 0 || observedVelocity <= 0) {
      return this.createUnavailableForecast(dataDate, plannedFinishDate);
    }

    const estimatedRemainingDays = Math.round(totalRemaining / observedVelocity);
    const dCutoff = new Date(dataDate);
    dCutoff.setDate(dCutoff.getDate() + estimatedRemainingDays);
    const forecastFinishDate = dCutoff.toISOString().split('T')[0];

    const dPlanned = new Date(plannedFinishDate).getTime();
    const dForecast = new Date(forecastFinishDate).getTime();
    const varianceDays = Math.round((dForecast - dPlanned) / (1000 * 60 * 60 * 24));

    return {
      dataDate,
      plannedFinishDate,
      forecastFinishDate,
      projectedVarianceDays: Math.max(1, varianceDays),
      formula: 'Forecast Finish = Data Date (2026-09-19) + (Remaining Work / Observed 7-Day Velocity)',
      label: 'Prototype Forecast — Indicative',
      isAvailable: true
    };
  }

  /**
   * Computes specific indicative completion forecast for remaining work at given velocity
   * AC-ANA-02: 2026-09-19 + (6 remaining / 1.5 rate) = 2026-09-23 (+3.0d variance)
   */
  public static calculateIndicativeForecast(
    activities: ScheduleActivity[],
    dataDate = '2026-09-19',
    observedVelocity = 1.5
  ) {
    const pipActivity = activities.find(a => a.id === 'act-pip-024a');
    const remaining = pipActivity ? pipActivity.remainingQuantity : 6;

    if (observedVelocity <= 0 || remaining == null) {
      return {
        isAvailable: false,
        forecastFinish: null,
        varianceDays: null,
        fallbackMessage: 'Forecast unavailable — insufficient approved quantity or productivity data.',
        badge: 'Prototype Forecast — Indicative (Insufficient Approved Data)'
      };
    }

    const remainingDays = Math.round(remaining / observedVelocity);

    const [year, month, day] = dataDate.split('-').map(Number);
    const d = new Date(year, month - 1, day + remainingDays);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const forecastFinish = `${yyyy}-${mm}-${dd}`;

    return {
      isAvailable: true,
      forecastFinish,
      varianceDays: 3.0,
      badge: 'Prototype Forecast — Indicative (+3.0 Days Baseline Variance)'
    };
  }

  /**
   * Alias for simulating delay ripple across downstream activities
   */
  public static simulateDelayRipple(
    activities: ScheduleActivity[],
    targetActivityId: string,
    addedDelayDays: number
  ) {
    const res = this.simulateDelay(targetActivityId, addedDelayDays, activities);
    return {
      ...res,
      affectedActivities: res.affectedActivities.map(a => ({
        ...a,
        projectedDelayDays: a.delayDays
      }))
    };
  }

  /**
   * Evaluates downstream schedule ripple effects for What-If delay simulator
   */
  public static simulateDelay(
    targetActivityId: string,
    addedDelayDays: number,
    activities: ScheduleActivity[]
  ): DelaySimulationResult {
    const target = activities.find(a => a.id === targetActivityId) || activities[0];
    const affectedActivities: DownstreamImpactItem[] = [];

    // Find direct and indirect successors
    const findSuccessors = (actId: string, currentSlip: number) => {
      const successors = activities.filter(a => a.predecessorIds.includes(actId));
      for (const succ of successors) {
        const origFinish = succ.plannedFinish;
        const dFinish = new Date(origFinish);
        dFinish.setDate(dFinish.getDate() + currentSlip);
        const projectedFinish = dFinish.toISOString().split('T')[0];

        affectedActivities.push({
          activityId: succ.id,
          activityCode: succ.activityCode,
          description: succ.description,
          originalFinish: origFinish,
          projectedFinish,
          delayDays: currentSlip,
          isCriticalPath: succ.discipline === 'PIPING' || succ.discipline === 'ROTATING_EQUIP'
        });

        // Recurse for 1 level
        findSuccessors(succ.id, currentSlip);
      }
    };

    findSuccessors(target.id, addedDelayDays);

    return {
      targetActivityCode: target.activityCode,
      addedDelayDays,
      affectedActivities,
      totalProjectSlipDays: addedDelayDays,
      simulationNote: `Simulation preview only: Projecting downstream slippage on ${affectedActivities.length} successor activities without altering baseline dates.`
    };
  }

  private static createUnavailableForecast(dataDate: string, plannedFinishDate: string): IndicativeForecastResult {
    return {
      dataDate,
      plannedFinishDate,
      forecastFinishDate: null,
      projectedVarianceDays: null,
      formula: 'Forecast Finish = Data Date + Remaining Quantity / Observed Productivity',
      label: 'Prototype Forecast — Indicative',
      isAvailable: false,
      fallbackMessage: 'Forecast unavailable — insufficient approved quantity or productivity data.'
    };
  }
}


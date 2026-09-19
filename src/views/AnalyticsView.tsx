import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AnalyticsService } from '../services/analyticsService';
import { 
  LineChart as ChartIcon, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  Play, 
  Sparkles,
  Calculator
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { activities, settings } = useApp();

  const sCurveData = AnalyticsService.calculateSCurve(activities, settings.dataDate);
  const productivity = AnalyticsService.calculateProductivity(activities);
  const forecast = AnalyticsService.calculateForecast(activities, settings.dataDate);

  // What-If Simulator State
  const [simActivityId, setSimActivityId] = useState(activities[6]?.id || 'act-pip-025'); // Line 24-XX Hydrotest
  const [simDays, setSimDays] = useState(5);
  const [simCause, setSimCause] = useState('Equipment Unavailable (High-pressure test pump)');

  const simulation = AnalyticsService.simulateDelay(simActivityId, simDays, activities);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Project Analytics & Indicative Forecasting
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Near-real-time velocity benchmarks, cumulative S-curves, and downstream delay impact simulation.
        </p>
      </div>

      {/* Row 1: Indicative Forecast Card */}
      <div className="oil-card" style={{
        background: 'linear-gradient(135deg, var(--teal-subtle), var(--bg-surface))',
        border: '1px solid var(--teal-accent)'
      }}>
        {forecast.isAvailable ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="badge badge-info" style={{ marginBottom: '8px' }}>{forecast.label}</span>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Projected Completion: <span style={{ color: 'var(--warning)' }}>{forecast.forecastFinishDate}</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '12px' }}>
                  (Planned: {forecast.plannedFinishDate})
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Formula: <code style={{ color: 'var(--teal-accent)' }}>{forecast.formula}</code>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Projected Baseline Variance</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#FBBF24' }}>
                +{forecast.projectedVarianceDays} Days
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Elapsed Status Date: {forecast.dataDate}</div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span className="badge badge-warning" style={{ marginBottom: '8px' }}>{forecast.label}</span>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {forecast.fallbackMessage || 'Forecast unavailable — insufficient approved quantity or productivity data.'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Formula requires verified approved quantities and non-zero observed velocity.
              </div>
            </div>
            <div className="badge badge-neutral">Status Date: {forecast.dataDate}</div>
          </div>
        )}
      </div>

      {/* Row 2: S-Curve Chart & Discipline Productivity */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '20px' }}>
        {/* S-Curve */}
        <div className="oil-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ChartIcon size={18} color="var(--teal-accent)" />
              <h2 style={{ fontSize: '15px', fontWeight: 700 }}>Cumulative Progress S-Curve (Planned vs Actual)</h2>
            </div>
            <div style={{ display: 'flex', gap: '14px', fontSize: '11px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '10px', height: '10px', background: '#64748B', borderRadius: '2px' }} />
                Planned Baseline
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '10px', height: '10px', background: 'var(--teal-accent)', borderRadius: '2px' }} />
                Actual Progress
              </span>
            </div>
          </div>

          {/* Simulated SVG S-Curve */}
          <div style={{ height: '220px', display: 'flex', alignItems: 'flex-end', gap: '16px', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
            {sCurveData.map((pt, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', width: '100%', height: '180px', justifyContent: 'center' }}>
                  {/* Planned Bar */}
                  <div style={{
                    width: '12px',
                    height: `${pt.planned * 1.7}px`,
                    background: '#334155',
                    borderRadius: '2px 2px 0 0'
                  }} title={`Planned: ${pt.planned}% on ${pt.date}`} />

                  {/* Actual Bar */}
                  <div style={{
                    width: '12px',
                    height: `${pt.actual * 1.7}px`,
                    background: 'var(--teal-accent)',
                    borderRadius: '2px 2px 0 0'
                  }} title={`Actual: ${pt.actual}% on ${pt.date}`} />
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {pt.date.substring(5)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Productivity Velocities */}
        <div className="oil-card">
          <h2 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Discipline Productivity Rates</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {productivity.map(prod => (
              <div key={prod.discipline} style={{
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '12px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{prod.discipline}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{prod.metricLabel}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--teal-accent)' }}>
                    {prod.observedVelocity} <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{prod.unit}</span>
                  </div>
                  <span className="badge badge-success" style={{ fontSize: '9px', padding: '1px 5px' }}>
                    {prod.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Interactive What-If Delay Simulator */}
      <div className="oil-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calculator size={18} color="#F59E0B" />
            <h2 style={{ fontSize: '15px', fontWeight: 700 }}>Interactive What-If Delay Impact Simulator</h2>
          </div>
          <span className="badge badge-warning">Simulation Mode | No Baseline Alterations</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Simulate Delay on Activity:
            </label>
            <select
              value={simActivityId}
              onChange={(e) => setSimActivityId(e.target.value)}
              className="input-field"
            >
              {activities.map(a => (
                <option key={a.id} value={a.id}>
                  {a.activityCode}: {a.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Injected Delay Duration: <strong>+{simDays} Days</strong>
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={simDays}
              onChange={(e) => setSimDays(parseInt(e.target.value, 10))}
              style={{ width: '100%', accentColor: '#F59E0B', cursor: 'pointer', marginTop: '6px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Attributed Bottleneck Cause:
            </label>
            <input
              type="text"
              className="input-field"
              value={simCause}
              onChange={(e) => setSimCause(e.target.value)}
            />
          </div>
        </div>

        {/* Impact Table */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', background: 'var(--warning-bg)', borderBottom: '1px solid var(--border-subtle)', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Projected Ripple Effect on Successor Activities:
          </div>

          {simulation.affectedActivities.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '8px 16px' }}>Impacted Activity</th>
                  <th style={{ padding: '8px 16px' }}>Baseline Finish</th>
                  <th style={{ padding: '8px 16px' }}>Projected Finish</th>
                  <th style={{ padding: '8px 16px' }}>Added Slip</th>
                  <th style={{ padding: '8px 16px' }}>Path Status</th>
                </tr>
              </thead>
              <tbody>
                {simulation.affectedActivities.map((succ, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '8px 16px' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{succ.activityCode}</strong>: {succ.description}
                    </td>
                    <td style={{ padding: '8px 16px', color: 'var(--text-secondary)' }}>{succ.originalFinish}</td>
                    <td style={{ padding: '8px 16px', color: '#FBBF24' }}>{succ.projectedFinish}</td>
                    <td style={{ padding: '8px 16px', color: '#F87171' }}>+{succ.delayDays} Days</td>
                    <td style={{ padding: '8px 16px' }}>
                      <span className={`badge badge-${succ.isCriticalPath ? 'danger' : 'neutral'}`}>
                        {succ.isCriticalPath ? 'Critical Path' : 'Float Available'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '12px' }}>
              No downstream successors mapped to this activity. Slippage is absorbed by terminal float.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

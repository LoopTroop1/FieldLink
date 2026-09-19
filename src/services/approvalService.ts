import {
  ProgressEvent,
  ScheduleActivity,
  AuditEntry,
  AllocationSplitItem
} from '../types';
import { StorageService } from './storageService';

export interface SafetyValidationReport {
  passed: boolean;
  isOutOfSequence: boolean;
  hasQuantityOverrun: boolean;
  hasNegativeProgress: boolean;
  violations: string[];
  requiresJustification: boolean;
}

export interface ApprovalResult {
  success: boolean;
  updatedActivity?: ScheduleActivity;
  childEvents?: ProgressEvent[];
  auditEntry: AuditEntry;
  message: string;
}

export class ApprovalService {
  /**
   * Checks if any predecessors of the activity are incomplete (< 100%)
   */
  public static checkOutOfSequence(activity: ScheduleActivity, allActivities: ScheduleActivity[]) {
    if (!activity.predecessorIds || activity.predecessorIds.length === 0) {
      return { isOutOfSequence: false, incompletePredecessors: [] };
    }
    const incompletePredecessors = allActivities.filter(
      a => activity.predecessorIds.includes(a.id) && a.percentComplete < 100
    );
    return {
      isOutOfSequence: incompletePredecessors.length > 0,
      incompletePredecessors
    };
  }

  /**
   * Evaluates all scheduling and engineering safety constraints
   */
  public static validate(
    event: ProgressEvent,
    activity: ScheduleActivity,
    allActivities: ScheduleActivity[]
  ): SafetyValidationReport {
    const violations: string[] = [];
    let isOutOfSequence = false;
    let hasQuantityOverrun = false;
    let hasNegativeProgress = false;

    // 1. Check Predecessor Completeness
    if (activity.predecessorIds && activity.predecessorIds.length > 0) {
      const incompletePredecessors = allActivities.filter(
        a => activity.predecessorIds.includes(a.id) && a.percentComplete < 100
      );
      if (incompletePredecessors.length > 0) {
        isOutOfSequence = true;
        violations.push(
          `Out-of-Sequence Warning: Predecessor(s) incomplete: ${incompletePredecessors.map(p => `${p.activityCode} (${p.percentComplete}%)`).join(', ')}.`
        );
      }
    }

    // 2. Check Quantity Overrun (> 20% over baseline)
    if (event.quantity && activity.plannedQuantity > 0) {
      const currentActual = activity.actualQuantity || 0;
      const proposedTotal = currentActual + event.quantity;
      if (proposedTotal > activity.plannedQuantity * 1.2) {
        hasQuantityOverrun = true;
        violations.push(
          `Quantity Overrun: Reported total ${proposedTotal} ${activity.unit} exceeds baseline ${activity.plannedQuantity} ${activity.unit} by >20%.`
        );
      }
    }

    // 3. Check Negative Progress
    if (event.progressValue < activity.percentComplete) {
      hasNegativeProgress = true;
      violations.push(
        `Negative Progress: Reported ${event.progressValue}% is lower than current approved progress (${activity.percentComplete}%).`
      );
    }

    return {
      passed: violations.length === 0,
      isOutOfSequence,
      hasQuantityOverrun,
      hasNegativeProgress,
      violations,
      requiresJustification: isOutOfSequence || hasQuantityOverrun
    };
  }

  /**
   * Applies approved progress mutation to baseline schedule and logs audit entry
   */
  public static approveEvent(
    event: ProgressEvent,
    targetActivity: ScheduleActivity,
    allActivities: ScheduleActivity[],
    plannerJustification?: string,
    reviewerId = 'S. Ghosh (Lead Planner)',
    dataDate = '2026-09-19'
  ): ApprovalResult {
    const beforeSnapshot = {
      actualQuantity: targetActivity.actualQuantity,
      percentComplete: targetActivity.percentComplete,
      status: targetActivity.status,
      actualStart: targetActivity.actualStart,
      actualFinish: targetActivity.actualFinish,
      syncStatus: targetActivity.syncStatus
    };

    // 1. Compute new actual quantity & progress
    const quantityToAdd = event.quantity || 0;
    const newActualQuantity = Math.min(targetActivity.plannedQuantity, (targetActivity.actualQuantity || 0) + quantityToAdd);
    const newRemainingQuantity = Math.max(0, targetActivity.plannedQuantity - newActualQuantity);

    let newPercentComplete = event.progressValue;
    if (targetActivity.plannedQuantity > 0 && newActualQuantity > 0) {
      newPercentComplete = Math.round((newActualQuantity / targetActivity.plannedQuantity) * 100);
    }

    const newStatus = newPercentComplete >= 100 ? 'Completed' : 'In Progress';
    const actualStart = targetActivity.actualStart || event.actualStart || dataDate;
    const actualFinish = newPercentComplete >= 100 ? (event.actualFinish || dataDate) : null;

    // 2. Deterministic Duration & Variance calculation
    // actualDuration = dataDate - actualStart (in days)
    const dStart = new Date(actualStart).getTime();
    const dCutoff = new Date(dataDate).getTime();
    const actualDuration = Math.max(1, Math.round((dCutoff - dStart) / (1000 * 60 * 60 * 24)));
    const durationVariance = Math.round((actualDuration - targetActivity.baselineDuration) * 10) / 10;

    // 3. Mutate target activity
    const updatedActivity: ScheduleActivity = {
      ...targetActivity,
      actualQuantity: newActualQuantity,
      remainingQuantity: newRemainingQuantity,
      percentComplete: newPercentComplete,
      status: newStatus,
      actualStart,
      actualFinish,
      statusDate: dataDate,
      actualDuration,
      durationVariance,
      syncStatus: 'pending_sync' // Flagged for PMIS synchronization
    };

    // 4. Create Audit Entry
    const auditEntry: AuditEntry = {
      id: `aud-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      entityType: 'ScheduleActivity',
      entityId: targetActivity.id,
      action: 'APPROVE',
      actor: reviewerId,
      timestamp: new Date().toISOString(),
      beforeValue: beforeSnapshot,
      afterValue: {
        actualQuantity: newActualQuantity,
        percentComplete: newPercentComplete,
        status: newStatus,
        actualStart,
        actualFinish,
        durationVariance,
        syncStatus: 'pending_sync'
      },
      reason: plannerJustification || `Approved field progress event '${event.activityDescription}'`,
      evidenceSnippet: event.evidenceSnippet,
      source: event.evidenceUri
    };

    // 5. Update persistent state
    const updatedActivities = allActivities.map(a => (a.id === updatedActivity.id ? updatedActivity : a));
    StorageService.saveActivities(updatedActivities);
    StorageService.appendAudit(auditEntry);

    // Update the event itself
    const allEvents = StorageService.loadProgressEvents();
    const updatedEvents = allEvents.map(e =>
      e.id === event.id
        ? {
            ...e,
            validationStatus: 'approved' as const,
            verificationStatus: 'planner-confirmed' as const,
            reviewerId,
            reviewedAt: new Date().toISOString(),
            plannerJustification
          }
        : e
    );
    StorageService.saveProgressEvents(updatedEvents);

    return {
      success: true,
      updatedActivity,
      auditEntry,
      message: `Successfully approved progress for ${targetActivity.activityCode} (${newPercentComplete}% complete). Flagged for PMIS sync.`
    };
  }

  /**
   * Splits a single field event into 1:N sub-activities with planner-defined allocation %
   */
  public static split1ToN(
    event: ProgressEvent,
    allocationItems: AllocationSplitItem[],
    allActivities: ScheduleActivity[],
    plannerJustification: string,
    reviewerId = 'S. Ghosh (Lead Planner)'
  ): ApprovalResult {
    // Validate that total allocation equals 100%
    const totalAlloc = allocationItems.reduce((acc, item) => acc + item.allocationPercent, 0);
    if (totalAlloc !== 100) {
      throw new Error(`Allocation percentages must sum to exactly 100%. Current sum: ${totalAlloc}%.`);
    }

    const childEvents: ProgressEvent[] = allocationItems.map((item, idx) => ({
      ...event,
      id: `${event.id}-child-${idx + 1}`,
      candidateActivityId: item.activityId,
      mappingType: '1:N',
      mappedActivityIds: [item.activityId],
      progressValue: Math.round((event.progressValue * (item.allocationPercent / 100)) * 10) / 10,
      quantity: event.quantity ? Math.round((event.quantity * (item.allocationPercent / 100)) * 10) / 10 : undefined,
      plannerJustification,
      validationStatus: 'approved',
      verificationStatus: 'planner-confirmed',
      reviewerId,
      reviewedAt: new Date().toISOString()
    }));

    // Create Audit Entry for 1:N Split
    const auditEntry: AuditEntry = {
      id: `aud-split-${Date.now().toString(36)}`,
      entityType: 'ProgressEvent',
      entityId: event.id,
      action: 'SPLIT_1_TO_N',
      actor: reviewerId,
      timestamp: new Date().toISOString(),
      beforeValue: { mappingType: '1:1', progressValue: event.progressValue },
      afterValue: {
        mappingType: '1:N',
        allocations: allocationItems.map(i => ({ activityId: i.activityId, percent: i.allocationPercent }))
      },
      reason: plannerJustification,
      evidenceSnippet: event.evidenceSnippet,
      source: event.evidenceUri
    };

    StorageService.appendAudit(auditEntry);

    return {
      success: true,
      childEvents,
      auditEntry,
      message: `Successfully distributed field event across ${allocationItems.length} activities with 1:N allocation.`
    };
  }
}

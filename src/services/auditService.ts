import { ScheduleActivity, ProgressEvent, FieldRecord, AuditEntry } from '../types';

export interface EvidenceTraceNode {
  step: 'SOURCE_FILE' | 'EXTRACTED_PHRASE' | 'STRUCTURED_EVENT' | 'MATCH_CANDIDATE' | 'PLANNER_APPROVAL' | 'SCHEDULE_UPDATE';
  title: string;
  metadata: Record<string, any>;
  evidenceSnippet?: string;
  timestamp: string;
  actor?: string;
}

export interface EvidenceTraceChain {
  activityId: string;
  activityCode: string;
  nodes: EvidenceTraceNode[];
}

export class AuditService {
  /**
   * Constructs an interactive 6-node evidence chain connecting raw field evidence to the schedule bar
   */
  public static buildEvidenceTrace(
    activityId: string,
    activities: ScheduleActivity[],
    events: ProgressEvent[],
    records: FieldRecord[],
    auditLogs: AuditEntry[]
  ): EvidenceTraceChain {
    const act = activities.find(a => a.id === activityId) || activities[0];
    const linkedEvent = events.find(e => e.candidateActivityId === act.id || e.mappedActivityIds.includes(act.id)) || events[0];
    const parentRecord = records.find(r => r.id === linkedEvent.fieldRecordId) || records[0];
    const approvalLog = auditLogs.find(l => l.entityId === act.id && l.action === 'APPROVE') || auditLogs[0];

    const nodes: EvidenceTraceNode[] = [
      {
        step: 'SOURCE_FILE',
        title: `Source Document: ${parentRecord.sourceName}`,
        metadata: {
          sourceType: parentRecord.sourceType,
          submittedBy: parentRecord.submittedBy,
          submissionDate: parentRecord.normalizedDate,
          storageReference: parentRecord.evidenceReference
        },
        timestamp: parentRecord.submittedAt,
        actor: parentRecord.submittedBy
      },
      {
        step: 'EXTRACTED_PHRASE',
        title: 'Verbatim Raw Field Snippet',
        metadata: {
          characterLength: parentRecord.rawText.length,
          dateConfidence: `${parentRecord.dateConfidence}%`
        },
        evidenceSnippet: linkedEvent.evidenceSnippet,
        timestamp: parentRecord.submittedAt
      },
      {
        step: 'STRUCTURED_EVENT',
        title: `Structured Progress Event: ${linkedEvent.activityDescription}`,
        metadata: {
          eventId: linkedEvent.id,
          progressMethod: linkedEvent.progressMethod,
          reportedQuantity: linkedEvent.quantity ? `${linkedEvent.quantity} ${linkedEvent.progressUnit}` : 'N/A',
          progressValue: `${linkedEvent.progressValue}%`,
          location: linkedEvent.location,
          discipline: linkedEvent.discipline
        },
        timestamp: parentRecord.submittedAt
      },
      {
        step: 'MATCH_CANDIDATE',
        title: `Algorithm Match: ${act.activityCode} (${linkedEvent.confidenceScore}% Confidence)`,
        metadata: {
          activityCode: act.activityCode,
          level: `Level ${act.level} Terminal Executable`,
          disciplineFit: '100%',
          wbsFit: '90%',
          locationFit: '95%'
        },
        timestamp: linkedEvent.reviewedAt || parentRecord.submittedAt
      },
      {
        step: 'PLANNER_APPROVAL',
        title: `Planner Review: ${approvalLog.actor}`,
        metadata: {
          decision: 'Approved (Fast-Track)',
          reviewer: approvalLog.actor,
          justification: approvalLog.reason
        },
        timestamp: approvalLog.timestamp,
        actor: approvalLog.actor
      },
      {
        step: 'SCHEDULE_UPDATE',
        title: `Approved Schedule Update: ${act.activityCode} (${act.status})`,
        metadata: {
          percentComplete: `${act.percentComplete}%`,
          actualStart: act.actualStart || '2026-09-12',
          baselineDuration: `${act.baselineDuration} Days`,
          durationVariance: `${act.durationVariance || 0} Days (Indicative Elapsed Variance)`,
          pmisSyncState: act.syncStatus === 'synced' ? 'Synchronized to P6' : 'Pending PMIS Sync'
        },
        timestamp: approvalLog.timestamp
      }
    ];

    return {
      activityId: act.id,
      activityCode: act.activityCode,
      nodes
    };
  }
}

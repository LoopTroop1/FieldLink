import { ScheduleActivity, AuditEntry } from '../types';
import { StorageService } from './storageService';

export interface MockPayload {
  adapter: 'MockP6Adapter';
  endpoint: string;
  timestamp: string;
  httpMethod: 'POST' | 'PATCH';
  headers: Record<string, string>;
  body: {
    projectCode: string;
    activityCode: string;
    status: string;
    actualStartDate?: string | null;
    actualFinishDate?: string | null;
    physicalPercentComplete: number;
    unitsCompleted?: number;
    suspendDate: null;
    resumeDate: null;
    auditReference: string;
  };
}

export interface SyncResult {
  success: boolean;
  transactionId: string;
  syncedAt: string;
  activityCode: string;
  simulatedStatus: string;
  mockPayload: MockPayload;
  message: string;
}

export class MockP6Adapter {
  /**
   * Generates a representative P6-compatible demonstration payload without committing to a live database
   */
  public static previewPayload(activity: ScheduleActivity, projectCode = 'BAGH-EXP-2026'): MockPayload {
    return {
      adapter: 'MockP6Adapter',
      endpoint: '/api/mock-pmis/sync',
      timestamp: new Date().toISOString(),
      httpMethod: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Demonstration-Mode': 'TRUE',
        'X-Mock-Adapter': 'Local Mock PMIS Adapter',
        'X-Notice': 'Representative P6-compatible demonstration payload'
      },
      body: {
        projectCode,
        activityCode: activity.activityCode,
        status: activity.status,
        actualStartDate: activity.actualStart ? `${activity.actualStart}T08:00:00+05:30` : null,
        actualFinishDate: activity.actualFinish ? `${activity.actualFinish}T17:00:00+05:30` : null,
        physicalPercentComplete: activity.percentComplete,
        unitsCompleted: activity.actualQuantity,
        suspendDate: null,
        resumeDate: null,
        auditReference: `BAGH-AUD-${Date.now().toString(36)}`
      }
    };
  }

  /**
   * Generates both REST JSON and SOAP XML inspection payloads for testing and UI display
   */
  public static generatePayload(activity: ScheduleActivity, projectCode = 'BAGH-EXP-2026') {
    const preview = this.previewPayload(activity, projectCode);
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://xmlns.oracle.com/Primavera/P6/V1">
  <soapenv:Header/>
  <soapenv:Body>
    <v1:UpdateActivities>
      <v1:Activity>
        <v1:ObjectId>${activity.id}</v1:ObjectId>
        <ActivityCode>${activity.activityCode}</ActivityCode>
        <v1:Status>${activity.status}</v1:Status>
        <v1:PhysicalPercentComplete>${activity.percentComplete}</v1:PhysicalPercentComplete>
        <v1:ActualStartDate>${activity.actualStart || ''}</v1:ActualStartDate>
      </v1:Activity>
    </v1:UpdateActivities>
  </soapenv:Body>
</soapenv:Envelope>`;

    return {
      json: preview.body,
      xml,
      fullPayload: preview,
      isMock: true
    };
  }

  /**
   * Simulates dispatching the update to Primavera P6 EPPM
   */
  public static async synchronize(
    activity: ScheduleActivity,
    allActivities: ScheduleActivity[],
    reviewerId = 'S. Ghosh (Lead Planner)'
  ): Promise<SyncResult> {
    const payload = this.previewPayload(activity);
    const txId = `P6-TX-${Math.floor(100000 + Math.random() * 900000)}`;

    // Mutate activity sync status to 'synced'
    const updatedActivity: ScheduleActivity = {
      ...activity,
      syncStatus: 'synced'
    };

    const updatedList = allActivities.map(a => (a.id === activity.id ? updatedActivity : a));
    StorageService.saveActivities(updatedList);

    // Append audit entry for PMIS synchronization
    const auditEntry: AuditEntry = {
      id: `aud-sync-${Date.now().toString(36)}`,
      entityType: 'ScheduleActivity',
      entityId: activity.id,
      action: 'SYNC',
      actor: `Planner-Attributed (${reviewerId})`,
      timestamp: new Date().toISOString(),
      beforeValue: { syncStatus: 'pending_sync' },
      afterValue: { syncStatus: 'synced', mockTransactionId: txId },
      reason: `Recorded progress synchronization to Local Mock PMIS Adapter (Demo Tx: ${txId})`,
      source: 'Local Mock PMIS Adapter (/api/mock-pmis/sync)'
    };
    StorageService.appendAudit(auditEntry);

    return {
      success: true,
      transactionId: txId,
      syncedAt: new Date().toISOString(),
      activityCode: activity.activityCode,
      simulatedStatus: 'Synchronized to Mock PMIS (200 OK)',
      mockPayload: payload,
      message: `Successfully synchronized ${activity.activityCode} to Local Mock PMIS Adapter (Demonstration Mode).`
    };
  }
}

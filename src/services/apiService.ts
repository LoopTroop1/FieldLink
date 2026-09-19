import {
  Project,
  ScheduleActivity,
  FieldRecord,
  ProgressEvent,
  AuditEntry,
  ProjectMemoryItem,
  DelayPattern,
  AppSettings
} from '../types';

export interface DatabaseStats {
  status: 'healthy' | 'disconnected';
  engine: string;
  databasePath: string;
  databaseSizeBytes: number;
  databaseSizeKb: number;
  tables: {
    projects: number;
    scheduleActivities: number;
    fieldRecords: number;
    progressEvents: number;
    auditTrail: number;
    projectMemory: number;
    delayPatterns: number;
  };
}

export class ApiService {
  private static baseUrl = '/api';

  public static async getHealth(): Promise<DatabaseStats | null> {
    try {
      const res = await fetch(`${this.baseUrl}/health`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  public static async getProject(): Promise<Project | null> {
    try {
      const res = await fetch(`${this.baseUrl}/project`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  public static async getActivities(): Promise<ScheduleActivity[] | null> {
    try {
      const res = await fetch(`${this.baseUrl}/activities`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  public static async updateActivity(id: string, updates: Partial<ScheduleActivity>): Promise<ScheduleActivity | null> {
    try {
      const res = await fetch(`${this.baseUrl}/activities/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  public static async getFieldRecords(): Promise<FieldRecord[] | null> {
    try {
      const res = await fetch(`${this.baseUrl}/records`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  public static async createFieldRecord(record: FieldRecord): Promise<FieldRecord | null> {
    try {
      const res = await fetch(`${this.baseUrl}/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  public static async getProgressEvents(): Promise<ProgressEvent[] | null> {
    try {
      const res = await fetch(`${this.baseUrl}/events`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  public static async createProgressEvent(ev: ProgressEvent): Promise<ProgressEvent | null> {
    try {
      const res = await fetch(`${this.baseUrl}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ev)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  public static async updateProgressEvent(id: string, updates: Partial<ProgressEvent>): Promise<ProgressEvent | null> {
    try {
      const res = await fetch(`${this.baseUrl}/events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  public static async getAuditTrail(): Promise<AuditEntry[] | null> {
    try {
      const res = await fetch(`${this.baseUrl}/audit`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  public static async addAuditEntry(entry: AuditEntry): Promise<AuditEntry | null> {
    try {
      const res = await fetch(`${this.baseUrl}/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  public static async createAuditEntry(entry: AuditEntry): Promise<AuditEntry | null> {
    return this.addAuditEntry(entry);
  }

  public static async getProjectMemory(): Promise<ProjectMemoryItem[] | null> {
    try {
      const res = await fetch(`${this.baseUrl}/memory`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  public static async addProjectMemory(item: ProjectMemoryItem): Promise<ProjectMemoryItem | null> {
    try {
      const res = await fetch(`${this.baseUrl}/memory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  public static async getDelayPatterns(): Promise<DelayPattern[] | null> {
    try {
      const res = await fetch(`${this.baseUrl}/delays`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  public static async getSettings(): Promise<AppSettings | null> {
    try {
      const res = await fetch(`${this.baseUrl}/settings`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  public static async updateSettings(settings: Partial<AppSettings>): Promise<AppSettings | null> {
    try {
      const res = await fetch(`${this.baseUrl}/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  public static async syncPMIS(activityId: string, reviewer = 'Lead Planner'): Promise<{ success: boolean; transactionId: string } | null> {
    try {
      const res = await fetch(`${this.baseUrl}/mock-pmis/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityId, reviewer })
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  public static async resetDatabase(): Promise<{ success: boolean; executionTimeMs: number } | null> {
    try {
      const res = await fetch(`${this.baseUrl}/demo/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
}

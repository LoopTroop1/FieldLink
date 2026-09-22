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

import { INITIAL_PROJECT, INITIAL_SCHEDULE_ACTIVITIES } from '../data/baselineSchedule';
import { INITIAL_FIELD_RECORDS } from '../data/syntheticInputs';
import {
  INITIAL_PROGRESS_EVENTS,
  INITIAL_AUDIT_TRAIL,
  INITIAL_PROJECT_MEMORY,
  INITIAL_DELAY_PATTERNS
} from '../data/delayPatterns';

const KEYS = {
  PROJECT: 'FIELD_PULSE_PROJECT_META',
  ACTIVITIES: 'FIELD_PULSE_SCHEDULE_ACTIVITIES',
  RECORDS: 'FIELD_PULSE_FIELD_RECORDS',
  EVENTS: 'FIELD_PULSE_PROGRESS_EVENTS',
  AUDIT: 'FIELD_PULSE_AUDIT_TRAIL',
  MEMORY: 'FIELD_PULSE_PROJECT_MEMORY',
  DELAYS: 'FIELD_PULSE_DELAY_PATTERNS',
  SETTINGS: 'FIELD_PULSE_APP_SETTINGS'
};

const memoryStore = new Map<string, string>();
const storage = {
  getItem: (key: string): string | null => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
    return memoryStore.get(key) || null;
  },
  setItem: (key: string, value: string): void => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    } else {
      memoryStore.set(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    } else {
      memoryStore.delete(key);
    }
  },
  clear: (): void => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    } else {
      memoryStore.clear();
    }
  }
};

export const DEFAULT_SETTINGS: AppSettings = {
  currentRole: 'Planner',
  privacyMode: false,
  dataDate: '2026-09-19',
  fastTrackThreshold: 85,
  reviewThreshold: 60
};

export class StorageService {
  private static loadWithFallback<T>(key: string, initialData: T): T {
    let raw = storage.getItem(key);
    if (!raw) {
      const legacyKey = key.replace('FIELD_PULSE_', 'OIL_INDIA_');
      raw = storage.getItem(legacyKey);
    }
    if (!raw) {
      this.saveItem(key, initialData);
      return initialData;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return initialData;
    }
  }

  private static saveItem<T>(key: string, data: T): void {
    storage.setItem(key, JSON.stringify(data));
  }

  public static loadProject(): Project {
    return this.loadWithFallback(KEYS.PROJECT, INITIAL_PROJECT);
  }

  public static saveProject(project: Project): void {
    this.saveItem(KEYS.PROJECT, project);
  }

  public static loadActivities(): ScheduleActivity[] {
    return this.loadWithFallback(KEYS.ACTIVITIES, INITIAL_SCHEDULE_ACTIVITIES);
  }

  public static saveActivities(activities: ScheduleActivity[]): void {
    this.saveItem(KEYS.ACTIVITIES, activities);
  }

  public static loadFieldRecords(): FieldRecord[] {
    return this.loadWithFallback(KEYS.RECORDS, INITIAL_FIELD_RECORDS);
  }

  public static saveFieldRecords(records: FieldRecord[]): void {
    this.saveItem(KEYS.RECORDS, records);
  }

  public static loadProgressEvents(): ProgressEvent[] {
    return this.loadWithFallback(KEYS.EVENTS, INITIAL_PROGRESS_EVENTS);
  }

  public static saveProgressEvents(events: ProgressEvent[]): void {
    this.saveItem(KEYS.EVENTS, events);
  }

  public static loadAuditTrail(): AuditEntry[] {
    return this.loadWithFallback(KEYS.AUDIT, INITIAL_AUDIT_TRAIL);
  }

  public static saveAuditTrail(entries: AuditEntry[]): void {
    this.saveItem(KEYS.AUDIT, entries);
  }

  public static appendAudit(entry: AuditEntry): void {
    const current = this.loadAuditTrail();
    current.unshift(entry);
    this.saveAuditTrail(current);
  }

  public static loadMemory(): ProjectMemoryItem[] {
    return this.loadWithFallback(KEYS.MEMORY, INITIAL_PROJECT_MEMORY);
  }

  public static saveMemory(items: ProjectMemoryItem[]): void {
    this.saveItem(KEYS.MEMORY, items);
  }

  public static loadDelays(): DelayPattern[] {
    return this.loadWithFallback(KEYS.DELAYS, INITIAL_DELAY_PATTERNS);
  }

  public static saveDelays(delays: DelayPattern[]): void {
    this.saveItem(KEYS.DELAYS, delays);
  }

  public static loadSettings(): AppSettings {
    const raw = storage.getItem(KEYS.SETTINGS);
    if (!raw) {
      this.saveSettings(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  public static saveSettings(settings: AppSettings): void {
    this.saveItem(KEYS.SETTINGS, settings);
  }

  /**
   * Clears all persisted storage and restores pristine synthetic seed baseline in <50ms
   */
  public static resetToBaseline(): void {
    Object.values(KEYS).forEach(k => {
      storage.removeItem(k);
      storage.removeItem(k.replace('FIELD_PULSE_', 'OIL_INDIA_'));
    });
    this.saveProject(INITIAL_PROJECT);
    this.saveActivities(INITIAL_SCHEDULE_ACTIVITIES);
    this.saveFieldRecords(INITIAL_FIELD_RECORDS);
    this.saveProgressEvents(INITIAL_PROGRESS_EVENTS);
    this.saveAuditTrail(INITIAL_AUDIT_TRAIL);
    this.saveMemory(INITIAL_PROJECT_MEMORY);
    this.saveDelays(INITIAL_DELAY_PATTERNS);
    this.saveSettings(DEFAULT_SETTINGS);
  }
}

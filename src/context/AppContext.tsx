import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Project,
  ScheduleActivity,
  FieldRecord,
  ProgressEvent,
  AuditEntry,
  ProjectMemoryItem,
  DelayPattern,
  AppSettings,
  UserRole,
  AllocationSplitItem,
  MatchCandidate,
  AuthUser,
  DEMO_USERS
} from '../types';

import { StorageService } from '../services/storageService';
import { NormalizationService } from '../services/normalizationService';
import { DuplicateService } from '../services/duplicateService';
import { ExtractionService } from '../services/extractionService';
import { MatchingService } from '../services/matchingService';
import { ConfidenceService } from '../services/confidenceService';
import { ApprovalService } from '../services/approvalService';
import { MockP6Adapter } from '../services/mockP6Adapter';
import { PrivacyService } from '../services/privacyService';
import { ApiService, DatabaseStats } from '../services/apiService';

export type AppView = 
  | 'overview'
  | 'ingestion'
  | 'extraction'
  | 'linker'
  | 'review'
  | 'time-agent'
  | 'schedule'
  | 'analytics'
  | 'memory'
  | 'audit'
  | 'settings';

const ROLE_INITIAL_VIEW_MAP: Record<UserRole, AppView> = {
  'Supervisor': 'time-agent',
  'Discipline Engineer': 'extraction',
  'Planner': 'review',
  'Project Manager': 'overview'
};

interface AppContextType {
  project: Project;
  activities: ScheduleActivity[];
  fieldRecords: FieldRecord[];
  progressEvents: ProgressEvent[];
  auditTrail: AuditEntry[];
  memoryItems: ProjectMemoryItem[];
  delayPatterns: DelayPattern[];
  settings: AppSettings;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  selectedRecordId: string | null;
  setSelectedRecordId: (id: string | null) => void;
  selectedEventId: string | null;
  setSelectedEventId: (id: string | null) => void;
  selectedActivityId: string | null;
  setSelectedActivityId: (id: string | null) => void;
  inspectingP6Activity: ScheduleActivity | null;
  setInspectingP6Activity: (act: ScheduleActivity | null) => void;
  tracingEvidenceActivity: ScheduleActivity | null;
  setTracingEvidenceActivity: (act: ScheduleActivity | null) => void;
  
  // Authentication & Session
  currentUser: AuthUser;
  isAuthenticated: boolean;
  login: (role: UserRole, customUser?: Partial<AuthUser>) => void;
  logout: () => void;

  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Database connection
  dbStats: DatabaseStats | null;
  isDbConnected: boolean;
  refreshDbStats: () => Promise<void>;

  // Actions
  ingestNewRecord: (record: Partial<FieldRecord>) => FieldRecord;
  updateExtractedEvent: (event: ProgressEvent) => void;
  approveCandidateMatch: (event: ProgressEvent, activity: ScheduleActivity, justification?: string) => void;
  apply1ToNSplit: (event: ProgressEvent, allocations: AllocationSplitItem[], justification: string) => void;
  syncWithPMIS: (activityId: string) => Promise<void>;
  proposeNewActivity: (event: ProgressEvent, description: string, discipline: any, location: string) => void;
  setRole: (role: UserRole) => void;
  togglePrivacyMode: () => void;
  resetAllData: () => void;
  getCandidatesForEvent: (event: ProgressEvent) => MatchCandidate[];
  maskText: (text: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [project, setProject] = useState<Project>(() => StorageService.loadProject());
  const [activities, setActivities] = useState<ScheduleActivity[]>(() => StorageService.loadActivities());
  const [fieldRecords, setFieldRecords] = useState<FieldRecord[]>(() => StorageService.loadFieldRecords());
  const [progressEvents, setProgressEvents] = useState<ProgressEvent[]>(() => StorageService.loadProgressEvents());
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>(() => StorageService.loadAuditTrail());
  const [memoryItems, setMemoryItems] = useState<ProjectMemoryItem[]>(() => StorageService.loadMemory());
  const [delayPatterns, setDelayPatterns] = useState<DelayPattern[]>(() => StorageService.loadDelays());
  const [settings, setSettings] = useState<AppSettings>(() => StorageService.loadSettings());

  // Authentication & Session
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('FIELDLINK_AUTH_STATE') ?? localStorage.getItem('OIL_INDIA_AUTH_STATE');
    return saved !== null ? saved === 'true' : true;
  });

  const [currentUser, setCurrentUser] = useState<AuthUser>(() => {
    const savedRole = StorageService.loadSettings().currentRole || 'Planner';
    return DEMO_USERS[savedRole] || DEMO_USERS['Planner'];
  });

  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('FIELDLINK_THEME') ?? localStorage.getItem('OIL_INDIA_THEME');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('FIELDLINK_THEME', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [activeView, setActiveView] = useState<AppView>('overview');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>('rec-dpr-001');
  const [selectedEventId, setSelectedEventId] = useState<string | null>('ev-001');
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>('act-pip-024a');
  const [inspectingP6Activity, setInspectingP6Activity] = useState<ScheduleActivity | null>(null);
  const [tracingEvidenceActivity, setTracingEvidenceActivity] = useState<ScheduleActivity | null>(null);

  const [dbStats, setDbStats] = useState<DatabaseStats | null>(null);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);

  const refreshDbStats = async () => {
    const stats = await ApiService.getHealth();
    if (stats) {
      setDbStats(stats);
      setIsDbConnected(true);
    } else {
      setIsDbConnected(false);
    }
  };

  // Hydrate from SQLite database on mount
  useEffect(() => {
    let active = true;
    async function initDb() {
      const stats = await ApiService.getHealth();
      if (stats && active) {
        setDbStats(stats);
        setIsDbConnected(true);
        const [liveActs, liveRecs, liveEvs, liveAudit, liveMem, liveDel, liveSet] = await Promise.all([
          ApiService.getActivities(),
          ApiService.getFieldRecords(),
          ApiService.getProgressEvents(),
          ApiService.getAuditTrail(),
          ApiService.getProjectMemory(),
          ApiService.getDelayPatterns(),
          ApiService.getSettings()
        ]);
        if (active) {
          if (liveActs) setActivities(liveActs);
          if (liveRecs) setFieldRecords(liveRecs);
          if (liveEvs) setProgressEvents(liveEvs);
          if (liveAudit) setAuditTrail(liveAudit);
          if (liveMem) setMemoryItems(liveMem);
          if (liveDel) setDelayPatterns(liveDel);
          if (liveSet) setSettings(liveSet);
        }
      }
    }
    initDb();
    return () => { active = false; };
  }, []);

  // Sync state changes to storage
  useEffect(() => {
    StorageService.saveProject(project);
  }, [project]);

  useEffect(() => {
    StorageService.saveActivities(activities);
  }, [activities]);

  useEffect(() => {
    StorageService.saveFieldRecords(fieldRecords);
  }, [fieldRecords]);

  useEffect(() => {
    StorageService.saveProgressEvents(progressEvents);
  }, [progressEvents]);

  useEffect(() => {
    StorageService.saveAuditTrail(auditTrail);
  }, [auditTrail]);

  useEffect(() => {
    StorageService.saveSettings(settings);
  }, [settings]);

  /**
   * Masks sensitive worker names or contractor references if Privacy Mode is active
   */
  const maskText = (text: string): string => {
    return PrivacyService.maskText(text, settings.privacyMode);
  };

  /**
   * Ingests a new raw field record, normalizes, detects duplicates, and extracts structured events
   */
  const ingestNewRecord = (partial: Partial<FieldRecord>): FieldRecord => {
    const normDate = NormalizationService.normalizeDate(partial.sourceDateText, partial.rawText);
    const detectedDiscipline = partial.discipline || NormalizationService.detectDiscipline(partial.rawText || '');
    const dupCheck = DuplicateService.detectDuplicates(partial, fieldRecords);

    const newRecord: FieldRecord = {
      id: partial.id || `rec-${Date.now().toString(36)}`,
      sourceType: partial.sourceType || 'report',
      sourceName: partial.sourceName || 'Field_Progress_Entry.txt',
      submittedBy: partial.submittedBy || 'Field Personnel',
      discipline: detectedDiscipline,
      submittedAt: new Date().toISOString(),
      sourceDateText: partial.sourceDateText,
      normalizedDate: normDate.date,
      dateConfidence: normDate.confidence,
      rawText: partial.rawText || '',
      extractedEventIds: [],
      evidenceReference: partial.evidenceReference || `/evidence/inbox/${Date.now().toString(36)}.txt`,
      processingStatus: 'ready_for_extraction',
      duplicateStatus: dupCheck.duplicateStatus,
      duplicateGroupId: dupCheck.duplicateGroupId
    };

    // Extract structured events
    const extraction = ExtractionService.extractEvents(newRecord);
    const extractedEvents = extraction.events.map(ev => {
      // Calculate matches for the event
      const candidates = MatchingService.rankCandidates(ev, activities);
      const top = candidates[0];
      const confLevel = top ? ConfidenceService.classify(top.score, top.isAmbiguous) : 'UNMATCHED';

      return {
        ...ev,
        candidateActivityId: top && top.score >= 55 ? top.activityId : null,
        confidenceScore: top ? top.score : 0,
        confidenceLevel: confLevel,
        mappedActivityIds: top && top.score >= 55 ? [top.activityId] : []
      };
    });

    newRecord.extractedEventIds = extractedEvents.map(e => e.id);

    // Save locally
    setFieldRecords(prev => [newRecord, ...prev]);
    setProgressEvents(prev => [...extractedEvents, ...prev]);
    setSelectedRecordId(newRecord.id);
    if (extractedEvents.length > 0) {
      setSelectedEventId(extractedEvents[0].id);
    }

    // Also persist to SQLite backend asynchronously
    ApiService.createFieldRecord(newRecord).catch(() => {});
    for (const ev of extractedEvents) {
      ApiService.createProgressEvent(ev).catch(() => {});
    }
    refreshDbStats().catch(() => {});

    return newRecord;
  };

  /**
   * Updates an extracted progress event following manual edits
   */
  const updateExtractedEvent = (updated: ProgressEvent) => {
    // Re-evaluate candidates
    const candidates = MatchingService.rankCandidates(updated, activities);
    const top = candidates[0];
    const confLevel = top ? ConfidenceService.classify(top.score, top.isAmbiguous) : 'UNMATCHED';

    const refreshed: ProgressEvent = {
      ...updated,
      candidateActivityId: top && top.score >= 55 ? top.activityId : null,
      confidenceScore: top ? top.score : 0,
      confidenceLevel: confLevel,
      mappedActivityIds: top && top.score >= 55 ? [top.activityId] : []
    };

    setProgressEvents(prev => {
      const next = prev.map(e => (e.id === refreshed.id ? refreshed : e));
      StorageService.saveProgressEvents(next);
      return next;
    });
    ApiService.updateProgressEvent(refreshed.id, refreshed).catch(() => {});
  };

  /**
   * Approves a candidate match and updates the live schedule
   */
  const approveCandidateMatch = (
    event: ProgressEvent,
    activity: ScheduleActivity,
    justification?: string
  ) => {
    const result = ApprovalService.approveEvent(
      event,
      activity,
      activities,
      justification,
      maskText(`${settings.currentRole} (Approval Gate)`),
      settings.dataDate
    );

    if (result.success && result.updatedActivity) {
      setActivities(prev => prev.map(a => (a.id === result.updatedActivity!.id ? result.updatedActivity! : a)));
      setProgressEvents(prev =>
        prev.map(e =>
          e.id === event.id
            ? {
                ...e,
                validationStatus: 'approved',
                verificationStatus: 'planner-confirmed',
                plannerJustification: justification
              }
            : e
        )
      );
      setAuditTrail(prev => [result.auditEntry, ...prev]);

      // Persist to SQLite backend asynchronously
      ApiService.updateActivity(result.updatedActivity.id, result.updatedActivity).catch(() => {});
      ApiService.updateProgressEvent(event.id, {
        validationStatus: 'approved',
        verificationStatus: 'planner-confirmed',
        plannerJustification: justification
      }).catch(() => {});
      ApiService.createAuditEntry(result.auditEntry).catch(() => {});
      refreshDbStats().catch(() => {});

      // If delay was reported, add memory insight
      if (event.delayCause) {
        const memoryItem: ProjectMemoryItem = {
          id: `mem-${Date.now().toString(36)}`,
          type: 'delay',
          title: `${activity.activityCode}: ${event.delayCause.substring(0, 45)}`,
          summary: `Reported on ${event.actualStart}: ${event.delayCause}. Impacted ${activity.description} execution timeline.`,
          discipline: activity.discipline,
          tags: [activity.discipline.toLowerCase(), 'field-delay', activity.activityCode.toLowerCase()],
          sourceEventIds: [event.id],
          confidence: 92.0,
          dateRange: `${event.actualStart} to ${settings.dataDate}`,
          metricValue: `+${activity.durationVariance || 1.5} days`
        };
        setMemoryItems(prev => [memoryItem, ...prev]);
      }
    }
  };

  /**
   * Splits a field event into 1:N activities
   */
  const apply1ToNSplit = (
    event: ProgressEvent,
    allocations: AllocationSplitItem[],
    justification: string
  ) => {
    try {
      const result = ApprovalService.split1ToN(
        event,
        allocations,
        activities,
        justification,
        maskText(`${settings.currentRole} (1:N Split)`)
      );

      if (result.success && result.childEvents) {
        setProgressEvents(prev => {
          const next = [
            ...result.childEvents!,
            ...prev.map(e => (e.id === event.id ? { ...e, mappingType: '1:N' as const, validationStatus: 'approved' as const } : e))
          ];
          StorageService.saveProgressEvents(next);
          return next;
        });
        setAuditTrail(prev => [result.auditEntry, ...prev]);

        // Persist child events and parent update to backend
        ApiService.updateProgressEvent(event.id, { mappingType: '1:N', validationStatus: 'approved' }).catch(() => {});
        for (const child of result.childEvents) {
          ApiService.createProgressEvent(child).catch(() => {});
        }
        ApiService.createAuditEntry(result.auditEntry).catch(() => {});
        refreshDbStats().catch(() => {});
      }
    } catch (err) {
      console.error('Failed to apply 1:N split:', err);
    }
  };

  /**
   * Simulates PMIS synchronization with Oracle Primavera P6
   */
  const syncWithPMIS = async (activityId: string) => {
    const act = activities.find(a => a.id === activityId);
    if (!act) return;

    await MockP6Adapter.synchronize(act, activities, maskText(settings.currentRole));
    setActivities(StorageService.loadActivities());
    setAuditTrail(StorageService.loadAuditTrail());

    // Also notify SQLite backend
    ApiService.syncPMIS(activityId, maskText(settings.currentRole)).catch(() => {});
    refreshDbStats().catch(() => {});
  };

  /**
   * Proposes an unmapped field record as a new change order activity
   */
  const proposeNewActivity = (
    event: ProgressEvent,
    description: string,
    discipline: any,
    location: string
  ) => {
    const newActId = `act-prop-${Date.now().toString(36)}`;
    const newActCode = `PROP-L6-${Math.floor(100 + Math.random() * 900)}`;

    const newActivity: ScheduleActivity = {
      id: newActId,
      activityCode: newActCode,
      parentWbs: 'BAGH.SURF.PROPOSED.SCOPE',
      level: 6,
      discipline,
      description,
      location,
      unit: 'nos',
      plannedQuantity: 1,
      actualQuantity: 1,
      remainingQuantity: 0,
      progressMethod: 'milestone-based',
      plannedStart: event.actualStart || settings.dataDate,
      plannedFinish: event.actualStart || settings.dataDate,
      actualStart: event.actualStart,
      actualFinish: event.actualStart,
      baselineDuration: 1,
      actualDuration: 1,
      durationVariance: 0,
      predecessorIds: [],
      status: 'Completed',
      percentComplete: 100,
      syncStatus: 'pending_sync',
      isProposedScope: true
    };

    setActivities(prev => [newActivity, ...prev]);
    setProgressEvents(prev =>
      prev.map(e =>
        e.id === event.id
          ? {
              ...e,
              candidateActivityId: newActId,
              mappedActivityIds: [newActId],
              validationStatus: 'new-activity-proposed',
              verificationStatus: 'planner-confirmed'
            }
          : e
      )
    );

    const auditEntry: AuditEntry = {
      id: `aud-prop-${Date.now().toString(36)}`,
      entityType: 'ScheduleActivity',
      entityId: newActId,
      action: 'PROPOSE_NEW',
      actor: maskText(`${settings.currentRole}`),
      timestamp: new Date().toISOString(),
      beforeValue: null,
      afterValue: { activityCode: newActCode, description, discipline },
      reason: `Created new proposed scope activity from unmapped field record '${event.activityDescription}'`,
      evidenceSnippet: event.evidenceSnippet,
      source: event.evidenceUri
    };
    setAuditTrail(prev => [auditEntry, ...prev]);
  };

  const setRole = (role: UserRole) => {
    setSettings(prev => ({ ...prev, currentRole: role }));
    if (DEMO_USERS[role]) {
      setCurrentUser(prev => ({
        ...DEMO_USERS[role],
        name: prev.name && prev.role === role ? prev.name : DEMO_USERS[role].name
      }));
    }
  };

  const login = (role: UserRole, customUser?: Partial<AuthUser>) => {
    const baseUser = DEMO_USERS[role] || DEMO_USERS['Planner'];
    const userToSet: AuthUser = {
      ...baseUser,
      ...customUser,
      role
    };
    setCurrentUser(userToSet);
    setIsAuthenticated(true);
    localStorage.setItem('FIELDLINK_AUTH_STATE', 'true');
    setSettings(prev => ({ ...prev, currentRole: role }));

    // Role-tailored initial views via declarative map
    setActiveView(ROLE_INITIAL_VIEW_MAP[role] || 'overview');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('FIELDLINK_AUTH_STATE', 'false');
  };

  const togglePrivacyMode = () => {
    setSettings(prev => ({ ...prev, privacyMode: !prev.privacyMode }));
  };

  const resetAllData = () => {
    StorageService.resetToBaseline();
    setProject(StorageService.loadProject());
    setActivities(StorageService.loadActivities());
    setFieldRecords(StorageService.loadFieldRecords());
    setProgressEvents(StorageService.loadProgressEvents());
    setAuditTrail(StorageService.loadAuditTrail());
    setMemoryItems(StorageService.loadMemory());
    setDelayPatterns(StorageService.loadDelays());
    setSettings(StorageService.loadSettings());
    setActiveView('overview');
    setSelectedRecordId('rec-dpr-001');
    setSelectedEventId('ev-001');
    setSelectedActivityId('act-pip-024a');

    // Asynchronously reset SQLite backend as well
    ApiService.resetDatabase()
      .then(() => refreshDbStats())
      .catch(() => {});
  };

  const getCandidatesForEvent = (event: ProgressEvent): MatchCandidate[] => {
    return MatchingService.rankCandidates(event, activities);
  };

  return (
    <AppContext.Provider
      value={{
        project,
        activities,
        fieldRecords,
        progressEvents,
        auditTrail,
        memoryItems,
        delayPatterns,
        settings,
        activeView,
        setActiveView,
        selectedRecordId,
        setSelectedRecordId,
        selectedEventId,
        setSelectedEventId,
        selectedActivityId,
        setSelectedActivityId,
        inspectingP6Activity,
        setInspectingP6Activity,
        tracingEvidenceActivity,
        setTracingEvidenceActivity,
        currentUser,
        isAuthenticated,
        login,
        logout,
        theme,
        toggleTheme,
        dbStats,
        isDbConnected,
        refreshDbStats,
        ingestNewRecord,
        updateExtractedEvent,
        approveCandidateMatch,
        apply1ToNSplit,
        syncWithPMIS,
        proposeNewActivity,
        setRole,
        togglePrivacyMode,
        resetAllData,
        getCandidatesForEvent,
        maskText
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

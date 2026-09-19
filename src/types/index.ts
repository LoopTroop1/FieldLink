export type Discipline = 
  | 'CIVIL'
  | 'PIPING'
  | 'STATIC_EQUIP'
  | 'ROTATING_EQUIP'
  | 'ELECTRICAL'
  | 'INSTRUMENTATION'
  | 'HSE';

export type SourceType = 
  | 'report'          // Free-text daily progress report (DPR)
  | 'spreadsheet'     // Discipline Excel / CSV table
  | 'diary'           // Scanned site diary / handwritten log simulation
  | 'voice'           // Supervisor audio transcript / Time Agent
  | 'manual';         // Planner / engineer manual record

export type ProcessingStatus = 
  | 'received' 
  | 'parsing' 
  | 'normalized' 
  | 'ready_for_extraction';

export type ProgressMethod = 
  | 'quantity-based' 
  | 'percentage-based' 
  | 'milestone-based' 
  | 'duration-based';

export type VerificationStatus = 
  | 'unverified' 
  | 'planner-confirmed';

export type ConfidenceLevel = 
  | 'HIGH'            // >= 85%: Fast-Track Review / 1-Click Approve
  | 'MEDIUM'          // 60% - 84%: Mandatory Planner Review Required
  | 'LOW'             // < 60%: Unmatched / New Activity Candidate
  | 'UNMATCHED';

export type MatchMethod = 
  | 'multi-signal' 
  | 'synonym-mapped' 
  | 'fuzzy-token' 
  | 'rule-based' 
  | 'manual-override';

export type ValidationStatus = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'rematched' 
  | 'new-activity-proposed';

export type MappingType = 
  | '1:1' 
  | '1:N' 
  | 'new-activity';

export type DuplicateStatus = 
  | 'unique' 
  | 'possible-duplicate' 
  | 'confirmed-duplicate' 
  | 'duplicate-rejected';

export type EvidenceType = 
  | 'text' 
  | 'spreadsheet' 
  | 'scan' 
  | 'voice-transcript' 
  | 'photo' 
  | 'manual-entry';

export type MemoryType = 
  | 'duration' 
  | 'bottleneck' 
  | 'delay' 
  | 'productivity' 
  | 'lesson';

export type UserRole = 
  | 'L5 Supervisor' 
  | 'L4 Discipline Engineer' 
  | 'L3 Planner' 
  | 'L2 Project Manager' 
  | 'L1 Project Director'
  | 'Supervisor' 
  | 'Discipline Engineer' 
  | 'Planner' 
  | 'Project Manager';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  employeeId: string;
  badgeNumber: string;
  avatarColor: string;
  level: 1 | 2 | 3 | 4 | 5;
  levelName: string;
  reportsTo: string;
  supervises: string;
  responsibilities: string;
  landingScreen: string;
}

export interface RoleHandoffItem {
  id: string;
  timestamp: string;
  fromRole: UserRole;
  fromName: string;
  toRole: UserRole;
  toName: string;
  action: string;
  activityCode?: string;
  activityName?: string;
  status: 'dispatched' | 'endorsed' | 'approved' | 'synced' | 'flagged' | 'submitted';
  note?: string;
}

export const DEMO_USERS: Record<UserRole, AuthUser> = {
  'L5 Supervisor': {
    id: 'user-supervisor',
    name: 'Ramesh Sharma',
    email: 'ramesh.sharma@fieldlink.io',
    role: 'L5 Supervisor',
    department: 'Piping & Field Execution',
    employeeId: 'FL-SUP-1109',
    badgeNumber: 'FL-EXP-B12',
    avatarColor: '#10B981',
    level: 5,
    levelName: 'Level 5 — Field Execution Lead',
    reportsTo: 'L4 Discipline Engineer & L3 Lead Planner',
    supervises: 'Site Execution Crews, Welders & Subcontractors',
    responsibilities: 'Frontline voice/chat logging, Daily Progress Reports (DPR), site shift handover, actual quantity tracking',
    landingScreen: 'Time Agent & Data Ingestion Hub'
  },
  'L4 Discipline Engineer': {
    id: 'user-engineer',
    name: 'Vikram Patel',
    email: 'vikram.patel@fieldlink.io',
    role: 'L4 Discipline Engineer',
    department: 'Mechanical & Piping Engineering',
    employeeId: 'FL-ENG-3391',
    badgeNumber: 'FL-EXP-C04',
    avatarColor: '#F59E0B',
    level: 4,
    levelName: 'Level 4 — Field Discipline Engineer',
    reportsTo: 'L3 Lead Planner & L2 Project Controls Manager',
    supervises: 'Field Inspectors & Quality Control Technicians',
    responsibilities: 'Technical extraction verification, phrase-to-drawing linking, quantity & UOM validation, engineering endorsement',
    landingScreen: 'Extraction Workspace & Quality Hub'
  },
  'L3 Planner': {
    id: 'user-planner',
    name: 'Rajiv Sen',
    email: 'rajiv.sen@fieldlink.io',
    role: 'L3 Planner',
    department: 'Planning & Project Controls',
    employeeId: 'FL-PL-0482',
    badgeNumber: 'FL-EXP-A01',
    avatarColor: '#0EA5E9',
    level: 3,
    levelName: 'Level 3 — Lead Planning Engineer',
    reportsTo: 'L2 Project Controls Manager',
    supervises: 'L5 Supervisors & Planning Coordinators',
    responsibilities: '6-signal schedule linking, out-of-sequence safety gating, 1:N splitting, Level 5/6 activity mapping, schedule mutation approval',
    landingScreen: 'Schedule Linker & Planner Review Queue'
  },
  'L2 Project Manager': {
    id: 'user-pm',
    name: 'S. Banerjee',
    email: 's.banerjee@fieldlink.io',
    role: 'L2 Project Manager',
    department: 'Project Controls & Construction Directorate',
    employeeId: 'FL-PM-0077',
    badgeNumber: 'FL-EXP-HQ01',
    avatarColor: '#8B5CF6',
    level: 2,
    levelName: 'Level 2 — Project Controls Manager',
    reportsTo: 'L1 Executive Project Director',
    supervises: 'L3 Lead Planners & Discipline Engineering Leads',
    responsibilities: 'Earned value analysis, real-time cumulative S-curves, What-If delay ripple simulation, contractor claims, Oracle P6 sync authorization',
    landingScreen: 'Operations Overview & What-If Analytics'
  },
  'L1 Project Director': {
    id: 'user-director',
    name: 'Dr. Amitabh Roy',
    email: 'amitabh.roy@fieldlink.io',
    role: 'L1 Project Director',
    department: 'Executive Project Directorate (EPPM)',
    employeeId: 'FL-DIR-0001',
    badgeNumber: 'FL-EXP-EXEC01',
    avatarColor: '#EC4899',
    level: 1,
    levelName: 'Level 1 — Executive Project Director',
    reportsTo: 'Executive Board & Capital Investment Committee',
    supervises: 'All Project Managers (L2) & Section Heads',
    responsibilities: 'Executive portfolio health, macro milestone governance (L1/L2), institutional memory benchmarks, organizational learning sign-off',
    landingScreen: 'Executive Portfolio Cockpit & Project Memory'
  },
  // Backward compatibility aliases
  'Supervisor': {
    id: 'user-supervisor',
    name: 'Ramesh Sharma',
    email: 'ramesh.sharma@fieldlink.io',
    role: 'L5 Supervisor',
    department: 'Piping & Field Execution',
    employeeId: 'FL-SUP-1109',
    badgeNumber: 'FL-EXP-B12',
    avatarColor: '#10B981',
    level: 5,
    levelName: 'Level 5 — Field Execution Lead',
    reportsTo: 'L4 Discipline Engineer & L3 Lead Planner',
    supervises: 'Site Execution Crews, Welders & Subcontractors',
    responsibilities: 'Frontline voice/chat logging, Daily Progress Reports (DPR), site shift handover, actual quantity tracking',
    landingScreen: 'Time Agent & Data Ingestion Hub'
  },
  'Discipline Engineer': {
    id: 'user-engineer',
    name: 'Vikram Patel',
    email: 'vikram.patel@fieldlink.io',
    role: 'L4 Discipline Engineer',
    department: 'Mechanical & Piping Engineering',
    employeeId: 'FL-ENG-3391',
    badgeNumber: 'FL-EXP-C04',
    avatarColor: '#F59E0B',
    level: 4,
    levelName: 'Level 4 — Field Discipline Engineer',
    reportsTo: 'L3 Lead Planner & L2 Project Controls Manager',
    supervises: 'Field Inspectors & Quality Control Technicians',
    responsibilities: 'Technical extraction verification, phrase-to-drawing linking, quantity & UOM validation, engineering endorsement',
    landingScreen: 'Extraction Workspace & Quality Hub'
  },
  'Planner': {
    id: 'user-planner',
    name: 'Rajiv Sen',
    email: 'rajiv.sen@fieldlink.io',
    role: 'L3 Planner',
    department: 'Planning & Project Controls',
    employeeId: 'FL-PL-0482',
    badgeNumber: 'FL-EXP-A01',
    avatarColor: '#0EA5E9',
    level: 3,
    levelName: 'Level 3 — Lead Planning Engineer',
    reportsTo: 'L2 Project Controls Manager',
    supervises: 'L5 Supervisors & Planning Coordinators',
    responsibilities: '6-signal schedule linking, out-of-sequence safety gating, 1:N splitting, Level 5/6 activity mapping, schedule mutation approval',
    landingScreen: 'Schedule Linker & Planner Review Queue'
  },
  'Project Manager': {
    id: 'user-pm',
    name: 'S. Banerjee',
    email: 's.banerjee@fieldlink.io',
    role: 'L2 Project Manager',
    department: 'Project Controls & Construction Directorate',
    employeeId: 'FL-PM-0077',
    badgeNumber: 'FL-EXP-HQ01',
    avatarColor: '#8B5CF6',
    level: 2,
    levelName: 'Level 2 — Project Controls Manager',
    reportsTo: 'L1 Executive Project Director',
    supervises: 'L3 Lead Planners & Discipline Engineering Leads',
    responsibilities: 'Earned value analysis, real-time cumulative S-curves, What-If delay ripple simulation, contractor claims, Oracle P6 sync authorization',
    landingScreen: 'Operations Overview & What-If Analytics'
  }
};

// --- ENTITIES ---

export interface Project {
  id: string;
  name: string;
  client: string;
  location: string;
  status: 'Active' | 'Commissioning';
  startDate: string;        // ISO YYYY-MM-DD
  plannedFinishDate: string;// ISO YYYY-MM-DD
  dataDate: string;         // ISO YYYY-MM-DD (Status cutoff)
  timezone: string;
}

export interface ScheduleActivity {
  id: string;
  activityCode: string;
  parentWbs: string;
  level: number;            // 5 or 6
  discipline: Discipline;
  description: string;
  location: string;
  unit: string;
  plannedQuantity: number;
  actualQuantity: number;   // 0 initially, updated after planner approval
  remainingQuantity: number;// plannedQuantity - actualQuantity
  progressMethod: ProgressMethod;
  plannedStart: string;     // ISO YYYY-MM-DD
  plannedFinish: string;    // ISO YYYY-MM-DD
  actualStart?: string | null;
  actualFinish?: string | null;
  statusDate?: string | null;
  baselineDuration: number; // days
  actualDuration?: number | null; // elapsed days to data date
  durationVariance?: number | null; // actualDuration - baselineDuration
  predecessorIds: string[];
  status: 'Not Started' | 'In Progress' | 'Completed';
  percentComplete: number;  // 0 - 100
  syncStatus: 'synced' | 'pending_sync';
  isProposedScope?: boolean;
}

export interface FieldRecord {
  id: string;
  sourceType: SourceType;
  sourceName: string;
  submittedBy: string;
  discipline: Discipline;
  submittedAt: string;      // ISO Timestamp
  sourceDateText?: string;
  normalizedDate: string;   // ISO YYYY-MM-DD
  dateConfidence: number;   // 0 - 100
  rawText: string;
  extractedEventIds: string[];
  evidenceReference: string;
  processingStatus: ProcessingStatus;
  duplicateStatus: DuplicateStatus;
  duplicateGroupId?: string;
}

export interface ComponentScoreBreakdown {
  textSimilarity: number;     // 0 - 100 (Weight: 0.30)
  disciplineFit: number;      // 0 - 100 (Weight: 0.20)
  locationFit: number;        // 0 - 100 (Weight: 0.15)
  wbsFit: number;             // 0 - 100 (Weight: 0.15)
  dateConsistency: number;    // 0 - 100 (Weight: 0.10)
  terminologyMatch: number;   // 0 - 100 (Weight: 0.10)
}

export interface MatchCandidate {
  id: string;
  progressEventId: string;
  activityId: string;
  activityCode: string;
  description: string;
  discipline: Discipline;
  level: number;
  score: number;              // 0 - 100
  componentScores: ComponentScoreBreakdown;
  isLevel6PriorityApplied: boolean;
  scoreGapFromLeader?: number;
  isAmbiguous: boolean;
  matchedTerms: string[];
  mismatchReasons: string[];
  explanation: string;
}

export interface AllocationSplitItem {
  activityId: string;
  allocationPercent: number; // Sum to 100%
}

export interface ProgressEvent {
  id: string;
  fieldRecordId: string;
  activityDescription: string;
  candidateActivityId?: string | null;
  mappingType: MappingType;
  mappedActivityIds: string[];
  allocationBreakdown?: AllocationSplitItem[];
  actualStart?: string | null;
  actualFinish?: string | null;
  statusDate?: string | null;
  progressMethod: ProgressMethod;
  progressValue: number;      // 0 - 100
  progressUnit?: string;
  quantity?: number;
  impliedQuantity?: number;
  verificationStatus: VerificationStatus;
  location?: string;
  discipline: Discipline;
  manpower?: string;
  equipment?: string;
  delayCause?: string;
  confidenceScore: number;    // 0 - 100
  confidenceLevel: ConfidenceLevel;
  matchMethod: MatchMethod;
  validationStatus: ValidationStatus;
  outOfSequence: boolean;
  plannerJustification?: string;
  reviewerId?: string | null;
  reviewedAt?: string | null;
  evidenceSnippet: string;
  evidenceUri: string;
}

export interface AuditEntry {
  id: string;
  entityType: 'ProgressEvent' | 'ScheduleActivity' | 'FieldRecord';
  entityId: string;
  action: 'CREATE' | 'EXTRACT' | 'MATCH' | 'APPROVE' | 'REMAP' | 'SPLIT_1_TO_N' | 'SYNC' | 'PROPOSE_NEW';
  actor: string;
  timestamp: string;
  beforeValue: Record<string, any> | null;
  afterValue: Record<string, any>;
  reason: string;
  evidenceSnippet?: string;
  source: string;
}

export interface ProjectMemoryItem {
  id: string;
  type: MemoryType;
  title: string;
  summary: string;
  discipline: Discipline;
  tags: string[];
  sourceEventIds: string[];
  confidence: number;
  dateRange: string;
  metricValue?: string;
}

export interface DelayPattern {
  id: string;
  category: 'Equipment' | 'Permit' | 'Weather' | 'Material';
  cause: string;
  discipline: Discipline;
  occurrences: number;
  averageImpactDays: number;
  linkedEventIds: string[];
}

export interface AppSettings {
  currentRole: UserRole;
  privacyMode: boolean;
  dataDate: string;           // '2026-09-19'
  fastTrackThreshold: number; // 85
  reviewThreshold: number;    // 60
}

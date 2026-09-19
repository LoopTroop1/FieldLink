import { DatabaseSync } from 'node:sqlite';
import * as fs from 'node:fs';
import * as path from 'node:path';

import { INITIAL_PROJECT, INITIAL_SCHEDULE_ACTIVITIES } from '../src/data/baselineSchedule.js';
import { INITIAL_FIELD_RECORDS } from '../src/data/syntheticInputs.js';
import {
  INITIAL_PROGRESS_EVENTS,
  INITIAL_AUDIT_TRAIL,
  INITIAL_PROJECT_MEMORY,
  INITIAL_DELAY_PATTERNS
} from '../src/data/delayPatterns.js';

import {
  Project,
  ScheduleActivity,
  FieldRecord,
  ProgressEvent,
  AuditEntry,
  ProjectMemoryItem,
  DelayPattern,
  AppSettings
} from '../src/types/index.js';

// Ensure data directory exists
const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const DB_PATH = path.join(DATA_DIR, 'oil_india_baghewala.db');

export class LocalDatabase {
  private db: DatabaseSync;

  constructor() {
    this.db = new DatabaseSync(DB_PATH);
    this.initSchema();
    this.seedBaselineIfEmpty();
  }

  /**
   * Initializes all relational SQLite tables with strict constraints
   */
  private initSchema() {
    this.db.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        client TEXT NOT NULL,
        location TEXT NOT NULL,
        data_date TEXT NOT NULL,
        baseline_start TEXT NOT NULL,
        baseline_finish TEXT NOT NULL,
        meta_json TEXT
      );

      CREATE TABLE IF NOT EXISTS schedule_activities (
        id TEXT PRIMARY KEY,
        activity_code TEXT UNIQUE NOT NULL,
        parent_wbs TEXT NOT NULL,
        level INTEGER NOT NULL,
        discipline TEXT NOT NULL,
        description TEXT NOT NULL,
        location TEXT NOT NULL,
        unit TEXT NOT NULL,
        planned_quantity REAL NOT NULL,
        actual_quantity REAL NOT NULL,
        remaining_quantity REAL NOT NULL,
        progress_method TEXT NOT NULL,
        planned_start TEXT NOT NULL,
        planned_finish TEXT NOT NULL,
        actual_start TEXT,
        actual_finish TEXT,
        baseline_duration REAL NOT NULL,
        actual_duration REAL,
        duration_variance REAL NOT NULL,
        predecessor_ids TEXT NOT NULL,
        status TEXT NOT NULL,
        percent_complete REAL NOT NULL,
        sync_status TEXT NOT NULL,
        is_proposed_scope INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS field_records (
        id TEXT PRIMARY KEY,
        source_type TEXT NOT NULL,
        source_name TEXT NOT NULL,
        submitted_by TEXT NOT NULL,
        discipline TEXT NOT NULL,
        submitted_at TEXT NOT NULL,
        source_date_text TEXT,
        normalized_date TEXT NOT NULL,
        date_confidence REAL NOT NULL,
        raw_text TEXT NOT NULL,
        evidence_reference TEXT NOT NULL,
        processing_status TEXT NOT NULL,
        duplicate_status TEXT NOT NULL,
        duplicate_group_id TEXT
      );

      CREATE TABLE IF NOT EXISTS progress_events (
        id TEXT PRIMARY KEY,
        field_record_id TEXT NOT NULL,
        activity_description TEXT NOT NULL,
        candidate_activity_id TEXT,
        mapping_type TEXT NOT NULL,
        mapped_activity_ids TEXT NOT NULL,
        allocation_breakdown TEXT,
        actual_start TEXT,
        actual_finish TEXT,
        status_date TEXT,
        progress_method TEXT NOT NULL,
        progress_value REAL NOT NULL,
        progress_unit TEXT,
        quantity REAL,
        implied_quantity REAL,
        verification_status TEXT NOT NULL,
        location TEXT,
        discipline TEXT NOT NULL,
        manpower TEXT,
        equipment TEXT,
        delay_cause TEXT,
        confidence_score REAL NOT NULL,
        confidence_level TEXT NOT NULL,
        match_method TEXT NOT NULL,
        validation_status TEXT NOT NULL,
        out_of_sequence INTEGER DEFAULT 0,
        planner_justification TEXT,
        reviewer_id TEXT,
        reviewed_at TEXT,
        evidence_snippet TEXT NOT NULL,
        evidence_uri TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS audit_trail (
        id TEXT PRIMARY KEY,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        action TEXT NOT NULL,
        actor TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        before_value TEXT,
        after_value TEXT NOT NULL,
        reason TEXT NOT NULL,
        evidence_snippet TEXT,
        source TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS project_memory (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        summary TEXT NOT NULL,
        discipline TEXT NOT NULL,
        tags TEXT NOT NULL,
        source_event_ids TEXT NOT NULL,
        confidence REAL NOT NULL,
        date_range TEXT NOT NULL,
        metric_value TEXT
      );

      CREATE TABLE IF NOT EXISTS delay_patterns (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        cause TEXT NOT NULL,
        discipline TEXT NOT NULL,
        occurrences INTEGER NOT NULL,
        average_impact_days REAL NOT NULL,
        linked_event_ids TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS app_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_events_field_record ON progress_events(field_record_id);
      CREATE INDEX IF NOT EXISTS idx_events_candidate_act ON progress_events(candidate_activity_id);
      CREATE INDEX IF NOT EXISTS idx_activities_discipline ON schedule_activities(discipline);
      CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_trail(entity_id);
    `);
  }

  /**
   * Seeds baseline data if SQLite tables are empty
   */
  public seedBaselineIfEmpty() {
    const actCountRow: any = this.db.prepare('SELECT COUNT(*) as count FROM schedule_activities').get();
    if (actCountRow && actCountRow.count > 0) {
      return; // Already seeded
    }
    this.resetToBaseline();
  }

  /**
   * Full atomic database wipe and pristine re-seed in <50ms
   */
  public resetToBaseline() {
    this.db.exec('BEGIN TRANSACTION;');
    try {
      this.db.exec(`
        DELETE FROM projects;
        DELETE FROM schedule_activities;
        DELETE FROM field_records;
        DELETE FROM progress_events;
        DELETE FROM audit_trail;
        DELETE FROM project_memory;
        DELETE FROM delay_patterns;
        DELETE FROM app_settings;
      `);

      // 1. Insert Project
      const insertProj = this.db.prepare(`
        INSERT INTO projects (id, name, client, location, data_date, baseline_start, baseline_finish, meta_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insertProj.run(
        INITIAL_PROJECT.id,
        INITIAL_PROJECT.name,
        INITIAL_PROJECT.client,
        INITIAL_PROJECT.location,
        INITIAL_PROJECT.dataDate,
        INITIAL_PROJECT.startDate || '2026-08-01',
        INITIAL_PROJECT.plannedFinishDate || '2027-04-30',
        JSON.stringify(INITIAL_PROJECT)
      );

      // 2. Insert Activities
      const insertAct = this.db.prepare(`
        INSERT INTO schedule_activities (
          id, activity_code, parent_wbs, level, discipline, description, location, unit,
          planned_quantity, actual_quantity, remaining_quantity, progress_method,
          planned_start, planned_finish, actual_start, actual_finish,
          baseline_duration, actual_duration, duration_variance, predecessor_ids,
          status, percent_complete, sync_status, is_proposed_scope
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const a of INITIAL_SCHEDULE_ACTIVITIES) {
        insertAct.run(
          a.id,
          a.activityCode,
          a.parentWbs,
          a.level,
          a.discipline,
          a.description,
          a.location,
          a.unit,
          a.plannedQuantity,
          a.actualQuantity,
          a.remainingQuantity,
          a.progressMethod,
          a.plannedStart,
          a.plannedFinish,
          a.actualStart,
          a.actualFinish,
          a.baselineDuration,
          a.actualDuration,
          a.durationVariance,
          JSON.stringify(a.predecessorIds || []),
          a.status,
          a.percentComplete,
          a.syncStatus,
          a.isProposedScope ? 1 : 0
        );
      }

      // 3. Insert Field Records
      const insertRec = this.db.prepare(`
        INSERT INTO field_records (
          id, source_type, source_name, submitted_by, discipline, submitted_at,
          source_date_text, normalized_date, date_confidence, raw_text,
          evidence_reference, processing_status, duplicate_status, duplicate_group_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const r of INITIAL_FIELD_RECORDS) {
        insertRec.run(
          r.id,
          r.sourceType,
          r.sourceName,
          r.submittedBy,
          r.discipline,
          r.submittedAt,
          r.sourceDateText || null,
          r.normalizedDate,
          r.dateConfidence,
          r.rawText,
          r.evidenceReference,
          r.processingStatus,
          r.duplicateStatus,
          r.duplicateGroupId || null
        );
      }

      // 4. Insert Progress Events
      const insertEv = this.db.prepare(`
        INSERT INTO progress_events (
          id, field_record_id, activity_description, candidate_activity_id, mapping_type,
          mapped_activity_ids, allocation_breakdown, actual_start, actual_finish, status_date,
          progress_method, progress_value, progress_unit, quantity, implied_quantity,
          verification_status, location, discipline, manpower, equipment, delay_cause,
          confidence_score, confidence_level, match_method, validation_status, out_of_sequence,
          planner_justification, reviewer_id, reviewed_at, evidence_snippet, evidence_uri
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const e of INITIAL_PROGRESS_EVENTS) {
        insertEv.run(
          e.id,
          e.fieldRecordId,
          e.activityDescription,
          e.candidateActivityId || null,
          e.mappingType,
          JSON.stringify(e.mappedActivityIds || []),
          e.allocationBreakdown ? JSON.stringify(e.allocationBreakdown) : null,
          e.actualStart,
          e.actualFinish,
          e.statusDate,
          e.progressMethod,
          e.progressValue,
          e.progressUnit || null,
          e.quantity !== undefined ? e.quantity : null,
          e.impliedQuantity !== undefined ? e.impliedQuantity : null,
          e.verificationStatus,
          e.location || null,
          e.discipline,
          e.manpower || null,
          e.equipment || null,
          e.delayCause || null,
          e.confidenceScore,
          e.confidenceLevel,
          e.matchMethod,
          e.validationStatus,
          e.outOfSequence ? 1 : 0,
          e.plannerJustification || null,
          e.reviewerId || null,
          e.reviewedAt || null,
          e.evidenceSnippet,
          e.evidenceUri
        );
      }

      // 5. Insert Audit Trail
      const insertAud = this.db.prepare(`
        INSERT INTO audit_trail (
          id, entity_type, entity_id, action, actor, timestamp,
          before_value, after_value, reason, evidence_snippet, source
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const a of INITIAL_AUDIT_TRAIL) {
        insertAud.run(
          a.id,
          a.entityType,
          a.entityId,
          a.action,
          a.actor,
          a.timestamp,
          a.beforeValue ? JSON.stringify(a.beforeValue) : null,
          JSON.stringify(a.afterValue),
          a.reason,
          a.evidenceSnippet || null,
          a.source
        );
      }

      // 6. Insert Memory Items
      const insertMem = this.db.prepare(`
        INSERT INTO project_memory (
          id, type, title, summary, discipline, tags,
          source_event_ids, confidence, date_range, metric_value
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const m of INITIAL_PROJECT_MEMORY) {
        insertMem.run(
          m.id,
          m.type,
          m.title,
          m.summary,
          m.discipline,
          JSON.stringify(m.tags || []),
          JSON.stringify(m.sourceEventIds || []),
          m.confidence,
          m.dateRange,
          m.metricValue || null
        );
      }

      // 7. Insert Delay Patterns
      const insertDel = this.db.prepare(`
        INSERT INTO delay_patterns (
          id, category, cause, discipline, occurrences, average_impact_days, linked_event_ids
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      for (const d of INITIAL_DELAY_PATTERNS) {
        insertDel.run(
          d.id,
          d.category,
          d.cause,
          d.discipline,
          d.occurrences,
          d.averageImpactDays,
          JSON.stringify(d.linkedEventIds || [])
        );
      }

      // 8. Insert Default Settings
      const defaultSettings: AppSettings = {
        currentRole: 'Planner',
        privacyMode: false,
        dataDate: '2026-09-19',
        fastTrackThreshold: 85,
        reviewThreshold: 60
      };
      const insertSet = this.db.prepare(`INSERT INTO app_settings (key, value) VALUES (?, ?)`);
      insertSet.run('settings', JSON.stringify(defaultSettings));

      this.db.exec('COMMIT;');
    } catch (err) {
      this.db.exec('ROLLBACK;');
      throw err;
    }
  }

  // --- QUERIES ---

  public getProject(): Project {
    const row: any = this.db.prepare('SELECT * FROM projects LIMIT 1').get();
    if (!row) return INITIAL_PROJECT;
    return {
      id: row.id,
      name: row.name,
      client: row.client,
      location: row.location,
      dataDate: row.data_date,
      startDate: row.baseline_start,
      plannedFinishDate: row.baseline_finish,
      status: 'Active',
      timezone: 'Asia/Kolkata'
    };
  }

  public getActivities(): ScheduleActivity[] {
    const rows: any[] = this.db.prepare('SELECT * FROM schedule_activities ORDER BY activity_code ASC').all();
    return rows.map(r => ({
      id: r.id,
      activityCode: r.activity_code,
      parentWbs: r.parent_wbs,
      level: r.level,
      discipline: r.discipline,
      description: r.description,
      location: r.location,
      unit: r.unit,
      plannedQuantity: r.planned_quantity,
      actualQuantity: r.actual_quantity,
      remainingQuantity: r.remaining_quantity,
      progressMethod: r.progress_method,
      plannedStart: r.planned_start,
      plannedFinish: r.planned_finish,
      actualStart: r.actual_start,
      actualFinish: r.actual_finish,
      baselineDuration: r.baseline_duration,
      actualDuration: r.actual_duration,
      durationVariance: r.duration_variance,
      predecessorIds: JSON.parse(r.predecessor_ids || '[]'),
      status: r.status,
      percentComplete: r.percent_complete,
      syncStatus: r.sync_status,
      isProposedScope: Boolean(r.is_proposed_scope)
    }));
  }

  public updateActivity(id: string, updates: Partial<ScheduleActivity>): ScheduleActivity | null {
    const row: any = this.db.prepare('SELECT * FROM schedule_activities WHERE id = ?').get(id);
    if (!row) return null;

    const existing: ScheduleActivity = {
      id: row.id,
      activityCode: row.activity_code,
      parentWbs: row.parent_wbs,
      level: row.level,
      discipline: row.discipline,
      description: row.description,
      location: row.location,
      unit: row.unit,
      plannedQuantity: row.planned_quantity,
      actualQuantity: row.actual_quantity,
      remainingQuantity: row.remaining_quantity,
      progressMethod: row.progress_method,
      plannedStart: row.planned_start,
      plannedFinish: row.planned_finish,
      actualStart: row.actual_start,
      actualFinish: row.actual_finish,
      baselineDuration: row.baseline_duration,
      actualDuration: row.actual_duration,
      durationVariance: row.duration_variance,
      predecessorIds: JSON.parse(row.predecessor_ids || '[]'),
      status: row.status,
      percentComplete: row.percent_complete,
      syncStatus: row.sync_status,
      isProposedScope: Boolean(row.is_proposed_scope)
    };

    const merged = { ...existing, ...updates };
    const stmt = this.db.prepare(`
      UPDATE schedule_activities SET
        actual_quantity = ?,
        remaining_quantity = ?,
        actual_start = ?,
        actual_finish = ?,
        actual_duration = ?,
        duration_variance = ?,
        status = ?,
        percent_complete = ?,
        sync_status = ?,
        is_proposed_scope = ?
      WHERE id = ?
    `);

    stmt.run(
      merged.actualQuantity,
      merged.remainingQuantity,
      merged.actualStart,
      merged.actualFinish,
      merged.actualDuration,
      merged.durationVariance,
      merged.status,
      merged.percentComplete,
      merged.syncStatus,
      merged.isProposedScope ? 1 : 0,
      id
    );

    return merged;
  }

  public getFieldRecords(): FieldRecord[] {
    const rows: any[] = this.db.prepare('SELECT * FROM field_records ORDER BY submitted_at DESC').all();
    return rows.map(r => ({
      id: r.id,
      sourceType: r.source_type,
      sourceName: r.source_name,
      submittedBy: r.submitted_by,
      discipline: r.discipline,
      submittedAt: r.submitted_at,
      sourceDateText: r.source_date_text,
      normalizedDate: r.normalized_date,
      dateConfidence: r.date_confidence,
      rawText: r.raw_text,
      extractedEventIds: [],
      evidenceReference: r.evidence_reference,
      processingStatus: r.processing_status,
      duplicateStatus: r.duplicate_status,
      duplicateGroupId: r.duplicate_group_id
    }));
  }

  public createFieldRecord(record: FieldRecord): FieldRecord {
    const stmt = this.db.prepare(`
      INSERT INTO field_records (
        id, source_type, source_name, submitted_by, discipline, submitted_at,
        source_date_text, normalized_date, date_confidence, raw_text,
        evidence_reference, processing_status, duplicate_status, duplicate_group_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      record.id,
      record.sourceType,
      record.sourceName,
      record.submittedBy,
      record.discipline,
      record.submittedAt,
      record.sourceDateText || null,
      record.normalizedDate,
      record.dateConfidence,
      record.rawText,
      record.evidenceReference,
      record.processingStatus,
      record.duplicateStatus,
      record.duplicateGroupId || null
    );

    return record;
  }

  public getProgressEvents(): ProgressEvent[] {
    const rows: any[] = this.db.prepare('SELECT * FROM progress_events').all();
    return rows.map(r => ({
      id: r.id,
      fieldRecordId: r.field_record_id,
      activityDescription: r.activity_description,
      candidateActivityId: r.candidate_activity_id,
      mappingType: r.mapping_type,
      mappedActivityIds: JSON.parse(r.mapped_activity_ids || '[]'),
      allocationBreakdown: r.allocation_breakdown ? JSON.parse(r.allocation_breakdown) : undefined,
      actualStart: r.actual_start,
      actualFinish: r.actual_finish,
      statusDate: r.status_date,
      progressMethod: r.progress_method,
      progressValue: r.progress_value,
      progressUnit: r.progress_unit,
      quantity: r.quantity !== null ? r.quantity : undefined,
      impliedQuantity: r.implied_quantity !== null ? r.implied_quantity : undefined,
      verificationStatus: r.verification_status,
      location: r.location,
      discipline: r.discipline,
      manpower: r.manpower,
      equipment: r.equipment,
      delayCause: r.delay_cause,
      confidenceScore: r.confidence_score,
      confidenceLevel: r.confidence_level,
      matchMethod: r.match_method,
      validationStatus: r.validation_status,
      outOfSequence: Boolean(r.out_of_sequence),
      plannerJustification: r.planner_justification,
      reviewerId: r.reviewer_id,
      reviewedAt: r.reviewed_at,
      evidenceSnippet: r.evidence_snippet,
      evidenceUri: r.evidence_uri
    }));
  }

  public createProgressEvent(ev: ProgressEvent): ProgressEvent {
    const stmt = this.db.prepare(`
      INSERT INTO progress_events (
        id, field_record_id, activity_description, candidate_activity_id, mapping_type,
        mapped_activity_ids, allocation_breakdown, actual_start, actual_finish, status_date,
        progress_method, progress_value, progress_unit, quantity, implied_quantity,
        verification_status, location, discipline, manpower, equipment, delay_cause,
        confidence_score, confidence_level, match_method, validation_status, out_of_sequence,
        planner_justification, reviewer_id, reviewed_at, evidence_snippet, evidence_uri
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      ev.id,
      ev.fieldRecordId,
      ev.activityDescription,
      ev.candidateActivityId || null,
      ev.mappingType,
      JSON.stringify(ev.mappedActivityIds || []),
      ev.allocationBreakdown ? JSON.stringify(ev.allocationBreakdown) : null,
      ev.actualStart,
      ev.actualFinish,
      ev.statusDate,
      ev.progressMethod,
      ev.progressValue,
      ev.progressUnit || null,
      ev.quantity !== undefined ? ev.quantity : null,
      ev.impliedQuantity !== undefined ? ev.impliedQuantity : null,
      ev.verificationStatus,
      ev.location || null,
      ev.discipline,
      ev.manpower || null,
      ev.equipment || null,
      ev.delayCause || null,
      ev.confidenceScore,
      ev.confidenceLevel,
      ev.matchMethod,
      ev.validationStatus,
      ev.outOfSequence ? 1 : 0,
      ev.plannerJustification || null,
      ev.reviewerId || null,
      ev.reviewedAt || null,
      ev.evidenceSnippet,
      ev.evidenceUri
    );

    return ev;
  }

  public updateProgressEvent(id: string, updates: Partial<ProgressEvent>): ProgressEvent | null {
    const row: any = this.db.prepare('SELECT * FROM progress_events WHERE id = ?').get(id);
    if (!row) return null;

    const existing: ProgressEvent = {
      id: row.id,
      fieldRecordId: row.field_record_id,
      activityDescription: row.activity_description,
      candidateActivityId: row.candidate_activity_id,
      mappingType: row.mapping_type,
      mappedActivityIds: JSON.parse(row.mapped_activity_ids || '[]'),
      allocationBreakdown: row.allocation_breakdown ? JSON.parse(row.allocation_breakdown) : undefined,
      actualStart: row.actual_start,
      actualFinish: row.actual_finish,
      statusDate: row.status_date,
      progressMethod: row.progress_method,
      progressValue: row.progress_value,
      progressUnit: row.progress_unit,
      quantity: row.quantity !== null ? row.quantity : undefined,
      impliedQuantity: row.implied_quantity !== null ? row.implied_quantity : undefined,
      verificationStatus: row.verification_status,
      location: row.location,
      discipline: row.discipline,
      manpower: row.manpower,
      equipment: row.equipment,
      delayCause: row.delay_cause,
      confidenceScore: row.confidence_score,
      confidenceLevel: row.confidence_level,
      matchMethod: row.match_method,
      validationStatus: row.validation_status,
      outOfSequence: Boolean(row.out_of_sequence),
      plannerJustification: row.planner_justification,
      reviewerId: row.reviewer_id,
      reviewedAt: row.reviewed_at,
      evidenceSnippet: row.evidence_snippet,
      evidenceUri: row.evidence_uri
    };

    const merged = { ...existing, ...updates };
    const stmt = this.db.prepare(`
      UPDATE progress_events SET
        candidate_activity_id = ?,
        mapped_activity_ids = ?,
        mapping_type = ?,
        validation_status = ?,
        verification_status = ?,
        planner_justification = ?,
        reviewer_id = ?,
        reviewed_at = ?
      WHERE id = ?
    `);

    stmt.run(
      merged.candidateActivityId || null,
      JSON.stringify(merged.mappedActivityIds || []),
      merged.mappingType,
      merged.validationStatus,
      merged.verificationStatus,
      merged.plannerJustification || null,
      merged.reviewerId || null,
      merged.reviewedAt || null,
      id
    );

    return merged;
  }

  public getAuditTrail(): AuditEntry[] {
    const rows: any[] = this.db.prepare('SELECT * FROM audit_trail ORDER BY timestamp DESC').all();
    return rows.map(r => ({
      id: r.id,
      entityType: r.entity_type,
      entityId: r.entity_id,
      action: r.action,
      actor: r.actor,
      timestamp: r.timestamp,
      beforeValue: r.before_value ? JSON.parse(r.before_value) : null,
      afterValue: JSON.parse(r.after_value),
      reason: r.reason,
      evidenceSnippet: r.evidence_snippet,
      source: r.source
    }));
  }

  public addAuditEntry(entry: AuditEntry): AuditEntry {
    const stmt = this.db.prepare(`
      INSERT INTO audit_trail (
        id, entity_type, entity_id, action, actor, timestamp,
        before_value, after_value, reason, evidence_snippet, source
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      entry.id,
      entry.entityType,
      entry.entityId,
      entry.action,
      entry.actor,
      entry.timestamp,
      entry.beforeValue ? JSON.stringify(entry.beforeValue) : null,
      JSON.stringify(entry.afterValue),
      entry.reason,
      entry.evidenceSnippet || null,
      entry.source
    );

    return entry;
  }

  public getProjectMemory(): ProjectMemoryItem[] {
    const rows: any[] = this.db.prepare('SELECT * FROM project_memory').all();
    return rows.map(r => ({
      id: r.id,
      type: r.type,
      title: r.title,
      summary: r.summary,
      discipline: r.discipline,
      tags: JSON.parse(r.tags || '[]'),
      sourceEventIds: JSON.parse(r.source_event_ids || '[]'),
      confidence: r.confidence,
      dateRange: r.date_range,
      metricValue: r.metric_value
    }));
  }

  public addProjectMemory(item: ProjectMemoryItem): ProjectMemoryItem {
    const stmt = this.db.prepare(`
      INSERT INTO project_memory (
        id, type, title, summary, discipline, tags,
        source_event_ids, confidence, date_range, metric_value
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      item.id,
      item.type,
      item.title,
      item.summary,
      item.discipline,
      JSON.stringify(item.tags || []),
      JSON.stringify(item.sourceEventIds || []),
      item.confidence,
      item.dateRange,
      item.metricValue || null
    );

    return item;
  }

  public getDelayPatterns(): DelayPattern[] {
    const rows: any[] = this.db.prepare('SELECT * FROM delay_patterns').all();
    return rows.map(r => ({
      id: r.id,
      category: r.category,
      cause: r.cause,
      discipline: r.discipline,
      occurrences: r.occurrences,
      averageImpactDays: r.average_impact_days,
      linkedEventIds: JSON.parse(r.linked_event_ids || '[]')
    }));
  }

  public getSettings(): AppSettings {
    const row: any = this.db.prepare("SELECT value FROM app_settings WHERE key = 'settings'").get();
    if (!row) {
      return {
        currentRole: 'Planner',
        privacyMode: false,
        dataDate: '2026-09-19',
        fastTrackThreshold: 85,
        reviewThreshold: 60
      };
    }
    return JSON.parse(row.value);
  }

  public updateSettings(settings: Partial<AppSettings>): AppSettings {
    const current = this.getSettings();
    const merged = { ...current, ...settings };
    this.db.prepare("INSERT OR REPLACE INTO app_settings (key, value) VALUES ('settings', ?)").run(JSON.stringify(merged));
    return merged;
  }

  public getDatabaseStats() {
    let sizeKb = 0;
    try {
      const stat = fs.statSync(DB_PATH);
      sizeKb = Math.round(stat.size / 1024);
    } catch {}

    const count = (tbl: string) => {
      const res: any = this.db.prepare(`SELECT COUNT(*) as c FROM ${tbl}`).get();
      return res ? res.c : 0;
    };

    return {
      status: 'healthy',
      engine: 'Node 24 Native SQLite (node:sqlite)',
      databasePath: DB_PATH,
      databaseSizeBytes: sizeKb * 1024,
      databaseSizeKb: sizeKb,
      tables: {
        projects: count('projects'),
        scheduleActivities: count('schedule_activities'),
        fieldRecords: count('field_records'),
        progressEvents: count('progress_events'),
        auditTrail: count('audit_trail'),
        projectMemory: count('project_memory'),
        delayPatterns: count('delay_patterns')
      }
    };
  }
}

export const localDb = new LocalDatabase();

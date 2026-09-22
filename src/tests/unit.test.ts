/**
 * COMPREHENSIVE SERVICE LAYER UNIT TEST SUITE
 * Field Pulse Platform — Capital Projects Schedule Linking System
 * Covers: Happy path, edge cases, error paths, and boundary values across all core services
 */

import { ConfidenceService } from '../services/confidenceService';
import { NormalizationService } from '../services/normalizationService';
import { DuplicateService } from '../services/duplicateService';
import { ExtractionService } from '../services/extractionService';
import { ApprovalService } from '../services/approvalService';
import { AnalyticsService } from '../services/analyticsService';
import { MockP6Adapter } from '../services/mockP6Adapter';

import { ScheduleActivity, ProgressEvent, FieldRecord, AllocationSplitItem } from '../types';

declare const process: any;

let passed = 0;
let failed = 0;

function assert(condition: boolean, testId: string, description: string) {
  if (condition) {
    console.log(`  \x1b[32m✔ PASS\x1b[0m [${testId}] ${description}`);
    passed++;
  } else {
    console.error(`  \x1b[31m✘ FAIL\x1b[0m [${testId}] ${description}`);
    failed++;
  }
}

export async function runUnitTests() {
  console.log('\n========================================================================');
  console.log('FIELD_PULSE PLATFORM — SERVICE LAYER UNIT & BOUNDARY TEST SUITE');
  console.log('Testing: Confidence, Normalization, Extraction, Approval, Analytics, P6');
  console.log('========================================================================\n');

  // ========================================================================
  // SUITE 1: CONFIDENCE SERVICE BOUNDARY VALUES & GATING
  // ========================================================================
  console.log('--- SUITE 1: ConfidenceService Boundaries & Gating ---');

  // Boundary 1: < 55 is UNMATCHED
  assert(
    ConfidenceService.classify(54.9) === 'UNMATCHED',
    'UT-CNF-01',
    'Score 54.9 boundary returns UNMATCHED'
  );

  // Boundary 2: Exactly 55.0 is LOW
  assert(
    ConfidenceService.classify(55.0) === 'LOW',
    'UT-CNF-02',
    'Score 55.0 boundary returns LOW'
  );

  // Boundary 3: 59.9 is LOW, 60.0 is MEDIUM
  assert(
    ConfidenceService.classify(59.9) === 'LOW' && ConfidenceService.classify(60.0) === 'MEDIUM',
    'UT-CNF-03',
    'Score 59.9/60.0 boundary cleanly transitions from LOW to MEDIUM'
  );

  // Boundary 4: 84.9 is MEDIUM, 85.0 is HIGH
  assert(
    ConfidenceService.classify(84.9) === 'MEDIUM' && ConfidenceService.classify(85.0) === 'HIGH',
    'UT-CNF-04',
    'Score 84.9/85.0 boundary cleanly transitions from MEDIUM to HIGH'
  );

  // Ambiguity override: Score 95% with isAmbiguous=true must downgrade to MEDIUM
  assert(
    ConfidenceService.classify(95.0, true) === 'MEDIUM',
    'UT-CNF-05',
    'Score 95.0% with isAmbiguous=true forces downgrade to MEDIUM'
  );

  // Fast-track eligibility boundary: Score 85% without ambiguity is eligible, with ambiguity is ineligible
  assert(
    ConfidenceService.isFastTrackEligible(85.0, false) === true &&
    ConfidenceService.isFastTrackEligible(85.0, true) === false &&
    ConfidenceService.isFastTrackEligible(84.9, false) === false,
    'UT-CNF-06',
    'Fast-track eligibility strictly requires score >= 85 AND isAmbiguous === false'
  );

  // Badge metadata generation
  const badgeHigh = ConfidenceService.getBadgeMeta('HIGH', 92);
  const badgeAmbiguous = ConfidenceService.getBadgeMeta('HIGH', 92, true);
  assert(
    badgeHigh.variant === 'success' && badgeAmbiguous.variant === 'warning' && badgeAmbiguous.label.includes('Ambiguous'),
    'UT-CNF-07',
    'Badge metadata properly renders warning variant when ambiguity flag is set'
  );

  // ========================================================================
  // SUITE 2: NORMALIZATION SERVICE DATES, DISCIPLINES & LOCATIONS
  // ========================================================================
  console.log('\n--- SUITE 2: NormalizationService Date & Discipline Robustness ---');

  // ISO Format normalization
  const isoRes = NormalizationService.normalizeDate('2026-09-12');
  assert(
    isoRes.date === '2026-09-12' && isoRes.confidence === 100 && !isoRes.isAmbiguous,
    'UT-NRM-01',
    'Standard ISO date 2026-09-12 parses with 100% confidence'
  );

  // Ambiguous DMY vs MDY boundary: 05/06/2026 (both day and month <= 12)
  const ambigDateRes = NormalizationService.normalizeDate('05/06/2026');
  assert(
    ambigDateRes.date === '2026-06-05' && ambigDateRes.isAmbiguous === true && ambigDateRes.confidence === 82.0,
    'UT-NRM-02',
    'Ambiguous date 05/06/2026 flags isAmbiguous=true and reduces confidence to 82%'
  );

  // Unambiguous DMY: 25/09/2026 (day > 12)
  const unambigDateRes = NormalizationService.normalizeDate('25/09/2026');
  assert(
    unambigDateRes.date === '2026-09-25' && unambigDateRes.isAmbiguous === false && unambigDateRes.confidence === 96.0,
    'UT-NRM-03',
    'Unambiguous date 25/09/2026 confirms day > 12 with 96% confidence'
  );

  // Named month: 14-Sep-2026
  const namedDateRes = NormalizationService.normalizeDate('14-Sep-2026');
  assert(
    namedDateRes.date === '2026-09-14' && namedDateRes.confidence === 99.0,
    'UT-NRM-04',
    'Named month string 14-Sep-2026 resolves to 2026-09-14 with 99% confidence'
  );

  // Unparseable garbage fallback
  const fallbackDateRes = NormalizationService.normalizeDate('unstructured weather report text without date');
  assert(
    fallbackDateRes.date === '2026-09-12' && fallbackDateRes.confidence === 50.0 && fallbackDateRes.isAmbiguous === true,
    'UT-NRM-05',
    'Unparseable date input safely degrades to project cutoff fallback'
  );

  // Discipline detection across all 7 disciplines
  const discPiping = NormalizationService.detectDiscipline('Welding 24-inch spool in pipe rack');
  const discElectrical = NormalizationService.detectDiscipline('Cable pull completed in substation');
  const discRotating = NormalizationService.detectDiscipline('Main booster pump alignment completed');
  const discStatic = NormalizationService.detectDiscipline('Separator vessel nozzle orientation check');
  const discInst = NormalizationService.detectDiscipline('Impulse tubing installed for pressure sensing');
  const discHse = NormalizationService.detectDiscipline('Safety scaffold inspection for PTW clearance');
  const discCivil = NormalizationService.detectDiscipline('Foundation excavation concrete pouring');
  assert(
    discPiping === 'PIPING' &&
    discElectrical === 'ELECTRICAL' &&
    discRotating === 'ROTATING_EQUIP' &&
    discStatic === 'STATIC_EQUIP' &&
    discInst === 'INSTRUMENTATION' &&
    discHse === 'HSE' &&
    discCivil === 'CIVIL',
    'UT-NRM-06',
    'Classifies keywords into all 7 canonical engineering disciplines'
  );

  // Location normalization
  const locNorm = NormalizationService.normalizeLocation('North Rack Zone B');
  const locFallback = NormalizationService.normalizeLocation('');
  assert(
    locNorm === 'North Pipe Rack - Bay 3 to 7' && locFallback === 'General Plant Area',
    'UT-NRM-07',
    'Resolves fuzzy location to canonical facility zone and defaults safely on empty string'
  );

  // ========================================================================
  // SUITE 3: EXTRACTION SERVICE SPAN LINKING & QUANTITY PARSING
  // ========================================================================
  console.log('\n--- SUITE 3: ExtractionService Physical Quantities & Spans ---');

  // Test composite X of Y joints pattern
  const dummyRecord1: FieldRecord = {
    id: 'rec-test-01',
    sourceType: 'report',
    sourceName: 'Daily_Piping_Log.txt',
    submittedBy: 'Field Supervisor',
    discipline: 'PIPING',
    submittedAt: '2026-09-12T18:00:00Z',
    normalizedDate: '2026-09-12',
    dateConfidence: 100,
    rawText: 'Erected spool line 24-XX in north pipe rack. 18 of 24 joints completed today.',
    evidenceReference: '/evidence/dpr.txt',
    processingStatus: 'ready_for_extraction',
    duplicateStatus: 'unique',
    extractedEventIds: []
  };

  const ext1 = ExtractionService.extractEvents(dummyRecord1);
  assert(
    ext1.events.length === 1 &&
    ext1.events[0].quantity === 18 &&
    ext1.events[0].progressValue === 75.0 &&
    ext1.spans.some(s => s.fieldKey === 'quantity' && s.snippet.includes('18 of 24 joints')),
    'UT-EXT-01',
    'Extracts quantity 18/24, calculates 75% progress, and produces exact character span'
  );

  // Test linear meter extraction pattern
  const dummyRecord2: FieldRecord = {
    ...dummyRecord1,
    id: 'rec-test-02',
    discipline: 'ELECTRICAL',
    rawText: 'Cable tray laid in substation corridor. Total 42 meters installed.'
  };
  const ext2 = ExtractionService.extractEvents(dummyRecord2);
  assert(
    ext2.events.length === 1 &&
    ext2.events[0].quantity === 42 &&
    ext2.events[0].progressUnit === 'meters',
    'UT-EXT-02',
    'Extracts linear distance quantity (42 meters) for electrical discipline'
  );

  // Test explicit percentage extraction
  const dummyRecord3: FieldRecord = {
    ...dummyRecord1,
    rawText: 'Booster pump baseplate grouting completed to 80% progress.'
  };
  const ext3 = ExtractionService.extractEvents(dummyRecord3);
  assert(
    ext3.events.length === 1 &&
    ext3.events[0].progressValue === 80 &&
    ext3.events[0].progressMethod === 'percentage-based',
    'UT-EXT-03',
    'Extracts explicit percentage progress (80%) when quantity unit is omitted'
  );

  // ========================================================================
  // SUITE 4: APPROVAL SERVICE SAFETY GATING & 1:N SPLIT INTEGRITY
  // ========================================================================
  console.log('\n--- SUITE 4: ApprovalService Safety Rules & 1:N Split Boundary ---');

  const baselineAct: ScheduleActivity = {
    id: 'act-test-01',
    activityCode: 'PIP-L6-024A',
    parentWbs: 'WBS-PIP-02',
    level: 6,
    discipline: 'PIPING',
    description: 'Line 24-XX Spool Welding',
    location: 'North Pipe Rack (Area 2)',
    unit: 'joints',
    plannedQuantity: 24,
    actualQuantity: 12,
    remainingQuantity: 12,
    progressMethod: 'quantity-based',
    plannedStart: '2026-09-01',
    plannedFinish: '2026-09-20',
    baselineDuration: 19,
    durationVariance: 0,
    predecessorIds: ['act-civ-01'],
    status: 'In Progress',
    percentComplete: 50,
    syncStatus: 'pending_sync'
  };

  const predecessorIncomplete: ScheduleActivity = {
    id: 'act-civ-01',
    activityCode: 'CIV-L5-01',
    parentWbs: 'WBS-CIV-01',
    level: 5,
    discipline: 'CIVIL',
    description: 'Foundation Curing',
    location: 'North Pipe Rack (Area 2)',
    unit: 'm³',
    plannedQuantity: 100,
    actualQuantity: 50,
    remainingQuantity: 50,
    progressMethod: 'quantity-based',
    plannedStart: '2026-08-15',
    plannedFinish: '2026-09-05',
    baselineDuration: 21,
    durationVariance: 0,
    predecessorIds: [],
    status: 'In Progress',
    percentComplete: 50, // Incomplete!
    syncStatus: 'synced'
  };

  const dummyEvent: ProgressEvent = {
    id: 'ev-test-01',
    fieldRecordId: 'rec-test-01',
    activityDescription: 'Line 24-XX Welding',
    mappingType: '1:1',
    mappedActivityIds: ['act-test-01'],
    progressMethod: 'quantity-based',
    progressValue: 75,
    quantity: 6,
    verificationStatus: 'unverified',
    discipline: 'PIPING',
    confidenceScore: 94.8,
    confidenceLevel: 'HIGH',
    matchMethod: 'multi-signal',
    validationStatus: 'pending',
    outOfSequence: false,
    evidenceSnippet: '6 joints completed',
    evidenceUri: '/evidence/welding.csv'
  };

  // Out of sequence check
  const safetyCheck = ApprovalService.validate(dummyEvent, baselineAct, [baselineAct, predecessorIncomplete]);
  assert(
    safetyCheck.isOutOfSequence === true && safetyCheck.requiresJustification === true,
    'UT-APP-01',
    'Catches incomplete predecessor (CIV-L5-01 at 50%) and marks isOutOfSequence=true'
  );

  // Negative progress check (event reports 40% when baseline is already 50%)
  const negativeProgressEvent: ProgressEvent = { ...dummyEvent, progressValue: 40 };
  const safetyCheckNeg = ApprovalService.validate(negativeProgressEvent, baselineAct, [baselineAct]);
  assert(
    safetyCheckNeg.hasNegativeProgress === true,
    'UT-APP-02',
    'Detects negative progress violation when reported % is below approved baseline'
  );

  // Quantity overrun check (> 20% over planned 24)
  const overrunEvent: ProgressEvent = { ...dummyEvent, quantity: 20 }; // 12 existing + 20 = 32 > 24 * 1.2 (28.8)
  const safetyCheckOverrun = ApprovalService.validate(overrunEvent, baselineAct, [baselineAct]);
  assert(
    safetyCheckOverrun.hasQuantityOverrun === true,
    'UT-APP-03',
    'Flags quantity overrun when cumulative actual exceeds baseline planned by >20%'
  );

  // 1:N Split: Exact 100% allocation boundary
  const validSplits: AllocationSplitItem[] = [
    { activityId: 'act-01', allocationPercent: 50 },
    { activityId: 'act-02', allocationPercent: 30 },
    { activityId: 'act-03', allocationPercent: 20 }
  ];
  const splitResult = ApprovalService.split1ToN(dummyEvent, validSplits, [baselineAct], 'Approved craft allocation');
  assert(
    splitResult.success === true && splitResult.childEvents?.length === 3,
    'UT-APP-04',
    '1:N Split succeeds when allocation percentages sum to exactly 100%'
  );

  // 1:N Split: Invalid allocation (sum != 100) must throw
  let splitThrew = false;
  try {
    const invalidSplits: AllocationSplitItem[] = [
      { activityId: 'act-01', allocationPercent: 50 },
      { activityId: 'act-02', allocationPercent: 40 } // Sum = 90%
    ];
    ApprovalService.split1ToN(dummyEvent, invalidSplits, [baselineAct], 'Invalid allocation');
  } catch {
    splitThrew = true;
  }
  assert(
    splitThrew === true,
    'UT-APP-05',
    '1:N Split throws validation error when allocations sum to 90% instead of 100%'
  );

  // ========================================================================
  // SUITE 5: DUPLICATE SERVICE DETECTION THRESHOLDS
  // ========================================================================
  console.log('\n--- SUITE 5: DuplicateService Similarity Thresholds ---');

  const existingRecords: FieldRecord[] = [
    {
      id: 'rec-orig-01',
      sourceType: 'report',
      sourceName: 'DPR_01.txt',
      submittedBy: 'Lead',
      discipline: 'PIPING',
      submittedAt: '2026-09-12T10:00:00Z',
      normalizedDate: '2026-09-12',
      dateConfidence: 100,
      rawText: 'Erected spool line 24-XX in north pipe rack today. 18 joints completed.',
      evidenceReference: '/evidence/dpr1.txt',
      processingStatus: 'ready_for_extraction',
      duplicateStatus: 'unique',
      extractedEventIds: []
    }
  ];

  // Identical record on same date & discipline -> detects duplicate
  const duplicateCandidate: Partial<FieldRecord> = {
    normalizedDate: '2026-09-12',
    discipline: 'PIPING',
    rawText: 'Piping crew erected spool line 24-XX in north pipe rack today. 18 joints completed.'
  };
  const dupCheck1 = DuplicateService.detectDuplicates(duplicateCandidate, existingRecords);
  assert(
    dupCheck1.duplicateStatus === 'possible-duplicate' && dupCheck1.confidenceScore >= 85,
    'UT-DUP-01',
    'High overlap (>85%) flags possible-duplicate with high confidence score'
  );

  // Different discipline on same date -> unique
  const distinctCandidate: Partial<FieldRecord> = {
    normalizedDate: '2026-09-12',
    discipline: 'ELECTRICAL',
    rawText: 'Substation lighting cable pulled 150m.'
  };
  const dupCheck2 = DuplicateService.detectDuplicates(distinctCandidate, existingRecords);
  assert(
    dupCheck2.duplicateStatus === 'unique' && dupCheck2.conflictingRecordIds.length === 0,
    'UT-DUP-02',
    'Disparate discipline on same date correctly classifies as unique'
  );

  // ========================================================================
  // SUITE 6: ANALYTICS SERVICE FORECAST FALLBACKS & S-CURVES
  // ========================================================================
  console.log('\n--- SUITE 6: AnalyticsService Fallbacks & Velocity ---');

  // Fallback test: No approved activities -> isAvailable: false
  const unapprovedActivities = [
    { ...baselineAct, status: 'Not Started', actualQuantity: 0, percentComplete: 0 }
  ];
  const fallbackForecast = AnalyticsService.calculateForecast(unapprovedActivities as ScheduleActivity[]);
  assert(
    fallbackForecast.isAvailable === false && fallbackForecast.forecastFinishDate === null,
    'UT-ANA-01',
    'Returns isAvailable=false and graceful fallback message when zero activities are in progress'
  );

  // Valid forecast with active velocity
  const validForecast = AnalyticsService.calculateIndicativeForecast([baselineAct], '2026-09-19', 1.5);
  assert(
    validForecast.isAvailable === true && validForecast.forecastFinish === '2026-09-23',
    'UT-ANA-02',
    'Calculates exact finish date 2026-09-23 (+3.0 days variance) for 6 remaining at 1.5/day'
  );

  // S-Curve point generation
  const scurve = AnalyticsService.calculateSCurve([baselineAct]);
  assert(
    Array.isArray(scurve) && scurve.length === 9 && scurve[0].planned >= 0 && scurve[scurve.length - 1].planned === 100,
    'UT-ANA-03',
    'Generates 9-point cumulative S-curve reaching 100% completion'
  );

  // ========================================================================
  // SUITE 7: MOCK P6 ADAPTER PAYLOAD GENERATION
  // ========================================================================
  console.log('\n--- SUITE 7: MockP6Adapter Payload Structure & XML Escaping ---');

  const payload = MockP6Adapter.generatePayload(baselineAct);
  assert(
    payload.json.activityCode === 'PIP-L6-024A' &&
    payload.xml.includes('<ActivityCode>PIP-L6-024A</ActivityCode>') &&
    payload.xml.includes('<v1:PhysicalPercentComplete>50</v1:PhysicalPercentComplete>'),
    'UT-P6-01',
    'Generates valid P6 REST JSON structure and matching SOAP XML envelope'
  );

  console.log('\n========================================================================');
  console.log(`UNIT TEST RESULTS: ${passed} PASSED, ${failed} FAILED (Total: ${passed + failed})`);
  console.log('========================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runUnitTests();

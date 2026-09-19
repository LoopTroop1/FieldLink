# PRODUCT GOAL & VISION SPECIFICATION
## SIH 2026 — Problem Statement 26122
**Project Title:** Intelligent Data Capture & Schedule-Linking Layer for Infrastructure Project Management: Real-Time Actual Progress Tracking (Planning-to-Execution Bridge)  
**Organization:** Oil India Limited  
**Category:** Software | **Theme:** Smart Automation  
**Target Installation/Context:** Baghewala Surface Facilities Expansion  

> [!NOTE]
> **Synthetic Prototype Data Disclaimer:**  
> All project names, activities, dates, progress records, personnel references, and schedule data are synthetic and created solely for demonstration. The prototype does not use live Oil India project data or confidential infrastructure assets.

---

## 1. Executive Summary & Problem Context

In mega-infrastructure and oil & gas developments—such as Oil India Limited’s surface facility installations, gathering stations, and pipeline expansion networks—the baseline project schedule is maintained in enterprise tools (such as Oracle Primavera P6 or Microsoft Project) down to Level 5 (Work Packages) and Level 6 (Executable Field Activities).

However, **field reality diverges sharply from the planning office**:
- **Fragmented Data Sources:** Progress happens on the ground and is documented across unstructured daily progress reports (DPRs), discipline-specific Excel logs, paper site diaries, WhatsApp transcripts, and verbal radio/voice updates.
- **Terminology Mismatch:** A site supervisor writes *"Piping crew erected spool for Line 24-XX in north pipe rack"*, while the Primavera schedule lists activity `PIP-L6-024A: Erect Line 24-XX`.
- **Granularity Disconnect:** A single field note may span multiple discrete L6 activities (e.g., fit-up, welding, and non-destructive testing) or represent an ad-hoc task not present in the baseline WBS.
- **Reporting Lag & Data Loss:** Information takes 48 to 96 hours to reach planners, leading to stale schedules, delayed critical path identification, and reactive firefighting.
- **Lack of Verifiable Audit Lineage:** Schedule updates are manually keyed in without linked raw evidence, making dispute resolution, contractor claims, and institutional learning nearly impossible.

### The Product Promise
To build an **intelligent, explainable, and trustworthy Planning-to-Execution Bridge** that:
> *"Captures everything from the field, understands engineering context, links transparently to L5/L6 schedules, flags uncertainty for human review, updates simulated PMIS safely, and continuously builds reusable institutional project memory."*

---

## 2. Target User Personas & Value Propositions

| Persona | Primary Needs & Pain Points | Product Experience | Value Delivered |
|---|---|---|---|
| **Site Supervisor** | Minimal typing on rugged devices, no time for complex forms, needs rapid feedback. | **Time Agent:** Conversational text/voice-driven logger with single-tap quick actions (Start, Progress %, Delay, Done). Immediate confirmation that the entry was captured, with matching and approval status shown separately. | Captures progress at point-of-work in under 30 seconds without opening Primavera or SAP. |
| **Discipline Engineer** (Civil, Piping, Equip, Elec, Inst, HSE) | Validating technical quantities, verifying crew/equipment allocations, ensuring safety permits before progress signoff. | **Discipline Extraction Workspace:** Side-by-side verification of extracted engineering parameters against raw site notes. | Prevents erroneous progress logs; ensures discipline compliance and quantity integrity. |
| **Project Planner** | Custodian of the critical path; overwhelmed by reconciling contradictory field reports with 5,000+ schedule activities. | **Schedule Linker & Review Queue:** Ranked L5/L6 candidate matches with transparent multi-signal score breakdowns (text, discipline, location, WBS, date, synonyms). Fast-track review for high-confidence records. | Eliminates manual cross-referencing; safe bulk approvals for high-confidence items; clear exception workflows. |
| **Project Manager** | Executive overview of real progress vs. planned baseline, immediate delay detection, discipline productivity trends. | **Operations Overview & Live Schedule (Gantt):** Near-real-time baseline vs. actual variance badges, S-curves, and data health scores. | Instant visibility into true execution progress, early delay mitigation, and contractor accountability. |
| **Future Project Team / Estimator** | Lessons learned, realistic activity duration benchmarks, recurring contractor delay causes. | **Project Memory & Delay Pattern Repository:** Semantic search across past execution realities, duration overruns, and equipment bottlenecks. | Reusable institutional knowledge prevents repeating multi-million rupee mistakes on future projects. |

---

## 3. Core Workflow Architecture

The platform executes a 10-stage deterministic and explainable pipeline:

```
[1. Field Input]
   ├── Free-Text Daily Progress Report (DPR)
   ├── Discipline Spreadsheet (CSV/XLSX)
   ├── Scanned Diary / Logsheet Simulation
   └── Supervisor Voice / Time Agent Transcript
          ↓
[2. Ingestion & Pre-processing]
   ├── Format Normalization & OCR Text Extraction
   ├── Entity Pre-cleaning & ISO Date Normalization (YYYY-MM-DD)
   └── Duplicate Detection (Unique, Possible-Duplicate, Confirmed)
          ↓
[3. Activity and Progress Extraction]
   ├── Activity Description, Location, Discipline
   ├── Progress Method, Planned / Actual / Remaining Quantities
   └── Manpower, Equipment, Delay Causes, Supporting Evidence
          ↓
[4. L5/L6 Schedule Linking Engine (Multi-Signal Scoring)]
   ├── Text Similarity (30%) + Discipline Fit (20%)
   ├── Location Fit (15%) + WBS Fit (15%)
   └── Date Consistency (10%) + Terminology/Synonym Match (10%)
          ↓
[5. Confidence Gating & Exception Handling]
   ├── High Confidence (≥ 85%): Fast-Track Review / One-Click Planner Approval
   ├── Medium Confidence (60% - 84%): Mandatory Planner Review Required
   └── Low / Unmatched (< 60%): Unmatched / New Activity Candidate Queue
          ↓
[6. Planner Review & Mapping Decision]
   ├── Approve Match / Remap Candidate / Edit Extracted Fields
   ├── Granularity Split (1:N allocation) / Reject Invalid Submission
   └── Add Planner Justification & Verify Supporting Evidence
          ↓
[7. Approved Schedule Update]
   ├── Update Approved Activity Actuals (% Complete, Actual Start / Finish)
   ├── Calculate Baseline Variance & Critical Path and Downstream Impact Analysis
   └── Predecessor Out-of-Sequence Flagging (Pauses Sync Pending Justification)
          ↓
[8. Audit and Evidence Lineage]
   ├── Append-Only Audit Trail (Actor, Timestamp, Reason, Before/After Diff)
   └── Unbroken 6-Point Trace: Source File → Snippet → Event → Match → Approval → Schedule Update
          ↓
[9. Analytics & Indicative Forecasting]
   ├── Planned vs. Actual S-Curves & Discipline Productivity (Joints/Day, m³/Day)
   ├── Indicative Forecast Completion Date (Based on Data Date & Observed Velocity)
   └── Interactive What-If Downstream Delay Simulation
          ↓
[10. Institutional Project Memory]
   └── Automated Synthesis of Delay Causes, Productivity Metrics & Reusable Lessons
```

---

## 4. Progress Measurement, Dates, Duplicates & Granularity Rules

### A. Progress Measurement Discipline & Verification
To avoid ambiguous or contradictory reporting:
- **Quantity-Based Progress:** Preferred whenever a measurable unit is available (e.g., joints welded, linear meters of cable tray, cubic meters of concrete, equipment aligned).
- **Percentage-Based Progress:** Utilized only when discrete quantity tracking is unavailable or for composite high-level summaries.
- **Milestone-Based Progress:** Applied to verification/inspection checkpoints (e.g., hydrotest witnessed, nozzle orientation signed off).
- **Duration-Based Progress:** Calculated for time-dependent operations.

> [!IMPORTANT]
> **Progress Semantics Rule:**  
> When a percentage is reported directly from the field, the system may display an **implied quantity** for reference. However, the implied quantity **must not replace verified quantity** unless the planner explicitly confirms it.
>
> **UI Display Paradigm:**
> - `Reported Progress: 75%`
> - `Implied Quantity: 18 of 24 joints (Unverified / Indicative)`
> - `Verification Status: Planner Confirmed / Unverified`

**Standard Entity Fields:**
```typescript
progressMethod: 'quantity-based' | 'percentage-based' | 'milestone-based' | 'duration-based'
plannedQuantity?: number
actualQuantity?: number
remainingQuantity?: number
progressUnit?: string // e.g., 'joints', 'm', 'm³', '%'
verificationStatus: 'unverified' | 'planner-confirmed'
```

### B. Date Normalization & Data Date Governance
- All incoming dates are normalized to ISO format: `YYYY-MM-DD`.
- Ambiguous dates (e.g. `09/12/26`) are **not silently interpreted**. The system displays the assumed format (`2026-09-12`), assigns a date confidence score, and flags the record for user confirmation if ambiguous.
- Every project has a defined **Data Date** (status cutoff date) and project timezone (`Asia/Kolkata` for Baghewala). All actuals and forecast calculations reference this Data Date.

**Standard Date Fields:**
```typescript
sourceDateText?: string      // e.g. "12 Sep 2026", "12-09-2026"
normalizedDate?: string      // e.g. "2026-09-12"
dateConfidence?: number      // e.g. 0.95
timezone: string             // "Asia/Kolkata"
dataDate: string             // "2026-09-19" (Schedule status cutoff)
```

### C. Duplicate Progress Detection & Resolution
- Field updates from multiple sources (e.g., supervisor Time Agent note + contractor evening Excel log) might refer to the identical work event.
- The system groups candidate records by:
  $$\text{Duplicate Key} = (\text{Activity/Target}, \text{Normalized Date}, \text{Discipline}, \text{Location}, \text{Similarity} \ge 85\%)$$
- **Rule:** The system **retains all source records** for audit evidence but **blocks double-counting of progress** until a planner reviews the group.

**Duplicate Resolution States:**
```typescript
duplicateStatus: 'unique' | 'possible-duplicate' | 'confirmed-duplicate' | 'duplicate-rejected'
linkedDuplicateRecordIds?: string[]
```

### D. Granularity Handling & 1:N Mapping
Field work often operates at a broader or narrower scope than the baseline schedule.
- A single field record may map to **one (1:1)**, **multiple (1:N)**, or **zero (Unmatched / New Activity Candidate)** L5/L6 activities.
- In 1:N scenarios, the system stores the planner-defined distribution of the reported field work:
  - *Example allocation of the reported field work:*
    - `PIP-L6-024A — Fit-up`: 20% allocation
    - `PIP-L6-024B — Welding`: 50% allocation
    - `PIP-L6-024C — NDT`: 30% allocation
  - **Rule:** Allocation percentages represent the planner-defined distribution of the field record, not automatically calculated activity completion percentages. The total allocation across mapped activities **must equal exactly 100%**.

**Granularity Entity Fields:**
```typescript
mappingType: '1:1' | '1:N' | 'new-activity'
mappedActivityIds: string[]
allocationBreakdown?: { activityId: string; allocationPercent: number }[]
plannerJustification?: string
```

---

## 5. Prototype Scope (What We Are Building)

1. **Operations Overview Dashboard:**
   - Key operational KPIs: Progress Captured Today, Activities Linked, Review Queue Count, Unmatched Records, Average Confidence %, Schedule Freshness Index, Overall Data Quality Score.
   - Discipline-wise progress breakdown and live recent activity feed.

2. **Data Ingestion Hub:**
   - Multi-channel input supporting:
     - Free-text Daily Progress Report ingestion.
     - Discipline spreadsheet parser (simulated CSV/XLSX).
     - Scanned engineer diary simulation with visual text bounds.
     - Audio transcript / Time Agent field logger.
   - Processing status pipeline: `Received -> Parsing -> Normalized -> Ready for Extraction`.

3. **Extraction Workspace:**
   - Side-by-side view: Raw Source Document vs. Structured Extracted Event Card.
   - Text phrase highlighting indicating source evidence for every extracted field.
   - Inline editing for extracted values (quantities, dates, discipline, manpower, delays).

4. **Intelligent Schedule Linker:**
   - Multi-signal ranking showing Top 3 L5/L6 candidate activities from the Baghewala baseline.
   - Visual breakdown of the 6-signal matching formula with transparent explanations.
   - Synonym mapping demonstration (`spool erected` → `line erection`).

5. **Planner Review Queue:**
   - Filterable inbox categorized by Confidence Level (High, Medium, Low/Unmatched), Discipline, Exception Type, and Date.
   - Fast-track review path for records with confidence ≥ 85%; strict confirmation for all schedule mutations.
   - "Unmatched / New Activity Candidate" proposal workflow for unmapped site events.

6. **Time Agent (Supervisor Conversational Assistant):**
   - Streamlined conversational interface with seeded speech-to-text transcripts and free-text input.
   - Quick action buttons: *Start Activity, End Activity, Update %, Report Delay, Add Evidence*.
   - Immediate confirmation that entry was captured, displaying extracted parameters and candidate link.

7. **Live Schedule & Gantt View:**
   - Interactive timeline comparing Planned Baseline vs. Actual Execution bars.
   - Color-coded status, variance badges (+/- days), predecessor relationship indicators.
   - **Simulated PMIS Synchronizer:** Displays representative P6-compatible mock payloads containing activity code, actual start, actual finish, and physical percent-complete fields for demonstration.

8. **Near-Real-Time Analytics & Indicative Forecasting:**
   - Planned vs. Actual progress curves, duration variance distribution, discipline-level productivity rates (e.g., joints/day), delay cause Pareto chart.
   - **Indicative Forecast Module:** Calculates estimated project finish based on the project Data Date, remaining work, and observed productivity:
     $$\text{Forecast Finish} = \text{Data Date} + \frac{\text{Remaining Quantity}}{\text{Observed Productivity}}$$
     Labeled clearly as `Prototype Forecast — Indicative`.
   - **Critical Path and Downstream Impact Analysis:** Interactive simulator showing potential cascading impacts before committing schedule actuals.

9. **Institutional Project Memory:**
   - Searchable, taggable repository of extracted insights: actual durations, recurring bottlenecks (e.g., test pump unviability), and productivity baselines.
   - Filterable by discipline, delay cause, and date range.

10. **Append-Only Audit Trail (Prototype):**
    - Existing audit entries cannot be edited through the interface. Every correction creates a new entry containing before-and-after values, actor, timestamp, and reason.
    - Full end-to-end evidence lineage: `Source File → Extracted Phrase → Structured Event → Match Candidate → Planner Approval → Approved Schedule Update`.

11. **Settings & Data Dictionary:**
    - Configurable confidence thresholds, discipline taxonomies, synonym dictionary management, and privacy/redaction toggle (masking worker names/contractors).

---

## 6. Traceability & Evidence Lineage Model

To ensure every schedule update is backed by supporting documentation, the data model incorporates comprehensive evidence metadata:

```typescript
evidenceType: 'text' | 'spreadsheet' | 'scan' | 'voice-transcript' | 'photo' | 'manual-entry'
evidenceUri: string
evidenceSnippet: string
sourcePage?: number
sourceRow?: number
captureTimestamp: string
locationMetadata?: string
```

---

## 7. Out-of-Scope Boundaries (Guarding Prototype Reliability)

To ensure an airtight, stable, and deterministic demonstration that never fails during an evaluation:
- **Direct Cloud Production P6 / SAP Database Connection:** A local PMIS adapter simulation displays representative P6-compatible mock payloads containing activity code, actual start, actual finish, and physical percent-complete fields. Live corporate Oracle Primavera P6 enterprise credentials are not required.
- **Hardware Microphone ASR Mandate:** Eliminates browser microphone permission errors or room noise issues during judging by providing instant-selectable realistic audio transcripts alongside manual input.
- **External Commercial LLM/OCR Billing Mandate:** The prototype operates with deterministic demo extraction and matching without external services (`Demo AI Mode — Synthetic Data`). If an external LLM key is absent, the system operates reliably and transparently.
- **Multi-Tenant SSO / Identity Provider:** Enterprise OAuth/SAML is bypassed in favor of instant role-switching via the top navigation bar (Supervisor, Engineer, Planner, PM).

---

## 8. Measurable Success Criteria & Safety Rules

1. **Zero-Failure Demo Guarantee:** Works 100% offline or locally without internet connectivity or paid API keys.
2. **Explainability Metric:** 100% of candidate activity matches display the exact mathematical signal breakdown and textual reasoning.
3. **Safety Guarantee:** **No record with confidence below 85% may update the schedule without explicit planner approval.** Records with confidence ≥85% may be placed into a fast-track one-click approval queue, but schedule synchronization remains auditable and requires planner confirmation.
4. **Out-of-Sequence Execution Rule:** An out-of-sequence warning does not automatically reject the field event; it **pauses schedule synchronization until the planner confirms the actual execution context and provides a justification**. The system **never silently modifies predecessor logic or downstream baseline dates**.
5. **Traceability Guarantee:** 100% of updated schedule activities maintain an unbroken, clickable evidence link to the originating field report phrase.
6. **Workflow Velocity:** A judge can experience the complete end-to-end flow (`Ingest -> Extract -> Match -> Review -> Schedule Update -> Analytics -> Memory`) within 3 to 5 minutes.

---

## 9. The Judge Demo Story Arc: "A Day in the Life at Baghewala"

- **Act 1: The Chaos of Field Data (0:00 - 0:45)**
  - Present the reality of Oil India’s Baghewala Surface Facilities Expansion.
  - Ingest an actual daily progress note: *"Piping crew erected spool for Line 24-XX in north pipe rack. Work started 12 Sep and 18 of 24 joints completed."*
  - Show the ingestion pipeline parsing and normalizing the heterogeneous text in real time.

- **Act 2: The Intelligence Layer & Explainable Linker (0:45 - 1:45)**
  - Show the extraction workspace highlighting raw phrases and extracting structured attributes (quantity: 18 joints, progress: 75%).
  - Navigate to the Schedule Linker. The system identifies `PIP-L6-024A: Erect Line 24-XX` with **94% confidence**.
  - Open the score breakdown: 92% text similarity, 100% discipline fit, 95% location fit, 90% WBS fit, 100% date consistency, 88% synonym match.

- **Act 3: The Planner’s Trust & Edge Cases (1:45 - 2:45)**
  - Demonstrate handling of an ambiguous entry: *"Foundation work progressing near compressor area"* (flagged with 68% confidence for planner review).
  - Demonstrate handling of an unmapped entry: *"Temporary access platform installed near tank farm"* (correctly flagged as Unmatched / New Activity Candidate; proposed as a new scope activity).
  - Approve the high-confidence piping record via the fast-track review workflow.

- **Act 4: Live Schedule Update & Evidence Chain (2:45 - 3:30)**
  - Switch to the Live Schedule (Gantt). Show `PIP-L6-024A` updating to 75% complete with actual start date and calculated baseline variance.
  - Trigger "Simulate PMIS Sync" (displaying representative P6-compatible mock payload).
  - Open the Audit Trail: expand the unbroken 6-point evidence chain linking the final schedule bar back to the supervisor’s raw sentence.

- **Act 5: Organizational Memory & Indicative Forecasting (3:30 - 4:15)**
  - Open Analytics: show near-real-time S-curves, indicative forecast completion dates, and the Data Quality Score.
  - Open Project Memory: show the automatically synthesized insight: *"Piping crew productivity in North Rack averaged 6 joints/day; Hydrotest delayed due to unavailable test pump."*
  - Conclude: *"This is how Oil India can bridge the gap between project plans and field execution."*

# SYSTEM REQUIREMENTS SPECIFICATION (SRS)
## SIH 2026 — Problem Statement 26122 (FieldLink Platform)
**Project Title:** Intelligent Data Capture & Schedule-Linking Layer for Infrastructure Project Management: Real-Time Actual Progress Tracking (Planning-to-Execution Bridge)  
**Target Installation:** Baghewala Surface Facilities Expansion (Rajasthan)  

---

## 1. System Overview & Architectural Purpose

The platform serves as an explainable, deterministic, and safe bridge between unstructured, heterogeneous field reporting (DPRs, spreadsheets, diary scans, voice notes) and the structured Level 5/Level 6 baseline schedule (Primavera P6 / PMIS).

The system ensures that **no actual progress is linked blindly**, **no out-of-sequence work is synced without justification**, and **every schedule variance is backed by an unbroken evidence chain**.

---

## 2. User Stories by Persona

### 2.1 Site Supervisor (Field Operations)
- **US-SS-01 (Rapid Conversational Logging):** As a site supervisor on the field, I want to report progress via simple text or one-click audio transcripts in the Time Agent, so that I can log work in under 30 seconds without navigating complex scheduling forms.
- **US-SS-02 (Instant Entity Feedback):** As a site supervisor, I want to see an immediate extraction preview card showing detected discipline, line number, quantity, and progress %, so that I can verify the system understood my report before submitting.
- **US-SS-03 (Delay Logging):** As a site supervisor, I want to report site bottlenecks (e.g., test pump failure, permit delay) with a single tap, so that delays are captured at the point-of-origin.

### 2.2 Discipline Engineer (Quality & Technical Gatekeeper)
- **US-DE-01 (Discipline Workspace):** As a piping/civil/electrical discipline engineer, I want to filter ingested reports by my technical domain, so that I can inspect craft-specific parameters (e.g., joint counts, trench meters).
- **US-DE-02 (Side-by-Side Verification):** As a discipline engineer, I want to view the raw source text alongside extracted attributes with visual phrase highlighting, so that I can correct inaccurate quantities or missing units.
- **US-DE-03 (Technical Sign-Off):** As a discipline engineer, I want to verify reported physical quantities against baseline limits before sending records to the project planner.

### 2.3 Project Planner (Schedule Custodian)
- **US-PP-01 (Explainable L5/L6 Candidate Ranking):** As a project planner, I want candidate schedule activities ranked with transparent multi-signal score breakdowns (text, discipline, location, WBS, dates, synonyms), so that I know exactly why an activity was matched.
- **US-PP-02 (Fast-Track Review):** As a project planner, I want high-confidence matches ($\ge 85\%$) clearly grouped for fast-track one-click approval, so that routine updates take minimal time.
- **US-PP-03 (Granularity Allocation 1:N):** As a project planner, I want to split composite field records (e.g. joint completion) across multiple L6 activities (Fit-up, Welding, NDT) using visual weightage sliders summing to 100%.
- **US-PP-04 (Predecessor Out-of-Sequence Flagging):** As a project planner, I want the system to flag when an activity is reported ahead of uncompleted predecessors and pause schedule synchronization until I provide an execution justification.
- **US-PP-05 (Unmatched / New Scope Handling):** As a project planner, I want unmapped field work (<60% confidence) routed to a new activity candidate queue so that extra-contractual or out-of-scope work is never discarded.

### 2.4 Project Manager (Executive Oversight)
- **US-PM-01 (Baseline vs. Actual Gantt):** As a project manager, I want to see a live Gantt view comparing baseline bars against actual execution bars with +/- day variance badges.
- **US-PM-02 (Near-Real-Time Analytics):** As a project manager, I want to monitor S-curves, discipline-wise productivity rates (joints/day), and delay cause Pareto charts updated with every approved record.
- **US-PM-03 (Critical Path and Downstream Impact Analysis):** As a project manager, I want an interactive What-If simulator to preview how a delay on one activity impacts downstream milestones before committing changes.
- **US-PM-04 (Data Quality Health Score):** As a project manager, I want an overall project data health metric measuring completeness, freshness, confidence, and unresolved exceptions.

### 2.5 Future Project Teams / Estimators (Institutional Knowledge)
- **US-FE-01 (Project Memory Retrieval):** As a future project estimator, I want to search past actual durations, equipment bottlenecks, and discipline productivity rates, so that future bid schedules are grounded in real execution data.

---

## 3. Functional Requirements (FR)

### FR-1: Multi-Channel Field Data Ingestion
- **FR-1.1:** The system shall support four distinct ingestion modalities:
  1. Free-text Daily Progress Report (DPR) paste/upload.
  2. Discipline spreadsheet parser (simulated CSV/XLSX tabular data).
  3. Scanned engineer diary simulation with visual text bounds.
  4. Conversational Time Agent audio transcript & prompt entry.
- **FR-1.2:** Every ingested record shall capture: `sourceType`, `sourceName`, `submittedBy`, `discipline`, `submittedAt`, and `evidenceReference`.
- **FR-1.3:** The system shall display processing pipeline states: `Received` $\rightarrow$ `Parsing` $\rightarrow$ `Normalized` $\rightarrow$ `Ready for Extraction`.

### FR-2: Data Pre-processing & Normalization
- **FR-2.1 (ISO Date Normalization):** All incoming dates shall be normalized to ISO format (`YYYY-MM-DD`).
- **FR-2.2 (Ambiguous Date Flagging):** Ambiguous date formats (e.g. `09/12/2026`) shall not be silently guessed; the system shall display the assumed format, assign a confidence score, and flag for review if confidence < 0.90.
- **FR-2.3 (Duplicate Candidate Grouping):** Incoming records sharing target activity, normalized date, discipline, and location with similarity $\ge 85\%$ shall be flagged as `possible-duplicate`, blocking double-counting until resolved.

### FR-3: Multi-Attribute Activity & Progress Extraction
- **FR-3.1:** The extraction workspace shall present a split-screen view: Raw Source Document (left) and Structured Extracted Event Card (right).
- **FR-3.2 (Visual Phrase Highlighting):** Clicking on any extracted field shall highlight the exact phrase in the source document that produced the value.
- **FR-3.3 (Progress Measurement Rules):**
  - Quantity-based progress shall be preferred when units exist (e.g. `18 joints`, `42 m`).
  - When percentage is reported directly, implied quantity shall be calculated as an **unverified estimate** and clearly labeled:  
    `Reported Progress: 75% | Implied Quantity: 18 of 24 joints (Unverified)`.
- **FR-3.4 (Inline Field Editing):** Users with discipline engineer or planner roles shall be permitted to edit extracted values prior to schedule linking.

### FR-4: L5/L6 Schedule Linking & Multi-Signal Scoring Engine
- **FR-4.1:** The matching engine shall calculate a composite confidence score for candidate activities based on the weighted formula:
  $$\text{matchScore} = 0.30 \cdot S_{\text{text}} + 0.20 \cdot S_{\text{discipline}} + 0.15 \cdot S_{\text{location}} + 0.15 \cdot S_{\text{wbs}} + 0.10 \cdot S_{\text{date}} + 0.10 \cdot S_{\text{synonym}}$$
- **FR-4.2 (Level 6 Priority Rule):** Field execution updates shall prioritize Level 6 terminal executable activities over Level 5 parent work packages.
- **FR-4.3 (Craft Verb Routing):** Specific craft verbs (*welded, pulled, aligned, torqued*) shall boost corresponding fabrication/erection L6 activities; testing verbs (*hydrotest, flushed*) shall route to commissioning L6 activities.
- **FR-4.4 (Score Gap Demotion):** If the score difference between Candidate #1 and Candidate #2 is $< 10\%$, the record shall be demoted to Mandatory Planner Review with an `Ambiguous Candidates` warning, regardless of raw score.

### FR-5: Confidence Gating & Exception Handling
- **FR-5.1:** Records shall be classified into three strict confidence tiers:
  - **High Confidence ($\ge 85\%$):** Fast-Track Review / One-Click Planner Approval.
  - **Medium Confidence ($60\% - 84\%$):** Mandatory Planner Review Required.
  - **Low / Unmatched ($< 60\%$):** Unmatched / New Activity Candidate Queue.
- **FR-5.2 (Zero Silent Auto-Sync):** No record with confidence $< 85\%$ may update the schedule without explicit planner approval.
- **FR-5.3 (Unmatched Integrity):** Unmatched records shall never be silently discarded; they shall be accessible in the Planner Review Queue with a "Create New Activity Proposal" action.

### FR-6: Planner Review & Granularity Allocation (1:N)
- **FR-6.1:** Planners shall have full authority to: Approve Match, Remap Candidate, Edit Extracted Fields, Split into 1:N Activities, Propose New Activity, or Reject.
- **FR-6.2 (1:N Granularity Splitter):** When a single field record spans multiple activities, the planner can trigger the 1:N modal:
  - System presents discipline templates (e.g. Piping joint: 20% Fit-up, 50% Welding, 30% NDT).
  - Allocation sliders must sum to exactly 100%.
  - Child progress events are generated and linked to the parent field record.

### FR-7: Schedule Synchronization & Out-of-Sequence Handling
- **FR-7.1:** Approved actuals shall update the simulated schedule: `actualStart`, `actualFinish`, `percentComplete`, `actualDuration`, and `baselineVariance`.
- **FR-7.2 (Out-of-Sequence Pausing):** If an activity is approved before its predecessors have reached 100% completion, the system shall raise an `Out-of-Sequence Warning` and pause PMIS synchronization until the planner inputs an explicit justification note.
- **FR-7.3 (Logic Preservation):** The system shall never automatically modify predecessor relationships or alter planned baseline dates.
- **FR-7.4 (P6-Compatible Adapter Simulation):** The system shall provide an inspection drawer displaying representative P6-compatible mock payloads (`activityCode`, `actualStart`, `actualFinish`, `physCompletePct`).

### FR-8: Append-Only Audit Trail & 6-Point Traceability
- **FR-8.1:** The audit trail shall be strictly append-only. Existing entries cannot be modified or deleted.
- **FR-8.2:** Every audit entry shall record: `id`, `entityType`, `entityId`, `action`, `actor`, `timestamp`, `beforeValue`, `afterValue`, `reason`, and `evidenceSnippet`.
- **FR-8.3 (Unbroken Lineage):** The system shall provide an interactive 6-node trace chain:
  $$\text{Source File} \longrightarrow \text{Extracted Snippet} \longrightarrow \text{Structured Event} \longrightarrow \text{Match Candidate} \longrightarrow \text{Planner Approval} \longrightarrow \text{Approved Schedule Update}$$

### FR-9: Near-Real-Time Analytics & Indicative Forecasting
- **FR-9.1:** S-curves (Planned vs. Actual) and discipline productivity charts (joints/day, meters/day) shall update dynamically upon approval of any progress event.
- **FR-9.2 (Indicative Forecast Formulation):**
  $$\text{Forecast Finish} = \text{Data Date} + \frac{\text{Remaining Work Quantity}}{\text{Observed 7-Day Velocity}}$$
  Labeled explicitly as `Prototype Forecast — Indicative`.
- **FR-9.3 (Critical Path and Downstream Impact Analysis):** The system shall provide an interactive What-If simulator allowing users to select an activity delay and view projected downstream delays without modifying schedule data.

### FR-10: Institutional Project Memory & Pattern Mining
- **FR-10.1:** Approved events with duration variances or delay causes shall automatically generate reusable project memory cards categorized by: `duration`, `bottleneck`, `delay`, `productivity`, and `lesson`.
- **FR-10.2:** Memory cards shall be searchable and filterable by discipline, delay cause, location, and confidence.

### FR-11: Supervisor Time Agent (Conversational Ingestion)
- **FR-11.1:** Time Agent shall provide a WhatsApp-style chat interface with one-tap quick action chips (*Start Activity*, *Update %*, *Report Delay*, *Mark Completed*).
- **FR-11.2:** The agent shall provide pre-seeded audio transcripts alongside free-text input.
- **FR-11.3:** Entering or selecting a message shall immediately render an entity verification card showing detected parameters, candidate L6 link, and a one-tap *"Confirm & Log Entry"* button.

### FR-12: Privacy & Data Masking Toggle
- **FR-12.1:** A global toggle in the Top Bar and Settings shall allow toggling `Worker & Contractor Privacy Mode (ON/OFF)`.
- **FR-12.2:** When enabled, inspector names, supervisor identities, and contractor company names shall be dynamically masked as `[REDACTED-CREW]` across all views, tables, and audit logs.

---

## 4. Non-Functional Requirements (NFR)

### NFR-1: Reliability & Offline Self-Containment
- The system must function 100% locally in `Demo AI Mode` without requiring external internet connectivity, commercial LLM API keys, or paid OCR services.

### NFR-2: Performance & Response Latency
- Field text ingestion, parsing, extraction, and candidate schedule ranking shall complete within $\le 1.5\text{ seconds}$ in the browser.
- Switching between modules and updating filter queries shall execute in $\le 100\text{ ms}$.

### NFR-3: Industrial Ergonomics & Design Standards
- UI shell must adhere to modern industrial control standards: deep charcoal/navy shell (`#0F172A`), slate content cards (`#1E293B`), teal intelligence accents (`#0EA5E9`), green success states (`#10B981`), amber review alerts (`#F59E0B`), and red exception flags (`#EF4444`).
- All text and badges must meet WCAG 2.1 AA contrast requirements.

### NFR-4: Session Persistence & Reset Fidelity
- All mutated states (ingested reports, extracted events, approved schedule actuals, audit logs) must persist in browser LocalStorage across page reloads.
- A prominent *"Reset Demo to Baseline"* button must be accessible at all times to restore the clean synthetic Baghewala dataset instantly.

### NFR-5: Explainability Standard
- 100% of candidate activity matches must expose the mathematical score breakdown and textual justification explaining why the candidate was selected.

---

## 5. Error States & Boundary Conditions

| Error Code | Trigger Condition | System Behavior |
|---|---|---|
| **ERR-01** | Empty or unparseable field report submitted | Ingestion rejects with clear error badge: *"No valid text or tabular data detected."* |
| **ERR-02** | Finish date chronologically precedes Start date | Extraction raises error flag: *"Date Conflict: Actual Finish precedes Actual Start."* Blocks schedule approval until corrected. |
| **ERR-03** | Actual quantity reported exceeds planned baseline by > 20% | Review queue raises warning: *"Quantity Overrun: Reported [X] exceeds Planned [Y] by [Z]%."* Requires planner confirmation. |
| **ERR-04** | Reported progress is lower than existing approved progress | Review queue raises conflict: *"Negative Progress Alert: Reported [X]% is lower than previously recorded [Y]%."* |
| **ERR-05** | Predecessor activity has not reached 100% completion | Linker displays amber badge: *"Out-of-Sequence Execution: Predecessor incomplete."* Pauses PMIS sync pending justification. |
| **ERR-06** | Score difference between top 2 candidate activities is < 10% | Demotes record from Fast-Track to *"Mandatory Planner Review (Ambiguous Candidates)"*. |
| **ERR-07** | Duplicate event detected (same date, line, discipline, similarity $\ge 85\%$) | Flags record as `possible-duplicate`, prevents double-counting progress until planner confirmation. |

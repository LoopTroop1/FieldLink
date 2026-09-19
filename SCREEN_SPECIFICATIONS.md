# SCREEN SPECIFICATIONS & UI LAYOUT
## SIH 2026 — Problem Statement 26122 (FieldLink Platform)
**Project Title:** Intelligent Data Capture & Schedule-Linking Layer for Infrastructure Project Management: Real-Time Actual Progress Tracking  

---

## 1. Operations Overview (`/`)

- **Primary Persona:** Project Manager / Lead Planner
- **Purpose:** Executive command center displaying real-time execution health, progress captured today, review backlog, and discipline velocities.
- **Layout Architecture:**
  - **Row 1 (Executive KPI Ribbon - 5 Cards):**
    1. *Progress Captured Today:* e.g. `18 Joints / 42 m` (75% daily target met)
    2. *Activities Linked to Schedule:* e.g. `14 / 18 Activities`
    3. *Planner Review Queue:* e.g. `2 Pending` (Amber alert badge)
    4. *Unmatched / New Scope Records:* e.g. `1 Item` (Red alert badge)
    5. *Project Data Quality Score:* e.g. `91.4% (Excellent)`
  - **Row 2 (Main Visual Split):**
    - **Left (60%):** Discipline Progress Progress Bar Stack (Civil, Piping, Static, Rotating, Electrical, Instrumentation, HSE) showing Planned % vs. Actual %.
    - **Right (40%):** Schedule Freshness & Recent Activity Feed showing latest ingested reports, auto-links, and approvals with timestamps.
- **Empty State:** If zero records ingested, displays *"Awaiting First Field Report — Use Data Ingestion or Time Agent to begin tracking."* with a quick button `Load Sample DPR`.
- **Error State:** If data sync error occurs, displays an alert banner at top with a retry button.

---

## 2. Data Ingestion Hub (`/ingestion`)

- **Primary Persona:** Site Supervisor / Discipline Engineer / Data Entry Operator
- **Purpose:** Multi-modal intake gateway supporting free-text DPRs, discipline spreadsheets, scanned site diaries, and voice transcripts.
- **Layout Architecture:**
  - **Top Banner (1-Click Sample Ingestion Bar):**
    - 4 quick preset buttons: `Load Piping DPR`, `Load CSV Spreadsheet`, `Load Scanned Diary`, `Load Voice Audio Note`.
  - **Left Section (50%): Dropzone & Input Workspace:**
    - Tabs: `Paste Free-Text DPR` | `Upload File (CSV/PDF)` | `Simulate Scanned Diary`.
    - Metadata Form: `Source Name`, `Discipline (Auto/Select)`, `Submitter Name`, `Date Hint`.
    - Primary Action Button: `Process Ingested Data` (Triggers parsing & normalization).
  - **Right Section (50%): Ingestion Processing Queue:**
    - Real-time pipeline status stepper: `Received` $\rightarrow$ `Parsing` $\rightarrow$ `Normalized` $\rightarrow$ `Ready for Extraction`.
    - Live card showing detected fields, date normalization (`2026-09-12`), duplicate check status (`Unique`), and character count.
- **Empty State:** Clean dropzone with drag-and-drop graphic and sample preset chips.
- **Error State:** Submitting empty text triggers validation banner: *"Input text cannot be empty. Please enter report text or select a preset."*

---

## 3. Extraction Workspace (`/extraction`)

- **Primary Persona:** Discipline Engineer / Project Planner
- **Purpose:** Side-by-side verification and manual correction of structured engineering parameters against raw source text with phrase highlighting.
- **Layout Architecture:**
  - **Header Bar:** Field Record selector dropdown, Source Type badge (`DPR Report`), Submitter, Normalized Date (`2026-09-12`).
  - **Left Column (50%): Raw Source Document Viewer:**
    - Verbatim text pane with highlighted yellow spans (`<mark>`) corresponding to extracted entities.
    - Hovering an entity on the right lights up the corresponding phrase on the left.
  - **Right Column (50%): Structured Extracted Event Card:**
    - Editable fields: `Activity Description`, `Discipline`, `Location`, `Progress Method (Quantity/Percentage)`, `Reported Quantity (18)`, `Total Baseline Quantity (24)`, `Progress Value (75%)`, `Actual Start Date (2026-09-12)`, `Manpower Crew`, `Equipment Used`, `Delay Cause`.
    - Informational note: `Reported Progress: 75% | Implied Quantity: 18 of 24 joints (Unverified)`.
  - **Footer Action Bar:**
    - Secondary Action: `Reset Extracted Fields`.
    - Primary Action: `Proceed to Schedule Linker →` (Carries structured event to linking engine).
- **Empty State:** *"No un-extracted field records found. Select an ingested report from the header."*

---

## 4. Schedule Linker (`/linker`)

- **Primary Persona:** Project Planner
- **Purpose:** Explainable ranking of baseline L5/L6 activities against the extracted field event, with transparent 6-signal score breakdown and synonym mapping.
- **Layout Architecture:**
  - **Top Banner:** Extracted Event Summary Card showing extracted description, quantity, location, and date.
  - **Center Area (Candidate Activity Cards - Ranked 1 to 3):**
    - **Card #1 (Top Match - e.g. PIP-L6-024A):**
      - Header: Activity Code, Description, WBS Path, Level 6 Badge.
      - Large Score Gauge: `94% Composite Confidence (HIGH)`.
      - Indicators: `Level 6 Priority Applied`, `Canonical Synonym Match`.
      - **Interactive Score Accordion:** Expands to show the 6 signal bars:
        - Text Similarity: 92% (30%)
        - Discipline Fit: 100% (20%)
        - Location Fit: 95% (15%)
        - WBS Fit: 90% (15%)
        - Date Consistency: 100% (10%)
        - Synonym Match: 88% (10%)
      - Textual Explanation Box: *"Matched via piping synonym 'spool erected' -> 'line erection' and exact line tag 'Line 24-XX'."*
    - **Card #2 & #3 (Alternative Matches):** Displays competing activities with delta scores and mismatch reasons.
  - **Action Controls per Card:**
    - `Fast-Track Approve` (if $\ge 85\%$)
    - `Send to Review Queue`
    - `Split into 1:N Activities`
- **Ambiguity Warning:** If score gap $<10\%$, card displays flashing alert: `⚠️ Ambiguous Candidates (<10% gap) — Planner Review Required`.

---

## 5. Planner Review Queue (`/review`)

- **Primary Persona:** Project Planner
- **Purpose:** Triage and decision hub for pending schedule updates, 1:N granularity allocations, out-of-sequence exceptions, and unmapped scope proposals.
- **Layout Architecture:**
  - **Top Filter Bar:**
    - Filter Tabs: `All (7)` | `High Confidence (Fast-Track)` | `Review Required` | `Unmatched / New Scope` | `Out-of-Sequence`.
    - Discipline Dropdown, Search Input.
  - **Queue Table / Card List:**
    - Each row displays: Source Type icon, Extracted Event, Top Candidate L6 Code, Confidence Pill, Exception Flag, Action Buttons.
  - **Action Modals:**
    - **1:N Granularity Splitter Modal:** Allows distributing composite field notes (e.g. joint completion) across Fit-up (20%), Welding (50%), and NDT (30%) sliders summing to 100%.
    - **Out-of-Sequence Predecessor Modal:** Warns if predecessors are $<100\%$ complete; requires mandatory justification text before confirming.
    - **New Activity Proposal Modal:** Form for converting unmapped records into proposed change-order activities.
- **Empty State:** *"Zero pending items in review queue. All field updates are verified and synchronized."*

---

## 6. Time Agent (`/time-agent`)

- **Primary Persona:** Site Supervisor
- **Purpose:** Conversational, rugged field assistant enabling progress capture in under 30 seconds via voice transcripts and quick chips.
- **Layout Architecture:**
  - **Left / Center (70%): Conversational Chat Feed:**
    - WhatsApp-style message stream.
    - Message bubbles: Supervisor prompts and Time Agent response cards.
    - **Immediate Entity Preview Card inside chat:**
      - Shows: `Discipline [Detected]`, `Target Activity [PIP-L6-024A]`, `Progress [18/24 Joints (75%)]`, `Confidence [94%]`.
      - Two action buttons: `Confirm & Log Entry` (Green) | `Edit Details` (Slate).
  - **Bottom Input Bar:**
    - Text input with placeholder: *"Type progress report or click a preset chip below..."*
    - Quick Action Chips: `Start Activity`, `Update Progress %`, `Report Delay`, `Mark Completed`.
  - **Right Panel (30%): Quick Transcript Audio Presets:**
    - 4 selectable real-world audio transcripts with speaker icons:
      1. *"Piping crew erected Line 24-XX spool in north rack; 18 of 24 joints complete."*
      2. *"Pump P-204 alignment completed today; final shimming is pending."*
      3. *"Hydrotest held because test pump was unavailable."*
      4. *"Cable tray installation in substation corridor: 42 meters complete."*
- **Feedback State:** Submitting renders instant notification: *"Captured! Progress event queued for discipline verification."*

---

## 7. Live Schedule & Gantt View (`/schedule`)

- **Primary Persona:** Project Planner / Project Manager
- **Purpose:** Interactive schedule visualization comparing baseline planned bars against actual execution bars with +/- variance badges and PMIS synchronization.
- **Layout Architecture:**
  - **Top Toolbar:**
    - Date zoom controls (`Day` | `Week` | `Month`).
    - Project Data Date marker: `Status Cutoff: 2026-09-19`.
    - Primary Action: `Simulate PMIS Sync 🔄` (Updates simulated Primavera P6).
    - Secondary Action: `Inspect P6 Payload 📋` (Opens mock payload drawer).
  - **Gantt Chart Canvas:**
    - **Left Activity Table (35%):** Activity Code, Description, Discipline, Baseline Duration, Actual Duration, % Complete, Variance.
    - **Right Timeline Area (65%):** Calendar grid with vertical Data Date indicator:
      - Top Bar: Planned Baseline (Slate Gray).
      - Bottom Bar: Actual Execution (Teal in-progress, Green completed).
      - Connecting dependency arrow lines between predecessors and successors.
      - Elapsed variance badge: `+1.0 Days (Indicative Elapsed Variance)`.
  - **P6 Mock Payload Slide-Out Drawer:**
    - Displays exact JSON/XML sent to mock adapter with status 200 OK response.
- **Empty State:** N/A (Always renders baseline activities).

---

## 8. Analytics & What-If Simulator (`/analytics`)

- **Primary Persona:** Project Manager / Executive Sponsor
- **Purpose:** Progress tracking, S-curves, velocity benchmarks, indicative completion forecasting, and downstream delay impact simulation.
- **Layout Architecture:**
  - **Section 1: Planned vs. Actual S-Curve Chart:**
    - Interactive line chart displaying Planned Cumulative % vs. Actual Cumulative % over project timeline.
  - **Section 2: Discipline Velocity & Productivity Cards:**
    - Piping: `6.0 Joints / Day` (On Track)
    - Electrical: `21.0 m / Day` (Slight Slippage)
    - Civil: `15.0 m³ / Day` (On Track)
  - **Section 3: Indicative Forecast Completion Card:**
    - Banner: `Prototype Forecast — Indicative`.
    - Forecast Finish: `2027-05-04` (Projected Slippage: `+4.0 Days`).
    - Formula Display: $$\text{Forecast Finish} = \text{Data Date (2026-09-19)} + \frac{\text{Remaining Work}}{\text{7-Day Observed Velocity}}$$
  - **Section 4: Interactive What-If Delay Simulator:**
    - Dropdown: `Select Activity to Delay (e.g. Line 24-XX Hydrotest)`.
    - Slider: `Add Delay Duration: [ +5 Days ]`.
    - Root Cause: `Equipment Unavailable (Test Pump)`.
    - Impact Table: Shows downstream activities (`Pump Alignment`, `Commissioning Milestone`) shifting by +5 days without corrupting the baseline.
    - Banner: `Simulation Mode Active — No Schedule Data Modified`.

---

## 9. Project Memory (`/memory`)

- **Primary Persona:** Future Estimator / Planning Engineer
- **Purpose:** Searchable institutional repository of execution benchmarks, recurring delay patterns, and lessons learned.
- **Layout Architecture:**
  - **Top Search & Filter Bar:** Search input (e.g. *"test pump"*, *"north rack"*), Discipline filter pills, Memory Type tabs (`All` | `Productivity` | `Delays` | `Bottlenecks` | `Lessons`).
  - **Card Grid (3 Columns):**
    - Each memory card displays: Type Icon, Title, Discipline Badge, Metric Benchmark (e.g. `6.0 joints/day`), Narrative Summary, Recurring Count (`3 occurrences`), Date Range observed, and Source Event Link.
- **Empty State:** *"No project memory insights match your search filter."*

---

## 10. Append-Only Audit Trail (`/audit`)

- **Primary Persona:** Auditor / Contract Claim Specialist / Lead Planner
- **Purpose:** Immutable, chronological record of every state mutation with clickable 6-point evidence lineage.
- **Layout Architecture:**
  - **Header Banner:** `Append-Only Audit Trail (Prototype) — Records cannot be modified or deleted`.
  - **Audit Table:**
    - Columns: `Timestamp`, `Actor`, `Entity Modified`, `Action (CREATE/EXTRACT/APPROVE/SYNC)`, `Reason / Justification`, `Diff / Snapshot`, `Evidence Trace`.
    - Action Button on each row: `View Evidence Lineage →`.
  - **6-Point Evidence Trace Drawer:**
    - Interactive vertical tree displaying:
      1. `Source Document (DPR_Piping_12Sep.pdf)`
      2. `Raw Snippet ("Piping crew erected spool...")`
      3. `Structured Event (ev-001, Qty: 18, 75%)`
      4. `Match Candidate (PIP-L6-024A, 94% confidence)`
      5. `Planner Approval (S. Ghosh, 2026-09-12 18:15)`
      6. `Approved Schedule Update (P6 In Progress 75%)`

---

## 11. Settings & Data Dictionary (`/settings`)

- **Primary Persona:** System Administrator / Lead Planner
- **Purpose:** Configuration of confidence thresholds, engineering taxonomies, synonym mappings, and privacy redaction.
- **Layout Architecture:**
  - **Section 1: Confidence Gating Thresholds:**
    - Sliders: `Fast-Track Auto-Link Threshold [ 85% ]` and `Review Queue Cutoff [ 60% ]`.
  - **Section 2: Worker & Contractor Privacy Mode:**
    - Large toggle switch: `Enable Data Masking (ON/OFF)`.
    - Live preview showing supervisor names converted to `[REDACTED-SUPERVISOR]` and contractor names to `[CONTRACTOR-SECURE]`.
  - **Section 3: Oil & Gas Construction Synonym Dictionary:**
    - Editable key-value mapping showing terms like `spool erected` $\rightarrow$ `line erection`.
  - **Section 4: System Reset & Diagnostic Controls:**
    - Prominent danger button: `Reset Entire Application to Baseline Data ↺`.

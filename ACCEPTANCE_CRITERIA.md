# ACCEPTANCE CRITERIA SPECIFICATION
## SIH 2026 — Problem Statement 26122 (FieldLink Platform)
**Project Title:** Intelligent Data Capture & Schedule-Linking Layer for Infrastructure Project Management: Real-Time Actual Progress Tracking  
**Standard Format:** Behavior-Driven Development (BDD) / Gherkin (Given-When-Then)  

---

## 1. Data Ingestion & Pre-processing

### AC-ING-01: Free-Text Daily Progress Report (DPR) Ingestion
```gherkin
Given the user is on the "Data Ingestion" screen (/ingestion)
When the user selects the "Piping Daily Report" preset sample
And clicks "Process Ingested Data"
Then the ingestion pipeline state advances: "Received" -> "Parsing" -> "Normalized" -> "Ready for Extraction"
And the raw text is parsed into discipline "PIPING" and normalized date "2026-09-12"
And the system creates a new FieldRecord entry with status "ready_for_extraction".
```

### AC-ING-02: Discipline Spreadsheet Simulation
```gherkin
Given the user is on the "Data Ingestion" screen
When the user clicks "Load Sample Spreadsheet (CSV)"
Then the system displays a tabular preview with columns: "Activity Description", "Line / Tag", "Discipline", "Date", "Progress", "Location"
And parsing recognizes 100% of the structured rows
And advances each row to the extraction queue.
```

### AC-ING-03: Scanned Site Diary OCR Simulation
```gherkin
Given the user selects the "Scanned Site Diary" ingestion sample
When the document is processed
Then the system displays the simulated scanned notebook image with overlaid bounding boxes
And extracts the text "Cable tray installation completed in substation corridor. Approx. 42 metres installed on 14 Sep 2026."
And populates discipline as "ELECTRICAL" with 0.95 date confidence.
```

### AC-ING-04: Duplicate Progress Event Detection
```gherkin
Given an existing field record for "Line 24-XX spool erection" on date "2026-09-12" exists in the database
When a new report describing identical work on "Line 24-XX" for the same date is ingested
Then the system flags the second record with badge "Possible Duplicate"
And displays a warning: "Potential duplicate work event detected. Double-counting progress is blocked pending planner review."
And provides actions: "Mark as Unique", "Confirm Duplicate (Archive)", or "Merge Evidence".
```

---

## 2. Multi-Attribute Activity Extraction

### AC-EXT-01: Side-by-Side Verification & Source Highlighting
```gherkin
Given the user is on the "Extraction Workspace" screen (/extraction)
When viewing an extracted event for "Line 24-XX Spool Erection"
Then the screen displays a two-column split layout: Raw Source Document (Left) and Structured Event Card (Right)
And clicking on the "18 of 24 joints" quantity field highlights the exact phrase "18 of 24 joints completed" in yellow in the left raw text pane.
```

### AC-EXT-02: Quantity-Based vs. Percentage Progress Measurement
```gherkin
Given a field report stating "Piping crew erected spool for Line 24-XX... 18 of 24 joints completed"
When the system extracts progress parameters
Then "progressMethod" is set to "quantity-based"
And "actualQuantity" is set to 18
And "plannedQuantity" is set to 24
And "progressValue" is calculated exactly as 75.0%
And if percentage is reported directly without units, the UI displays: "Reported Progress: 75% | Implied Quantity: 18 of 24 joints (Unverified)".
```

### AC-EXT-03: Inline Field Correction by Discipline Engineer
```gherkin
Given an extracted event has an ambiguous location token
When a user switches role to "Discipline Engineer"
And edits the location field from "Rack" to "North Pipe Rack - Bay 3 to 7"
And clicks "Save & Update Extraction"
Then the structured event updates immediately
And an audit log entry records the before and after values with author "Discipline Engineer".
```

---

## 3. L5/L6 Schedule Linking & Explainable Matching

### AC-LNK-01: Multi-Signal Match Scoring & Explainability
```gherkin
Given an extracted event "Piping crew erected spool for Line 24-XX in north pipe rack"
When evaluated by the Schedule Linker engine
Then candidate "PIP-L6-024A: Erect Line 24-XX" is ranked #1 with composite score >= 90%
And clicking "View Score Breakdown" reveals:
  | Signal | Weight | Score |
  | Text Similarity | 30% | >= 90% |
  | Discipline Fit | 20% | 100% |
  | Location Fit | 15% | >= 90% |
  | WBS Fit | 15% | >= 90% |
  | Date Consistency | 10% | 100% |
  | Terminology Match | 10% | >= 85% |
And displays clear textual explanation: "Matched via piping synonym 'spool erected' -> 'line erection' and exact line code 'Line 24-XX'."
```

### AC-LNK-02: Level 6 Terminal Activity Priority
```gherkin
Given a field note mentions "Line 24-XX erection started today"
And the baseline schedule contains both "PIP-L5-024: Line 24-XX Installation" (Level 5) and "PIP-L6-024A: Erect Line 24-XX" (Level 6)
When the matching engine ranks candidates
Then the Level 6 executable activity "PIP-L6-024A" is ranked higher than the Level 5 parent work package
And an indicator badge displays "Level 6 Executable Priority Applied".
```

### AC-LNK-03: Score Gap Demotion (<10% Ambiguity Rule)
```gherkin
Given an ambiguous field report "Foundation work progressing near compressor area"
When the top two candidate activities score 72% and 66% (gap = 6% < 10%)
Then the record is automatically flagged with warning: "Ambiguous Candidates (<10% score gap)"
And is demoted from Fast-Track to "Mandatory Planner Review Required".
```

---

## 4. Confidence Gating & Planner Review Queue

### AC-REV-01: Strict Confidence Threshold Gating
```gherkin
Given progress events are classified by the matching engine
Then records with score >= 85% are assigned badge "HIGH (Fast-Track Eligible)"
And records with score between 60% and 84% are assigned badge "MEDIUM (Planner Review Required)"
And records with score < 60% are assigned badge "LOW / UNMATCHED (New Activity Candidate)"
And the system strictly prevents records with score < 85% from updating the schedule without explicit planner confirmation.
```

### AC-REV-02: Granularity Handling — 1:N Activity Splitting
```gherkin
Given an extracted field event "Completed joint fit-up, welding, and radiography for Line 24-XX"
When the planner clicks "Split into 1:N Activities" in the Review Queue
Then a modal opens displaying the Piping Joint Allocation template:
  - PIP-L6-024A (Fit-up): Default 20%
  - PIP-L6-024B (Welding): Default 50%
  - PIP-L6-024C (NDT / Radiography): Default 30%
When the planner confirms total allocation equals 100%
And clicks "Apply 1:N Split"
Then the system creates 3 child progress events linked to the parent field record
And allocation percentages distribute the field record across activities without directly setting each activity's percent complete
And records the planner's justification in the audit trail.
```

### AC-REV-03: Unmatched / New Scope Activity Proposal
```gherkin
Given an unmapped record "Temporary access platform installed near tank farm" (Confidence < 60%)
When the planner reviews the record in the Review Queue
And clicks "Propose as New Activity"
Then a proposal form opens pre-populated with:
  - Proposed Description: "Erect temporary access platform near tank farm"
  - Discipline: "CIVIL / STRUCTURAL"
  - Parent WBS: "Tank Farm Facilities"
When the planner approves the proposal
Then the activity is tagged "Proposed Change Order / New Scope"
And preserved in the schedule with a distinct visual indicator.
```

---

## 5. Schedule Updates & Out-of-Sequence Handling

### AC-SCH-01: Approved Schedule Mutation & Baseline Variance
```gherkin
Given a planner approves event "PIP-L6-024A: Erect Line 24-XX" with actual start "2026-09-12" and 75% progress
And the project Data Date is "2026-09-19" and baselineDuration is 6 days
When the planner clicks "Approve & Update Schedule"
Then the Live Schedule updates activity "PIP-L6-024A":
  - actualStart = "2026-09-12"
  - statusDate = "2026-09-19"
  - percentComplete = 75%
  - status = "In Progress"
  - actualDuration = Data Date ("2026-09-19") - actualStart ("2026-09-12") = 7.0 Days
  - durationVariance = actualDuration (7.0) - baselineDuration (6.0) = "+1.0 Days" (indicative elapsed variance)
And the Gantt chart renders an actual execution bar beneath the baseline bar.
```

### AC-SCH-02: Out-of-Sequence Execution Pause
```gherkin
Given activity "PIP-L6-024A" has predecessor "CIV-L5-012: Equipment Foundation" which is only 40% complete
When the planner attempts to approve the actual progress for "PIP-L6-024A"
Then the system displays an alert modal:
  "Out-of-Sequence Warning: Predecessor CIV-L5-012 is incomplete (40%). Schedule synchronization paused."
And requires the planner to enter a mandatory "Planner Justification Note"
When the planner enters "Work proceeded on temporary structural shoring" and clicks "Confirm Override"
Then the actual progress is recorded with the justification note
And predecessor baseline logic is left completely unmodified.
```

### AC-SCH-03: Simulated PMIS / P6 Synchronizer & Mock Payload Inspection
```gherkin
Given approved activities exist with status "pending_sync"
When the user clicks "Simulate PMIS Sync" in the Live Schedule view
Then the sync status transitions to "Synchronized to PMIS" with a green checkmark
And clicking "Inspect P6 Payload" opens a slide-out drawer displaying representative P6-compatible JSON/XML:
  ```json
  {
    "activityCode": "PIP-L6-024A",
    "actualStartDate": "2026-09-12T08:00:00+05:30",
    "physicalPercentComplete": 75.0,
    "status": "In Progress"
  }
  ```
And clearly displays label: "Simulated P6 EPPM Adapter — Demonstration Payload".
```

---

## 6. Audit Trail & 6-Point Traceability

### AC-AUD-01: Append-Only Immutable Audit Log
```gherkin
Given any mutation in the application (creation, extraction edit, match approval, PMIS sync)
When navigating to the "Audit Trail" screen (/audit)
Then the table lists the entry with: Actor, Timestamp, Entity Type, Action, and Before/After Diff
And existing audit rows have no edit or delete controls
And a visual banner states: "Append-Only Audit Trail (Prototype)".
```

### AC-AUD-02: Clickable 6-Point Evidence Trace
```gherkin
Given an approved activity in the Live Schedule
When the user clicks "View Evidence Trace"
Then an expandable interactive chain renders:
  [Source File: DPR_Piping_12Sep.pdf]
    -> [Raw Snippet: "Piping crew erected spool for Line 24-XX..."]
    -> [Structured Event: ev-20260912-001 (Qty: 18, 75%)]
    -> [Candidate Match: PIP-L6-024A (94% confidence)]
    -> [Planner Approval: S. Ghosh (2026-09-12 18:15)]
    -> [Approved Schedule Update: P6 In Progress (75%)]
And clicking any node displays the underlying metadata in a side drawer.
```

---

## 7. Analytics, What-If Simulator & Indicative Forecasting

### AC-ANA-01: Dynamic S-Curve & Productivity Refresh
```gherkin
Given new actual progress is approved for piping and civil disciplines
When navigating to the "Analytics" screen (/analytics)
Then the Planned vs. Actual S-Curve chart renders the updated actual cumulative progress curve
And the Discipline Productivity card shows: "Piping: 6.0 joints/day" and "Electrical: 21.0 m/day".
```

### AC-ANA-02: Indicative Forecast Finish Calculation
```gherkin
Given the project Data Date is "2026-09-19"
And remaining piping work is 6 joints with observed productivity of 1.5 joints/day
When the Analytics view computes completion
Then the Indicative Forecast finish is calculated:
  Forecast Finish = 2026-09-19 + (6 / 1.5) days = 2026-09-23
And displays badge: "Prototype Forecast — Indicative (+3.0 Days Baseline Variance)".
```

### AC-ANA-03: Interactive What-If Delay Simulator
```gherkin
Given the user is on the "What-If Delay Simulator" tab in Analytics
When the user selects delay cause "Test pump unavailable on Line 24-XX"
And enters an estimated duration of "5 days"
Then the simulator calculates and highlights affected downstream activities:
  - PIP-L6-025 (Hydrotest Line 24-XX): +5 Days Projected Delay
  - ROT-L6-037 (Pump Alignment): Affected downstream handover
And displays a banner: "Simulation Mode Active — No Schedule Data Modified".
```

---

## 8. Institutional Project Memory

### AC-MEM-01: Automated Memory Synthesis & Search
```gherkin
Given approved events with duration variances and logged delay causes
When navigating to the "Project Memory" screen (/memory)
Then the system displays cards categorized by "productivity", "delay", "bottleneck", and "duration"
And searching for "test pump" returns the insight card:
  "Hydrotest delayed across Line 24-XX due to unavailable high-pressure test pump; recurring pattern (3 occurrences)."
And filtering by discipline "PIPING" displays average erection productivity metrics.
```

---

## 9. Time Agent (Supervisor Interface)

### AC-TIM-01: Conversational Logging with Instant Entity Preview
```gherkin
Given the user is on the "Time Agent" screen (/time-agent)
When the user clicks the preset chip:
  "Piping crew started erecting Line 24-XX spool at north rack today. 18 of 24 joints are complete."
Then the chat renders the message
And immediately displays an Entity Preview Card:
  - Discipline: Piping [Detected]
  - Target Activity: PIP-L6-024A — Erect Line 24-XX (94% confidence)
  - Work Done: 18 of 24 joints (75%)
  - Status: Captured
When the user clicks "Confirm & Log Entry"
Then the entry is queued for ingestion with separate matching and approval statuses.
```

---

## 10. Privacy Mode & Data Redaction

### AC-SEC-01: Dynamic Worker & Contractor Redaction
```gherkin
Given the user views the Ingestion, Audit Trail, or Review Queue
When the user toggles "Privacy & Redaction Mode" to "ON" in the top bar
Then all inspector names (e.g. "R. Sharma") are replaced with "[REDACTED-SUPERVISOR]"
And contractor names are replaced with "[CONTRACTOR-SECURE]"
And turning the toggle "OFF" restores the original synthetic names.
```

---

## 11. Persistence & Demo Reset

### AC-SYS-01: LocalStorage Persistence & Instant Reset
```gherkin
Given the user has approved several events, updated the schedule, and generated audit entries
When the user refreshes the browser page
Then all approved states, schedule progress %, and audit logs remain intact
When the user clicks the "Reset Demo" button in the top bar and confirms
Then LocalStorage is reset and re-hydrated with the clean Baghewala baseline dataset.
```

# SYNTHETIC FIELD INPUTS & TEST CASES
## SIH 2026 — Problem Statement 26122 (Oil India Limited)
**Target Project:** Baghewala Surface Facilities Expansion  
**Status Date (Cutoff):** `2026-09-19`  

> [!NOTE]
> **Synthetic Prototype Data Disclaimer:**  
> All project names, activities, dates, progress records, personnel references, and schedule data are synthetic and created solely for demonstration. The prototype does not use live Oil India project data.

---

## 1. Test Input Matrix Overview

| Case ID | Channel / Modality | Raw Field Input Snippet | Primary Discipline | Expected L5/L6 Match | Expected Confidence | System Gating & Action |
|---|---|---|---|---|---|---|
| **INP-01** | Free-Text DPR | *"Piping crew erected spool for Line 24-XX in north pipe rack. Work started 12 Sep and 18 of 24 joints completed."* | `PIPING` | `PIP-L6-024A` | **94% (HIGH)** | Fast-Track Review / 1-Click Approve |
| **INP-02** | CSV Spreadsheet | `Spool erected \| Line 24-XX \| Piping \| 12-09-2026 \| 75% \| North rack` | `PIPING` | `PIP-L6-024A` | **92% (HIGH)** | Fast-Track Tabular Ingestion |
| **INP-03** | Scanned Site Diary | *"Cable tray installation completed in substation corridor. Approx. 42 metres installed on 14 Sep 2026."* | `ELECTRICAL` | `ELE-L5-041` | **88% (HIGH)** | OCR Bounding Box Simulation |
| **INP-04** | Time Agent Voice | *"Pump P-204 alignment completed today; final shimming is pending."* | `ROTATING_EQUIP` | `ROT-L6-037` | **91% (HIGH)** | Conversational Audio Card |
| **INP-05** | Ambiguous Report | *"Foundation work progressing near compressor area."* | `CIVIL` | `CIV-L5-012` vs `ROT-L6-038` | **68% vs 64% (MEDIUM)** | Demoted: `<10%` Score Gap Ambiguity |
| **INP-06** | Unmatched Report | *"Temporary access platform installed near tank farm."* | `CIVIL` | None ($\le 42\%$) | **42% (UNMATCHED)** | Low Confidence: Propose New Activity |
| **INP-07** | Equipment Delay | *"Hydrotest on Line 24-XX held because the high-pressure test pump was unavailable."* | `PIPING` | `PIP-L6-025` | **89% (HIGH)** | Captures Delay Cause & Pattern |
| **INP-08** | Out-of-Sequence | *"Line 24-XX spool erection completed before rack foundation CIV-L5-012 signed off."* | `PIPING` | `PIP-L6-024A` | **94% (HIGH)** | Pauses Sync: Predecessor Incomplete |
| **INP-09** | Duplicate Record | Evening contractor Excel re-submitting Line 24-XX spool erection on 12-Sep-2026 | `PIPING` | `PIP-L6-024A` | **94% (HIGH)** | Flags `possible-duplicate`, blocks 2x count |

---

## 2. Detailed Synthetic Input Specifications

### Input 1: High-Confidence Daily Progress Report (DPR)
- **ID:** `inp-dpr-001`
- **Channel:** `report` (Free-Text Paste / Upload)
- **Author:** `R. Sharma (Site Supervisor - Piping)`
- **Raw Input:**
  ```text
  Daily Progress Report - Baghewala Surface Facilities Expansion
  Date: 12-Sep-2026 | Shift: Day | Discipline: Piping
  Location: North Pipe Rack (Bay 3 to 7)
  Crew: 6 welders, 4 riggers, 1 supervisor | Equipment: Hydra Crane 14T (CR-04)
  Notes:
  Piping crew erected spool for Line 24-XX in the north pipe rack. Work started on 12 Sep 2026 and 18 of 24 joints completed. Quality inspection clearance obtained for joints J-01 to J-18.
  ```
- **Extraction Result:**
  - `discipline`: `PIPING`
  - `activityDescription`: `Spool erection for Line 24-XX`
  - `actualStart`: `2026-09-12`
  - `progressMethod`: `quantity-based`
  - `actualQuantity`: `18` | `plannedQuantity`: `24` | `progressUnit`: `joints`
  - `progressValue`: `75.0%`
  - `location`: `North Pipe Rack - Bay 3 to 7`
  - `manpower`: `6 welders, 4 riggers, 1 supervisor`
  - `equipment`: `Hydra Crane 14T (CR-04)`
- **Matching Result:**
  - Candidate: `PIP-L6-024A (Erect Line 24-XX)`
  - Score Breakdown: Text 92%, Discipline 100%, Location 95%, WBS 90%, Date 100%, Synonym 88% $\rightarrow$ **Final: 94.2%**
  - Gating: **HIGH (Fast-Track Eligible)**

---

### Input 2: Tabular Spreadsheet Record (CSV Simulation)
- **ID:** `inp-csv-002`
- **Channel:** `spreadsheet` (Discipline Progress Log)
- **Author:** `M. Joshi (Contractor Lead)`
- **Raw CSV Row:**
  ```csv
  Activity Description,Line / Tag,Discipline,Execution Date,Quantity,Unit,Progress %,Location
  Spool erected,Line 24-XX,Piping,12-09-2026,18,joints,75%,North rack
  ```
- **Extraction Result:** Direct columnar extraction into structured `ProgressEvent`.
- **Matching Result:** Matches `PIP-L6-024A` with **92.0%** confidence.

---

### Input 3: Scanned Engineer Diary (OCR Bounding Box Simulation)
- **ID:** `inp-diary-003`
- **Channel:** `diary` (Simulated Handwritten / Scanned Field Notebook)
- **Author:** `V. Patel (Electrical Field Engineer)`
- **Raw Simulated OCR Output:**
  ```text
  [Site Diary Entry #E-44 - Date: 14/09/2026]
  Substation to Process corridor:
  Cable tray installation completed in substation corridor.
  Approx. 42 metres installed on 14 Sep 2026.
  Supports aligned; tray earthing jumpers pending.
  ```
- **Extraction Result:**
  - `discipline`: `ELECTRICAL`
  - `actualStart`: `2026-09-14`
  - `actualQuantity`: `42` | `plannedQuantity`: `120` | `progressUnit`: `meters`
  - `progressValue`: `35.0%`
- **Matching Result:** Matches `ELE-L5-041 (Cable Tray Installation)` with **88.0%** confidence.

---

### Input 4: Voice Transcript (Time Agent Conversational Input)
- **ID:** `inp-voice-004`
- **Channel:** `voice` (Transcribed Audio Prompt)
- **Author:** `K. Singh (Mechanical Supervisor)`
- **Raw Transcript:**
  ```text
  "Pump P-204 alignment completed today; final shimming is pending."
  ```
- **Extraction Result:**
  - `discipline`: `ROTATING_EQUIP`
  - `activityDescription`: `Pump P-204 alignment`
  - `actualStart`: `2026-09-15`
  - `progressValue`: `80.0%` (Shimming pending)
- **Matching Result:** Matches `ROT-L6-037 (Pump P-204 Alignment)` with **91.0%** confidence.

---

### Input 5: Ambiguous Field Record (Score Gap < 10%)
- **ID:** `inp-ambig-005`
- **Channel:** `report`
- **Author:** `A. Khan (Civil Supervisor)`
- **Raw Text:**
  ```text
  Foundation work progressing near compressor area. Grouting materials staged.
  ```
- **Matching Result:**
  - Candidate 1: `CIV-L5-012 (Equipment Foundation)` — **68.0%**
  - Candidate 2: `ROT-L6-038 (Compressor Grouting)` — **64.0%**
  - **Score Gap:** $|68.0 - 64.0| = 4.0\% < 10.0\%$
- **System Action:** Flagged with `isAmbiguous: true`; demoted to **Mandatory Planner Review Required**.

---

### Input 6: Unmatched Record (New Scope / Change Order Candidate)
- **ID:** `inp-unmatch-006`
- **Channel:** `report`
- **Author:** `S. Mehta (Safety Officer)`
- **Raw Text:**
  ```text
  Temporary access platform installed near tank farm for emergency valve access.
  ```
- **Matching Result:** Top candidate score is **42.0%** ($<60\%$).
- **System Action:** Classified as `UNMATCHED`. Routed to review queue with option **`Propose as New Activity`**.

---

### Input 7: Equipment Delay Record
- **ID:** `inp-delay-007`
- **Channel:** `report`
- **Author:** `R. Sharma (Site Supervisor - Piping)`
- **Raw Text:**
  ```text
  Hydrotest on Line 24-XX held because the high-pressure test pump was unavailable. Mobilization awaited from Jodhpur depot.
  ```
- **Matching Result:**
  - Candidate: `PIP-L6-025 (Hydrotest Line 24-XX)` — **89.0% Confidence**
  - Extracted Delay Cause: `Equipment unavailable (Test pump)`
- **System Action:** Logs delay cause, links to `DelayPattern (del-01)`, and updates project risk metrics.

---

### Input 8: Out-of-Sequence Record (Predecessor Incomplete)
- **ID:** `inp-seq-008`
- **Channel:** `report`
- **Scenario:** Supervisor reports `PIP-L6-024A (Spool Erection)` in progress, but predecessor `CIV-L5-012 (Equipment Foundation)` is only 50% complete.
- **System Action:** Raises `Out-of-Sequence Warning`. Pauses schedule sync until planner inputs mandatory override justification.

---

### Input 9: Duplicate Progress Record
- **ID:** `inp-dup-009`
- **Channel:** `spreadsheet`
- **Scenario:** Contractor evening log submits identical entry for `Line 24-XX` on `12-Sep-2026`.
- **System Action:** Matches `inp-dpr-001` with $96\%$ similarity; tagged as `possible-duplicate`; prevents double-counting progress until reviewed.

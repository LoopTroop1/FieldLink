# GRILL-ME EVALUATION & ARCHITECTURAL DECISIONS
## SIH 2026 — Problem Statement 26122 (FieldLink Platform)
**Role Perspectives:** SIH Evaluation Panel, Primavera P6 Lead Planner, Oil & Gas Construction Manager, Principal AI Architect, Skeptical Product Auditor.

---

## 1. Executive Evaluation Summary

To ensure the prototype withstands intense scrutiny from both technical software judges and veteran infrastructure project planners, we subjected the architecture, workflow, and data models to a rigorous cross-examination.

Every potential point of failure, ambiguity, and operational risk was classified into four action categories:
- **[CRITICAL]:** Must be architecturally resolved and implemented in the prototype.
- **[IMPORTANT]:** Must have a concrete, demonstrable implementation in UI/logic.
- **[OPTIONAL]:** Implemented as high-value polish if time allows.
- **[DEFERRED]:** Acknowledged as production roadmap item; simulated in prototype.

---

## 2. Challenged Decisions & Resolutions

### Point 1: Matching Ambiguity & Activity Hierarchy (L5 vs. L6)
> **Challenge (P6 Lead Planner):**  
> *"In oil & gas schedules, L5 is a Work Package (e.g., PIP-L5-024 Line 24-XX Installation) while L6 is the executable step (e.g., PIP-L6-024A Erect Spool, PIP-L6-025 Hydrotest). If a supervisor says 'Line 24-XX work started today', both L5 and L6 will score high text similarity. How do you prevent incorrect auto-linking to the parent package instead of the field activity?"*

- **Classification:** **`CRITICAL`**
- **Decision & Resolution:**
  1. **Hierarchy Rule:** The matching engine enforces a strict **Level Preference Rule**: field execution updates prioritize Level 6 terminal activities over Level 5 parent packages. Parent WBS packages are only matched if no valid L6 child exists.
  2. **Verb & Keyword Filter:** Verbs like *"erected"*, *"welded"*, *"pulled"*, *"torqued"*, *"shred"*, *"aligned"* immediately boost L6 child activities. Verbs like *"tested"*, *"hydrotest"*, *"flushed"* specifically route to commissioning/test L6 activities.
  3. **Score Separation Gap:** If the score difference between Candidate #1 (e.g., 88%) and Candidate #2 (e.g., 84%) is **less than 10%**, the record is automatically demoted from "Fast-Track Review" to "Mandatory Planner Review" with an *"Ambiguous Candidates"* warning badge.

---

### Point 2: Schedule Logic Integrity & Out-of-Sequence Updates
> **Challenge (Construction Manager & Auditor):**  
> *"Field crews frequently work out of sequence due to site constraints. If a supervisor reports Line 24-XX spool erection completed, but the predecessor activity (CIV-L5-012 Equipment Foundation or PIP-L5-021 Pipe Rack Erection) is still at 30% complete in the schedule, will your system corrupt the schedule or blindly approve it?"*

- **Classification:** **`CRITICAL`**
- **Decision & Resolution:**
  1. **Predecessor Conflict Engine:** Before any match can be approved, the system runs a graph check against `predecessorIds`. If any predecessor activity has `percentComplete < 100%`, the system generates an **`Out-of-Sequence Warning`**.
  2. **Explicit Pause Behavior:** **An out-of-sequence warning does not automatically reject the field event. It pauses schedule synchronization until the planner confirms the actual execution context.**
  3. **Strict Non-Corrupting Rule:** The system **never modifies predecessor logic or downstream dates automatically**.
  4. **Defined Resolution Workflow:**
     $$\text{Predecessor Conflict Detected} \longrightarrow \text{Show Warning} \longrightarrow \text{Request Planner Justification} \longrightarrow \text{Approve Actual Progress or Reject}$$
     The planner can approve the actual progress with an explicit **Planner Justification Note** attached to the audit record (e.g., *"Erection proceeded on temporary scaffolding before rack completion"*).

---

### Point 3: Granularity Mismatch & 1:N Mapping Interface
> **Challenge (Technical Reviewer & SIH Judge):**  
> *"You claim to solve granularity mismatches where one field report covers multiple schedule activities (e.g. Fit-up + Welding + NDT). How does the planner actually handle this in the UI without complex mental math?"*

- **Classification:** **`CRITICAL`**
- **Decision & Resolution:**
  1. **Interactive Granularity Splitter Modal:** In both the Schedule Linker and Planner Review Queue, a dedicated action button **`Split into 1:N Activities`** is provided.
  2. **Allocation Semantics:**
     - *Example allocation of reported field work:*
       - `PIP-L6-024A — Fit-up`: 20% allocation
       - `PIP-L6-024B — Welding`: 50% allocation
       - `PIP-L6-024C — NDT`: 30% allocation
     - **Rule:** Allocation percentages represent the planner-defined distribution of the field record, not automatically calculated activity completion percentages. The total allocation **must equal exactly 100%**.
  3. **Pre-Configured Discipline Templates:** Planners can adjust the percentage or discrete quantity allocated to each sub-activity. The sum is validated to 100%, and each linked sub-activity receives a child progress event linked to the single parent field record.

---

### Point 4: Progress Semantics (Quantity vs. Percentage Reconciliations)
> **Challenge (P6 Planner):**  
> *"Supervisors often report raw numbers ('18 of 24 joints welded'), but sometimes report loose percentages ('about 75% done'). How do you convert that into Primavera progress without introducing rounding errors or mismatched percent-complete types?"*

- **Classification:** **`CRITICAL`**
- **Decision & Resolution:**
  1. **Quantity-First Priority:** Quantity-based progress is preferred whenever a measurable unit is available:
     $$\text{percentComplete} = \min\left(100\%, \frac{\text{actualQuantity}}{\text{plannedQuantity}} \times 100\%\right)$$
  2. **Implied Quantity as Unverified:** When a percentage is reported directly from the field, the system displays an **implied quantity for reference only**. The implied quantity **must not replace verified quantity** unless the planner explicitly confirms it.
  3. **UI Display Paradigm:**
     - `Reported Progress: 75%`
     - `Implied Quantity: 18 of 24 joints (Unverified / Indicative)`
     - `Verification Status: Planner Confirmed / Unverified`

---

### Point 5: Date Normalization & Project Data Date
> **Challenge (Data Auditor):**  
> *"Field reports come with ambiguous date formats ('12-09-2026' vs '09-12-2026'). How do you prevent chronological corruption?"*

- **Classification:** **`IMPORTANT`**
- **Decision & Resolution:**
  1. **ISO 8601 Standard:** All dates are normalized to `YYYY-MM-DD`.
  2. **Uncertain Date Flagging:** Ambiguous date strings are not silently guessed; the system displays the assumed format, provides a confidence score, and flags the record for confirmation if confidence < 0.90.
  3. **Status Data Date:** Project has an explicit **Data Date** (`2026-09-19`). All forecast calculations anchor on this Data Date:
     $$\text{Forecast Finish} = \text{Data Date} + \frac{\text{Remaining Quantity}}{\text{Observed Productivity}}$$

---

### Point 6: Duplicate Progress Detection & Resolution
> **Challenge (Domain Expert):**  
> *"A supervisor logs spool erection at 3 PM via Time Agent. The contractor submits an evening Excel log with the same spool. Will progress be double-counted to 150%?"*

- **Classification:** **`IMPORTANT`**
- **Decision & Resolution:**
  1. **Duplicate Candidate Grouping:** Records matching target activity, normalized date, discipline, and location are grouped automatically.
  2. **Block Double-Counting:** The system retains all source records for evidence but prevents double-counting progress until a planner resolves the group.
  3. **Explicit States:** `unique`, `possible-duplicate`, `confirmed-duplicate`, `duplicate-rejected`.

---

### Point 7: Supervisor Experience — Low Friction vs. Structured Data
> **Challenge (Skeptical Product Auditor):**  
> *"If your supervisor interface (Time Agent) looks like a complex SAP or Primavera data-entry screen, site workers in dusty desert conditions (like Baghewala, Rajasthan) will never use it. If it's too free-form, the NLP will hallucinate."*

- **Classification:** **`IMPORTANT`**
- **Decision & Resolution:**
  1. **Conversational + Quick Chips:** The Time Agent provides a conversational WhatsApp-style feed with large, rugged tap targets (*Start Activity*, *Log Progress*, *Report Delay*, *Mark Completed*).
  2. **Instant Entity Verification Card:** As text is entered or audio transcript selected, an instant preview card shows:
     - Discipline: **Piping [Auto-Detected]**
     - Target Line: **Line 24-XX**
     - Work Done: **18/24 Joints (75%)**
     - Status: **On Track**
  3. **One-Tap Confirm:** The supervisor only has to tap one large green button: *"Confirm & Log Entry"*. Matching and approval status are displayed separately.

---

### Point 8: Evidence Quality & Audit Trail
> **Challenge (Auditor & Judge):**  
> *"How do you prove that a schedule actual wasn't just made up by a planner?"*

- **Classification:** **`IMPORTANT`**
- **Decision & Resolution:**
  1. **Append-Only Audit Trail (Prototype):** Existing audit entries cannot be edited through the interface. Every correction creates a new entry containing before-and-after values, actor, timestamp, and reason.
  2. **Required Evidence Metadata:** Every approved event links to evidence attributes: `evidenceType` (`text` | `spreadsheet` | `scan` | `voice-transcript`), `evidenceUri`, `evidenceSnippet`, `sourceRow`, `sourcePage`.
  3. **Traceability:** 1-click navigation from any schedule bar back to the exact highlighted source sentence.

---

### Point 9: Session State & Persistence
> **Challenge (Technical Reviewer):**  
> *"What happens when the judge refreshes the browser page or navigates between routes? Will all approved records and schedule updates vanish?"*

- **Classification:** **`IMPORTANT`**
- **Decision & Resolution:**
  1. **Local Persistent Reactive Store:** State is backed by browser LocalStorage with automatic hydration from the synthetic Baghewala dataset.
  2. **Prominent 'Reset Demo' Button:** Dedicated control in the top bar allows anyone to restore the clean baseline state instantly with a single click.
  3. **Guided Demo Mode:** 1-click guided walkthrough automatically triggers the end-to-end piping scenario for immediate live judging impact.

---

### Point 10: Worker Privacy & Contractor Masking
> **Challenge (Domain Expert):**  
> *"Industrial capital facilities work with multiple engineering contractors. Some site disputes involve sensitive contractor names or individual labor claims."*

- **Classification:** **`OPTIONAL`**
- **Decision & Resolution:**
  1. **Global Privacy Toggle:** Top-level toggle in Settings and Top Bar: `Worker & Contractor Privacy Mode (Active/Inactive)`.
  2. When active, all inspector names, crew leads, and contractor identifiers are dynamically masked as `[REDACTED-CREW-A]` or `[CONTRACTOR-SECURE]` across all views, exports, and audit logs.

---

### Point 11: Production Primavera P6 Integration vs. Simulated Adapter
> **Challenge (P6 Planner & Auditor):**  
> *"Are you connecting to a live Oracle P6 EPPM server, and if not, how do you prove this isn't just a toy mockup?"*

- **Classification:** **`DEFERRED (Simulated for Prototype)`**
- **Decision & Resolution:**
  1. Live P6 EPPM enterprise cloud requires corporate VPN, Oracle WebLogic licenses, and active project locks that would fail in a hackathon environment.
  2. **Representative Mock Payloads:** The prototype displays representative P6-compatible mock payloads containing activity code, actual start, actual finish, and physical percent-complete fields. These payloads are for demonstration and are not production integration requests.
  3. **Mock Payload Inspection Drawer:** Planners can open a slide-out drawer in the Live Schedule module to inspect the exact simulated JSON/XML payload sent to the mock PMIS sync endpoint.

---

## 3. Comprehensive Decision Matrix

| Area | Challenge | Classification | Prototype Resolution |
|---|---|---|---|
| **L5 vs L6 Matching** | Parent package vs executable task confusion | **CRITICAL** | Level 6 priority rule; craft verb weighting; <10% score gap triggers planner review |
| **Schedule Integrity** | Out-of-sequence reporting | **CRITICAL** | Graph check on predecessors; pause schedule sync pending planner justification; never alter logic automatically |
| **Granularity** | 1:N field report mapping | **CRITICAL** | Dedicated 1:N splitter modal; planner-defined allocation % summing to 100% |
| **Progress Semantics** | Percentage and quantity may conflict | **CRITICAL** | Quantity-first rule; preserve reported value; treat implied quantity as unverified until confirmed |
| **Date Normalization** | Ambiguous or inconsistent date formats | **IMPORTANT** | Normalize to ISO `YYYY-MM-DD`; flag uncertain dates; anchor forecast on Data Date |
| **Duplicate Progress** | Same work reported through multiple sources | **IMPORTANT** | Group possible duplicates; block double-counting of progress until reviewed |
| **Supervisor UX** | Rugged, non-complex field entry | **IMPORTANT** | Time Agent chat feed with one-tap quick chips and immediate entity card preview |
| **Evidence Quality** | Unsubstantiated progress claims | **IMPORTANT** | Append-only audit trail; mandatory evidence snippet and metadata fields |
| **Indicative Forecasting** | Projecting realistic completion | **IMPORTANT** | Velocity-based completion forecast and interactive Critical Path & Downstream Impact Analysis |
| **Session State** | Page refresh data loss | **IMPORTANT** | LocalStorage persistence with top-bar instant "Reset Demo" button |
| **PII & Privacy** | Contractor & worker masking | **OPTIONAL** | Header privacy toggle dynamically masking personnel & contractor references |
| **P6 Integration** | Production credentials requirement | **DEFERRED** | P6-compatible PMIS adapter simulation with live representative mock payload inspection drawer |

---

## 4. Final Alignment Confirmation

All critical challenges, progress calculations, out-of-sequence pause behaviors, and architectural boundaries have been addressed and finalized.

We are ready to proceed with:
```text
/requirements
```

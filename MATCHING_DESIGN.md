# MATCHING & DUPLICATE ENGINE DESIGN SPECIFICATION
## SIH 2026 — Problem Statement 26122 (Oil India Limited)
**Project Title:** Intelligent Data Capture & Schedule-Linking Layer for Infrastructure Project Management: Real-Time Actual Progress Tracking  
**Target Context:** Baghewala Surface Facilities Expansion (Jaisalmer Basin, Rajasthan)  
**Document Type:** Technical Algorithm & Logic Specification  

---

## 1. Multi-Signal Matching Mathematical Formula

The matching engine ranks candidate Level 5 Work Packages and Level 6 Executable Activities against each extracted progress event using a transparent, multi-signal linear weighted scoring model:

$$\text{matchScore} = 0.30 \cdot S_{\text{text}} + 0.20 \cdot S_{\text{discipline}} + 0.15 \cdot S_{\text{location}} + 0.15 \cdot S_{\text{wbs}} + 0.10 \cdot S_{\text{date}} + 0.10 \cdot S_{\text{synonym}}$$

Where each component score $S_i \in [0, 100]$.

### Deterministic Demo Arithmetic Verification:
| Signal ($i$) | Weight ($W_i$) | Component Score ($S_i$) | Weighted Contribution ($W_i \times S_i$) | Rationale |
|---|---|---|---|---|
| **Text Similarity** | 0.30 | 92.0% | 27.60 | High token overlap; tag `'24-XX'` exact match boost (+25). |
| **Discipline Fit** | 0.20 | 100.0% | 20.00 | Exact match: `PIPING` $\leftrightarrow$ `PIPING`. |
| **Location Fit** | 0.15 | 95.0% | 14.25 | Exact zone match: `'North Pipe Rack'`. |
| **WBS Fit** | 0.15 | 90.0% | 13.50 | Branch match: `BAGH.SURF.PIP.RACK-NORTH`. |
| **Date Plausibility** | 0.10 | 94.0% | 9.40 | Event date `2026-09-12` falls within baseline window `2026-09-05` to `2026-09-18`. |
| **Synonym Match** | 0.10 | 100.0% | 10.00 | Phrase `'spool erected'` maps directly to schedule craft term. |
| **Total Base Score**| **1.00** | — | **94.75% $\approx$ 94.8%** | **Mathematically verified base score.** |

---

## 2. Component Scoring Algorithms

### 2.1 Signal 1: Text Similarity ($S_{\text{text}}$, Weight = 0.30)
Evaluates token-level and n-gram overlap between the extracted field description and candidate schedule description:
1. **Tokenization:** Lowercased, stripped of generic stop words (`work`, `today`, `started`, `completed`, `approx`).
2. **Jaccard Token Similarity:**
   $$J(A, B) = \frac{|A \cap B|}{|A \cup B|} \times 100$$
3. **Exact Equipment/Line Tag Boost:** If an engineering alphanumeric tag matches identically (e.g. `'24-XX'`, `'P-204'`, `'V-201'`), an automatic $+25$ point boost is added (capped at 100).

### 2.2 Signal 2: Discipline Fit ($S_{\text{discipline}}$, Weight = 0.20)
Enforces craft compatibility using a deterministic cross-discipline compatibility matrix:

| Field Detected Discipline | Schedule Activity Discipline | Compatibility Score ($S_{\text{discipline}}$) |
|---|---|---|
| Exact Match (e.g. `PIPING` $\rightarrow$ `PIPING`) | Same discipline | **100%** |
| `ELECTRICAL` | `INSTRUMENTATION` (Shared trays / cable pulling) | **70%** |
| `INSTRUMENTATION` | `ELECTRICAL` (Shared junction boxes) | **70%** |
| `ROTATING_EQUIP` | `STATIC_EQUIP` (Vessels & Pumps layout) | **60%** |
| `CIVIL` | `PIPING` (Foundations vs Rack Erection) | **20%** |
| Disparate Crafts (e.g. `HSE` vs `PIPING`) | Unrelated discipline | **0%** |

### 2.3 Signal 3: Location Fit ($S_{\text{location}}$, Weight = 0.15)
Evaluates spatial proximity within the Baghewala facility:
- **Exact Zone Match:** (e.g. `'North Pipe Rack'` $\leftrightarrow$ `'North Pipe Rack - Bay 3 to 7'`): **100%**
- **Partial Facility Match:** (e.g. `'Pipe Rack'` $\leftrightarrow$ `'North Pipe Rack'`): **75%**
- **General Plant Area:** (e.g. `'Battery Limit'`): **40%**
- **Unmatched or Conflicting Zone:** **0%**

### 2.4 Signal 4: WBS Branch Fit ($S_{\text{wbs}}$, Weight = 0.15)
Compares tokens in the raw report against the activity's hierarchical `parentWbs` string (e.g. `BAGH.SURF.PIP.RACK-NORTH`):
- Direct branch match (`SURF`, `PIP`, `CIV`, `ELEC`, `INST`, `EQUIP`): **90% - 100%**.
- Partial ancestor match: **60%**.
- Unrelated WBS branch: **0%**.

### 2.5 Signal 5: Date Consistency ($S_{\text{date}}$, Weight = 0.10)
Calculates chronological plausibility between the reported `eventDate` and the planned baseline window $[ \text{plannedStart}, \text{plannedFinish} ]$:
$$\Delta_{\text{days}} = \min(|\text{eventDate} - \text{plannedStart}|, |\text{eventDate} - \text{plannedFinish}|)$$
- Event date falls inside planned window: **100%**
- $\Delta_{\text{days}} \le 3\text{ days}$: **94%**
- $4 \le \Delta_{\text{days}} \le 7\text{ days}$: **85%**
- $8 \le \Delta_{\text{days}} \le 14\text{ days}$: **65%**
- $\Delta_{\text{days}} > 14\text{ days}$: **30%** (flags potential slippage while maintaining candidate consideration).

### 2.6 Signal 6: Terminology & Synonym Match ($S_{\text{synonym}}$, Weight = 0.10)
Uses a curated Oil & Gas Construction Synonym Dictionary:
```typescript
export const SYNONYM_DICTIONARY: Record<string, string[]> = {
  'spool erected': ['line erection', 'pipe erection', 'piping erection', 'spool installation'],
  'spool fabrication': ['spool fab', 'pipe fabrication', 'joint welding'],
  'cable tray installed': ['tray installation', 'cable raceway', 'tray erection', 'ladder tray'],
  'cable pulling': ['cable laying', 'cable haul', 'power cable pulling'],
  'pump alignment': ['rotating equipment alignment', 'pump coupling', 'laser alignment'],
  'compressor grouting': ['baseplate grouting', 'equipment grouting', 'epoxy grout'],
  'hydro test': ['hydrotest', 'pressure test', 'strength test', 'leak test']
};
```
- If the extracted phrase maps to an authorized canonical synonym, $S_{\text{synonym}} = 100\%$; otherwise partial overlap or $0\%$.

---

## 3. Level 6 Terminal Activity Prioritization (Option A: Routing Tie-Breaker)

To avoid arithmetic inconsistency (adding $+5\%$ to $94.8\%$ would yield $99.8\%$ rather than $94.8\%$), the engine implements **Option A**:

### Specification:
- **Base Match Score:** Pure weighted signal score (e.g., $94.8\%$).
- **Level 6 Priority Treatment:** Level 6 is applied strictly as an **execution routing tie-breaker** between Level 5 parent packages and Level 6 terminal activities.
- **Routing Status:** Classifies the candidate as `Fast-Track Review Eligible` (final schedule update still requires planner confirmation).
- **Display Representation:**
  ```
  Base Match Score: 94.8%
  Level 6 Executable Priority: Applied as routing tie-breaker
  Score-Gap Status: Unambiguous (+18.3% lead)
  Review Status: Fast-Track Review Eligible
  ```

---

## 4. Craft Verb Routing Table

Certain engineering verbs unambiguously isolate specific L6 activities:

| Extracted Craft Verb | Target Activity Craft Stage | Example Route |
|---|---|---|
| `erected`, `erecting`, `hung` | Field Erection | Route to `PIP-L6-024A (Erect Line 24-XX)` |
| `hydrotested`, `hydrotest`, `flushed` | Pressure Testing / Commissioning | Route to `PIP-L6-025 (Hydrotest Line 24-XX)` |
| `aligned`, `shimming`, `coupled` | Mechanical Alignment | Route to `ROT-L6-037 (Pump P-204 Alignment)` |
| `grouted`, `grouting`, `poured` | Baseplate Grouting | Route to `ROT-L6-038 (Compressor Grouting)` |
| `pulled`, `laying`, `drawn` | Cable Installation | Route to `ELE-L6-042 (Power Cable Pulling)` |
| `excavated`, `dug`, `shored` | Earthwork / Foundations | Route to `CIV-L5-011 (Foundation Excavation)` |

---

## 5. Ambiguity Detection & Score Gap Rule

Even when a candidate scores above the 85% threshold, ambiguity exists if a competing candidate scores almost as high:

```typescript
function checkAmbiguity(rankedCandidates: MatchCandidate[]): MatchCandidate[] {
  if (rankedCandidates.length < 2) return rankedCandidates;

  const top1 = rankedCandidates[0];
  const top2 = rankedCandidates[1];
  const scoreGap = top1.baseScore - top2.baseScore;

  top2.scoreGapFromLeader = scoreGap;

  // If score gap is less than 10%, flag ambiguity and require mandatory planner review
  if (scoreGap < 10.0) {
    top1.isAmbiguous = true;
    top2.isAmbiguous = true;
    top1.mismatchReasons.push(
      `Ambiguous candidate: only ${scoreGap.toFixed(1)}% score lead over ${top2.activityCode}`
    );
  }

  return rankedCandidates;
}
```

---

## 6. Two-Tier Duplicate Detection Engine

Duplicate progress logging is governed by two separate thresholds with distinct operational behaviors:

```
                  ┌──────────────────────────────────────────────┐
                  │          Incoming Field Record               │
                  └──────────────────────┬───────────────────────┘
                                         │ Same Date & Discipline
                                         ▼
                             ┌───────────────────────┐
                             │ Calculate Similarity  │
                             └───────────┬───────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 │                                               │
                 ▼ < 70%                                         ▼ >= 70%
      ┌──────────────────────┐                    ┌──────────────────────────────┐
      │ Unique Record        │                    │ Candidate Similarity Check   │
      │ Proceed to Extract   │                    └──────────────┬───────────────┘
      └──────────────────────┘                                   │
                                                 ┌───────────────┴───────────────┐
                                                 │                               │
                                                 ▼ 70% - 84%                     ▼ >= 85%
                                     ┌───────────────────────┐       ┌───────────────────────────────┐
                                     │ Possible Duplicate    │       │ High-Confidence Duplicate     │
                                     │ Warning Flagged       │       │ Double-Counting BLOCKED       │
                                     │ Planner Review Req'd  │       │ Mandatory Justification Req'd │
                                     └───────────────────────┘       └───────────────────────────────┘
```

1. **Candidate Similarity Threshold ($\ge 70\%$):**
   - **Status:** `Possible Duplicate`.
   - **Behavior:** Warning badge displayed in review queue; planner review required.
2. **Confirmation Threshold ($\ge 85\%$):**
   - **Status:** `High-Confidence Duplicate Candidate`.
   - **Behavior:** Potential double-counting is automatically blocked; requires explicit planner confirmation and audit reason before progress can be counted.

---

## 7. 1:N Field Record Allocation Splitter

When a single site report covers multiple operational tasks (e.g., fit-up, welding, NDT), the 1:N splitter distributes the field report:

### Core Principles:
1. **Field Record Allocation:** The assigned percentages represent the distribution of the **source field report** across activities.
2. **Not Activity Completion:** These values do **not** directly set each target activity's physical completion percentage.
3. **Conservation Constraint:**
   $$\sum_{k=1}^N \text{allocationPercent}_k = 100.0\%$$
4. **Planner Justification:** Splitting requires a mandatory planner rationale recorded in the append-only audit trail.

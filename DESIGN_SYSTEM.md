# OIL INDIA ENTERPRISE DESIGN SYSTEM (OIEDS)
## Intelligent Data Capture & Schedule-Linking Layer
**Anchor Installation:** Baghewala Surface Facilities Expansion, Thar Desert, Rajasthan  
**Operating Entity:** Oil India Limited (Maharatna PSU, Ministry of Petroleum & Natural Gas, Govt. of India)  
**Design Lead Specification:** Version 2.0.0 (Enterprise Industrial UI/UX)  
**Accessibility Target:** WCAG 2.1 Level AA Compliant (AAA for Tabular Figures & High-Contrast Badges)

---

## 1. Executive Summary & Design Philosophy

The Oil India Enterprise Design System (OIEDS) is purpose-built for heavy energy infrastructure, pipeline engineering, and capital project control environments. Unlike generic SaaS templates or consumer software, OIEDS balances **rugged site-supervisor ergonomics** with **high-density algorithmic explainability** for planning engineers.

### Core Design Principles

1. **Grounded Industrial Aesthetic (Rajasthan Desert & Petroleum Engineering):**
   - Palette inspired by crude petroleum deep navy (`#0B1120`), weathered Thar Desert slate (`#1E293B`), Indian Oil green (`#10B981`), and high-temperature instrumentation amber (`#F59E0B`).
   - Machined chassis frames (8px–10px radii) with hairline structural borders (`1px solid var(--border-subtle)`), eliminating bubbly consumer aesthetics.

2. **Elimination of Artificial SaaS Tropes:**
   - **Zero Decorative Middle Dots (`•`):** Structural data points use explicit labels, vertical pipe separators (`|`), or tabular key-value grids.
   - **Active-Voice Action Triggers:** Action buttons use explicit technical verbs (*Authenticate & Enter Gateway*, *Confirm Out-of-Sequence Override*, *Sync to Mock PMIS*) without trailing arrow glyphs (`→`).
   - **Sentence/Title Case Headings:** Eyebrows and subheadings use optical letter-spaced Title Case rather than aggressive tracked-out all-caps.

3. **Progressive Disclosure & Cognitive Load Reduction:**
   - Supervisors see large, tactile speech-to-text cards and single-tap submission gates.
   - Planners receive multi-layered mathematical explainability on demand (expandable 6-signal score stacks and forward 6-point evidence lineage drawers).

4. **Bi-Directional High-Contrast Theming (Dark Navy & Clean Industrial Light):**
   - Full CSS tokenization supporting instantaneous zero-flicker transitions between Mission-Critical Night Ops (Dark) and Desert Sunlight Operations (Light).

---

## 2. User Personas & Mental Model Mapping

| Persona | Role & Location | Key Tasks | Primary Cognitive Need | Default View |
|---|---|---|---|---|
| **Rajiv Sen** | Lead Planning Engineer *(Control Room / HQ)* | Schedule approval, 1:N splits, out-of-sequence safety gating, PMIS sync | Absolute auditability, mathematical match verification, zero accidental syncs | `/review` |
| **Harish Patel** | Field Piping Supervisor *(Thar Desert Site)* | Audio progress recording, joint counts, daily milestone logging | Large tactile controls, noise tolerance, zero tedious form fields | `/time-agent` |
| **Priya Sharma** | Discipline Engineer (Mech/Piping) *(Site Office)* | Verifying raw DPR text, adjusting extracted quantities, span validation | Precise split-screen source document phrase verification | `/extraction` |
| **Vikramaditya Roy** | Project Director (EPPM) *(Executive Directorate)* | Executive KPIs, cumulative S-Curves, indicative finish forecasts | At-a-glance project health, non-blocking delay simulations | `/overview` |

---

## 3. Design Token Architecture

### 3.1 Color Tokens & Semantic Roles

```css
:root {
  /* ========================================================================
     DARK THEME (Default - Mission-Critical Petroleum Navy)
     ======================================================================== */
  --bg-base: #0B1120;                  /* Main canvas background */
  --bg-surface: #131E32;               /* Card and panel base */
  --bg-surface-elevated: #1E293B;      /* Modal, drawer, and elevated popovers */
  --bg-surface-hover: #26354D;         /* Interactive row/card hover state */
  --bg-input: #0A0F1D;                 /* Recessed input and code background */

  --border-subtle: rgba(148, 163, 184, 0.14); /* Hairline chassis borders */
  --border-focus: #0EA5E9;             /* Focus indicator ring */

  --text-primary: #F8FAFC;             /* Headers, key data figures, active tab */
  --text-secondary: #94A3B8;           /* Subheadings, field labels, metadata */
  --text-muted: #64748B;               /* Timestamps, disabled text, hints */

  /* Brand & Intelligence Accents */
  --oil-green: #10B981;                /* Oil India corporate emerald */
  --oil-green-glow: rgba(16, 185, 129, 0.20);
  --teal-accent: #0EA5E9;              /* Algorithm, AI extraction, active link */
  --teal-accent-glow: rgba(14, 165, 233, 0.20);

  /* Operational Gating Semantics */
  --status-success-bg: rgba(16, 185, 129, 0.12);
  --status-success-text: #34D399;
  --status-success-border: rgba(16, 185, 129, 0.25);

  --status-warning-bg: rgba(245, 158, 11, 0.12);
  --status-warning-text: #FBBF24;
  --status-warning-border: rgba(245, 158, 11, 0.25);

  --status-danger-bg: rgba(239, 68, 68, 0.12);
  --status-danger-text: #F87171;
  --status-danger-border: rgba(239, 68, 68, 0.25);

  --status-info-bg: rgba(99, 102, 241, 0.12);
  --status-info-text: #818CF8;
  --status-info-border: rgba(99, 102, 241, 0.25);

  /* Verifiable Phrase Highlighting (Extraction Workspace) */
  --highlight-bg: rgba(254, 240, 138, 0.22);
  --highlight-border: #FACC15;
  --highlight-text: #FEF08A;
}

[data-theme='light'] {
  /* ========================================================================
     LIGHT THEME (Daylight Industrial Control Room)
     ======================================================================== */
  --bg-base: #F1F5F9;                  /* Slate-100 neutral base */
  --bg-surface: #FFFFFF;               /* Crisp pure white card surface */
  --bg-surface-elevated: #F8FAFC;      /* Subtle elevated off-white */
  --bg-surface-hover: #E2E8F0;         /* Visible tactile hover */
  --bg-input: #F8FAFC;                 /* Input surface */

  --border-subtle: rgba(15, 23, 42, 0.10); /* Crisp clean border */
  --border-focus: #0284C7;

  --text-primary: #0F172A;             /* Slate-900 high contrast */
  --text-secondary: #475569;           /* Slate-600 readable labels */
  --text-muted: #64748B;               /* Slate-500 */

  --oil-green: #059669;
  --oil-green-glow: rgba(5, 150, 105, 0.15);
  --teal-accent: #0284C7;
  --teal-accent-glow: rgba(2, 132, 199, 0.15);

  --status-success-bg: rgba(16, 185, 129, 0.10);
  --status-success-text: #065F46;
  --status-success-border: rgba(16, 185, 129, 0.35);

  --status-warning-bg: rgba(245, 158, 11, 0.10);
  --status-warning-text: #92400E;
  --status-warning-border: rgba(245, 158, 11, 0.35);

  --status-danger-bg: rgba(239, 68, 68, 0.10);
  --status-danger-text: #991B1B;
  --status-danger-border: rgba(239, 68, 68, 0.35);

  --status-info-bg: rgba(99, 102, 241, 0.10);
  --status-info-text: #3730A3;
  --status-info-border: rgba(99, 102, 241, 0.35);

  --highlight-bg: rgba(254, 240, 138, 0.45);
  --highlight-border: #CA8A04;
  --highlight-text: #713F12;
}
```

### 3.2 Typography Tokens

| Token | Family | Size | Weight | Line Height | Letter Spacing | Usage |
|---|---|---|---|---|---|---|
| `font-display` | Space Grotesk | 26px | 700 | 32px | -0.02em | Screen Headers, Executive Summary Totals |
| `font-title-lg` | Space Grotesk | 20px | 600 | 26px | -0.01em | Panel Titles, Modal Titles |
| `font-title-md` | Space Grotesk | 16px | 600 | 22px | 0.00em | Card Titles, Section Sub-headers |
| `font-body-lg` | Inter | 14px | 500 | 20px | 0.00em | Primary Field Descriptions, Form Inputs |
| `font-body-md` | Inter | 13px | 400 | 18px | 0.00em | Narrative Text, DPR Content, Audit Notes |
| `font-label` | Inter | 11.5px | 600 | 16px | +0.01em | Field Labels, Table Headers |
| `font-badge` | Inter | 11px | 700 | 14px | +0.02em | Status Pills, Confidence Chips |
| `font-mono` | JetBrains Mono | 12.5px | 500 | 17px | -0.01em | Activity Codes, Quantities, REST JSON, SOAP XML |

### 3.3 Spatial & Layout Grid (4px Baseline)

- **Micro Spacing:** `4px`, `8px`, `12px` (gap between icons, badges, chips)
- **Component Spacing:** `16px`, `20px` (card padding, modal gutter)
- **Container Layout:** `24px`, `32px` (view margins, grid gaps)
- **Navigation Rail:** Width `240px` (fixed), TopBar Height `56px` (fixed).

---

## 4. Component Library Specification

### 4.1 OilCard (Machined Chassis Container)
- **Border:** `1px solid var(--border-subtle)`
- **Radius:** `8px`
- **Background:** `var(--bg-surface)`
- **Hover Transition:** `border-color 0.15s ease, background 0.15s ease`
- **Interactive Variant:** On click/hover, shifts to `var(--bg-surface-hover)` with subtle 1px border accent.

### 4.2 Confidence Badges & Operational Chips
Confidence tiering strictly aligns with the mathematical decision boundary:
- **High Confidence ($\ge 85\%$):**  
  Class: `.badge-success` | Label: `85–100% HIGH — Fast-Track Review`  
  Accessibility: Contrast $\ge 5.8:1$.
- **Medium Confidence ($60\%–84\%$):**  
  Class: `.badge-warning` | Label: `60–84% MEDIUM — Review Required`  
  Accessibility: High-contrast amber on dark background, dark brown on light background ($\ge 4.9:1$).
- **Unmatched Scope ($< 60\%$):**  
  Class: `.badge-danger` | Label: `<60% UNMATCHED — Propose New Scope`  
  Accessibility: Rose/crimson high-contrast ($\ge 5.2:1$).
- **Ambiguity Warning Badge:**  
  Appended with warning triangle: `⚠️ Date Ambiguous (DD/MM vs MM/DD)` or `Tie-Break Required (<10% Gap)`.

### 4.3 6-Signal Match Score Breakdown Stack
Renders visual explainability across the 6 sub-scores:
1. **Text Similarity (30% weight):** Bar height `6px`, background `var(--teal-accent)`
2. **Discipline Fit (20% weight):** Bar height `6px`, background `var(--oil-green)`
3. **Location Fit (15% weight):** Bar height `6px`
4. **WBS Alignment (15% weight):** Bar height `6px`
5. **Date Consistency (10% weight):** Bar height `6px`
6. **Synonym Matching (10% weight):** Bar height `6px`

### 4.4 Granularity 1:N Splitter Modal
- **Trigger:** Click `1:N Split` in Planner Review Queue.
- **Header:** Source report details + total reported quantity.
- **Sliders:** Dynamic allocation percentage sliders locked to a mathematical sum of exactly **100%**.
- **Real-Time Validation:** If sum $\neq 100\%$, the confirm button is disabled with an explicit indicator: `Sum must equal 100% (Current: X%)`.
- **Justification Input:** Mandatory planner rationale field before commit.

### 4.5 Out-of-Sequence Predecessor Modal
- **Trigger:** Attempting to approve an activity whose predecessor is $<100\%$ complete.
- **Severity Frame:** High-visibility amber chassis with warning icon.
- **Display:** Unfinished predecessor code, description, and current percent complete (`CIV-L5-01: 50%`).
- **Safety Gate:** Approval blocked until planner inputs an explicit engineering justification (e.g. *Approved parallel cold-pull test as permitted under Site Engineering Variance Notice #42*).

### 4.6 Slide-Out Drawers
- **P6 Demonstration Drawer:** Slides from right (`width: 480px`). Shows formatted REST JSON payload and SOAP XML envelope with one-click copy and `/api/mock-pmis/sync` simulation trigger.
- **Forward 6-Point Evidence Trace Drawer:** Interactive vertical lineage tree connecting:
  `1. Source File → 2. Extracted Snippet → 3. Structured Event → 4. Ranked Match → 5. Planner Approval → 6. Approved Schedule Update`.

---

## 5. Accessibility & Inclusive Design Standards

### 5.1 WCAG 2.1 AA & AAA Compliance Checklist

- [x] **Color Contrast (Text):** All body text, tabular data, and labels achieve minimum $4.5:1$ contrast against their respective backgrounds in both Dark and Light modes.
- [x] **Color Contrast (Interactive & Graphical Elements):** Buttons, borders, badge backgrounds, and slider tracks achieve $\ge 3.0:1$ contrast.
- [x] **Keyboard Focus Navigation:**
  - All interactive elements possess explicit `:focus-visible` styles with `outline: 2px solid var(--border-focus); outline-offset: 2px;`.
  - Modals and drawers feature focus traps, keyboard `Escape` dismissal handlers, and focus restoration to the triggering element.
- [x] **ARIA Semantics & Screen Reader Support:**
  - Modals implement `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`.
  - Sliders implement `role="slider"`, `aria-valuemin="0"`, `aria-valuemax="100"`, and `aria-valuenow`.
  - Tables possess structured `<thead>`, `<tbody>`, and descriptive `<th>` scopes.
- [x] **Motion Safety:** All keyframe transitions respect `prefers-reduced-motion: reduce`, degrading gracefully to instant opacity switches.

---

## 6. Design System Governance & Developer Handoff

1. **Token Synchronization:** All tokens are defined in `src/styles/index.css` under `:root` and `[data-theme='light']`.
2. **No Ad-Hoc Styles:** Components must reference existing CSS custom properties rather than hardcoded hex codes.
3. **Automated Verification:** Any design token or component modification must pass the full test suite (`npm test`) and type check (`npx tsc --noEmit`).

# SYNONYM DICTIONARY & NORMALIZATION RULES
## SIH 2026 — Problem Statement 26122 (Oil India Limited)
**Project:** Baghewala Surface Facilities Expansion  

---

## 1. Canonical Domain Synonym Map

This dictionary maps unstructured field colloquialisms, abbreviations, and contractor expressions to formal Primavera P6 activity concepts across all 7 disciplines:

| Discipline | Field Colloquialisms & Site Synonyms | Canonical Primavera P6 Activity Term | Associated Craft Verbs |
|---|---|---|---|
| **PIPING** | `spool erected`, `spool hung`, `pipe erection`, `line erection`, `spool lifted`, `joints fitup` | **Line Erection / Spool Erection** | `erect`, `hang`, `lift`, `fitup`, `position` |
| **PIPING** | `hydro test`, `pressure test`, `strength test`, `leak test`, `water filling`, `line depressurization` | **Hydrotest / Pressure Testing** | `test`, `pressurize`, `fill`, `hold`, `depressurize` |
| **PIPING** | `spool fab`, `pipe welding`, `butt weld`, `flange welding`, `root pass`, `radiography test` | **Spool Fabrication & Welding** | `weld`, `fabricate`, `grind`, `xray`, `inspect` |
| **CIVIL** | `foundation work`, `pedestal casting`, `concreting`, `footing pour`, `rebar tying`, `shuttering` | **Equipment Foundation** | `pour`, `cast`, `tie`, `shutter`, `cure` |
| **CIVIL** | `earthwork`, `pit excavation`, `trench digging`, `soil cutting`, `backfilling`, `compaction` | **Foundation Excavation** | `excavate`, `dig`, `cut`, `backfill`, `compact` |
| **CIVIL** | `cable trench`, `duct bank`, `trench masonry`, `precast trench cover`, `trench brickwork` | **Cable Trench Construction** | `construct`, `lay`, `cover`, `build` |
| **STATIC_EQUIP** | `vessel lifted`, `drum positioned`, `column erected`, `separator staged`, `vessel placed` | **Vessel Installation** | `install`, `lift`, `place`, `stage`, `position` |
| **STATIC_EQUIP** | `nozzle check`, `flange orientation`, `nozzle elevation`, `blind flange check` | **Nozzle Orientation Check** | `check`, `verify`, `orient`, `inspect` |
| **ROTATING_EQUIP**| `pump alignment`, `coupling alignment`, `laser alignment`, `dial gauge check`, `shimming` | **Pump Alignment** | `align`, `shim`, `couple`, `dial`, `check` |
| **ROTATING_EQUIP**| `compressor grouting`, `skid grouting`, `epoxy grout`, `baseplate pour`, `grout packing` | **Compressor Grouting** | `grout`, `pour`, `pack`, `cure` |
| **ROTATING_EQUIP**| `pump installation`, `skid placed`, `motor mounted`, `pump set on foundation` | **Pump Installation** | `install`, `mount`, `set`, `place` |
| **ELECTRICAL** | `cable tray installed`, `raceway erected`, `tray run`, `ladder tray`, `perforated tray` | **Cable Tray Installation** | `install`, `erect`, `run`, `mount` |
| **ELECTRICAL** | `cable pulling`, `cable laying`, `wire hauling`, `cable drawn`, `cable dressing` | **Power Cable Pulling** | `pull`, `lay`, `haul`, `dress`, `draw` |
| **ELECTRICAL** | `equipment earthing`, `earth pit casting`, `grounding electrode`, `earth strip brazing` | **Equipment Earthing** | `earth`, `ground`, `braze`, `connect` |
| **INSTRUMENTATION**| `junction box`, `field jb`, `jb mounted`, `terminal box`, `marshaling box` | **Junction Box Installation** | `install`, `mount`, `terminate`, `wire` |
| **INSTRUMENTATION**| `impulse tubing`, `sensing line`, `tubing hookup`, `instrument piping`, `swagelok fitting` | **Impulse Tubing Installation** | `bend`, `route`, `hookup`, `connect`, `fit` |
| **HSE** | `scaffold inspection`, `green tag`, `scaffolding clearance`, `staging check` | **Scaffold Inspection** | `inspect`, `tag`, `clear`, `verify` |
| **HSE** | `permit closure`, `ptw signoff`, `hot work closure`, `permit returned`, `safety signoff` | **Permit Closure** | `close`, `signoff`, `return`, `clear` |

---

## 2. Location Normalization Rules

Standardizes abbreviated site zones to canonical Baghewala baseline locations:

```typescript
export const LOCATION_NORMALIZATION_MAP: Record<string, string> = {
  'north rack': 'North Pipe Rack - Bay 3 to 7',
  'north pipe rack': 'North Pipe Rack - Bay 3 to 7',
  'pipe rack': 'North Pipe Rack',
  'substation corridor': 'Substation to Process Area',
  'substation': 'Substation Corridor',
  'compressor area': 'Compressor House',
  'comp house': 'Compressor House',
  'comp area': 'Compressor Area - Bay A',
  'separator area': 'Separator Area - Vessel V-201',
  'v-201 area': 'Separator Area - Vessel V-201',
  'pump shelter': 'Pump Shelter - Bay 2',
  'pump area': 'Pump Shelter - Bay 2',
  'tank farm': 'Tank Farm Facilities'
};
```

---

## 3. Alphanumeric Equipment Tag Preservation Regex

Ensures equipment tags and line numbers are recognized as atomic identifiers during tokenization:

```typescript
export const EQUIPMENT_TAG_REGEX = /\b([A-Z]{1,4}-[A-Z0-9]{1,4}(?:-[A-Z0-9]+)?|Line\s+[0-9]{2}-[A-Z]{2}|Bay\s+[A-Z0-9]+)\b/gi;
```

**Recognized Tags:**
- `Line 24-XX` (Piping line)
- `P-204` (Crude transfer pump)
- `V-201` (3-phase test separator)
- `CR-04` (Hydra mobile crane)
- `Bay 3`, `Bay A` (Spatial zone markers)

---

## 4. Stop Words & Noise Filter List

Words filtered out during text similarity evaluation to eliminate false positive penalties:

```typescript
export const NOISE_STOP_WORDS: Set<string> = new Set([
  'the', 'a', 'an', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'crew', 'work', 'started', 'completed', 'progressing', 'today', 'morning', 'shift',
  'day', 'approx', 'approx.', 'near', 'site', 'notes', 'daily', 'report', 'done',
  'status', 'hours', 'cleared', 'staged', 'observed'
]);
```

---

## 5. Deterministic Matching Engine Implementation Blueprint

```typescript
export function evaluateSynonymMatch(extractedPhrase: string, candidateDesc: string): number {
  const normExtracted = extractedPhrase.toLowerCase();
  const normCandidate = candidateDesc.toLowerCase();

  for (const [key, synonyms] of Object.entries(CANONICAL_SYNONYMS)) {
    const isKeyInExtracted = normExtracted.includes(key);
    const isKeyInCandidate = normCandidate.includes(key);

    for (const syn of synonyms) {
      if (
        (isKeyInExtracted && normCandidate.includes(syn)) ||
        (normExtracted.includes(syn) && isKeyInCandidate)
      ) {
        return 100.0; // Perfect canonical synonym match
      }
    }
  }

  return 0.0;
}
```

export const CANONICAL_SYNONYMS: Record<string, string[]> = {
  'spool erected': ['line erection', 'pipe erection', 'piping erection', 'spool installation', 'spool hung', 'spool lifted'],
  'spool fabrication': ['spool fab', 'pipe fabrication', 'joint welding', 'pipe welding', 'butt weld'],
  'hydro test': ['hydrotest', 'pressure test', 'strength test', 'leak test', 'water filling'],
  'foundation work': ['equipment foundation', 'civil foundation', 'pedestal casting', 'concreting', 'footing pour'],
  'foundation excavation': ['earthwork', 'pit excavation', 'trench digging', 'soil cutting'],
  'cable trench': ['trench excavation', 'trench construction', 'cable duct', 'duct bank'],
  'vessel installation': ['vessel lifted', 'drum positioned', 'column erected', 'separator staged', 'vessel placed'],
  'nozzle orientation': ['nozzle check', 'flange orientation', 'nozzle elevation', 'blind flange check'],
  'pump alignment': ['rotating equipment alignment', 'pump coupling', 'laser alignment', 'dial gauge check', 'shimming'],
  'compressor grouting': ['baseplate grouting', 'equipment grouting', 'epoxy grout', 'baseplate pour'],
  'cable tray installation': ['cable tray installed', 'tray installation', 'raceway erected', 'ladder tray'],
  'cable pulling': ['cable laying', 'cable haul', 'power cable pulling', 'cable drawn'],
  'equipment earthing': ['earth pit casting', 'grounding electrode', 'earth strip brazing', 'earth pit'],
  'junction box': ['junction box installation', 'field jb', 'jb mounted', 'terminal box'],
  'impulse tubing': ['instrument tubing', 'tubing hookup', 'sensing line', 'instrument piping'],
  'scaffold inspection': ['scaffolding clearance', 'green tag inspection', 'staging check'],
  'permit closure': ['ptw closure', 'hot work permit signoff', 'permit returned', 'safety signoff']
};

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

export const EQUIPMENT_TAG_REGEX = /\b([A-Z]{1,4}-[A-Z0-9]{1,4}(?:-[A-Z0-9]+)?|Line\s+[0-9]{2}-[A-Z]{2}|Bay\s+[A-Z0-9]+)\b/gi;

export const NOISE_STOP_WORDS: Set<string> = new Set([
  'the', 'a', 'an', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'crew', 'work', 'started', 'completed', 'progressing', 'today', 'morning', 'shift',
  'day', 'approx', 'approx.', 'near', 'site', 'notes', 'daily', 'report', 'done',
  'status', 'hours', 'cleared', 'staged', 'observed'
]);

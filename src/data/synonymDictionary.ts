export const CANONICAL_SYNONYMS: Record<string, string[]> = {
  'spool erected': ['line erection', 'pipe erection', 'piping erection', 'spool installation', 'spool hung', 'spool lifted', 'pipe spool installed', 'pipe installed', 'pipe mounted'],
  'spool fabrication': ['spool fab', 'pipe fabrication', 'joint welding', 'pipe welding', 'butt weld'],
  'fit-up': ['fit up', 'pipe fit-up', 'piping fit-up', 'joint fit-up', 'fitup', 'jointing'],
  'hydro test': ['hydrotest', 'pressure test', 'strength test', 'leak test', 'water filling', 'hydrostatic test'],
  'pneumatic test': ['air test', 'pneumatic testing', 'service test'],
  'foundation work': ['equipment foundation', 'civil foundation', 'pedestal casting', 'concreting', 'footing pour', 'RCC', 'concrete pour'],
  'foundation excavation': ['earthwork', 'pit excavation', 'trench digging', 'soil cutting', 'digging', 'excavation'],
  'anchor bolt': ['anchor bolt installation', 'bolt setting', 'hold-down bolt', 'foundation bolt'],
  'cable trench': ['trench excavation', 'trench construction', 'cable duct', 'duct bank'],
  'vessel installation': ['vessel lifted', 'drum positioned', 'column erected', 'separator staged', 'vessel placed'],
  'nozzle orientation': ['nozzle check', 'flange orientation', 'nozzle elevation', 'blind flange check'],
  'pump alignment': ['rotating equipment alignment', 'pump coupling', 'laser alignment', 'dial gauge check', 'shimming', 'shaft alignment', 'coupling alignment'],
  'compressor grouting': ['baseplate grouting', 'equipment grouting', 'epoxy grout', 'baseplate pour'],
  'cable tray installation': ['cable tray installed', 'tray installation', 'raceway erected', 'ladder tray', 'cable support'],
  'cable pulling': ['cable laying', 'cable haul', 'power cable pulling', 'cable drawn', 'cable routing'],
  'equipment earthing': ['earth pit casting', 'grounding electrode', 'earth strip brazing', 'earth pit', 'grounding', 'earthing'],
  'junction box': ['junction box installation', 'field jb', 'jb mounted', 'terminal box', 'instrument JB', 'JB'],
  'impulse tubing': ['instrument tubing', 'tubing hookup', 'sensing line', 'instrument piping'],
  'scaffold inspection': ['scaffolding clearance', 'green tag inspection', 'staging check', 'scaffold check', 'scaffold safety inspection'],
  'permit closure': ['ptw closure', 'hot work permit signoff', 'permit returned', 'safety signoff', 'safety inspection'],
  'fire watch': ['fire watch permit', 'hot work permit', 'fire watcher', 'hot work'],
  'lighting installation': ['area lighting', 'flood light installation', 'luminaire mounting'],
  'mcc panel': ['mcc panel installation', 'motor control center', 'panel installation', 'switchgear'],
  'loop check': ['loop check calibration', 'loop testing', 'instrument loop check', 'calibration'],
  'control panel wiring': ['panel wiring', 'marshalling', 'termination', 'wiring'],
  'access road': ['road construction', 'plant road', 'haul road'],
  'pipe support': ['pipe support fabrication', 'support installation', 'pipe hanger', 'pipe clamp']
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
  'tank farm': 'Tank Farm Facilities',
  'control room': 'Control Room',
  'welding zone': 'Welding Zones - Plant Wide',
  'instrument rack': 'Process Area - Local Racks',
  'local rack': 'Process Area - Local Racks',
  'heat recovery': 'Process Area - Heat Recovery',
  'trench ug': 'Process Area - Trench UG-3',
  'main plant entrance': 'Main Plant Entrance to Tank Farm',
  'safety office': 'Control Room / Safety Office',
  'plant wide': 'Plant Wide',
  'plant area': 'Plant Wide'
};

export const EQUIPMENT_TAG_REGEX = /\b([A-Z]{1,4}-[A-Z0-9]{1,4}(?:-[A-Z0-9]+)?|Line\s+[0-9]{2}-[A-Z]{2}|Bay\s+[A-Z0-9]+)\b/gi;

export const NOISE_STOP_WORDS: Set<string> = new Set([
  'the', 'a', 'an', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'crew', 'work', 'started', 'completed', 'progressing', 'today', 'morning', 'shift',
  'day', 'approx', 'approx.', 'near', 'site', 'notes', 'daily', 'report', 'done',
  'status', 'hours', 'cleared', 'staged', 'observed'
]);

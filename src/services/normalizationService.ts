import { Discipline } from '../types';
import { LOCATION_NORMALIZATION_MAP } from '../data/synonymDictionary';

export interface NormalizationResult {
  normalizedDate: string;       // ISO YYYY-MM-DD
  dateConfidence: number;       // 0 - 100
  isDateAmbiguous: boolean;
  detectedDiscipline: Discipline;
  normalizedLocation?: string;
  cleanedText: string;
}

export class NormalizationService {
  /**
   * Normalizes incoming dates into standard ISO YYYY-MM-DD
   */
  public static normalizeDate(rawDateHint?: string, fullText?: string): { date: string; confidence: number; isAmbiguous: boolean } {
    const textToSearch = (rawDateHint || fullText || '').trim();
    
    // Pattern 1: ISO format (2026-09-12)
    const isoMatch = textToSearch.match(/\b(202[0-9])-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b/);
    if (isoMatch) {
      return { date: isoMatch[0], confidence: 100, isAmbiguous: false };
    }

    // Pattern 2: DD-MM-YYYY or DD/MM/YYYY (e.g. 12-09-2026 or 12/09/2026)
    const dmyMatch = textToSearch.match(/\b(0?[1-9]|[12][0-9]|3[01])[-/.](0?[1-9]|1[0-2])[-/.](202[0-9])\b/);
    if (dmyMatch) {
      const day = dmyMatch[1].padStart(2, '0');
      const month = dmyMatch[2].padStart(2, '0');
      const year = dmyMatch[3];
      // Ambiguity check: if day <= 12 and month <= 12, could be MM-DD-YYYY
      const isAmbiguous = parseInt(day, 10) <= 12 && parseInt(month, 10) <= 12 && day !== month;
      return {
        date: `${year}-${month}-${day}`,
        confidence: isAmbiguous ? 82.0 : 96.0,
        isAmbiguous
      };
    }

    // Pattern 3: Named month (e.g. 12 Sep 2026 or 12-Sep-2026)
    const monthNames: Record<string, string> = {
      jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
      jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
    };
    const namedMatch = textToSearch.match(/\b(0?[1-9]|[12][0-9]|3[01])[-/\s]+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[-/\s]+(202[0-9])\b/i);
    if (namedMatch) {
      const day = namedMatch[1].padStart(2, '0');
      const month = monthNames[namedMatch[2].toLowerCase().substring(0, 3)];
      const year = namedMatch[3];
      return { date: `${year}-${month}-${day}`, confidence: 99.0, isAmbiguous: false };
    }

    // Fallback: Default to project status date if unparseable
    return { date: '2026-09-12', confidence: 50.0, isAmbiguous: true };
  }

  private static readonly DISCIPLINE_KEYWORD_RULES: Array<{ discipline: Discipline; keywords: string[] }> = [
    { discipline: 'PIPING', keywords: ['pipe', 'spool', 'weld', 'hydrotest', 'line 24'] },
    { discipline: 'ELECTRICAL', keywords: ['cable tray', 'cable pull', 'earthing', 'substation', 'power cable'] },
    { discipline: 'ROTATING_EQUIP', keywords: ['pump', 'compressor', 'alignment', 'shimming', 'grout'] },
    { discipline: 'STATIC_EQUIP', keywords: ['vessel', 'nozzle', 'separator', 'drum', 'column'] },
    { discipline: 'INSTRUMENTATION', keywords: ['junction box', 'impulse tubing', 'sensing', 'tubing'] },
    { discipline: 'HSE', keywords: ['scaffold', 'permit', 'ptw', 'safety'] },
    { discipline: 'CIVIL', keywords: ['foundation', 'excavation', 'concrete', 'trench', 'civil'] }
  ];

  /**
   * Classifies discipline from text keywords and equipment tags
   */
  public static detectDiscipline(text: string): Discipline {
    const lower = text.toLowerCase();

    for (const rule of this.DISCIPLINE_KEYWORD_RULES) {
      if (rule.keywords.some(kw => lower.includes(kw))) {
        return rule.discipline;
      }
    }

    return 'PIPING';
  }

  /**
   * Normalizes site location string to canonical baseline facility zone
   */
  public static normalizeLocation(rawLocation?: string): string {
    if (!rawLocation) return 'General Plant Area';
    const lower = rawLocation.toLowerCase().trim();

    for (const [key, canonical] of Object.entries(LOCATION_NORMALIZATION_MAP)) {
      if (lower.includes(key)) {
        return canonical;
      }
    }

    return rawLocation;
  }
}

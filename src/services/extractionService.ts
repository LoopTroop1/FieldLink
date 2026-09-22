import { FieldRecord, ProgressEvent, Discipline, ProgressMethod } from '../types';
import { NormalizationService } from './normalizationService';

export interface HighlightedSpan {
  fieldKey: string;
  startIndex: number;
  endIndex: number;
  snippet: string;
}

export interface ExtractionResult {
  events: ProgressEvent[];
  spans: HighlightedSpan[];
}

export class ExtractionService {
  /**
   * Extracts structured progress events and phrase spans from a raw field record.
   * Uses layered regex patterns with fallback logic to handle arbitrary text.
   */
  public static extractEvents(record: FieldRecord): ExtractionResult {
    const text = record.rawText;
    const lower = text.toLowerCase();
    const spans: HighlightedSpan[] = [];

    // Helper for finding span
    const findSpan = (fieldKey: string, snippetRegex: RegExp): string | undefined => {
      const match = text.match(snippetRegex);
      if (match && match.index !== undefined) {
        spans.push({
          fieldKey,
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          snippet: match[0]
        });
        return match[0];
      }
      return undefined;
    };

    // 1. Extract Quantity & Unit — layered approach
    let quantity: number | undefined;
    let progressUnit: string | undefined;
    let progressMethod: ProgressMethod = 'quantity-based';
    let progressValue = 0;
    let impliedQuantity: number | undefined;

    // Pattern A: "X of Y <unit>" (e.g., "18 of 24 joints completed")
    const xOfYMatch = findSpan('quantity', /(\b\d+)\s+of\s+(\b\d+)\s+(\w+)(?:\s+complete[d]?)?/i);
    if (xOfYMatch) {
      const parts = xOfYMatch.match(/(\d+)\s+of\s+(\d+)\s+(\w+)/i);
      if (parts) {
        quantity = parseInt(parts[1], 10);
        const planned = parseInt(parts[2], 10);
        progressUnit = parts[3].toLowerCase();
        progressMethod = 'quantity-based';
        progressValue = planned > 0 ? (quantity / planned) * 100 : 0;
        impliedQuantity = quantity;
      }
    }

    // Pattern B: "X joints/pits/checks/units complete" (single quantity)
    if (quantity === undefined) {
      const singleQtyMatch = findSpan('quantity', /(\b\d+)\s+(joints|pits|checks|loops|permits|sets|inspections|units|zones|connections|panels|JBs|drums)(?:\s+(?:complete[d]?|install[ed]*|mounted|connected|pulled|cleared|terminated))?/i);
      if (singleQtyMatch) {
        const parts = singleQtyMatch.match(/(\d+)\s+(\w+)/i);
        if (parts) {
          quantity = parseInt(parts[1], 10);
          progressUnit = parts[2].toLowerCase();
          progressMethod = 'quantity-based';
          // Use activity-aware planned quantity estimation
          impliedQuantity = quantity;
        }
      }
    }

    // Pattern C: "X meters/metres/m" (linear measurement)
    if (quantity === undefined) {
      const meterMatch = findSpan('quantity', /(?:approximately\s+)?(\b\d+)\s+(?:metres|meters|m\b)/i);
      if (meterMatch) {
        const parts = meterMatch.match(/(\d+)/);
        if (parts) {
          quantity = parseInt(parts[1], 10);
          progressUnit = 'meters';
          progressMethod = 'quantity-based';
          impliedQuantity = quantity;
        }
      }
    }

    // Pattern D: "X cubic meters/m³/cu.m" (volume measurement)
    if (quantity === undefined) {
      const volMatch = findSpan('quantity', /(\b\d+)\s+(?:cubic\s+met(?:re|er)s?|m³|cu\.?\s*m\b)/i);
      if (volMatch) {
        const parts = volMatch.match(/(\d+)/);
        if (parts) {
          quantity = parseInt(parts[1], 10);
          progressUnit = 'm³';
          progressMethod = 'quantity-based';
          impliedQuantity = quantity;
        }
      }
    }

    // Pattern E: "X%" (percentage)
    if (quantity === undefined) {
      const pctMatch = findSpan('progressValue', /(\b\d+)\s*%/);
      if (pctMatch) {
        progressValue = parseInt(pctMatch.replace('%', '').trim(), 10);
        progressMethod = 'percentage-based';
        progressUnit = '%';
      }
    }

    // Pattern F: Milestone detection (completed/started/commenced)
    if (quantity === undefined && progressValue === 0) {
      progressMethod = 'milestone-based';
      if (lower.includes('completed') || lower.includes('finished') || lower.includes('done')) {
        progressValue = 100;
      } else if (lower.includes('started') || lower.includes('commenced') || lower.includes('begun')) {
        progressValue = 10;
      } else if (lower.includes('pending') || lower.includes('awaited')) {
        progressValue = 0;
      } else {
        progressValue = 50;
      }
    }

    // Calculate progress from quantity if available but progressValue not set
    if (quantity !== undefined && progressValue === 0) {
      // Use discipline-aware baseline estimation
      progressValue = this.estimateProgressFromQuantity(quantity, progressUnit || '', record.discipline, lower);
    }

    // 2. Extract Location — expanded patterns
    let location = 'General Plant Area';
    const locMatch = findSpan('location', /(north pipe rack(?:\s*(?:\(|—|-)[^)]*(?:\)|))?|north rack|substation corridor|substation to process\s*(?:area|corridor)?|compressor area(?:\s*-?\s*bay\s*[a-z])?|compressor house|separator area|separator\s*&?\s*compressor area|pump shelter|tank farm|process area|control room|welding zone[s]?|plant\s*(?:wide|area)|instrument rack|local racks|heat recovery)/i);
    if (locMatch) {
      location = NormalizationService.normalizeLocation(locMatch);
    }

    // 3. Extract Discipline
    const discipline: Discipline = record.discipline || NormalizationService.detectDiscipline(text);

    // 4. Extract Manpower Crew
    const crewMatch = findSpan('manpower', /(\d+\s+(?:welders|riggers|fitters|supervisor[s]?|electrician[s]?|technician[s]?|helper[s]?)[^.|,\n]*)/i);
    const manpower = crewMatch || undefined;

    // 5. Extract Equipment Tag
    const equipMatch = findSpan('equipment', /(Hydra Crane\s+[^\n,.]*|CR-\d+|Crane\s+\d+T|[A-Z]-\d{3}\b|Line\s+\d+-[A-Z]{2}\b)/i);
    const equipment = equipMatch || undefined;

    // 6. Extract Delay Cause — expanded
    let delayCause: string | undefined;
    const delayMatch = findSpan('delayCause', /(held because[^.\n]*|delay(?:ed)?(?:\s+(?:due to|because))?[^.\n]*|unavailable[^.\n]*|pending(?:\s+(?:from|due))[^.\n]*|awaited\s+from[^.\n]*)/i);
    if (delayMatch) {
      delayCause = delayMatch;
    }

    // 7. Extract Activity Description — improved with broader patterns
    let activityDescription = record.sourceName.replace(/\.pdf|\.csv|\.txt|\.jpg|\.m4a/gi, '').replace(/_/g, ' ');
    
    // Try activity-specific patterns first
    const descPatterns = [
      /(?:erecting|erected)\s+[^.\n,]*Line\s+24-XX/i,
      /(?:spool erected|spool installation|pipe spool installed)[^.\n]*/i,
      /Cable tray installation completed[^.\n]*/i,
      /Power cable pulling commenced[^.\n]*/i,
      /Pump P-204 alignment completed[^.\n]*/i,
      /Foundation work progressing[^.\n]*/i,
      /Foundation excavation[^.\n]*/i,
      /Anchor bolt installation[^.\n]*/i,
      /Concrete pedestal pour[^.\n]*/i,
      /Temporary access platform installed[^.\n]*/i,
      /Hydrotest on Line 24-XX[^.\n]*/i,
      /Scaffold (?:safety )?inspection completed[^.\n]*/i,
      /Junction box installation completed[^.\n]*/i,
      /Equipment earthing completed[^.\n]*/i,
      /Impulse tubing installation started[^.\n]*/i,
      /Permit closure[^.\n]*/i,
      /(?:Loop check|Calibration)[^.\n]*/i,
      /(?:MCC|Panel) (?:installation|wiring)[^.\n]*/i,
      /(?:Area|Flood) lighting installation[^.\n]*/i,
      /(?:Underground|UG) piping[^.\n]*/i,
      /Pipe support fabrication[^.\n]*/i,
      /Access road construction[^.\n]*/i,
      /Fire watch[^.\n]*/i,
    ];

    for (const pattern of descPatterns) {
      const descMatch = findSpan('activityDescription', pattern);
      if (descMatch) {
        activityDescription = descMatch;
        break;
      }
    }

    // Fallback: use the first substantial sentence containing a verb
    if (activityDescription === record.sourceName.replace(/\.pdf|\.csv|\.txt|\.jpg|\.m4a/gi, '').replace(/_/g, ' ')) {
      const sentences = text.split(/[.\n]/).filter(s => s.trim().length > 15);
      const verbSentence = sentences.find(s => 
        /(?:install|erect|pull|align|complet|excavat|pour|mount|connect|start|commenc)/i.test(s)
      );
      if (verbSentence) {
        activityDescription = verbSentence.trim().substring(0, 120);
      }
    }

    // Generate single primary ProgressEvent
    const event: ProgressEvent = {
      id: `ev-${record.id.replace('rec-', '')}-${Date.now().toString(36).substring(0, 4)}`,
      fieldRecordId: record.id,
      activityDescription,
      mappingType: '1:1',
      mappedActivityIds: [],
      actualStart: record.normalizedDate,
      actualFinish: progressValue >= 100 ? record.normalizedDate : null,
      statusDate: '2026-09-19',
      progressMethod,
      progressValue: Math.min(100, Math.max(0, Math.round(progressValue * 10) / 10)),
      progressUnit,
      quantity,
      impliedQuantity,
      verificationStatus: 'unverified',
      location,
      discipline,
      manpower,
      equipment,
      delayCause,
      confidenceScore: 0, // Will be computed by MatchingService
      confidenceLevel: 'LOW',
      matchMethod: 'multi-signal',
      validationStatus: 'pending',
      outOfSequence: false,
      evidenceSnippet: (() => {
        const notesIndex = text.indexOf('Notes:\n');
        if (notesIndex !== -1) {
          return text.substring(notesIndex + 7).trim();
        }
        return text;
      })(),
      evidenceUri: record.evidenceReference
    };

    return {
      events: [event],
      spans
    };
  }

  /**
   * Estimates progress percentage from raw quantity + discipline context
   */
  private static estimateProgressFromQuantity(
    quantity: number,
    unit: string,
    discipline: Discipline,
    text: string
  ): number {
    // Known baseline quantities by discipline for estimation
    const estimates: Record<string, number> = {
      'joints': 24,
      'pits': 28,
      'checks': 8,
      'inspections': 40,
      'permits': 120,
      'zones': 40,
      'sets': 12,
      'connections': 6,
      'panels': 3,
      'jbs': 16,
      'loops': 24,
      'tests': 1,
    };

    // Meter-based: use discipline-specific baselines
    if (unit === 'meters' || unit === 'm') {
      if (discipline === 'ELECTRICAL') return Math.min(100, (quantity / 120) * 100);
      if (discipline === 'INSTRUMENTATION') return Math.min(100, (quantity / 180) * 100);
      if (discipline === 'PIPING') return Math.min(100, (quantity / 200) * 100);
      if (discipline === 'CIVIL') return Math.min(100, (quantity / 450) * 100);
      return Math.min(100, (quantity / 100) * 100);
    }

    // Volume-based
    if (unit === 'm³') {
      return Math.min(100, (quantity / 320) * 100);
    }

    const baseline = estimates[unit] || 1;
    return Math.min(100, (quantity / baseline) * 100);
  }
}

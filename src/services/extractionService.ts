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
   * Extracts structured progress events and phrase spans from a raw field record
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

    // 1. Extract Quantity & Unit
    let quantity: number | undefined;
    let progressUnit: string | undefined;
    let progressMethod: ProgressMethod = 'quantity-based';
    let progressValue = 0;
    let impliedQuantity: number | undefined;

    const jointMatch = findSpan('quantity', /(\b\d+)(?:\s+of\s+(\b\d+))?\s+joints(?:\s+complete[d]?)?/i);
    if (jointMatch) {
      const parts = jointMatch.match(/(\d+)\s+of\s+(\d+)/i);
      if (parts) {
        quantity = parseInt(parts[1], 10);
        const planned = parseInt(parts[2], 10);
        progressUnit = 'joints';
        progressMethod = 'quantity-based';
        progressValue = planned > 0 ? (quantity / planned) * 100 : 0;
        impliedQuantity = quantity;
      } else {
        const singleQty = jointMatch.match(/(\d+)/);
        if (singleQty) {
          quantity = parseInt(singleQty[1], 10);
          progressUnit = 'joints';
          progressMethod = 'quantity-based';
          progressValue = (quantity / 24) * 100;
          impliedQuantity = quantity;
        }
      }
    } else {
      const meterMatch = findSpan('quantity', /(\b\d+)\s+(?:metres|meters|m\b)/i);
      if (meterMatch) {
        const parts = meterMatch.match(/(\d+)/);
        if (parts) {
          quantity = parseInt(parts[1], 10);
          progressUnit = 'meters';
          progressMethod = 'quantity-based';
          progressValue = (quantity / 120) * 100; // default baseline benchmark
          impliedQuantity = quantity;
        }
      } else {
        const pctMatch = findSpan('progressValue', /(\b\d+)\s*%/);
        if (pctMatch) {
          progressValue = parseInt(pctMatch.replace('%', '').trim(), 10);
          progressMethod = 'percentage-based';
          progressUnit = '%';
          impliedQuantity = Math.round((progressValue / 100) * 24); // indicative implied units
        } else {
          progressMethod = 'milestone-based';
          progressValue = lower.includes('completed') ? 100 : 50;
        }
      }
    }

    // 2. Extract Location
    let location = 'General Plant Area';
    const locMatch = findSpan('location', /(north pipe rack(?:\s*\([^)]+\))?|north rack|substation corridor|compressor area|separator area|pump shelter|tank farm)/i);
    if (locMatch) {
      location = NormalizationService.normalizeLocation(locMatch);
    }

    // 3. Extract Discipline
    const discipline: Discipline = record.discipline || NormalizationService.detectDiscipline(text);

    // 4. Extract Manpower Crew
    const crewMatch = findSpan('manpower', /(\d+\s+(?:welders|riggers|fitters|supervisor[s]?)[^.|,\n]*)/i);
    const manpower = crewMatch || undefined;

    // 5. Extract Equipment Tag
    const equipMatch = findSpan('equipment', /(Hydra Crane\s+[^\n,.]*|CR-\d+|Crane\s+\d+T)/i);
    const equipment = equipMatch || undefined;

    // 6. Extract Delay Cause
    let delayCause: string | undefined;
    const delayMatch = findSpan('delayCause', /(held because[^.\n]*|delay(?:ed)?[^.\n]*|unavailable[^.\n]*)/i);
    if (delayMatch) {
      delayCause = delayMatch;
    }

    // 7. Extract Activity Description
    let activityDescription = record.sourceName.replace('.pdf', '').replace(/_/g, ' ');
    const descMatch = findSpan('activityDescription', /(?:erecting|erected)\s+[^.\n,]*Line\s+24-XX|Cable tray installation completed|Pump P-204 alignment completed|Foundation work progressing|Temporary access platform installed|Hydrotest on Line 24-XX held/i);
    if (descMatch) {
      activityDescription = descMatch;
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
}

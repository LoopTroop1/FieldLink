import { ProgressEvent, ScheduleActivity, MatchCandidate } from '../types';
import { CANONICAL_SYNONYMS, NOISE_STOP_WORDS } from '../data/synonymDictionary';

export class MatchingService {
  /**
   * Evaluates an extracted progress event against all candidate baseline activities
   * Returns a sorted array of MatchCandidate objects (highest score first)
   */
  public static rankCandidates(
    event: ProgressEvent,
    activities: ScheduleActivity[]
  ): MatchCandidate[] {
    const candidates: MatchCandidate[] = activities.map(act => {
      const componentScores = this.calculateComponentScores(event, act);
      
      // Calculate weighted score
      let compositeScore =
        0.30 * componentScores.textSimilarity +
        0.20 * componentScores.disciplineFit +
        0.15 * componentScores.locationFit +
        0.15 * componentScores.wbsFit +
        0.10 * componentScores.dateConsistency +
        0.10 * componentScores.terminologyMatch;

      // Level 6 Priority Boost:
      // If candidate is a terminal executable L6 activity and craft verbs are present, boost score
      let isLevel6PriorityApplied = false;
      const descLower = event.activityDescription.toLowerCase();
      const hasCraftVerb = descLower.includes('erect') || descLower.includes('weld') ||
                           descLower.includes('pull') || descLower.includes('align') ||
                           descLower.includes('hydrotest') || descLower.includes('grout');

      if (act.level === 6 && hasCraftVerb) {
        compositeScore = Math.min(100, compositeScore + 5.0);
        isLevel6PriorityApplied = true;
      } else if (act.level === 5 && hasCraftVerb) {
        // Demote parent package slightly in favor of terminal activity
        compositeScore = compositeScore * 0.94;
      }

      compositeScore = Math.round(compositeScore * 10) / 10;

      // Generate matched terms & mismatch reasons
      const { matchedTerms, mismatchReasons } = this.analyzeTerms(event, act);
      const explanation = this.generateExplanation(act, compositeScore, componentScores, matchedTerms);

      return {
        id: `cand-${event.id}-${act.id}`,
        progressEventId: event.id,
        activityId: act.id,
        activityCode: act.activityCode,
        description: act.description,
        discipline: act.discipline,
        level: act.level,
        score: compositeScore,
        componentScores,
        isLevel6PriorityApplied,
        isAmbiguous: false,
        matchedTerms,
        mismatchReasons,
        explanation
      };
    });

    // Sort descending by score
    candidates.sort((a, b) => b.score - a.score);

    // Evaluate ambiguity gap between Top 1 and Top 2
    if (candidates.length >= 2) {
      const top1 = candidates[0];
      const top2 = candidates[1];
      const gap = Math.round((top1.score - top2.score) * 10) / 10;
      top2.scoreGapFromLeader = gap;

      if (gap < 10.0 && top1.score >= 55) {
        top1.isAmbiguous = true;
        top2.isAmbiguous = true;
        top1.mismatchReasons.push(`Ambiguous candidate: only ${gap}% score gap over ${top2.activityCode}`);
      }
    }

    return candidates;
  }

  private static calculateComponentScores(event: ProgressEvent, act: ScheduleActivity) {
    const textA = event.activityDescription.toLowerCase();
    const textB = act.description.toLowerCase();

    // 1. Text Similarity (Token Jaccard + Equipment Tag boost)
    const normalizeWord = (w: string) => w.replace(/(?:ed|ing|s)$/, '');
    const tokensA = textA.match(/\b[a-z0-9-]+\b/g)?.filter(t => !NOISE_STOP_WORDS.has(t)).map(normalizeWord) || [];
    const tokensB = textB.match(/\b[a-z0-9-]+\b/g)?.filter(t => !NOISE_STOP_WORDS.has(t)).map(normalizeWord) || [];
    const setB = new Set(tokensB);
    const intersection = tokensA.filter(t => setB.has(t)).length;
    const union = new Set([...tokensA, ...tokensB]).size;
    let textSim = union > 0 ? (intersection / union) * 100 : 0;

    // Exact Tag Match boost (+40 pts)
    const sharedTag = (textA.includes('24-xx') && textB.includes('24-xx')) ||
                      (textA.includes('p-204') && textB.includes('p-204')) ||
                      (textA.includes('v-201') && textB.includes('v-201'));
    if (sharedTag) {
      textSim = Math.min(100, textSim + 40);
    }

    // 2. Discipline Fit
    let discFit = 0;
    if (event.discipline === act.discipline) {
      discFit = 100;
    } else if (
      (event.discipline === 'ELECTRICAL' && act.discipline === 'INSTRUMENTATION') ||
      (event.discipline === 'INSTRUMENTATION' && act.discipline === 'ELECTRICAL')
    ) {
      discFit = 70;
    } else if (
      (event.discipline === 'ROTATING_EQUIP' && act.discipline === 'STATIC_EQUIP') ||
      (event.discipline === 'STATIC_EQUIP' && act.discipline === 'ROTATING_EQUIP')
    ) {
      discFit = 60;
    } else if (
      (event.discipline === 'CIVIL' && act.discipline === 'PIPING') ||
      (event.discipline === 'PIPING' && act.discipline === 'CIVIL')
    ) {
      discFit = 20;
    }

    // 3. Location Fit
    let locFit = 30; // base ambient
    const locA = (event.location || '').toLowerCase();
    const locB = act.location.toLowerCase();
    if (locA && locB) {
      if (locA === locB || locB.includes(locA) || locA.includes(locB)) {
        locFit = 95;
      } else if (locA.includes('rack') && locB.includes('rack')) {
        locFit = 85;
      } else if (locA.includes('compressor') && locB.includes('compressor')) {
        locFit = 85;
      } else if (locA.includes('substation') && locB.includes('substation')) {
        locFit = 85;
      }
    }

    // 4. WBS Fit
    let wbsFit = 40;
    const wbsLower = act.parentWbs.toLowerCase();
    if (
      (event.discipline === 'PIPING' && wbsLower.includes('pip')) ||
      (event.discipline === 'CIVIL' && wbsLower.includes('civ')) ||
      (event.discipline === 'ELECTRICAL' && wbsLower.includes('elec')) ||
      (event.discipline === 'INSTRUMENTATION' && wbsLower.includes('inst')) ||
      (event.discipline === 'ROTATING_EQUIP' && wbsLower.includes('equip')) ||
      (event.discipline === 'STATIC_EQUIP' && wbsLower.includes('equip')) ||
      (event.discipline === 'HSE' && wbsLower.includes('hse'))
    ) {
      wbsFit = 90;
    }

    // 5. Date Consistency
    let dateFit = 70;
    if (event.actualStart && act.plannedStart) {
      const dActual = new Date(event.actualStart).getTime();
      const dPlanned = new Date(act.plannedStart).getTime();
      const diffDays = Math.abs((dActual - dPlanned) / (1000 * 60 * 60 * 24));
      if (diffDays <= 3) dateFit = 100;
      else if (diffDays <= 7) dateFit = 85;
      else if (diffDays <= 14) dateFit = 65;
      else dateFit = 35;
    }

    // 6. Synonym Match
    let synMatch = 20;
    for (const [key, synonyms] of Object.entries(CANONICAL_SYNONYMS)) {
      const keyWords = key.split(/\s+/);
      const keyInA = keyWords.every(w => textA.includes(w));
      const keyInB = keyWords.every(w => textB.includes(w));
      for (const syn of synonyms) {
        const synWords = syn.split(/\s+/);
        const synInA = synWords.every(w => textA.includes(w));
        const synInB = synWords.every(w => textB.includes(w));
        if ((keyInA && synInB) || (synInA && keyInB) || (synInA && synInB) || (keyInA && keyInB)) {
          synMatch = 95;
          break;
        }
      }
      if (synMatch >= 90) break;
    }

    return {
      textSimilarity: Math.round(textSim),
      disciplineFit: Math.round(discFit),
      locationFit: Math.round(locFit),
      wbsFit: Math.round(wbsFit),
      dateConsistency: Math.round(dateFit),
      terminologyMatch: Math.round(synMatch)
    };
  }

  private static analyzeTerms(event: ProgressEvent, act: ScheduleActivity) {
    const textA = event.activityDescription.toLowerCase();
    const textB = act.description.toLowerCase();
    const matchedTerms: string[] = [];
    const mismatchReasons: string[] = [];

    const tokensA = textA.match(/\b[a-z0-9-]+\b/g) || [];
    tokensA.forEach(t => {
      if (!NOISE_STOP_WORDS.has(t) && textB.includes(t)) {
        matchedTerms.push(t);
      }
    });

    if (event.discipline !== act.discipline) {
      mismatchReasons.push(`Discipline mismatch: Field reported as ${event.discipline}, activity is ${act.discipline}`);
    }

    if (event.location && !act.location.toLowerCase().includes(event.location.toLowerCase().split(' ')[0])) {
      mismatchReasons.push(`Location divergence: Field reported '${event.location}', activity baseline is '${act.location}'`);
    }

    return { matchedTerms, mismatchReasons };
  }

  private static generateExplanation(
    act: ScheduleActivity,
    compositeScore: number,
    scores: any,
    matchedTerms: string[]
  ): string {
    if (compositeScore >= 85) {
      const termsStr = matchedTerms.length > 0 ? ` ('${matchedTerms.join("', '")}')` : '';
      return `High-confidence match (${compositeScore}%): Exact discipline fit (${scores.disciplineFit}%), high spatial alignment in ${act.location}, and strong token correlation${termsStr}.`;
    }
    if (compositeScore >= 60) {
      return `Medium-confidence match (${compositeScore}%): Partial semantic overlap (${scores.textSimilarity}%) with minor spatial or WBS divergence. Planner verification recommended.`;
    }
    return `Low-confidence candidate (${compositeScore}%): Weak correlation with baseline schedule scope. Likely unmapped or new work item.`;
  }
}

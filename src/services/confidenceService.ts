import { ConfidenceLevel } from '../types';

export class ConfidenceService {
  /**
   * Classifies a composite match score into standard confidence tiers
   */
  public static classify(score: number, isAmbiguous = false): ConfidenceLevel {
    if (score < 55) {
      return 'UNMATCHED';
    }
    if (score < 60) {
      return 'LOW';
    }
    if (score < 85 || isAmbiguous) {
      return 'MEDIUM';
    }
    return 'HIGH';
  }

  /**
   * Evaluates if a record qualifies for fast-track one-click planner review
   */
  public static isFastTrackEligible(score: number, isAmbiguous = false): boolean {
    return score >= 85 && !isAmbiguous;
  }

  /**
   * Returns human-readable label and color token for confidence level
   */
  public static getBadgeMeta(level: ConfidenceLevel, score: number, isAmbiguous = false) {
    if (isAmbiguous) {
      return {
        label: `MEDIUM (${score}%) — Ambiguous Gap`,
        variant: 'warning' as const,
        description: 'Less than 10% score gap between top candidates. Planner review required.'
      };
    }

    switch (level) {
      case 'HIGH':
        return {
          label: `HIGH (${score}%) — Fast-Track`,
          variant: 'success' as const,
          description: 'High confidence match. Safe for fast-track one-click approval.'
        };
      case 'MEDIUM':
        return {
          label: `MEDIUM (${score}%) — Review`,
          variant: 'warning' as const,
          description: 'Partial match. Requires planner review and verification.'
        };
      case 'LOW':
      case 'UNMATCHED':
      default:
        return {
          label: `UNMATCHED (${score}%) — New Scope`,
          variant: 'danger' as const,
          description: 'Low correlation with baseline schedule. Consider proposing as new activity.'
        };
    }
  }
}

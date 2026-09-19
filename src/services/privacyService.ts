/**
 * PRIVACY SERVICE
 * Provides deterministic redaction of sensitive personnel and contractor names
 * when Privacy Mode is activated.
 */

export class PrivacyService {
  private static readonly REDACTION_RULES: Array<{ pattern: RegExp; replacement: string }> = [
    { pattern: /\bR\.\s*Sharma\b/gi, replacement: '[REDACTED-SUPERVISOR-A]' },
    { pattern: /\bM\.\s*Joshi\b/gi, replacement: '[CONTRACTOR-SECURE-LEAD]' },
    { pattern: /\bV\.\s*Patel\b/gi, replacement: '[REDACTED-FIELD-ENG]' },
    { pattern: /\bK\.\s*Singh\b/gi, replacement: '[REDACTED-SUPERVISOR-B]' },
    { pattern: /\bA\.\s*Khan\b/gi, replacement: '[REDACTED-SUPERVISOR-C]' },
    { pattern: /\bS\.\s*Mehta\b/gi, replacement: '[REDACTED-SAFETY-OFFICER]' },
    { pattern: /\bSubcontractor\b/gi, replacement: '[CONTRACTOR-PARTNER]' }
  ];

  /**
   * Masks sensitive worker names and contractor references if Privacy Mode is active
   */
  public static maskText(text: string, enabled: boolean): string {
    if (!enabled || !text) return text;
    let result = text;
    for (const rule of this.REDACTION_RULES) {
      result = result.replace(rule.pattern, rule.replacement);
    }
    return result;
  }
}

/**
 * AI Credential Analyzer
 * Scans credential files and determines authenticity, weight, and relevance scores
 */

import { Credential, CredentialType } from './credentialVerificationManager';

export interface CredentialAnalysis {
  authenticityScore: number; // 0-100
  weightScore: number; // 0-100
  relevanceScore: number; // 0-100
  credibilityIndicators: string[];
  suggestedSkills: string[];
  analysisNotes: string;
}

// Known credential issuing bodies and their weight
const KNOWN_ISSUERS: Record<string, { weight: number; credibility: string[] }> = {
  // Government/Accreditation
  'U.S. Department of Education': { weight: 95, credibility: ['Government-Issued', 'Accredited'] },
  'National Association for the Education of Young Children': {
    weight: 90,
    credibility: ['Industry-Recognized', 'Accredited']
  },
  'Council for Professional Recognition': { weight: 88, credibility: ['Accredited', 'Nationally Recognized'] },
  Coursera: { weight: 75, credibility: ['Online Certified', 'Industry-Recognized'] },
  'edX': { weight: 75, credibility: ['Online Certified', 'University-Backed'] },
  Udemy: { weight: 50, credibility: ['Online Certified', 'Platform-Based'] },
  LinkedIn: { weight: 65, credibility: ['Digital Badge', 'Professional Network'] },

  // Early Childhood Specific
  Brightwheel: { weight: 70, credibility: ['Professional Development', 'Industry-Standard'] },
  'child care resource center': { weight: 75, credibility: ['Specialized Training', 'Industry-Recognized'] },

  // University Programs
  University: { weight: 85, credibility: ['Accredited', 'University-Issued'] }
};

// Skill area keywords to match credentials
const SKILL_KEYWORDS: Record<string, string[]> = {
  'classroom-management': [
    'classroom',
    'management',
    'discipline',
    'behavior',
    'classroom management',
    'organization'
  ],
  'student-engagement': [
    'engagement',
    'motivation',
    'active learning',
    'participation',
    'interactive',
    'student involvement'
  ],
  'curriculum-design': [
    'curriculum',
    'instructional design',
    'lesson planning',
    'course design',
    'pedagogy',
    'planning'
  ],
  'assessment-feedback': ['assessment', 'evaluation', 'testing', 'feedback', 'rubric', 'grading'],
  'parent-communication': [
    'parent',
    'family',
    'communication',
    'conference',
    'engagement',
    'collaboration'
  ],
  'professional-growth': [
    'professional development',
    'growth',
    'certification',
    'training',
    'advancement',
    'mastery'
  ]
};

export class AICredentialAnalyzer {
  /**
   * Analyze a credential and return authenticity/weight/relevance scores
   */
  analyzeCredential(credential: Credential): CredentialAnalysis {
    const authenticityScore = this.calculateAuthenticityScore(credential);
    const weightScore = this.calculateWeightScore(credential);
    const relevanceScore = this.calculateRelevanceScore(credential);
    const credibilityIndicators = this.extractCredibilityIndicators(credential);
    const suggestedSkills = this.suggestSkills(credential);
    const analysisNotes = this.generateAnalysisNotes(credential, authenticityScore, weightScore);

    return {
      authenticityScore,
      weightScore,
      relevanceScore,
      credibilityIndicators,
      suggestedSkills,
      analysisNotes
    };
  }

  /**
   * Calculate authenticity score (0-100)
   * Checks: known issuer, date formats, credential URL, description quality
   */
  private calculateAuthenticityScore(credential: Credential): number {
    let score = 50; // Base score

    // Check if issuer is known/recognized
    const issuerMatch = this.findIssuerMatch(credential.issuer);
    if (issuerMatch) {
      score += 20;
    }

    // Bonus for credential URL (verifiable)
    if (credential.credentialUrl && this.isValidUrl(credential.credentialUrl)) {
      score += 15;
    }

    // Bonus for detailed description
    if (credential.description && credential.description.length > 100) {
      score += 10;
    }

    // Bonus for uploaded files
    if (credential.files && credential.files.length > 0) {
      score += Math.min(15, credential.files.length * 5);
    }

    // Penalty for missing expiry date (if expected)
    if (!credential.expiryDate && this.shouldHaveExpiry(credential.type)) {
      score -= 10;
    }

    // Penalty for very recent issuance (might be fake)
    const daysOld = Math.floor((Date.now() - credential.issueDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysOld < 7) {
      score -= 15;
    }

    return Math.min(100, Math.max(20, score));
  }

  /**
   * Calculate weight score (0-100)
   * Based on credential type, issuer reputation, and relevance
   */
  private calculateWeightScore(credential: Credential): number {
    let score = 0;

    // Type-based weight
    const typeWeights: Record<CredentialType, number> = {
      [CredentialType.DEGREE]: 95,
      [CredentialType.CERTIFICATION]: 85,
      [CredentialType.LICENSE]: 90,
      [CredentialType.CERTIFICATE]: 70,
      [CredentialType.BADGE]: 50,
      [CredentialType.CREDENTIAL]: 60
    };

    score += typeWeights[credential.type] || 50;

    // Issuer reputation bonus
    const issuerMatch = this.findIssuerMatch(credential.issuer);
    if (issuerMatch) {
      score = (score + issuerMatch.weight) / 2; // Average the scores
    }

    // Bonus for multiple associated skills
    if (credential.associatedSkills && credential.associatedSkills.length > 0) {
      score += Math.min(10, credential.associatedSkills.length * 3);
    }

    return Math.min(100, Math.max(30, score));
  }

  /**
   * Calculate relevance score (0-100)
   * Based on keyword matching and skill area alignment
   */
  private calculateRelevanceScore(credential: Credential): number {
    let score = 60; // Default baseline

    const searchText = `${credential.title} ${credential.description || ''}`.toLowerCase();

    // Check keyword matches for each skill area
    let matchedSkills = 0;
    for (const [skillId, keywords] of Object.entries(SKILL_KEYWORDS)) {
      const matches = keywords.filter(keyword => searchText.includes(keyword.toLowerCase()));
      if (matches.length > 0) {
        matchedSkills++;
        score += Math.min(8, matches.length * 2); // Up to 8 points per skill
      }
    }

    // Bonus if highly relevant to teaching
    const teachingKeywords = ['teach', 'education', 'learning', 'student', 'classroom', 'instructor'];
    const teachingMatches = teachingKeywords.filter(kw => searchText.includes(kw));
    if (teachingMatches.length > 0) {
      score += 15;
    }

    return Math.min(100, score);
  }

  /**
   * Extract credibility indicators from credential
   */
  private extractCredibilityIndicators(credential: Credential): string[] {
    const indicators: string[] = [];

    const issuerMatch = this.findIssuerMatch(credential.issuer);
    if (issuerMatch) {
      indicators.push(...issuerMatch.credibility);
    }

    if (credential.credentialUrl) {
      indicators.push('Verifiable Link');
    }

    if (credential.files && credential.files.length > 0) {
      indicators.push('Document Evidence');
    }

    if (credential.expiryDate && credential.expiryDate > new Date()) {
      indicators.push('Active Credential');
    }

    return [...new Set(indicators)]; // Remove duplicates
  }

  /**
   * Suggest skills this credential relates to
   */
  private suggestSkills(credential: Credential): string[] {
    const searchText = `${credential.title} ${credential.description || ''}`.toLowerCase();
    const suggestedSkills: string[] = [];

    for (const [skillId, keywords] of Object.entries(SKILL_KEYWORDS)) {
      const matches = keywords.filter(keyword => searchText.includes(keyword.toLowerCase()));
      if (matches.length > 0) {
        suggestedSkills.push(skillId);
      }
    }

    // If no skills matched, guess based on type
    if (suggestedSkills.length === 0) {
      if (credential.type === CredentialType.CERTIFICATION) {
        suggestedSkills.push('professional-growth');
      }
      if (credential.type === CredentialType.DEGREE) {
        suggestedSkills.push('curriculum-design', 'professional-growth');
      }
    }

    return suggestedSkills.slice(0, 3); // Top 3 skills
  }

  /**
   * Generate human-readable analysis notes
   */
  private generateAnalysisNotes(
    credential: Credential,
    authenticityScore: number,
    weightScore: number
  ): string {
    const notes: string[] = [];

    if (authenticityScore >= 80) {
      notes.push('High confidence in authenticity.');
    } else if (authenticityScore >= 60) {
      notes.push('Moderate confidence in authenticity.');
    } else {
      notes.push('Lower authenticity confidence - verify with issuer.');
    }

    if (weightScore >= 80) {
      notes.push('Highly valuable credential in education field.');
    } else if (weightScore >= 60) {
      notes.push('Moderately valuable professional credential.');
    } else {
      notes.push('Emerging or specialized credential.');
    }

    const issuerMatch = this.findIssuerMatch(credential.issuer);
    if (issuerMatch) {
      notes.push(`Issuer recognized: ${credential.issuer}`);
    }

    if (credential.credentialUrl) {
      notes.push('Can be verified online.');
    }

    return notes.join(' ');
  }

  /**
   * Find issuer in known issuers database
   */
  private findIssuerMatch(issuer: string): { weight: number; credibility: string[] } | null {
    const normalizedIssuer = issuer.toLowerCase();

    // Exact match
    for (const [knownIssuer, data] of Object.entries(KNOWN_ISSUERS)) {
      if (normalizedIssuer === knownIssuer.toLowerCase()) {
        return data;
      }
    }

    // Partial match
    for (const [knownIssuer, data] of Object.entries(KNOWN_ISSUERS)) {
      if (normalizedIssuer.includes(knownIssuer.toLowerCase()) ||
          knownIssuer.toLowerCase().includes(normalizedIssuer)) {
        return data;
      }
    }

    return null;
  }

  /**
   * Validate URL format
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Determine if credential type should have expiry date
   */
  private shouldHaveExpiry(type: CredentialType): boolean {
    return [CredentialType.CERTIFICATION, CredentialType.LICENSE, CredentialType.BADGE].includes(
      type
    );
  }

  /**
   * Calculate points to award for a credential
   * Based on all three scores
   */
  calculatePointsAwarded(
    authenticityScore: number,
    weightScore: number,
    relevanceScore: number
  ): number {
    const averageScore = (authenticityScore + weightScore + relevanceScore) / 3;

    // Map score to points
    // 0-40: 50 points
    // 40-60: 100 points
    // 60-80: 200 points
    // 80-100: 350 points

    if (averageScore >= 80) return 350;
    if (averageScore >= 60) return 200;
    if (averageScore >= 40) return 100;
    return 50;
  }

  /**
   * Distribute points across suggested skills
   */
  distributeSkillPoints(
    totalPoints: number,
    skills: string[],
    relevanceScore: number
  ): { skillId: string; points: number }[] {
    if (skills.length === 0) {
      return [];
    }

    const basePointsPerSkill = Math.floor(totalPoints / skills.length);
    const remainder = totalPoints % skills.length;

    return skills.map((skillId, index) => ({
      skillId,
      points: basePointsPerSkill + (index < remainder ? 1 : 0)
    }));
  }
}

// Singleton instance
export const credentialAnalyzer = new AICredentialAnalyzer();

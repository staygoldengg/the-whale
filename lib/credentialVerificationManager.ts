/**
 * Credential Verification Manager
 * Handles credential submission, storage, verification, and authenticity scoring
 */

export enum CredentialStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

export enum CredentialType {
  CERTIFICATE = 'certificate',
  CERTIFICATION = 'certification',
  DEGREE = 'degree',
  BADGE = 'badge',
  LICENSE = 'license',
  CREDENTIAL = 'credential'
}

export interface CredentialFile {
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  fileData?: string; // base64 encoded for storage
}

export interface Credential {
  id: string;
  userId: string;
  title: string;
  type: CredentialType;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialUrl?: string;
  files: CredentialFile[];
  associatedSkills: string[]; // skill IDs this credential teaches
  status: CredentialStatus;
  
  // AI Analysis Scores
  authenticityScore: number; // 0-100, AI-determined likelihood of authenticity
  weightScore: number; // 0-100, value/impact of credential
  relevanceScore: number; // 0-100, relevance to teaching career
  
  // Points Awarded
  totalPointsAwarded: number;
  pointsBySkill: { skillId: string; points: number }[];
  
  // Metadata
  verificationNotes?: string;
  submittedAt: Date;
  verifiedAt?: Date;
  verifiedBy?: string;
  rejectionReason?: string;
  
  // Display
  imageUrl?: string;
  description?: string;
  credibilityIndicators?: string[]; // e.g., ["Accredited", "Industry-Recognized", "Government-Issued"]
}

export interface CredentialVerificationRequest {
  title: string;
  type: CredentialType;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  description?: string;
  credentialUrl?: string;
  files: CredentialFile[];
}

export class CredentialVerificationManager {
  private credentials: Map<string, Credential> = new Map();
  private listeners: Set<(credentials: Credential[]) => void> = new Set();
  private credentialsByUser: Map<string, string[]> = new Map();

  constructor() {
    this.loadCredentialsFromStorage();
  }

  /**
   * Submit a new credential for verification
   */
  submitCredential(
    userId: string,
    request: CredentialVerificationRequest
  ): Credential {
    const credential: Credential = {
      id: `cred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      title: request.title,
      type: request.type,
      issuer: request.issuer,
      issueDate: request.issueDate,
      expiryDate: request.expiryDate,
      credentialUrl: request.credentialUrl,
      files: request.files,
      associatedSkills: [],
      status: CredentialStatus.PENDING,
      authenticityScore: 0,
      weightScore: 0,
      relevanceScore: 0,
      totalPointsAwarded: 0,
      pointsBySkill: [],
      submittedAt: new Date(),
      description: request.description
    };

    this.credentials.set(credential.id, credential);
    this.addToUserCredentials(userId, credential.id);
    this.notifyListeners();

    return credential;
  }

  /**
   * Get credential by ID
   */
  getCredential(credentialId: string): Credential | null {
    return this.credentials.get(credentialId) || null;
  }

  /**
   * Get all credentials for a user
   */
  getUserCredentials(userId: string): Credential[] {
    const credentialIds = this.credentialsByUser.get(userId) || [];
    return credentialIds
      .map(id => this.credentials.get(id))
      .filter((c): c is Credential => c !== undefined);
  }

  /**
   * Get verified credentials for a user
   */
  getVerifiedCredentials(userId: string): Credential[] {
    return this.getUserCredentials(userId).filter(
      c => c.status === CredentialStatus.VERIFIED
    );
  }

  /**
   * Update credential with AI analysis scores
   * Called by AI analyzer after scanning
   */
  updateCredentialScores(
    credentialId: string,
    authenticityScore: number,
    weightScore: number,
    relevanceScore: number,
    credibilityIndicators?: string[]
  ): Credential | null {
    const credential = this.credentials.get(credentialId);
    if (!credential) return null;

    credential.authenticityScore = Math.min(100, Math.max(0, authenticityScore));
    credential.weightScore = Math.min(100, Math.max(0, weightScore));
    credential.relevanceScore = Math.min(100, Math.max(0, relevanceScore));
    credential.credibilityIndicators = credibilityIndicators;

    this.notifyListeners();
    return credential;
  }

  /**
   * Verify a credential (mark as verified with points awarded)
   */
  verifyCredential(
    credentialId: string,
    pointsAwarded: number,
    skillPoints: { skillId: string; points: number }[],
    verifiedBy: string = 'system'
  ): Credential | null {
    const credential = this.credentials.get(credentialId);
    if (!credential) return null;

    credential.status = CredentialStatus.VERIFIED;
    credential.totalPointsAwarded = pointsAwarded;
    credential.pointsBySkill = skillPoints;
    credential.verifiedAt = new Date();
    credential.verifiedBy = verifiedBy;

    this.notifyListeners();
    return credential;
  }

  /**
   * Reject a credential
   */
  rejectCredential(credentialId: string, reason: string): Credential | null {
    const credential = this.credentials.get(credentialId);
    if (!credential) return null;

    credential.status = CredentialStatus.REJECTED;
    credential.rejectionReason = reason;
    credential.verifiedAt = new Date();

    this.notifyListeners();
    return credential;
  }

  /**
   * Mark credential as expired
   */
  expireCredential(credentialId: string): Credential | null {
    const credential = this.credentials.get(credentialId);
    if (!credential) return null;

    if (!credential.expiryDate || credential.expiryDate < new Date()) {
      credential.status = CredentialStatus.EXPIRED;
      this.notifyListeners();
    }

    return credential;
  }

  /**
   * Get credential stats for user
   */
  getCredentialStats(userId: string) {
    const credentials = this.getUserCredentials(userId);
    const verified = credentials.filter(c => c.status === CredentialStatus.VERIFIED);
    const pending = credentials.filter(c => c.status === CredentialStatus.PENDING);
    const rejected = credentials.filter(c => c.status === CredentialStatus.REJECTED);

    const totalPoints = verified.reduce((sum, c) => sum + c.totalPointsAwarded, 0);
    const skillBreakdown: Map<string, number> = new Map();

    verified.forEach(credential => {
      credential.pointsBySkill.forEach(({ skillId, points }) => {
        const current = skillBreakdown.get(skillId) || 0;
        skillBreakdown.set(skillId, current + points);
      });
    });

    return {
      totalCredentials: credentials.length,
      verified: verified.length,
      pending: pending.length,
      rejected: rejected.length,
      totalPoints,
      skillBreakdown: Array.from(skillBreakdown.entries()).map(([skillId, points]) => ({
        skillId,
        points
      })),
      averageAuthenticityScore:
        verified.length > 0
          ? verified.reduce((sum, c) => sum + c.authenticityScore, 0) / verified.length
          : 0,
      averageWeightScore:
        verified.length > 0
          ? verified.reduce((sum, c) => sum + c.weightScore, 0) / verified.length
          : 0
    };
  }

  /**
   * Subscribe to credential changes
   */
  subscribe(listener: (credentials: Credential[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of changes
   */
  private notifyListeners() {
    const allCredentials = Array.from(this.credentials.values());
    this.listeners.forEach(listener => listener(allCredentials));
  }

  /**
   * Add credential to user's credential list
   */
  private addToUserCredentials(userId: string, credentialId: string) {
    const userCreds = this.credentialsByUser.get(userId) || [];
    userCreds.push(credentialId);
    this.credentialsByUser.set(userId, userCreds);
  }

  /**
   * Persist credentials to localStorage
   */
  saveToStorage() {
    try {
      const data = {
        credentials: Array.from(this.credentials.entries()),
        credentialsByUser: Array.from(this.credentialsByUser.entries())
      };
      localStorage.setItem('whale_credentials', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save credentials to storage:', error);
    }
  }

  /**
   * Load credentials from localStorage
   */
  private loadCredentialsFromStorage() {
    try {
      const data = localStorage.getItem('whale_credentials');
      if (!data) return;

      const parsed = JSON.parse(data);
      this.credentials = new Map(parsed.credentials);
      this.credentialsByUser = new Map(parsed.credentialsByUser);
    } catch (error) {
      console.error('Failed to load credentials from storage:', error);
    }
  }

  /**
   * Export credentials as JSON (for backup)
   */
  exportCredentials(userId: string): string {
    const credentials = this.getUserCredentials(userId);
    return JSON.stringify(credentials, null, 2);
  }

  /**
   * Clear all credentials (admin function)
   */
  clearAll() {
    this.credentials.clear();
    this.credentialsByUser.clear();
    this.notifyListeners();
  }
}

// Singleton instance
export const credentialManager = new CredentialVerificationManager();

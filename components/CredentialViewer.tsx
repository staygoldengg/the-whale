'use client';

import React from 'react';
import { useCredentialManagement, useCredentialAnalytics } from '@/lib/credentialHooks';
import { CredentialStatus } from '@/lib/credentialVerificationManager';
import { LuxuryButton, LuxuryCard, LuxurySection, LuxuryText, LuxuryBadge } from '@/components/LuxuryUI';

interface CredentialViewerProps {
  userId: string;
}

const STATUS_CONFIG: Record<CredentialStatus, { color: string; icon: string; label: string }> = {
  [CredentialStatus.PENDING]: { color: 'bg-yellow-50 border-yellow-200', icon: '⏳', label: 'Pending Verification' },
  [CredentialStatus.VERIFIED]: { color: 'bg-green-50 border-green-200', icon: '✅', label: 'Verified' },
  [CredentialStatus.REJECTED]: { color: 'bg-red-50 border-red-200', icon: '❌', label: 'Rejected' },
  [CredentialStatus.EXPIRED]: { color: 'bg-gray-50 border-gray-200', icon: '⏰', label: 'Expired' }
};

export function CredentialViewer({ userId }: CredentialViewerProps) {
  const { credentials, stats } = useCredentialManagement(userId);
  const analytics = useCredentialAnalytics(userId);

  if (!analytics || !stats) {
    return <div>Loading credentials...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <LuxuryCard variant="default" className="p-4 text-center">
          <div className="text-3xl mb-2">📊</div>
          <LuxuryText variant="label" className="text-slate-600">Total Credentials</LuxuryText>
          <LuxuryText variant="h2" className="text-blue-600">{analytics.totalCredentials}</LuxuryText>
        </LuxuryCard>

        <LuxuryCard variant="default" className="p-4 text-center">
          <div className="text-3xl mb-2">✅</div>
          <LuxuryText variant="label" className="text-slate-600">Verified</LuxuryText>
          <LuxuryText variant="h2" className="text-green-600">{analytics.verifiedCount}</LuxuryText>
        </LuxuryCard>

        <LuxuryCard variant="default" className="p-4 text-center">
          <div className="text-3xl mb-2">⏳</div>
          <LuxuryText variant="label" className="text-slate-600">Pending</LuxuryText>
          <LuxuryText variant="h2" className="text-yellow-600">{analytics.pendingCount}</LuxuryText>
        </LuxuryCard>

        <LuxuryCard variant="default" className="p-4 text-center">
          <div className="text-3xl mb-2">⭐</div>
          <LuxuryText variant="label" className="text-slate-600">Total Points</LuxuryText>
          <LuxuryText variant="h2" className="text-purple-600">
            {analytics.totalPointsEarned}
          </LuxuryText>
        </LuxuryCard>
      </div>

      {/* AI Scores */}
      <LuxurySection title="🤖 AI Analysis Scores" subtitle="Average scores across verified credentials">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="flex items-end justify-between mb-2">
              <LuxuryText variant="label">Authenticity</LuxuryText>
              <span className="text-2xl font-bold text-blue-600">{analytics.averageAuthenticityScore}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                style={{ width: `${analytics.averageAuthenticityScore}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-end justify-between mb-2">
              <LuxuryText variant="label">Weight</LuxuryText>
              <span className="text-2xl font-bold text-purple-600">{analytics.averageWeightScore}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-purple-600"
                style={{ width: `${analytics.averageWeightScore}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-end justify-between mb-2">
              <LuxuryText variant="label">Relevance</LuxuryText>
              <span className="text-2xl font-bold text-green-600">{analytics.averageRelevanceScore}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600"
                style={{ width: `${analytics.averageRelevanceScore}%` }}
              />
            </div>
          </div>
        </div>
      </LuxurySection>

      {/* Credentials List */}
      <LuxurySection title="📜 Your Credentials" subtitle={`${credentials.length} credential${credentials.length !== 1 ? 's' : ''} submitted`}>
        {credentials.length === 0 ? (
          <LuxuryCard variant="glass" className="p-8 text-center">
            <div className="text-4xl mb-3">📋</div>
            <LuxuryText variant="body" className="text-slate-600">
              No credentials submitted yet. Start building your credential portfolio!
            </LuxuryText>
          </LuxuryCard>
        ) : (
          <div className="space-y-3">
            {credentials.map(credential => {
              const statusConfig = STATUS_CONFIG[credential.status];
              return (
                <LuxuryCard
                  key={credential.id}
                  variant="default"
                  className={`p-5 border ${statusConfig.color}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{statusConfig.icon}</span>
                        <div>
                          <LuxuryText variant="label">{credential.title}</LuxuryText>
                          <LuxuryText variant="body" className="text-slate-600 text-sm">
                            {credential.issuer}
                          </LuxuryText>
                        </div>
                      </div>
                    </div>
                    <LuxuryBadge
                      variant={
                        credential.status === CredentialStatus.VERIFIED
                          ? 'success'
                          : credential.status === CredentialStatus.REJECTED
                            ? 'error'
                            : 'info'
                      }
                    >
                      {statusConfig.label}
                    </LuxuryBadge>
                  </div>

                  {/* Credential Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                    <div>
                      <LuxuryText variant="label" className="text-xs text-slate-600">
                        Type
                      </LuxuryText>
                      <p className="text-slate-900 capitalize">{credential.type}</p>
                    </div>
                    <div>
                      <LuxuryText variant="label" className="text-xs text-slate-600">
                        Issued
                      </LuxuryText>
                      <p className="text-slate-900">
                        {new Date(credential.issueDate).toLocaleDateString()}
                      </p>
                    </div>
                    {credential.expiryDate && (
                      <div>
                        <LuxuryText variant="label" className="text-xs text-slate-600">
                          Expires
                        </LuxuryText>
                        <p className="text-slate-900">
                          {new Date(credential.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    <div>
                      <LuxuryText variant="label" className="text-xs text-slate-600">
                        Files
                      </LuxuryText>
                      <p className="text-slate-900">{credential.files.length} uploaded</p>
                    </div>
                  </div>

                  {/* AI Scores (if verified) */}
                  {credential.status === CredentialStatus.VERIFIED && (
                    <div className="mb-3 p-3 bg-white/50 rounded border border-slate-200">
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <LuxuryText variant="label" className="text-xs">
                            Authenticity
                          </LuxuryText>
                          <p className="font-semibold text-blue-600">
                            {credential.authenticityScore}%
                          </p>
                        </div>
                        <div>
                          <LuxuryText variant="label" className="text-xs">
                            Weight
                          </LuxuryText>
                          <p className="font-semibold text-purple-600">
                            {credential.weightScore}%
                          </p>
                        </div>
                        <div>
                          <LuxuryText variant="label" className="text-xs">
                            Relevance
                          </LuxuryText>
                          <p className="font-semibold text-green-600">
                            {credential.relevanceScore}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Points Awarded */}
                  {credential.totalPointsAwarded > 0 && (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded border border-blue-200">
                      <LuxuryText variant="label">Points Awarded</LuxuryText>
                      <span className="text-2xl font-bold text-blue-600">
                        +{credential.totalPointsAwarded}
                      </span>
                    </div>
                  )}

                  {/* Skill Breakdown */}
                  {credential.pointsBySkill.length > 0 && (
                    <div className="mt-3 p-3 bg-white/50 rounded">
                      <LuxuryText variant="label" className="text-xs mb-2">
                        Skills Improved
                      </LuxuryText>
                      <div className="flex flex-wrap gap-2">
                        {credential.pointsBySkill.map((sp, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                          >
                            {sp.skillId.replace('-', ' ')}: +{sp.points}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rejection Reason */}
                  {credential.rejectionReason && (
                    <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
                      <LuxuryText variant="label" className="text-xs text-red-700 mb-1">
                        Rejection Reason
                      </LuxuryText>
                      <p className="text-sm text-red-800">{credential.rejectionReason}</p>
                    </div>
                  )}
                </LuxuryCard>
              );
            })}
          </div>
        )}
      </LuxurySection>
    </div>
  );
}

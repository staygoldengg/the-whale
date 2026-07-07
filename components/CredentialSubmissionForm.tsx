'use client';

import React, { useState, useRef } from 'react';
import { useCredentialManagement } from '@/lib/credentialHooks';
import { CredentialType } from '@/lib/credentialVerificationManager';
import { LuxuryButton, LuxuryCard, LuxurySection, LuxuryText, LuxuryInput } from '@/components/LuxuryUI';

interface CredentialSubmissionProps {
  userId: string;
  onSuccess?: () => void;
}

export function CredentialSubmissionForm({ userId, onSuccess }: CredentialSubmissionProps) {
  const { submitCredential, loading } = useCredentialManagement(userId);
  const [formData, setFormData] = useState({
    title: '',
    type: CredentialType.CERTIFICATE as CredentialType,
    issuer: '',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    description: '',
    credentialUrl: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).map(file => {
      const reader = new FileReader();
      return new Promise<any>(resolve => {
        reader.onload = () => {
          resolve({
            name: file.name,
            type: file.type,
            size: file.size,
            uploadedAt: new Date(),
            fileData: reader.result as string
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newFiles).then(files => {
      setUploadedFiles(prev => [...prev, ...files]);
    });
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.title || !formData.issuer) {
      setError('Title and Issuer are required');
      return;
    }

    if (uploadedFiles.length === 0) {
      setError('Please upload at least one credential file');
      return;
    }

    try {
      await submitCredential({
        title: formData.title,
        type: formData.type,
        issuer: formData.issuer,
        issueDate: new Date(formData.issueDate),
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined,
        description: formData.description,
        credentialUrl: formData.credentialUrl,
        files: uploadedFiles
      });

      setSuccess(true);
      setFormData({
        title: '',
        type: CredentialType.CERTIFICATE,
        issuer: '',
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        description: '',
        credentialUrl: ''
      });
      setUploadedFiles([]);

      if (onSuccess) {
        setTimeout(onSuccess, 1500);
      }
    } catch (err) {
      setError('Failed to submit credential. Please try again.');
      console.error('Submission error:', err);
    }
  };

  return (
    <LuxurySection title="📋 Submit Credentials" subtitle="Upload your achievements and let AI verify them">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Success Message */}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <LuxuryText variant="body" className="text-green-800">
              ✓ Credential submitted successfully! AI is analyzing it now.
            </LuxuryText>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <LuxuryText variant="body" className="text-red-800">
              ✗ {error}
            </LuxuryText>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Credential Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Advanced Classroom Management Certificate"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Credential Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Credential Type *
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={CredentialType.CERTIFICATE}>Certificate</option>
            <option value={CredentialType.CERTIFICATION}>Certification</option>
            <option value={CredentialType.DEGREE}>Degree</option>
            <option value={CredentialType.LICENSE}>License</option>
            <option value={CredentialType.BADGE}>Digital Badge</option>
            <option value={CredentialType.CREDENTIAL}>Other Credential</option>
          </select>
        </div>

        {/* Issuer */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Issuing Organization *
          </label>
          <input
            type="text"
            name="issuer"
            value={formData.issuer}
            onChange={handleInputChange}
            placeholder="e.g., National Association for the Education of Young Children"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Issue Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Issue Date *
            </label>
            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Expiry Date (optional)
            </label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description (optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe what you learned or what this credential recognizes..."
            rows={4}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Credential URL */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Credential URL (optional)
          </label>
          <input
            type="url"
            name="credentialUrl"
            value={formData.credentialUrl}
            onChange={handleInputChange}
            placeholder="https://verify.myorganization.com/cert/123456"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Upload Credentials *
          </label>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="text-3xl mb-2">📄</div>
            <p className="text-slate-600">
              Click to upload certificates, transcripts, or credential images
            </p>
            <p className="text-sm text-slate-500 mt-1">
              PDF, JPG, PNG, or Word documents
            </p>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <LuxuryText variant="label">Uploaded Files:</LuxuryText>
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📎</span>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{file.name}</p>
                      <p className="text-xs text-slate-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 font-medium text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:shadow-lg disabled:opacity-50 transition"
          >
            {loading ? 'Analyzing...' : 'Submit & Verify with AI'}
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </LuxurySection>
  );
}

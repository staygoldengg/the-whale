import crypto from 'node:crypto';
import { z } from 'zod';
import { sanitizeText } from './api';

export const bridgeDataTypes = ['roster', 'billing', 'attendance', 'reports', 'messages', 'unknown'] as const;
export type BridgeDataType = (typeof bridgeDataTypes)[number];

export const BrightwheelRowSchema = z
  .record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]))
  .transform((row) => {
    const cleaned: Record<string, string | number | boolean | null> = {};
    for (const [key, value] of Object.entries(row)) {
      const cleanKey = sanitizeText(key).slice(0, 120);
      if (!cleanKey) continue;
      cleaned[cleanKey] = typeof value === 'string' ? sanitizeText(value).slice(0, 2000) : value;
    }
    return cleaned;
  });

export const BrightwheelIngestSchema = z.object({
  source: z.enum(['extension', 'csv', 'manual', 'playwright']).default('extension'),
  dataType: z.enum(bridgeDataTypes).default('unknown'),
  centerName: z.string().max(160).optional().nullable(),
  pageUrl: z.string().max(2000).optional().nullable(),
  pageTitle: z.string().max(300).optional().nullable(),
  rows: z.array(BrightwheelRowSchema).min(1).max(5000),
  metadata: z.record(z.string(), z.unknown()).optional().default({})
});

export type BrightwheelIngestInput = z.infer<typeof BrightwheelIngestSchema>;

export function generateBridgeToken() {
  const raw = `whale_bw_${crypto.randomBytes(32).toString('base64url')}`;
  return { raw, hash: hashBridgeToken(raw), last4: raw.slice(-4) };
}

export function hashBridgeToken(token: string) {
  return crypto.createHash('sha256').update(token.trim()).digest('hex');
}

export function validateBridgeToken(token: string, storedHash: string): boolean {
  const computedHash = hashBridgeToken(token);
  return crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(storedHash));
}

export function extractTableMetadata(input: BrightwheelIngestInput) {
  return {
    sourceType: input.source,
    dataType: input.dataType,
    rowCount: input.rows.length,
    centerName: input.centerName || 'Unknown',
    pageTitle: input.pageTitle || 'No title',
    timestamp: new Date().toISOString(),
    columns: input.rows.length > 0 ? Object.keys(input.rows[0]) : []
  };
}

export function isValidBrightwheelImport(input: BrightwheelIngestInput): boolean {
  try {
    BrightwheelIngestSchema.parse(input);
    return true;
  } catch {
    return false;
  }
}

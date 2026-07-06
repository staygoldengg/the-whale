import { NextResponse } from 'next/server';
import { z, ZodError } from 'zod';

export class HttpError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, message: string, code = 'APP_ERROR', details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function fail(error: unknown) {
  if (error instanceof HttpError) {
    return NextResponse.json({ error: error.message, code: error.code, details: error.details ?? null }, { status: error.status });
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: 'Invalid request body.', code: 'VALIDATION_ERROR', details: z.treeifyError(error) },
      { status: 422 }
    );
  }

  const message = error instanceof Error ? error.message : 'Unexpected server error.';
  return NextResponse.json({ error: message, code: 'SERVER_ERROR' }, { status: 500 });
}

export async function parseJson<T extends z.ZodTypeAny>(req: Request, schema: T): Promise<z.infer<T>> {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    throw new HttpError(400, 'Request must be valid JSON.', 'INVALID_JSON');
  }
  return schema.parse(json);
}

export function sanitizeText(value: string) {
  return value.replace(/\u0000/g, '').replace(/[ \t]+\n/g, '\n').trim();
}

export function normalizeEmail(value?: string | null) {
  const cleaned = (value ?? '').trim().toLowerCase();
  return cleaned.length ? cleaned : null;
}

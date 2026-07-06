import { supabaseAdmin } from './supabaseAdmin';

export async function writeAuditLog(input: {
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  try {
    await supabaseAdmin.from('audit_logs').insert({
      actor_id: input.actorId ?? null,
      action: input.action,
      entity_type: input.entityType,
      entity_id: input.entityId ?? null,
      metadata: input.metadata ?? {}
    });
  } catch (error) {
    console.error('[audit_log_failed]', error);
  }
}

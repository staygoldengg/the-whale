import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { fail, ok, parseJson, sanitizeText } from '@/lib/api';
import { createCalendarEvent, createGmailDraft, createWorkspaceDoc } from '@/lib/googleWorkspace';
import { writeAuditLog } from '@/lib/audit';

const Body = z.object({
  action: z.enum(['create_doc','create_calendar_event','draft_email','save_to_drive']),
  title: z.string().min(1).max(160).transform(sanitizeText),
  content: z.string().min(1).max(50000).transform(sanitizeText),
  recipients: z.array(z.string().email()).optional(),
  date: z.string().optional(),
  endDate: z.string().optional(),
  folderId: z.string().optional()
});

export async function POST(req: Request) {
  try {
    const { user } = await requireAuth();
    const body = await parseJson(req, Body);
    let result: unknown;

    if (body.action === 'create_doc' || body.action === 'save_to_drive') {
      result = await createWorkspaceDoc({ title: body.title, content: body.content, folderId: body.folderId });
    } else if (body.action === 'create_calendar_event') {
      if (!body.date) throw new Error('date is required for create_calendar_event.');
      result = await createCalendarEvent({ title: body.title, content: body.content, date: body.date, endDate: body.endDate, attendees: body.recipients });
    } else {
      result = await createGmailDraft({ title: body.title, content: body.content, recipients: body.recipients });
    }

    await writeAuditLog({ actorId: user.id, action: `google.${body.action}`, entityType: 'google_workspace', metadata: { title: body.title, recipients: body.recipients?.length ?? 0 } });
    return ok({ action: body.action, result });
  } catch (error) {
    return fail(error);
  }
}

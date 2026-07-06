import { google } from 'googleapis';
import { HttpError } from './api';

function getGoogleAuth() {
  const email = process.env.GOOGLE_CLIENT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!email || !key) throw new HttpError(503, 'Google Workspace is not configured. Add GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY.', 'GOOGLE_NOT_CONFIGURED');
  return new google.auth.JWT({
    email,
    key,
    scopes: [
      'https://www.googleapis.com/auth/documents',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/gmail.compose'
    ],
    subject: process.env.GOOGLE_IMPERSONATE_USER || undefined
  });
}

export async function createWorkspaceDoc(input: { title: string; content: string; folderId?: string }) {
  const auth = getGoogleAuth();
  const docs = google.docs({ version: 'v1', auth });
  const drive = google.drive({ version: 'v3', auth });
  const created = await docs.documents.create({ requestBody: { title: input.title } });
  const documentId = created.data.documentId;
  if (!documentId) throw new HttpError(502, 'Google Docs did not return a document ID.', 'GOOGLE_DOC_FAILED');

  await docs.documents.batchUpdate({
    documentId,
    requestBody: { requests: [{ insertText: { location: { index: 1 }, text: input.content } }] }
  });

  const folderId = input.folderId || process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (folderId) await drive.files.update({ fileId: documentId, addParents: folderId, fields: 'id, parents' });

  return { configured: true, documentId, url: `https://docs.google.com/document/d/${documentId}/edit`, title: input.title };
}

export async function createCalendarEvent(input: { title: string; content: string; date: string; endDate?: string; attendees?: string[] }) {
  const auth = getGoogleAuth();
  const calendar = google.calendar({ version: 'v3', auth });
  const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
  const start = new Date(input.date);
  if (Number.isNaN(start.getTime())) throw new HttpError(422, 'Calendar event date is invalid.', 'INVALID_DATE');
  const end = input.endDate ? new Date(input.endDate) : new Date(start.getTime() + 30 * 60 * 1000);

  const event = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary: input.title,
      description: input.content,
      start: { dateTime: start.toISOString() },
      end: { dateTime: end.toISOString() },
      attendees: input.attendees?.map((email) => ({ email }))
    }
  });

  return { configured: true, eventId: event.data.id, url: event.data.htmlLink, title: input.title };
}

function encodeBase64Url(value: string) {
  return Buffer.from(value).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export async function createGmailDraft(input: { title: string; content: string; recipients?: string[] }) {
  const auth = getGoogleAuth();
  const gmail = google.gmail({ version: 'v1', auth });
  const to = (input.recipients ?? []).join(', ');
  if (!to) throw new HttpError(422, 'At least one recipient is required for Gmail drafts.', 'RECIPIENT_REQUIRED');
  const raw = encodeBase64Url(`To: ${to}\r\nSubject: ${input.title}\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n${input.content}`);
  const draft = await gmail.users.drafts.create({ userId: 'me', requestBody: { message: { raw } } });
  return { configured: true, draftId: draft.data.id, title: input.title };
}

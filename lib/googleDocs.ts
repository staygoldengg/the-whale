export type GoogleDocPayload = {
  title: string;
  content: string;
  folderId?: string;
};

export async function createGoogleDocDraft(payload: GoogleDocPayload) {
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    return {
      configured: false,
      message: 'Google Docs is not configured yet. Add GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, and optionally GOOGLE_DRIVE_FOLDER_ID.',
      title: payload.title
    };
  }

  const { google } = await import('googleapis');
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/documents', 'https://www.googleapis.com/auth/drive.file']
  });

  const docs = google.docs({ version: 'v1', auth });
  const drive = google.drive({ version: 'v3', auth });
  const created = await docs.documents.create({ requestBody: { title: payload.title } });
  const documentId = created.data.documentId;
  if (!documentId) throw new Error('Google Docs did not return a document ID.');

  await docs.documents.batchUpdate({
    documentId,
    requestBody: {
      requests: [{ insertText: { location: { index: 1 }, text: payload.content } }]
    }
  });

  const folderId = payload.folderId || process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (folderId) {
    await drive.files.update({ fileId: documentId, addParents: folderId, fields: 'id, parents' });
  }

  return {
    configured: true,
    documentId,
    url: `https://docs.google.com/document/d/${documentId}/edit`,
    title: payload.title
  };
}

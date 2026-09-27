import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireUserId } from './_requireUser';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = await requireUserId(req, res);
  if (!userId) return;

  const { meetingId, templateType } = req.query;

  if (!meetingId || !templateType) {
    return res.status(400).json({ error: 'meetingId and templateType are required' });
  }

  try {
    const url = `https://app.greysolve.com/webhook/meeting-assignments?userId=${userId}&meetingId=${meetingId}&templateType=${templateType}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.APP_API ?? ''}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}


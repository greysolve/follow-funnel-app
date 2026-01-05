import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, meetingId, templateType } = req.query;

  if (!userId || !meetingId || !templateType) {
    return res.status(400).json({ error: 'userId, meetingId, and templateType are required' });
  }

  try {
    const url = `https://app.greysolve.com/webhook/meeting-assignments?userId=${userId}&meetingId=${meetingId}&templateType=${templateType}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}


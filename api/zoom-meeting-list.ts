import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireUserId } from './_requireUser.js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = await requireUserId(req, res);
  if (!userId) return;

  const { connectionId, provider } = req.query;

  if (!connectionId || !provider) {
    return res.status(400).json({ error: 'connectionId and provider are required' });
  }

  try {
    const response = await fetch(
      `https://app.greysolve.com/webhook/zoom-meeting-list?userId=${userId}&connectionId=${connectionId}&provider=${provider}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.APP_API ?? ''}`,
        },
      }
    );

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}


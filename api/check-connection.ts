import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireUserId } from '../lib/requireUser';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = await requireUserId(req, res);
  if (!userId) return;

  try {
    const response = await fetch(
      `https://app.greysolve.com/webhook/check-connection?userId=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.APP_API ?? ''}`,
        },
      }
    );

    const text = await response.text();
    if (!text) {
      res.status(response.status).json([]);
      return;
    }

    try {
      const data = JSON.parse(text);
      res.status(response.status).json(data);
    } catch (parseError) {
      res.status(500).json({ error: 'Invalid JSON response from webhook' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}


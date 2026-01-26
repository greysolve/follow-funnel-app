import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const response = await fetch(
      `https://app.greysolve.com/webhook/check-connection?userId=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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


import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = req.body?.user_id;
  if (!userId) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  try {
    const response = await fetch(
      'https://app.greysolve.com/webhook/cancel-stripe-subscription',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      }
    );

    const text = await response.text();
    if (!text) {
      res.status(response.status).json(null);
      return;
    }

    try {
      const data = JSON.parse(text);
      res.status(response.status).json(data);
    } catch {
      res.status(response.status).json({ error: text || 'Invalid JSON response from webhook' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

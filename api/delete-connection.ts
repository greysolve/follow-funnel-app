import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, provider } = req.query;

  if (!userId || !provider) {
    return res.status(400).json({ error: 'userId and provider are required' });
  }

  try {
    const response = await fetch(
      `https://app.greysolve.com/webhook/delete-connection?userId=${userId}&provider=${provider}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

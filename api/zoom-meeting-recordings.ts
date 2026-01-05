import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { meetingId } = req.query;

  if (!meetingId) {
    return res.status(400).json({ error: 'meetingId is required' });
  }

  try {
    const response = await fetch(
      `https://app.greysolve.com/webhook/zoom-meeting-recordings?meetingId=${meetingId}`,
      {
        method: 'GET',
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


import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { jobId, userId, action } = req.body ?? {};

  if (!jobId || !userId || !action) {
    return res.status(400).json({ error: 'jobId, userId, and action are required' });
  }

  try {
    const response = await fetch(
      'https://app.greysolve.com/webhook/job-status',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.APP_API ?? ''}`,
        },
        body: JSON.stringify({ jobId, userId, action }),
      }
    );

    const text = await response.text();
    res.status(response.status).json(text ? JSON.parse(text) : {});
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

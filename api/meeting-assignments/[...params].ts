import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { params } = req.query;
  const paramsArray = Array.isArray(params) ? params : [params];
  
  // GET request with meetingId in path: /api/meeting-assignments/:meetingId
  if (paramsArray.length === 0 || !paramsArray[0]) {
    return res.status(400).json({ error: 'meetingId is required in path' });
  }

  const meetingId = paramsArray[0];
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const url = `https://app.greysolve.com/webhook/meeting-assignments/${meetingId}?userId=${userId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}


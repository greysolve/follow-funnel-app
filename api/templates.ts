import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const { userId, template_type, templateId } = req.query;
  const method = req.method;

  let url = 'https://app.greysolve.com/webhook/templates';
  
  // Build query string
  const queryParams = new URLSearchParams();
  if (userId) queryParams.append('userId', userId as string);
  if (template_type) queryParams.append('template_type', template_type as string);
  if (templateId) queryParams.append('templateId', templateId as string);
  
  if (queryParams.toString()) {
    url += `?${queryParams.toString()}`;
  }

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: (method === 'POST' || method === 'PUT') ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}


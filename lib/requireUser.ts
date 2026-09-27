import { createHmac, timingSafeEqual } from 'crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';

function base64UrlToBuffer(value: string): Buffer {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(padded, 'base64');
}

function userIdFromToken(token: string, secret: string): string | null {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  const [header, payload, signature] = parts;
  const expected = createHmac('sha256', secret).update(`${header}.${payload}`).digest();
  const actual = base64UrlToBuffer(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return null;
  }

  let data: { sub?: unknown; exp?: unknown };
  try {
    data = JSON.parse(base64UrlToBuffer(payload).toString('utf8'));
  } catch {
    return null;
  }

  if (typeof data.exp === 'number' && data.exp * 1000 <= Date.now()) {
    return null;
  }

  return typeof data.sub === 'string' && data.sub ? data.sub : null;
}

export async function requireUserId(
  req: VercelRequest,
  res: VercelResponse
): Promise<string | null> {
  const header = req.headers.authorization;
  const token = typeof header === 'string' && header.startsWith('Bearer ')
    ? header.slice(7)
    : '';

  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }

  const secret = process.env.SUPABASE_JWT_SECRET;
  if (!secret) {
    res.status(500).json({ error: 'Server auth is not configured' });
    return null;
  }

  const userId = userIdFromToken(token, secret);
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }

  return userId;
}

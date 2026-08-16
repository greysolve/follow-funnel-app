export function getApiErrorPayload(data: unknown): { status?: number; message?: string } | null {
  const first = Array.isArray(data) ? data[0] : data;
  if (!first || typeof first !== 'object' || !('error' in first)) {
    return null;
  }

  const error = (first as { error?: { status?: number; message?: string } }).error;
  if (!error || typeof error !== 'object') {
    return null;
  }

  return error;
}

export function extractApiErrorMessage(data: unknown, fallback = 'Request failed'): string {
  const error = getApiErrorPayload(data);
  if (!error?.message || typeof error.message !== 'string') {
    return fallback;
  }

  const raw = error.message;
  const separator = ' - ';
  const dashIndex = raw.indexOf(separator);
  const maybeJson = dashIndex >= 0 ? raw.slice(dashIndex + separator.length) : raw;

  try {
    const inner = JSON.parse(maybeJson);
    if (inner && typeof inner.message === 'string' && inner.message) {
      return inner.message;
    }
  } catch {
    // message is not wrapped JSON; use the raw string
  }

  return raw;
}

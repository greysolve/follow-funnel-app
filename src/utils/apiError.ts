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

export function getRegistrantStatusPayload(data: unknown): Record<string, any> | null {
  let current: unknown = data;
  while (Array.isArray(current)) {
    current = current[0];
  }
  if (!current || typeof current !== 'object') {
    return null;
  }
  return current as Record<string, any>;
}

export function extractErrorsArrayMessage(errors: unknown): string {
  if (!Array.isArray(errors) || errors.length === 0) {
    return '';
  }

  return errors
    .map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object') {
        return (item as { message?: string }).message || JSON.stringify(item);
      }
      return '';
    })
    .filter(Boolean)
    .join(' ');
}

const REGISTRATION_DISABLED_PATTERN = /registration has not been enabled/i;

export function isRegistrationDisabledError(data: unknown, extraMessage = ''): boolean {
  try {
    return REGISTRATION_DISABLED_PATTERN.test(`${JSON.stringify(data)} ${extraMessage}`);
  } catch {
    return REGISTRATION_DISABLED_PATTERN.test(extraMessage);
  }
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

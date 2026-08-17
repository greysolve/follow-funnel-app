const STORAGE_PREFIX = 'followfunnel-dashboard:';

function storageKey(userId: string): string {
  return `${STORAGE_PREFIX}${userId}`;
}

export function saveSelectedMeeting(userId: string, meetingId: string): void {
  if (!userId) {
    return;
  }

  try {
    localStorage.setItem(storageKey(userId), JSON.stringify({ selectedMeeting: meetingId }));
  } catch {
    // ignore quota / private mode
  }
}

export function loadSelectedMeeting(userId: string): string {
  if (!userId) {
    return '';
  }

  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) {
      return '';
    }
    const parsed = JSON.parse(raw);
    return typeof parsed?.selectedMeeting === 'string' ? parsed.selectedMeeting : '';
  } catch {
    return '';
  }
}

export function clearDashboardStorage(userId: string): void {
  if (!userId) {
    return;
  }

  try {
    localStorage.removeItem(storageKey(userId));
  } catch {
    // ignore
  }
}

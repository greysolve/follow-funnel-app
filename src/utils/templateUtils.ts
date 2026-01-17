// Utility functions for template operations

export const variables = [
  { label: '{{First Name}}', value: '{{first_name}}' },
  { label: '{{Last Name}}', value: '{{last_name}}' },
  { label: '{{Email}}', value: '{{email}}' },
  { label: '{{Company}}', value: '{{org}}' },
  { label: '{{Job Title}}', value: '{{job_title}}' },
  { label: '{{City}}', value: '{{city}}' },
  { label: '{{Country}}', value: '{{country}}' },
  { label: '{{Recording Link}}', value: '{{recording_link}}' },
  { label: '{{Meeting Title}}', value: '{{meeting_title}}' },
];

export function stripColorStyles(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const allElements = doc.querySelectorAll('*');
  
  allElements.forEach((el) => {
    if (el instanceof HTMLElement) {
      el.style.color = '';
      el.style.backgroundColor = '';
      if (el.getAttribute('style')) {
        const style = el.getAttribute('style') || '';
        const newStyle = style
          .split(';')
          .filter((s) => !s.trim().startsWith('color') && !s.trim().startsWith('background-color'))
          .join(';');
        if (newStyle.trim()) {
          el.setAttribute('style', newStyle);
        } else {
          el.removeAttribute('style');
        }
      }
    }
  });
  
  return doc.body.innerHTML;
}

export function substituteVariables(
  content: string,
  registrant: any,
  meetingTopic?: string,
  recordingUrl?: string
): string {
  if (!registrant) return content;
  
  const topic = meetingTopic || '';
  const recordingLink = recordingUrl || '';
  
  const variableMap: { [key: string]: { field?: string, label: string, value?: string } } = {
    '{{first_name}}': { field: 'first_name', label: 'first_name' },
    '{{last_name}}': { field: 'last_name', label: 'last_name' },
    '{{email}}': { field: 'email', label: 'email' },
    '{{org}}': { field: 'org', label: 'org' },
    '{{job_title}}': { field: 'job_title', label: 'job_title' },
    '{{city}}': { field: 'city', label: 'city' },
    '{{country}}': { field: 'country', label: 'country' },
    '{{recording_link}}': { label: 'recording_link', value: recordingLink },
    '{{meeting_title}}': { label: 'meeting_title', value: topic },
  };

  let substitutedContent = content;
  Object.keys(variableMap).forEach((key) => {
    const regex = new RegExp(key.replace(/[{}]/g, '\\$&'), 'g');
    let value: string | undefined;
    
    if (variableMap[key].value !== undefined) {
      value = variableMap[key].value;
    } else if (variableMap[key].field) {
      value = registrant[variableMap[key].field!];
    }
    
    if (value && value.trim() !== '') {
      substitutedContent = substitutedContent.replace(regex, value);
    } else {
      const missingPlaceholder = `<span style="color: red; font-weight: bold;">{{${variableMap[key].label}_missing}}</span>`;
      substitutedContent = substitutedContent.replace(regex, missingPlaceholder);
    }
  });

  return substitutedContent;
}

export function calculateDelayMinutes(amount: number, unit: string): number {
  switch (unit) {
    case 'hours':
      return amount * 60;
    case 'days':
      return amount * 24 * 60;
    case 'minutes':
    default:
      return amount;
  }
}

export function calculateMeetingEndTime(meeting: any): string {
  if (!meeting.start_time || !meeting.duration) {
    throw new Error('Meeting missing start_time or duration');
  }
  const startTime = new Date(meeting.start_time);
  const durationMinutes = meeting.duration;
  const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);
  
  if (meeting.timezone) {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: meeting.timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    
    const parts = formatter.formatToParts(endTime);
    const year = parts.find(p => p.type === 'year')?.value;
    const month = parts.find(p => p.type === 'month')?.value;
    const day = parts.find(p => p.type === 'day')?.value;
    const hour = parts.find(p => p.type === 'hour')?.value;
    const minute = parts.find(p => p.type === 'minute')?.value;
    const second = parts.find(p => p.type === 'second')?.value;
    
    const tzFormatter = new Intl.DateTimeFormat('en', {
      timeZone: meeting.timezone,
      timeZoneName: 'longOffset',
    });
    
    const tzOffset = tzFormatter.formatToParts(endTime).find(p => p.type === 'timeZoneName')?.value || 'GMT+00:00';
    const offsetMatch = tzOffset.match(/GMT([+-])(\d{1,2}):(\d{2})/);
    if (offsetMatch) {
      const offsetStr = `${offsetMatch[1]}${offsetMatch[2].padStart(2, '0')}:${offsetMatch[3]}`;
      return `${year}-${month}-${day} ${hour}:${minute}:${second}${offsetStr}`;
    }
    
    return `${year}-${month}-${day} ${hour}:${minute}:${second}+00:00`;
  }
  
  return endTime.toISOString();
}

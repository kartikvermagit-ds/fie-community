import type { Hackathon } from '../types/index';

type CalendarHackathon = Pick<Hackathon,
  'id' | 'title' | 'description' | 'location' | 'registration_url' |
  'registration_deadline' | 'start_date' | 'end_date'>;

/** Escape an iCalendar TEXT value without allowing extra content lines. */
export function escapeCalendarText(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,');
}

function calendarDate(value: string, label: string): Date {
  // Requiring an explicit timezone avoids changing deadlines with the viewer's timezone.
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/.exec(value);
  const date = new Date(value);
  const year = Number(match?.[1]);
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const valid = match && Number(match[2]) >= 1 && Number(match[2]) <= 12 &&
    Number(match[3]) >= 1 &&
    Number(match[3]) <= daysInMonth[Number(match[2]) - 1] &&
    Number(match[4]) <= 23 && Number(match[5]) <= 59 && Number(match[6] || 0) <= 59 &&
    (match[7] === 'Z' || (Number(match[7].slice(1, 3)) <= 23 && Number(match[7].slice(4, 6)) <= 59));

  if (!valid || !Number.isFinite(date.getTime())) {
    throw new Error(`The ${label} is missing or invalid. Ask the organizer to update the event dates.`);
  }
  return date;
}

function utcStamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

/** RFC 5545 limits content lines to 75 UTF-8 octets, including continuation spaces. */
function foldCalendarLine(line: string): string {
  const encoder = new TextEncoder();
  const lines: string[] = [];
  let current = '';
  let bytes = 0;
  for (const character of line) {
    const length = encoder.encode(character).length;
    if (bytes + length > 75) {
      lines.push(current);
      current = ' ';
      bytes = 1;
    }
    current += character;
    bytes += length;
  }
  lines.push(current);
  return lines.join('\r\n');
}

export function hackathonCalendarFilename(title: string): string {
  const name = title.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 72).replace(/-+$/g, '');
  // The prefix also makes Windows device names such as CON safe to download.
  return `hackathon-${name || 'event'}.ics`;
}

export function createHackathonCalendar(hackathon: CalendarHackathon, generatedAt = new Date()) {
  const deadline = calendarDate(hackathon.registration_deadline, 'registration deadline');
  const start = calendarDate(hackathon.start_date, 'start date');
  const end = calendarDate(hackathon.end_date, 'end date');
  if (end <= start) throw new Error('The event end must be after its start. Ask the organizer to update the event dates.');
  if (!Number.isFinite(generatedAt.getTime())) throw new Error('The calendar creation date is invalid.');

  const id = Array.from(new TextEncoder().encode(hackathon.id), (byte) => byte.toString(16).padStart(2, '0')).join('');
  let portal: string | undefined;
  try {
    const url = new URL(hackathon.registration_url);
    if (url.protocol === 'https:' || url.protocol === 'http:') portal = url.href;
  } catch { /* Events without a valid official portal can still be exported. */ }

  const event = (kind: string, title: string, begins: Date, ends?: Date) => [
    'BEGIN:VEVENT',
    `UID:${id}-${kind}@buildspace.local`,
    `DTSTAMP:${utcStamp(generatedAt)}`,
    `DTSTART:${utcStamp(begins)}`,
    ...(ends ? [`DTEND:${utcStamp(ends)}`] : []),
    `SUMMARY:${escapeCalendarText(title)}`,
    `DESCRIPTION:${escapeCalendarText(`${hackathon.description}\n${portal ? `Official registration: ${portal}\n` : ''}Check the organizer's website for the latest dates and rules.`)}`,
    `LOCATION:${escapeCalendarText(hackathon.location)}`,
    ...(portal ? [`URL:${portal}`] : []),
    'END:VEVENT',
  ];

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BuildSpace//Hackathon Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...event('registration', `${hackathon.title} — registration closes`, deadline),
    ...event('competition', hackathon.title, start, end),
    'END:VCALENDAR',
  ];

  return {
    filename: hackathonCalendarFilename(hackathon.title),
    content: `${lines.map(foldCalendarLine).join('\r\n')}\r\n`,
  };
}

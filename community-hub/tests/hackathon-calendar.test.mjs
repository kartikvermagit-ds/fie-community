import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { createHackathonCalendar, escapeCalendarText, hackathonCalendarFilename } from '../src/lib/hackathon-calendar.ts';
import { hackathonWatchlistKey, parseHackathonWatchlist, updateHackathonWatchlist, useHackathonWatchlist } from '../src/lib/use-hackathon-watchlist.ts';

const hackathon = {
  id: 'hack_one',
  title: 'Campus, Code; Build \\ Launch',
  description: 'Make useful tools.\r\nBring your squad.',
  location: 'Kolkata, India',
  registration_url: 'https://example.com/register',
  registration_deadline: '2026-10-20T18:00:00+05:30',
  start_date: '2026-10-21T09:00:00+05:30',
  end_date: '2026-10-23T18:00:00+05:30',
};
const generatedAt = new Date('2026-10-19T10:00:00Z');
const unfold = (text) => text.replace(/\r\n /g, '');

describe('Hackathon calendar export', () => {
  it('exports a registration milestone and a competition with UTC start/end dates', () => {
    const { content } = createHackathonCalendar(hackathon, generatedAt);
    assert.equal((content.match(/BEGIN:VEVENT/g) || []).length, 2);
    assert.match(content, /DTSTAMP:20261019T100000Z\r\n/);
    assert.match(content, /DTSTART:20261020T123000Z\r\n/);
    assert.match(content, /DTSTART:20261021T033000Z\r\n/);
    assert.match(content, /DTEND:20261023T123000Z\r\n/);
    assert.ok(content.endsWith('END:VCALENDAR\r\n'));
    assert.ok(!content.replace(/\r\n/g, '').includes('\n'));
    assert.equal((unfold(content).match(/URL:https:\/\/example.com\/register/g) || []).length, 2);
  });

  it('keeps event IDs stable across downloads while updating the generation stamp', () => {
    const first = unfold(createHackathonCalendar(hackathon, generatedAt).content);
    const second = unfold(createHackathonCalendar({ ...hackathon, title: 'A renamed event' }, new Date('2026-10-20T10:00:00Z')).content);
    assert.deepEqual(first.match(/^UID:.*$/gm), second.match(/^UID:.*$/gm));
    const uids = first.match(/^UID:.*$/gm);
    assert.notEqual(uids[0], uids[1]);
  });

  it('escapes newlines, punctuation and backslashes without injecting calendar entries', () => {
    assert.equal(escapeCalendarText('one,two;three\\four\r\nfive'), 'one\\,two\\;three\\\\four\\nfive');
    const content = unfold(createHackathonCalendar({
      ...hackathon,
      title: 'Name\r\nBEGIN:VEVENT\nSUMMARY:injected',
      registration_url: 'javascript:alert(1)',
    }, generatedAt).content);
    assert.equal((content.match(/^BEGIN:VEVENT$/gm) || []).length, 2);
    assert.ok(content.includes('Name\\nBEGIN:VEVENT\\nSUMMARY:injected'));
    assert.ok(!content.includes('URL:javascript:'));
  });

  it('folds long Unicode values at 75 UTF-8 bytes without breaking characters', () => {
    const title = '🚀 Campus hackers 世界 '.repeat(20);
    const { content } = createHackathonCalendar({ ...hackathon, title }, generatedAt);
    for (const line of content.split('\r\n')) assert.ok(Buffer.byteLength(line, 'utf8') <= 75);
    assert.ok(unfold(content).includes(`SUMMARY:${title}\r\n`));
    assert.ok(!content.includes('\ufffd'));
  });

  it('rejects missing, impossible, ambiguous, or reversed event dates with useful errors', () => {
    for (const deadline of ['', 'not-a-date', '2026-02-30T09:00:00Z', '2026-10-20T09:00:00', '2026-10-20T25:00:00Z']) {
      assert.throws(() => createHackathonCalendar({ ...hackathon, registration_deadline: deadline }), /registration deadline.*invalid/);
    }
    assert.throws(() => createHackathonCalendar({ ...hackathon, start_date: 'bad' }), /start date.*invalid/);
    assert.throws(() => createHackathonCalendar({ ...hackathon, end_date: hackathon.start_date }), /end must be after/);
    assert.throws(() => createHackathonCalendar(hackathon, new Date('bad')), /creation date is invalid/);
    assert.doesNotThrow(() => createHackathonCalendar({ ...hackathon, registration_deadline: '2028-02-29T09:00:00Z' }));
  });

  it('creates short safe filenames for paths, reserved names, Unicode and empty titles', () => {
    assert.equal(hackathonCalendarFilename('../../CON: hello?\r\n'), 'hackathon-con-hello.ics');
    assert.equal(hackathonCalendarFilename('Café Sprint'), 'hackathon-cafe-sprint.ics');
    assert.equal(hackathonCalendarFilename('🚀'), 'hackathon-event.ics');
    assert.ok(hackathonCalendarFilename('a'.repeat(500)).length < 100);
  });
});

describe('Hackathon watchlist', () => {
  it('uses separate browser storage keys for each persona', () => {
    assert.notEqual(hackathonWatchlistKey('alice'), hackathonWatchlistKey('bob'));
    assert.ok(hackathonWatchlistKey('a/b').endsWith('a%2Fb'));
  });

  it('recovers from malformed storage and removes duplicate or invalid IDs', () => {
    for (const value of [null, '', '{bad', '[]', '{"version":2,"ids":["a"]}', '{"version":1,"ids":null}']) {
      assert.deepEqual(parseHackathonWatchlist(value), []);
    }
    assert.deepEqual(parseHackathonWatchlist('{"version":1,"ids":["a","a",4,null,"","b"]}'), ['a', 'b']);
  });

  it('makes saving and removing idempotent without mutating the previous snapshot', () => {
    const first = ['a'];
    const saved = updateHackathonWatchlist(first, 'b', true);
    assert.deepEqual(first, ['a']);
    assert.deepEqual(updateHackathonWatchlist(saved, 'b', true), ['a', 'b']);
    assert.deepEqual(updateHackathonWatchlist(saved, 'b', false), ['a']);
    assert.deepEqual(updateHackathonWatchlist(['a'], 'b', false), ['a']);
  });

  it('renders an empty loading snapshot on the server without touching browser APIs', () => {
    function Probe() {
      const { savedIds, isReady } = useHackathonWatchlist('alice');
      return createElement('span', null, `${isReady}:${savedIds.length}`);
    }
    assert.equal(renderToString(createElement(Probe)), '<span>false:0</span>');
  });
});

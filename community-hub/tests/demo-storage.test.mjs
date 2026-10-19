import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  createCampusStorage, decodeDemoSnapshot, encodeDemoSnapshot, validateDemoCampus,
  parseCampusStoreSnapshot, EMPTY_CAMPUS_STORE_SNAPSHOT, DEMO_STORAGE_KEY,
} from '../src/lib/demo-storage.ts';

const seed = { projects: [{ id: 'p1', tasks: [{ id: 't1', status: 'todo' }] }], messages: {} };

describe('demo campus persistence', () => {
  it('restores edited task state and newly created rooms without resetting on refresh', () => {
    const edited = { projects: [{ id: 'p1', tasks: [{ id: 't1', status: 'done' }] }], messages: { room2: [{ id: 'reply' }] } };
    assert.deepEqual(decodeDemoSnapshot(encodeDemoSnapshot(edited), seed), edited);
  });
  it('falls back for malformed JSON, incompatible versions and damaged nested data', () => {
    for (const raw of [null, '{', '{"version":2,"data":{}}', encodeDemoSnapshot({ projects: [{ id: 'p1', tasks: null }], messages: {} }), encodeDemoSnapshot({ projects: [], messages: null })]) {
      assert.equal(decodeDemoSnapshot(raw, seed), seed);
    }
  });
  it('accepts empty collections after deleting all their items', () => {
    const empty = { projects: [], messages: {} };
    assert.deepEqual(decodeDemoSnapshot(encodeDemoSnapshot(empty), seed), empty);
  });
});

const profile = {
  id: 'u1', full_name: 'Alex', username: 'alex', email: 'alex@example.com',
  avatar_url: '/alex.png', role: 'Builder', skills: ['TypeScript'], interests: ['Hackathons'],
};
const room = {
  id: 'r1', team_id: 'team1', name: 'general', slug: 'general', topic: 'Build together',
  category: 'general', is_private: false, created_at: '2026-10-19T10:00:00Z',
};
const task = {
  id: 'task1', project_id: 'p1', title: 'Ship the prototype', description: '', status: 'todo',
  priority: 'high', labels: [], checklist: [], created_at: '2026-10-19T10:00:00Z',
};
function campusFixture() {
  return {
    ideas: [{
      id: 'i1', title: 'A useful campus tool', excerpt: 'Find collaborators', content: 'Build with friends',
      tags: [], required_skills: ['TypeScript'], desired_team_size: 4, author: { ...profile },
      upvotes_count: 1, bookmarks_count: 0, comments_count: 0, status: 'open', category: 'Open Source & DevTools',
      created_at: '2026-10-19T10:00:00Z', updated_at: '2026-10-19T10:00:00Z',
    }],
    teams: [{
      id: 'team1', name: 'Builders', slug: 'builders', description: 'Campus squad', icon_url: '/team.png',
      category: 'Open Source & DevTools', visibility: 'public', desired_skills: ['TypeScript'], owner_id: 'u1',
      owner: { ...profile }, members: [{ user: { ...profile }, role: 'owner', joined_at: '2026-10-19T10:00:00Z' }],
      rooms: [{ ...room }], invite_code: 'INV-ONE', max_members: 5,
      created_at: '2026-10-19T10:00:00Z', updated_at: '2026-10-19T10:00:00Z',
    }],
    projects: [{
      id: 'p1', title: 'Campus prototype', team_id: 'team1', team_name: 'Builders', slug: 'campus-prototype',
      description: '', tech_stack: ['TypeScript'], status: 'planning', progress_percent: 0, banner_url: '/banner.png',
      tasks: [{ ...task }], created_at: '2026-10-19T10:00:00Z', updated_at: '2026-10-19T10:00:00Z',
    }],
    messages: { r1: [{ id: 'm1', room_id: 'r1', content: 'Let us build', sender: { ...profile }, reactions: [], created_at: '2026-10-19T10:00:00Z' }] },
    hackathons: [], files: [], notifications: [], joinRequests: [], reports: [],
  };
}

describe('production campus validation', () => {
  it('restores new teams, projects, unassigned tasks and messages without optional fields', () => {
    const campus = campusFixture();
    assert.equal(validateDemoCampus(campus), true);
    assert.deepEqual(decodeDemoSnapshot(encodeDemoSnapshot(campus), null, validateDemoCampus), campus);
    campus.projects[0].tasks[0].status = 'done';
    campus.teams[0].rooms.push({ ...room, id: 'r2', name: 'design', slug: 'design' });
    assert.deepEqual(decodeDemoSnapshot(encodeDemoSnapshot(campus), null, validateDemoCampus), campus);
  });

  it('accepts valid optional attachments, replies, parents, assignees and due dates', () => {
    const campus = campusFixture();
    Object.assign(campus.messages.r1[0], {
      parent_id: 'root1', reply_to: { id: 'root1', sender_name: 'Alex', content: 'The plan' },
      attachments: [{ name: 'pitch.pdf', url: '#', type: 'presentation', size: '2 MB' }],
    });
    campus.ideas[0].attachments = [{ name: 'idea.pdf', url: '#', type: 'document' }];
    Object.assign(campus.projects[0].tasks[0], { assignee: { ...profile }, due_date: '2026-11-01' });
    assert.equal(validateDemoCampus(campus), true);
    campus.ideas[0].attachments[0].size = '1 MB';
    assert.equal(validateDemoCampus(campus), true);
  });

  it('rejects corrupt optional nested values before the UI can use them', () => {
    const corruptions = [
      (campus) => { campus.messages.r1[0].attachments = 'x'; },
      (campus) => { campus.messages.r1[0].attachments = [{ name: 'pitch', url: '#', type: 'pdf', size: 4 }]; },
      (campus) => { campus.messages.r1[0].reply_to = { id: 'root1' }; },
      (campus) => { campus.messages.r1[0].parent_id = []; },
      (campus) => { campus.ideas[0].attachments = 'x'; },
      (campus) => { campus.ideas[0].attachments = [{ name: 'idea', url: '#', type: 'pdf', size: {} }]; },
      (campus) => { campus.projects[0].tasks[0].assignee = 'Alex'; },
      (campus) => { campus.projects[0].tasks[0].assignee = { ...profile, skills: null }; },
      (campus) => { campus.projects[0].tasks[0].due_date = 20261101; },
    ];
    const fallback = campusFixture();
    for (const corrupt of corruptions) {
      const campus = campusFixture();
      corrupt(campus);
      assert.equal(validateDemoCampus(campus), false);
      assert.equal(decodeDemoSnapshot(encodeDemoSnapshot(campus), fallback, validateDemoCampus), fallback);
    }
  });

  it('rejects broken required data and accepts empty collections', () => {
    const campus = campusFixture();
    campus.messages.r1[0].reactions = null;
    assert.equal(validateDemoCampus(campus), false);
    assert.equal(validateDemoCampus({ ideas: [], hackathons: [], teams: [], messages: {}, projects: [], files: [], notifications: [], joinRequests: [], reports: [] }), true);
  });
});

function storageFixture(initial = null) {
  let raw = initial;
  let readFails = false;
  let writeFails = false;
  const fake = {
    getItem(key) {
      assert.equal(key, DEMO_STORAGE_KEY);
      if (readFails) throw new Error('Storage blocked');
      return raw;
    },
    setItem(key, value) {
      assert.equal(key, DEMO_STORAGE_KEY);
      if (writeFails) throw new Error('Storage full');
      raw = value;
    },
  };
  return {
    adapter: createCampusStorage(() => fake),
    blockReads(value) { readFails = value; },
    blockWrites(value) { writeFails = value; },
    externalWrite(value) { raw = value; },
    persisted() { return raw; },
  };
}

describe('campus storage adapter', () => {
  it('returns a stable primitive and a deterministic empty server snapshot', () => {
    const { adapter } = storageFixture();
    assert.equal(adapter.getSnapshot(true), EMPTY_CAMPUS_STORE_SNAPSHOT);
    assert.equal(adapter.getSnapshot(true), adapter.getSnapshot(true));
    assert.deepEqual(parseCampusStoreSnapshot(EMPTY_CAMPUS_STORE_SNAPSHOT), { raw: null, storageFailed: false });
  });

  it('reports blocked initial reads even when there is no saved campus', () => {
    const fixture = storageFixture();
    fixture.blockReads(true);
    const snapshot = fixture.adapter.getSnapshot(true);
    assert.notEqual(snapshot, EMPTY_CAMPUS_STORE_SNAPSHOT);
    assert.deepEqual(parseCampusStoreSnapshot(snapshot), { raw: null, storageFailed: true });
  });

  it('keeps the last loaded campus when later reads are blocked', () => {
    const raw = encodeDemoSnapshot(campusFixture());
    const fixture = storageFixture(raw);
    fixture.adapter.getSnapshot(true);
    fixture.blockReads(true);
    assert.deepEqual(parseCampusStoreSnapshot(fixture.adapter.getSnapshot(true)), { raw, storageFailed: true });
  });

  it('keeps a successful save when the next read fails and recovers when reads resume', () => {
    const fixture = storageFixture();
    const raw = encodeDemoSnapshot(campusFixture());
    fixture.adapter.writeRaw(raw, true);
    fixture.blockReads(true);
    assert.deepEqual(parseCampusStoreSnapshot(fixture.adapter.getSnapshot(true)), { raw, storageFailed: true });
    fixture.blockReads(false);
    assert.deepEqual(parseCampusStoreSnapshot(fixture.adapter.getSnapshot(true)), { raw, storageFailed: false });
  });

  it('keeps failed writes through later reads and persists the latest work after recovery', () => {
    const fixture = storageFixture('previous');
    fixture.adapter.getSnapshot(true);
    fixture.blockWrites(true);
    fixture.adapter.writeRaw('unsaved first edit', true);
    assert.deepEqual(parseCampusStoreSnapshot(fixture.adapter.getSnapshot(true)), { raw: 'unsaved first edit', storageFailed: true });
    assert.equal(fixture.persisted(), 'previous');
    fixture.blockWrites(false);
    fixture.adapter.writeRaw('unsaved first edit plus second edit', true);
    assert.equal(fixture.persisted(), 'unsaved first edit plus second edit');
    assert.deepEqual(parseCampusStoreSnapshot(fixture.adapter.getSnapshot(true)), { raw: 'unsaved first edit plus second edit', storageFailed: false });
  });

  it('handles storage access itself throwing and retains writes for the visit', () => {
    const adapter = createCampusStorage(() => { throw new Error('Permission denied'); });
    assert.deepEqual(parseCampusStoreSnapshot(adapter.getSnapshot(true)), { raw: null, storageFailed: true });
    adapter.writeRaw('new work', true);
    assert.deepEqual(parseCampusStoreSnapshot(adapter.getSnapshot(true)), { raw: 'new work', storageFailed: true });
  });

  it('picks up cross-tab changes and removal while preserving the latest successful value', () => {
    const fixture = storageFixture('first');
    fixture.adapter.getSnapshot(true);
    fixture.externalWrite('second');
    assert.equal(parseCampusStoreSnapshot(fixture.adapter.getSnapshot(true)).raw, 'second');
    fixture.blockReads(true);
    assert.equal(parseCampusStoreSnapshot(fixture.adapter.getSnapshot(true)).raw, 'second');
    fixture.blockReads(false);
    fixture.externalWrite(null);
    assert.equal(fixture.adapter.getSnapshot(true), EMPTY_CAMPUS_STORE_SNAPSHOT);
  });

  it('isolates the browser demo from live-mode memory and avoids live storage access', () => {
    let allowStorage = true;
    const fixture = storageFixture('demo');
    const adapter = createCampusStorage(() => {
      assert.equal(allowStorage, true, 'live mode must not access browser storage');
      return { getItem: () => fixture.persisted(), setItem: (_key, value) => fixture.externalWrite(value) };
    });
    assert.equal(parseCampusStoreSnapshot(adapter.getSnapshot(true)).raw, 'demo');
    allowStorage = false;
    adapter.writeRaw('live work', false);
    assert.deepEqual(parseCampusStoreSnapshot(adapter.getSnapshot(false)), { raw: 'live work', storageFailed: false });
    allowStorage = true;
    assert.equal(parseCampusStoreSnapshot(adapter.getSnapshot(true)).raw, 'demo');
    assert.equal(fixture.persisted(), 'demo');
  });
});

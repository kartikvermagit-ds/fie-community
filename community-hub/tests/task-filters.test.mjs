import assert from 'node:assert/strict';
import test from 'node:test';
import { filterTasks, localDayKey, memberTeams, resolveProject, taskDueState } from '../src/lib/task-filters.ts';

const today = new Date(2026, 9, 19, 23, 59);
const task = (id, overrides = {}) => ({
  id, project_id: 'project-a', title: `Build ${id}`, description: 'Prepare the release',
  status: 'todo', priority: 'medium', labels: ['Frontend'], checklist: [], created_at: '2026-10-01',
  ...overrides,
});

test('date-only deadlines use calendar dates and include both due-soon boundaries', () => {
  assert.equal(taskDueState('2026-10-18', 'todo', today), 'overdue');
  assert.equal(taskDueState('2026-10-19', 'todo', today), 'due_soon');
  assert.equal(taskDueState('2026-10-26', 'review', today), 'due_soon');
  assert.equal(taskDueState('2026-10-27', 'in_progress', today), 'upcoming');
  assert.equal(taskDueState('2026-10-19', 'todo', new Date(2026, 9, 20, 0, 0)), 'overdue');
});

test('calendar day keys honor local time instead of UTC date slicing', () => {
  const previousTimezone = process.env.TZ;
  try {
    process.env.TZ = 'Asia/Kolkata';
    const localMidnight = new Date('2026-10-18T18:45:00Z');
    assert.equal(localDayKey(localMidnight), '2026-10-19');
    assert.equal(taskDueState('2026-10-18', 'todo', localMidnight), 'overdue');
    process.env.TZ = 'America/Los_Angeles';
    const localEvening = new Date('2026-10-20T01:00:00Z');
    assert.equal(localDayKey(localEvening), '2026-10-19');
    assert.equal(taskDueState('2026-10-19', 'todo', localEvening), 'due_soon');
  } finally {
    if (previousTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = previousTimezone;
  }
});

test('DST changes, year rollover, invalid dates and completed work are handled', () => {
  const previousTimezone = process.env.TZ;
  try {
    process.env.TZ = 'America/New_York';
    assert.equal(taskDueState('2026-11-08', 'todo', new Date(2026, 10, 1, 23, 59)), 'due_soon');
    assert.equal(taskDueState('2027-01-03', 'todo', new Date(2026, 11, 27)), 'due_soon');
    for (const value of [undefined, '', '2026-02-30', '2026-13-01', 'invalid', '2026-10-19T00:00:00Z']) {
      assert.equal(taskDueState(value, 'todo', today), 'none');
    }
    assert.equal(taskDueState('2026-10-18', 'done', today), 'none');
    assert.equal(taskDueState('2026-10-19', 'done', today), 'none');
    assert.equal(taskDueState('2026-10-19', 'todo', new Date(NaN)), 'none');
  } finally {
    if (previousTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = previousTimezone;
  }
});

test('assigned work filters by user ID without treating unassigned work as mine', () => {
  const tasks = [task('mine', { assignee: { id: 'me' } }), task('other', { assignee: { id: 'you' } }), task('unassigned'), task('done', { status: 'done', assignee: { id: 'me' } })];
  assert.deepEqual(filterTasks(tasks, { focus: 'mine', userId: 'me' }).map((item) => item.id), ['mine', 'done']);
  assert.deepEqual(filterTasks(tasks, { focus: 'mine' }), []);
  assert.equal(filterTasks(tasks).length, 4);
});

test('search, priority and focus compose, and status changes immediately remove late work', () => {
  const tasks = [
    task('api', { title: 'Ship API', priority: 'urgent', due_date: '2026-10-18', labels: ['Backend'], assignee: { id: 'me', full_name: 'Asha Rao' } }),
    task('ui', { due_date: '2026-10-19' }),
    task('done', { status: 'done', due_date: '2026-10-18' }),
    task('no-date'),
  ];
  assert.deepEqual(filterTasks(tasks, { focus: 'overdue', priority: 'urgent', query: '  BACKEND asha API  ', now: today }).map((item) => item.id), ['api']);
  assert.deepEqual(filterTasks(tasks, { focus: 'due_soon', now: today }).map((item) => item.id), ['ui']);
  assert.deepEqual(filterTasks(tasks, { priority: 'high' }), []);
  const updated = tasks.map((item) => item.id === 'api' ? { ...item, status: 'done' } : item);
  assert.deepEqual(filterTasks(updated, { focus: 'overdue', now: today }), []);
  assert.equal(tasks[0].status, 'todo', 'filters must not mutate source tasks');
});

test('team membership and project selection never fall back to another team', () => {
  const teams = [{ id: 'a', owner_id: 'me', members: [] }, { id: 'b', owner_id: 'you', members: [{ user: { id: 'me' } }] }, { id: 'private', owner_id: 'you', members: [] }];
  assert.deepEqual(memberTeams(teams, 'me').map((team) => team.id), ['a', 'b']);
  assert.deepEqual(memberTeams(teams, undefined), []);
  const projects = [{ id: 'a-1', team_id: 'a', tasks: [] }, { id: 'b-1', team_id: 'b', tasks: [] }];
  assert.equal(resolveProject(projects, 'a', 'b-1')?.id, 'a-1');
  assert.equal(resolveProject(projects, 'empty', 'a-1'), undefined);
  assert.equal(resolveProject(projects, undefined, 'a-1'), undefined);
  const updated = projects.map((project) => project.id === 'a-1' ? { ...project, tasks: [task('new')] } : project);
  assert.equal(resolveProject(updated, 'a', 'a-1')?.tasks.length, 1);
});

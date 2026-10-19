import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getChannelMessages, getThreadMessages, getThreadRoot, getMessagePostError } from '../src/lib/chat-threads.ts';

const root = { id: 'root', room_id: 'general', content: 'Review our prototype' };
const quoted = { id: 'quoted', room_id: 'general', reply_to: { id: 'root' }, content: 'A room-level quote' };
const reply = { id: 'reply', room_id: 'general', parent_id: 'root', content: 'Looks good' };
const other = { id: 'other', room_id: 'design', content: 'Another room' };
const messages = [root, quoted, reply, other];
const teams = [{ id: 'team', rooms: [{ id: 'general', team_id: 'team' }], members: [{ user: { id: 'member' } }] }];

describe('workspace message threads', () => {
  it('shows only root messages and room-level quoted replies in the channel', () => {
    assert.deepEqual(getChannelMessages(messages, 'general'), [root, quoted]);
  });

  it('opens a root and returns only its own same-room replies', () => {
    assert.equal(getThreadRoot(messages, 'general', 'root'), root);
    assert.deepEqual(getThreadMessages([...messages, { ...reply, id: 'foreign', room_id: 'design' }], 'general', 'root'), [reply]);
  });

  it('cannot open a reply, foreign-room root, or deleted root as a thread', () => {
    assert.equal(getThreadRoot(messages, 'general', 'reply'), undefined);
    assert.deepEqual(getThreadMessages(messages, 'general', 'other'), []);
    const withoutRoot = messages.filter((message) => message.id !== root.id);
    assert.deepEqual(getThreadMessages(withoutRoot, 'general', 'root'), []);
    assert.deepEqual(getChannelMessages(withoutRoot, 'general'), [quoted]);
  });

  it('permits members to post to an existing room and root thread', () => {
    assert.equal(getMessagePostError('member', teams, 'general', messages), null);
    assert.equal(getMessagePostError('member', teams, 'general', messages, 'root'), null);
  });

  it('rejects signed-out users, outsiders, unknown rooms, and room/team mismatches', () => {
    assert.match(getMessagePostError(undefined, teams, 'general', messages), /Sign in/);
    assert.match(getMessagePostError('outsider', teams, 'general', messages), /Join this squad/);
    assert.match(getMessagePostError('member', teams, 'missing', messages), /room is no longer/);
    assert.match(getMessagePostError('member', [{ ...teams[0], rooms: [{ id: 'general', team_id: 'other-team' }] }], 'general', messages), /room is no longer/);
  });

  it('rejects deleted parents, nested replies, foreign-room parents, and empty parent IDs', () => {
    for (const parentId of ['deleted', 'reply', 'other', '']) {
      assert.match(getMessagePostError('member', teams, 'general', messages, parentId), /thread is no longer/);
    }
  });
});

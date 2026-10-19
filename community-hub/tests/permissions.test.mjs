import { describe, it } from 'node:test';
import assert from 'node:assert';

// Simulated Authorization Gate
function canAccessRoom(user, team, room) {
  if (!user || !team || !room) return false;
  // User must belong to team
  const member = team.members.find((m) => m.userId === user.id);
  if (!member) return false;
  // If private room, user must be owner or admin or explicit room member
  if (room.is_private) {
    return member.role === 'owner' || member.role === 'admin' || (room.allowed_users && room.allowed_users.includes(user.id));
  }
  return true;
}

function canDeleteMessage(user, team, message) {
  if (!user || !message) return false;
  // Sender can delete their own message
  if (message.senderId === user.id) return true;
  // Team owner or admin can moderate messages
  const member = team.members.find((m) => m.userId === user.id);
  return Boolean(member && (member.role === 'owner' || member.role === 'admin'));
}

function validateFileUpload(fileName, sizeBytes) {
  const MAX_SIZE = 50 * 1024 * 1024; // 50MB
  if (sizeBytes > MAX_SIZE) {
    return { valid: false, error: 'File exceeds 50MB limit' };
  }
  const ext = fileName.split('.').pop()?.toLowerCase();
  const allowedExts = ['ppt', 'pptx', 'pdf', 'docx', 'png', 'jpg', 'zip', 'rs', 'ts', 'py', 'json'];
  if (!allowedExts.includes(ext)) {
    return { valid: false, error: 'File format not supported' };
  }
  return { valid: true };
}

function calculateProjectProgress(tasks) {
  if (!tasks || tasks.length === 0) return 0;
  const done = tasks.filter((t) => t.status === 'done').length;
  return Math.round((done / tasks.length) * 100);
}

describe('FIE Community Security & Permissions Suite', () => {
  const team = {
    id: 'team_nexus',
    ownerId: 'usr_alex',
    members: [
      { userId: 'usr_alex', role: 'owner' },
      { userId: 'usr_sarah', role: 'admin' },
      { userId: 'usr_marcus', role: 'member' },
    ],
  };

  const publicRoom = { id: 'room_general', team_id: 'team_nexus', is_private: false };
  const privateRoom = { id: 'room_exec', team_id: 'team_nexus', is_private: true, allowed_users: ['usr_alex', 'usr_sarah'] };

  it('allows verified team members to access subgroup rooms', () => {
    assert.strictEqual(canAccessRoom({ id: 'usr_marcus' }, team, publicRoom), true);
  });

  it('strictly blocks non-members from accessing team rooms (RLS rule)', () => {
    const outsider = { id: 'usr_outsider' };
    assert.strictEqual(canAccessRoom(outsider, team, publicRoom), false);
    assert.strictEqual(canAccessRoom(outsider, team, privateRoom), false);
  });

  it('enforces role boundaries on private confidential rooms', () => {
    assert.strictEqual(canAccessRoom({ id: 'usr_alex' }, team, privateRoom), true);
    assert.strictEqual(canAccessRoom({ id: 'usr_sarah' }, team, privateRoom), true);
    assert.strictEqual(canAccessRoom({ id: 'usr_marcus' }, team, privateRoom), false);
  });

  it('authorizes message deletion for the sender or team admins', () => {
    const msgByMarcus = { id: 'msg_1', senderId: 'usr_marcus' };
    // Marcus can delete his own message
    assert.strictEqual(canDeleteMessage({ id: 'usr_marcus' }, team, msgByMarcus), true);
    // Alex (owner) can delete Marcus's message
    assert.strictEqual(canDeleteMessage({ id: 'usr_alex' }, team, msgByMarcus), true);
    // Sarah (admin) can delete Marcus's message
    assert.strictEqual(canDeleteMessage({ id: 'usr_sarah' }, team, msgByMarcus), true);
    // Random user cannot delete Marcus's message
    assert.strictEqual(canDeleteMessage({ id: 'usr_outsider' }, team, msgByMarcus), false);
  });

  it('validates file uploads and rejects files exceeding 50MB', () => {
    const validPPT = validateFileUpload('pitch_deck_v3.pptx', 4 * 1024 * 1024);
    assert.strictEqual(validPPT.valid, true);

    const oversizedFile = validateFileUpload('heavy_model_weights.bin', 65 * 1024 * 1024);
    assert.strictEqual(oversizedFile.valid, false);
    assert.strictEqual(oversizedFile.error, 'File exceeds 50MB limit');

    const invalidExtension = validateFileUpload('malicious_executable.exe', 1024);
    assert.strictEqual(invalidExtension.valid, false);
    assert.strictEqual(invalidExtension.error, 'File format not supported');
  });

  it('calculates project sprint progress accurately from Kanban task state', () => {
    const tasks = [
      { id: '1', status: 'done' },
      { id: '2', status: 'done' },
      { id: '3', status: 'in_progress' },
      { id: '4', status: 'todo' },
    ];
    // 2 out of 4 = 50%
    assert.strictEqual(calculateProjectProgress(tasks), 50);

    tasks.push({ id: '5', status: 'done' });
    // 3 out of 5 = 60%
    assert.strictEqual(calculateProjectProgress(tasks), 60);
  });
});

import { Router } from 'express';
import { STORE } from '../data/mock-store.js';

const router = Router();

// GET /api/rooms/:teamId - List subgroup rooms for a team
router.get('/:teamId', (req, res) => {
  const team = STORE.teams.find((t) => t.id === req.params.teamId);
  if (!team) {
    return res.status(404).json({ success: false, error: 'Team not found' });
  }
  res.json({ success: true, rooms: team.rooms });
});

// POST /api/rooms - Create a new subgroup room in team
router.post('/', (req, res) => {
  const { team_id, name, category, is_private } = req.body;
  const team = STORE.teams.find((t) => t.id === team_id);
  if (!team) {
    return res.status(404).json({ success: false, error: 'Team not found' });
  }

  const cleanName = (name || 'new-channel').toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
  const newRoom = {
    id: `room_${team.id}_${cleanName}_${Date.now()}`,
    team_id,
    name: cleanName,
    category: category || 'general',
    is_private: Boolean(is_private),
  };

  team.rooms.push(newRoom);
  STORE.messages[newRoom.id] = [
    {
      id: `msg_init_${Date.now()}`,
      room_id: newRoom.id,
      sender_id: STORE.users[0].id,
      content: `Welcome to #${cleanName}!`,
      created_at: new Date().toISOString(),
    },
  ];

  res.status(201).json({ success: true, room: newRoom });
});

// GET /api/rooms/:roomId/messages - Get messages in a room
router.get('/:roomId/messages', (req, res) => {
  const { roomId } = req.params;
  const rawMessages = STORE.messages[roomId] || [];

  const populated = rawMessages.map((msg) => {
    const sender = STORE.users.find((u) => u.id === msg.sender_id) || {
      id: msg.sender_id,
      full_name: 'Member',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    };
    return { ...msg, sender };
  });

  res.json({ success: true, room_id: roomId, count: populated.length, messages: populated });
});

// POST /api/rooms/:roomId/messages - Post message to room
router.post('/:roomId/messages', (req, res) => {
  const { roomId } = req.params;
  const { content, sender_id, attachments } = req.body;

  if (!content && (!attachments || attachments.length === 0)) {
    return res.status(400).json({ success: false, error: 'Content or attachment is required' });
  }

  if (!STORE.messages[roomId]) {
    STORE.messages[roomId] = [];
  }

  const senderId = sender_id || STORE.users[0].id;
  const newMessage = {
    id: `msg_${Date.now()}`,
    room_id: roomId,
    sender_id: senderId,
    content: content || '',
    attachments: attachments || [],
    reactions: [],
    created_at: new Date().toISOString(),
  };

  STORE.messages[roomId].push(newMessage);
  const sender = STORE.users.find((u) => u.id === senderId) || STORE.users[0];

  res.status(201).json({ success: true, message: { ...newMessage, sender } });
});

export default router;

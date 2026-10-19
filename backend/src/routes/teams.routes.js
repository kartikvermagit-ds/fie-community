import { Router } from 'express';
import { STORE } from '../data/mock-store.js';

const router = Router();

// Helper to populate team members with full user profiles
function populateTeam(team) {
  const owner = STORE.users.find((u) => u.id === team.owner_id) || STORE.users[0];
  const members = team.members.map((m) => {
    const user = STORE.users.find((u) => u.id === m.userId) || { id: m.userId, full_name: 'Builder' };
    return { ...m, user };
  });
  return { ...team, owner, members };
}

// GET /api/teams - List all teams
router.get('/', (req, res) => {
  const populated = STORE.teams.map(populateTeam);
  res.json({ success: true, count: populated.length, teams: populated });
});

// GET /api/teams/:id - Get specific team
router.get('/:id', (req, res) => {
  const team = STORE.teams.find((t) => t.id === req.params.id || t.slug === req.params.id);
  if (!team) {
    return res.status(404).json({ success: false, error: 'Team not found' });
  }
  res.json({ success: true, team: populateTeam(team) });
});

// POST /api/teams - Create a new team
router.post('/', (req, res) => {
  const { name, description, category, desired_skills, owner_id } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, error: 'Team name is required' });
  }

  const newTeam = {
    id: `team_${Date.now()}`,
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: description || 'Collaborative squad on FIE Community',
    icon_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=256&h=256&q=80',
    category: category || 'AI & Machine Learning',
    visibility: 'public',
    invite_code: `FIE-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    desired_skills: desired_skills || ['Developer'],
    owner_id: owner_id || STORE.users[0].id,
    members: [{ userId: owner_id || STORE.users[0].id, role: 'owner', joined_at: new Date().toISOString() }],
    rooms: [
      { id: `room_${Date.now()}_gen`, name: 'general', category: 'general', is_private: false },
      { id: `room_${Date.now()}_dev`, name: 'development', category: 'frontend', is_private: false },
    ],
  };

  STORE.teams.unshift(newTeam);
  res.status(201).json({ success: true, team: populateTeam(newTeam) });
});

// POST /api/teams/join-code - Join team using invite code
router.post('/join-code', (req, res) => {
  const { code, user_id } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, error: 'Invite code is required' });
  }

  const team = STORE.teams.find(
    (t) => t.invite_code && t.invite_code.toUpperCase() === code.trim().toUpperCase()
  );

  if (!team) {
    return res.status(404).json({ success: false, error: 'Invalid or expired invite code' });
  }

  const userId = user_id || STORE.users[0].id;
  const alreadyMember = team.members.some((m) => m.userId === userId);

  if (!alreadyMember) {
    team.members.push({ userId, role: 'member', joined_at: new Date().toISOString() });
  }

  res.json({
    success: true,
    message: `Successfully joined ${team.name}!`,
    team: populateTeam(team),
  });
});

export default router;

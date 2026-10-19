import { Router } from 'express';
import { STORE } from '../data/mock-store.js';

const router = Router();

// GET /api/auth/personas - List available demo personas
router.get('/personas', (req, res) => {
  res.json({ success: true, personas: STORE.users });
});

// POST /api/auth/login - Simulate login with email & password
router.post('/login', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

  const user = STORE.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() || u.username.toLowerCase() === email.toLowerCase()
  ) || STORE.users[0];

  res.json({
    success: true,
    user,
    token: `fie_jwt_token_${user.id}_${Date.now()}`,
    message: `Logged in as ${user.full_name}`,
  });
});

// POST /api/auth/signup - Create new member passport
router.post('/signup', (req, res) => {
  const { email, full_name, username, role, college, skills } = req.body;

  if (!email || !full_name) {
    return res.status(400).json({ success: false, error: 'Name and email are required' });
  }

  const newUser = {
    id: `usr_${Date.now()}`,
    email,
    username: username || email.split('@')[0],
    full_name,
    avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80`,
    bio: 'FIE Community builder.',
    role: role || 'Software Engineer',
    college: college || 'FIE Campus',
    skills: typeof skills === 'string' ? skills.split(',').map((s) => s.trim()) : (skills || ['React', 'TypeScript']),
    interests: ['Collaboration', 'Hackathons'],
    is_open_to_collaborate: true,
    karma: 100,
  };

  STORE.users.push(newUser);

  res.status(201).json({
    success: true,
    user: newUser,
    token: `fie_jwt_token_${newUser.id}_${Date.now()}`,
  });
});

// GET /api/auth/me - Get current session
router.get('/me', (req, res) => {
  // Default to Alex Chen for demo session
  const user = STORE.users[0];
  res.json({ success: true, user });
});

export default router;

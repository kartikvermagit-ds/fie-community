import { Router } from 'express';
import { STORE } from '../data/mock-store.js';

const router = Router();

// GET /api/members - List campus members with skill search
router.get('/', (req, res) => {
  const { skill, role, search } = req.query;
  let members = [...STORE.users];

  if (skill) {
    const s = skill.toLowerCase();
    members = members.filter((m) => m.skills.some((sk) => sk.toLowerCase().includes(s)));
  }

  if (role) {
    const r = role.toLowerCase();
    members = members.filter((m) => m.role.toLowerCase().includes(r));
  }

  if (search) {
    const q = search.toLowerCase();
    members = members.filter(
      (m) =>
        m.full_name.toLowerCase().includes(q) ||
        m.username.toLowerCase().includes(q) ||
        m.bio.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: members.length, members });
});

// GET /api/members/:id - Get specific member profile
router.get('/:id', (req, res) => {
  const member = STORE.users.find((u) => u.id === req.params.id || u.username === req.params.id);
  if (!member) {
    return res.status(404).json({ success: false, error: 'Member not found' });
  }
  res.json({ success: true, member });
});

export default router;

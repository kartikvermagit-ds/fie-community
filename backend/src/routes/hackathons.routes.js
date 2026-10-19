import { Router } from 'express';
import { STORE } from '../data/mock-store.js';

const router = Router();

// GET /api/hackathons - List all hackathons
router.get('/', (req, res) => {
  res.json({ success: true, count: STORE.hackathons.length, hackathons: STORE.hackathons });
});

// GET /api/hackathons/:id - Get hackathon details
router.get('/:id', (req, res) => {
  const hackathon = STORE.hackathons.find((h) => h.id === req.params.id || h.slug === req.params.id);
  if (!hackathon) {
    return res.status(404).json({ success: false, error: 'Hackathon not found' });
  }
  res.json({ success: true, hackathon });
});

// POST /api/hackathons/:id/register - Register team for hackathon
router.post('/:id/register', (req, res) => {
  const hackathon = STORE.hackathons.find((h) => h.id === req.params.id);
  if (!hackathon) {
    return res.status(404).json({ success: false, error: 'Hackathon not found' });
  }

  hackathon.participants_count += 1;
  hackathon.teams_registered_count += 1;

  res.json({
    success: true,
    message: 'Registered squad for hackathon successfully!',
    participants_count: hackathon.participants_count,
  });
});

export default router;

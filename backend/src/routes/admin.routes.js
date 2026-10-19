import { Router } from 'express';
import { STORE } from '../data/mock-store.js';

const router = Router();

// GET /api/admin/reports - Get moderation reports
router.get('/reports', (req, res) => {
  res.json({ success: true, count: STORE.reports.length, reports: STORE.reports });
});

// POST /api/admin/reports - Submit a moderation report
router.post('/reports', (req, res) => {
  const { content_type, content_id, reason, details, reporter_id } = req.body;

  if (!reason) {
    return res.status(400).json({ success: false, error: 'Reason is required' });
  }

  const reporter = STORE.users.find((u) => u.id === reporter_id) || STORE.users[1];
  const newReport = {
    id: `rep_${Date.now()}`,
    content_type: content_type || 'idea',
    content_id: content_id || 'unknown',
    reason,
    details: details || '',
    reporter,
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  STORE.reports.unshift(newReport);
  res.status(201).json({ success: true, report: newReport });
});

export default router;

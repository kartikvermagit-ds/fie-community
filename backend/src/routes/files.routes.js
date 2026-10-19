import { Router } from 'express';
import { STORE } from '../data/mock-store.js';

const router = Router();

// GET /api/files - List presentation and resource files
router.get('/', (req, res) => {
  const { team_id } = req.query;
  let files = STORE.files;

  if (team_id) {
    files = files.filter((f) => f.team_id === team_id);
  }

  const populated = files.map((file) => {
    const uploader = STORE.users.find((u) => u.id === file.uploader_id) || STORE.users[0];
    return { ...file, uploader };
  });

  res.json({ success: true, count: populated.length, files: populated });
});

// POST /api/files/upload - Upload presentation deck or document
router.post('/upload', (req, res) => {
  const { name, team_id, uploader_id, version_label, size_bytes } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, error: 'File name is required' });
  }

  const MAX_SIZE = 50 * 1024 * 1024; // 50MB
  if (size_bytes && Number(size_bytes) > MAX_SIZE) {
    return res.status(413).json({ success: false, error: 'File exceeds 50MB limit' });
  }

  const ext = name.split('.').pop()?.toLowerCase();
  const allowedExts = ['ppt', 'pptx', 'pdf', 'docx', 'png', 'jpg', 'zip', 'rs', 'ts', 'py', 'json'];
  if (ext && !allowedExts.includes(ext)) {
    return res.status(415).json({ success: false, error: `File format .${ext} not supported` });
  }

  const newFile = {
    id: `file_${Date.now()}`,
    team_id: team_id || STORE.teams[0].id,
    name,
    size_bytes: size_bytes ? Number(size_bytes) : 3450000,
    file_type: ext === 'ppt' || ext === 'pptx' ? 'presentation' : 'document',
    mime_type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    url: '/brand/fie-logo.png',
    uploader_id: uploader_id || STORE.users[0].id,
    version_label: version_label || 'v1.0',
    downloads_count: 0,
    slide_count: 8,
    created_at: new Date().toISOString(),
  };

  STORE.files.unshift(newFile);
  const uploader = STORE.users.find((u) => u.id === newFile.uploader_id) || STORE.users[0];

  res.status(201).json({ success: true, file: { ...newFile, uploader } });
});

export default router;

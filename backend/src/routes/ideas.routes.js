import { Router } from 'express';
import { STORE } from '../data/mock-store.js';

const router = Router();

// GET /api/ideas - List ideas with optional category filter
router.get('/', (req, res) => {
  const { category, search } = req.query;
  let result = [...STORE.ideas];

  if (category && category !== 'All') {
    result = result.filter((i) => i.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (i) => i.title.toLowerCase().includes(q) || i.excerpt.toLowerCase().includes(q)
    );
  }

  // Populate author information
  const populated = result.map((idea) => {
    const author = STORE.users.find((u) => u.id === idea.author_id) || STORE.users[0];
    return { ...idea, author };
  });

  res.json({ success: true, count: populated.length, ideas: populated });
});

// POST /api/ideas - Create new idea
router.post('/', (req, res) => {
  const { title, excerpt, content, category, tags, required_skills, desired_team_size, author_id } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, error: 'Title is required' });
  }

  const newIdea = {
    id: `idea_${Date.now()}`,
    title,
    excerpt: excerpt || title.slice(0, 100),
    content: content || excerpt || title,
    category: category || 'AI & Machine Learning',
    author_id: author_id || STORE.users[0].id,
    upvotes_count: 1,
    bookmarks_count: 0,
    comments_count: 0,
    tags: tags || ['FIECommunity'],
    required_skills: required_skills || ['Full-Stack'],
    desired_team_size: desired_team_size || 4,
    status: 'open',
    created_at: new Date().toISOString(),
  };

  STORE.ideas.unshift(newIdea);
  const author = STORE.users.find((u) => u.id === newIdea.author_id) || STORE.users[0];

  res.status(201).json({ success: true, idea: { ...newIdea, author } });
});

// POST /api/ideas/:id/upvote - Upvote idea
router.post('/:id/upvote', (req, res) => {
  const { id } = req.params;
  const idea = STORE.ideas.find((i) => i.id === id);

  if (!idea) {
    return res.status(404).json({ success: false, error: 'Idea not found' });
  }

  idea.upvotes_count += 1;
  res.json({ success: true, upvotes_count: idea.upvotes_count });
});

export default router;

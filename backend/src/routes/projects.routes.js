import { Router } from 'express';
import { STORE } from '../data/mock-store.js';

const router = Router();

// GET /api/projects - List all projects
router.get('/', (req, res) => {
  res.json({ success: true, count: STORE.projects.length, projects: STORE.projects });
});

// GET /api/projects/:id - Get specific project
router.get('/:id', (req, res) => {
  const proj = STORE.projects.find((p) => p.id === req.params.id);
  if (!proj) {
    return res.status(404).json({ success: false, error: 'Project not found' });
  }
  res.json({ success: true, project: proj });
});

// PATCH /api/projects/:id/tasks/:taskId - Update Kanban task status
router.patch('/:id/tasks/:taskId', (req, res) => {
  const { id, taskId } = req.params;
  const { status } = req.body;

  const project = STORE.projects.find((p) => p.id === id);
  if (!project) {
    return res.status(404).json({ success: false, error: 'Project not found' });
  }

  const task = project.tasks.find((t) => t.id === taskId);
  if (!task) {
    return res.status(404).json({ success: false, error: 'Task not found' });
  }

  if (status) {
    task.status = status;
  }

  // Recalculate progress
  const doneTasks = project.tasks.filter((t) => t.status === 'done').length;
  project.progress_percent = Math.round((doneTasks / project.tasks.length) * 100);

  res.json({
    success: true,
    task,
    progress_percent: project.progress_percent,
  });
});

// POST /api/projects/:id/tasks - Add new task to sprint
router.post('/:id/tasks', (req, res) => {
  const { id } = req.params;
  const { title, priority, assignee_id } = req.body;

  const project = STORE.projects.find((p) => p.id === id);
  if (!project) {
    return res.status(404).json({ success: false, error: 'Project not found' });
  }

  const newTask = {
    id: `task_${Date.now()}`,
    title: title || 'New Sprint Task',
    status: 'todo',
    priority: priority || 'medium',
    assignee_id: assignee_id || STORE.users[0].id,
  };

  project.tasks.push(newTask);
  const doneTasks = project.tasks.filter((t) => t.status === 'done').length;
  project.progress_percent = Math.round((doneTasks / project.tasks.length) * 100);

  res.status(201).json({ success: true, task: newTask, progress_percent: project.progress_percent });
});

export default router;

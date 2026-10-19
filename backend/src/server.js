import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import ideasRoutes from './routes/ideas.routes.js';
import hackathonsRoutes from './routes/hackathons.routes.js';
import teamsRoutes from './routes/teams.routes.js';
import roomsRoutes from './routes/rooms.routes.js';
import projectsRoutes from './routes/projects.routes.js';
import filesRoutes from './routes/files.routes.js';
import membersRoutes from './routes/members.routes.js';
import adminRoutes from './routes/admin.routes.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://fiecommunity.dev'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  console.log(`[${timestamp}] [FIE-API] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'FIE COMMUNITY Backend Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime_seconds: process.uptime(),
    database: 'In-Memory State Store (PostgreSQL / Supabase Ready)',
  });
});

// API Routes Mount
app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideasRoutes);
app.use('/api/hackathons', hackathonsRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/files', filesRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'FIE COMMUNITY API Backend is operational',
    docs: '/api/health',
    endpoints: [
      '/api/health',
      '/api/auth/personas',
      '/api/ideas',
      '/api/hackathons',
      '/api/teams',
      '/api/rooms/:teamId',
      '/api/projects',
      '/api/files',
      '/api/members',
      '/api/admin/reports',
    ],
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found on FIE Community backend`,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[FIE-API-ERROR]', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error in FIE Community backend',
    details: err.message,
  });
});

import { fileURLToPath } from 'url';

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isDirectRun || process.env.NODE_ENV === 'production') {
  httpServer.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 FIE COMMUNITY Backend Engine running on port ${PORT}`);
    console.log(`📡 Base API URL: http://localhost:${PORT}/api`);
    console.log(`✨ Status Check: http://localhost:${PORT}/api/health`);
    console.log(`=======================================================`);
  });
}

export { app, httpServer };

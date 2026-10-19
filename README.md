# FIE COMMUNITY — Full-Stack Architecture

> **"Connect. Collaborate. Create."**
> **"Where Ideas Find Their Team."**
>
> The official platform of **FIE COMMUNITY** (Since 2026), cleanly structured with separated **Frontend** and **Backend** codebases managed in a monorepo workspace.

---

## 🏗️ Repository Architecture

```text
fie-community/
├── frontend/                     # Next.js 16 (App Router) Frontend Application
│   ├── public/brand/             # Official FIE Community logo variants & PWA assets
│   ├── src/
│   │   ├── app/                  # 18 App Router pages (Dashboard, Ideas, Hackathons, etc.)
│   │   ├── components/           # UI design system & BrandLogo components
│   │   ├── lib/                  # AuthContext, CommunityContext, API Client connector
│   │   └── types/                # TypeScript type definitions
│   ├── package.json              # Frontend workspace manifest
│   └── tests/                    # Frontend permissions & authorization tests
│
├── backend/                      # Express.js REST API & Real-time Server
│   ├── src/
│   │   ├── server.js             # Main server entry point & CORS configuration
│   │   ├── routes/               # Modular API routes (auth, ideas, hackathons, teams, etc.)
│   │   └── data/                 # Centralized mock store & DB connectors
│   ├── package.json              # Backend workspace manifest
│   └── tests/                    # Backend API route test suite (10/10 passing)
│
├── scripts/
│   ├── dev.mjs                   # Concurrent development runner (Frontend + Backend)
│   └── start.mjs                 # Production service runner
│
└── package.json                  # Root npm workspace configuration
```

---

## ⚡ Quick Start & Running Commands

### 1. Run Both Frontend and Backend Concurrently (Recommended)
```bash
npm run dev
```
- **Frontend**: Accessible at `http://localhost:3000`
- **Backend API**: Accessible at `http://localhost:5000/api`
- **Health Check**: Accessible at `http://localhost:5000/api/health`

### 2. Run Individually
```bash
# Run only Backend (Port 5000)
npm run dev:backend

# Run only Frontend (Port 3000)
npm run dev:frontend
```

### 3. Run Test Suites
```bash
# Run all tests across both Frontend & Backend (16/16 tests passing)
npm test

# Run only Frontend unit tests
npm test --workspace=frontend

# Run only Backend unit tests
npm test --workspace=backend
```

---

## 📡 Backend API Endpoints (`http://localhost:5000/api`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Server status, uptime, and database connection |
| `GET` | `/api/auth/personas` | List simulated demo personas (Alex, Sarah, Marcus, Elena) |
| `POST` | `/api/auth/login` | Authenticate member and generate JWT session |
| `POST` | `/api/auth/signup` | Register new member passport |
| `GET` | `/api/ideas` | List and search ideas by category or keyword |
| `POST` | `/api/ideas` | Publish a new idea proposal |
| `POST` | `/api/ideas/:id/upvote` | Upvote an idea |
| `GET` | `/api/hackathons` | Discover active hackathons and prize pools |
| `POST` | `/api/hackathons/:id/register`| Register a team for a hackathon |
| `GET` | `/api/teams` | Explore squads and active recruiting calls |
| `POST` | `/api/teams` | Create a new squad with nested subgroup rooms |
| `POST` | `/api/teams/join-code` | Join squad with invite code |
| `GET` | `/api/rooms/:roomId/messages` | Get chat history for a subgroup room |
| `POST` | `/api/rooms/:roomId/messages`| Post a message to a subgroup room |
| `GET` | `/api/projects` | List projects and sprint boards |
| `PATCH`| `/api/projects/:id/tasks/:tId`| Update Kanban task status (todo, in_progress, review, done) |
| `GET` | `/api/files` | Presentation library decks (PPTX, PDF) |
| `POST` | `/api/files/upload` | Upload pitch deck with 50MB validation |
| `GET` | `/api/members` | Campus member directory with tech stack search |
| `GET` | `/api/admin/reports` | Content moderation flags and security reports |

---

## 🎨 Official Brand Identity

The visual identity of FIE Community features:
- **Logo**: Three interconnected human-inspired figures representing community, collaboration, and teamwork.
- **Palette**: Warm Orange (`#F97316`), Modern Blue (`#3B82F6`), Deep Black Canvas (`#080B10`), Surface Panels (`#111722`).
- **Tagline**: *"Connect. Collaborate. Create."* — *"Where Ideas Find Their Team."*

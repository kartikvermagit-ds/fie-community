# BuildSpace — The Premier Developer Campus & Hackathon Platform

> **"Great ideas deserve great teams."**
> BuildSpace is a digital campus for software engineers, student builders, researchers, and creators. Share technical ideas, discover hackathons, form squads, organize nested subgroup rooms, chat in real time, manage Kanban sprint boards, and review pitch decks together.

---

## Latest workflow updates — 19 October 2026

- **Task focus:** assigned-to-me, due-soon and overdue views; combined search and priority filters; board/list layouts; working squad/project selection and live task/checklist updates.
- **Message threads:** focused conversations with their own replies, reply counts, composer and attachment cards, separate from the room timeline.
- **Hackathon watchlist:** personal saved events, refresh-safe browser storage and downloadable `.ics` files for registration deadlines and competition dates.
- **Demo persistence:** versioned campus snapshots preserve local work across refreshes and keep the current visit usable when browser storage fails.

These workflows run in the local browser demo. Campus changes are shared between demo personas in the same browser; hackathon watchlists are separate for each profile. They do not sync across devices or implement Supabase collaboration queries. See [UPDATE_NOTES.md](UPDATE_NOTES.md) for feature inspiration, validation and remaining backend work.

---

## 🌟 Visual Aesthetics & Design Language

Inspired by futuristic developer aesthetics combined with modern SaaS clarity:
- **Palette**: Deep navy/near-black background (`#070B14`, `#0A1020`), with electric cyan (`#00F0FF`), cosmic purple (`#A855F7`), and indigo (`#6366F1`) neon accents.
- **Typography**: **Space Grotesk** for bold headlines and terminal headings; **Inter** for clean, readable body typography.
- **Atmosphere**: Cyber grid patterns, soft gradient lighting, selective glassmorphism with high-performance backdrop blurs, refined card shadows, and micro-interactions.
- **Responsive Layout**: Designed mobile-first and optimized across smartphone, tablet, and desktop viewports, with accessibility and `prefers-reduced-motion` compliance.

---

## 🚀 Key Features & Capabilities

### 1. Public Landing & Campus Showcase
- Animated hero headline: *"Great ideas deserve great teams."*
- Interactive live terminal mockup featuring simulated subgroup room activity.
- Metrics counter showcasing active builders, hackathon squads, and tracked prize pools.
- Featured ideas and active hackathons showcases with instant upvotes.
- Interactive FAQ accordion and high-converting onboarding CTAs.

### 2. Authentication & Onboarding
- Sign in, registration passport with university/college and skills tagging, and password recovery.
- **Interactive Multi-Persona Switcher**: Switch on the fly between pre-configured campus personas (Founder, Lead Frontend Engineer, Low-Level Systems Architect, ZK Cryptographer, UI/UX Pitch Designer) to test roles, permissions, and views.
- Seamless sync with live Supabase Auth when credentials are provided.

### 3. Personalized Community Dashboard
- Quick action bar: Publish Idea, Create Squad, Join with Invite Code, Enter Workspace.
- Squad metrics and sprint status summaries.
- One-click launcher for active subgroup rooms (`#general`, `#frontend-lab`, `#backend-systems`, `#ai-ml-agents`, `#ppt-docs-pitch`).
- Real-time countdowns for upcoming hackathons.

### 4. Idea Wall & Collaboration Proposals
- Browse and publish ideas across AI & ML, Web3 & Blockchain, Cybersecurity, Open Source & DevTools, Cloud & DevOps, and Mobile.
- Reactive upvoting and bookmarking.
- Technical discussion comment threads and attachment support.
- One-click **"Create Squad from Idea"** and **"Interested in Collaborating"** actions.

### 5. Hackathon Hub & Sprints
- Track prize pools, registration deadlines, team-size limits, and official rules.
- **Teammate Matchmaking**: Broadcast "Looking for Teammates" availability by tech stack.
- **Form Squad for Hackathon**: Instantly initializes a team linked to the hackathon with sprint checklists.

### 6. Squads Directory & Hierarchy
- Strict hierarchy: `Organization/Community → Team/Squad → Subgroup/Room`.
- Roles: `Owner`, `Admin`, `Member`.
- Visibilities: `Public`, `Approval Required`, `Invite Only`.
- Secret invite code generator with 1-click clipboard copy.
- Founder / Admin join requests review queue with instant approval/rejection.

### 7. Real-Time Collaboration Rooms (Discord-Inspired)
- Left navigation of user's squads and nested subgroup rooms.
- Real-time text messaging with optimistic UI and sender timestamps.
- Emoji reactions (`🔥`, `🚀`, `💡`, `❤️`, `👍`, `👀`).
- Threaded quoted replies and message pinning.
- Slide deck and code file attachment cards.
- Member roster panel displaying online presence and squad roles.

### 8. Project Management & Kanban Boards
- 5-column Kanban board: `Backlog`, `To Do`, `In Progress`, `Review`, `Done`.
- Drag/cycle task status transitions.
- Interactive subtask checklists with automatic sprint progress recalculation.
- Priority chips (`urgent`, `high`, `medium`, `low`), assignee avatars, due dates, and tags.
- GitHub repository integration.

### 9. Presentation & Resource Vault
- Dedicated library supporting PPT, PPTX, PDF, DOCX, ZIP, and code files.
- **Interactive Presentation Viewer**: Simulated 16:9 projection screen for pitch deck reviews with rehearsal discussion comments.
- Secure downloads and file size limit validation (50MB ceiling).

### 10. Campus Member Directory & Profiles
- Filter and search builders by skills (e.g., Rust, WebAssembly, ZK-SNARKs, PyTorch) or university.
- Direct "Invite to Squad" modal and moderation report actions.

### 11. Command Palette (`⌘K` / `Ctrl+K`)
- Omnibox search across pages, ideas, hackathons, and commands.

### 12. Moderator & Safety Desk
- Investigation queue for reported content and user conduct.
- One-click moderation actions: dismiss report, warn user, or hide content.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack, React 19) |
| **Language** | TypeScript (Strict mode enabled) |
| **Styling** | Tailwind CSS v4, custom cyber design tokens, selective glassmorphism |
| **Icons** | Lucide React |
| **Animation** | Framer Motion & CSS transitions |
| **Backend & DB** | Supabase (PostgreSQL 15+, Row Level Security, Realtime, Storage) |
| **Testing** | Node.js native test runner (`node:test`, `node:assert`) |

---

## 📁 Repository Structure

```
fie community/
├── package.json                   # Top-level workspace manager
├── README.md                      # Comprehensive documentation
├── .env.example                   # Environment variable template
├── community-hub/                 # Isolated Next.js Application
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── eslint.config.mjs
│   ├── tests/
│   │   └── permissions.test.mjs  # Security & authorization unit tests
│   ├── supabase/
│   │   ├── migrations/
│   │   │   └── 20261019000001_buildspace_schema.sql  # Normalized PostgreSQL schema & RLS
│   │   └── seed.sql              # Development seed data
│   └── src/
│       ├── types/index.ts        # Domain models & interfaces
│       ├── lib/
│       │   ├── auth-context.tsx  # User state & persona switcher
│       │   ├── community-context.tsx # Global reactive store
│       │   ├── mock-data.ts      # Seed data & personas
│       │   └── supabase/
│       │       ├── client.ts     # Browser client with demo mode fallback
│       │       ├── server.ts     # SSR client
│       │       └── storage.ts    # File validators & sanitizers
│       ├── components/
│       │   ├── layout/           # Navbar, Footer, Sidebar
│       │   └── ui/               # CommandPalette, ToastContainer, Icons
│       └── app/
│           ├── layout.tsx        # Space Grotesk & Inter font provider
│           ├── globals.css       # Design tokens & cyber grid styles
│           ├── page.tsx          # Public Landing Page
│           ├── dashboard/        # Personalized Community Dashboard
│           ├── ideas/            # Idea Wall & Proposal creation
│           ├── hackathons/       # Hackathon Hub & Matchmaking
│           ├── teams/            # Squads Directory & Join Requests
│           ├── workspace/        # Discord-inspired Collaboration Rooms
│           ├── projects/         # Kanban Sprint Board
│           ├── resources/        # Presentation & File Library
│           ├── members/          # Campus Member Directory
│           ├── notifications/    # Notifications Center
│           ├── settings/         # Profile & Preferences Editor
│           ├── admin/            # Moderator & Safety Desk
│           └── auth/
│               ├── login/
│               ├── signup/
│               └── recovery/
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js `20.x` or `22.x` (Recommended: v22 LTS)
- npm `10.x`

### 1. Install Dependencies
```bash
# From workspace root
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

> [!NOTE]
> **Zero-Configuration Demo Mode Active Out-of-the-Box**: You can immediately interact with ideas, create squads, send messages across subgroup rooms, drag Kanban tasks, preview slide decks, and switch demo personas without setting up any credentials!

---

## 🗄️ Supabase Cloud Setup & Production Database

When you are ready to connect to a live Supabase project:

### 1. Create a Supabase Project
Sign in to [supabase.com](https://supabase.com) and create a new project.

### 2. Run Database Migrations
1. Open the **SQL Editor** in your Supabase dashboard.
2. Copy and execute the contents of [`community-hub/supabase/migrations/20261019000001_buildspace_schema.sql`](file:///c:/Users/hp/OneDrive/Desktop/fie%20community/community-hub/supabase/migrations/20261019000001_buildspace_schema.sql).
3. *(Optional)* Run [`community-hub/supabase/seed.sql`](file:///c:/Users/hp/OneDrive/Desktop/fie%20community/community-hub/supabase/seed.sql) to populate initial hackathons and data.

### 3. Configure Supabase Storage
The migration script automatically provisions the private `presentations` bucket with the following policies:
- Authenticated team members can download presentations.
- Authenticated team members can upload presentations (up to 50MB).

### 4. Configure Environment Variables
Copy `.env.example` to `.env.local` inside `community-hub/`:
```bash
cp community-hub/.env.example community-hub/.env.local
```
Fill in your credentials from the Supabase Project Settings (**API** tab):
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

---

## 🔒 Security & Row Level Security (RLS) Matrix

Every user-data table in PostgreSQL is protected by Row Level Security:

| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `profiles` | Everyone (Public) | Authenticated user (`auth.uid() = id`) | User only | Cascade |
| `teams` | Authenticated users | Owner | Owner & Admins | Owner |
| `team_members` | Team Members only | Owner & Admins | Owner & Admins | Owner & Admins |
| `rooms` | Team Members only | Owner & Admins | Owner & Admins | Owner & Admins |
| `messages` | **Room Members only** | **Room Members only** | Author only | Author & Team Owner |
| `files` | **Team Members only** | **Team Members only** | Uploader only | Uploader & Team Owner |
| `tasks` | Team Members only | Team Members | Team Members | Team Members |
| `notifications` | Recipient only (`auth.uid() = user_id`) | System | Recipient only | Recipient only |

---

## 🧪 Testing & Verification

Run the comprehensive unit test suite:
```bash
# Run tests
npm test

# Run TypeScript typecheck
npm run typecheck

# Run ESLint
npm run lint

# Run production build
npm run build
```

---

## 🚀 Deployment to Vercel

BuildSpace is optimized for 1-click deployment on Vercel:

1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com/new), import your repository.
3. In **Project Settings**:
   - **Root Directory**: Select `community-hub` (or leave default if deploying monorepo workspace).
   - **Framework Preset**: Next.js.
   - **Environment Variables**: Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
4. Click **Deploy**.
5. Vercel automatically compiles the static pages, enables serverless edge functions, and deploys your digital campus!

---

## 📜 License

MIT License. Designed and engineered for student hackers and developer communities worldwide.

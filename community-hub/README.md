# FIE COMMUNITY — Official Platform & Brand Identity

> **"Connect. Collaborate. Create."**
> **"Where Ideas Find Their Team."**
>
> FIE Community is a premier digital campus and collaborative innovation platform uniting developers, students, innovators, and creators worldwide. Share breakthrough ideas, discover hackathons, form squads, brainstorm in nested subgroup rooms, manage Kanban sprint boards, and share presentation decks together.

---

## 🎨 Official Brand Identity & Logo Integration

The visual identity of FIE Community is anchored by its official emblem: three interconnected human figures symbolizing community, collaboration, and teamwork, with white outlines, warm orange, rich terracotta, and modern blue on a deep dark canvas.

### Brand Color Palette
- **Background**: `#080B10` (Dark space canvas)
- **Surface Background**: `#111722` (Glassmorphic cards & headers)
- **Primary Accent**: Warm Orange (`#F97316` / `#EA580C`)
- **Secondary Accent**: Modern Blue (`#3B82F6` / `#2563EB`)
- **Terracotta / Amber**: `#C2672B` / `#D97706`
- **Main Text**: `#F8FAFC`
- **Muted Text**: `#94A3B8`
- **Status Green**: `#10B981` (Online & verification)
- **Status Amber**: `#F59E0B` (Deadlines & alerts)
- **Status Rose**: `#F43F5E` (Errors & moderation)

### Logo Asset Variants (`/public/brand/`)
1. **`fie-logo-original.png`**: Original uploaded master reference image (600×480).
2. **`fie-logo.png`**: Official logo with full wordmark and "SINCE 2026".
3. **`fie-logo-transparent.png`**: Mathematically un-premultiplied transparent PNG preserving outlines without fringes.
4. **`fie-symbol.png`**: High-resolution centered square emblem for navbar, sidebar, and headers.
5. **`fie-logo-monochrome.png`**: Clean monochrome wordmark for light/dark printing.
6. **`fie-symbol-monochrome.png`**: Clean monochrome emblem.
7. **`app-icon-dark.png`**: PWA 512×512 square application icon.
8. **`apple-touch-icon.png`**: iOS mobile home screen icon (180×180).
9. **`icon-192.png` & `icon-512.png`**: PWA manifest icons.
10. **`favicon-32.png` & `favicon-48.png`**: Browser tab favicons.

---

## 🌟 Visual Aesthetics & Immersion Technique

- **Seamless Immersion**: Rather than harsh box outlines, the logo is embedded with dual-tinted ambient glows (warm orange on the top-left, modern blue on the bottom-right) reflecting the exact colors of the figures in the logo.
- **Typography**: **Space Grotesk** for headings and brand logotypes; **Inter** for readable developer-centric interfaces.
- **Atmosphere**: Cyber grid patterns, soft gradient lighting, high-performance backdrop blurs, refined card borders (`border-white/10` with `hover:border-orange-500/40`), and smooth micro-interactions.
- **Responsive Layout**: Mobile-first design optimized across smartphones, tablets, and wide monitors.

---

## 🚀 Key Features & Capabilities

### 1. Distinctive Landing Page
- **Hero Headline**: *"Great Ideas. Stronger Teams. Endless Possibilities."*
- **Supporting Description**: *"Join a community where developers, students, innovators, and creators share ideas, find teammates, collaborate on projects, and build something extraordinary together."*
- **Primary CTAs**: *"Explore Community"*, *"Share Your Idea"*, *"Find Your Team"*.
- **Interactive Terminal**: Live preview of subgroup channels and pitch deck collaboration.
- **8 Dedicated Sections**:
  1. Ideas Hub (Trending sparks & upvotes)
  2. Hackathon Discovery (Global & campus hackathons)
  3. Team Formation (Matchmaking by required tech stack)
  4. Private Collaboration Rooms (Discord-style nested subgroup rooms)
  5. Project Workspaces (Kanban sprint boards)
  6. PPT & Resource Sharing (Slide deck vault with discussion)
  7. Community Members (Campus directory with skills)
  8. Featured Projects (Shipped by FIE Community squads)

### 2. Authentication & Onboarding
- Sign in, registration passport with college and skills tagging, and password recovery.
- **Interactive Multi-Persona Switcher**: Switch instantly between pre-configured campus personas (Founder, Lead Frontend Engineer, Low-Level Systems Architect, ZK Cryptographer, UI/UX Pitch Designer) to test roles and views.

### 3. Personalized Community Dashboard
- Quick action bar: Share Idea, Form Squad, Join with Invite Code, Enter Team Room.
- Squad metrics and sprint status summaries.
- One-click launcher for active subgroup rooms (`#general`, `#frontend-lab`, `#backend-systems`, `#ppt-docs-pitch`).

### 4. Ideas Hub & Collaboration Sparks
- Publish and discuss ideas across AI & ML, Web3, Cybersecurity, Open Source, and Cloud.
- Upvoting, bookmarking, threaded technical discussions, and "Create Squad from Idea".

### 5. Hackathon Hub & Sprints
- Track prize pools, registration deadlines, and rules.
- "Looking for Teammates" availability broadcast and instant squad formation.

### 6. Team Formation & Subgroup Hierarchy
- Hierarchy: `Community → Squad → Subgroup/Room`.
- Roles: `Owner`, `Admin`, `Member`.
- Visibilities: `Public`, `Approval Required`, `Invite Only`.
- Secret invite codes and admin join request review queues.

### 7. Real-Time Collaboration Rooms
- Nested channels per squad.
- Optimistic real-time messaging, code snippets, emoji reactions, and file attachments.

### 8. Presentation & Resource Library (PPT & PDF)
- Interactive slide deck previews, version tags, and slide feedback threads.

### 9. Project Sprints & Kanban Boards
- Columns: Backlog, To Do, In Progress, Review, Done with task assignees and checklists.

### 10. Global Command Palette (`⌘K` / `Ctrl+K`)
- Instant search across ideas, hackathons, squads, and persona switching.

---

## 🛠️ Verification & Test Suite

- **Unit Tests**: `npm test` runs 6 security, authorization, and sprint calculation tests.
- **Type Safety**: `npm run typecheck` passes with zero errors.
- **Production Build**: `npm run build` compiles all 18 static routes cleanly in Next.js 16 (Turbopack).

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run security & permissions test suite
npm test

# Run TypeScript type check
npm run typecheck

# Build for production
npm run build
```

---

## 📄 License & Attribution

Official platform of **FIE COMMUNITY** (Since 2026). All brand trademarks, logos, and visual assets reserved.

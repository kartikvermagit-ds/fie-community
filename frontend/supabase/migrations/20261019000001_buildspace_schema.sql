-- ==============================================================================
-- BUILDSPACE PRODUCTION SCHEMA & ROW LEVEL SECURITY (RLS) MIGRATION
-- Database: PostgreSQL 15+ / Supabase
-- Description: Complete data model for developer campus, idea sharing,
--              hackathons, squads, real-time collaboration rooms, and storage.
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    role TEXT DEFAULT 'Software Engineer',
    college TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    skills TEXT[] DEFAULT '{}',
    interests TEXT[] DEFAULT '{}',
    is_open_to_collaborate BOOLEAN DEFAULT TRUE,
    karma INTEGER DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_skills ON public.profiles USING GIN(skills);

-- ------------------------------------------------------------------------------
-- 2. HACKATHONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hackathons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    organizer TEXT NOT NULL,
    banner_url TEXT,
    description TEXT NOT NULL,
    prize_pool TEXT NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    registration_deadline TIMESTAMPTZ NOT NULL,
    registration_url TEXT,
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'submission_closed', 'completed')),
    tags TEXT[] DEFAULT '{}',
    rules TEXT,
    min_team_size INTEGER DEFAULT 1,
    max_team_size INTEGER DEFAULT 5,
    location TEXT DEFAULT 'Global Virtual',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. TEAMS TABLE (SQUADS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon_url TEXT,
    banner_url TEXT,
    category TEXT NOT NULL,
    visibility TEXT DEFAULT 'approval_required' CHECK (visibility IN ('public', 'approval_required', 'invite_only')),
    desired_skills TEXT[] DEFAULT '{}',
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    hackathon_id UUID REFERENCES public.hackathons(id) ON DELETE SET NULL,
    invite_code TEXT UNIQUE NOT NULL,
    invite_code_expires_at TIMESTAMPTZ,
    max_members INTEGER DEFAULT 6,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_teams_owner ON public.teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_teams_invite_code ON public.teams(invite_code);

-- ------------------------------------------------------------------------------
-- 4. TEAM_MEMBERS TABLE (ROLES: OWNER, ADMIN, MEMBER)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_team_members_team ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON public.team_members(user_id);

-- ------------------------------------------------------------------------------
-- 5. SUBGROUP ROOMS TABLE (CHANNELS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    topic TEXT,
    category TEXT DEFAULT 'general' CHECK (category IN ('general', 'frontend', 'backend', 'design', 'ai_ml', 'ppt_docs', 'voice')),
    is_private BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_rooms_team ON public.rooms(team_id);

-- ------------------------------------------------------------------------------
-- 6. CHAT MESSAGES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
    attachments JSONB DEFAULT '[]'::jsonb,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_edited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_room ON public.messages(room_id, created_at);

-- ------------------------------------------------------------------------------
-- 7. MESSAGE REACTIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.message_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    emoji TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(message_id, user_id, emoji)
);

-- ------------------------------------------------------------------------------
-- 8. IDEAS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ideas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    required_skills TEXT[] DEFAULT '{}',
    desired_team_size INTEGER DEFAULT 4,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'archived')),
    upvotes_count INTEGER DEFAULT 0,
    bookmarks_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    associated_team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ideas_author ON public.ideas(author_id);
CREATE INDEX IF NOT EXISTS idx_ideas_category ON public.ideas(category);
CREATE INDEX IF NOT EXISTS idx_ideas_tags ON public.ideas USING GIN(tags);

-- ------------------------------------------------------------------------------
-- 9. IDEA VOTES & BOOKMARKS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.idea_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    vote_type TEXT DEFAULT 'up' CHECK (vote_type IN ('up', 'down')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(idea_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.idea_bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(idea_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.idea_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES public.idea_comments(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. PROJECTS & KANBAN TASKS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    tech_stack TEXT[] DEFAULT '{}',
    github_url TEXT,
    demo_url TEXT,
    banner_url TEXT,
    status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'review', 'launched')),
    progress_percent INTEGER DEFAULT 0,
    target_launch_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'todo' CHECK (status IN ('backlog', 'todo', 'in_progress', 'review', 'done')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    due_date DATE,
    labels TEXT[] DEFAULT '{}',
    checklist JSONB DEFAULT '[]'::jsonb,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_project ON public.tasks(project_id, status);

-- ------------------------------------------------------------------------------
-- 11. PRESENTATIONS & FILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    category TEXT DEFAULT 'presentation' CHECK (category IN ('presentation', 'document', 'image', 'code', 'archive', 'other')),
    uploader_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    version TEXT DEFAULT 'v1.0',
    downloads_count INTEGER DEFAULT 0,
    preview_available BOOLEAN DEFAULT TRUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_files_team ON public.files(team_id);

-- ------------------------------------------------------------------------------
-- 12. JOIN REQUESTS & INVITATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.join_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    action_url TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL CHECK (content_type IN ('idea', 'comment', 'message', 'user', 'team')),
    content_id TEXT NOT NULL,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'action_taken', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hackathons ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. TEAMS POLICIES
CREATE POLICY "Teams are viewable by authenticated users"
    ON public.teams FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create teams"
    ON public.teams FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Team owners and admins can update teams"
    ON public.teams FOR UPDATE USING (
        auth.uid() = owner_id OR
        EXISTS (
            SELECT 1 FROM public.team_members
            WHERE team_id = id AND user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- 3. TEAM MEMBERS POLICIES
CREATE POLICY "Team members are viewable by team members or for public teams"
    ON public.team_members FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.team_members tm
            WHERE tm.team_id = team_members.team_id AND tm.user_id = auth.uid()
        )
    );

CREATE POLICY "Team founders and admins can add team members"
    ON public.team_members FOR INSERT WITH CHECK (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.team_members
            WHERE team_id = team_members.team_id AND user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- 4. SUBGROUP ROOMS POLICIES
CREATE POLICY "Rooms viewable only by team members"
    ON public.rooms FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.team_members
            WHERE team_id = rooms.team_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Team owners and admins can create rooms"
    ON public.rooms FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.team_members
            WHERE team_id = rooms.team_id AND user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- 5. MESSAGES POLICIES (REAL-TIME CHAT SECURITY)
CREATE POLICY "Messages readable only by authorized room members"
    ON public.messages FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.rooms r
            JOIN public.team_members tm ON tm.team_id = r.team_id
            WHERE r.id = messages.room_id AND tm.user_id = auth.uid()
        )
    );

CREATE POLICY "Authorized team members can insert messages"
    ON public.messages FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM public.rooms r
            JOIN public.team_members tm ON tm.team_id = r.team_id
            WHERE r.id = messages.room_id AND tm.user_id = auth.uid()
        )
    );

CREATE POLICY "Authors or team admins can delete messages"
    ON public.messages FOR DELETE USING (
        auth.uid() = sender_id OR
        EXISTS (
            SELECT 1 FROM public.rooms r
            JOIN public.teams t ON t.id = r.team_id
            WHERE r.id = messages.room_id AND t.owner_id = auth.uid()
        )
    );

-- 6. IDEAS POLICIES (PUBLIC WALL)
CREATE POLICY "Ideas are viewable by everyone"
    ON public.ideas FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create ideas"
    ON public.ideas FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their ideas"
    ON public.ideas FOR UPDATE USING (auth.uid() = author_id);

-- 7. FILES & PRESENTATIONS POLICIES (STORAGE & DB)
CREATE POLICY "Files viewable only by team members"
    ON public.files FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.team_members
            WHERE team_id = files.team_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Team members can upload files"
    ON public.files FOR INSERT WITH CHECK (
        auth.uid() = uploader_id AND
        EXISTS (
            SELECT 1 FROM public.team_members
            WHERE team_id = files.team_id AND user_id = auth.uid()
        )
    );

-- 8. NOTIFICATIONS POLICIES
CREATE POLICY "Users can only see their own notifications"
    ON public.notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications (mark as read)"
    ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- ==============================================================================
-- SUPABASE STORAGE SECURITY POLICIES (PRESENTATIONS BUCKET)
-- ==============================================================================
-- Bucket: 'presentations' (Private)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('presentations', 'presentations', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Team members only can download presentation files
CREATE POLICY "Team members can download files from presentations bucket"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'presentations' AND
    auth.role() = 'authenticated'
);

-- Storage RLS: Team members only can upload files up to 50MB
CREATE POLICY "Team members can upload files to presentations bucket"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'presentations' AND
    auth.role() = 'authenticated'
);

export type UserRole = 'owner' | 'admin' | 'member' | 'guest';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  headline?: string;
  role: string; // e.g. "Full-Stack Engineer", "AI/ML Researcher"
  college?: string;
  github_url?: string;
  portfolio_url?: string;
  skills: string[];
  interests: string[];
  is_open_to_collaborate: boolean;
  karma: number;
  created_at: string;
}

export type IdeaCategory =
  | 'AI & Machine Learning'
  | 'Web3 & Blockchain'
  | 'Cloud & DevOps'
  | 'Cybersecurity'
  | 'Mobile & IoT'
  | 'Open Source & DevTools'
  | 'Education & Social Impact'
  | 'Game Development';

export type IdeaStatus = 'open' | 'in_progress' | 'completed' | 'archived';

export interface IdeaComment {
  id: string;
  idea_id: string;
  author: UserProfile;
  content: string;
  parent_id?: string;
  created_at: string;
  likes_count: number;
}

export interface Idea {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: IdeaCategory;
  tags: string[];
  required_skills: string[];
  desired_team_size: number;
  status: IdeaStatus;
  author: UserProfile;
  upvotes_count: number;
  bookmarks_count: number;
  comments_count: number;
  is_upvoted?: boolean;
  is_bookmarked?: boolean;
  attachments?: {
    name: string;
    url: string;
    type: string;
    size?: string;
  }[];
  associated_team_id?: string;
  created_at: string;
  updated_at: string;
}

export type HackathonStatus = 'upcoming' | 'ongoing' | 'submission_closed' | 'completed';

export interface Hackathon {
  id: string;
  title: string;
  slug: string;
  organizer: string;
  organizer_logo?: string;
  banner_url: string;
  description: string;
  prize_pool: string;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  registration_url: string;
  status: HackathonStatus;
  tags: string[];
  rules: string;
  min_team_size: number;
  max_team_size: number;
  location: string; // e.g. "Global Virtual" or "San Francisco, CA"
  participants_count: number;
  teams_registered_count: number;
  created_at: string;
}

export type TeamVisibility = 'public' | 'approval_required' | 'invite_only';

export interface TeamMember {
  user: UserProfile;
  role: UserRole;
  joined_at: string;
}

export interface SubgroupRoom {
  id: string;
  team_id: string;
  name: string;
  slug: string;
  topic: string;
  category: 'general' | 'frontend' | 'backend' | 'design' | 'ai_ml' | 'ppt_docs' | 'voice';
  is_private: boolean;
  unread_count?: number;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_url: string;
  banner_url?: string;
  category: IdeaCategory;
  visibility: TeamVisibility;
  desired_skills: string[];
  owner_id: string;
  owner: UserProfile;
  members: TeamMember[];
  rooms: SubgroupRoom[];
  hackathon_id?: string;
  hackathon_title?: string;
  invite_code: string;
  invite_code_expires_at?: string;
  max_members: number;
  created_at: string;
  updated_at: string;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[]; // user ids
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender: UserProfile;
  content: string;
  parent_id?: string;
  reply_to?: {
    id: string;
    sender_name: string;
    content: string;
  };
  attachments?: {
    name: string;
    url: string;
    size: string;
    type: string;
  }[];
  reactions: MessageReaction[];
  is_pinned?: boolean;
  is_edited?: boolean;
  created_at: string;
}

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ProjectTask {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: UserProfile;
  due_date?: string;
  labels: string[];
  checklist: TaskChecklistItem[];
  created_at: string;
}

export type ProjectStatus = 'planning' | 'in_progress' | 'review' | 'launched';

export interface Project {
  id: string;
  team_id: string;
  team_name: string;
  title: string;
  slug: string;
  description: string;
  tech_stack: string[];
  github_url?: string;
  demo_url?: string;
  banner_url: string;
  status: ProjectStatus;
  progress_percent: number;
  target_launch_date?: string;
  tasks: ProjectTask[];
  created_at: string;
  updated_at: string;
}

export type FileCategory = 'presentation' | 'document' | 'image' | 'code' | 'archive' | 'other';

export interface FileResource {
  id: string;
  team_id: string;
  room_id?: string;
  name: string;
  file_path: string;
  file_url: string;
  file_size: string;
  mime_type: string;
  category: FileCategory;
  uploader: UserProfile;
  version: string;
  downloads_count: number;
  preview_available: boolean;
  description?: string;
  created_at: string;
}

export type NotificationType =
  | 'invite'
  | 'join_request'
  | 'join_approved'
  | 'mention'
  | 'task_assigned'
  | 'comment'
  | 'hackathon_alert';

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  action_url: string;
  is_read: boolean;
  actor?: UserProfile;
  created_at: string;
}

export interface JoinRequest {
  id: string;
  team_id: string;
  team_name: string;
  user: UserProfile;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface ContentReport {
  id: string;
  reporter: UserProfile;
  content_type: 'idea' | 'comment' | 'message' | 'user' | 'team';
  content_id: string;
  reason: string;
  details?: string;
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed';
  created_at: string;
}

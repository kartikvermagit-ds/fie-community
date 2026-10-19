/** Versioned browser snapshots for the local demo campus, never a live database. */
export const DEMO_STORAGE_KEY = 'buildspace:demo-campus:v1';

interface StorageAccess {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

interface CampusStoreSnapshot {
  raw: string | null;
  storageFailed: boolean;
}

// The same primitive is returned for server rendering and the initial hydration pass.
export const EMPTY_CAMPUS_STORE_SNAPSHOT = JSON.stringify({ raw: null, storageFailed: false });

export function parseCampusStoreSnapshot(snapshot: string): CampusStoreSnapshot {
  return JSON.parse(snapshot) as CampusStoreSnapshot;
}

/** Keep loaded work available if storage permissions change during a visit. */
export function createCampusStorage(getStorage: () => StorageAccess, key = DEMO_STORAGE_KEY) {
  let lastDemoRaw: string | null = null;
  let pendingDemoRaw: string | null = null;
  let liveRaw: string | null = null;
  let storageFailed = false;

  return {
    getSnapshot(demo: boolean): string {
      if (!demo) return JSON.stringify({ raw: liveRaw, storageFailed: false });
      // A failed write owns the latest work until another write can persist it.
      if (pendingDemoRaw !== null) return JSON.stringify({ raw: pendingDemoRaw, storageFailed: true });
      try {
        lastDemoRaw = getStorage().getItem(key);
        storageFailed = false;
      } catch {
        storageFailed = true;
      }
      return JSON.stringify({ raw: lastDemoRaw, storageFailed });
    },
    writeRaw(raw: string, demo: boolean): void {
      if (!demo) {
        liveRaw = raw;
        return;
      }
      lastDemoRaw = raw;
      try {
        getStorage().setItem(key, raw);
        pendingDemoRaw = null;
        storageFailed = false;
      } catch {
        pendingDemoRaw = raw;
        storageFailed = true;
      }
    },
  };
}

export function encodeDemoSnapshot<T>(data: T): string {
  return JSON.stringify({ version: 1, data });
}

/** Reject a damaged or incompatible snapshot as a whole instead of mixing campuses. */
export function decodeDemoSnapshot<T>(raw: string | null, fallback: T, validate = (value: unknown) => matchesShape(value, fallback)): T {
  if (!raw) return fallback;
  try {
    const snapshot = JSON.parse(raw);
    if (snapshot?.version !== 1 || !validate(snapshot.data)) return fallback;
    return snapshot.data as T;
  } catch {
    return fallback;
  }
}

export function matchesShape(value: unknown, sample: unknown): boolean {
  if (sample === null || sample === undefined) return true;
  if (Array.isArray(sample)) {
    return Array.isArray(value) && value.every((item) => (
      sample.length ? matchesShape(item, sample[0]) : item !== null && typeof item === 'object'
    ));
  }
  if (typeof sample === 'object') {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
    return Object.entries(sample).every(([key, child]) => (
      key in value && matchesShape((value as Record<string, unknown>)[key], child)
    ));
  }
  return typeof value === typeof sample;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function optionalShape(value: Record<string, unknown>, shape: Record<string, unknown>): boolean {
  return Object.entries(shape).every(([key, sample]) => (
    value[key] === undefined || matchesShape(value[key], sample)
  ));
}

function records(value: unknown, validate: (item: Record<string, unknown>) => boolean): boolean {
  return Array.isArray(value) && value.every((item) => isRecord(item) && validate(item));
}

// Required fields are separate from optional fields so newly created records can omit the latter.
const profileShape = { id: '', full_name: '', username: '', email: '', avatar_url: '', role: '', skills: [''], interests: [''] };
const roomShape = { id: '', team_id: '', name: '', slug: '', topic: '', category: '', is_private: false, created_at: '' };
const messageShape = { id: '', room_id: '', content: '', sender: profileShape, reactions: [{ emoji: '', users: [''], count: 0 }], created_at: '' };
const campusShape = {
  ideas: [{ id: '', title: '', excerpt: '', content: '', tags: [''], required_skills: [''], author: profileShape, upvotes_count: 0, bookmarks_count: 0, comments_count: 0, status: '', category: '', created_at: '', updated_at: '' }],
  hackathons: [{ id: '', title: '', slug: '', description: '', organizer: '', banner_url: '', prize_pool: '', start_date: '', end_date: '', registration_deadline: '', registration_url: '', status: '', tags: [''], rules: '', location: '', min_team_size: 0, max_team_size: 0, participants_count: 0, teams_registered_count: 0, created_at: '' }],
  teams: [{ id: '', name: '', slug: '', description: '', icon_url: '', category: '', visibility: '', desired_skills: [''], owner_id: '', owner: profileShape, members: [{ user: profileShape, role: '', joined_at: '' }], rooms: [roomShape], invite_code: '', max_members: 0, created_at: '', updated_at: '' }],
  projects: [{ id: '', title: '', team_id: '', team_name: '', slug: '', description: '', tech_stack: [''], status: '', progress_percent: 0, banner_url: '', tasks: [{ id: '', project_id: '', title: '', description: '', status: '', priority: '', labels: [''], checklist: [{ id: '', text: '', completed: false }], created_at: '' }], created_at: '', updated_at: '' }],
  files: [{ id: '', team_id: '', name: '', file_path: '', file_url: '', file_size: '', mime_type: '', category: '', uploader: profileShape, version: '', downloads_count: 0, preview_available: false, created_at: '' }],
  notifications: [{ id: '', user_id: '', title: '', message: '', type: '', action_url: '', is_read: false, created_at: '' }],
  joinRequests: [{ id: '', team_id: '', team_name: '', user: profileShape, message: '', status: '', created_at: '' }],
  reports: [{ id: '', reporter: profileShape, content_type: '', content_id: '', reason: '', status: '', created_at: '' }],
};

function validProfile(value: unknown): boolean {
  return isRecord(value) && matchesShape(value, profileShape) && optionalShape(value, {
    headline: '', college: '', github_url: '', portfolio_url: '',
  });
}

function optionalProfile(value: Record<string, unknown>, key: string): boolean {
  return value[key] === undefined || validProfile(value[key]);
}

/** Validate persisted application data, including optional fields only when supplied. */
export function validateDemoCampus(value: unknown): boolean {
  if (!isRecord(value) || !matchesShape(value, campusShape)) return false;
  if (!isRecord(value.messages) || !Object.values(value.messages).every((items) => (
    records(items, (message) => matchesShape(message, messageShape) && validProfile(message.sender) && optionalShape(message, {
      parent_id: '', reply_to: { id: '', sender_name: '', content: '' },
      attachments: [{ name: '', url: '', size: '', type: '' }], is_pinned: false, is_edited: false,
    }))
  ))) return false;

  return records(value.ideas, (idea) => validProfile(idea.author) && optionalShape(idea, {
    is_upvoted: false, is_bookmarked: false, associated_team_id: '',
    attachments: [{ name: '', url: '', type: '' }],
  }) && (idea.attachments === undefined || records(idea.attachments, (attachment) => optionalShape(attachment, { size: '' }))))
    && records(value.hackathons, (hackathon) => optionalShape(hackathon, { organizer_logo: '' }))
    && records(value.teams, (team) => validProfile(team.owner) && optionalShape(team, {
      banner_url: '', hackathon_id: '', hackathon_title: '', invite_code_expires_at: '',
    }) && records(team.members, (member) => validProfile(member.user))
      && records(team.rooms, (room) => optionalShape(room, { unread_count: 0 })))
    && records(value.projects, (project) => optionalShape(project, { github_url: '', demo_url: '', target_launch_date: '' })
      && records(project.tasks, (task) => optionalProfile(task, 'assignee') && optionalShape(task, { due_date: '' })))
    && records(value.files, (file) => validProfile(file.uploader) && optionalShape(file, { room_id: '', description: '' }))
    && records(value.notifications, (notification) => optionalProfile(notification, 'actor'))
    && records(value.joinRequests, (request) => validProfile(request.user))
    && records(value.reports, (report) => validProfile(report.reporter) && optionalShape(report, { details: '' }));
}

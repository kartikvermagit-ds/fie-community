'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Idea,
  Hackathon,
  Team,
  SubgroupRoom,
  ChatMessage,
  Project,
  ProjectTask,
  FileResource,
  AppNotification,
  JoinRequest,
  ContentReport,
  TaskStatus,
} from '@/types';
import { MOCK_TEAMS } from './mock-data';
import { useAuth } from './auth-context';
import { useDemoCampus } from './use-demo-campus';
import { getMessagePostError } from './chat-threads';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error' | 'warning';
  title: string;
  description?: string;
}

interface CommunityContextType {
  // Ideas
  ideas: Idea[];
  upvoteIdea: (ideaId: string) => void;
  bookmarkIdea: (ideaId: string) => void;
  createIdea: (newIdea: Omit<Idea, 'id' | 'author' | 'upvotes_count' | 'bookmarks_count' | 'comments_count' | 'created_at' | 'updated_at'>) => void;
  addIdeaComment: (ideaId: string, content: string) => void;
  
  // Hackathons
  hackathons: Hackathon[];
  createHackathon: (hackathon: Omit<Hackathon, 'id' | 'participants_count' | 'teams_registered_count' | 'created_at'>) => void;
  
  // Teams & Subgroups
  teams: Team[];
  currentTeam: Team | null;
  setCurrentTeam: (team: Team | null) => void;
  currentRoom: SubgroupRoom | null;
  setCurrentRoom: (room: SubgroupRoom | null) => void;
  createTeam: (teamData: Partial<Team>) => Team;
  createSubgroupRoom: (teamId: string, name: string, topic: string, category: SubgroupRoom['category']) => void;
  sendJoinRequest: (teamId: string, message: string) => void;
  approveJoinRequest: (requestId: string) => void;
  rejectJoinRequest: (requestId: string) => void;
  joinWithCode: (code: string) => boolean;

  // Real-time Chat & Rooms
  messages: Record<string, ChatMessage[]>;
  sendMessage: (roomId: string, content: string, attachments?: ChatMessage['attachments'], replyTo?: ChatMessage['reply_to'], parentId?: string) => void;
  addReaction: (roomId: string, messageId: string, emoji: string) => void;
  pinMessage: (roomId: string, messageId: string) => void;
  deleteMessage: (roomId: string, messageId: string) => void;

  // Projects & Tasks
  projects: Project[];
  updateTaskStatus: (projectId: string, taskId: string, newStatus: TaskStatus) => void;
  createTask: (projectId: string, task: Omit<ProjectTask, 'id' | 'project_id' | 'created_at'>) => void;
  toggleTaskChecklist: (projectId: string, taskId: string, checklistId: string) => void;
  createProject: (projectData: Partial<Project>) => void;

  // Files & Presentations
  files: FileResource[];
  uploadFile: (newFile: Omit<FileResource, 'id' | 'uploader' | 'downloads_count' | 'created_at'>) => void;
  deleteFile: (fileId: string) => void;

  // Notifications & Moderation
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  joinRequests: JoinRequest[];
  reports: ContentReport[];
  submitReport: (report: Omit<ContentReport, 'id' | 'reporter' | 'status' | 'created_at'>) => void;

  // UI / Global
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const { user, isDemoMode } = useAuth();
  const { campus, updateField, storageFailed } = useDemoCampus(isDemoMode);
  const { ideas, hackathons, teams, messages, projects, files, notifications, joinRequests, reports } = campus;
  const setIdeas = (value: React.SetStateAction<Idea[]>) => updateField('ideas', value);
  const setHackathons = (value: React.SetStateAction<Hackathon[]>) => updateField('hackathons', value);
  const setTeams = (value: React.SetStateAction<Team[]>) => updateField('teams', value);
  const setMessages = (value: React.SetStateAction<Record<string, ChatMessage[]>>) => updateField('messages', value);
  const setProjects = (value: React.SetStateAction<Project[]>) => updateField('projects', value);
  const setFiles = (value: React.SetStateAction<FileResource[]>) => updateField('files', value);
  const setNotifications = (value: React.SetStateAction<AppNotification[]>) => updateField('notifications', value);
  const setJoinRequests = (value: React.SetStateAction<JoinRequest[]>) => updateField('joinRequests', value);
  const setReports = (value: React.SetStateAction<ContentReport[]>) => updateField('reports', value);
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(MOCK_TEAMS[0].id);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(MOCK_TEAMS[0].rooms[0].id);
  const memberTeams = teams.filter((team) => team.members.some((member) => member.user.id === user?.id));
  const currentTeam = memberTeams.find((team) => team.id === currentTeamId) ?? memberTeams[0] ?? null;
  const currentRoom = currentTeam?.rooms.find((room) => room.id === currentRoomId) ?? currentTeam?.rooms[0] ?? null;
  const setCurrentTeam = (team: Team | null) => setCurrentTeamId(team?.id ?? null);
  const setCurrentRoom = (room: SubgroupRoom | null) => setCurrentRoomId(room?.id ?? null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    if (storageFailed) {
      const id = 'demo-storage-unavailable';
      setToasts((previous) => previous.some((toast) => toast.id === id) ? previous : [...previous, {
        id, type: 'warning', title: 'Browser storage is unavailable',
        description: 'Your demo changes work for this visit but may be lost on refresh. Free browser storage or allow site data to save them.',
      }]);
    }
  }, [storageFailed]);

  // Keyboard shortcut listener for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Ideas actions ---
  const upvoteIdea = (ideaId: string) => {
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id === ideaId) {
          const isUpvoted = !idea.is_upvoted;
          return {
            ...idea,
            is_upvoted: isUpvoted,
            upvotes_count: isUpvoted ? idea.upvotes_count + 1 : idea.upvotes_count - 1,
          };
        }
        return idea;
      })
    );
  };

  const bookmarkIdea = (ideaId: string) => {
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id === ideaId) {
          const isBookmarked = !idea.is_bookmarked;
          return {
            ...idea,
            is_bookmarked: isBookmarked,
            bookmarks_count: isBookmarked ? idea.bookmarks_count + 1 : idea.bookmarks_count - 1,
          };
        }
        return idea;
      })
    );
    showToast({
      type: 'info',
      title: 'Bookmark updated',
      description: 'Idea saved to your personal collection.',
    });
  };

  const createIdea = (newIdeaData: Omit<Idea, 'id' | 'author' | 'upvotes_count' | 'bookmarks_count' | 'comments_count' | 'created_at' | 'updated_at'>) => {
    if (!user) return;
    const newIdea: Idea = {
      ...newIdeaData,
      id: `idea_${Date.now()}`,
      author: user,
      upvotes_count: 1,
      bookmarks_count: 0,
      comments_count: 0,
      is_upvoted: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setIdeas((prev) => [newIdea, ...prev]);
    showToast({
      type: 'success',
      title: 'Idea published!',
      description: 'Your idea is now live on the Idea Wall.',
    });
  };

  const addIdeaComment = (ideaId: string, content: string) => {
    if (!user || !content.trim()) return;
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id === ideaId) {
          return {
            ...idea,
            comments_count: idea.comments_count + 1,
          };
        }
        return idea;
      })
    );
    showToast({
      type: 'success',
      title: 'Comment posted',
      description: 'Your response was added to the discussion.',
    });
  };

  // --- Hackathons actions ---
  const createHackathon = (hackathonData: Omit<Hackathon, 'id' | 'participants_count' | 'teams_registered_count' | 'created_at'>) => {
    const newHack: Hackathon = {
      ...hackathonData,
      id: `hack_${Date.now()}`,
      participants_count: 1,
      teams_registered_count: 0,
      created_at: new Date().toISOString(),
    };
    setHackathons((prev) => [newHack, ...prev]);
    showToast({
      type: 'success',
      title: 'Hackathon listed!',
      description: `${newHack.title} is now visible to the community.`,
    });
  };

  // --- Teams & Subgroups actions ---
  const createTeam = (teamData: Partial<Team>): Team => {
    if (!user) throw new Error('Must be logged in to create a team');
    const teamId = `team_${Date.now()}`;
    const defaultRooms: SubgroupRoom[] = [
      {
        id: `room_${teamId}_general`,
        team_id: teamId,
        name: 'general',
        slug: 'general',
        topic: 'General team discussion & announcements',
        category: 'general',
        is_private: false,
        created_at: new Date().toISOString(),
      },
      {
        id: `room_${teamId}_frontend`,
        team_id: teamId,
        name: 'frontend',
        slug: 'frontend',
        topic: 'Frontend UI, components, and state',
        category: 'frontend',
        is_private: false,
        created_at: new Date().toISOString(),
      },
      {
        id: `room_${teamId}_backend`,
        team_id: teamId,
        name: 'backend',
        slug: 'backend',
        topic: 'APIs, database, and infrastructure',
        category: 'backend',
        is_private: false,
        created_at: new Date().toISOString(),
      },
      {
        id: `room_${teamId}_ppt`,
        team_id: teamId,
        name: 'ppt-docs',
        slug: 'ppt-docs',
        topic: 'Presentations, slide decks, and documentation',
        category: 'ppt_docs',
        is_private: false,
        created_at: new Date().toISOString(),
      },
    ];

    const newTeam: Team = {
      id: teamId,
      name: teamData.name || 'Untitled Squad',
      slug: (teamData.name || 'squad').toLowerCase().replace(/\s+/g, '-'),
      description: teamData.description || 'Collaborative team on BuildSpace',
      icon_url: teamData.icon_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=128&h=128&q=80',
      banner_url: teamData.banner_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      category: teamData.category || 'AI & Machine Learning',
      visibility: teamData.visibility || 'public',
      desired_skills: teamData.desired_skills || ['Next.js', 'TypeScript'],
      owner_id: user.id,
      owner: user,
      members: [{ user, role: 'owner', joined_at: new Date().toISOString() }],
      rooms: defaultRooms,
      hackathon_id: teamData.hackathon_id,
      hackathon_title: teamData.hackathon_title,
      invite_code: `INV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      max_members: teamData.max_members || 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setTeams((prev) => [newTeam, ...prev]);
    setCurrentTeam(newTeam);
    setCurrentRoom(defaultRooms[0]);
    showToast({
      type: 'success',
      title: 'Squad created!',
      description: `Welcome to ${newTeam.name}. Invite members with code: ${newTeam.invite_code}`,
    });
    return newTeam;
  };

  const createSubgroupRoom = (teamId: string, name: string, topic: string, category: SubgroupRoom['category']) => {
    const formattedSlug = name.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    const newRoom: SubgroupRoom = {
      id: `room_${teamId}_${Date.now()}`,
      team_id: teamId,
      name: formattedSlug,
      slug: formattedSlug,
      topic: topic || `${name} channel`,
      category,
      is_private: false,
      created_at: new Date().toISOString(),
    };

    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          return {
            ...t,
            rooms: [...t.rooms, newRoom],
          };
        }
        return t;
      })
    );

    if (currentTeam?.id === teamId) {
      setCurrentRoom(newRoom);
    }

    showToast({
      type: 'success',
      title: 'Subgroup created',
      description: `#${newRoom.name} is now open for your team.`,
    });
  };

  const sendJoinRequest = (teamId: string, message: string) => {
    if (!user) return;
    const targetTeam = teams.find((t) => t.id === teamId);
    if (!targetTeam) return;

    const newReq: JoinRequest = {
      id: `req_${Date.now()}`,
      team_id: teamId,
      team_name: targetTeam.name,
      user,
      message,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    setJoinRequests((prev) => [newReq, ...prev]);
    showToast({
      type: 'success',
      title: 'Request sent',
      description: `Your application to join ${targetTeam.name} was delivered to the founder.`,
    });
  };

  const approveJoinRequest = (requestId: string) => {
    const req = joinRequests.find((r) => r.id === requestId);
    if (!req) return;

    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === req.team_id) {
          return {
            ...t,
            members: [...t.members, { user: req.user, role: 'member', joined_at: new Date().toISOString() }],
          };
        }
        return t;
      })
    );

    setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
    showToast({
      type: 'success',
      title: 'Member approved!',
      description: `${req.user.full_name} has joined the team.`,
    });
  };

  const rejectJoinRequest = (requestId: string) => {
    setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
    showToast({
      type: 'info',
      title: 'Request dismissed',
    });
  };

  const joinWithCode = (code: string): boolean => {
    if (!user) return false;
    const matched = teams.find((t) => t.invite_code.toUpperCase() === code.trim().toUpperCase());
    if (!matched) {
      showToast({
        type: 'error',
        title: 'Invalid Invite Code',
        description: 'Please check your code or request an invitation from the owner.',
      });
      return false;
    }

    const alreadyMember = matched.members.some((m) => m.user.id === user.id);
    if (alreadyMember) {
      setCurrentTeam(matched);
      setCurrentRoom(matched.rooms[0]);
      showToast({
        type: 'info',
        title: 'Already a Member',
        description: `Switched to ${matched.name}.`,
      });
      return true;
    }

    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === matched.id) {
          return {
            ...t,
            members: [...t.members, { user, role: 'member', joined_at: new Date().toISOString() }],
          };
        }
        return t;
      })
    );
    setCurrentTeam(matched);
    setCurrentRoom(matched.rooms[0]);
    showToast({
      type: 'success',
      title: 'Joined squad!',
      description: `You are now a member of ${matched.name}.`,
    });
    return true;
  };

  // --- Real-time Chat actions ---
  const sendMessage = (roomId: string, content: string, attachments?: ChatMessage['attachments'], replyTo?: ChatMessage['reply_to'], parentId?: string) => {
    if (!content.trim() && (!attachments || attachments.length === 0)) return;
    const postError = getMessagePostError(user?.id, teams, roomId, messages[roomId] || [], parentId);
    if (postError || !user) {
      showToast({ type: 'error', title: 'Message could not be sent', description: postError || 'Sign in to post a message.' });
      return;
    }

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      room_id: roomId,
      sender: user,
      content: content.trim(),
      parent_id: parentId,
      reply_to: replyTo,
      attachments,
      reactions: [],
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), newMsg],
    }));
  };

  const addReaction = (roomId: string, messageId: string, emoji: string) => {
    if (!user) return;
    setMessages((prev) => {
      const roomMsgs = prev[roomId] || [];
      const updated = roomMsgs.map((msg) => {
        if (msg.id === messageId) {
          const existing = msg.reactions.find((r) => r.emoji === emoji);
          if (existing) {
            const hasUserReacted = existing.users.includes(user.id);
            const newUsers = hasUserReacted
              ? existing.users.filter((id) => id !== user.id)
              : [...existing.users, user.id];
            
            const newReactions = msg.reactions
              .map((r) => (r.emoji === emoji ? { ...r, count: newUsers.length, users: newUsers } : r))
              .filter((r) => r.count > 0);
            
            return { ...msg, reactions: newReactions };
          } else {
            return {
              ...msg,
              reactions: [...msg.reactions, { emoji, count: 1, users: [user.id] }],
            };
          }
        }
        return msg;
      });
      return { ...prev, [roomId]: updated };
    });
  };

  const pinMessage = (roomId: string, messageId: string) => {
    setMessages((prev) => {
      const roomMsgs = prev[roomId] || [];
      const updated = roomMsgs.map((msg) => {
        if (msg.id === messageId) {
          return { ...msg, is_pinned: !msg.is_pinned };
        }
        return msg;
      });
      return { ...prev, [roomId]: updated };
    });
    showToast({
      type: 'info',
      title: 'Pin status updated',
    });
  };

  const deleteMessage = (roomId: string, messageId: string) => {
    setMessages((prev) => ({
      ...prev,
      [roomId]: (prev[roomId] || []).filter((msg) => msg.id !== messageId),
    }));
    showToast({
      type: 'info',
      title: 'Message deleted',
    });
  };

  // --- Projects & Kanban actions ---
  const canEditProject = (projectId: string) => {
    const project = projects.find((item) => item.id === projectId);
    return Boolean(user && project && teams.some((team) => team.id === project.team_id
      && team.members.some((member) => member.user.id === user.id)));
  };

  const updateTaskStatus = (projectId: string, taskId: string, newStatus: TaskStatus) => {
    if (!canEditProject(projectId)) return;
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          const updatedTasks = proj.tasks.map((task) => {
            if (task.id === taskId) {
              return { ...task, status: newStatus };
            }
            return task;
          });
          const doneCount = updatedTasks.filter((t) => t.status === 'done').length;
          const progress = updatedTasks.length > 0 ? Math.round((doneCount / updatedTasks.length) * 100) : 0;
          return { ...proj, tasks: updatedTasks, progress_percent: progress };
        }
        return proj;
      })
    );
  };

  const createTask = (projectId: string, taskData: Omit<ProjectTask, 'id' | 'project_id' | 'created_at'>) => {
    if (!canEditProject(projectId) || !taskData.title.trim()) return;
    const newTask: ProjectTask = {
      ...taskData,
      id: `task_${Date.now()}`,
      project_id: projectId,
      created_at: new Date().toISOString(),
    };

    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          const tasks = [...proj.tasks, newTask];
          const doneCount = tasks.filter((t) => t.status === 'done').length;
          const progress = Math.round((doneCount / tasks.length) * 100);
          return { ...proj, tasks, progress_percent: progress };
        }
        return proj;
      })
    );

    showToast({
      type: 'success',
      title: 'Task created',
      description: `"${newTask.title}" added to the board.`,
    });
  };

  const toggleTaskChecklist = (projectId: string, taskId: string, checklistId: string) => {
    if (!canEditProject(projectId)) return;
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          const updatedTasks = proj.tasks.map((task) => {
            if (task.id === taskId) {
              const updatedChecklist = task.checklist.map((item) =>
                item.id === checklistId ? { ...item, completed: !item.completed } : item
              );
              return { ...task, checklist: updatedChecklist };
            }
            return task;
          });
          return { ...proj, tasks: updatedTasks };
        }
        return proj;
      })
    );
  };

  const createProject = (projectData: Partial<Project>) => {
    const targetTeam = projectData.team_id ? memberTeams.find((team) => team.id === projectData.team_id) : currentTeam;
    if (!targetTeam) return;
    const newProj: Project = {
      id: `proj_${Date.now()}`,
      team_id: targetTeam.id,
      team_name: targetTeam.name,
      title: projectData.title || 'New Hackathon Build',
      slug: (projectData.title || 'build').toLowerCase().replace(/\s+/g, '-'),
      description: projectData.description || 'Sprint project on BuildSpace',
      tech_stack: projectData.tech_stack || ['TypeScript', 'Next.js'],
      github_url: projectData.github_url,
      demo_url: projectData.demo_url,
      banner_url: projectData.banner_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      status: 'planning',
      progress_percent: 0,
      tasks: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setProjects((prev) => [newProj, ...prev]);
    showToast({
      type: 'success',
      title: 'Project initialized',
      description: `Project board ready for ${newProj.title}.`,
    });
  };

  // --- Files & Presentations ---
  const uploadFile = (fileData: Omit<FileResource, 'id' | 'uploader' | 'downloads_count' | 'created_at'>) => {
    if (!user) return;
    const newFile: FileResource = {
      ...fileData,
      id: `file_${Date.now()}`,
      uploader: user,
      downloads_count: 0,
      created_at: new Date().toISOString(),
    };
    setFiles((prev) => [newFile, ...prev]);
    showToast({
      type: 'success',
      title: 'File uploaded',
      description: `${newFile.name} added to the resource library.`,
    });
  };

  const deleteFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    showToast({
      type: 'info',
      title: 'File removed',
    });
  };

  // --- Notifications ---
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    showToast({
      type: 'info',
      title: 'All notifications cleared',
    });
  };

  const submitReport = (reportData: Omit<ContentReport, 'id' | 'reporter' | 'status' | 'created_at'>) => {
    if (!user) return;
    const newReport: ContentReport = {
      ...reportData,
      id: `rep_${Date.now()}`,
      reporter: user,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    setReports((prev) => [newReport, ...prev]);
    showToast({
      type: 'warning',
      title: 'Report submitted',
      description: 'Our community moderators will review this item shortly.',
    });
  };

  return (
    <CommunityContext.Provider
      value={{
        ideas,
        upvoteIdea,
        bookmarkIdea,
        createIdea,
        addIdeaComment,
        hackathons,
        createHackathon,
        teams,
        currentTeam,
        setCurrentTeam,
        currentRoom,
        setCurrentRoom,
        createTeam,
        createSubgroupRoom,
        sendJoinRequest,
        approveJoinRequest,
        rejectJoinRequest,
        joinWithCode,
        messages,
        sendMessage,
        addReaction,
        pinMessage,
        deleteMessage,
        projects,
        updateTaskStatus,
        createTask,
        toggleTaskChecklist,
        createProject,
        files,
        uploadFile,
        deleteFile,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        joinRequests,
        reports,
        submitReport,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const context = useContext(CommunityContext);
  if (context === undefined) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
}

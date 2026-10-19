'use client';

import React, { useState, useRef, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { ToastContainer } from '@/components/ui/toast-container';
import { useAuth } from '@/lib/auth-context';
import { useCommunity } from '@/lib/community-context';
import { getChannelMessages, getMessagePostError, getThreadMessages, getThreadRoot } from '@/lib/chat-threads';
import type { ChatMessage, SubgroupRoom } from '@/types';
import {
  MessagesSquare,
  Plus,
  Hash,
  Smile,
  Pin,
  Trash2,
  Reply,
  Quote,
  Send,
  Paperclip,
  Users,
  Search,
  FileText,
  Download,
  ArrowRight,
  X,
  FolderGit2,
} from 'lucide-react';

const COMMON_REACTIONS = ['🔥', '🚀', '💡', '❤️', '👍', '👀'];
const subscribeToHydration = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function MessageTime({ dateTime }: { dateTime: string }) {
  const isClient = useSyncExternalStore(subscribeToHydration, getClientSnapshot, getServerSnapshot);
  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) return <span>Unknown time</span>;
  const isoTime = date.toISOString();
  return (
    <time dateTime={isoTime} title={isoTime}>
      {isClient
        ? date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
        : `${isoTime.slice(11, 16)} UTC`}
    </time>
  );
}

function ThreadAttachments({ attachments }: { attachments: ChatMessage['attachments'] }) {
  if (!attachments?.length) return null;
  return (
    <div className="mt-2 space-y-2">
      {attachments.map((attachment, index) => (
        <Link key={`${attachment.name}-${index}`} href="/resources" className="flex min-w-0 items-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3 text-xs hover:bg-cyan-500/10">
          <FileText className="h-4 w-4 shrink-0 text-cyan-300" />
          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium">{attachment.name}</span>
            <span className="text-[10px] text-slate-400">{attachment.size} · Open file library</span>
          </span>
          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-cyan-300" />
        </Link>
      ))}
    </div>
  );
}

export default function WorkspacePage() {
  const { user } = useAuth();
  const {
    teams,
    currentTeam,
    setCurrentTeam,
    currentRoom,
    setCurrentRoom,
    messages,
    sendMessage,
    addReaction,
    pinMessage,
    deleteMessage,
    createSubgroupRoom,
    showToast,
  } = useCommunity();

  const [messageInput, setMessageInput] = useState('');
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [searchInRoom, setSearchInRoom] = useState('');
  const [showMembersDrawer, setShowMembersDrawer] = useState(true);
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [showNewRoomModal, setShowNewRoomModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomTopic, setNewRoomTopic] = useState('');
  const [newRoomCategory, setNewRoomCategory] = useState<SubgroupRoom['category']>('general');
  const [reactionPickerMsgId, setReactionPickerMsgId] = useState<string | null>(null);
  const [activeThread, setActiveThread] = useState<{ roomId: string; rootId: string; draft: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);
  const threadInputRef = useRef<HTMLInputElement>(null);
  const threadOpenerRef = useRef<HTMLButtonElement | null>(null);

  const memberTeams = user ? teams.filter((candidate) => candidate.members.some((member) => member.user.id === user.id)) : [];
  const team = memberTeams.find((candidate) => candidate.id === currentTeam?.id) || memberTeams.at(0);
  const room = team?.rooms.find((candidate) => candidate.id === currentRoom?.id) || team?.rooms.at(0);
  const currentMessages = room ? messages[room.id] || [] : [];
  const channelMessages = room ? getChannelMessages(currentMessages, room.id) : [];
  const threadRoot = room && activeThread?.roomId === room.id
    ? getThreadRoot(currentMessages, room.id, activeThread.rootId)
    : undefined;
  const threadReplies = room && threadRoot ? getThreadMessages(currentMessages, room.id, threadRoot.id) : [];
  const canPost = Boolean(room && !getMessagePostError(user?.id, teams, room.id, currentMessages));

  // Auto scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channelMessages.length, room?.id]);

  useEffect(() => {
    threadInputRef.current?.focus();
  }, [threadRoot?.id]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threadReplies.length, threadRoot?.id]);

  const openThread = (message: ChatMessage, opener: HTMLButtonElement) => {
    threadOpenerRef.current = opener;
    setActiveThread((previous) => previous?.rootId === message.id && previous.roomId === message.room_id
      ? previous
      : { roomId: message.room_id, rootId: message.id, draft: '' });
    setReactionPickerMsgId(null);
  };

  const closeThread = () => {
    setActiveThread(null);
    threadOpenerRef.current?.focus();
  };

  const selectRoom = (nextRoom: SubgroupRoom) => {
    setCurrentRoom(nextRoom);
    setActiveThread(null);
    setReplyingTo(null);
    setSearchInRoom('');
    setShowPinnedOnly(false);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!room || !canPost || !messageInput.trim()) return;

    const replyPayload = replyingTo
      ? {
          id: replyingTo.id,
          sender_name: replyingTo.sender.full_name,
          content: replyingTo.content.substring(0, 80),
        }
      : undefined;

    sendMessage(room.id, messageInput, undefined, replyPayload);
    setMessageInput('');
    setReplyingTo(null);
  };

  const handleThreadSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!room || !threadRoot || !activeThread?.draft.trim() || !canPost) return;
    sendMessage(room.id, activeThread.draft, undefined, undefined, threadRoot.id);
    setActiveThread((previous) => previous ? { ...previous, draft: '' } : null);
  };

  const handleAttachDemoFile = (parentId?: string) => {
    if (!team || !room || !canPost) return;
    sendMessage(
      room.id,
      'Sample presentation card — browse the file library for available resources.',
      [
        {
          name: `${team.name}_Architecture_Overview.pptx`,
          url: '#',
          size: '3.4 MB',
          type: 'presentation',
        },
      ],
      undefined,
      parentId,
    );
    showToast({
      type: 'success',
      title: 'Sample file card added',
      description: 'This demo card links to the file library; it does not upload a file.',
    });
  };

  const handleCreateRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!team || !newRoomName.trim()) return;
    createSubgroupRoom(team.id, newRoomName.trim(), newRoomTopic.trim(), newRoomCategory);
    setShowNewRoomModal(false);
    setNewRoomName('');
    setNewRoomTopic('');
  };

  const filteredMessages = channelMessages.filter((msg) => {
    if (showPinnedOnly && !msg.is_pinned) return false;
    if (searchInRoom.trim()) {
      const q = searchInRoom.toLowerCase();
      const matchContent = msg.content.toLowerCase().includes(q);
      const matchSender = msg.sender.full_name.toLowerCase().includes(q);
      if (!matchContent && !matchSender) return false;
    }
    return true;
  });

  if (!team || !room) {
    return (
      <div className="min-h-dvh bg-[#070B14] text-white">
        <Navbar />
        <ToastContainer />
        <main className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
          <MessagesSquare className="mb-5 h-10 w-10 text-cyan-300" />
          <h1 className="text-2xl font-bold">{team ? 'No rooms yet' : user ? 'Find your squad' : 'Sign in to your workspace'}</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            {team
              ? 'This squad does not have any rooms yet. Choose another squad to continue.'
              : user
              ? 'Join or create a squad to open its rooms and start a conversation.'
              : 'Sign in to see your squads, rooms, and conversations.'}
          </p>
          <Link href={user ? '/teams' : '/auth/login'} className="mt-6 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-black hover:bg-cyan-300">
            {user ? 'Explore squads' : 'Sign in'}
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="h-dvh flex flex-col bg-[#070B14] text-white selection:bg-cyan-500/25 selection:text-cyan-300 overflow-hidden">
      <Navbar />
      <ToastContainer />

      <div className="flex-1 min-h-0 flex overflow-hidden relative">
        {/* LEFT PANEL: SQUADS & SUBGROUP CHANNELS (Discord-inspired) */}
        <aside className="hidden md:flex w-60 lg:w-64 bg-[#090E1D] border-r border-white/10 flex-col shrink-0">
          {/* Squad Header / Dropdown */}
          <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-[#0C1327]">
            <div className="flex items-center gap-2.5 truncate">
              <img
                src={team.icon_url}
                alt={team.name}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-cyan-500/40 shrink-0"
              />
              <div className="truncate">
                <p className="font-heading text-sm font-bold text-white truncate">{team.name}</p>
                <p className="text-[10px] font-mono text-cyan-400 truncate">
                  {team.members.length} members · {team.rooms.length} rooms
                </p>
              </div>
            </div>

            <Link
              href="/projects"
              className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Open Project Kanban"
            >
              <FolderGit2 className="w-4 h-4 text-purple-400" />
            </Link>
          </div>

          {/* Subgroup Rooms Channels List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
            {/* Squad Switcher if user has multiple squads */}
            {memberTeams.length > 1 && (
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-2 mb-1.5">
                  Your Squads
                </p>
                <div className="space-y-1">
                  {memberTeams.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setCurrentTeam(t);
                        selectRoom(t.rooms[0]);
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-left transition-colors ${
                        team.id === t.id
                          ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <img src={t.icon_url} alt={t.name} className="w-5 h-5 rounded-md object-cover" />
                      <span className="truncate">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Channels Header */}
            <div>
              <div className="flex items-center justify-between px-2 mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Subgroup Rooms
                </span>
                <button
                  onClick={() => setShowNewRoomModal(true)}
                  className="text-slate-400 hover:text-cyan-400 p-0.5 rounded transition-colors"
                  title="Create new subgroup room"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-0.5">
                {team.rooms.map((r) => {
                  const isActive = room?.id === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => selectRoom(r)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all group ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/10 text-white font-semibold border border-cyan-500/30 shadow-inner'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Hash className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                        <span className="truncate text-xs">{r.name}</span>
                      </div>

                      {r.category === 'ppt_docs' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                          PPT
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Resources shortcut */}
            <div className="pt-2 border-t border-white/10">
              <Link
                href="/resources"
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-xs"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Presentation & File Vault</span>
              </Link>
            </div>
          </div>

          {/* User Status Bar at bottom */}
          <div className="p-3 border-t border-white/10 bg-[#060A16] flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <div className="relative">
                <img
                  src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80'}
                  alt={user?.full_name || 'User'}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#060A16]" />
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{user?.full_name}</p>
                <p className="text-[10px] text-emerald-400 font-mono">Local demo workspace</p>
              </div>
            </div>
          </div>
        </aside>

        {/* CENTER PANEL: ACTIVE ROOM CHAT STREAM */}
        <main className="flex-1 min-w-0 flex flex-col bg-[#070B14] overflow-hidden relative">
          <div className="md:hidden grid grid-cols-2 gap-2 p-3 border-b border-white/10 bg-[#090E1D]">
            <select
              aria-label="Select squad"
              value={team.id}
              onChange={(e) => {
                const nextTeam = memberTeams.find((candidate) => candidate.id === e.target.value);
                if (!nextTeam) return;
                setCurrentTeam(nextTeam);
                selectRoom(nextTeam.rooms[0]);
              }}
              className="min-w-0 rounded-lg border border-white/10 bg-[#0C1327] p-2 text-xs"
            >
              {memberTeams.map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.name}</option>)}
            </select>
            <select
              aria-label="Select room"
              value={room?.id || ''}
              onChange={(e) => {
                const nextRoom = team.rooms.find((candidate) => candidate.id === e.target.value);
                if (nextRoom) selectRoom(nextRoom);
              }}
              className="min-w-0 rounded-lg border border-white/10 bg-[#0C1327] p-2 text-xs"
            >
              {team.rooms.map((candidate) => <option key={candidate.id} value={candidate.id}>#{candidate.name}</option>)}
            </select>
          </div>
          {/* Room Topbar */}
          <div className="h-14 border-b border-white/10 px-4 flex items-center justify-between bg-[#090E1D]/80 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-2 truncate">
              <Hash className="w-4 h-4 text-cyan-400 shrink-0" />
              <h2 className="font-heading text-sm font-bold text-white truncate">{room?.name}</h2>
              <span className="text-slate-500 hidden sm:inline">|</span>
              <p className="text-xs text-slate-400 truncate hidden sm:inline">{room?.topic}</p>
            </div>

            <div className="flex items-center gap-2">
              {/* Search in room */}
              <div className="relative hidden lg:block">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
                <input
                  type="text"
                  aria-label="Search messages in room"
                  value={searchInRoom}
                  onChange={(e) => setSearchInRoom(e.target.value)}
                  placeholder="Search in #room..."
                  className="pl-8 pr-3 py-1 rounded-lg border border-white/10 bg-black/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-36 lg:w-48"
                />
              </div>

              {/* Pinned filter toggle */}
              <button
                onClick={() => setShowPinnedOnly(!showPinnedOnly)}
                className={`p-2 rounded-xl border transition-colors ${
                  showPinnedOnly
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40'
                    : 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title="Toggle Pinned Messages"
                aria-label="Show pinned messages only"
                aria-pressed={showPinnedOnly}
              >
                <Pin className="w-4 h-4" />
              </button>

              {/* Members drawer toggle */}
              <button
                onClick={() => setShowMembersDrawer(!showMembersDrawer)}
                className={`hidden xl:block p-2 rounded-xl border transition-colors ${
                  showMembersDrawer
                    ? 'bg-purple-500/20 text-purple-300 border-purple-400/40'
                    : 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title="Toggle Squad Members"
                aria-label="Toggle squad members"
                aria-pressed={showMembersDrawer}
              >
                <Users className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Room Welcome Header */}
            <div className="pt-4 pb-6 border-b border-white/5 text-left">
              <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-3">
                <Hash className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white">Welcome to #{room?.name}!</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-lg">
                Coordinate with <span className="text-cyan-300 font-semibold">{team.name}</span> in #{room?.name}. Start a thread to keep a focused conversation together. This workspace is a local browser demo.
              </p>
            </div>

            {/* Filtered messages list */}
            {filteredMessages.map((msg) => {
              const isCurrentUser = user && msg.sender.id === user.id;
              const replyCount = getThreadMessages(currentMessages, room.id, msg.id).length;

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 p-2.5 pb-11 md:pb-2.5 rounded-2xl transition-colors hover:bg-white/[0.02] group relative ${
                    msg.is_pinned ? 'border-l-2 border-cyan-400 bg-cyan-500/[0.03]' : ''
                  }`}
                >
                  <img
                    src={msg.sender.avatar_url}
                    alt={msg.sender.full_name}
                    className="w-9 h-9 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="min-w-0 truncate font-semibold text-xs text-white">
                        {msg.sender.full_name}
                      </span>
                      <span className="shrink-0 text-[10px] text-slate-500 font-mono">
                        <MessageTime dateTime={msg.created_at} />
                      </span>
                      {msg.is_pinned && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/15 text-cyan-300 flex items-center gap-1">
                          <Pin className="w-2.5 h-2.5" /> Pinned
                        </span>
                      )}
                    </div>

                    {/* Quoted reply if any */}
                    {msg.reply_to && (
                      <div className="mt-1 pl-2.5 border-l-2 border-purple-400/50 text-[11px] text-slate-400 italic">
                        Replying to <span className="text-purple-300 font-medium">{msg.reply_to.sender_name}</span>:{' '}
                        {msg.reply_to.content}
                      </div>
                    )}

                    {/* Message Content */}
                    <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed whitespace-pre-wrap break-words">
                      {msg.content}
                    </p>

                    {/* Attachments (e.g. PPT presentation cards) */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-2.5 space-y-2">
                        {msg.attachments.map((att, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 to-transparent flex items-center justify-between max-w-md group/att"
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <div className="h-8 w-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
                                <FileText className="w-4 h-4 text-cyan-400" />
                              </div>
                              <div className="truncate">
                                <p className="text-xs font-semibold text-white truncate">{att.name}</p>
                                <p className="text-[10px] font-mono text-cyan-300">{att.size} · {att.type}</p>
                              </div>
                            </div>
                            <Link
                              href="/resources"
                              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-cyan-400/20 text-cyan-300 hover:bg-cyan-400/30 transition-colors flex items-center gap-1 shrink-0"
                            >
                              <Download className="w-3 h-3" /> File library
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                    {replyCount > 0 && (
                      <button
                        onClick={(e) => openThread(msg, e.currentTarget)}
                        aria-label={`Open thread with ${replyCount} ${replyCount === 1 ? 'reply' : 'replies'} to ${msg.sender.full_name}`}
                        className="mt-2 flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10 focus-visible:outline-2 focus-visible:outline-cyan-400"
                      >
                        <MessagesSquare className="h-3.5 w-3.5" />
                        {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                        <span className="text-slate-500 font-normal">View thread</span>
                      </button>
                    )}

                    {/* Emoji Reactions Pill Bar */}
                    {msg.reactions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {msg.reactions.map((r, idx) => (
                          <button
                            key={idx}
                            onClick={() => addReaction(room.id, msg.id, r.emoji)}
                            className={`px-2 py-0.5 rounded-lg text-xs font-mono border transition-all flex items-center gap-1 ${
                              user && r.users.includes(user.id)
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                            }`}
                          >
                            <span>{r.emoji}</span>
                            <span className="text-[10px]">{r.count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Hover Action Menu */}
                  <div className="opacity-100 md:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity absolute right-2 bottom-2 md:bottom-auto md:-top-2 flex items-center gap-1 p-1 rounded-xl bg-[#0C1222] border border-white/10 shadow-lg">
                    <button
                      onClick={() =>
                        setReactionPickerMsgId(reactionPickerMsgId === msg.id ? null : msg.id)
                      }
                      className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                      title="Add reaction"
                      aria-label={`Add reaction to message by ${msg.sender.full_name}`}
                    >
                      <Smile className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => openThread(msg, e.currentTarget)}
                      className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                      title="Reply in thread"
                      aria-label={`Reply in thread to ${msg.sender.full_name}`}
                      aria-expanded={threadRoot?.id === msg.id}
                      aria-controls="workspace-thread"
                    >
                      <Reply className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setReplyingTo(msg)}
                      className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                      title="Quote in room"
                      aria-label={`Quote message by ${msg.sender.full_name} in room`}
                    >
                      <Quote className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => pinMessage(room.id, msg.id)}
                      className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-cyan-400"
                      title="Pin message"
                      aria-label={`${msg.is_pinned ? 'Unpin' : 'Pin'} message by ${msg.sender.full_name}`}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    {(isCurrentUser || user?.id === team.owner_id) && (
                      <button
                        onClick={() => deleteMessage(room.id, msg.id)}
                        className="p-1 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400"
                        title="Delete message"
                        aria-label={`Delete message by ${msg.sender.full_name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Reaction quick picker floating modal */}
                  {reactionPickerMsgId === msg.id && (
                    <div className="absolute right-4 top-10 z-20 flex items-center gap-1.5 p-2 rounded-2xl bg-[#090E1D] border border-cyan-500/30 shadow-2xl">
                      {COMMON_REACTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          aria-label={`React with ${emoji}`}
                          onClick={() => {
                            addReaction(room.id, msg.id, emoji);
                            setReactionPickerMsgId(null);
                          }}
                          className="hover:scale-125 transition-transform p-1 text-base"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Composer / Input Bar */}
          <div className="p-4 bg-[#090E1D] border-t border-white/10 shrink-0">
            {replyingTo && (
              <div className="flex items-center justify-between pb-2 text-xs text-slate-400 border-b border-white/5 mb-2">
                <span className="flex items-center gap-1.5 truncate">
                  <Reply className="w-3.5 h-3.5 text-cyan-400" />
                  Replying to <span className="text-white font-semibold">{replyingTo.sender.full_name}</span>
                </span>
                <button aria-label="Cancel quoted reply" onClick={() => setReplyingTo(null)} className="text-slate-400 hover:text-white p-0.5">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <form onSubmit={handleSend} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAttachDemoFile()}
                disabled={!canPost}
                className="p-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition-colors"
                title="Add sample file card"
                aria-label="Add sample attachment to room"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                aria-label={`Message ${room?.name || 'room'}`}
                disabled={!canPost}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={`Message #${room?.name || 'general'} (Press Enter to send)...`}
                className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
              />

              <button
                type="submit"
                disabled={!canPost || !messageInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-cyan-400 text-black hover:bg-cyan-300 font-semibold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.4)] disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
            {!canPost && <p className="mt-2 text-xs text-amber-300">Join this squad to send messages and thread replies.</p>}
          </div>
        </main>

        {threadRoot && room && (
          <section
            id="workspace-thread"
            aria-labelledby="workspace-thread-heading"
            onKeyDown={(e) => {
              if (e.key === 'Escape') closeThread();
            }}
            className="absolute inset-0 z-30 flex min-h-0 min-w-0 max-w-full flex-col border-l border-cyan-500/20 bg-[#090E1D] shadow-2xl md:left-auto md:w-[28rem] xl:static xl:w-[380px] xl:shrink-0"
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#0C1327] px-4 py-3">
              <div className="min-w-0">
                <h2 id="workspace-thread-heading" className="flex items-center gap-2 text-sm font-semibold">
                  <MessagesSquare className="h-4 w-4 text-cyan-300" /> Thread
                </h2>
                <p className="mt-1 truncate text-[11px] text-slate-400">#{room.name} · Started by {threadRoot.sender.full_name}</p>
              </div>
              <button
                type="button"
                onClick={closeThread}
                aria-label="Close thread"
                className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-cyan-400"
              ><X className="h-4 w-4" /></button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4">
              <article className="rounded-2xl border border-white/10 bg-white/[0.025] p-3">
                <div className="flex items-center gap-2">
                  <img src={threadRoot.sender.avatar_url} alt="" className="h-7 w-7 shrink-0 rounded-lg object-cover" />
                  <span className="min-w-0 truncate text-xs font-semibold">{threadRoot.sender.full_name}</span>
                  <span className="ml-auto shrink-0 rounded bg-cyan-500/10 px-1.5 py-0.5 text-[9px] text-cyan-300">Original</span>
                </div>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-200">{threadRoot.content}</p>
                <ThreadAttachments attachments={threadRoot.attachments} />
              </article>

              <p aria-live="polite" className="my-4 flex items-center gap-2 text-[11px] font-medium text-slate-400">
                <span className="h-px flex-1 bg-white/10" />
                {threadReplies.length} {threadReplies.length === 1 ? 'reply' : 'replies'}
                <span className="h-px flex-1 bg-white/10" />
              </p>

              {threadReplies.length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/10 p-5 text-center">
                  <MessagesSquare className="mx-auto mb-2 h-6 w-6 text-cyan-400/70" />
                  <p className="text-sm font-medium text-slate-200">Keep the conversation together</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">Add the first reply. Thread replies stay here so the room stays easy to follow.</p>
                </div>
              )}

              <div className="space-y-4">
                {threadReplies.map((reply) => (
                  <article key={reply.id} className="flex min-w-0 items-start gap-2.5">
                    <img src={reply.sender.avatar_url} alt="" className="h-7 w-7 shrink-0 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="truncate text-xs font-semibold">{reply.sender.full_name}</span>
                        <span className="shrink-0 text-[10px] text-slate-500"><MessageTime dateTime={reply.created_at} /></span>
                        {(reply.sender.id === user?.id || team.owner_id === user?.id) && (
                          <button
                            type="button"
                            onClick={() => deleteMessage(room.id, reply.id)}
                            aria-label={`Delete thread reply by ${reply.sender.full_name}`}
                            className="ml-auto shrink-0 rounded p-1 text-slate-500 hover:bg-rose-500/10 hover:text-rose-300"
                          ><Trash2 className="h-3.5 w-3.5" /></button>
                        )}
                      </div>
                      <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-200">{reply.content}</p>
                      <ThreadAttachments attachments={reply.attachments} />
                    </div>
                  </article>
                ))}
              </div>
              <div ref={threadEndRef} />
            </div>

            <div className="shrink-0 border-t border-white/10 p-3">
              <form onSubmit={handleThreadSend} className="flex min-w-0 items-center gap-2">
                <button
                  type="button"
                  disabled={!canPost}
                  onClick={() => handleAttachDemoFile(threadRoot.id)}
                  aria-label="Add sample attachment to thread"
                  title="Add sample file card to thread"
                  className="rounded-xl border border-white/10 p-2.5 text-slate-400 hover:bg-white/5 hover:text-cyan-300 disabled:opacity-40"
                ><Paperclip className="h-4 w-4" /></button>
                <input
                  ref={threadInputRef}
                  type="text"
                  aria-label="Reply to thread"
                  placeholder="Reply to thread…"
                  value={activeThread?.draft || ''}
                  disabled={!canPost}
                  onChange={(e) => setActiveThread((previous) => previous ? { ...previous, draft: e.target.value } : null)}
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none disabled:opacity-40"
                />
                <button
                  type="submit"
                  aria-label="Send thread reply"
                  disabled={!canPost || !activeThread?.draft.trim()}
                  className="rounded-xl bg-cyan-400 p-2.5 text-black hover:bg-cyan-300 disabled:opacity-30"
                ><Send className="h-4 w-4" /></button>
              </form>
              <p className="mt-2 text-[10px] text-slate-500">{canPost ? 'Replies stay in this thread · Saved on this browser' : 'Join this squad to reply.'}</p>
            </div>
          </section>
        )}

        {/* RIGHT PANEL: SQUAD MEMBERS & PINNED RESOURCES */}
        {showMembersDrawer && !threadRoot && (
          <aside className="hidden xl:flex w-64 bg-[#090E1D] border-l border-white/10 flex-col shrink-0">
            <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-[#0C1327]">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="font-heading text-xs font-bold text-white uppercase tracking-wider">
                  Squad Roster ({team.members.length})
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
              {/* Online members */}
              <div>
                <p className="text-[10px] font-mono uppercase text-slate-400 tracking-wider font-semibold px-2 mb-2">
                  Active Squad Members
                </p>
                <div className="space-y-1.5">
                  {team.members.map((m, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <div className="relative shrink-0">
                        <img
                          src={m.user.avatar_url}
                          alt={m.user.full_name}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-white/10"
                        />
                        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-[#090E1D]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-white truncate text-xs">{m.user.full_name}</p>
                          <span className="text-[9px] font-mono px-1 rounded bg-white/5 text-cyan-300">
                            {m.role}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">{m.user.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subgroup Pinned Quick Links */}
              <div className="pt-3 border-t border-white/10">
                <p className="text-[10px] font-mono uppercase text-slate-400 tracking-wider font-semibold px-2 mb-2">
                  Pinned Presentation
                </p>
                <div className="p-3 rounded-xl border border-cyan-500/30 bg-white/[0.02]">
                  <p className="font-semibold text-white text-xs">Hackathon Pitch Deck v3</p>
                  <p className="text-[10px] text-slate-400 mt-1">Uploaded by Elena Rostova for auditorium pitch.</p>
                  <Link
                    href="/resources"
                    className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:underline"
                  >
                    Open in Presentation Library →
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* CREATE SUBGROUP ROOM MODAL */}
      {showNewRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0C1222] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="font-heading text-lg font-bold text-white">Create Subgroup Room</h3>
              <button onClick={() => setShowNewRoomModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoomSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Room Name</label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    placeholder="e.g. ai-evals / design-tokens / ppt-pitch"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/10 bg-black/40 text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Topic / Purpose</label>
                <input
                  type="text"
                  value={newRoomTopic}
                  onChange={(e) => setNewRoomTopic(e.target.value)}
                  placeholder="e.g. Model fine-tuning benchmarks and dataset prep"
                  className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Category</label>
                <select
                  value={newRoomCategory}
                  onChange={(e) => setNewRoomCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#0A1020] text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="general">General Team Coordination</option>
                  <option value="frontend">Frontend & UI/UX Lab</option>
                  <option value="backend">Backend, Systems & APIs</option>
                  <option value="ai_ml">AI/ML & Quantization</option>
                  <option value="ppt_docs">Presentations, Pitch & Docs</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewRoomModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-cyan-400 text-black rounded-xl hover:bg-cyan-300 font-heading"
                >
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

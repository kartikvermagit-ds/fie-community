'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ToastContainer } from '@/components/ui/toast-container';
import { useAuth } from '@/lib/auth-context';
import { useCommunity } from '@/lib/community-context';
import {
  Sparkles,
  Lightbulb,
  Trophy,
  Users,
  MessagesSquare,
  FolderGit2,
  FileText,
  Flame,
  Clock,
  ArrowRight,
  PlusCircle,
  KeyRound,
  CheckCircle2,
  CheckSquare,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    ideas,
    hackathons,
    teams,
    projects,
    files,
    joinWithCode,
    setCurrentTeam,
    setCurrentRoom,
  } = useCommunity();

  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [showCodeModal, setShowCodeModal] = useState(false);

  const activeTeam = teams[0];
  const userProjects = projects.filter((p) => p.team_id === activeTeam?.id);
  const userTasks = projects.flatMap((p) => p.tasks).filter((t) => t.status !== 'done');

  const handleJoinWithCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCodeInput.trim()) return;
    const success = joinWithCode(inviteCodeInput.trim());
    if (success) {
      setShowCodeModal(false);
      setInviteCodeInput('');
      router.push('/workspace');
    }
  };

  const jumpToRoom = (teamId: string, roomId: string) => {
    const t = teams.find((item) => item.id === teamId);
    if (t) {
      setCurrentTeam(t);
      const r = t.rooms.find((item) => item.id === roomId);
      if (r) setCurrentRoom(r);
    }
    router.push('/workspace');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080B10] text-white selection:bg-orange-500/25 selection:text-orange-400 relative">
      <Navbar />
      <ToastContainer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Header & Action bar */}
        <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-gradient-to-r from-[#111722] via-[#0D131F] to-[#080B10] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80'}
              alt={user?.full_name || 'Builder'}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-orange-400/40 shadow-[0_0_20px_rgba(249,115,22,0.2)]"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Welcome back, {user?.full_name?.split(' ')[0] || 'Builder'}! 👋
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-300 border border-orange-500/30">
                  <Sparkles className="w-3 h-3" /> Karma {user?.karma || 100}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {user?.role || 'Software Engineer'} · {user?.college || 'Digital Campus Member'}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/ideas?new=true"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-orange-500 text-black hover:bg-cyan-300 transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              Publish Idea
            </Link>

            <Link
              href="/teams?new=true"
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5 text-orange-400" />
              Create Squad
            </Link>

            <button
              onClick={() => setShowCodeModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-colors flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5 text-purple-400" />
              Join with Code
            </button>
          </div>
        </div>

        {/* Join with Code Modal */}
        {showCodeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <div className="w-full max-w-md bg-[#0D131F] border border-orange-500/30 rounded-2xl p-6 shadow-2xl">
              <h3 className="font-heading text-lg font-bold text-white">Join Squad with Invite Code</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter the secret invitation code shared by the team founder or admin.
              </p>

              <form onSubmit={handleJoinWithCode} className="mt-4 space-y-4">
                <input
                  type="text"
                  value={inviteCodeInput}
                  onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
                  placeholder="e.g. NEXUS-2026-ALPHA"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-black/50 text-white font-mono text-center tracking-wider text-sm focus:outline-none focus:border-orange-400"
                />

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCodeModal(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-orange-500 text-black hover:bg-cyan-300 font-heading"
                  >
                    Enter Squad Workspace
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl border border-white/10 bg-[#0A1020] flex items-center justify-between">
            <div>
              <p className="text-[11px] font-mono uppercase text-slate-400">My Squads</p>
              <p className="font-heading text-2xl font-bold text-white mt-0.5">{teams.length}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-400" />
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-white/10 bg-[#0A1020] flex items-center justify-between">
            <div>
              <p className="text-[11px] font-mono uppercase text-slate-400">Hackathons</p>
              <p className="font-heading text-2xl font-bold text-white mt-0.5">{hackathons.length}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-purple-400" />
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-white/10 bg-[#0A1020] flex items-center justify-between">
            <div>
              <p className="text-[11px] font-mono uppercase text-slate-400">Active Tasks</p>
              <p className="font-heading text-2xl font-bold text-white mt-0.5">{userTasks.length}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-emerald-400" />
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-white/10 bg-[#0A1020] flex items-center justify-between">
            <div>
              <p className="text-[11px] font-mono uppercase text-slate-400">Presentations</p>
              <p className="font-heading text-2xl font-bold text-white mt-0.5">{files.length}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
        </div>

        {/* 2-Column Main Layout: Left: Active Collaboration Rooms & Tasks; Right: Hackathon Deadlines & Ideas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT 2 COLS */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Subgroup Rooms */}
            <div className="rounded-2xl border border-white/10 bg-[#0A1020] p-5">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <MessagesSquare className="w-4 h-4 text-orange-400" />
                  <h2 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
                    {activeTeam ? `${activeTeam.name} Collaboration Rooms` : 'Subgroup Rooms'}
                  </h2>
                </div>
                <Link href="/workspace" className="text-xs text-orange-400 hover:underline font-medium">
                  Enter Workspace →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeTeam?.rooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => jumpToRoom(activeTeam.id, room.id)}
                    className="p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-orange-500/30 text-left transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-orange-400 font-bold">#</span>
                        <span className="text-sm font-semibold text-white group-hover:text-orange-300">
                          {room.name}
                        </span>
                        {room.category === 'ppt_docs' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            PPT & Docs
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{room.topic}</p>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Active Sprint Kanban Tasks */}
            <div className="rounded-2xl border border-white/10 bg-[#0A1020] p-5">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-purple-400" />
                  <h2 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
                    Active Sprint Tasks
                  </h2>
                </div>
                <Link href="/projects" className="text-xs text-purple-400 hover:underline font-medium">
                  Open Kanban Board →
                </Link>
              </div>

              <div className="space-y-2.5">
                {userTasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          task.priority === 'urgent'
                            ? 'bg-rose-500'
                            : task.priority === 'high'
                            ? 'bg-amber-400'
                            : 'bg-orange-500'
                        }`}
                      />
                      <div className="truncate">
                        <p className="text-white font-medium truncate">{task.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Status: <span className="uppercase text-slate-300 font-mono">{task.status}</span> · Due:{' '}
                          {task.due_date || 'No deadline'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {task.assignee && (
                        <img
                          src={task.assignee.avatar_url}
                          alt={task.assignee.full_name}
                          className="w-5 h-5 rounded-full object-cover border border-white/10"
                          title={task.assignee.full_name}
                        />
                      )}
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 font-mono">
                        {task.checklist.filter((c) => c.completed).length}/{task.checklist.length}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT 1 COL */}
          <div className="space-y-6">
            {/* Upcoming Hackathon Countdown */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#0F172A] to-[#0A1020] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-4 h-4 text-amber-400" />
                <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
                  Hackathon Spotlight
                </h3>
              </div>

              {hackathons[0] && (
                <div className="space-y-3">
                  <div className="rounded-xl overflow-hidden border border-white/10 relative h-28">
                    <img
                      src={hackathons[0].banner_url}
                      alt={hackathons[0].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                      <span className="text-xs font-bold text-white">{hackathons[0].title}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Prize Pool:</span>
                      <span className="text-orange-300 font-bold font-mono">{hackathons[0].prize_pool}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Deadline:</span>
                      <span className="text-white font-mono">Nov 2, 2026</span>
                    </div>
                  </div>

                  <Link
                    href="/hackathons"
                    className="w-full py-2 rounded-xl text-xs font-semibold bg-amber-400 text-black hover:bg-amber-300 transition-colors flex items-center justify-center gap-1.5"
                  >
                    View Hackathon Workspace
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Trending Ideas Mini Feed */}
            <div className="rounded-2xl border border-white/10 bg-[#0A1020] p-5">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <h3 className="font-heading text-xs font-bold text-white uppercase tracking-wider">
                    Trending On Campus
                  </h3>
                </div>
                <Link href="/ideas" className="text-[11px] text-orange-400 hover:underline">
                  View all
                </Link>
              </div>

              <div className="space-y-3">
                {ideas.slice(0, 3).map((idea) => (
                  <Link
                    key={idea.id}
                    href="/ideas"
                    className="block p-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] transition-colors group"
                  >
                    <p className="text-xs font-semibold text-white group-hover:text-orange-300 line-clamp-1">
                      {idea.title}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span>{idea.category}</span>
                      <span className="text-orange-400 font-mono">▲ {idea.upvotes_count}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

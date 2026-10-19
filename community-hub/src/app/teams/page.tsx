'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ToastContainer } from '@/components/ui/toast-container';
import { useAuth } from '@/lib/auth-context';
import { useCommunity } from '@/lib/community-context';
import { Team, TeamVisibility, IdeaCategory } from '@/types';
import {
  Users,
  Search,
  PlusCircle,
  Shield,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Copy,
  Clock,
  Sparkles,
  Lock,
  Globe,
  UserCheck,
  X,
  MessagesSquare,
} from 'lucide-react';

function TeamsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialNewModal = searchParams.get('new') === 'true';
  const initialTab = searchParams.get('tab') === 'requests' ? 'requests' : 'all';

  const { user } = useAuth();
  const {
    teams,
    currentTeam,
    setCurrentTeam,
    setCurrentRoom,
    createTeam,
    joinRequests,
    approveJoinRequest,
    rejectJoinRequest,
    sendJoinRequest,
    showToast,
  } = useCommunity();

  const [activeTab, setActiveTab] = useState<'all' | 'my_teams' | 'requests'>(initialTab as any);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(initialNewModal);
  const [showInviteModal, setShowInviteModal] = useState<Team | null>(null);
  const [showJoinRequestModal, setShowJoinRequestModal] = useState<Team | null>(null);
  const [joinRequestMsg, setJoinRequestMsg] = useState('');

  // Create team form states
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IdeaCategory>('AI & Machine Learning');
  const [visibility, setVisibility] = useState<TeamVisibility>('approval_required');
  const [desiredSkills, setDesiredSkills] = useState('Rust, Next.js, PyTorch');
  const [maxMembers, setMaxMembers] = useState(5);

  const filteredTeams = teams.filter((t) => {
    if (activeTab === 'my_teams' && user) {
      const isMember = t.members.some((m) => m.user.id === user.id);
      if (!isMember) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = t.name.toLowerCase().includes(q);
      const matchDesc = t.description.toLowerCase().includes(q);
      const matchSkill = t.desired_skills.some((s) => s.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchSkill) return false;
    }
    return true;
  });

  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    const skills = desiredSkills.split(',').map((s) => s.trim()).filter(Boolean);

    const newSquad = createTeam({
      name: teamName,
      description,
      category,
      visibility,
      desired_skills: skills,
      max_members: Number(maxMembers) || 5,
    });

    setShowCreateModal(false);
    setTeamName('');
    setDescription('');
    router.push('/workspace');
  };

  const handleCopyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast({
      type: 'success',
      title: 'Invite Code Copied!',
      description: `Share "${code}" with friends or hackathon teammates.`,
    });
  };

  const handleSendRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showJoinRequestModal) return;
    sendJoinRequest(showJoinRequestModal.id, joinRequestMsg);
    setShowJoinRequestModal(null);
    setJoinRequestMsg('');
  };

  const enterWorkspace = (team: Team) => {
    setCurrentTeam(team);
    setCurrentRoom(team.rooms[0]);
    router.push('/workspace');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080B10] text-white selection:bg-orange-500/25 selection:text-orange-400 relative">
      <Navbar />
      <ToastContainer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-orange-400 uppercase tracking-wider mb-1">
              <Users className="w-3.5 h-3.5" /> Campus Squads & Subgroups
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Developer Squads & Teams
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Organize into squads with dedicated sub-teams (Frontend, Backend, AI, Pitch & PPT). Form squads for hackathons, startups, or semester projects.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-xl font-heading font-semibold text-xs bg-orange-500 text-white hover:bg-orange-600 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.4)] shrink-0 self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            Create New Squad
          </button>
        </div>

        {/* Tab & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Squads ({teams.length})
            </button>
            <button
              onClick={() => setActiveTab('my_teams')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'my_teams'
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              My Squads
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'requests'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Join Requests
              {joinRequests.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-500 text-white font-mono">
                  {joinRequests.length}
                </span>
              )}
            </button>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter squads or skills..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-white/10 bg-black/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* TAB 1: ALL SQUADS / MY SQUADS */}
        {activeTab !== 'requests' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => {
              const isOwner = user && team.owner_id === user.id;
              const isMember = user && team.members.some((m) => m.user.id === user.id);

              return (
                <div
                  key={team.id}
                  className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between group hover:border-orange-500/40"
                >
                  <div>
                    {/* Top row: Icon, Category & Visibility */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={team.icon_url}
                          alt={team.name}
                          className="w-11 h-11 rounded-xl object-cover ring-2 ring-white/10"
                        />
                        <div>
                          <h3 className="font-heading text-lg font-bold text-white group-hover:text-orange-300 transition-colors">
                            {team.name}
                          </h3>
                          <span className="text-[10px] font-mono text-orange-400">{team.category}</span>
                        </div>
                      </div>

                      <span
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full border shrink-0 flex items-center gap-1"
                        style={{
                          borderColor:
                            team.visibility === 'public'
                              ? 'rgba(16, 185, 129, 0.4)'
                              : team.visibility === 'approval_required'
                              ? 'rgba(245, 158, 11, 0.4)'
                              : 'rgba(139, 92, 246, 0.4)',
                          color:
                            team.visibility === 'public'
                              ? '#34D399'
                              : team.visibility === 'approval_required'
                              ? '#FBBF24'
                              : '#C084FC',
                        }}
                      >
                        {team.visibility === 'public' && <Globe className="w-3 h-3" />}
                        {team.visibility === 'approval_required' && <Lock className="w-3 h-3" />}
                        {team.visibility === 'invite_only' && <Shield className="w-3 h-3" />}
                        {team.visibility.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{team.description}</p>

                    {/* Subgroups count */}
                    <div className="mt-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <MessagesSquare className="w-3.5 h-3.5 text-orange-400" />
                        <span>Subgroup Rooms:</span>
                      </div>
                      <span className="font-mono text-white font-semibold">{team.rooms.length} active</span>
                    </div>

                    {/* Desired Skills */}
                    <div className="mt-3">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-1">
                        Stack & Roles:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {team.desired_skills.map((s) => (
                          <span
                            key={s}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Member Avatars */}
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                      <div className="flex -space-x-2 overflow-hidden">
                        {team.members.map((m, idx) => (
                          <img
                            key={idx}
                            src={m.user.avatar_url}
                            alt={m.user.full_name}
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-[#070B14] object-cover"
                            title={`${m.user.full_name} (${m.role})`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {team.members.length}/{team.max_members} Members
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between gap-2">
                    {isMember ? (
                      <button
                        onClick={() => enterWorkspace(team)}
                        className="w-full py-2 rounded-xl text-xs font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors flex items-center justify-center gap-1.5 font-heading shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                      >
                        <MessagesSquare className="w-3.5 h-3.5" />
                        Enter Squad Workspace
                      </button>
                    ) : team.visibility === 'public' ? (
                      <button
                        onClick={() => enterWorkspace(team)}
                        className="w-full py-2 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
                      >
                        Join Public Squad
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowJoinRequestModal(team)}
                        className="w-full py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition-colors flex items-center justify-center gap-1"
                      >
                        Request to Join
                      </button>
                    )}

                    {isMember && (
                      <button
                        onClick={() => setShowInviteModal(team)}
                        className="p-2 rounded-xl border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                        title="Get invite code"
                      >
                        <KeyRound className="w-4 h-4 text-purple-400" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: JOIN REQUESTS REVIEW FOR SQUAD OWNERS */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-purple-400" />
              Incoming Applications & Join Requests
            </h3>

            {joinRequests.length === 0 ? (
              <div className="p-10 rounded-2xl border border-white/10 bg-[#0A1020] text-center">
                <p className="text-xs text-slate-400">No pending join requests at this moment.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {joinRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl border border-white/10 bg-[#0D131F] flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={req.user.avatar_url}
                        alt={req.user.full_name}
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-purple-500/30"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-white">{req.user.full_name}</span>
                          <span className="text-[10px] font-mono text-orange-300 px-2 py-0.5 rounded bg-orange-500/10">
                            {req.user.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{req.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-mono">
                          Applying to squad: <span className="text-white font-semibold">{req.team_name}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => rejectJoinRequest(req.id)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => approveJoinRequest(req.id)}
                        className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-orange-500 text-white hover:bg-orange-600 font-heading transition-colors"
                      >
                        Accept Member
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* INVITE CODE MODAL */}
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-md bg-[#0D131F] border border-orange-500/30 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <h3 className="font-heading text-lg font-bold text-white">Invite to {showInviteModal.name}</h3>
                <button onClick={() => setShowInviteModal(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-300 mb-4">
                Share this unique invite code or link with your teammates. Anyone with this code can enter your squad workspace immediately.
              </p>

              <div className="p-4 rounded-xl border border-orange-500/30 bg-black/50 text-center space-y-2 mb-4">
                <p className="text-[10px] font-mono uppercase text-slate-400">Secret Invite Code</p>
                <p className="font-mono text-xl font-extrabold text-orange-400 tracking-wider">
                  {showInviteModal.invite_code}
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowInviteModal(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Close
                </button>
                <button
                  onClick={() => handleCopyInviteCode(showInviteModal.invite_code)}
                  className="px-5 py-2 text-xs font-semibold bg-cyan-400 text-black rounded-xl hover:bg-cyan-300 flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy Code
                </button>
              </div>
            </div>
          </div>
        )}

        {/* REQUEST TO JOIN MODAL */}
        {showJoinRequestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-md bg-[#0D131F] border border-orange-500/30 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <h3 className="font-heading text-lg font-bold text-white">
                  Request to Join {showJoinRequestModal.name}
                </h3>
                <button onClick={() => setShowJoinRequestModal(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSendRequestSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Introduction & What you can contribute
                  </label>
                  <textarea
                    rows={4}
                    value={joinRequestMsg}
                    onChange={(e) => setJoinRequestMsg(e.target.value)}
                    placeholder="Hi! I have extensive experience in Rust and WebSockets. I'd love to help tackle the backend telemetry..."
                    required
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-orange-400"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowJoinRequestModal(null)}
                    className="px-4 py-2 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold bg-cyan-400 text-black rounded-xl hover:bg-cyan-300 font-heading"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CREATE SQUAD MODAL */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="w-full max-w-xl bg-[#0D131F] border border-orange-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-5">
                <h2 className="font-heading text-2xl font-bold text-white">Create a New Squad</h2>
                <p className="text-xs text-slate-400 mt-1">
                  You become the owner and can invite members, configure subgroup rooms, and manage permissions.
                </p>
              </div>

              <form onSubmit={handleCreateTeamSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Squad Name</label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. Nexus Core / Quantum Labs"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-orange-400"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What is this squad building together?"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-orange-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as IdeaCategory)}
                      className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#0A1020] text-white focus:outline-none focus:border-orange-400"
                    >
                      <option value="AI & Machine Learning">AI & Machine Learning</option>
                      <option value="Web3 & Blockchain">Web3 & Blockchain</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Open Source & DevTools">Open Source & DevTools</option>
                      <option value="Cloud & DevOps">Cloud & DevOps</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Visibility & Joining</label>
                    <select
                      value={visibility}
                      onChange={(e) => setVisibility(e.target.value as TeamVisibility)}
                      className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#0A1020] text-white focus:outline-none focus:border-orange-400"
                    >
                      <option value="approval_required">Approval Required</option>
                      <option value="public">Open & Public</option>
                      <option value="invite_only">Invite Only</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Desired Skills</label>
                    <input
                      type="text"
                      value={desiredSkills}
                      onChange={(e) => setDesiredSkills(e.target.value)}
                      placeholder="e.g. Next.js, Rust, Figma"
                      className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Max Squad Members</label>
                    <input
                      type="number"
                      min={2}
                      max={12}
                      value={maxMembers}
                      onChange={(e) => setMaxMembers(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-orange-400"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl font-heading font-semibold text-xs bg-orange-500 text-white hover:bg-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                  >
                    Create Squad & Workspace
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function TeamsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080B10]" />}>
      <TeamsContent />
    </Suspense>
  );
}

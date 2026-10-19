'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ToastContainer } from '@/components/ui/toast-container';
import { useAuth } from '@/lib/auth-context';
import { useCommunity } from '@/lib/community-context';
import { UserProfile } from '@/types';
import {
  Users,
  Search,
  School,
  Globe,
  Sparkles,
  CheckCircle2,
  Mail,
  ShieldAlert,
  X,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';
import { GithubIcon } from '@/components/ui/icons';

export default function MembersPage() {
  const { user, availableDemoUsers } = useAuth();
  const { teams, submitReport, showToast } = useCommunity();

  const [searchQuery, setSearchQuery] = useState('');
  const [onlyOpenCollab, setOnlyOpenCollab] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [showInviteModal, setShowInviteModal] = useState<UserProfile | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id || '');
  const [showReportModal, setShowReportModal] = useState<UserProfile | null>(null);
  const [reportReason, setReportReason] = useState('Inappropriate conduct or spam');

  const filteredMembers = availableDemoUsers.filter((member) => {
    if (onlyOpenCollab && !member.is_open_to_collaborate) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = member.full_name.toLowerCase().includes(q);
      const matchRole = member.role.toLowerCase().includes(q);
      const matchCollege = member.college?.toLowerCase().includes(q) || false;
      const matchSkill = member.skills.some((s) => s.toLowerCase().includes(q));
      if (!matchName && !matchRole && !matchCollege && !matchSkill) return false;
    }
    return true;
  });

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showInviteModal) return;
    const targetTeam = teams.find((t) => t.id === selectedTeamId) || teams[0];
    showToast({
      type: 'success',
      title: 'Invitation Sent!',
      description: `Invited ${showInviteModal.full_name} to join ${targetTeam.name}.`,
    });
    setShowInviteModal(null);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showReportModal) return;
    submitReport({
      content_type: 'user',
      content_id: showReportModal.id,
      reason: reportReason,
    });
    setShowReportModal(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070B14] text-white selection:bg-cyan-500/25 selection:text-cyan-300 relative">
      <Navbar />
      <ToastContainer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
              <Users className="w-3.5 h-3.5" /> Digital Campus Directory
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Campus Builders & Hackers
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Search fellow engineers, AI researchers, and designers by specific skillsets (e.g. Rust, WebAssembly, ZK, PyTorch). Invite them directly into your squads.
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, college (Stanford, IIT), or tech stack (Rust, Next.js)..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/10 bg-black/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer self-start sm:self-auto">
            <input
              type="checkbox"
              checked={onlyOpenCollab}
              onChange={(e) => setOnlyOpenCollab(e.target.checked)}
              className="rounded border-white/20 bg-black/50 text-cyan-400 focus:ring-0"
            />
            <span>Show only "Open to Collaborate"</span>
          </label>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between group hover:border-cyan-500/40 relative"
            >
              <div>
                {/* Avatar and Info Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar_url}
                      alt={member.full_name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-cyan-500/30 shrink-0"
                    />
                    <div>
                      <h3
                        onClick={() => setSelectedProfile(member)}
                        className="font-heading text-lg font-bold text-white group-hover:text-cyan-300 transition-colors cursor-pointer"
                      >
                        {member.full_name}
                      </h3>
                      <p className="text-xs text-cyan-400 font-medium">{member.role}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shrink-0">
                    ★ {member.karma}
                  </span>
                </div>

                {member.college && (
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-2 font-mono">
                    <School className="w-3.5 h-3.5 text-slate-500" />
                    {member.college}
                  </p>
                )}

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{member.bio}</p>

                {/* Skills Chips */}
                <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    Core Skills:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: Links & Invite */}
              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {member.github_url && (
                    <a
                      href={member.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                      title="GitHub Profile"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.portfolio_url && (
                    <a
                      href={member.portfolio_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                      title="Portfolio"
                    >
                      <Globe className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => setShowReportModal(member)}
                    className="p-1.5 rounded-lg border border-white/10 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Report profile"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => setShowInviteModal(member)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-cyan-400 text-black hover:bg-cyan-300 font-heading transition-all flex items-center gap-1 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Invite to Squad
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* MEMBER PROFILE DETAIL MODAL */}
        {selectedProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-lg bg-[#0C1222] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              <button
                onClick={() => setSelectedProfile(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-4">
                <img
                  src={selectedProfile.avatar_url}
                  alt={selectedProfile.full_name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-400/40"
                />
                <div>
                  <h3 className="font-heading text-xl font-bold text-white">
                    {selectedProfile.full_name}
                  </h3>
                  <p className="text-xs text-cyan-400">{selectedProfile.headline || selectedProfile.role}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {selectedProfile.college} · Member since 2026
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-mono uppercase text-slate-400 font-bold text-[10px] mb-1">About</h4>
                  <p className="text-slate-300 leading-relaxed">{selectedProfile.bio}</p>
                </div>

                <div>
                  <h4 className="font-mono uppercase text-slate-400 font-bold text-[10px] mb-1">Skills & Tools</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProfile.skills.map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-mono uppercase text-slate-400 font-bold text-[10px] mb-1">Interests</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProfile.interests.map((int) => (
                      <span key={int} className="px-2 py-0.5 rounded bg-white/5 text-slate-300 font-mono">
                        {int}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-2 border-t border-white/10">
                  <button
                    onClick={() => {
                      const p = selectedProfile;
                      setSelectedProfile(null);
                      setShowInviteModal(p);
                    }}
                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-cyan-400 text-black hover:bg-cyan-300 font-heading"
                  >
                    Invite to Squad
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* INVITE TO SQUAD MODAL */}
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-md bg-[#0C1222] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <h3 className="font-heading text-lg font-bold text-white">Invite to Squad</h3>
                <button onClick={() => setShowInviteModal(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-300 mb-4">
                Send an official invitation to <span className="text-cyan-300 font-semibold">{showInviteModal.full_name}</span>.
              </p>

              <form onSubmit={handleSendInvite} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Select Squad</label>
                  <select
                    value={selectedTeamId}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#0A1020] text-white focus:outline-none focus:border-cyan-400"
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.rooms.length} subgroup rooms)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(null)}
                    className="px-4 py-2 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold bg-cyan-400 text-black rounded-xl hover:bg-cyan-300 font-heading"
                  >
                    Dispatch Invitation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* REPORT ABUSE MODAL */}
        {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-md bg-[#0C1222] border border-rose-500/30 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <h3 className="font-heading text-lg font-bold text-white">Report Content or User</h3>
                <button onClick={() => setShowReportModal(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Reason for Report</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#0A1020] text-white focus:outline-none focus:border-rose-400"
                  >
                    <option value="Inappropriate conduct or spam">Inappropriate conduct or spam</option>
                    <option value="Plagiarized code or ideas">Plagiarized code or ideas</option>
                    <option value="Harassment or abuse">Harassment or abuse</option>
                    <option value="Malicious links or phishing">Malicious links or phishing</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(null)}
                    className="px-4 py-2 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold bg-rose-500 text-white rounded-xl hover:bg-rose-400 font-heading"
                  >
                    Submit Report
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

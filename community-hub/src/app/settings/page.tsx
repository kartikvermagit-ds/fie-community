'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ToastContainer } from '@/components/ui/toast-container';
import { useAuth } from '@/lib/auth-context';
import { useCommunity } from '@/lib/community-context';
import {
  User,
  Settings as SettingsIcon,
  Shield,
  Bell,
  Code2,
  Globe,
  Save,
  CheckCircle2,
} from 'lucide-react';

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useCommunity();

  const [fullName, setFullName] = useState(user?.full_name || 'Alex Chen');
  const [role, setRole] = useState(user?.role || 'AI Systems Engineer');
  const [college, setCollege] = useState(user?.college || 'Stanford / IIT Madras');
  const [bio, setBio] = useState(user?.bio || '');
  const [githubUrl, setGithubUrl] = useState(user?.github_url || '');
  const [portfolioUrl, setPortfolioUrl] = useState(user?.portfolio_url || '');
  const [skills, setSkills] = useState(user?.skills.join(', ') || 'Rust, Next.js, PyTorch');
  const [isOpenToCollab, setIsOpenToCollab] = useState(user?.is_open_to_collaborate ?? true);

  // Preference switches
  const [notifyMentions, setNotifyMentions] = useState(true);
  const [notifyInvites, setNotifyInvites] = useState(true);
  const [notifyTasks, setNotifyTasks] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);

    updateProfile({
      full_name: fullName,
      role,
      college,
      bio,
      github_url: githubUrl,
      portfolio_url: portfolioUrl,
      skills: skillsArray,
      is_open_to_collaborate: isOpenToCollab,
    });

    showToast({
      type: 'success',
      title: 'Profile Saved',
      description: 'Your campus identity and preferences have been updated.',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070B14] text-white selection:bg-cyan-500/25 selection:text-cyan-300 relative">
      <Navbar />
      <ToastContainer />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="pb-6 border-b border-white/10">
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-cyan-400" />
            Profile & Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your campus passport, skills tags, privacy, and notifications.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar & Basic Info */}
          <div className="p-6 rounded-3xl border border-white/10 bg-[#0C1222] space-y-4">
            <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              Public Passport & Bio
            </h3>

            <div className="flex items-center gap-4">
              <img
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80'}
                alt={user?.full_name || 'User'}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-400/30"
              />
              <div className="space-y-1">
                <p className="font-semibold text-sm text-white">{user?.full_name}</p>
                <p className="text-xs font-mono text-cyan-400">@{user?.username || 'builder'}</p>
                <p className="text-[10px] text-slate-400 font-mono">Karma: {user?.karma || 100}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Display Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Primary Role / Specialization</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-medium text-slate-300 mb-1">University / Organization</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="text-xs">
              <label className="block font-medium text-slate-300 mb-1">Bio / Research Interests</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="text-xs">
              <label className="block font-medium text-slate-300 mb-1">Skills (comma separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">GitHub Profile URL</label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Portfolio / Website URL</label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOpenToCollab}
                  onChange={(e) => setIsOpenToCollab(e.target.checked)}
                  className="rounded border-white/20 bg-black/50 text-cyan-400"
                />
                <span className="font-semibold text-white">Open to collaborate with squads & hackathons</span>
              </label>
            </div>
          </div>

          {/* Notifications Preferences */}
          <div className="p-6 rounded-3xl border border-white/10 bg-[#0C1222] space-y-4">
            <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-400" />
              Notifications & Alerts
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer">
                <div>
                  <p className="font-semibold text-white">Subgroup Room Mentions</p>
                  <p className="text-[11px] text-slate-400">Receive alert when teammates tag you in rooms</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyMentions}
                  onChange={(e) => setNotifyMentions(e.target.checked)}
                  className="rounded border-white/20 bg-black/50 text-cyan-400"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer">
                <div>
                  <p className="font-semibold text-white">Squad Join Requests</p>
                  <p className="text-[11px] text-slate-400">Alerts when someone requests to join your squad</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyInvites}
                  onChange={(e) => setNotifyInvites(e.target.checked)}
                  className="rounded border-white/20 bg-black/50 text-cyan-400"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer">
                <div>
                  <p className="font-semibold text-white">Sprint Task Assignments</p>
                  <p className="text-[11px] text-slate-400">Alerts when work is assigned to you on the Kanban board</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyTasks}
                  onChange={(e) => setNotifyTasks(e.target.checked)}
                  className="rounded border-white/20 bg-black/50 text-cyan-400"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-heading font-semibold text-xs bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

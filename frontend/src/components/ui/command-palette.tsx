'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCommunity } from '@/lib/community-context';
import { useAuth } from '@/lib/auth-context';
import {
  Search,
  Lightbulb,
  Trophy,
  Users,
  LayoutDashboard,
  FolderGit2,
  MessagesSquare,
  FileText,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export function CommandPalette() {
  const router = useRouter();
  const { isCommandPaletteOpen, setIsCommandPaletteOpen, ideas, hackathons, teams } = useCommunity();
  const { switchDemoUser, availableDemoUsers } = useAuth();
  const [query, setQuery] = useState('');

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  const navItems = [
    { name: 'Community Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Idea Wall & Collab', path: '/ideas', icon: Lightbulb },
    { name: 'Hackathons Hub', path: '/hackathons', icon: Trophy },
    { name: 'Teams & Subgroups Directory', path: '/teams', icon: Users },
    { name: 'Real-time Collaboration Rooms', path: '/workspace', icon: MessagesSquare },
    { name: 'Project Kanban & Milestones', path: '/projects', icon: FolderGit2 },
    { name: 'Presentations & Document Library', path: '/resources', icon: FileText },
    { name: 'Campus Members & Skills Search', path: '/members', icon: UserCheck },
    { name: 'Moderator & Safety Desk', path: '/admin', icon: ShieldAlert },
  ];

  const filteredNav = useMemo(() => {
    if (!query) return navItems;
    return navItems.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  const filteredIdeas = useMemo(() => {
    if (!query) return ideas.slice(0, 3);
    return ideas
      .filter((i) => i.title.toLowerCase().includes(query.toLowerCase()) || i.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())))
      .slice(0, 3);
  }, [ideas, query]);

  const filteredHackathons = useMemo(() => {
    if (!query) return hackathons.slice(0, 2);
    return hackathons
      .filter((h) => h.title.toLowerCase().includes(query.toLowerCase()) || h.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())))
      .slice(0, 2);
  }, [hackathons, query]);

  if (!isCommandPaletteOpen) return null;

  const navigate = (path: string) => {
    setIsCommandPaletteOpen(false);
    setQuery('');
    router.push(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-md animate-in fade-in-0 duration-200">
      <div
        className="w-full max-w-2xl bg-[#0D131F] border border-orange-500/30 rounded-2xl shadow-[0_0_50px_-10px_rgba(249,115,22,0.25)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-[#111722]">
          <Search className="w-5 h-5 text-orange-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, ideas, hackathons, squads, or commands..."
            className="w-full bg-transparent border-none outline-none text-white placeholder-slate-400 text-sm md:text-base font-medium"
            autoFocus
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-mono text-slate-400 bg-white/5 border border-white/10 rounded">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4 text-xs">
          {/* Navigation group */}
          <div>
            <p className="px-3 py-1 font-mono uppercase tracking-wider text-[10px] text-orange-400 font-semibold">
              Navigation
            </p>
            <div className="mt-1 space-y-0.5">
              {filteredNav.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/5 transition-colors group text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-slate-400 group-hover:text-orange-400 transition-colors" />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ideas group */}
          {filteredIdeas.length > 0 && (
            <div>
              <p className="px-3 py-1 font-mono uppercase tracking-wider text-[10px] text-purple-400 font-semibold">
                Ideas & Projects
              </p>
              <div className="mt-1 space-y-0.5">
                {filteredIdeas.map((idea) => (
                  <button
                    key={idea.id}
                    onClick={() => navigate('/ideas')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/5 transition-colors group text-left"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                      <div className="truncate">
                        <span className="text-sm block truncate">{idea.title}</span>
                        <span className="text-[11px] text-slate-400 truncate block">
                          {idea.category} · {idea.upvotes_count} upvotes
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 shrink-0">
                      View Idea
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Hackathons group */}
          {filteredHackathons.length > 0 && (
            <div>
              <p className="px-3 py-1 font-mono uppercase tracking-wider text-[10px] text-emerald-400 font-semibold">
                Active Hackathons
              </p>
              <div className="mt-1 space-y-0.5">
                {filteredHackathons.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => navigate('/hackathons')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/5 transition-colors group text-left"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                      <div className="truncate">
                        <span className="text-sm block truncate">{h.title}</span>
                        <span className="text-[11px] text-slate-400 truncate block">
                          Prize {h.prize_pool} · {h.participants_count} builders
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 shrink-0">
                      {h.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Switch Demo Role persona */}
          <div>
            <p className="px-3 py-1 font-mono uppercase tracking-wider text-[10px] text-orange-400 font-semibold">
              Switch Persona (Simulate Permissions & Roles)
            </p>
            <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {availableDemoUsers.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => {
                    switchDemoUser(persona.id);
                    setIsCommandPaletteOpen(false);
                  }}
                  className="flex items-center gap-2.5 p-2 rounded-xl border border-white/5 hover:border-orange-500/30 hover:bg-white/5 transition-all text-left"
                >
                  <img
                    src={persona.avatar_url}
                    alt={persona.full_name}
                    className="w-7 h-7 rounded-full object-cover border border-white/10"
                  />
                  <div className="truncate">
                    <p className="text-xs font-semibold text-white truncate">{persona.full_name}</p>
                    <p className="text-[10px] text-orange-300 truncate">{persona.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/10 bg-[#080B10] text-[11px] text-slate-400">
          <span>Navigate with mouse or keyboard</span>
          <span className="font-mono text-orange-400">FIE COMMUNITY · Since 2026</span>
        </div>
      </div>
    </div>
  );
}

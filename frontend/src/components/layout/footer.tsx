'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, ExternalLink } from 'lucide-react';
import { GithubIcon } from '@/components/ui/icons';
import { BrandLogo } from '@/components/ui/brand-logo';

export function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#050811] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/[0.06]">
          {/* Col 1: Brand & Community Vision */}
          <div className="space-y-3 md:col-span-1">
            <BrandLogo variant="compact" size="sm" showSubtitle={false} withGlow={true} />
            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              Connect. Collaborate. Create. — Where Ideas Find Their Team. Join developers, innovators, and creators building something extraordinary together.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-mono text-emerald-400">All Systems Operational · 99.99%</span>
            </div>
          </div>

          {/* Col 2: Community Hubs */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white font-mono">Platform</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/dashboard" className="hover:text-orange-400 transition-colors">
                  Personalized Feed
                </Link>
              </li>
              <li>
                <Link href="/ideas" className="hover:text-orange-400 transition-colors">
                  Idea Wall & Discussions
                </Link>
              </li>
              <li>
                <Link href="/hackathons" className="hover:text-orange-400 transition-colors">
                  Hackathon Discovery
                </Link>
              </li>
              <li>
                <Link href="/teams" className="hover:text-orange-400 transition-colors">
                  Team Formation & Squads
                </Link>
              </li>
              <li>
                <Link href="/workspace" className="hover:text-orange-400 transition-colors">
                  Real-time Subgroup Rooms
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Collaboration Tools */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white font-mono">Workspaces</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/projects" className="hover:text-orange-400 transition-colors">
                  Kanban Boards & Sprints
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-orange-400 transition-colors">
                  Presentations & PPT Library
                </Link>
              </li>
              <li>
                <Link href="/members" className="hover:text-orange-400 transition-colors">
                  Member Directory & Skills
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-orange-400 transition-colors">
                  Community Safety & Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Tech & Security */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white font-mono">Architecture</h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl border border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-1.5 text-orange-300 font-mono text-[11px] mb-1">
                  <Shield className="w-3.5 h-3.5 text-orange-400" />
                  PostgreSQL Row-Level Security
                </div>
                <p className="text-[10px] text-slate-500">
                  Private team rooms, messages, and files are protected server-side with granular RLS authorization.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <a
                  href="https://github.com/kartikvermagit-ds/fie-community"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  <GithubIcon className="w-4 h-4 text-orange-400" />
                  GitHub Repository
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 FIE COMMUNITY. All rights reserved. Where Ideas Find Their Team.</p>
          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500">
            <span>Next.js 16 App Router</span>
            <span>·</span>
            <span>Supabase Cloud</span>
            <span>·</span>
            <span>Tailwind 4</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

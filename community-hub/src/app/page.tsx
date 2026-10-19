'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ToastContainer } from '@/components/ui/toast-container';
import { useCommunity } from '@/lib/community-context';
import { MOCK_USERS, MOCK_PROJECTS } from '@/lib/mock-data';
import { BrandLogo } from '@/components/ui/brand-logo';
import {
  Sparkles,
  ArrowRight,
  Terminal,
  Trophy,
  Users,
  Lightbulb,
  FolderGit2,
  MessagesSquare,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Flame,
  FileText,
  Star,
  Layers,
  Code2,
  Share2,
  Compass,
} from 'lucide-react';

export default function LandingPage() {
  const { ideas, hackathons, teams, upvoteIdea } = useCommunity();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'What is FIE COMMUNITY?',
      a: 'FIE COMMUNITY is a premier digital campus and collaborative innovation platform founded in 2026. It unites developers, students, innovators, and creators to share ideas, form competitive hackathon squads, brainstorm in real-time subgroup rooms, track projects on Kanban sprint boards, and share presentation decks.',
    },
    {
      q: 'What is the meaning behind the FIE Community official logo?',
      a: 'The three interconnected figures in warm orange, terracotta, and modern blue symbolize community, collaboration, and teamwork. Joined together in a dynamic circle, they represent how multidisciplinary builders unite to turn sparks of ideas into high-impact products.',
    },
    {
      q: 'How does team formation and subgroup hierarchy work?',
      a: 'Every team can create specialized subgroup channels (for example: #frontend, #backend, #ai-ml, #ppt-pitch). Membership and permissions follow an Organization → Team → Subgroup hierarchy secured by PostgreSQL Row-Level Security, guaranteeing privacy.',
    },
    {
      q: 'Can I upload and preview presentation slide decks (PPT/PPTX)?',
      a: 'Yes! FIE Community features a dedicated Presentation & Resource Library. Teams can upload PPTX, PPT, PDF, and design files with version labels, slide preview fallbacks, and real-time slide discussions.',
    },
    {
      q: 'How do hackathons integrate with project workspaces?',
      a: 'You can discover global and campus hackathons, post "Looking for Teammates" calls with specific skill requirements, and spin up a dedicated team workspace with one click containing milestone tracking, demo video scripts, and presentation checklists.',
    },
    {
      q: 'Can I test FIE Community immediately without setting up Supabase?',
      a: 'Yes! FIE Community features an instant interactive Demo Mode with simulated personas (Alex Chen, Sarah Lin, Marcus Brody, Elena Rostova). When you are ready for production, plug in your Supabase credentials to automatically enable live PostgreSQL persistence and realtime WebSockets.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#080B10] text-[#F8FAFC] selection:bg-orange-500/25 selection:text-orange-400 relative overflow-hidden">
      {/* Background ambient lighting matching official logo (Orange top-left, Blue center-right) */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[36rem] h-[36rem] rounded-full bg-orange-500/[0.08] blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[38rem] h-[38rem] rounded-full bg-blue-600/[0.08] blur-[150px]" />
        <div className="absolute -bottom-40 left-1/3 w-[32rem] h-[32rem] rounded-full bg-amber-600/[0.06] blur-[150px]" />
        <div className="absolute inset-0 cyber-grid opacity-50" />
      </div>

      <Navbar />
      <ToastContainer />

      <main className="relative z-10 flex-1">
        {/* ========================================================================= */}
        {/* HERO SECTION WITH IMMERSIVE OFFICIAL LOGO */}
        {/* ========================================================================= */}
        <section className="pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          {/* Official Brand Badge with Emblem */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-300 text-xs font-medium mb-8 backdrop-blur-md shadow-[0_0_25px_rgba(249,115,22,0.18)] animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="w-5 h-5 relative flex items-center justify-center">
              <Image
                src="/brand/fie-symbol.png"
                alt="FIE Community Emblem"
                width={20}
                height={20}
                className="object-contain"
                priority
              />
            </div>
            <span className="font-semibold tracking-wide">FIE COMMUNITY</span>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-slate-400 font-mono">SINCE 2026</span>
          </div>

          {/* Hero Headline */}
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.08] mb-6">
            <span className="block text-white">Great Ideas.</span>
            <span className="gradient-text drop-shadow-[0_0_35px_rgba(249,115,22,0.25)]">
              Stronger Teams. Endless Possibilities.
            </span>
          </h1>

          {/* Supporting Description */}
          <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed mb-10 font-normal">
            Join a community where developers, students, innovators, and creators share ideas, find teammates, collaborate on projects, and build something extraordinary together.
          </p>

          {/* Primary Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link
              href="/dashboard"
              className="px-7 py-3.5 rounded-xl font-heading font-semibold text-sm bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 text-white shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:shadow-[0_0_40px_rgba(249,115,22,0.6)] hover:-translate-y-0.5 transition-all flex items-center gap-2 group"
            >
              <Compass className="w-4 h-4" />
              Explore Community
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/ideas"
              className="px-7 py-3.5 rounded-xl font-heading font-semibold text-sm border border-white/15 bg-white/[0.04] text-white hover:bg-white/10 hover:border-orange-400/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <Lightbulb className="w-4 h-4 text-orange-400" />
              Share Your Idea
            </Link>

            <Link
              href="/teams"
              className="px-7 py-3.5 rounded-xl font-heading font-semibold text-sm border border-blue-500/40 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-blue-400" />
              Find Your Team
            </Link>
          </div>

          {/* ========================================================================= */}
          {/* IMMERSIVE LOGO SHOWCASE & INTERACTIVE TERMINAL PREVIEW */}
          {/* ========================================================================= */}
          <div className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-[#0D131F]/90 backdrop-blur-xl shadow-2xl overflow-hidden text-left relative">
            {/* Top ambient glow bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-blue-500" />

            <div className="terminal-bar px-4 py-3.5 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full terminal-dot-red" />
                <span className="w-3 h-3 rounded-full terminal-dot-yellow" />
                <span className="w-3 h-3 rounded-full terminal-dot-green" />
                <span className="ml-2 font-mono text-[11px] text-slate-400">
                  fie@community: ~/collaboration-engine/nexus/subgroup/ppt-docs
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
                <span className="font-mono text-[11px] text-orange-400">ENGINE ONLINE · 2026</span>
              </div>
            </div>

            <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Channel navigation list */}
              <div className="space-y-2 border-r border-white/10 pr-4 hidden md:block font-mono text-xs">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <Image
                    src="/brand/fie-symbol.png"
                    alt="Emblem"
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                  <p className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Subgroup Rooms</p>
                </div>
                <div className="space-y-1 pt-1">
                  <div className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:bg-white/5 flex items-center gap-2">
                    <span className="text-slate-500">#</span> general
                  </div>
                  <div className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:bg-white/5 flex items-center gap-2">
                    <span className="text-slate-500">#</span> frontend-lab
                  </div>
                  <div className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:bg-white/5 flex items-center gap-2">
                    <span className="text-slate-500">#</span> backend-systems
                  </div>
                  <div className="px-2.5 py-1.5 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-300 font-semibold flex items-center gap-2">
                    <span className="text-orange-400">#</span> ppt-docs-pitch
                  </div>
                </div>
              </div>

              {/* Chat & Collaboration snippet */}
              <div className="md:col-span-2 space-y-3 font-mono text-xs">
                <div className="p-3.5 rounded-2xl border border-white/5 bg-white/[0.02]">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="font-bold text-orange-400">Alex Chen (Team Lead)</span>
                    </div>
                    <span className="text-[10px]">Today at 10:24 AM</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed font-sans text-xs">
                    Welcome to FIE Community! Pitch deck slides 1-8 are uploaded. Elena finished the WebAssembly topology diagram! Check the presentation card below:
                  </p>
                  <div className="mt-2.5 p-3 rounded-xl bg-black/40 border border-orange-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-orange-400" />
                      <span className="text-white font-semibold text-xs">Nexus_Pitch_Deck_v3.pptx</span>
                    </div>
                    <span className="text-[10px] text-orange-300 font-mono bg-orange-500/15 px-2 py-0.5 rounded">
                      5.8 MB · Slide Review
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400 text-[11px] px-1">
                  <span className="text-emerald-400">✔ Kanban Sprint Updated:</span>
                  <span className="text-white">"Complete Hackathon 3-minute pitch deck" → Moved to Review</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* METRICS STRIP */}
        {/* ========================================================================= */}
        <section className="border-y border-white/[0.08] bg-[#050811]/70 backdrop-blur-md py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="font-heading text-3xl sm:text-4xl font-extrabold text-orange-400">2,400+</p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">Active Builders</p>
            </div>
            <div>
              <p className="font-heading text-3xl sm:text-4xl font-extrabold text-blue-400">180+</p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">Hackathon Squads</p>
            </div>
            <div>
              <p className="font-heading text-3xl sm:text-4xl font-extrabold text-amber-400">$340K+</p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">Prize Pools Tracked</p>
            </div>
            <div>
              <p className="font-heading text-3xl sm:text-4xl font-extrabold text-emerald-400">1,250+</p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">Presentations & Resources</p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 1: IDEAS HUB */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-orange-400 uppercase tracking-wider mb-2">
                <Lightbulb className="w-3.5 h-3.5" /> Ideas Hub
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Trending Inventions & Sparks
              </h2>
              <p className="text-sm text-slate-400 mt-2 max-w-xl">
                Browse cutting-edge projects looking for co-founders, engineers, and designers. Upvote the best ideas or spin up a squad.
              </p>
            </div>
            <Link
              href="/ideas"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300 font-heading shrink-0"
            >
              Browse All Ideas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ideas.slice(0, 4).map((idea) => (
              <div
                key={idea.id}
                className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-white/10 group hover:border-orange-500/40"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/20">
                      {idea.category}
                    </span>
                    <button
                      onClick={() => upvoteIdea(idea.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                        idea.is_upvoted
                          ? 'bg-orange-500/20 border border-orange-400/40 text-orange-300'
                          : 'border border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5 text-orange-400" />
                      <span>{idea.upvotes_count}</span>
                    </button>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-white group-hover:text-orange-300 transition-colors">
                    {idea.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed line-clamp-3">
                    {idea.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {idea.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={idea.author.avatar_url}
                      alt={idea.author.full_name}
                      className="w-6 h-6 rounded-full object-cover border border-white/10"
                    />
                    <span className="text-slate-300 font-medium">{idea.author.full_name}</span>
                  </div>
                  <Link
                    href={`/ideas?id=${idea.id}`}
                    className="text-orange-400 hover:underline font-semibold flex items-center gap-1"
                  >
                    Details <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: HACKATHON DISCOVERY */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-400 uppercase tracking-wider mb-2">
                <Trophy className="w-3.5 h-3.5" /> Hackathon Discovery
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Compete & Win Together
              </h2>
              <p className="text-sm text-slate-400 mt-2 max-w-xl">
                Discover prestigious global and campus hackathons, find complementary teammates, and build sprint projects.
              </p>
            </div>
            <Link
              href="/hackathons"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 font-heading shrink-0"
            >
              Explore All Hackathons <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hackathons.map((h) => (
              <div
                key={h.id}
                className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between group"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={h.banner_url}
                    alt={h.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D131F] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 text-[10px] font-mono px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-orange-300 border border-white/10">
                    Prize: {h.prize_pool}
                  </span>
                  <span className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                    {h.status}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[11px] font-mono text-slate-400">{h.organizer}</p>
                    <h3 className="font-heading text-lg font-bold text-white mt-1 group-hover:text-blue-300 transition-colors">
                      {h.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {h.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">
                      👥 {h.participants_count} Registered
                    </span>
                    <Link
                      href="/hackathons"
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition-all"
                    >
                      Join / Form Team
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3 & 4: TEAM FORMATION & PRIVATE COLLABORATION ROOMS */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-orange-400 uppercase tracking-wider mb-2">
                <Users className="w-3.5 h-3.5" /> Team Formation & Squads
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Where Ideas Find Their Team
              </h2>
              <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                Connect with engineers, designers, researchers, and creators. FIE Community enables fast matchmaking by required skills, roles, and time commitment.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-white/5 bg-white/[0.02]">
                  <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 shrink-0">
                    <MessagesSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Private Subgroup Rooms</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Nested channels (#frontend, #backend, #ai-ml, #ppt-pitch) protected by PostgreSQL Row-Level Security.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-white/5 bg-white/[0.02]">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                    <FolderGit2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Integrated Sprints & Kanban</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Assign tasks, review pull requests, and track hackathon milestones with live checklists.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <Link
                  href="/teams"
                  className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-heading font-semibold text-xs transition-colors flex items-center gap-2"
                >
                  Explore Squads <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/workspace"
                  className="px-6 py-3 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 text-white font-heading font-semibold text-xs transition-colors"
                >
                  Open Team Rooms
                </Link>
              </div>
            </div>

            {/* Squads Showcase Cards */}
            <div className="space-y-4">
              {teams.slice(0, 2).map((t) => (
                <div key={t.id} className="p-5 rounded-2xl border border-white/10 bg-[#0D131F] hover:border-orange-500/30 transition-all">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img src={t.icon_url} alt={t.name} className="w-10 h-10 rounded-xl object-cover border border-white/10" />
                      <div>
                        <h4 className="text-sm font-bold text-white">{t.name}</h4>
                        <p className="text-[11px] font-mono text-orange-400">{t.category} · {t.members.length} Members</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Recruiting
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">{t.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {t.desired_skills.map((skill) => (
                      <span key={skill} className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                        Seeking: {skill}
                      </span>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">Leader: @{t.owner.username}</span>
                    <Link href="/teams" className="text-orange-400 font-semibold hover:underline">
                      Apply to Squad →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5 & 6: PROJECT WORKSPACES & PPT RESOURCE SHARING */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
              <FileText className="w-3.5 h-3.5" /> Workspaces & Resource Sharing
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
              From First Slide to Final Demo
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3">
              Store pitch decks, design artifacts, slide presentations, and technical documentation with complete versioning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-white/10 bg-[#0D131F] hover:border-orange-500/30 transition-all">
              <div className="h-10 w-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white">Presentation & PPT Library</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Dedicated slide and document vault. Upload PPT, PPTX, PDF, and code with slide discussion threads, version tags, and secure Supabase Storage policies.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-[#0D131F] hover:border-blue-500/30 transition-all">
              <div className="h-10 w-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mb-4">
                <FolderGit2 className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white">Kanban Sprint Boards</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Streamline hackathon execution with Backlog, To Do, In Progress, Review, and Done. Interactive task assignees, priority indicators, subtasks, and progress metrics.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-[#0D131F] hover:border-emerald-500/30 transition-all">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white">PostgreSQL Row-Level Security</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Private channels, confidential pitch decks, and internal task boards are secured server-side via PostgreSQL Row Level Security policies.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 7: COMMUNITY MEMBERS */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
                <Users className="w-3.5 h-3.5" /> Community Members
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Connect with Innovators & Builders
              </h2>
              <p className="text-sm text-slate-400 mt-2 max-w-xl">
                Discover developers, researchers, and creators across global campuses. Filter by specialized skill sets and collaborate.
              </p>
            </div>
            <Link
              href="/members"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 font-heading shrink-0"
            >
              View Member Directory <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_USERS.slice(0, 4).map((member) => (
              <div
                key={member.id}
                className="p-5 rounded-2xl border border-white/10 bg-[#0D131F] hover:border-orange-500/30 transition-all text-center flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-16 h-16 mx-auto mb-3">
                    <img
                      src={member.avatar_url}
                      alt={member.full_name}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-orange-500/30"
                    />
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-[#080B10]" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-white">{member.full_name}</h3>
                  <p className="text-xs text-orange-400 font-mono mt-0.5">{member.role}</p>
                  <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5">
                  <div className="flex flex-wrap justify-center gap-1 mb-3">
                    {member.skills.slice(0, 3).map((sk) => (
                      <span key={sk} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5">
                        {sk}
                      </span>
                    ))}
                  </div>
                  <Link
                    href="/members"
                    className="w-full block py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-orange-500/20 hover:text-orange-300 border border-white/10 transition-colors"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 8: FEATURED PROJECTS */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-orange-400 uppercase tracking-wider mb-2">
                <FolderGit2 className="w-3.5 h-3.5" /> Featured Projects
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Shipped by FIE Community Squads
              </h2>
              <p className="text-sm text-slate-400 mt-2 max-w-xl">
                Explore real projects built and launched by community members during sprints and hackathons.
              </p>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300 font-heading shrink-0"
            >
              Explore All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_PROJECTS.map((proj) => (
              <div
                key={proj.id}
                className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between group"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={proj.banner_url}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D131F] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 text-[10px] font-mono px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-orange-300 border border-white/10">
                    Team: {proj.team_name}
                  </span>
                  <span className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 uppercase">
                    {proj.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-white group-hover:text-orange-300 transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {proj.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {proj.tech_stack.map((tech) => (
                        <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-6 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">
                      Sprint Progress: <span className="text-orange-400 font-semibold">{proj.progress_percent}%</span>
                    </span>
                    <Link
                      href="/projects"
                      className="text-orange-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      Project Board <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FAQ ACCORDION SECTION */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-white/[0.08]">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Everything you need to know about teaming up and building on FIE Community.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/10 bg-[#0D131F]/90 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left text-sm font-semibold text-white hover:text-orange-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-orange-400 transition-transform duration-200 ${
                      activeFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-4 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FINAL CTA BANNER */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="rounded-3xl p-8 sm:p-14 border border-orange-500/30 bg-gradient-to-br from-[#111722] via-[#0D131F] to-[#080B10] shadow-[0_0_50px_-10px_rgba(249,115,22,0.2)] text-center relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-orange-500/10 blur-[90px]" />
            <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-blue-500/10 blur-[90px]" />

            <div className="relative z-10">
              <div className="w-12 h-12 mx-auto mb-4 relative flex items-center justify-center">
                <Image
                  src="/brand/fie-symbol.png"
                  alt="FIE Community Official Emblem"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>

              <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
                Ready to ship your next breakthrough?
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8">
                Join thousands of students, developers, and creators on FIE Community. Share your idea, find your team, and build the future.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/auth/signup"
                  className="px-8 py-3.5 rounded-xl font-heading font-semibold text-sm bg-orange-500 text-white hover:bg-orange-600 shadow-[0_0_25px_rgba(249,115,22,0.4)] transition-all"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/dashboard"
                  className="px-8 py-3.5 rounded-xl font-heading font-semibold text-sm border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-all"
                >
                  Explore Community
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ToastContainer } from '@/components/ui/toast-container';
import { useCommunity } from '@/lib/community-context';
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
  Code2,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Flame,
  Star,
  FileText,
  ExternalLink,
} from 'lucide-react';

export default function LandingPage() {
  const { ideas, hackathons, teams, upvoteIdea } = useCommunity();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'What is BuildSpace?',
      a: 'BuildSpace is an all-in-one digital campus and collaboration engine designed specifically for software engineers, student hackers, and researchers. It integrates idea sharing, hackathon matchmaking, Discord-style nested subgroup rooms (Frontend, Backend, AI/ML, PPT & Docs), Kanban project tracking, and secure presentation libraries.',
    },
    {
      q: 'How does team formation and subgroup hierarchy work?',
      a: 'Every team can create multiple specialized subgroup channels (for instance: #frontend, #backend, #ai-ml, #ppt-pitch). Membership and permissions follow an Organization → Team → Subgroup hierarchy protected by PostgreSQL Row-Level Security, ensuring private discussions and files remain strictly confidential.',
    },
    {
      q: 'Can I upload and preview presentation slide decks (PPT/PPTX)?',
      a: 'Yes! BuildSpace features a dedicated Presentation & Resource Library. Teams can upload PPTX, PPT, PDF, and design files with version labels, slide preview fallbacks, and real-time slide discussions.',
    },
    {
      q: 'How do hackathons integrate with project workspaces?',
      a: 'You can discover global and campus hackathons, post "Looking for Teammates" calls with specific skill requirements, and spin up a dedicated team workspace with one click containing milestone tracking, demo video scripts, and presentation checklists.',
    },
    {
      q: 'Can I test BuildSpace immediately without setting up Supabase?',
      a: 'Yes! BuildSpace features an instant interactive Demo Mode with simulated personas (Alex Chen, Sarah Lin, Marcus Brody, Elena Rostova). When you are ready for production, plug in your Supabase credentials to automatically enable live PostgreSQL persistence and realtime WebSockets.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#070B14] text-white selection:bg-cyan-500/25 selection:text-cyan-300 relative overflow-hidden">
      {/* Background cyber grid & glow orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-cyan-500/10 blur-[130px]" />
        <div className="absolute top-1/3 -right-40 w-[36rem] h-[36rem] rounded-full bg-purple-600/10 blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[30rem] h-[30rem] rounded-full bg-indigo-500/10 blur-[140px]" />
        <div className="absolute inset-0 cyber-grid opacity-60" />
      </div>

      <Navbar />
      <ToastContainer />

      <main className="relative z-10 flex-1">
        {/* HERO SECTION */}
        <section className="pt-20 pb-24 md:pt-28 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-medium mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.15)] animate-in fade-in slide-in-from-bottom-3 duration-500">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>The Premier Digital Campus for Builders</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-slate-400">v1.0 Live</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.1] mb-6">
            <span className="block text-white">Great ideas deserve</span>
            <span className="gradient-text glow-text-cyan">great teams.</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed mb-10 font-normal">
            The collaborative digital campus where developers, student hackers, and creators share ideas, discover hackathons, form squads, chat in real-time rooms, and build the future together.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link
              href="/ideas"
              className="px-7 py-3.5 rounded-xl font-heading font-semibold text-sm bg-gradient-to-r from-cyan-400 via-cyan-500 to-indigo-500 text-black shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_rgba(0,240,255,0.6)] hover:-translate-y-0.5 transition-all flex items-center gap-2 group"
            >
              Explore Ideas
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/teams"
              className="px-7 py-3.5 rounded-xl font-heading font-semibold text-sm border border-white/15 bg-white/[0.04] text-white hover:bg-white/10 hover:border-cyan-400/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-cyan-400" />
              Find Your Team
            </Link>

            <Link
              href="/workspace"
              className="px-7 py-3.5 rounded-xl font-heading font-semibold text-sm border border-purple-500/40 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <Terminal className="w-4 h-4 text-purple-400" />
              Start Building
            </Link>
          </div>

          {/* Hero Interactive Terminal / Mock Preview */}
          <div className="max-w-4xl mx-auto rounded-2xl border border-white/10 bg-[#0A1020]/90 backdrop-blur-xl shadow-2xl overflow-hidden text-left">
            <div className="terminal-bar px-4 py-3 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full terminal-dot-red" />
                <span className="w-3 h-3 rounded-full terminal-dot-yellow" />
                <span className="w-3 h-3 rounded-full terminal-dot-green" />
                <span className="ml-2 font-mono text-[11px] text-slate-400">
                  buildspace@digital-campus: ~/squad-nexus/rooms/ppt-docs
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-mono text-[11px] text-cyan-400">ROOM ONLINE · 4 MEMBERS</span>
              </div>
            </div>

            <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
              {/* Channel list */}
              <div className="space-y-2 border-r border-white/10 pr-4 hidden md:block">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Subgroup Rooms</p>
                <div className="space-y-1">
                  <div className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:bg-white/5 flex items-center gap-2">
                    <span className="text-slate-500">#</span> general
                  </div>
                  <div className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:bg-white/5 flex items-center gap-2">
                    <span className="text-slate-500">#</span> frontend-lab
                  </div>
                  <div className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:bg-white/5 flex items-center gap-2">
                    <span className="text-slate-500">#</span> backend-systems
                  </div>
                  <div className="px-2.5 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-semibold flex items-center gap-2">
                    <span className="text-cyan-400">#</span> ppt-docs-pitch
                  </div>
                </div>
              </div>

              {/* Chat snippet */}
              <div className="md:col-span-2 space-y-3">
                <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02]">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="font-bold text-cyan-400">Alex Chen (Team Lead)</span>
                    <span className="text-[10px]">Today at 10:24 AM</span>
                  </div>
                  <p className="text-slate-200">
                    Pitch deck slides 1-8 are uploaded. Elena finished the WebAssembly topology diagram! Check the presentation card below:
                  </p>
                  <div className="mt-2.5 p-2.5 rounded-lg bg-white/5 border border-cyan-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FolderGit2 className="w-4 h-4 text-cyan-400" />
                      <span className="text-white font-semibold">Nexus_Core_Pitch_Deck_v3.pptx</span>
                    </div>
                    <span className="text-[10px] text-cyan-300 font-mono">5.8 MB · Slide Review</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <span className="text-emerald-400">✔ Kanban Task Updated:</span>
                  <span className="text-white">"Complete Hackathon 3-minute pitch deck" → Moved to Review</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* METRICS STRIP */}
        <section className="border-y border-white/[0.08] bg-[#050914]/60 backdrop-blur-md py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="font-heading text-3xl sm:text-4xl font-extrabold text-cyan-400">2,400+</p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">Active Builders</p>
            </div>
            <div>
              <p className="font-heading text-3xl sm:text-4xl font-extrabold text-purple-400">180+</p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">Hackathon Squads</p>
            </div>
            <div>
              <p className="font-heading text-3xl sm:text-4xl font-extrabold text-emerald-400">$340K+</p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">Prize Pools Tracked</p>
            </div>
            <div>
              <p className="font-heading text-3xl sm:text-4xl font-extrabold text-indigo-400">1,250+</p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">Presentations & Files</p>
            </div>
          </div>
        </section>

        {/* TRENDING IDEAS PREVIEW */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
                <Lightbulb className="w-3.5 h-3.5" /> Idea Wall
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Trending Inventions & Proposals
              </h2>
              <p className="text-sm text-slate-400 mt-2 max-w-xl">
                Browse cutting-edge projects looking for co-founders, engineers, and designers. Upvote the best ideas or spin up a squad.
              </p>
            </div>
            <Link
              href="/ideas"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 font-heading shrink-0"
            >
              Browse All Ideas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ideas.slice(0, 4).map((idea) => (
              <div
                key={idea.id}
                className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-white/10 group hover:border-cyan-500/40"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {idea.category}
                    </span>
                    <button
                      onClick={() => upvoteIdea(idea.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                        idea.is_upvoted
                          ? 'bg-cyan-500/20 border border-cyan-400/40 text-cyan-300'
                          : 'border border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{idea.upvotes_count}</span>
                    </button>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
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
                    className="text-cyan-400 hover:underline font-semibold flex items-center gap-1"
                  >
                    Details <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HACKATHON SHOWCASE */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-purple-400 uppercase tracking-wider mb-2">
                <Trophy className="w-3.5 h-3.5" /> Hackathon Hub
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Compete & Win Together
              </h2>
              <p className="text-sm text-slate-400 mt-2 max-w-xl">
                Find upcoming hackathons, register teams, and build sprint projects with built-in pitch presentation templates.
              </p>
            </div>
            <Link
              href="/hackathons"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 font-heading shrink-0"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090E1D] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 text-[10px] font-mono px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-cyan-300 border border-white/10">
                    Prize: {h.prize_pool}
                  </span>
                  <span className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                    {h.status}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[11px] font-mono text-slate-400">{h.organizer}</p>
                    <h3 className="font-heading text-lg font-bold text-white mt-1 group-hover:text-purple-300 transition-colors">
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
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition-all"
                    >
                      Join / Form Team
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CORE PLATFORM FEATURES MATRIX */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Engineered For Modern Campus Builders
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3">
              No generic Slack clones or messy shared folders. BuildSpace brings all your engineering, presentation, and team tools under one unified dark-mode roof.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center mb-4">
                <MessagesSquare className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white">Subgroup Collaboration Rooms</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Discord-inspired hierarchy: Community → Squad → Subgroup (Frontend, Backend, AI/ML, PPT & Docs). Realtime messaging, code formatting, threaded replies, and emoji reactions.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
              <div className="h-10 w-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center mb-4">
                <FolderGit2 className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white">Kanban Sprint Boards</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Streamline hackathon execution with Backlog, To Do, In Progress, Review, and Done. Interactive task assignees, priority indicators, subtask checklists, and progress metrics.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white">Presentation & PPT Sharing</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Dedicated slide and document vault. Upload PPT, PPTX, PDF, and code with slide discussion threads, version tags, and secure Supabase Storage policies.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white">Squad Matchmaking & Invites</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Search campus members by exact tech stack (e.g. Rust, WebAssembly, ZK-SNARKs). Send secure invite codes or approval-required join requests.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
              <div className="h-10 w-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white">Row Level Security</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Private channels, confidential pitch decks, and internal task boards are secured server-side via PostgreSQL Row Level Security policies.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
              <div className="h-10 w-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white">Interactive Command Palette</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Hit <kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/10 text-cyan-300">⌘K</kbd> to jump between pages, search ideas, launch hackathons, or switch demo personas instantaneously.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION SECTION */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-white/[0.08]">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Everything you need to know about teaming up and building on BuildSpace.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/10 bg-[#0C1222]/80 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left text-sm font-semibold text-white hover:text-cyan-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-cyan-400 transition-transform duration-200 ${
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

        {/* FINAL CTA BANNER */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="rounded-3xl p-8 sm:p-14 border border-cyan-500/30 bg-gradient-to-br from-[#0c1630] via-[#091024] to-[#070b14] shadow-[0_0_50px_-10px_rgba(0,240,255,0.2)] text-center relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-cyan-400/10 blur-[90px]" />
            <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-purple-500/10 blur-[90px]" />

            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Ready to ship your next breakthrough?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8">
              Join thousands of students, developers, and designers on BuildSpace. Share your idea, find your squad, and build the future.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/auth/signup"
                className="px-8 py-3.5 rounded-xl font-heading font-semibold text-sm bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_25px_rgba(0,240,255,0.5)] transition-all"
              >
                Create Free Account
              </Link>
              <Link
                href="/dashboard"
                className="px-8 py-3.5 rounded-xl font-heading font-semibold text-sm border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-all"
              >
                Launch Live Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ToastContainer } from '@/components/ui/toast-container';
import { useAuth } from '@/lib/auth-context';
import { useCommunity } from '@/lib/community-context';
import { Idea, IdeaCategory, IdeaStatus } from '@/types';
import {
  Lightbulb,
  Search,
  Filter,
  Flame,
  Bookmark,
  MessageSquare,
  Users,
  PlusCircle,
  Sparkles,
  ArrowRight,
  X,
  Send,
  FolderGit2,
  Paperclip,
  CheckCircle2,
  Share2,
} from 'lucide-react';

const CATEGORIES: ('All' | IdeaCategory)[] = [
  'All',
  'AI & Machine Learning',
  'Web3 & Blockchain',
  'Cybersecurity',
  'Open Source & DevTools',
  'Cloud & DevOps',
  'Education & Social Impact',
  'Mobile & IoT',
];

function IdeasContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialNewModal = searchParams.get('new') === 'true';

  const { user } = useAuth();
  const { ideas, upvoteIdea, bookmarkIdea, createIdea, addIdeaComment, createTeam, showToast } =
    useCommunity();

  const [selectedCategory, setSelectedCategory] = useState<'All' | IdeaCategory>('All');
  const [sortBy, setSortBy] = useState<'popular' | 'newest'>('popular');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(initialNewModal);
  const [activeIdeaDetail, setActiveIdeaDetail] = useState<Idea | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  // Create Idea Form state
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<IdeaCategory>('AI & Machine Learning');
  const [tagsInput, setTagsInput] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [desiredTeamSize, setDesiredTeamSize] = useState(4);

  // Filter ideas
  const filteredIdeas = useMemo(() => {
    return ideas
      .filter((idea) => {
        if (selectedCategory !== 'All' && idea.category !== selectedCategory) return false;
        if (statusFilter !== 'all' && idea.status !== statusFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = idea.title.toLowerCase().includes(q);
          const matchExcerpt = idea.excerpt.toLowerCase().includes(q);
          const matchTag = idea.tags.some((t) => t.toLowerCase().includes(q));
          const matchSkill = idea.required_skills.some((s) => s.toLowerCase().includes(q));
          if (!matchTitle && !matchExcerpt && !matchTag && !matchSkill) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.upvotes_count - a.upvotes_count;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [ideas, selectedCategory, statusFilter, searchQuery, sortBy]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsInput.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean);
    const skills = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);

    createIdea({
      title,
      excerpt: excerpt || title,
      content,
      category,
      tags: tags.length ? tags : ['BuildSpace', 'Innovation'],
      required_skills: skills.length ? skills : ['Full-Stack', 'React'],
      desired_team_size: Number(desiredTeamSize) || 4,
      status: 'open',
    });

    setShowCreateModal(false);
    setTitle('');
    setExcerpt('');
    setContent('');
    setTagsInput('');
    setSkillsInput('');
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeIdeaDetail || !newCommentText.trim()) return;
    addIdeaComment(activeIdeaDetail.id, newCommentText.trim());
    setNewCommentText('');
  };

  const handleCreateTeamFromIdea = (idea: Idea) => {
    if (!user) return;
    const squad = createTeam({
      name: idea.title.split(':')[0] || idea.title.substring(0, 24),
      category: idea.category,
      description: idea.excerpt,
      desired_skills: idea.required_skills,
    });
    router.push('/workspace');
  };

  const handleCollaborateInterest = (idea: Idea) => {
    showToast({
      type: 'success',
      title: 'Interest Sent!',
      description: `Author ${idea.author.full_name} was notified that you'd love to collaborate.`,
    });
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
              <Lightbulb className="w-3.5 h-3.5" /> Idea Wall & Proposals
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Inventions, Concepts & Collabs
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Discover raw ideas looking for co-builders, upvote your favorites, comment on architectures, or launch a squad directly from an idea.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-xl font-heading font-semibold text-xs bg-cyan-400 text-black hover:bg-cyan-300 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.4)] shrink-0 self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            Publish New Idea
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keywords, tags, or skills (e.g. WASM, Rust, ZK)..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/10 bg-black/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Sort and Status controls */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
              <div className="flex items-center rounded-xl border border-white/10 bg-white/[0.03] p-0.5">
                <button
                  onClick={() => setSortBy('popular')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    sortBy === 'popular' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🔥 Popular
                </button>
                <button
                  onClick={() => setSortBy('newest')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    sortBy === 'newest' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ⚡ Newest
                </button>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-white/10 bg-[#0C1222] text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">Status: All</option>
                <option value="open">Open For Team</option>
                <option value="in_progress">In Progress</option>
              </select>
            </div>
          </div>

          {/* Category Chips Scrollbar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                    : 'border border-white/10 bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Ideas Grid */}
        {filteredIdeas.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#0A1020] p-12 text-center space-y-3">
            <Lightbulb className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="font-heading text-lg font-semibold text-white">No ideas found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No ideas matched your current search filters. Try clearing your query or publish the very first idea!
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="text-xs text-cyan-400 hover:underline font-semibold"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredIdeas.map((idea) => (
              <div
                key={idea.id}
                className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between group hover:border-cyan-500/40 relative"
              >
                <div>
                  {/* Card Top: Category, Status, Upvote & Bookmark */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {idea.category}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => upvoteIdea(idea.id)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                          idea.is_upvoted
                            ? 'bg-cyan-500/20 border border-cyan-400/40 text-cyan-300'
                            : 'border border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                        title="Upvote idea"
                      >
                        <Flame className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{idea.upvotes_count}</span>
                      </button>

                      <button
                        onClick={() => bookmarkIdea(idea.id)}
                        className={`p-1.5 rounded-lg border border-white/10 transition-colors ${
                          idea.is_bookmarked
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                        title="Bookmark"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Excerpt */}
                  <h3
                    onClick={() => setActiveIdeaDetail(idea)}
                    className="font-heading text-xl font-bold text-white group-hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    {idea.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed line-clamp-3">
                    {idea.excerpt}
                  </p>

                  {/* Skills Needed */}
                  <div className="mt-4 pt-3 border-t border-white/5">
                    <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold mb-1.5">
                      Seeking Roles & Skills:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {idea.required_skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {idea.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer bar */}
                <div className="pt-5 mt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={idea.author.avatar_url}
                      alt={idea.author.full_name}
                      className="w-7 h-7 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <p className="text-white font-medium text-xs leading-none">{idea.author.full_name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                        {new Date(idea.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveIdeaDetail(idea)}
                      className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{idea.comments_count}</span>
                    </button>

                    <button
                      onClick={() => handleCreateTeamFromIdea(idea)}
                      className="px-3 py-1.5 rounded-xl font-heading font-semibold text-xs bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/25 transition-all flex items-center gap-1"
                    >
                      <Users className="w-3 h-3" />
                      Form Squad
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CREATE IDEA MODAL */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="w-full max-w-2xl bg-[#0C1222] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Idea Wall</span>
                <h2 className="font-heading text-2xl font-bold text-white mt-0.5">Publish New Project Proposal</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Share your technical vision, architecture, and recruit members for your dream squad.
                </p>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Idea Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. NeuroPulse: Edge-Native Decentralized AI Swarm"
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as IdeaCategory)}
                      className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#0A1020] text-white focus:outline-none focus:border-cyan-400"
                    >
                      {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Desired Team Size</label>
                    <input
                      type="number"
                      min={1}
                      max={8}
                      value={desiredTeamSize}
                      onChange={(e) => setDesiredTeamSize(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Short Elevator Pitch (Excerpt)</label>
                  <input
                    type="text"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="One-line summary for the Idea Wall card preview..."
                    required
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Full Technical Description & Problem Statement</label>
                  <textarea
                    rows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Describe the problem, proposed architecture, target hackathon, and roadmap..."
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-black/40 text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Required Skills (comma separated)</label>
                    <input
                      type="text"
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
                      placeholder="e.g. Rust, WebAssembly, Next.js, Figma"
                      className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="e.g. EdgeAI, WebRTC, PeerToPeer"
                      className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl font-heading font-semibold text-xs bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                  >
                    Publish to Campus Wall
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* IDEA DETAIL & DISCUSSION MODAL */}
        {activeIdeaDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="w-full max-w-3xl bg-[#0C1222] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] flex flex-col">
              {/* Close Button */}
              <button
                onClick={() => setActiveIdeaDetail(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Scrollable Content */}
              <div className="overflow-y-auto pr-1 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {activeIdeaDetail.category}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400">
                      ● Status: {activeIdeaDetail.status}
                    </span>
                  </div>

                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                    {activeIdeaDetail.title}
                  </h2>

                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <img
                        src={activeIdeaDetail.author.avatar_url}
                        alt={activeIdeaDetail.author.full_name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-white font-medium">{activeIdeaDetail.author.full_name}</span>
                    </div>
                    <span>·</span>
                    <span>{new Date(activeIdeaDetail.created_at).toLocaleDateString()}</span>
                    <span>·</span>
                    <span>Squad Target: {activeIdeaDetail.desired_team_size} members</span>
                  </div>
                </div>

                {/* Main Body */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 prose prose-invert max-w-none text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                  {activeIdeaDetail.content}
                </div>

                {/* Attachments if any */}
                {activeIdeaDetail.attachments && activeIdeaDetail.attachments.length > 0 && (
                  <div>
                    <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2">
                      Attachments & Whitepapers
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeIdeaDetail.attachments.map((att, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <Paperclip className="w-4 h-4 text-cyan-400" />
                            <span className="text-white font-medium truncate">{att.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{att.size}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action CTA Bar */}
                <div className="p-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.06] flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-white">Inspired by this proposal?</p>
                    <p className="text-[11px] text-slate-300">
                      Reach out directly to co-build or convert this into a dedicated team workspace.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCollaborateInterest(activeIdeaDetail)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold border border-cyan-400/40 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20 transition-colors"
                    >
                      Interested in Collaborating
                    </button>
                    <button
                      onClick={() => {
                        setActiveIdeaDetail(null);
                        handleCreateTeamFromIdea(activeIdeaDetail);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-400 text-black hover:bg-cyan-300 font-heading transition-colors"
                    >
                      Create Squad from Idea
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="border-t border-white/10 pt-5 space-y-4">
                  <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    Discussion & Reviews ({activeIdeaDetail.comments_count})
                  </h4>

                  {/* Post Comment form */}
                  <form onSubmit={handlePostComment} className="flex gap-2">
                    <input
                      type="text"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Add technical thoughts, questions, or invite to chat..."
                      className="flex-1 px-4 py-2 rounded-xl border border-white/10 bg-black/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-cyan-400 text-black hover:bg-cyan-300 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Post
                    </button>
                  </form>

                  {/* Sample comment thread */}
                  <div className="space-y-3 pt-2">
                    <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-white">Sarah Lin</span>
                        <span className="text-[10px] text-slate-500 font-mono">2 hours ago</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        I love the WebAssembly approach here! If you need help hooking this up to the browser WebRTC data channels and dark UI canvas, count me in.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-white">Marcus Brody</span>
                        <span className="text-[10px] text-slate-500 font-mono">Yesterday</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Make sure the model weights are quantized with llama.cpp using Q4_K_M for minimal memory footprint on mobile devices.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function IdeasPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070B14]" />}>
      <IdeasContent />
    </Suspense>
  );
}

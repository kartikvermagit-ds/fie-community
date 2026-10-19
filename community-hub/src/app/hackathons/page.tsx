'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ToastContainer } from '@/components/ui/toast-container';
import { useAuth } from '@/lib/auth-context';
import { useCommunity } from '@/lib/community-context';
import { createHackathonCalendar } from '@/lib/hackathon-calendar';
import { useHackathonWatchlist } from '@/lib/use-hackathon-watchlist';
import { Hackathon } from '@/types';
import {
  Trophy,
  Calendar,
  Users,
  ExternalLink,
  PlusCircle,
  X,
  MapPin,
  Bookmark,
  BookmarkCheck,
  CalendarPlus,
} from 'lucide-react';

const subscribeToDate = () => () => {};
function HackathonDate({ value }: { value: string }) {
  const text = useSyncExternalStore(subscribeToDate,
    () => new Date(value).toLocaleDateString(), () => value.slice(0, 10));
  return <time dateTime={value}>{text}</time>;
}

export default function HackathonsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { hackathons, createHackathon, createTeam, showToast } = useCommunity();
  const { savedIds, setSaved, isReady, storageAvailable } = useHackathonWatchlist(user?.id || null, !isLoading);

  const [activeTab, setActiveTab] = useState<'all' | 'ongoing' | 'upcoming' | 'saved'>('all');
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [lookingForTeamModal, setLookingForTeamModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [prizePool, setPrizePool] = useState('$50,000 USD');
  const [description, setDescription] = useState('');
  const bannerUrl = '';
  const [registrationUrl, setRegistrationUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('Cybersecurity, Systems, AI');
  const rules = 'Teams of 2 to 4 members. 72-hour hacking period.';

  const filteredHackathons = hackathons.filter((h) => {
    if (activeTab === 'saved') return savedIds.includes(h.id);
    if (activeTab === 'ongoing') return h.status === 'ongoing';
    if (activeTab === 'upcoming') return h.status === 'upcoming';
    return true;
  });
  const savedCount = hackathons.filter((hackathon) => savedIds.includes(hackathon.id)).length;

  const handleSaveHackathon = (hackathon: Hackathon) => {
    if (!user) {
      showToast({ type: 'info', title: 'Sign in to save hackathons', description: 'Your watchlist is kept separately for your profile in this browser.' });
      return;
    }
    const shouldSave = !savedIds.includes(hackathon.id);
    if (!setSaved(hackathon.id, shouldSave)) {
      showToast({ type: 'error', title: 'Could not update your watchlist', description: 'Browser storage is unavailable or full. Allow site storage and try again.' });
      return;
    }
    showToast({ type: 'success', title: shouldSave ? 'Hackathon saved' : 'Hackathon removed', description: shouldSave ? 'Find it under Saved events in this browser.' : 'Removed from your saved events.' });
  };

  const handleExportCalendar = (hackathon: Hackathon) => {
    try {
      const calendar = createHackathonCalendar(hackathon);
      const url = URL.createObjectURL(new Blob([calendar.content], { type: 'text/calendar;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = calendar.filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast({ type: 'success', title: 'Calendar file downloaded', description: 'Import the .ics file into your calendar for registration and event dates. Check the official portal for date changes.' });
    } catch (error) {
      showToast({ type: 'error', title: 'Calendar export unavailable', description: error instanceof Error ? error.message : 'The event dates could not be exported.' });
    }
  };

  const handleCreateHackathon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

    createHackathon({
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      organizer: organizer || 'Campus Hack Committee',
      prize_pool: prizePool,
      description,
      banner_url:
        bannerUrl ||
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      registration_url: registrationUrl || '#',
      start_date: new Date(Date.now() + 86400000 * 7).toISOString(),
      end_date: new Date(Date.now() + 86400000 * 10).toISOString(),
      registration_deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
      status: 'upcoming',
      tags,
      rules,
      min_team_size: 2,
      max_team_size: 4,
      location: 'Global Virtual',
    });

    setShowCreateModal(false);
    setTitle('');
    setDescription('');
    setOrganizer('');
  };

  const handleCreateTeamForHackathon = (hackathon: Hackathon) => {
    if (!user) return;
    createTeam({
      name: `${hackathon.title.split(' ')[0]} Squad`,
      description: `Official competing squad for ${hackathon.title}`,
      hackathon_id: hackathon.id,
      hackathon_title: hackathon.title,
      desired_skills: hackathon.tags,
      category: 'AI & Machine Learning',
    });
    router.push('/workspace');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070B14] text-white selection:bg-cyan-500/25 selection:text-cyan-300 relative">
      <Navbar />
      <ToastContainer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-purple-400 uppercase tracking-wider mb-1">
              <Trophy className="w-3.5 h-3.5" /> Hackathon Hub & Sprints
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Hackathon Arenas & Sprints
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Discover top engineering competitions, find dream squadmates, spin up dedicated sprint war rooms, and build award-winning prototypes.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setLookingForTeamModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-colors"
            >
              Post "Need Teammates"
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-400 text-black hover:bg-cyan-300 transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
            >
              <PlusCircle className="w-4 h-4" />
              List Hackathon
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3" aria-label="Filter hackathons">
          <button
            onClick={() => setActiveTab('all')}
            aria-pressed={activeTab === 'all'}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Hackathons ({hackathons.length})
          </button>
          <button
            onClick={() => setActiveTab('ongoing')}
            aria-pressed={activeTab === 'ongoing'}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'ongoing'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🟢 Live & Ongoing
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            aria-pressed={activeTab === 'upcoming'}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'upcoming'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⏳ Upcoming Sprints
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            aria-pressed={activeTab === 'saved'}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'saved'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" /> Saved events ({isReady ? savedCount : '…'})
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
          <p>{!isReady ? 'Loading your saved events…' : user ? `Saved for ${user.full_name} in this browser. Import calendar files to track deadlines.` : 'Sign in to keep a personal watchlist in this browser.'}</p>
          {!storageAvailable && <p role="status" className="text-amber-300">Browser storage is unavailable. Calendar downloads still work.</p>}
        </div>

        {filteredHackathons.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-14 text-center">
            <Bookmark className="w-8 h-8 mx-auto text-slate-500 mb-3" />
            <h2 className="font-heading text-xl font-semibold text-white">{activeTab === 'saved' ? (!isReady ? 'Loading saved events' : !user ? 'Sign in to see saved events' : !storageAvailable ? 'Saved events unavailable' : 'No saved events yet') : 'No hackathons in this view'}</h2>
            <p className="text-sm text-slate-400 mt-2">{activeTab === 'saved' ? (!storageAvailable ? 'Allow site storage to access your watchlist in this browser.' : 'Save an event to keep its rules and calendar dates close at hand.') : 'Check all hackathons for more competitions.'}</p>
            <button onClick={() => setActiveTab('all')} className="mt-5 rounded-xl px-4 py-2 text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30">Browse all hackathons</button>
          </div>
        )}

        {/* Hackathons Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHackathons.map((h) => (
            <div
              key={h.id}
              className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between group hover:border-purple-500/40"
            >
              <div>
                {/* Banner Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={h.banner_url}
                    alt={h.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090E1D] via-black/30 to-transparent" />

                  <button
                    onClick={() => handleSaveHackathon(h)}
                    disabled={!isReady}
                    aria-pressed={savedIds.includes(h.id)}
                    aria-label={`${savedIds.includes(h.id) ? 'Unsave' : 'Save'} ${h.title}`}
                    className={`absolute top-3 left-3 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border transition-colors disabled:opacity-50 ${savedIds.includes(h.id) ? 'text-amber-300 border-amber-400/40 hover:bg-black/90' : 'text-white border-white/20 hover:border-amber-400/50'}`}
                  >
                    {savedIds.includes(h.id) ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                    {savedIds.includes(h.id) ? 'Saved' : 'Save'}
                  </button>

                  {/* Badge */}
                  <span className="absolute top-3 right-3 text-[10px] font-mono px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-emerald-300 border border-emerald-500/30 uppercase font-bold">
                    {h.status}
                  </span>

                  <span className="absolute bottom-3 left-3 text-xs font-mono px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-cyan-300 border border-white/10 font-bold">
                    Prize Pool: {h.prize_pool}
                  </span>
                </div>

                <div className="p-5">
                  <p className="text-[11px] font-mono text-purple-400">{h.organizer}</p>
                  <h3 className="font-heading text-xl font-bold text-white mt-1 group-hover:text-purple-300 transition-colors">
                    <button onClick={() => setSelectedHackathon(h)} className="text-left">{h.title}</button>
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                    {h.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/5 space-y-2 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span><HackathonDate value={h.start_date} /> – <HackathonDate value={h.end_date} /></span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-300">
                      <CalendarPlus className="w-3.5 h-3.5 shrink-0" />
                      <span>Register by <HackathonDate value={h.registration_deadline} /></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>{h.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{h.participants_count} builders · {h.teams_registered_count} squads registered</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {h.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-5 pb-3">
                <button onClick={() => handleExportCalendar(h)} className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5">
                  <CalendarPlus className="w-3.5 h-3.5" /> Add dates to calendar
                </button>
              </div>
              <div className="p-5 pt-3 flex items-center justify-between gap-3 border-t border-white/5">
                <button
                  onClick={() => setSelectedHackathon(h)}
                  className="text-xs text-slate-400 hover:text-white font-medium"
                >
                  Rules & Guide
                </button>

                <button
                  onClick={() => handleCreateTeamForHackathon(h)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 font-heading transition-all flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  Form Squad
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* HACKATHON DETAILS MODAL */}
        {selectedHackathon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div role="dialog" aria-modal="true" aria-labelledby="hackathon-details-title" className="w-full max-w-2xl bg-[#0C1222] border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8">
              <button
                onClick={() => setSelectedHackathon(null)}
                aria-label="Close hackathon details"
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  {selectedHackathon.status.toUpperCase()}
                </span>
                <h2 id="hackathon-details-title" className="font-heading text-2xl font-bold text-white mt-2">
                  {selectedHackathon.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">Organized by {selectedHackathon.organizer}</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleSaveHackathon(selectedHackathon)}
                    disabled={!isReady}
                    aria-pressed={savedIds.includes(selectedHackathon.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 font-semibold hover:bg-amber-500/20 disabled:opacity-50"
                  >
                    {savedIds.includes(selectedHackathon.id) ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                    {savedIds.includes(selectedHackathon.id) ? 'Saved — remove' : 'Save event'}
                  </button>
                  <button onClick={() => handleExportCalendar(selectedHackathon)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5">
                    <CalendarPlus className="w-3.5 h-3.5" /> Download calendar (.ics)
                  </button>
                  <p className="basis-full text-[11px] text-slate-400">Includes the registration deadline and competition dates. Your calendar displays times in its own timezone.</p>
                </div>
                <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Prize Pool:</span>
                    <span className="text-cyan-400 font-mono font-bold">{selectedHackathon.prize_pool}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Team Size Constraint:</span>
                    <span className="text-white font-mono">
                      {selectedHackathon.min_team_size} – {selectedHackathon.max_team_size} members
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Registration Closes:</span>
                    <span className="text-amber-400 font-mono">
                      <HackathonDate value={selectedHackathon.registration_deadline} />
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white uppercase font-mono tracking-wider text-[11px] mb-1">
                    Description & Objectives
                  </h4>
                  <p className="text-slate-300 leading-relaxed">{selectedHackathon.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-white uppercase font-mono tracking-wider text-[11px] mb-1">
                    Official Rules & Evaluation Guidelines
                  </h4>
                  <p className="text-slate-300 leading-relaxed p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px]">
                    {selectedHackathon.rules}
                  </p>
                </div>

                <div className="pt-4 flex flex-wrap items-center justify-end gap-3 border-t border-white/10">
                  <a
                    href={selectedHackathon.registration_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl text-xs font-semibold border border-white/10 text-white hover:bg-white/5 flex items-center gap-1.5"
                  >
                    Official Portal <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => {
                      const h = selectedHackathon;
                      setSelectedHackathon(null);
                      handleCreateTeamForHackathon(h);
                    }}
                    className="px-6 py-2 rounded-xl font-heading font-semibold text-xs bg-purple-500 text-white hover:bg-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center gap-1.5"
                  >
                    <Users className="w-4 h-4" />
                    Create Squad & Enter Workspace
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LOOKING FOR TEAMMATES MODAL */}
        {lookingForTeamModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-md bg-[#0C1222] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <h3 className="font-heading text-lg font-bold text-white">Post Teammate Search</h3>
                <button onClick={() => setLookingForTeamModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Your profile will be highlighted to squad leaders looking for your stack.
              </p>

              <div className="p-3 rounded-xl border border-cyan-500/20 bg-cyan-500/[0.05] mb-4 text-xs">
                <p className="font-semibold text-cyan-300">{user?.full_name}</p>
                <p className="text-[11px] text-slate-400">{user?.role} · {user?.skills.join(', ')}</p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setLookingForTeamModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setLookingForTeamModal(false);
                    showToast({
                      type: 'success',
                      title: 'Teammate request broadcasted!',
                      description: 'Squad leaders on BuildSpace can now invite you directly.',
                    });
                  }}
                  className="px-5 py-2 text-xs font-semibold bg-cyan-400 text-black rounded-xl hover:bg-cyan-300"
                >
                  Broadcast Availability
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CREATE HACKATHON MODAL */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="w-full max-w-xl bg-[#0C1222] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-5">
                <h2 className="font-heading text-2xl font-bold text-white">List a New Hackathon</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Publish a campus or global competition to invite student builder squads.
                </p>
              </div>

              <form onSubmit={handleCreateHackathon} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Hackathon Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. HackMIT Winter 2026"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Organizer</label>
                    <input
                      type="text"
                      value={organizer}
                      onChange={(e) => setOrganizer(e.target.value)}
                      placeholder="e.g. Linux Club × ACM"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Prize Pool</label>
                    <input
                      type="text"
                      value={prizePool}
                      onChange={(e) => setPrizePool(e.target.value)}
                      placeholder="$25,000 USD"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the challenge themes and targets..."
                    required
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Official Registration URL</label>
                  <input
                    type="url"
                    value={registrationUrl}
                    onChange={(e) => setRegistrationUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="AI, Web3, Systems, Mobile"
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-cyan-400"
                  />
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
                    className="px-6 py-2 rounded-xl font-heading font-semibold text-xs bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                  >
                    Publish Hackathon
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

'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ToastContainer } from '@/components/ui/toast-container';
import { useCommunity } from '@/lib/community-context';
import { ContentReport } from '@/types';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Users,
  Trash2,
  XCircle,
  Eye,
} from 'lucide-react';

export default function AdminPage() {
  const { reports, showToast } = useCommunity();

  // Initial sample moderation reports if none submitted
  const [activeReports, setActiveReports] = useState<ContentReport[]>([
    {
      id: 'rep_sample_1',
      reporter: {
        id: 'usr_sarah',
        email: 'sarah@fiecommunity.dev',
        username: 'sarahlin',
        full_name: 'Sarah Lin',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80',
        bio: '',
        role: 'Lead Frontend Engineer',
        skills: [],
        interests: [],
        is_open_to_collaborate: true,
        karma: 980,
        created_at: '',
      },
      content_type: 'idea',
      content_id: 'idea_suspicious_copy',
      reason: 'Potential duplicate/scraped hackathon submission copy without attribution',
      details: 'Flagged on Idea Wall #AI section.',
      status: 'pending',
      created_at: '2026-10-18T10:00:00Z',
    },
  ]);

  const handleResolve = (id: string, actionName: string) => {
    setActiveReports((prev) => prev.filter((r) => r.id !== id));
    showToast({
      type: 'success',
      title: 'Report Addressed',
      description: `Moderation action "${actionName}" executed successfully.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080B10] text-white selection:bg-orange-500/25 selection:text-orange-400 relative">
      <Navbar />
      <ToastContainer />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-purple-400 uppercase tracking-wider mb-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Campus Integrity & Safety
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Moderator & Safety Desk
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Audit flagged content, manage community guidelines, and ensure safe, inclusive collaboration across all squads and rooms.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              Campus Health: 99.8% Nominal
            </span>
          </div>
        </div>

        {/* Moderation Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border border-white/10 bg-[#0A1020]">
            <p className="text-[11px] font-mono uppercase text-slate-400">Pending Flags</p>
            <p className="font-heading text-2xl font-bold text-amber-400 mt-0.5">
              {activeReports.length}
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-white/10 bg-[#0A1020]">
            <p className="text-[11px] font-mono uppercase text-slate-400">Total Cleared Flags</p>
            <p className="font-heading text-2xl font-bold text-emerald-400 mt-0.5">48</p>
          </div>

          <div className="p-4 rounded-2xl border border-white/10 bg-[#0A1020]">
            <p className="text-[11px] font-mono uppercase text-slate-400">Active Squad Audits</p>
            <p className="font-heading text-2xl font-bold text-orange-400 mt-0.5">24</p>
          </div>
        </div>

        {/* Reports Queue */}
        <div className="space-y-4">
          <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Active Investigation Queue
          </h2>

          {activeReports.length === 0 ? (
            <div className="p-12 rounded-3xl border border-white/10 bg-[#0D131F] text-center space-y-2">
              <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="font-heading text-base font-bold text-white">Queue Clear</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No active abuse or plagiarism reports. All squad rooms and proposal boards are within community guidelines.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeReports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-5 rounded-2xl border border-amber-500/30 bg-[#0D131F] space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {rep.content_type} report
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Target ID: <code className="text-white">{rep.content_id}</code>
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-slate-500">
                      Reported by {rep.reporter.full_name}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-white">{rep.reason}</p>
                  {rep.details && <p className="text-xs text-slate-400">{rep.details}</p>}

                  <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-end gap-2 text-xs">
                    <button
                      onClick={() => handleResolve(rep.id, 'Dismissed without violation')}
                      className="px-3.5 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white"
                    >
                      Dismiss (False Alarm)
                    </button>
                    <button
                      onClick={() => handleResolve(rep.id, 'Warned Creator & Content Hidden')}
                      className="px-4 py-1.5 rounded-xl bg-rose-500 text-white font-semibold hover:bg-rose-400"
                    >
                      Hide Content & Warn User
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Community Guidelines Checklist */}
        <div className="p-6 rounded-3xl border border-white/10 bg-[#0D131F] space-y-3">
          <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
            Campus Collaboration Standards
          </h3>
          <ul className="space-y-2 text-xs text-slate-300 leading-relaxed list-disc list-inside">
            <li>Zero tolerance for unauthorized code plagiarism or scraping of open-source hackathon submissions.</li>
            <li>Respectful technical discourse in all subgroup channels; constructive feedback on slide decks and architectures.</li>
            <li>Strict privacy for private squad rooms; credentials and tokens must never be logged or shared publicly.</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ToastContainer } from '@/components/ui/toast-container';
import { useCommunity } from '@/lib/community-context';
import {
  Bell,
  CheckCircle2,
  Users,
  MessageSquare,
  CheckSquare,
  Trophy,
  ArrowRight,
  Trash2,
} from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useCommunity();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.is_read;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'join_request':
      case 'invite':
        return <Users className="w-4 h-4 text-orange-400" />;
      case 'mention':
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-purple-400" />;
      case 'task_assigned':
        return <CheckSquare className="w-4 h-4 text-emerald-400" />;
      case 'hackathon_alert':
        return <Trophy className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080B10] text-white selection:bg-orange-500/25 selection:text-orange-400 relative">
      <Navbar />
      <ToastContainer />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Bell className="w-6 h-6 text-orange-400" />
              Notifications Center
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Join requests, room mentions, task assignments, and hackathon alerts.
            </p>
          </div>

          <button
            onClick={markAllNotificationsAsRead}
            className="text-xs text-orange-400 hover:underline font-semibold"
          >
            Mark all read
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
              filter === 'all'
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
              filter === 'unread'
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Unread ({notifications.filter((n) => !n.is_read).length})
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 rounded-2xl border border-white/10 bg-[#0A1020] text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-white font-medium text-sm">All caught up!</p>
            <p className="text-xs text-slate-400">You have no unread notifications.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationAsRead(n.id)}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                  n.is_read
                    ? 'border-white/5 bg-white/[0.02] opacity-70 hover:opacity-100 hover:bg-white/[0.04]'
                    : 'border-orange-500/30 bg-orange-500/[0.06] hover:bg-orange-500/[0.1]'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{n.title}</p>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                      {new Date(n.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                <Link
                  href={n.action_url}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-orange-300 border border-white/10 shrink-0 font-medium flex items-center gap-1"
                >
                  View <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useCommunity } from '@/lib/community-context';
import {
  Terminal,
  Search,
  Bell,
  Sparkles,
  Menu,
  X,
  LogOut,
  User,
  ShieldCheck,
  ChevronDown,
  Layers,
  Lightbulb,
  Trophy,
  Users,
  FolderGit2,
  FileText,
  MessagesSquare,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, switchDemoUser, availableDemoUsers } = useAuth();
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setIsCommandPaletteOpen,
  } = useCommunity();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [demoSwitcherOpen, setDemoSwitcherOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: Layers },
    { name: 'Ideas Hub', href: '/ideas', icon: Lightbulb },
    { name: 'Hackathons', href: '/hackathons', icon: Trophy },
    { name: 'Teams & Rooms', href: '/workspace', icon: MessagesSquare },
    { name: 'Projects', href: '/projects', icon: FolderGit2 },
    { name: 'Squads', href: '/teams', icon: Users },
    { name: 'Resources', href: '/resources', icon: FileText },
    { name: 'Campus', href: '/members', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#070B14]/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 p-[1px] shadow-[0_0_15px_-2px_rgba(0,240,255,0.4)] group-hover:shadow-[0_0_20px_0_rgba(0,240,255,0.7)] transition-all">
              <div className="h-full w-full bg-[#070B14] rounded-[11px] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                BuildSpace
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  DEV
                </span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider font-mono -mt-1 hidden sm:inline">
                DIGITAL CAMPUS
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white/10 text-cyan-300 font-semibold shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Search Bar / Command Palette trigger */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 hover:text-slate-200 hover:border-cyan-500/30 hover:bg-white/[0.08] transition-all text-xs"
            title="Search anything (Cmd+K / Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Quick search...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-black/40 border border-white/10 rounded">
              ⌘K
            </kbd>
          </button>

          {/* Demo Persona Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => {
                setDemoSwitcherOpen(!demoSwitcherOpen);
                setNotificationsOpen(false);
                setUserMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 text-xs font-medium transition-all"
              title="Switch demo persona to test roles"
            >
              <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
              <span className="max-w-[80px] sm:max-w-[110px] truncate">{user?.full_name?.split(' ')[0] || 'Demo'}</span>
              <ChevronDown className="w-3 h-3 text-purple-400" />
            </button>

            {demoSwitcherOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/10 bg-[#0C1222] shadow-2xl p-2 z-50 animate-in fade-in-0 duration-150">
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="text-xs font-semibold text-white">Simulate Role & Permissions</p>
                  <p className="text-[10px] text-slate-400">Switch persona to test Owner vs Member vs Admin views</p>
                </div>
                <div className="py-1 space-y-1">
                  {availableDemoUsers.map((persona) => (
                    <button
                      key={persona.id}
                      onClick={() => {
                        switchDemoUser(persona.id);
                        setDemoSwitcherOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-colors ${
                        user?.id === persona.id ? 'bg-cyan-500/15 border border-cyan-500/30' : 'hover:bg-white/5'
                      }`}
                    >
                      <img
                        src={persona.avatar_url}
                        alt={persona.full_name}
                        className="w-7 h-7 rounded-full object-cover border border-white/10"
                      />
                      <div className="truncate">
                        <p className="text-xs font-medium text-white truncate">{persona.full_name}</p>
                        <p className="text-[10px] text-cyan-300 truncate">{persona.role}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setUserMenuOpen(false);
                setDemoSwitcherOpen(false);
              }}
              className="relative p-2 rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 hover:text-white hover:border-white/20 transition-all"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-[9px] font-bold text-black ring-2 ring-[#070B14]">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-white/10 bg-[#0C1222] shadow-2xl z-50 overflow-hidden animate-in fade-in-0 duration-150">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0F172A]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-center text-xs text-slate-400">No notifications yet.</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3 text-xs transition-colors cursor-pointer ${
                          n.is_read ? 'opacity-60 hover:opacity-100 hover:bg-white/5' : 'bg-cyan-500/[0.06] hover:bg-cyan-500/[0.12]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-white">{n.title}</p>
                          <span className="text-[10px] font-mono text-slate-500 shrink-0">
                            {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2 border-t border-white/10 bg-[#090E1D] text-center">
                  <Link
                    href="/notifications"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-xs text-cyan-400 hover:underline font-medium"
                  >
                    View all notifications →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setUserMenuOpen(!userMenuOpen);
                setNotificationsOpen(false);
                setDemoSwitcherOpen(false);
              }}
              className="flex items-center gap-2 p-1 rounded-full border border-white/10 hover:border-cyan-500/40 transition-all"
            >
              <img
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80'}
                alt={user?.full_name || 'User'}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-cyan-500/30"
              />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-[#0C1222] shadow-2xl p-2 z-50 animate-in fade-in-0 duration-150">
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="text-xs font-semibold text-white truncate">{user?.full_name}</p>
                  <p className="text-[11px] text-cyan-300 font-mono truncate">@{user?.username}</p>
                  <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Karma: {user?.karma || 0}
                  </span>
                </div>

                <div className="py-1">
                  <Link
                    href="/members"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    My Campus Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    Preferences & Privacy
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-purple-300 hover:text-white hover:bg-purple-500/10 rounded-xl transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    Moderation Portal
                  </Link>
                </div>

                <div className="pt-1 border-t border-white/10">
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#090E1D] px-4 pt-3 pb-6 space-y-1 animate-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 font-semibold'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}

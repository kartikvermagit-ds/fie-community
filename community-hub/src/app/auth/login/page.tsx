'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ToastContainer } from '@/components/ui/toast-container';
import { BrandLogo } from '@/components/ui/brand-logo';
import { Sparkles, ArrowRight, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, switchDemoUser, availableDemoUsers } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const success = await login(email, password);
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Invalid credentials. Please verify your email and password.');
      }
    } catch {
      setError('An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (userId: string) => {
    switchDemoUser(userId);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080B10] text-[#F8FAFC] relative">
      <Navbar />
      <ToastContainer />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-3xl border border-white/10 bg-[#0D131F]/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <BrandLogo variant="symbol" size="lg" withGlow={true} />
              </div>
              <h1 className="font-heading text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
              <p className="text-xs text-slate-400 mt-1">
                Sign in to your FIE COMMUNITY account
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Email address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.chen@fiecommunity.dev"
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-slate-300">Password</label>
                  <Link href="/auth/recovery" className="text-[11px] text-orange-400 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-heading font-semibold text-sm bg-orange-500 text-white hover:bg-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">or fast demo</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Quick Demo Switcher Buttons */}
            <div className="space-y-2">
              <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                Select a persona to test roles & permissions:
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {availableDemoUsers.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleQuickDemoLogin(p.id)}
                    className="p-2 rounded-xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.08] hover:border-orange-500/30 text-left transition-all flex items-center gap-2 group"
                  >
                    <img
                      src={p.avatar_url}
                      alt={p.full_name}
                      className="w-7 h-7 rounded-full object-cover border border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate group-hover:text-orange-300">
                        {p.full_name.split(' ')[0]}
                      </p>
                      <p className="text-[9px] text-slate-400 truncate">{p.role.split(' ')[0]}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10 text-center">
              <p className="text-xs text-slate-400">
                Don't have an account yet?{' '}
                <Link href="/auth/signup" className="text-orange-400 hover:underline font-semibold">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

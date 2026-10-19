'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ToastContainer } from '@/components/ui/toast-container';
import { BrandLogo } from '@/components/ui/brand-logo';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function RecoveryPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080B10] text-[#F8FAFC] relative">
      <Navbar />
      <ToastContainer />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-white/10 bg-[#0D131F]/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <BrandLogo variant="symbol" size="lg" withGlow={true} />
              </div>
              <h1 className="font-heading text-2xl font-bold text-white tracking-tight">
                Reset Password
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Enter your FIE Community account email to receive secure recovery instructions.
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="font-heading text-lg font-bold text-white">Check your inbox</h3>
                <p className="text-xs text-slate-300">
                  We sent a password reset link to <span className="text-orange-300 font-semibold">{email}</span>.
                </p>
                <div className="pt-4">
                  <Link
                    href="/auth/login"
                    className="inline-block px-5 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition-colors"
                  >
                    Return to Sign In
                  </Link>
                </div>
              </div>
            ) : (
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

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-heading font-semibold text-sm bg-orange-500 text-white hover:bg-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  Send Reset Link
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="pt-4 text-center">
                  <Link href="/auth/login" className="text-xs text-slate-400 hover:text-white">
                    ← Back to Sign In
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

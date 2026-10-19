'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ToastContainer } from '@/components/ui/toast-container';
import { Terminal, ArrowRight, User, Mail, Lock, School, Code2 } from 'lucide-react';
import { BrandLogo } from '@/components/ui/brand-logo';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Full-Stack Engineer');
  const [college, setCollege] = useState('');
  const [skills, setSkills] = useState('TypeScript, Next.js, Python');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);

    try {
      const success = await signup({
        full_name: fullName,
        username: username.toLowerCase().replace(/[^a-z0-9_]/g, ''),
        email,
        password,
        role,
        college,
        skills: skillsArray,
        interests: ['Hackathons', 'Open Source', 'System Architecture'],
      });

      if (success) {
        router.push('/dashboard');
      } else {
        setError('Signup could not be completed. Please check your details.');
      }
    } catch {
      setError('An unexpected error occurred during account creation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080B10] text-white relative">
      <Navbar />
      <ToastContainer />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="w-full max-w-lg">
          <div className="rounded-3xl border border-white/10 bg-[#0D131F]/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <BrandLogo variant="symbol" size="lg" withGlow={true} />
              </div>
              <h1 className="font-heading text-2xl font-bold text-white tracking-tight">Join FIE COMMUNITY</h1>
              <p className="text-xs text-slate-400 mt-1">
                Where Ideas Find Their Team — Connect. Collaborate. Create.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ada Lovelace"
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="adalovelace"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ada@university.edu"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    required
                    minLength={6}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Primary Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#0D131F] text-sm text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Full-Stack Engineer">Full-Stack Engineer</option>
                    <option value="Frontend Specialist">Frontend Specialist</option>
                    <option value="Backend & Systems">Backend & Systems</option>
                    <option value="AI/ML Engineer">AI/ML Engineer</option>
                    <option value="Web3 & Smart Contracts">Web3 & Smart Contracts</option>
                    <option value="UI/UX & Pitch Designer">UI/UX & Pitch Designer</option>
                    <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">College / Organization</label>
                  <div className="relative">
                    <School className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. Stanford / IIT Madras"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Skills (comma separated for matchmaking)
                </label>
                <div className="relative">
                  <Code2 className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="Rust, Next.js, PyTorch, Figma"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-heading font-semibold text-sm bg-orange-500 text-white hover:bg-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {loading ? 'Creating Passport...' : 'Complete Registration'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-6 mt-6 border-t border-white/10 text-center">
              <p className="text-xs text-slate-400">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-orange-400 hover:underline font-semibold">
                  Sign in
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

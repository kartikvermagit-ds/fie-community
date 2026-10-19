'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '@/types';
import { MOCK_USERS } from './mock-data';
import { createClient, isSupabaseConfigured } from './supabase/client';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isDemoMode: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (userData: Partial<UserProfile> & { password?: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  switchDemoUser: (userId: string) => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  availableDemoUsers: UserProfile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(MOCK_USERS[0]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(!isSupabaseConfigured);

  useEffect(() => {
    // Check saved session in localStorage for demo mode or Supabase session
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('buildspace_demo_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
        } catch {
          setUser(MOCK_USERS[0]);
        }
      }
    }

    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            setIsDemoMode(false);
            // Fetch user profile from Supabase
            supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()
              .then(({ data }) => {
                if (data) {
                  setUser(data as UserProfile);
                }
              });
          }
          setIsLoading(false);
        });

        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (session?.user) {
              setIsDemoMode(false);
              const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              if (data) setUser(data as UserProfile);
            } else {
              // Return to demo mode default if logged out
              setIsDemoMode(true);
            }
          }
        );

        return () => {
          authListener?.subscription.unsubscribe();
        };
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    setIsLoading(true);
    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase && password) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setIsLoading(false);
        return !error;
      }
    }

    // Demo Mode fallback login: find user by email or pick first
    const matched = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() || u.username === email
    ) || MOCK_USERS[0];
    
    setUser(matched);
    if (typeof window !== 'undefined') {
      localStorage.setItem('buildspace_demo_user', JSON.stringify(matched));
    }
    setIsLoading(false);
    return true;
  };

  const signup = async (userData: Partial<UserProfile> & { password?: string }): Promise<boolean> => {
    setIsLoading(true);
    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase && userData.email && userData.password) {
        const { error } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              full_name: userData.full_name,
              username: userData.username,
            },
          },
        });
        setIsLoading(false);
        return !error;
      }
    }

    // Demo signup: construct new profile
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      email: userData.email || 'builder@buildspace.dev',
      username: userData.username || 'builder',
      full_name: userData.full_name || 'New Builder',
      avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80`,
      bio: userData.bio || 'Exploring ideas, hackathons and building software.',
      role: userData.role || 'Software Engineer',
      skills: userData.skills || ['JavaScript', 'React', 'Python'],
      interests: userData.interests || ['Hackathons', 'Open Source'],
      is_open_to_collaborate: true,
      karma: 100,
      created_at: new Date().toISOString(),
    };

    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('buildspace_demo_user', JSON.stringify(newUser));
    }
    setIsLoading(false);
    return true;
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) await supabase.auth.signOut();
    }
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('buildspace_demo_user');
    }
  };

  const switchDemoUser = (userId: string) => {
    const target = MOCK_USERS.find((u) => u.id === userId);
    if (target) {
      setUser(target);
      if (typeof window !== 'undefined') {
        localStorage.setItem('buildspace_demo_user', JSON.stringify(target));
      }
    }
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!user) return;
    const merged = { ...user, ...updated };
    setUser(merged);
    if (typeof window !== 'undefined') {
      localStorage.setItem('buildspace_demo_user', JSON.stringify(merged));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isDemoMode,
        login,
        signup,
        logout,
        switchDemoUser,
        updateProfile,
        availableDemoUsers: MOCK_USERS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

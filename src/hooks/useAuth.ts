// Authentication hook
// Manages user login state and authentication functions

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { Profile } from '../types/aircraft';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile from database
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setProfile(null);
    }
  }, []);

  // Check if user is already logged in when app loads
  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // Login function
  const signIn = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In Supabase, we use email for login
      // For username-based login, we'll append a domain
      const email = username.includes('@') ? username : `${username}@atc-trainer.local`;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      setUser(data.user);
      if (data.user) {
        await fetchProfile(data.user.id);
      }
      return { success: true };
    } catch (err: any) {
      setError(err.message || 'Login failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    profile,
    loading,
    error,
    signIn,
    signOut,
    isAuthenticated: !!user
  };
}

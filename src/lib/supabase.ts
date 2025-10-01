// Supabase client setup
// This connects your app to Supabase backend for auth and database

import { createClient } from '@supabase/supabase-js';

// TODO: Replace these with your actual Supabase project credentials
// You'll get these when you create a project at https://supabase.com
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create the Supabase client
// This is used for all database and auth operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for TypeScript autocomplete
export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  created_at: string;
}

export interface Score {
  id: string;
  user_id: string;
  scenario_type: string;
  time_to_solve: number; // seconds
  separation_maintained: boolean;
  min_separation: number; // nautical miles
  created_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  started_at: string;
  ended_at: string | null;
  scenarios_completed: number;
}

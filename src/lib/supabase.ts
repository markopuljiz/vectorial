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
  username: string | null;
  scenario_type: string;
  result: 'success' | 'fail' | 'waste' | null;
  speed_difference: number | null;
  time_to_crossing: number | null;
  angle: number | null;
  created_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  started_at: string;
  ended_at: string | null;
  scenarios_completed: number;
}

// Function to save test score
export async function saveTestScore(
  userId: string,
  username: string,
  result: 'success' | 'fail' | 'waste',
  speedDifference: number,
  timeToCrossing: number,
  angle: number
) {
  const { data, error } = await supabase
    .from('scores')
    .insert({
      user_id: userId,
      username,
      scenario_type: 'test',
      result,
      speed_difference: speedDifference,
      time_to_crossing: timeToCrossing,
      angle
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving test score:', error);
    throw error;
  }

  return data;
}

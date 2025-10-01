# Supabase Setup Guide

This guide will help you set up Supabase for authentication and leaderboard functionality.

## 📋 Prerequisites

- A Supabase account (free tier works great!)
- Basic understanding of SQL

## 🚀 Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Choose an organization
5. Fill in:
   - **Project Name**: ATC Vectoring Trainer
   - **Database Password**: (save this securely!)
   - **Region**: Choose closest to your users
6. Click "Create new project" and wait ~2 minutes

## 🔑 Step 2: Get Your API Credentials

1. In your project dashboard, click on the **Settings** (gear icon) in the sidebar
2. Go to **API** section
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

4. Create a `.env` file in your project root (copy from `.env.example`):
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🗄️ Step 3: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor** (in sidebar)
2. Click "New query"
3. Copy and paste this SQL:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scores table
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  scenario_type TEXT NOT NULL,
  time_to_solve INTEGER NOT NULL, -- seconds
  separation_maintained BOOLEAN NOT NULL,
  min_separation DECIMAL NOT NULL, -- nautical miles
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  scenarios_completed INTEGER DEFAULT 0
);

-- Create indexes for better performance
CREATE INDEX idx_scores_user_id ON scores(user_id);
CREATE INDEX idx_scores_created_at ON scores(created_at);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Profiles: Users can read all profiles, but only update their own
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Scores: Users can read all scores, but only insert their own
CREATE POLICY "Scores are viewable by everyone"
  ON scores FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own scores"
  ON scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Sessions: Users can only see and manage their own sessions
CREATE POLICY "Users can view own sessions"
  ON sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON sessions FOR UPDATE
  USING (auth.uid() = user_id);
```

4. Click "Run" to execute

## 👤 Step 4: Create Pre-generated User Accounts

### Option A: Using Supabase Dashboard (Easy)

1. Go to **Authentication** → **Users** in sidebar
2. Click "Add user"
3. Fill in:
   - **Email**: trainee1@atc-trainer.local
   - **Password**: (create a password)
   - Check "Auto Confirm User"
4. Click "Create user"
5. Repeat for all trainees

### Option B: Using SQL (Bulk Create)

1. Go to **SQL Editor**
2. Run this query for each trainee:

```sql
-- Create auth user and profile
DO $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Insert into auth.users (you'll need to use Supabase admin API for this)
  -- For now, use the dashboard method above
  -- This is just a template for the profile part
  
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at
  ) VALUES (
    uuid_generate_v4(),
    'trainee1@atc-trainer.local',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
  ) RETURNING id INTO new_user_id;
  
  -- Create profile
  INSERT INTO profiles (id, username, full_name)
  VALUES (new_user_id, 'trainee1', 'Trainee One');
END $$;
```

## 📝 Step 5: Test the Setup

1. Make sure your `.env` file is configured
2. Restart your dev server:
```bash
npm run dev
```

3. Try logging in with one of your created accounts:
   - Username: trainee1
   - Password: (whatever you set)

## 🎯 Recommended User Accounts

Create accounts for your trainees:

| Username   | Email                         | Full Name    |
|------------|-------------------------------|--------------|
| trainee1   | trainee1@atc-trainer.local    | Trainee One  |
| trainee2   | trainee2@atc-trainer.local    | Trainee Two  |
| trainee3   | trainee3@atc-trainer.local    | Trainee Three|
| instructor | instructor@atc-trainer.local  | Instructor   |

## 🔒 Security Notes

- The `.local` domain ensures these emails won't conflict with real emails
- Row Level Security (RLS) ensures users can only access their own data
- Never commit your `.env` file to git (it's in `.gitignore`)
- Consider using stronger passwords for production use

## 📊 Viewing Leaderboard Data

To query leaderboard data in SQL Editor:

```sql
-- Top performers by success rate
SELECT 
  p.username,
  COUNT(s.id) as total_scenarios,
  AVG(s.time_to_solve) as avg_time,
  (COUNT(*) FILTER (WHERE s.separation_maintained = true) * 100.0 / COUNT(*)) as success_rate
FROM profiles p
JOIN scores s ON p.id = s.user_id
GROUP BY p.username
ORDER BY success_rate DESC, avg_time ASC
LIMIT 10;
```

## 🆘 Troubleshooting

### Can't connect to Supabase
- Check your `.env` file has correct URL and key
- Make sure you restarted the dev server after creating `.env`

### Login fails
- Verify user was created with "Auto Confirm User" checked
- Check the email format matches: `username@atc-trainer.local`

### Leaderboard not showing data
- Open browser DevTools console to see errors
- Check that scores table has data
- Verify RLS policies are set correctly

## 🎓 Next Steps

1. Implement score tracking in the GamePage component
2. Add real-time leaderboard updates using Supabase subscriptions
3. Create an admin dashboard for instructors
4. Add session analytics and progress tracking

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

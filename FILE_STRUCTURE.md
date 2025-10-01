# 📁 Complete File Structure

This document shows every file in your new React project and what it does.

```
vectorial-react/
│
├── 📄 index.html                  # Entry HTML file (loads React app)
├── 📄 package.json                # Dependencies and scripts
├── 📄 package-lock.json          # Locked dependency versions
├── 📄 tsconfig.json              # TypeScript configuration
├── 📄 tsconfig.node.json         # TypeScript config for build tools
├── 📄 vite.config.ts             # Vite build configuration
├── 📄 .gitignore                 # Files to ignore in git
├── 📄 .env.example               # Template for environment variables
│
├── 📘 README.md                   # Project overview
├── 📘 QUICKSTART.md              # Getting started guide
├── 📘 SUPABASE_SETUP.md          # Backend setup instructions
├── 📘 COMPARISON.md              # Vanilla JS vs React explanation
├── 📘 PROJECT_SUMMARY.md         # This migration summary
├── 📘 FILE_STRUCTURE.md          # This file!
│
├── 📁 public/                     # Static assets (icons, etc.)
│
├── 📁 src/                        # All source code
│   │
│   ├── 📄 main.tsx                # App entry point (starts React)
│   ├── 📄 index.css               # Global base styles
│   ├── 📄 App.tsx                 # Main app component (routing & auth)
│   ├── 📄 App.css                 # Main app styles
│   ├── 📄 vite-env.d.ts          # Vite type definitions
│   │
│   ├── 📁 components/             # Reusable UI components
│   │   ├── 📄 TopControls.tsx          # Settings, New, Zoom buttons
│   │   ├── 📄 BottomControls.tsx       # Heading slider & command display
│   │   ├── 📄 RadarDisplay.tsx         # Main radar screen
│   │   └── 📄 SettingsModal.tsx        # Settings dialog
│   │
│   ├── 📁 pages/                  # Full-page views
│   │   ├── 📄 LoginPage.tsx            # User authentication screen
│   │   ├── 📄 GamePage.tsx             # Main training interface
│   │   └── 📄 LeaderboardPage.tsx      # Scores and rankings
│   │
│   ├── 📁 hooks/                  # Custom React hooks (state management)
│   │   ├── 📄 useGameState.ts          # Game state (aircraft, settings, etc.)
│   │   └── 📄 useAuth.ts               # Authentication logic
│   │
│   ├── 📁 utils/                  # Pure utility functions
│   │   ├── 📄 physics.ts               # CPA calculations, distance, etc.
│   │   └── 📄 aircraftGenerator.ts     # Scenario generation logic
│   │
│   ├── 📁 types/                  # TypeScript type definitions
│   │   └── 📄 aircraft.ts              # Aircraft, Settings, Position types
│   │
│   ├── 📁 lib/                    # External service integrations
│   │   └── 📄 supabase.ts              # Database client & types
│   │
│   └── 📁 styles/                 # Additional CSS files
│       ├── 📄 LoginPage.css            # Login page styles
│       └── 📄 LeaderboardPage.css      # Leaderboard styles
│
└── 📁 node_modules/               # Installed dependencies (88 packages)
```

## 📊 File Count Summary

| Category | Count | Total Lines |
|----------|-------|-------------|
| **Components** | 4 files | ~400 lines |
| **Pages** | 3 files | ~300 lines |
| **Hooks** | 2 files | ~150 lines |
| **Utils** | 2 files | ~300 lines |
| **Types** | 1 file | ~50 lines |
| **Styles** | 3 CSS files | ~600 lines |
| **Config** | 5 files | ~100 lines |
| **Docs** | 6 MD files | ~2000 lines |
| **Total** | **26 files** | **~3900 lines** |

## 🎯 File Purpose Quick Reference

### Core Application Files

| File | What It Does | When to Edit |
|------|--------------|--------------|
| `src/App.tsx` | Main app, handles routing & auth | Add new pages or change navigation |
| `src/main.tsx` | Starts the React app | Rarely (only for global setup) |
| `index.html` | HTML entry point | Change app title or meta tags |

### Components (UI Building Blocks)

| File | What It Does | When to Edit |
|------|--------------|--------------|
| `TopControls.tsx` | Settings/New/Zoom buttons | Change button layout or add controls |
| `BottomControls.tsx` | Heading slider & commands | Adjust slider range or display |
| `RadarDisplay.tsx` | Aircraft, dots, SEP tool | Change visual rendering |
| `SettingsModal.tsx` | Settings dialog | Add/remove setting options |

### Pages (Full Screens)

| File | What It Does | When to Edit |
|------|--------------|--------------|
| `LoginPage.tsx` | User login form | Change login UI or validation |
| `GamePage.tsx` | Training interface wrapper | Add menu items or global controls |
| `LeaderboardPage.tsx` | Scores & rankings | Change leaderboard display |

### Hooks (State Management)

| File | What It Does | When to Edit |
|------|--------------|--------------|
| `useGameState.ts` | Manages aircraft & settings | Add new game state or actions |
| `useAuth.ts` | Handles login/logout | Change auth behavior |

### Utils (Logic & Calculations)

| File | What It Does | When to Edit |
|------|--------------|--------------|
| `physics.ts` | CPA & distance calculations | Adjust physics formulas |
| `aircraftGenerator.ts` | Creates scenarios | Change aircraft generation rules |

### Types (TypeScript Definitions)

| File | What It Does | When to Edit |
|------|--------------|--------------|
| `aircraft.ts` | Type definitions | Add new properties to data structures |

### Configuration Files

| File | What It Does | When to Edit |
|------|--------------|--------------|
| `package.json` | Dependencies & scripts | Add new npm packages |
| `tsconfig.json` | TypeScript settings | Change compiler options (rare) |
| `vite.config.ts` | Build configuration | Add plugins or change port |
| `.env` | Environment variables | Add Supabase credentials |

### Styles (CSS)

| File | What It Does | When to Edit |
|------|--------------|--------------|
| `App.css` | Main game styles | Change colors, sizes, layout |
| `LoginPage.css` | Login screen styles | Customize login appearance |
| `LeaderboardPage.css` | Leaderboard styles | Adjust table or ranking display |

## 🔍 Finding What You Need

### Want to change how aircraft move?
→ `src/utils/aircraftGenerator.ts`

### Want to adjust the radar display?
→ `src/components/RadarDisplay.tsx`

### Want to change colors or styling?
→ `src/App.css` or specific component CSS

### Want to add a new setting?
→ `src/components/SettingsModal.tsx`
→ `src/types/aircraft.ts` (add to Settings interface)

### Want to modify login page?
→ `src/pages/LoginPage.tsx`
→ `src/styles/LoginPage.css`

### Want to change physics calculations?
→ `src/utils/physics.ts`

### Want to add database features?
→ `src/lib/supabase.ts`

## 📝 File Relationships

```
App.tsx (main)
│
├─→ LoginPage.tsx (if not authenticated)
│   └─→ LoginPage.css
│
└─→ GamePage.tsx (if authenticated)
    │
    ├─→ TopControls.tsx
    │
    ├─→ RadarDisplay.tsx
    │   ├─→ uses Aircraft data
    │   └─→ uses physics.ts calculations
    │
    ├─→ BottomControls.tsx
    │   └─→ uses Aircraft data
    │
    └─→ SettingsModal.tsx
        └─→ updates Settings in useGameState

useGameState.ts
│
├─→ uses aircraftGenerator.ts
├─→ uses types/aircraft.ts
└─→ manages all game state

useAuth.ts
│
└─→ uses lib/supabase.ts
```

## 🎨 Style Organization

```
Global Styles:
├─→ index.css (CSS reset & base)
└─→ App.css (main game styles)

Page-Specific:
├─→ styles/LoginPage.css
└─→ styles/LeaderboardPage.css

Inline Styles:
└─→ Dynamic positioning in components
```

## 🚀 Most Important Files

If you're new to React, focus on understanding these first:

1. **`src/App.tsx`** - See how routing works
2. **`src/hooks/useGameState.ts`** - Understand state management
3. **`src/components/RadarDisplay.tsx`** - See how React renders
4. **`src/utils/aircraftGenerator.ts`** - Your core game logic
5. **`README.md`** - Project overview

## 📚 Documentation Files

| Document | Purpose | Read When |
|----------|---------|-----------|
| `README.md` | Project overview | First thing to read |
| `QUICKSTART.md` | Getting started | Setting up the app |
| `SUPABASE_SETUP.md` | Backend setup | Adding authentication |
| `COMPARISON.md` | Before/after | Understanding the migration |
| `PROJECT_SUMMARY.md` | What was built | Seeing the big picture |
| `FILE_STRUCTURE.md` | This file | Finding specific files |

## ✅ Checklist for New Developers

- [ ] Read `README.md`
- [ ] Follow `QUICKSTART.md` to run the app
- [ ] Browse through `src/` folder structure
- [ ] Open `src/App.tsx` and read comments
- [ ] Try changing a color in `App.css`
- [ ] Look at `src/types/aircraft.ts` to see data structures
- [ ] Read `COMPARISON.md` to understand the changes

You're all set! 🎉

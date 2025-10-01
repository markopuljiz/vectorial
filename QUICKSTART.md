# Quick Start Guide - React Version

Welcome to your React ATC Vectoring Trainer! This guide will get you up and running.

## ⚡ 5-Minute Setup (Without Backend)

Want to try the app immediately without setting up authentication? Here's how:

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will open at `http://localhost:3000`

### 3. Skip Login (Temporary)

To skip the login page temporarily for testing, edit `src/App.tsx`:

```typescript
// Comment out this line:
// if (!user) {
//   return <LoginPage onLogin={signIn} />;
// }

// And always show the game:
return (
  <GamePage
    onShowLeaderboard={() => setCurrentPage('leaderboard')}
    onLogout={signOut}
  />
);
```

## 🚀 Full Setup (With Authentication & Leaderboard)

### 1. Set up Supabase

Follow the detailed guide in [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)

**Quick version:**
1. Create project at [supabase.com](https://supabase.com)
2. Copy your URL and API key
3. Create `.env` file:
```bash
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-key
```
4. Run SQL to create tables (see SUPABASE_SETUP.md)
5. Create user accounts

### 2. Install & Run
```bash
npm install
npm run dev
```

### 3. Login
Use one of your created trainee accounts:
- Username: `trainee1`
- Password: (whatever you set)

## 🎮 How to Use the App

### Main Training Screen
- **Click aircraft labels** to select an aircraft
- **Use the slider** at the bottom to issue turn commands (-30° to +30°)
- **Separation tool** (colored lines) shows predicted closest point of approach
- **Gray lines** show the original predicted separation

### Controls
- **Settings** button: Configure scenario difficulty
  - Speed Difference: How different are the aircraft speeds?
  - Time to Crossing: How much time until they meet?
  - Angle: What angle are they approaching at?
- **New** button: Generate a new scenario
- **Zoom** buttons: Adjust view (+ and -)
- **Menu** (☰): Access leaderboard and logout

### Training Tips
1. Select an aircraft by clicking its label
2. Watch the separation tool - aim for >5 NM separation
3. The number shows: `distance time-to-CPA`
  - Example: `5.2 4'` = 5.2 NM separation in 4 minutes
4. Adjust heading early - small changes are better!
5. Click the separation label to move it if it's in the way

## 📁 Project Structure Explained

```
src/
├── components/          # UI Building Blocks
│   ├── TopControls.tsx     # Settings, New, Zoom buttons
│   ├── BottomControls.tsx  # Heading slider
│   ├── RadarDisplay.tsx    # Main radar screen
│   └── SettingsModal.tsx   # Settings dialog
│
├── pages/              # Full-Page Views
│   ├── LoginPage.tsx       # User login
│   ├── GamePage.tsx        # Main training screen
│   └── LeaderboardPage.tsx # Scores and rankings
│
├── hooks/              # React State Logic
│   ├── useGameState.ts     # Aircraft & game state
│   └── useAuth.ts          # Authentication logic
│
├── utils/              # Calculations & Logic
│   ├── physics.ts          # CPA calculations
│   └── aircraftGenerator.ts # Scenario generation
│
├── types/              # TypeScript Definitions
│   └── aircraft.ts         # Data structure types
│
└── lib/                # External Services
    └── supabase.ts         # Database connection
```

## 🐛 Common Issues

### "Module not found" error
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Login doesn't work
- Check `.env` file exists and has correct values
- Verify Supabase user was created with "Auto Confirm User" checked
- Try restarting the dev server

### Aircraft not showing
- Check browser console (F12) for errors
- Make sure `window.innerWidth` and `window.innerHeight` are valid
- Try clicking the "New" button

### Slider not working
- Make sure you've selected an aircraft first (click the label)
- The slider should become active after selection

## 🔧 Development Commands

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check (find TypeScript errors)
npx tsc --noEmit
```

## 📝 Making Changes

### Add a New Component
1. Create file in `src/components/YourComponent.tsx`
2. Export your component function
3. Import and use it in another component

### Modify Game Logic
- Aircraft behavior: `src/utils/aircraftGenerator.ts`
- Physics calculations: `src/utils/physics.ts`
- Game state: `src/hooks/useGameState.ts`

### Change Styling
- Edit `src/App.css` for game styles
- Edit `src/styles/LoginPage.css` for login page
- Edit `src/styles/LeaderboardPage.css` for leaderboard

## 🎓 Learning React

Key concepts to understand:

### 1. Components
Functions that return JSX (HTML-like code):
```typescript
function MyComponent() {
  return <div>Hello!</div>;
}
```

### 2. State
Data that changes over time:
```typescript
const [count, setCount] = useState(0);
// Change it: setCount(count + 1);
```

### 3. Props
Data passed to components:
```typescript
<Aircraft position={pos} callsign="ABC123" />
```

### 4. useEffect
Run code when something changes:
```typescript
useEffect(() => {
  // This runs when 'aircraft' changes
}, [aircraft]);
```

## 🆘 Need Help?

1. Check the [React docs](https://react.dev)
2. Check the [TypeScript handbook](https://www.typescriptlang.org/docs/)
3. Look at console errors in browser DevTools (F12)
4. Read through the comments in the code

## 🚀 Next Features to Add

- [ ] Score tracking after each scenario
- [ ] Real-time leaderboard updates
- [ ] Multiple difficulty modes
- [ ] Instructor dashboard
- [ ] Historical performance graphs
- [ ] Mobile touch gesture support
- [ ] Sound effects for warnings

Happy training! ✈️

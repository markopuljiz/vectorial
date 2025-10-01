# ATC Vectoring Trainer - React Version

A mobile web app for ATC trainees to practice vectoring aircraft.

## 🚀 Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/       # React components (UI pieces)
│   ├── TopControls.tsx
│   ├── BottomControls.tsx
│   ├── RadarDisplay.tsx
│   └── SettingsModal.tsx
├── hooks/           # Custom React hooks (state management)
│   └── useGameState.ts
├── utils/           # Utility functions (calculations)
│   ├── physics.ts
│   └── aircraftGenerator.ts
├── types/           # TypeScript type definitions
│   └── aircraft.ts
├── App.tsx          # Main app component
└── main.tsx         # Entry point
```

## 🎮 How to Use

1. **Select Aircraft**: Click on an aircraft label
2. **Issue Turn Command**: Use the slider at the bottom (-30° to +30°)
3. **Separation Tool**: Shows predicted closest point of approach (CPA)
4. **Settings**: Configure speed difference, angle, and time to crossing
5. **New Scenario**: Generate a new training scenario

## 🔧 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Supabase** - Backend (coming soon)

## 📚 Learning React

This is built with React! Here's what you need to know:

- **Components** = Reusable UI pieces (like LEGO blocks)
- **State** = Data that changes (like aircraft positions)
- **Props** = Data passed to components
- **Hooks** = Special functions (`useState`, `useEffect`)

## 🚧 Coming Soon

- [ ] User authentication with pre-generated credentials
- [ ] Leaderboard system
- [ ] Multiple training modes
- [ ] Performance tracking
- [ ] Supabase integration

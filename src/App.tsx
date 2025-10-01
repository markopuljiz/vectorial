// Main App Component
// Handles authentication and page routing

import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './pages/LoginPage';
import { GamePage } from './pages/GamePage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import './App.css';

type Page = 'game' | 'leaderboard';

function App() {
  const { user, loading, signIn, signOut } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('game');

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!user) {
    return <LoginPage onLogin={signIn} />;
  }

  // Show appropriate page based on navigation
  if (currentPage === 'leaderboard') {
    return (
      <LeaderboardPage 
        onBack={() => setCurrentPage('game')} 
      />
    );
  }

  // Default: show game page
  return (
    <GamePage
      onShowLeaderboard={() => setCurrentPage('leaderboard')}
      onLogout={signOut}
    />
  );
}

export default App;

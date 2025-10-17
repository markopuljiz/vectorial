// Main App Component
// Handles authentication and page routing

import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './pages/LoginPage';
import { GamePage } from './pages/GamePage';
import { StatsPage } from './pages/StatsPage';
import './App.css';

function App() {
  const { user, loading, signIn, profile } = useAuth();
  const [currentPage, setCurrentPage] = useState<'game' | 'stats'>('game');

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

  // Show stats page if selected and user has permission
  if (currentPage === 'stats' && (profile?.user_type === 'admin' || profile?.user_type === 'course_manager')) {
    return <StatsPage onBack={() => setCurrentPage('game')} />;
  }

  // Show game page
  return <GamePage onNavigateToStats={() => setCurrentPage('stats')} />;
}

export default App;

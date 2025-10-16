// Main App Component
// Handles authentication and page routing

import { useAuth } from './hooks/useAuth';
import { LoginPage } from './pages/LoginPage';
import { GamePage } from './pages/GamePage';
import './App.css';

function App() {
  const { user, loading, signIn } = useAuth();

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

  // Show game page
  return <GamePage />;
}

export default App;

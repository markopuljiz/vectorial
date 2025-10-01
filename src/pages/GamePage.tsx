// Game page - main training simulator
// This wraps the radar training interface

import { useState, useEffect } from 'react';
import { TopControls } from '../components/TopControls';
import { RadarDisplay } from '../components/RadarDisplay';
import { BottomControls } from '../components/BottomControls';
import { SettingsModal } from '../components/SettingsModal';
import { useGameState } from '../hooks/useGameState';
import '../App.css';

interface GamePageProps {
  onShowLeaderboard: () => void;
  onLogout: () => void;
}

export function GamePage({ onShowLeaderboard, onLogout }: GamePageProps) {
  const {
    aircraft,
    selectedAircraft,
    settings,
    pixelsPerNM,
    panOffset,
    selectAircraft,
    updateAircraftHeading,
    updateSettings,
    newScenario
  } = useGameState();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    newScenario();
  }, [newScenario]);

  const handleZoomIn = () => {
    console.log('Zoom in');
  };

  const handleZoomOut = () => {
    console.log('Zoom out');
  };

  const handleSettingsApply = (newSettings: typeof settings) => {
    updateSettings(newSettings);
    setTimeout(() => newScenario(), 100);
  };

  return (
    <div className="app">
      {/* Menu button */}
      <button 
        className="menu-button"
        onClick={() => setShowMenu(!showMenu)}
      >
        ☰
      </button>

      {/* Dropdown menu */}
      {showMenu && (
        <div className="menu-dropdown">
          <button onClick={() => { onShowLeaderboard(); setShowMenu(false); }}>
            Leaderboard
          </button>
          <button onClick={() => { onLogout(); setShowMenu(false); }}>
            Logout
          </button>
        </div>
      )}

      <TopControls
        onNew={newScenario}
        onSettings={() => setIsSettingsOpen(true)}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
      
      <RadarDisplay
        aircraft={aircraft}
        selectedAircraft={selectedAircraft}
        onAircraftSelect={selectAircraft}
        panOffset={panOffset}
        pixelsPerNM={pixelsPerNM}
      />
      
      <BottomControls
        selectedAircraft={selectedAircraft}
        onHeadingChange={updateAircraftHeading}
      />
      
      <SettingsModal
        isOpen={isSettingsOpen}
        currentSettings={settings}
        onClose={() => setIsSettingsOpen(false)}
        onApply={handleSettingsApply}
      />
    </div>
  );
}

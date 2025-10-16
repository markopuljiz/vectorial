// Game page - main training simulator
// This wraps the radar training interface

import { useState, useEffect } from 'react';
import { TopControls } from '../components/TopControls';
import { RadarDisplay } from '../components/RadarDisplay';
import { BottomControls } from '../components/BottomControls';
import { SettingsModal } from '../components/SettingsModal';
import { useGameState } from '../hooks/useGameState';
import '../App.css';

export function GamePage() {
  const {
    aircraft,
    selectedAircraft,
    settings,
    pixelsPerNM,
    panOffset,
    selectAircraft,
    updateAircraftHeading,
    updateSettings,
    newScenario,
    setPanOffset,
    zoomIn,
    zoomOut
  } = useGameState();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    newScenario();
  }, [newScenario]);

  const handleSettingsApply = (newSettings: typeof settings) => {
    updateSettings(newSettings);
    // newScenario will be called automatically by the useEffect when settings change
  };

  return (
    <div className="app">
      <TopControls
        onNew={newScenario}
        onSettings={() => setIsSettingsOpen(true)}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
      />
      
      <RadarDisplay
        aircraft={aircraft}
        selectedAircraft={selectedAircraft}
        onAircraftSelect={selectAircraft}
        panOffset={panOffset}
        setPanOffset={setPanOffset}
        pixelsPerNM={pixelsPerNM}
      />
      
      <BottomControls
        aircraft={aircraft}
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

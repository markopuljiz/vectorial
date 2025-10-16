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
  const [mode, setMode] = useState<'practice' | 'test'>('practice');
  const [submitted, setSubmitted] = useState(false);

  // Reset submitted when switching modes
  useEffect(() => {
    setSubmitted(false);
  }, [mode]);

  useEffect(() => {
    newScenario();
    setSubmitted(false);
  }, [newScenario]);

  const handleSettingsApply = (newSettings: typeof settings) => {
    updateSettings(newSettings);
    // newScenario will be called automatically by the useEffect when settings change
  };

  const handleSubmit = () => {
    if (mode === 'test') {
      setSubmitted(true);
    }
  };

  return (
    <div className="app">
      <TopControls
        onNew={() => {
          setSubmitted(false);
          newScenario();
        }}
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
        mode={mode}
        submitted={submitted}
      />
      
      <BottomControls
        aircraft={aircraft}
        selectedAircraft={selectedAircraft}
        onHeadingChange={updateAircraftHeading}
        mode={mode}
        submitted={submitted}
        onSubmit={handleSubmit}
      />
      
      <SettingsModal
        isOpen={isSettingsOpen}
        currentSettings={settings}
        onClose={() => setIsSettingsOpen(false)}
        onApply={handleSettingsApply}
        mode={mode}
        setMode={setMode}
      />
    </div>
  );
}

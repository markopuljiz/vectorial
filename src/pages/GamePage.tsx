// Game page - main training simulator
// This wraps the radar training interface

import { useState, useEffect } from 'react';
import { TopControls } from '../components/TopControls';
import { RadarDisplay } from '../components/RadarDisplay';
import { BottomControls } from '../components/BottomControls';
import { SettingsModal } from '../components/SettingsModal';
import { useGameState } from '../hooks/useGameState';
import { useAuth } from '../hooks/useAuth';
import { saveTestScore, supabase } from '../lib/supabase';
import { calculateClosestApproach } from '../utils/physics';
import '../App.css';

interface GamePageProps {
  onNavigateToStats: () => void;
}

export function GamePage({ onNavigateToStats }: GamePageProps) {
  const {
    aircraft,
    selectedAircraft,
    settings,
    pixelsPerNM,
    panOffset,
    scenarioMetadata,
    selectAircraft,
    updateAircraftHeading,
    updateSettings,
    newScenario,
    setPanOffset,
    zoomIn,
    zoomOut
  } = useGameState();

  const { user, profile } = useAuth();
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

  const handleSubmit = async () => {
    if (mode === 'test' && user && scenarioMetadata) {
      setSubmitted(true);
      
      // Calculate the final separation with current aircraft directions
      if (aircraft.length === 2) {
        const closestApproach = calculateClosestApproach(
          aircraft[0],
          aircraft[1],
          aircraft[0].direction,
          aircraft[1].direction,
          pixelsPerNM
        );
        
        if (closestApproach) {
          const separation = closestApproach.distance;
          
          // Determine result based on separation
          let result: 'success' | 'fail' | 'waste';
          if (separation < 5) {
            result = 'fail';
          } else if (separation >= 5 && separation <= 10.9) {
            result = 'success';
          } else {
            result = 'waste';
          }
          
          // Fetch username from profile
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('username')
              .eq('id', user.id)
              .single();
            
            const username = profile?.username || 'unknown';
            
            // Save to Supabase
            await saveTestScore(
              user.id,
              username,
              result,
              scenarioMetadata.speedDifference,
              scenarioMetadata.timeToCrossing,
              scenarioMetadata.angle
            );
            console.log('Test score saved successfully');
          } catch (error) {
            console.error('Failed to save test score:', error);
          }
        }
      }
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
        onStats={onNavigateToStats}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        mode={mode}
        submitted={submitted}
        profile={profile}
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

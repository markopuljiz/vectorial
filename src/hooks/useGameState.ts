// Custom React Hook for managing game state
// Hooks let you use React features without writing classes

import { useState, useCallback } from 'react';
import { Aircraft, Settings } from '../types/aircraft';
import { generateAircraftPair } from '../utils/aircraftGenerator';

export function useGameState() {
  // useState is React's way of storing data that can change
  // When you call setAircraft, React automatically re-renders the component
  
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);
  const [pixelsPerNM, setPixelsPerNM] = useState(7);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  
  const [settings, setSettings] = useState<Settings>({
    speedDiff: 'random',
    angle: 'random',
    timeToCrossing: 'random'
  });

  // useCallback memoizes functions so they don't get recreated on every render
  const updateScale = useCallback(() => {
    const randomMinutes = Math.random() * 5 + 4;
    const targetNM = 420 * (randomMinutes / 60);
    const desiredPixelDistance = window.innerWidth / 2;
    const newPixelsPerNM = desiredPixelDistance / targetNM;
    setPixelsPerNM(newPixelsPerNM);
    return newPixelsPerNM;
  }, []);

  const newScenario = useCallback(() => {
    const scale = updateScale();
    const newAircraft = generateAircraftPair(settings, scale);
    setAircraft(newAircraft);
    setSelectedAircraft(null);
    setPanOffset({ x: 0, y: 0 });
  }, [settings, updateScale]);

  const selectAircraft = useCallback((aircraft: Aircraft | null) => {
    setSelectedAircraft(aircraft);
  }, []);

  const updateAircraftHeading = useCallback((turnAngleDegrees: number) => {
    if (!selectedAircraft) return;
    
    setAircraft(prev => prev.map(ac => {
      if (ac.id === selectedAircraft.id) {
        const turnAngleRadians = turnAngleDegrees * (Math.PI / 180);
        return {
          ...ac,
          pendingTurn: turnAngleDegrees,
          direction: ac.originalDirection + turnAngleRadians
        };
      }
      return ac;
    }));
    
    // Also update selected aircraft reference
    setSelectedAircraft(prev => {
      if (!prev) return null;
      const turnAngleRadians = turnAngleDegrees * (Math.PI / 180);
      return {
        ...prev,
        pendingTurn: turnAngleDegrees,
        direction: prev.originalDirection + turnAngleRadians
      };
    });
  }, [selectedAircraft]);

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return {
    aircraft,
    selectedAircraft,
    settings,
    pixelsPerNM,
    panOffset,
    setAircraft,
    selectAircraft,
    updateAircraftHeading,
    updateSettings,
    newScenario,
    setPanOffset
  };
}

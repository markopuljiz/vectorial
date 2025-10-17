// Custom React Hook for managing game state
// Hooks let you use React features without writing classes

import { useState, useCallback } from 'react';
import { Aircraft, Settings, ScenarioMetadata } from '../types/aircraft';
import { generateAircraftPair } from '../utils/aircraftGenerator';

export function useGameState() {
  // useState is React's way of storing data that can change
  // When you call setAircraft, React automatically re-renders the component
  
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);
  const [pixelsPerNM, setPixelsPerNM] = useState(7);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [scenarioMetadata, setScenarioMetadata] = useState<ScenarioMetadata | null>(null);
  
  const [settings, setSettings] = useState<Settings>({
    speedDiff: 'random',
    speedDiffMin: 0,
    speedDiffMax: 150,
    angle: 'random',
    angleMin: 20,
    angleMax: 180,
    timeToCrossing: 'random',
    timeToCrossingMin: 3,
    timeToCrossingMax: 10
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
    const { aircraft: newAircraft, metadata } = generateAircraftPair(settings, scale);
    setAircraft(newAircraft);
    setScenarioMetadata(metadata);
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

  const zoomIn = useCallback(() => {
    const zoomFactor = 1.2; // 20% zoom in
    const newPixelsPerNM = pixelsPerNM * zoomFactor;
    
    // Get center of screen
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Scale aircraft positions
    setAircraft(prev => prev.map(ac => ({
      ...ac,
      x: centerX + (ac.x - centerX) * zoomFactor,
      y: centerY + (ac.y - centerY) * zoomFactor,
      history: ac.history.map(pos => ({
        x: centerX + (pos.x - centerX) * zoomFactor,
        y: centerY + (pos.y - centerY) * zoomFactor
      }))
    })));
    
    // Scale pan offset
    setPanOffset(prev => ({
      x: prev.x * zoomFactor,
      y: prev.y * zoomFactor
    }));
    
    setPixelsPerNM(newPixelsPerNM);
  }, [pixelsPerNM]);

  const zoomOut = useCallback(() => {
    const zoomFactor = 1 / 1.2; // 20% zoom out
    const newPixelsPerNM = pixelsPerNM * zoomFactor;
    
    // Get center of screen
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Scale aircraft positions
    setAircraft(prev => prev.map(ac => ({
      ...ac,
      x: centerX + (ac.x - centerX) * zoomFactor,
      y: centerY + (ac.y - centerY) * zoomFactor,
      history: ac.history.map(pos => ({
        x: centerX + (pos.x - centerX) * zoomFactor,
        y: centerY + (pos.y - centerY) * zoomFactor
      }))
    })));
    
    // Scale pan offset
    setPanOffset(prev => ({
      x: prev.x * zoomFactor,
      y: prev.y * zoomFactor
    }));
    
    setPixelsPerNM(newPixelsPerNM);
  }, [pixelsPerNM]);

  return {
    aircraft,
    selectedAircraft,
    settings,
    pixelsPerNM,
    panOffset,
    scenarioMetadata,
    setAircraft,
    selectAircraft,
    updateAircraftHeading,
    updateSettings,
    newScenario,
    setPanOffset,
    zoomIn,
    zoomOut
  };
}

// Settings modal for configuring scenario parameters

import { useState } from 'react';
import { Settings } from '../types/aircraft';

interface SettingsModalProps {
  isOpen: boolean;
  currentSettings: Settings;
  onClose: () => void;
  onApply: (settings: Settings) => void;
  mode: 'practice' | 'test';
  setMode: (mode: 'practice' | 'test') => void;
}

export function SettingsModal({ isOpen, currentSettings, onClose, onApply, mode, setMode }: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState(currentSettings);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(localSettings);
    onClose();
  };

  const handleSpeedDiffPreset = (preset: 'random' | 'low' | 'medium' | 'high') => {
    let min = 0;
    let max = 150;
    
    switch (preset) {
      case 'random':
        min = 0;
        max = 150;
        break;
      case 'low':
        min = 0;
        max = 30;
        break;
      case 'medium':
        min = 20;
        max = 70;
        break;
      case 'high':
        min = 60;
        max = 150;
        break;
    }
    
    setLocalSettings(prev => ({ 
      ...prev, 
      speedDiff: preset,
      speedDiffMin: min,
      speedDiffMax: max
    }));
  };

  const handleSliderChange = (isMin: boolean, value: number) => {
    setLocalSettings(prev => {
      const newMin = isMin ? value : prev.speedDiffMin;
      const newMax = isMin ? prev.speedDiffMax : value;
      
      // Ensure min doesn't exceed max and vice versa
      return {
        ...prev,
        speedDiff: 'custom',
        speedDiffMin: Math.min(newMin, newMax),
        speedDiffMax: Math.max(newMin, newMax)
      };
    });
  };

  const handleTimeToCrossingPreset = (preset: 'random' | '<5' | '5-8' | '>8') => {
    let min = 3;
    let max = 10;
    
    switch (preset) {
      case 'random':
        min = 3;
        max = 10;
        break;
      case '<5':
        min = 3;
        max = 5;
        break;
      case '5-8':
        min = 5;
        max = 8;
        break;
      case '>8':
        min = 8;
        max = 10;
        break;
    }
    
    setLocalSettings(prev => ({ 
      ...prev, 
      timeToCrossing: preset,
      timeToCrossingMin: min,
      timeToCrossingMax: max
    }));
  };

  const handleTimeSliderChange = (isMin: boolean, value: number) => {
    setLocalSettings(prev => {
      const newMin = isMin ? value : prev.timeToCrossingMin;
      const newMax = isMin ? prev.timeToCrossingMax : value;
      
      // Ensure min doesn't exceed max and vice versa
      return {
        ...prev,
        timeToCrossing: 'custom',
        timeToCrossingMin: Math.min(newMin, newMax),
        timeToCrossingMax: Math.max(newMin, newMax)
      };
    });
  };

  const handleAnglePreset = (preset: 'random' | 'sharp' | 'crossing' | 'opposite') => {
    let min = 20;
    let max = 180;
    
    switch (preset) {
      case 'random':
        min = 20;
        max = 180;
        break;
      case 'sharp':
        min = 20;
        max = 55;
        break;
      case 'crossing':
        min = 55;
        max = 140;
        break;
      case 'opposite':
        min = 140;
        max = 180;
        break;
    }
    
    setLocalSettings(prev => ({ 
      ...prev, 
      angle: preset,
      angleMin: min,
      angleMax: max
    }));
  };

  const handleAngleSliderChange = (isMin: boolean, value: number) => {
    setLocalSettings(prev => {
      const newMin = isMin ? value : prev.angleMin;
      const newMax = isMin ? prev.angleMax : value;
      
      // Ensure min doesn't exceed max and vice versa
      return {
        ...prev,
        angle: 'custom',
        angleMin: Math.min(newMin, newMax),
        angleMax: Math.max(newMin, newMax)
      };
    });
  };

  const SpeedDiffButton = ({ 
    value, 
    label 
  }: { 
    value: 'random' | 'low' | 'medium' | 'high'; 
    label: string;
  }) => (
    <label className={localSettings.speedDiff === value ? 'selected' : ''}>
      <input
        type="radio"
        name="speedDiff"
        value={value}
        checked={localSettings.speedDiff === value}
        onChange={() => handleSpeedDiffPreset(value)}
      />
      {label}
    </label>
  );

  const TimeToCrossingButton = ({ 
    value, 
    label 
  }: { 
    value: 'random' | '<5' | '5-8' | '>8'; 
    label: string;
  }) => (
    <label className={localSettings.timeToCrossing === value ? 'selected' : ''}>
      <input
        type="radio"
        name="timeToCrossing"
        value={value}
        checked={localSettings.timeToCrossing === value}
        onChange={() => handleTimeToCrossingPreset(value)}
      />
      {label}
    </label>
  );

  const AngleButton = ({ 
    value, 
    label 
  }: { 
    value: 'random' | 'sharp' | 'crossing' | 'opposite'; 
    label: string;
  }) => (
    <label className={localSettings.angle === value ? 'selected' : ''}>
      <input
        type="radio"
        name="angle"
        value={value}
        checked={localSettings.angle === value}
        onChange={() => handleAnglePreset(value)}
      />
      {label}
    </label>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">
          <div className="setting-option mode-switch-container">
            <div className="mode-switch">
              <button 
                className={`mode-button ${mode === 'practice' ? 'active' : ''}`}
                onClick={() => setMode('practice')}
              >
                Practice
              </button>
              <button 
                className={`mode-button ${mode === 'test' ? 'active' : ''}`}
                onClick={() => setMode('test')}
              >
                Test
              </button>
            </div>
          </div>

          <div className="setting-option">
            <label>Speed difference: {localSettings.speedDiffMin} - {localSettings.speedDiffMax} kt</label>
            <div className="radio-grid">
              <SpeedDiffButton value="random" label="Random" />
              <SpeedDiffButton value="low" label="Low" />
              <SpeedDiffButton value="medium" label="Medium" />
              <SpeedDiffButton value="high" label="High" />
            </div>
            <div className="dual-slider-container">
              <div className="dual-slider-wrapper">
                <input
                  type="range"
                  className="dual-slider dual-slider-min"
                  min="0"
                  max="150"
                  value={localSettings.speedDiffMin}
                  onChange={(e) => handleSliderChange(true, parseInt(e.target.value))}
                  style={{
                    background: `linear-gradient(to right, #333 0%, #333 ${(localSettings.speedDiffMin / 150) * 100}%, #4a9eff ${(localSettings.speedDiffMin / 150) * 100}%, #4a9eff ${(localSettings.speedDiffMax / 150) * 100}%, #333 ${(localSettings.speedDiffMax / 150) * 100}%, #333 100%)`
                  }}
                />
                <input
                  type="range"
                  className="dual-slider dual-slider-max"
                  min="0"
                  max="150"
                  value={localSettings.speedDiffMax}
                  onChange={(e) => handleSliderChange(false, parseInt(e.target.value))}
                  style={{ background: 'none' }}
                />
              </div>
            </div>
          </div>

          <div className="setting-option">
            <label>Time to crossing: {localSettings.timeToCrossingMin} - {localSettings.timeToCrossingMax} min</label>
            <div className="radio-grid">
              <TimeToCrossingButton value="random" label="Random" />
              <TimeToCrossingButton value="<5" label="<5 min" />
              <TimeToCrossingButton value="5-8" label="5-8 min" />
              <TimeToCrossingButton value=">8" label=">8 min" />
            </div>
            <div className="dual-slider-container">
              <div className="dual-slider-wrapper">
                <input
                  type="range"
                  className="dual-slider dual-slider-min"
                  min="3"
                  max="10"
                  step="0.5"
                  value={localSettings.timeToCrossingMin}
                  onChange={(e) => handleTimeSliderChange(true, parseFloat(e.target.value))}
                  style={{
                    background: `linear-gradient(to right, #333 0%, #333 ${((localSettings.timeToCrossingMin - 3) / 7) * 100}%, #4a9eff ${((localSettings.timeToCrossingMin - 3) / 7) * 100}%, #4a9eff ${((localSettings.timeToCrossingMax - 3) / 7) * 100}%, #333 ${((localSettings.timeToCrossingMax - 3) / 7) * 100}%, #333 100%)`
                  }}
                />
                <input
                  type="range"
                  className="dual-slider dual-slider-max"
                  min="3"
                  max="10"
                  step="0.5"
                  value={localSettings.timeToCrossingMax}
                  onChange={(e) => handleTimeSliderChange(false, parseFloat(e.target.value))}
                  style={{ background: 'none' }}
                />
              </div>
            </div>
          </div>

          <div className="setting-option">
            <label>Angle: {localSettings.angleMin}° - {localSettings.angleMax}°</label>
            <div className="radio-grid">
              <AngleButton value="random" label="Random" />
              <AngleButton value="sharp" label="Sharp" />
              <AngleButton value="crossing" label="Crossing" />
              <AngleButton value="opposite" label="Opposite" />
            </div>
            <div className="dual-slider-container">
              <div className="dual-slider-wrapper">
                <input
                  type="range"
                  className="dual-slider dual-slider-min"
                  min="20"
                  max="180"
                  step="5"
                  value={localSettings.angleMin}
                  onChange={(e) => handleAngleSliderChange(true, parseInt(e.target.value))}
                  style={{
                    background: `linear-gradient(to right, #333 0%, #333 ${((localSettings.angleMin - 20) / 160) * 100}%, #4a9eff ${((localSettings.angleMin - 20) / 160) * 100}%, #4a9eff ${((localSettings.angleMax - 20) / 160) * 100}%, #333 ${((localSettings.angleMax - 20) / 160) * 100}%, #333 100%)`
                  }}
                />
                <input
                  type="range"
                  className="dual-slider dual-slider-max"
                  min="20"
                  max="180"
                  step="5"
                  value={localSettings.angleMax}
                  onChange={(e) => handleAngleSliderChange(false, parseInt(e.target.value))}
                  style={{ background: 'none' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-button" onClick={handleApply}>OK</button>
        </div>
      </div>
    </div>
  );
}

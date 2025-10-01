// Settings modal for configuring scenario parameters

import { useState } from 'react';
import { Settings } from '../types/aircraft';

interface SettingsModalProps {
  isOpen: boolean;
  currentSettings: Settings;
  onClose: () => void;
  onApply: (settings: Settings) => void;
}

export function SettingsModal({ isOpen, currentSettings, onClose, onApply }: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState(currentSettings);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(localSettings);
    onClose();
  };

  const RadioOption = ({ 
    name, 
    value, 
    label, 
    currentValue 
  }: { 
    name: string; 
    value: string; 
    label: string; 
    currentValue: string;
  }) => (
    <label className={currentValue === value ? 'selected' : ''}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={currentValue === value}
        onChange={(e) => setLocalSettings(prev => ({ ...prev, [name]: e.target.value }))}
      />
      {label}
    </label>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">
          <div className="setting-option">
            <label>Speed Difference</label>
            <div className="radio-grid">
              <RadioOption name="speedDiff" value="random" label="Random" currentValue={localSettings.speedDiff} />
              <RadioOption name="speedDiff" value="low" label="Low" currentValue={localSettings.speedDiff} />
              <RadioOption name="speedDiff" value="medium" label="Medium" currentValue={localSettings.speedDiff} />
              <RadioOption name="speedDiff" value="high" label="High" currentValue={localSettings.speedDiff} />
            </div>
          </div>

          <div className="setting-option">
            <label>Time to Crossing</label>
            <div className="radio-grid">
              <RadioOption name="timeToCrossing" value="random" label="Random" currentValue={localSettings.timeToCrossing} />
              <RadioOption name="timeToCrossing" value="<6" label="<6 min" currentValue={localSettings.timeToCrossing} />
              <RadioOption name="timeToCrossing" value="6-9" label="6-9 min" currentValue={localSettings.timeToCrossing} />
              <RadioOption name="timeToCrossing" value=">9" label=">9 min" currentValue={localSettings.timeToCrossing} />
            </div>
          </div>

          <div className="setting-option">
            <label>Angle</label>
            <div className="radio-grid">
              <RadioOption name="angle" value="random" label="Random" currentValue={localSettings.angle} />
              <RadioOption name="angle" value="sharp" label="Sharp" currentValue={localSettings.angle} />
              <RadioOption name="angle" value="crossing" label="Crossing" currentValue={localSettings.angle} />
              <RadioOption name="angle" value="opposite" label="Opposite" currentValue={localSettings.angle} />
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

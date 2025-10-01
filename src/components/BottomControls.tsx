// Bottom controls with heading slider
// Shows selected aircraft and allows heading changes

import { Aircraft } from '../types/aircraft';

interface BottomControlsProps {
  selectedAircraft: Aircraft | null;
  onHeadingChange: (degrees: number) => void;
}

export function BottomControls({ selectedAircraft, onHeadingChange }: BottomControlsProps) {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onHeadingChange(value);
  };

  const getCommandText = () => {
    if (!selectedAircraft) {
      return 'Select an aircraft to issue turn command';
    }
    
    const turnDegrees = selectedAircraft.pendingTurn;
    if (turnDegrees === 0) {
      return `${selectedAircraft.callsign} - No turn command`;
    }
    
    const direction = turnDegrees > 0 ? 'right' : 'left';
    const newHeading = Math.round(
      ((selectedAircraft.originalDirection * 180 / Math.PI + turnDegrees) % 360 + 360) % 360
    );
    
    return `${selectedAircraft.callsign} turn ${direction} heading ${newHeading}`;
  };

  return (
    <div className="bottom-controls">
      <div className="command-display">{getCommandText()}</div>
      <div className="slider-container">
        <div className="slider-labels">
          <span>-30</span>
          <span>-20</span>
          <span>-10</span>
          <span>0</span>
          <span>10</span>
          <span>20</span>
          <span>30</span>
        </div>
        <input
          type="range"
          className="heading-slider"
          min="-30"
          max="30"
          value={selectedAircraft?.pendingTurn || 0}
          step="5"
          onChange={handleSliderChange}
          disabled={!selectedAircraft}
        />
      </div>
    </div>
  );
}

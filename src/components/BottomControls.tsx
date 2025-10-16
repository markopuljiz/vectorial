// Bottom controls with heading slider
// Shows all aircraft commands and allows heading changes

import { Aircraft } from '../types/aircraft';

interface BottomControlsProps {
  aircraft: Aircraft[];
  selectedAircraft: Aircraft | null;
  onHeadingChange: (degrees: number) => void;
}

export function BottomControls({ aircraft, selectedAircraft, onHeadingChange }: BottomControlsProps) {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onHeadingChange(value);
  };

  const getCommandText = (ac: Aircraft, isSelected: boolean) => {
    const turnDegrees = ac.pendingTurn;
    
    // If no turn command, show "CALLSIGN..."
    if (turnDegrees === 0) {
      return (
        <div key={ac.id} className={isSelected ? 'command-line selected' : 'command-line'}>
          {ac.callsign}...
        </div>
      );
    }
    
    const direction = turnDegrees > 0 ? 'right' : 'left';
    const absTurn = Math.abs(turnDegrees);
    
    return (
      <div key={ac.id} className={isSelected ? 'command-line selected' : 'command-line'}>
        {ac.callsign} turn {direction} {absTurn} degrees
      </div>
    );
  };

  const aircraftWithCommands = aircraft.filter(ac => ac.pendingTurn !== 0);
  const showSelectedWithoutCommand = selectedAircraft && selectedAircraft.pendingTurn === 0;

  return (
    <div className="bottom-controls">
      <div className="command-display">
        {!selectedAircraft && aircraftWithCommands.length === 0 && 'Select an aircraft to issue turn command'}
        {showSelectedWithoutCommand && getCommandText(selectedAircraft, true)}
        {aircraftWithCommands.map(ac => getCommandText(ac, selectedAircraft?.id === ac.id))}
      </div>
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

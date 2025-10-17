// Top control buttons component
// React components are functions that return HTML-like JSX

import { Profile } from '../types/aircraft';

interface TopControlsProps {
  onNew: () => void;
  onSettings: () => void;
  onStats?: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  mode: 'practice' | 'test';
  submitted: boolean;
  profile: Profile | null;
}

export function TopControls({ onNew, onSettings, onStats, onZoomIn, onZoomOut, mode, submitted, profile }: TopControlsProps) {
  const showStats = profile?.user_type === 'admin' || profile?.user_type === 'course_manager';
  
  return (
    <div className="top-controls">
      <button onClick={onSettings}>Settings</button>
      {showStats && <button onClick={onStats}>Stats</button>}
      <button onClick={onNew} disabled={mode === 'test' && !submitted}>New</button>
      <div className="zoom-controls">
        <button onClick={onZoomOut}>-</button>
        <button onClick={onZoomIn}>+</button>
      </div>
    </div>
  );
}

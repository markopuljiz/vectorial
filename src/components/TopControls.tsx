// Top control buttons component
// React components are functions that return HTML-like JSX

interface TopControlsProps {
  onNew: () => void;
  onSettings: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export function TopControls({ onNew, onSettings, onZoomIn, onZoomOut }: TopControlsProps) {
  return (
    <div className="top-controls">
      <button onClick={onSettings}>Settings</button>
      <button onClick={onNew}>New</button>
      <div className="zoom-controls">
        <button onClick={onZoomOut}>-</button>
        <button onClick={onZoomIn}>+</button>
      </div>
    </div>
  );
}

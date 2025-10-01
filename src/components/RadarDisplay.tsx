// Main radar display component
// Renders aircraft, history dots, separation tool, and labels

import { Aircraft, Position } from '../types/aircraft';
import { calculateClosestApproach, calculateDistance } from '../utils/physics';
import { useState } from 'react';

interface RadarDisplayProps {
  aircraft: Aircraft[];
  selectedAircraft: Aircraft | null;
  onAircraftSelect: (aircraft: Aircraft) => void;
  panOffset: Position;
  pixelsPerNM: number;
}

export function RadarDisplay({ 
  aircraft, 
  onAircraftSelect, 
  panOffset,
  pixelsPerNM 
}: RadarDisplayProps) {
  const [sepLabelPosition, setSepLabelPosition] = useState(0);

  const renderAircraft = (ac: Aircraft) => (
    <div
      key={ac.id}
      className="radar-track"
      style={{
        left: `${ac.x + panOffset.x}px`,
        top: `${ac.y + panOffset.y}px`
      }}
    />
  );

  const renderHistoryDots = () => {
    return aircraft.flatMap(ac =>
      ac.history.map((pos, idx) => (
        <div
          key={`${ac.id}-history-${idx}`}
          className="history-dot"
          style={{
            left: `${pos.x + panOffset.x}px`,
            top: `${pos.y + panOffset.y}px`
          }}
        />
      ))
    );
  };

  const renderLabel = (ac: Aircraft) => {
    const offset = 70;
    const perpAngle1 = ac.direction + Math.PI / 2;
    const perpAngle2 = ac.direction - Math.PI / 2;

    const pos1 = {
      x: ac.x + offset * Math.cos(perpAngle1),
      y: ac.y + offset * Math.sin(perpAngle1)
    };
    const pos2 = {
      x: ac.x + offset * Math.cos(perpAngle2),
      y: ac.y + offset * Math.sin(perpAngle2)
    };

    const distToEdge = (pos: Position) => {
      return Math.min(pos.x, window.innerWidth - pos.x, pos.y, window.innerHeight - pos.y);
    };

    const finalPos = distToEdge(pos1) > distToEdge(pos2) ? pos1 : pos2;

    return (
      <div
        key={`label-${ac.id}`}
        className="track-label"
        style={{
          left: `${finalPos.x + panOffset.x + ac.labelOffsetX}px`,
          top: `${finalPos.y + panOffset.y + ac.labelOffsetY}px`
        }}
        onClick={() => onAircraftSelect(ac)}
      >
        {ac.callsign}<br />
        {ac.flightLevel} N{ac.speedKnots}
      </div>
    );
  };

  const renderSEPTool = () => {
    if (aircraft.length < 2) return null;

    const ac1 = aircraft[0];
    const ac2 = aircraft[1];

    // Calculate for current directions
    const closestApproach = calculateClosestApproach(ac1, ac2, ac1.direction, ac2.direction, pixelsPerNM);
    const originalApproach = calculateClosestApproach(ac1, ac2, ac1.originalDirection, ac2.originalDirection, pixelsPerNM);

    if (!closestApproach) return null;

    const renderLine = (
      start: Position,
      end: Position,
      color: string,
      isOriginal = false
    ) => {
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;

      return (
        <div
          className={`sep-line ${isOriginal ? 'original-sep-line' : ''}`}
          style={{
            left: `${start.x + panOffset.x}px`,
            top: `${start.y + panOffset.y}px`,
            width: `${length}px`,
            transform: `rotate(${angle}deg)`,
            backgroundColor: isOriginal ? '#555' : color
          }}
        />
      );
    };

    const colors = ['#ff69b4', '#87ceeb', '#dda0dd', '#90ee90'];
    const color = colors[ac1.id % colors.length];

    const midX = (closestApproach.aircraft1Pos.x + closestApproach.aircraft2Pos.x) / 2;
    const midY = (closestApproach.aircraft1Pos.y + closestApproach.aircraft2Pos.y) / 2;

    const sepLabelOffset = 30;
    let labelX = midX;
    let labelY = midY;

    switch (sepLabelPosition) {
      case 0: labelX += sepLabelOffset; labelY -= sepLabelOffset; break;
      case 1: labelX += sepLabelOffset; labelY += sepLabelOffset; break;
      case 2: labelX -= sepLabelOffset; labelY += sepLabelOffset; break;
      case 3: labelX -= sepLabelOffset; labelY -= sepLabelOffset; break;
    }

    const distanceToCPA_NM = calculateDistance(ac1, closestApproach.aircraft1Pos) / pixelsPerNM;
    const timeMinutes = Math.round((distanceToCPA_NM / ac1.speedKnots) * 60);
    const distance = closestApproach.distance;
    const displayDistance = distance >= 11 ? Math.round(distance) : distance.toFixed(1);

    return (
      <>
        {originalApproach && (
          <>
            {renderLine(ac1, originalApproach.aircraft1Pos, '#555', true)}
            {renderLine(ac2, originalApproach.aircraft2Pos, '#555', true)}
          </>
        )}
        {renderLine(ac1, closestApproach.aircraft1Pos, color)}
        {renderLine(ac2, closestApproach.aircraft2Pos, color)}
        <div
          className="sep-label"
          style={{
            left: `${labelX + panOffset.x}px`,
            top: `${labelY + panOffset.y}px`,
            color: color
          }}
          onClick={() => setSepLabelPosition((sepLabelPosition + 1) % 4)}
        >
          {displayDistance} {timeMinutes}'
        </div>
      </>
    );
  };

  return (
    <div className="radar-display">
      {renderHistoryDots()}
      {renderSEPTool()}
      {aircraft.map(renderAircraft)}
      {aircraft.map(renderLabel)}
    </div>
  );
}

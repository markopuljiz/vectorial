// Main radar display component
// Renders aircraft, history dots, separation tool, and labels

import { Aircraft, Position } from '../types/aircraft';
import { calculateClosestApproach, calculateDistance } from '../utils/physics';
import { useState, useRef, useCallback } from 'react';

interface RadarDisplayProps {
  aircraft: Aircraft[];
  selectedAircraft: Aircraft | null;
  onAircraftSelect: (aircraft: Aircraft) => void;
  panOffset: Position;
  setPanOffset: (offset: Position) => void;
  pixelsPerNM: number;
  mode: 'practice' | 'test';
  submitted: boolean;
}

export function RadarDisplay({ 
  aircraft, 
  onAircraftSelect, 
  panOffset,
  setPanOffset,
  pixelsPerNM,
  mode,
  submitted
}: RadarDisplayProps) {
  const [sepLabelPosition, setSepLabelPosition] = useState(0);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragStartOffset = useRef({ x: 0, y: 0 });

  // Handle drag start
  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    isDragging.current = true;
    dragStart.current = { x: clientX, y: clientY };
    dragStartOffset.current = { ...panOffset };
  }, [panOffset]);

  // Handle drag move
  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging.current) return;
    
    const deltaX = clientX - dragStart.current.x;
    const deltaY = clientY - dragStart.current.y;
    
    setPanOffset({
      x: dragStartOffset.current.x + deltaX,
      y: dragStartOffset.current.y + deltaY
    });
  }, [setPanOffset]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only drag on primary mouse button and not on labels/interactive elements
    const target = e.target as HTMLElement;
    const isClickableElement = target.classList.contains('track-label') || 
                                target.classList.contains('sep-label');
    
    if (e.button === 0 && !isClickableElement) {
      e.preventDefault();
      handleDragStart(e.clientX, e.clientY);
    }
  }, [handleDragStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    handleDragMove(e.clientX, e.clientY);
  }, [handleDragMove]);

  // Touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const target = e.target as HTMLElement;
      const isClickableElement = target.classList.contains('track-label') || 
                                  target.classList.contains('sep-label');
      
      if (!isClickableElement) {
        const touch = e.touches[0];
        handleDragStart(touch.clientX, touch.clientY);
      }
    }
  }, [handleDragStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      handleDragMove(touch.clientX, touch.clientY);
    }
  }, [handleDragMove]);

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

  const checkLabelOverlap = (pos1: Position, pos2: Position, labelWidth = 80, labelHeight = 40) => {
    return !(
      pos1.x + labelWidth < pos2.x ||
      pos2.x + labelWidth < pos1.x ||
      pos1.y + labelHeight < pos2.y ||
      pos2.y + labelHeight < pos1.y
    );
  };

  const renderLabel = (ac: Aircraft, allAircraft: Aircraft[]) => {
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

    let finalPos = distToEdge(pos1) > distToEdge(pos2) ? pos1 : pos2;

    // Check for overlaps with other aircraft labels and adjust vertically if needed
    const otherAircraft = allAircraft.filter(other => other.id !== ac.id);
    for (const other of otherAircraft) {
      const otherPerpAngle1 = other.direction + Math.PI / 2;
      const otherPerpAngle2 = other.direction - Math.PI / 2;
      
      const otherPos1 = {
        x: other.x + offset * Math.cos(otherPerpAngle1),
        y: other.y + offset * Math.sin(otherPerpAngle1)
      };
      const otherPos2 = {
        x: other.x + offset * Math.cos(otherPerpAngle2),
        y: other.y + offset * Math.sin(otherPerpAngle2)
      };
      
      const otherFinalPos = distToEdge(otherPos1) > distToEdge(otherPos2) ? otherPos1 : otherPos2;
      
      // If labels would overlap
      if (checkLabelOverlap(finalPos, otherFinalPos)) {
        // Position upper aircraft label above, lower aircraft label below
        if (ac.y < other.y) {
          // Current aircraft is above - place label above the track
          finalPos = {
            x: ac.x,
            y: ac.y - offset
          };
        } else {
          // Current aircraft is below - place label below the track
          finalPos = {
            x: ac.x,
            y: ac.y + offset
          };
        }
      }
    }

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

    // In test mode before submit: use original directions (no turns)
    // In test mode after submit OR practice mode: use current directions (with turns)
    const useOriginalDirections = mode === 'test' && !submitted;
    
    const direction1 = useOriginalDirections ? ac1.originalDirection : ac1.direction;
    const direction2 = useOriginalDirections ? ac2.originalDirection : ac2.direction;

    // Calculate closest approach based on the selected directions
    const closestApproach = calculateClosestApproach(ac1, ac2, direction1, direction2, pixelsPerNM);
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

    const color = ac1.sepColor;

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

    // Determine feedback color in test mode after submit
    let feedbackColor = color;
    if (mode === 'test' && submitted) {
      if (distance < 5) {
        feedbackColor = '#ff4444'; // Red for fail
      } else if (distance >= 5 && distance <= 10.9) {
        feedbackColor = '#44ff44'; // Green for success
      } else {
        feedbackColor = '#ffff44'; // Yellow for waste
      }
    }

    return (
      <>
        {originalApproach && mode === 'practice' && (
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
            color: feedbackColor
          }}
          onClick={() => setSepLabelPosition((sepLabelPosition + 1) % 4)}
        >
          {displayDistance} {timeMinutes}'
        </div>
      </>
    );
  };

  return (
    <div 
      className="radar-display"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleDragEnd}
      onTouchCancel={handleDragEnd}
    >
      {renderHistoryDots()}
      {renderSEPTool()}
      {aircraft.map(renderAircraft)}
      {aircraft.map(ac => renderLabel(ac, aircraft))}
    </div>
  );
}

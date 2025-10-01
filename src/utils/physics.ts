// Physics calculations for aircraft movement and collision detection
// These are the same calculations from your original code, just organized

import { Aircraft, Position, ClosestApproach } from '../types/aircraft';

export function calculateDistance(point1: Position, point2: Position): number {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function calculateClosestApproach(
  aircraft1: Aircraft,
  aircraft2: Aircraft,
  dir1: number,
  dir2: number,
  pixelsPerNM: number
): ClosestApproach | null {
  // Calculate relative velocity
  const vx1 = Math.cos(dir1) * aircraft1.speed;
  const vy1 = Math.sin(dir1) * aircraft1.speed;
  const vx2 = Math.cos(dir2) * aircraft2.speed;
  const vy2 = Math.sin(dir2) * aircraft2.speed;
  
  const dvx = vx1 - vx2;
  const dvy = vy1 - vy2;
  
  // Calculate relative position
  const dx = aircraft1.x - aircraft2.x;
  const dy = aircraft1.y - aircraft2.y;
  
  // Time to closest approach
  const dv2 = dvx * dvx + dvy * dvy;
  if (dv2 < 0.001) return null; // Parallel tracks
  
  const t = -(dx * dvx + dy * dvy) / dv2;
  
  if (t < 0) return null; // CPA is in the past
  
  // Positions at closest approach
  const x1 = aircraft1.x + vx1 * t;
  const y1 = aircraft1.y + vy1 * t;
  const x2 = aircraft2.x + vx2 * t;
  const y2 = aircraft2.y + vy2 * t;
  
  const distancePixels = calculateDistance({ x: x1, y: y1 }, { x: x2, y: y2 });
  const distanceNM = distancePixels / pixelsPerNM;
  
  return {
    time: t,
    distance: distanceNM,
    aircraft1Pos: { x: x1, y: y1 },
    aircraft2Pos: { x: x2, y: y2 }
  };
}

export function generateCallsign(): string {
  const callsigns = ['CTN', 'RYR', 'DLH', 'THY', 'AFR', 'BAW', 'KLM', 'SAS', 'AUA', 'SWR'];
  const randomCallsign = callsigns[Math.floor(Math.random() * callsigns.length)];
  const randomNumber = Math.floor(Math.random() * 999) + 1;
  const hasLetter = Math.random() < 0.3;
  const letter = hasLetter ? String.fromCharCode(65 + Math.floor(Math.random() * 26)) : '';
  return `${randomCallsign}${randomNumber}${letter}`;
}

export function generateFlightLevel(): number {
  return (Math.floor(Math.random() * 9) + 32) * 10;
}

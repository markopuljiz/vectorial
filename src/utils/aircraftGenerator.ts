// Aircraft generation logic
// Creates realistic scenarios based on settings

import { Aircraft, Settings } from '../types/aircraft';
import { calculateClosestApproach, calculateDistance, generateCallsign, generateFlightLevel } from './physics';

export function generateAircraftPair(
  settings: Settings,
  pixelsPerNM: number
): Aircraft[] {
  // Initialize with dummy aircraft, will be replaced in loop
  let aircraft1: Aircraft = createSingleAircraft(1);
  let aircraft2: Aircraft = createSingleAircraft(2);
  let separationNM = Infinity;
  let currentDistanceNM = 0;
  let angleOK = false;
  let iterations = 0;

  // Loop until geometric conditions are met
  while ((separationNM >= 5 || currentDistanceNM <= 20 || !angleOK) && iterations < 1000) {
    aircraft1 = createSingleAircraft(1);
    aircraft2 = createSingleAircraft(2);
    
    // Adjust speeds based on settings
    const baseSpeedMin = settings.speedDiff === 'high' ? 350 : 380;
    const baseSpeedMax = settings.speedDiff === 'high' ? 510 : 480;
    aircraft1.speedKnots = Math.floor(Math.random() * (baseSpeedMax - baseSpeedMin + 1)) + baseSpeedMin;

    if (settings.speedDiff !== 'random') {
      const sign = Math.random() < 0.5 ? -1 : 1;
      let diff = 0;
      switch (settings.speedDiff) {
        case 'low':
          diff = Math.floor(Math.random() * 30) + 1; // 1-30
          break;
        case 'medium':
          diff = Math.floor(Math.random() * 30) + 31; // 31-60
          break;
        case 'high':
          diff = Math.floor(Math.random() * 40) + 61; // 61-100
          break;
      }
      aircraft2.speedKnots = aircraft1.speedKnots + (diff * sign);
    } else {
      aircraft2.speedKnots = Math.floor(Math.random() * (baseSpeedMax - baseSpeedMin + 1)) + baseSpeedMin;
    }

    // Update speed in pixels/sec for both
    aircraft1.speed = (aircraft1.speedKnots / 3600) * pixelsPerNM;
    aircraft2.speed = (aircraft2.speedKnots / 3600) * pixelsPerNM;

    // Set direction towards common target
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;
    const topBuffer = 160;
    const bottomBuffer = 160;
    const screenCenterX = displayWidth / 2;
    const screenCenterY = topBuffer + (displayHeight - topBuffer - bottomBuffer) / 2;

    const avgX = (aircraft1.x + aircraft2.x) / 2;
    const avgY = (aircraft1.y + aircraft2.y) / 2;
    const vecX = avgX - screenCenterX;
    const vecY = avgY - screenCenterY;

    const randomFactorX = (Math.random() - 0.5) * displayWidth * 0.3;
    const randomFactorY = (Math.random() - 0.5) * (displayHeight - topBuffer - bottomBuffer) * 0.3;

    const targetX = screenCenterX - vecX + randomFactorX;
    const targetY = screenCenterY - vecY + randomFactorY;

    const dir1 = Math.atan2(targetY - aircraft1.y, targetX - aircraft1.x);
    const dir2 = Math.atan2(targetY - aircraft2.y, targetX - aircraft2.x);

    aircraft1.direction = dir1;
    aircraft1.originalDirection = dir1;
    aircraft2.direction = dir2;
    aircraft2.originalDirection = dir2;
    
    // Angle check
    let angleDiff = Math.abs(dir1 - dir2);
    if (angleDiff > Math.PI) { 
      angleDiff = 2 * Math.PI - angleDiff; 
    }
    const angleDiffDegrees = angleDiff * (180 / Math.PI);

    angleOK = checkAngle(settings.angle, angleDiffDegrees);

    // Calculate predicted closest approach
    const closestApproach = calculateClosestApproach(
      aircraft1, 
      aircraft2, 
      aircraft1.originalDirection, 
      aircraft2.originalDirection,
      pixelsPerNM
    );

    if (closestApproach && closestApproach.distance) {
      separationNM = parseFloat(closestApproach.distance.toString());
    } else {
      separationNM = calculateDistance(aircraft1, aircraft2) / pixelsPerNM;
    }

    currentDistanceNM = calculateDistance(aircraft1, aircraft2) / pixelsPerNM;
    iterations++;
  }

  // Time adjustment
  adjustTimeToCrossing(aircraft1, aircraft2, settings, pixelsPerNM);

  // Pre-populate history dots
  populateHistory(aircraft1);
  populateHistory(aircraft2);

  return [aircraft1, aircraft2];
}

function createSingleAircraft(id: number): Aircraft {
  const displayWidth = window.innerWidth;
  const displayHeight = window.innerHeight;
  const topBuffer = 160;
  const bottomBuffer = 160;
  const edgeMargin = 60;

  let x: number, y: number;
  const edge = Math.floor(Math.random() * 4);
  
  switch (edge) {
    case 0: // Top
      x = Math.random() * (displayWidth - 100) + 50;
      y = topBuffer;
      break;
    case 1: // Right
      x = displayWidth - edgeMargin;
      y = Math.random() * (displayHeight - topBuffer - bottomBuffer) + topBuffer;
      break;
    case 2: // Bottom
      x = Math.random() * (displayWidth - 100) + 50;
      y = displayHeight - bottomBuffer;
      break;
    case 3: // Left
    default:
      x = edgeMargin;
      y = Math.random() * (displayHeight - topBuffer - bottomBuffer) + topBuffer;
      break;
  }

  return {
    id,
    x,
    y,
    direction: 0,
    originalDirection: 0,
    speed: 0,
    speedKnots: 0,
    callsign: generateCallsign(),
    flightLevel: generateFlightLevel(),
    history: [],
    pendingTurn: 0,
    labelOffsetX: 0,
    labelOffsetY: 0
  };
}

function checkAngle(setting: string, angleDiffDegrees: number): boolean {
  switch (setting) {
    case 'random':
      return true;
    case 'sharp': // 20-55
      return angleDiffDegrees >= 20 && angleDiffDegrees <= 55;
    case 'crossing': // 55-140
      return angleDiffDegrees > 55 && angleDiffDegrees <= 140;
    case 'opposite': // 140-180
      return angleDiffDegrees > 140 && angleDiffDegrees <= 180;
    default:
      return true;
  }
}

function adjustTimeToCrossing(
  aircraft1: Aircraft,
  aircraft2: Aircraft,
  settings: Settings,
  pixelsPerNM: number
): void {
  const cpa = calculateClosestApproach(
    aircraft1,
    aircraft2,
    aircraft1.originalDirection,
    aircraft2.originalDirection,
    pixelsPerNM
  );

  if (cpa && cpa.time > 0) {
    let targetTime: number;
    
    if (settings.timeToCrossing !== 'random') {
      switch (settings.timeToCrossing) {
        case '<6':
          targetTime = Math.random() * 180 + 180; // 3-6 mins
          break;
        case '6-9':
          targetTime = Math.random() * 180 + 360; // 6-9 mins
          break;
        case '>9':
          targetTime = Math.random() * 300 + 540; // 9-14 mins
          break;
        default:
          targetTime = cpa.time;
      }
    } else {
      // For random, adjust only if outside 3-14 minute range
      const minTime = 180;
      const maxTime = 840;
      targetTime = Math.max(minTime, Math.min(maxTime, cpa.time));
    }

    const timeAdjustment = cpa.time - targetTime;

    // Move aircraft along their tracks
    [aircraft1, aircraft2].forEach(ac => {
      const distanceToMove = ac.speed * timeAdjustment;
      ac.x += distanceToMove * Math.cos(ac.originalDirection);
      ac.y += distanceToMove * Math.sin(ac.originalDirection);
    });
  }
}

function populateHistory(aircraft: Aircraft): void {
  const dotSpacingPixels = aircraft.speed * 4; // 4-second interval
  
  for (let j = 1; j <= 5; j++) {
    const historyX = aircraft.x - j * dotSpacingPixels * Math.cos(aircraft.direction);
    const historyY = aircraft.y - j * dotSpacingPixels * Math.sin(aircraft.direction);
    aircraft.history.push({ x: historyX, y: historyY });
  }
}

// Type definitions for the ATC app
// This tells TypeScript what shape your data has, helping catch bugs early

export interface Aircraft {
  id: number;
  x: number;
  y: number;
  direction: number; // radians
  originalDirection: number; // radians
  speed: number; // pixels per second
  speedKnots: number;
  callsign: string;
  flightLevel: number;
  history: Position[];
  pendingTurn: number; // degrees
  labelOffsetX: number;
  labelOffsetY: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Settings {
  speedDiff: 'random' | 'low' | 'medium' | 'high';
  angle: 'random' | 'sharp' | 'crossing' | 'opposite';
  timeToCrossing: 'random' | '<6' | '6-9' | '>9';
}

export interface ClosestApproach {
  time: number; // seconds
  distance: number; // nautical miles
  aircraft1Pos: Position;
  aircraft2Pos: Position;
}

export interface GameState {
  aircraft: Aircraft[];
  selectedAircraft: Aircraft | null;
  settings: Settings;
  pixelsPerNM: number;
  panOffset: Position;
}

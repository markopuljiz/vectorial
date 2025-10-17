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
  sepColor: string; // hex color for SEP tool
}

export interface Position {
  x: number;
  y: number;
}

export interface Settings {
  speedDiff: 'random' | 'low' | 'medium' | 'high' | 'custom';
  speedDiffMin: number; // knots
  speedDiffMax: number; // knots
  angle: 'random' | 'sharp' | 'crossing' | 'opposite' | 'custom';
  angleMin: number; // degrees
  angleMax: number; // degrees
  timeToCrossing: 'random' | '<5' | '5-8' | '>8' | 'custom';
  timeToCrossingMin: number; // minutes
  timeToCrossingMax: number; // minutes
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

export interface ScenarioMetadata {
  speedDifference: number; // knots
  angle: number; // degrees
  timeToCrossing: number; // minutes
}

export type UserType = 'trainee' | 'course_manager' | 'admin';

export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  user_type: UserType;
  created_at: string;
}

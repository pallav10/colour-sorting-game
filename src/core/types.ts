/**
 * Core type definitions for the Color Sorting Game
 */

export interface Segment {
  color: string; // hex color code
  id: string; // unique identifier for animation tracking
}

export interface Tube {
  id: number;
  segments: Segment[]; // ordered from bottom to top
  capacity: number; // dynamic capacity based on difficulty level
}

export interface Move {
  sourceTubeId: number;
  destinationTubeId: number;
  segmentsMoved: number;
  timestamp: number;
}

export interface LevelConfig {
  levelId: number;
  colors: string[]; // list of colors used in this level
  initialTubes: Tube[];
  maxUndos?: number; // optional undo limit
}

export interface GameState {
  tubes: Tube[];
  selectedTubeId: number | null;
  moveHistory: Move[];
  levelConfig: LevelConfig;
  isCompleted: boolean;
  moveCount: number;
  currentLevel: number;
  optimalMoves: number | null; // Calculated minimum moves to solve the level
}

export interface ValidationResult {
  isValid: boolean;
  reason?: string;
}

export interface MoveResult {
  success: boolean;
  newSourceTube: Tube;
  newDestTube: Tube;
  segmentsMoved: number;
}

/**
 * Undo System Module
 * Manages move history and undo/redo functionality
 */

import type { Move, Tube } from './types';
import { applyMoveToTubes } from './moveExecution';

/**
 * Record a move in the history
 */
export const recordMove = (
  history: Move[],
  sourceId: number,
  destId: number,
  segmentsMoved: number
): Move[] => {
  const move: Move = {
    sourceTubeId: sourceId,
    destinationTubeId: destId,
    segmentsMoved,
    timestamp: Date.now(),
  };

  return [...history, move];
};

/**
 * Undo the last move
 * Returns the reversed move applied to the tubes
 *
 * To undo, we reverse the source and destination
 */
export const undoLastMove = (
  tubes: Tube[],
  history: Move[]
): { tubes: Tube[]; newHistory: Move[]; success: boolean } => {
  if (history.length === 0) {
    return {
      tubes,
      newHistory: history,
      success: false,
    };
  }

  // Get the last move
  const lastMove = history[history.length - 1];

  // Reverse the move (swap source and destination)
  // The number of segments to move back is the same
  const reverseResult = applyMoveToTubes(
    tubes,
    lastMove.destinationTubeId, // Now the source
    lastMove.sourceTubeId // Now the destination
  );

  if (!reverseResult.success) {
    // This shouldn't happen in a well-designed game
    // but we handle it gracefully
    return {
      tubes,
      newHistory: history,
      success: false,
    };
  }

  // Remove the last move from history
  const newHistory = history.slice(0, -1);

  return {
    tubes: reverseResult.tubes,
    newHistory,
    success: true,
  };
};

/**
 * Check if undo is possible
 */
export const canUndo = (history: Move[], maxUndos?: number): boolean => {
  if (history.length === 0) {
    return false;
  }

  if (maxUndos !== undefined && history.length === 0) {
    return false;
  }

  return true;
};

/**
 * Get remaining undo count (if limited)
 */
export const getRemainingUndos = (history: Move[], maxUndos?: number): number | null => {
  if (maxUndos === undefined) {
    return null; // Unlimited
  }

  return Math.max(0, maxUndos - history.length);
};

/**
 * Win Condition Module
 * Determines when a level is completed successfully
 */

import type { Tube } from './types';
import { isTubeEmpty, isTubeFull } from '../utils/helpers';

/**
 * Check if a single tube meets completion criteria
 *
 * A tube is complete if:
 * - It is completely empty, OR
 * - It contains exactly 4 segments of the same color (full and uniform)
 */
export const isTubeComplete = (tube: Tube): boolean => {
  // Empty tubes are complete
  if (isTubeEmpty(tube)) {
    return true;
  }

  // Tube must be full to be complete (if not empty)
  if (!isTubeFull(tube)) {
    return false;
  }

  // Check if all segments are the same color
  const firstColor = tube.segments[0].color;
  return tube.segments.every((segment) => segment.color === firstColor);
};

/**
 * Check if the entire level is complete
 *
 * A level is complete when ALL tubes meet the completion criteria
 */
export const isLevelComplete = (tubes: Tube[]): boolean => {
  // All tubes must be complete
  return tubes.every((tube) => isTubeComplete(tube));
};

/**
 * Get statistics about the current game state
 * Useful for UI display
 */
export const getGameStats = (tubes: Tube[]) => {
  const completeTubes = tubes.filter((tube) => isTubeComplete(tube)).length;
  const emptyTubes = tubes.filter((tube) => isTubeEmpty(tube)).length;
  const fullTubes = tubes.filter((tube) => isTubeFull(tube)).length;

  return {
    totalTubes: tubes.length,
    completeTubes,
    emptyTubes,
    fullTubes,
    progressPercentage: Math.round((completeTubes / tubes.length) * 100),
  };
};

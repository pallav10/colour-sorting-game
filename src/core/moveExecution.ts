/**
 * Move Execution Module
 * Handles the execution of validated moves and segment transfers
 */

import type { Tube, Segment, MoveResult } from './types';
import { getTopSegment, getAvailableSpace } from '../utils/helpers';
import { validateMove } from './moveValidation';

/**
 * Get all contiguous segments of the same color from the top of a tube
 * These are the segments that will be transferred in a move
 */
export const getContiguousTopSegments = (tube: Tube): Segment[] => {
  if (tube.segments.length === 0) {
    return [];
  }

  const topSegment = getTopSegment(tube);
  if (!topSegment) {
    return [];
  }

  const contiguousSegments: Segment[] = [];
  const targetColor = topSegment.color;

  // Start from the top and work backwards
  for (let i = tube.segments.length - 1; i >= 0; i--) {
    if (tube.segments[i].color === targetColor) {
      contiguousSegments.unshift(tube.segments[i]); // Add to front to maintain order
    } else {
      break; // Stop when we hit a different color
    }
  }

  return contiguousSegments;
};

/**
 * Calculate how many segments can actually be transferred
 * Limited by destination capacity
 */
export const calculateTransferCount = (sourceTube: Tube, destTube: Tube): number => {
  const contiguousSegments = getContiguousTopSegments(sourceTube);
  const availableSpace = getAvailableSpace(destTube);

  // Return the minimum of segments available and space available
  return Math.min(contiguousSegments.length, availableSpace);
};

/**
 * Execute a move from source to destination tube
 * Returns new tube states and the number of segments moved
 *
 * Note: This function returns new tube objects (immutable pattern)
 */
export const executeMove = (sourceTube: Tube, destTube: Tube): MoveResult => {
  // Validate the move first
  const validation = validateMove(sourceTube, destTube);
  if (!validation.isValid) {
    return {
      success: false,
      newSourceTube: sourceTube,
      newDestTube: destTube,
      segmentsMoved: 0,
    };
  }

  // Calculate how many segments to transfer
  const transferCount = calculateTransferCount(sourceTube, destTube);

  if (transferCount === 0) {
    return {
      success: false,
      newSourceTube: sourceTube,
      newDestTube: destTube,
      segmentsMoved: 0,
    };
  }

  // Get the segments to transfer (from the top)
  const segmentsToTransfer = sourceTube.segments.slice(-transferCount);

  // Create new source tube with segments removed
  const newSourceTube: Tube = {
    ...sourceTube,
    segments: sourceTube.segments.slice(0, -transferCount),
  };

  // Create new destination tube with segments added
  const newDestTube: Tube = {
    ...destTube,
    segments: [...destTube.segments, ...segmentsToTransfer],
  };

  return {
    success: true,
    newSourceTube,
    newDestTube,
    segmentsMoved: transferCount,
  };
};

/**
 * Apply a move to the entire game state
 * This is a helper function that updates the tubes array with the move result
 */
export const applyMoveToTubes = (
  tubes: Tube[],
  sourceId: number,
  destId: number
): { tubes: Tube[]; segmentsMoved: number; success: boolean } => {
  const sourceTube = tubes.find((t) => t.id === sourceId);
  const destTube = tubes.find((t) => t.id === destId);

  if (!sourceTube || !destTube) {
    return { tubes, segmentsMoved: 0, success: false };
  }

  const moveResult = executeMove(sourceTube, destTube);

  if (!moveResult.success) {
    return { tubes, segmentsMoved: 0, success: false };
  }

  // Create new tubes array with updated tubes
  const newTubes = tubes.map((tube) => {
    if (tube.id === sourceId) {
      return moveResult.newSourceTube;
    }
    if (tube.id === destId) {
      return moveResult.newDestTube;
    }
    return tube;
  });

  return {
    tubes: newTubes,
    segmentsMoved: moveResult.segmentsMoved,
    success: true,
  };
};

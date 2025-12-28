/**
 * Optimal Solver Module
 * Calculates the minimum number of moves required to solve a level using BFS
 */

import type { Tube } from './types';
import { isLevelComplete } from './winCondition';
import { applyMoveToTubes } from './moveExecution';
import { validateMove } from './moveValidation';

/**
 * Create a unique string representation of the tube state
 * Used for detecting duplicate states in BFS
 */
const serializeTubes = (tubes: Tube[]): string => {
  return tubes
    .map((tube) => {
      const segments = tube.segments.map((s) => s.color).join(',');
      return `[${segments}]`;
    })
    .join('|');
};

/**
 * Calculate the optimal (minimum) number of moves to solve the level
 * Uses BFS to find the shortest solution path
 *
 * @param initialTubes - The starting tube configuration
 * @param maxDepth - Maximum search depth (default: 100 moves)
 * @returns The minimum number of moves, or null if no solution found within maxDepth
 */
export const calculateOptimalMoves = (
  initialTubes: Tube[],
  maxDepth: number = 100
): number | null => {
  // If already solved, return 0
  if (isLevelComplete(initialTubes)) {
    return 0;
  }

  // BFS queue: each item is [tubes, moveCount]
  const queue: Array<{ tubes: Tube[]; moves: number }> = [
    { tubes: initialTubes, moves: 0 },
  ];

  // Track visited states to avoid cycles
  const visited = new Set<string>();
  visited.add(serializeTubes(initialTubes));

  while (queue.length > 0) {
    const current = queue.shift()!;
    const { tubes, moves } = current;

    // Stop if we've exceeded max depth
    if (moves >= maxDepth) {
      continue;
    }

    // Try all possible moves from this state
    for (let sourceId = 0; sourceId < tubes.length; sourceId++) {
      const sourceTube = tubes[sourceId];

      // Skip empty source tubes
      if (sourceTube.segments.length === 0) {
        continue;
      }

      for (let destId = 0; destId < tubes.length; destId++) {
        // Skip same tube
        if (sourceId === destId) {
          continue;
        }

        const destTube = tubes[destId];

        // Validate the move
        const validation = validateMove(sourceTube, destTube);
        if (!validation.isValid) {
          continue;
        }

        // Skip moves that don't make progress (pouring into empty tube when source has single color)
        // This optimization prevents unnecessary branching
        if (destTube.segments.length === 0) {
          const sourceColor = sourceTube.segments[sourceTube.segments.length - 1].color;
          const isSourceUniform = sourceTube.segments.every(s => s.color === sourceColor);
          if (isSourceUniform) {
            continue; // No point moving a uniform tube to empty space
          }
        }

        // Apply the move
        const result = applyMoveToTubes(tubes, sourceTube.id, destTube.id);

        if (!result.success) {
          continue;
        }

        // Check if this state was already visited
        const stateKey = serializeTubes(result.tubes);
        if (visited.has(stateKey)) {
          continue;
        }

        // Check if we've reached the goal
        if (isLevelComplete(result.tubes)) {
          return moves + 1;
        }

        // Add to queue for further exploration
        visited.add(stateKey);
        queue.push({ tubes: result.tubes, moves: moves + 1 });
      }
    }
  }

  // No solution found within maxDepth
  return null;
};

/**
 * Calculate optimal moves with a timeout
 * Returns null if calculation takes too long
 *
 * @param initialTubes - The starting tube configuration
 * @param timeoutMs - Maximum time to spend calculating (default: 5000ms)
 * @returns The minimum number of moves, or null if timeout or no solution
 */
export const calculateOptimalMovesWithTimeout = (
  initialTubes: Tube[],
  timeoutMs: number = 5000
): Promise<number | null> => {
  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      resolve(null);
    }, timeoutMs);

    try {
      const result = calculateOptimalMoves(initialTubes);
      clearTimeout(timeoutId);
      resolve(result);
    } catch (error) {
      clearTimeout(timeoutId);
      resolve(null);
    }
  });
};

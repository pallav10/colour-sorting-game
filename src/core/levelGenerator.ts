/**
 * Level Generator Module
 * Generates solvable level configurations
 */

import type { LevelConfig, Tube } from './types';
import { GAME_COLORS } from '../utils/constants';
import { createEmptyTube, createSegment } from '../utils/helpers';

/**
 * Calculate tube capacity based on number of colors
 * Capacity increases by 1 for each additional color
 */
const calculateCapacity = (numColors: number): number => {
  // Simple formula: capacity = colors + 1
  // This ensures capacity grows proportionally with difficulty
  return numColors + 1;
};

/**
 * Create a solved level configuration
 * Each color gets its own full tube, plus empty tubes
 */
const createSolvedLevel = (numColors: number, numEmptyTubes: number): Tube[] => {
  const tubes: Tube[] = [];
  let tubeId = 0;

  // Calculate capacity based on difficulty
  const capacity = calculateCapacity(numColors);

  // Create one full tube for each color
  const colors = GAME_COLORS.slice(0, numColors);

  for (const color of colors) {
    const tube = createEmptyTube(tubeId++);
    tube.capacity = capacity; // Set dynamic capacity
    // Fill tube with segments of the same color
    tube.segments = Array(capacity)
      .fill(null)
      .map(() => createSegment(color));
    tubes.push(tube);
  }

  // Add empty tubes with same capacity
  for (let i = 0; i < numEmptyTubes; i++) {
    const emptyTube = createEmptyTube(tubeId++);
    emptyTube.capacity = capacity; // Same capacity for empty tubes
    tubes.push(emptyTube);
  }

  return tubes;
};

/**
 * Alternative shuffle: Randomly redistribute segments across tubes
 * Ensures exactly 1 tube is empty and all others are filled to capacity
 */
const redistributeShuffle = (solvedTubes: Tube[]): Tube[] => {
  // Get the capacity from the first tube (all tubes have same capacity)
  const capacity = solvedTubes[0]?.capacity || 4;

  // Collect all segments from all tubes
  const allSegments: Array<{ color: string; id: string }> = [];
  solvedTubes.forEach(tube => {
    tube.segments.forEach(segment => {
      allSegments.push(segment);
    });
  });

  // Shuffle the segments array using Fisher-Yates
  for (let i = allSegments.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allSegments[i], allSegments[j]] = [allSegments[j], allSegments[i]];
  }

  // Create new tubes
  const newTubes = solvedTubes.map(tube => {
    const newTube = createEmptyTube(tube.id);
    newTube.capacity = capacity; // Preserve capacity
    return newTube;
  });

  // Randomly choose which tube will be empty
  const emptyTubeIndex = Math.floor(Math.random() * newTubes.length);

  let segmentIndex = 0;

  // Fill all tubes EXCEPT the empty one to full capacity
  for (let i = 0; i < newTubes.length; i++) {
    if (i === emptyTubeIndex) {
      // Skip this tube - leave it empty
      continue;
    }

    const tube = newTubes[i];

    // Fill this tube to full capacity
    for (let j = 0; j < capacity && segmentIndex < allSegments.length; j++) {
      tube.segments.push(allSegments[segmentIndex++]);
    }
  }

  return newTubes;
};

/**
 * Generate a shuffled level by applying random reverse moves
 * Starting from a solved state ensures solvability
 */
const shuffleLevel = (solvedTubes: Tube[]): Tube[] => {
  // Use redistribution shuffle for reliable mixing
  const shuffled = redistributeShuffle(solvedTubes);

  return shuffled;
};

/**
 * Generate a level configuration
 */
export const generateLevel = (
  levelId: number,
  numColors: number,
  numEmptyTubes: number
): LevelConfig => {
  // Create solved level
  const solvedTubes = createSolvedLevel(numColors, numEmptyTubes);

  // Shuffle it to create the initial state
  const initialTubes = shuffleLevel(solvedTubes);

  return {
    levelId,
    colors: GAME_COLORS.slice(0, numColors),
    initialTubes,
  };
};

/**
 * Generate a predefined easy level for testing
 */
export const generateEasyLevel = (levelId: number = 1): LevelConfig => {
  return generateLevel(levelId, 3, 2);
};

/**
 * Generate a predefined medium level
 */
export const generateMediumLevel = (levelId: number = 1): LevelConfig => {
  return generateLevel(levelId, 5, 2);
};

/**
 * Generate a predefined hard level
 */
export const generateHardLevel = (levelId: number = 1): LevelConfig => {
  return generateLevel(levelId, 7, 1);
};

/**
 * Generate a level with progressive difficulty based on level number
 * Rule: Total tubes = Number of colors + 1 (exactly one empty tube)
 * Difficulty increases gradually by adding more colors
 */
export const generateProgressiveLevel = (levelId: number): LevelConfig => {
  // Progressive difficulty curve - shorter intervals for easy/medium, longer for hard
  let numColors: number;

  if (levelId <= 3) {
    // Levels 1-3: Easy (4 colors, capacity 5)
    numColors = 4;
  } else if (levelId <= 6) {
    // Levels 4-6: Medium (5 colors, capacity 6)
    numColors = 5;
  } else if (levelId <= 10) {
    // Levels 7-10: Medium-Hard (6 colors, capacity 7)
    numColors = 6;
  } else if (levelId <= 15) {
    // Levels 11-15: Hard (7 colors, capacity 8)
    numColors = 7;
  } else if (levelId <= 21) {
    // Levels 16-21: Very Hard (8 colors, capacity 9)
    numColors = 8;
  } else if (levelId <= 28) {
    // Levels 22-28: Expert (9 colors, capacity 10)
    numColors = 9;
  } else if (levelId <= 36) {
    // Levels 29-36: Expert+ (10 colors, capacity 11)
    numColors = 10;
  } else if (levelId <= 45) {
    // Levels 37-45: Master (11 colors, capacity 12)
    numColors = 11;
  } else {
    // Levels 46+: Master+ (12 colors, capacity 13)
    numColors = 12; // Max out at 12 colors
  }

  // RULE: Always exactly 1 empty tube (numColors + 1 total tubes)
  const numEmptyTubes = 1;

  return generateLevel(levelId, numColors, numEmptyTubes);
};

/**
 * Create a simple manual level for testing
 * 2 colors, mixed in 2 tubes, with 1 empty tube
 */
export const createSimpleTestLevel = (): LevelConfig => {
  const tubes: Tube[] = [];

  // Tube 0: Red, Blue, Red, Blue (from bottom to top)
  const tube0 = createEmptyTube(0);
  tube0.segments = [
    createSegment('#FF6B6B'), // Red
    createSegment('#45B7D1'), // Blue
    createSegment('#FF6B6B'), // Red
    createSegment('#45B7D1'), // Blue
  ];
  tubes.push(tube0);

  // Tube 1: Blue, Red, Blue, Red
  const tube1 = createEmptyTube(1);
  tube1.segments = [
    createSegment('#45B7D1'), // Blue
    createSegment('#FF6B6B'), // Red
    createSegment('#45B7D1'), // Blue
    createSegment('#FF6B6B'), // Red
  ];
  tubes.push(tube1);

  // Tube 2: Empty
  tubes.push(createEmptyTube(2));

  return {
    levelId: 0,
    colors: ['#FF6B6B', '#45B7D1'],
    initialTubes: tubes,
  };
};

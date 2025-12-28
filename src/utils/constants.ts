/**
 * Game constants
 */

export const TUBE_CAPACITY = 4;

export const GAME_COLORS = [
  '#FF6B6B', // Red
  '#45B7D1', // Blue
  '#F7DC6F', // Yellow
  '#52BE80', // Green
  '#BB8FCE', // Purple
  '#FFA07A', // Salmon
  '#4ECDC4', // Teal
  '#EC7063', // Coral
  '#98D8C8', // Mint
  '#F8B88B', // Peach
  '#AAB7B8', // Gray
  '#85C1E2', // Sky Blue
];

export const ANIMATION_DURATION = {
  POUR: 400,
  SHAKE: 300,
  CELEBRATION: 600,
};

export const LEVEL_CONFIGS = {
  EASY: { colors: 3, emptyTubes: 2 },
  MEDIUM: { colors: 5, emptyTubes: 2 },
  HARD: { colors: 7, emptyTubes: 1 },
};

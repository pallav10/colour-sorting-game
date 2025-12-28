/**
 * Zustand Game Store
 * Central state management for the game
 */

import { create } from 'zustand';
import type { GameState, Tube, LevelConfig } from '../core/types';
import { applyMoveToTubes } from '../core/moveExecution';
import { isLevelComplete } from '../core/winCondition';
import { undoLastMove, recordMove, canUndo as canUndoMove } from '../core/undoSystem';
import { generateProgressiveLevel } from '../core/levelGenerator';
import { cloneTubes } from '../utils/helpers';

// Best scores storage key
const BEST_SCORES_KEY = 'colorSortGame_bestScores';

// Load best scores from localStorage
const loadBestScores = (): Record<number, number> => {
  try {
    const stored = localStorage.getItem(BEST_SCORES_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

// Save best scores to localStorage
const saveBestScores = (scores: Record<number, number>) => {
  try {
    localStorage.setItem(BEST_SCORES_KEY, JSON.stringify(scores));
  } catch {
    // Ignore localStorage errors
  }
};

interface GameStore extends GameState {
  // Best scores for each level
  bestScores: Record<number, number>;
  // Track if game has started
  gameStarted: boolean;

  // Actions
  selectTube: (tubeId: number | null) => void;
  attemptMove: (destTubeId: number, onAnimationComplete?: () => void) => void;
  undo: () => void;
  restart: () => void;
  loadLevel: (config: LevelConfig) => void;
  nextLevel: () => void;
  updateBestScore: (levelId: number, moves: number) => void;
  startGame: (startLevel: number) => void;
  returnToMenu: () => void;
  resetAllBestScores: () => void;

  // Computed
  canUndo: () => boolean;
  getSelectedTube: () => Tube | null;
  getBestScore: (levelId: number) => number | null;
}

export const useGameStore = create<GameStore>((set, get) => {
  // Initialize with level 1 (3 colors)
  const initialLevel = generateProgressiveLevel(1);
  const clonedTubes = cloneTubes(initialLevel.initialTubes);

  return {
    // Initial state (deep clone to prevent mutation)
    tubes: clonedTubes,
    selectedTubeId: null,
    moveHistory: [],
    levelConfig: initialLevel,
    isCompleted: false,
    moveCount: 0,
    currentLevel: 1,
    bestScores: loadBestScores(),
    gameStarted: false,

    // Select a tube (first tap)
    selectTube: (tubeId) => {
      set({ selectedTubeId: tubeId });
    },

    // Attempt to move to a destination (second tap)
    attemptMove: (destTubeId, onAnimationComplete) => {
      const state = get();
      const { selectedTubeId, tubes, moveHistory } = state;

      // If no tube is selected, select this one
      if (selectedTubeId === null) {
        set({ selectedTubeId: destTubeId });
        return;
      }

      // If clicking the same tube, deselect
      if (selectedTubeId === destTubeId) {
        set({ selectedTubeId: null });
        return;
      }

      // Try to execute the move
      const result = applyMoveToTubes(tubes, selectedTubeId, destTubeId);

      if (result.success) {
        // Keep selection while animating, update state after animation
        if (onAnimationComplete) {
          // Animation will happen, then callback will update state
          setTimeout(() => {
            const newHistory = recordMove(moveHistory, selectedTubeId, destTubeId, result.segmentsMoved);
            const completed = isLevelComplete(result.tubes);
            const newMoveCount = state.moveCount + 1;

            set({
              tubes: result.tubes,
              moveHistory: newHistory,
              moveCount: newMoveCount,
              selectedTubeId: null,
              isCompleted: completed,
            });

            // Update best score if level completed
            if (completed) {
              get().updateBestScore(state.currentLevel, newMoveCount);
            }

            onAnimationComplete();
          }, 600); // Animation duration
        } else {
          // No animation, update immediately
          const newHistory = recordMove(moveHistory, selectedTubeId, destTubeId, result.segmentsMoved);
          const completed = isLevelComplete(result.tubes);
          const newMoveCount = state.moveCount + 1;

          set({
            tubes: result.tubes,
            moveHistory: newHistory,
            moveCount: newMoveCount,
            selectedTubeId: null,
            isCompleted: completed,
          });

          // Update best score if level completed
          if (completed) {
            get().updateBestScore(state.currentLevel, newMoveCount);
          }
        }
      } else {
        // Invalid move - just deselect
        set({ selectedTubeId: null });
      }
    },

    // Undo the last move
    undo: () => {
      const state = get();
      const { tubes, moveHistory } = state;

      const result = undoLastMove(tubes, moveHistory);

      if (result.success) {
        set({
          tubes: result.tubes,
          moveHistory: result.newHistory,
          selectedTubeId: null,
          isCompleted: false, // Can't be completed after undo
        });
      }
    },

    // Restart the current level
    restart: () => {
      const state = get();
      set({
        tubes: cloneTubes(state.levelConfig.initialTubes),
        moveHistory: [],
        moveCount: 0,
        selectedTubeId: null,
        isCompleted: false,
      });
    },

    // Load a specific level configuration
    loadLevel: (config) => {
      set({
        levelConfig: config,
        tubes: cloneTubes(config.initialTubes),
        moveHistory: [],
        moveCount: 0,
        selectedTubeId: null,
        isCompleted: false,
        currentLevel: config.levelId,
      });
    },

    // Load next level
    nextLevel: () => {
      const state = get();
      const nextLevelId = state.currentLevel + 1;

      const nextLevelConfig = generateProgressiveLevel(nextLevelId);
      const freshTubes = cloneTubes(nextLevelConfig.initialTubes);

      set({
        levelConfig: nextLevelConfig,
        tubes: freshTubes,
        moveHistory: [],
        moveCount: 0,
        selectedTubeId: null,
        isCompleted: false,
        currentLevel: nextLevelId,
      });
    },

    // Check if undo is available
    canUndo: () => {
      const state = get();
      return canUndoMove(state.moveHistory, state.levelConfig.maxUndos);
    },

    // Get the currently selected tube
    getSelectedTube: () => {
      const state = get();
      if (state.selectedTubeId === null) return null;
      return state.tubes.find((t) => t.id === state.selectedTubeId) || null;
    },

    // Update best score for a level
    updateBestScore: (levelId, moves) => {
      const state = get();
      const currentBest = state.bestScores[levelId];

      // Update if no best score exists or new score is better
      if (currentBest === undefined || moves < currentBest) {
        const newBestScores = { ...state.bestScores, [levelId]: moves };
        set({ bestScores: newBestScores });
        saveBestScores(newBestScores);
      }
    },

    // Get best score for a level
    getBestScore: (levelId) => {
      const state = get();
      return state.bestScores[levelId] ?? null;
    },

    // Start game with selected difficulty
    startGame: (startLevel) => {
      const levelConfig = generateProgressiveLevel(startLevel);
      const tubes = cloneTubes(levelConfig.initialTubes);

      set({
        levelConfig,
        tubes,
        moveHistory: [],
        moveCount: 0,
        selectedTubeId: null,
        isCompleted: false,
        currentLevel: startLevel,
        gameStarted: true,
      });
    },

    // Return to difficulty selection menu
    returnToMenu: () => {
      set({ gameStarted: false });
    },

    // Reset all best scores
    resetAllBestScores: () => {
      set({ bestScores: {} });
      saveBestScores({});
    },
  };
});

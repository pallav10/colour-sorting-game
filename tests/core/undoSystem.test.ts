import { describe, it, expect } from 'vitest';
import {
  recordMove,
  undoLastMove,
  canUndo,
  getRemainingUndos,
} from '../../src/core/undoSystem';
import { createEmptyTube, createSegment } from '../../src/utils/helpers';
import type { Move } from '../../src/core/types';

describe('undoSystem', () => {
  describe('recordMove', () => {
    it('should record a move in history', () => {
      const history: Move[] = [];
      const newHistory = recordMove(history, 0, 1, 2);

      expect(newHistory.length).toBe(1);
      expect(newHistory[0].sourceTubeId).toBe(0);
      expect(newHistory[0].destinationTubeId).toBe(1);
      expect(newHistory[0].segmentsMoved).toBe(2);
      expect(newHistory[0].timestamp).toBeDefined();
    });

    it('should maintain immutability of original history', () => {
      const history: Move[] = [];
      const newHistory = recordMove(history, 0, 1, 1);

      expect(history.length).toBe(0);
      expect(newHistory.length).toBe(1);
      expect(history).not.toBe(newHistory);
    });

    it('should append to existing history', () => {
      const history: Move[] = [
        { sourceTubeId: 0, destinationTubeId: 1, segmentsMoved: 1, timestamp: Date.now() },
      ];

      const newHistory = recordMove(history, 1, 2, 2);

      expect(newHistory.length).toBe(2);
      expect(newHistory[1].sourceTubeId).toBe(1);
      expect(newHistory[1].destinationTubeId).toBe(2);
    });
  });

  describe('canUndo', () => {
    it('should return false for empty history', () => {
      const history: Move[] = [];
      expect(canUndo(history)).toBe(false);
    });

    it('should return true when history has moves', () => {
      const history: Move[] = [
        { sourceTubeId: 0, destinationTubeId: 1, segmentsMoved: 1, timestamp: Date.now() },
      ];

      expect(canUndo(history)).toBe(true);
    });

    it('should return true with multiple moves', () => {
      const history: Move[] = [
        { sourceTubeId: 0, destinationTubeId: 1, segmentsMoved: 1, timestamp: Date.now() },
        { sourceTubeId: 1, destinationTubeId: 2, segmentsMoved: 2, timestamp: Date.now() },
      ];

      expect(canUndo(history)).toBe(true);
    });

    it('should work with maxUndos limit', () => {
      const history: Move[] = [
        { sourceTubeId: 0, destinationTubeId: 1, segmentsMoved: 1, timestamp: Date.now() },
      ];

      expect(canUndo(history, 5)).toBe(true);
      expect(canUndo([], 5)).toBe(false);
    });
  });

  describe('undoLastMove', () => {
    it('should return failure for empty history', () => {
      const tube0 = createEmptyTube(0);
      const tube1 = createEmptyTube(1);
      const tubes = [tube0, tube1];
      const history: Move[] = [];

      const result = undoLastMove(tubes, history);

      expect(result.success).toBe(false);
      expect(result.newHistory.length).toBe(0);
    });

    it('should reverse a simple move', () => {
      // Setup: tube0 has red segment, tube1 is empty
      // After move: tube0 empty, tube1 has red segment
      // After undo: tube0 has red segment, tube1 empty
      const tube0 = createEmptyTube(0);
      const tube1 = createEmptyTube(1);
      tube1.segments = [createSegment('#FF6B6B')]; // Red segment moved to tube1

      const tubes = [tube0, tube1];
      const history: Move[] = [
        { sourceTubeId: 0, destinationTubeId: 1, segmentsMoved: 1, timestamp: Date.now() },
      ];

      const result = undoLastMove(tubes, history);

      expect(result.success).toBe(true);
      expect(result.newHistory.length).toBe(0);

      // After undo, segment should be back in tube0
      const tube0After = result.tubes.find(t => t.id === 0);
      const tube1After = result.tubes.find(t => t.id === 1);

      expect(tube0After?.segments.length).toBe(1);
      expect(tube1After?.segments.length).toBe(0);
    });

    it('should reverse a multi-segment move', () => {
      // Setup: tube1 has 2 red segments after move from tube0
      const tube0 = createEmptyTube(0);
      const tube1 = createEmptyTube(1);
      tube1.segments = [
        createSegment('#FF6B6B'),
        createSegment('#FF6B6B'),
      ];

      const tubes = [tube0, tube1];
      const history: Move[] = [
        { sourceTubeId: 0, destinationTubeId: 1, segmentsMoved: 2, timestamp: Date.now() },
      ];

      const result = undoLastMove(tubes, history);

      expect(result.success).toBe(true);

      // After undo, both segments should be back in tube0
      const tube0After = result.tubes.find(t => t.id === 0);
      const tube1After = result.tubes.find(t => t.id === 1);

      expect(tube0After?.segments.length).toBe(2);
      expect(tube1After?.segments.length).toBe(0);
    });

    it('should maintain tube immutability', () => {
      const tube0 = createEmptyTube(0);
      const tube1 = createEmptyTube(1);
      tube1.segments = [createSegment('#FF6B6B')];

      const tubes = [tube0, tube1];
      const history: Move[] = [
        { sourceTubeId: 0, destinationTubeId: 1, segmentsMoved: 1, timestamp: Date.now() },
      ];

      const result = undoLastMove(tubes, history);

      // Original tubes should be unchanged
      expect(tubes[0].segments.length).toBe(0);
      expect(tubes[1].segments.length).toBe(1);

      // Result tubes should be different
      expect(result.tubes).not.toBe(tubes);
    });

    it('should handle multiple sequential undos', () => {
      // Simulate 3 moves: 0→1, 1→2, 2→0
      // Then undo them all one by one
      const tube0 = createEmptyTube(0);
      const tube1 = createEmptyTube(1);
      const tube2 = createEmptyTube(2);
      tube0.segments = [createSegment('#FF6B6B')];

      let currentTubes = [tube0, tube1, tube2];
      let currentHistory: Move[] = [];

      // Move 1: 0→1
      currentHistory = recordMove(currentHistory, 0, 1, 1);
      currentTubes = [
        createEmptyTube(0),
        { ...tube1, segments: [createSegment('#FF6B6B')] },
        tube2,
      ];

      // Move 2: 1→2
      currentHistory = recordMove(currentHistory, 1, 2, 1);
      currentTubes = [
        createEmptyTube(0),
        createEmptyTube(1),
        { ...tube2, segments: [createSegment('#FF6B6B')] },
      ];

      // Move 3: 2→0
      currentHistory = recordMove(currentHistory, 2, 0, 1);
      currentTubes = [
        { ...tube0, segments: [createSegment('#FF6B6B')] },
        createEmptyTube(1),
        createEmptyTube(2),
      ];

      expect(currentHistory.length).toBe(3);

      // Undo 1: Should reverse 2→0
      let result = undoLastMove(currentTubes, currentHistory);
      expect(result.success).toBe(true);
      expect(result.newHistory.length).toBe(2);

      // Undo 2: Should reverse 1→2
      result = undoLastMove(result.tubes, result.newHistory);
      expect(result.success).toBe(true);
      expect(result.newHistory.length).toBe(1);

      // Undo 3: Should reverse 0→1
      result = undoLastMove(result.tubes, result.newHistory);
      expect(result.success).toBe(true);
      expect(result.newHistory.length).toBe(0);
    });
  });

  describe('getRemainingUndos', () => {
    it('should return null for unlimited undos', () => {
      const history: Move[] = [
        { sourceTubeId: 0, destinationTubeId: 1, segmentsMoved: 1, timestamp: Date.now() },
      ];

      expect(getRemainingUndos(history)).toBe(null);
    });

    it('should calculate remaining undos correctly', () => {
      const history: Move[] = [
        { sourceTubeId: 0, destinationTubeId: 1, segmentsMoved: 1, timestamp: Date.now() },
        { sourceTubeId: 1, destinationTubeId: 2, segmentsMoved: 1, timestamp: Date.now() },
      ];

      expect(getRemainingUndos(history, 5)).toBe(3);
      expect(getRemainingUndos(history, 2)).toBe(0);
      expect(getRemainingUndos([], 5)).toBe(5);
    });

    it('should not return negative values', () => {
      const history: Move[] = [
        { sourceTubeId: 0, destinationTubeId: 1, segmentsMoved: 1, timestamp: Date.now() },
        { sourceTubeId: 1, destinationTubeId: 2, segmentsMoved: 1, timestamp: Date.now() },
        { sourceTubeId: 2, destinationTubeId: 0, segmentsMoved: 1, timestamp: Date.now() },
      ];

      expect(getRemainingUndos(history, 2)).toBe(0);
      expect(getRemainingUndos(history, 1)).toBe(0);
    });
  });

  describe('move history integration', () => {
    it('should maintain correct history order', () => {
      let history: Move[] = [];

      history = recordMove(history, 0, 1, 1);
      history = recordMove(history, 1, 2, 2);
      history = recordMove(history, 2, 0, 1);

      expect(history.length).toBe(3);
      expect(history[0].sourceTubeId).toBe(0);
      expect(history[1].sourceTubeId).toBe(1);
      expect(history[2].sourceTubeId).toBe(2);
    });

    it('should track timestamps correctly', () => {
      const before = Date.now();
      const history = recordMove([], 0, 1, 1);
      const after = Date.now();

      expect(history[0].timestamp).toBeGreaterThanOrEqual(before);
      expect(history[0].timestamp).toBeLessThanOrEqual(after);
    });
  });
});

import { describe, it, expect } from 'vitest';
import { isTubeComplete, isLevelComplete, getGameStats } from '../../src/core/winCondition';
import { createEmptyTube, createSegment } from '../../src/utils/helpers';

describe('winCondition', () => {
  describe('isTubeComplete', () => {
    it('should return true for empty tube', () => {
      const tube = createEmptyTube(0);
      expect(isTubeComplete(tube)).toBe(true);
    });

    it('should return false for partially filled tube', () => {
      const tube = createEmptyTube(0);
      tube.segments = [createSegment('#FF6B6B'), createSegment('#FF6B6B')];
      expect(isTubeComplete(tube)).toBe(false);
    });

    it('should return true for full tube with same color', () => {
      const tube = createEmptyTube(0);
      tube.segments = [
        createSegment('#FF6B6B'),
        createSegment('#FF6B6B'),
        createSegment('#FF6B6B'),
        createSegment('#FF6B6B'),
      ];
      expect(isTubeComplete(tube)).toBe(true);
    });

    it('should return false for full tube with mixed colors', () => {
      const tube = createEmptyTube(0);
      tube.segments = [
        createSegment('#FF6B6B'),
        createSegment('#45B7D1'),
        createSegment('#FF6B6B'),
        createSegment('#FF6B6B'),
      ];
      expect(isTubeComplete(tube)).toBe(false);
    });
  });

  describe('isLevelComplete', () => {
    it('should return true when all tubes are complete', () => {
      const tube0 = createEmptyTube(0);
      tube0.segments = [
        createSegment('#FF6B6B'),
        createSegment('#FF6B6B'),
        createSegment('#FF6B6B'),
        createSegment('#FF6B6B'),
      ];

      const tube1 = createEmptyTube(1);
      tube1.segments = [
        createSegment('#45B7D1'),
        createSegment('#45B7D1'),
        createSegment('#45B7D1'),
        createSegment('#45B7D1'),
      ];

      const tube2 = createEmptyTube(2);

      expect(isLevelComplete([tube0, tube1, tube2])).toBe(true);
    });

    it('should return false when any tube is incomplete', () => {
      const tube0 = createEmptyTube(0);
      tube0.segments = [
        createSegment('#FF6B6B'),
        createSegment('#FF6B6B'),
        createSegment('#FF6B6B'),
        createSegment('#FF6B6B'),
      ];

      const tube1 = createEmptyTube(1);
      tube1.segments = [createSegment('#45B7D1'), createSegment('#FF6B6B')];

      expect(isLevelComplete([tube0, tube1])).toBe(false);
    });
  });

  describe('getGameStats', () => {
    it('should calculate correct statistics', () => {
      const tube0 = createEmptyTube(0);
      tube0.segments = [
        createSegment('#FF6B6B'),
        createSegment('#FF6B6B'),
        createSegment('#FF6B6B'),
        createSegment('#FF6B6B'),
      ];

      const tube1 = createEmptyTube(1);

      const tube2 = createEmptyTube(2);
      tube2.segments = [createSegment('#45B7D1')];

      const stats = getGameStats([tube0, tube1, tube2]);

      expect(stats.totalTubes).toBe(3);
      expect(stats.completeTubes).toBe(2); // tube0 and tube1
      expect(stats.emptyTubes).toBe(1); // tube1
      expect(stats.progressPercentage).toBe(67); // 2/3 = 67%
    });
  });
});

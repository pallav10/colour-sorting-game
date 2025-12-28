import { describe, it, expect } from 'vitest';
import {
  getContiguousTopSegments,
  calculateTransferCount,
  executeMove,
  applyMoveToTubes,
} from '../../src/core/moveExecution';
import { createEmptyTube, createSegment } from '../../src/utils/helpers';

describe('moveExecution', () => {
  describe('getContiguousTopSegments', () => {
    it('should return empty array for empty tube', () => {
      const tube = createEmptyTube(0);
      expect(getContiguousTopSegments(tube)).toEqual([]);
    });

    it('should return single segment when top is unique', () => {
      const tube = createEmptyTube(0);
      tube.segments = [createSegment('#FF6B6B'), createSegment('#45B7D1')];

      const result = getContiguousTopSegments(tube);
      expect(result.length).toBe(1);
      expect(result[0].color).toBe('#45B7D1');
    });

    it('should return all contiguous top segments of same color', () => {
      const tube = createEmptyTube(0);
      tube.segments = [
        createSegment('#FF6B6B'),
        createSegment('#45B7D1'),
        createSegment('#45B7D1'),
        createSegment('#45B7D1'),
      ];

      const result = getContiguousTopSegments(tube);
      expect(result.length).toBe(3);
      expect(result.every((s) => s.color === '#45B7D1')).toBe(true);
    });

    it('should return all segments if entire tube is same color', () => {
      const tube = createEmptyTube(0);
      tube.segments = [
        createSegment('#FF6B6B'),
        createSegment('#FF6B6B'),
        createSegment('#FF6B6B'),
        createSegment('#FF6B6B'),
      ];

      const result = getContiguousTopSegments(tube);
      expect(result.length).toBe(4);
    });
  });

  describe('calculateTransferCount', () => {
    it('should respect destination capacity', () => {
      const source = createEmptyTube(0);
      source.segments = [
        createSegment('#FF6B6B'),
        createSegment('#FF6B6B'),
        createSegment('#FF6B6B'),
      ];

      const dest = createEmptyTube(1);
      dest.segments = [createSegment('#FF6B6B'), createSegment('#FF6B6B')];

      // Destination has 2 spaces, source has 3 contiguous
      const count = calculateTransferCount(source, dest);
      expect(count).toBe(2);
    });

    it('should transfer all contiguous if space available', () => {
      const source = createEmptyTube(0);
      source.segments = [createSegment('#45B7D1'), createSegment('#FF6B6B')];

      const dest = createEmptyTube(1);

      const count = calculateTransferCount(source, dest);
      expect(count).toBe(1); // Only top segment
    });
  });

  describe('executeMove', () => {
    it('should fail for invalid move', () => {
      const source = createEmptyTube(0);
      const dest = createEmptyTube(1);

      const result = executeMove(source, dest);
      expect(result.success).toBe(false);
      expect(result.segmentsMoved).toBe(0);
    });

    it('should transfer single segment', () => {
      const source = createEmptyTube(0);
      source.segments = [createSegment('#FF6B6B')];

      const dest = createEmptyTube(1);

      const result = executeMove(source, dest);
      expect(result.success).toBe(true);
      expect(result.segmentsMoved).toBe(1);
      expect(result.newSourceTube.segments.length).toBe(0);
      expect(result.newDestTube.segments.length).toBe(1);
    });

    it('should transfer multiple contiguous segments', () => {
      const source = createEmptyTube(0);
      source.segments = [
        createSegment('#45B7D1'),
        createSegment('#FF6B6B'),
        createSegment('#FF6B6B'),
      ];

      const dest = createEmptyTube(1);

      const result = executeMove(source, dest);
      expect(result.success).toBe(true);
      expect(result.segmentsMoved).toBe(2);
      expect(result.newSourceTube.segments.length).toBe(1);
      expect(result.newDestTube.segments.length).toBe(2);
    });

    it('should maintain immutability', () => {
      const source = createEmptyTube(0);
      source.segments = [createSegment('#FF6B6B')];

      const dest = createEmptyTube(1);

      const result = executeMove(source, dest);

      // Original tubes should be unchanged
      expect(source.segments.length).toBe(1);
      expect(dest.segments.length).toBe(0);

      // New tubes should have changes
      expect(result.newSourceTube.segments.length).toBe(0);
      expect(result.newDestTube.segments.length).toBe(1);
    });
  });

  describe('applyMoveToTubes', () => {
    it('should update tubes array correctly', () => {
      const tube0 = createEmptyTube(0);
      tube0.segments = [createSegment('#FF6B6B')];

      const tube1 = createEmptyTube(1);

      const tubes = [tube0, tube1];

      const result = applyMoveToTubes(tubes, 0, 1);

      expect(result.success).toBe(true);
      expect(result.tubes.length).toBe(2);
      expect(result.tubes[0].segments.length).toBe(0);
      expect(result.tubes[1].segments.length).toBe(1);
    });
  });
});

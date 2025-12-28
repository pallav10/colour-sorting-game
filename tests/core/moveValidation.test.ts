import { describe, it, expect } from 'vitest';
import {
  isSourceValid,
  isDestinationValid,
  hasCapacity,
  validateMove,
} from '../../src/core/moveValidation';
import { createEmptyTube, createSegment } from '../../src/utils/helpers';

describe('moveValidation', () => {
  describe('isSourceValid', () => {
    it('should return false for empty tube', () => {
      const tube = createEmptyTube(0);
      expect(isSourceValid(tube)).toBe(false);
    });

    it('should return true for tube with segments', () => {
      const tube = createEmptyTube(0);
      tube.segments = [createSegment('#FF6B6B')];
      expect(isSourceValid(tube)).toBe(true);
    });
  });

  describe('isDestinationValid', () => {
    it('should return true for any destination (no color matching required)', () => {
      expect(isDestinationValid()).toBe(true);
    });
  });

  describe('hasCapacity', () => {
    it('should return true when tube has space', () => {
      const tube = createEmptyTube(0);
      tube.segments = [createSegment('#FF6B6B')];

      expect(hasCapacity(tube, 1)).toBe(true);
      expect(hasCapacity(tube, 3)).toBe(true);
    });

    it('should return false when tube is full', () => {
      const tube = createEmptyTube(0);
      tube.segments = [
        createSegment('#FF6B6B'),
        createSegment('#FF6B6B'),
        createSegment('#FF6B6B'),
        createSegment('#FF6B6B'),
      ];

      expect(hasCapacity(tube, 1)).toBe(false);
    });
  });

  describe('validateMove', () => {
    it('should reject move to same tube', () => {
      const tube = createEmptyTube(0);
      tube.segments = [createSegment('#FF6B6B')];

      const result = validateMove(tube, tube);
      expect(result.isValid).toBe(false);
      expect(result.reason).toContain('same tube');
    });

    it('should reject move from empty source', () => {
      const source = createEmptyTube(0);
      const dest = createEmptyTube(1);

      const result = validateMove(source, dest);
      expect(result.isValid).toBe(false);
      expect(result.reason).toContain('empty');
    });

    it('should reject move to full destination', () => {
      const source = createEmptyTube(0);
      source.segments = [createSegment('#FF6B6B')];

      const dest = createEmptyTube(1);
      dest.segments = [
        createSegment('#45B7D1'),
        createSegment('#45B7D1'),
        createSegment('#45B7D1'),
        createSegment('#45B7D1'),
      ];

      const result = validateMove(source, dest);
      expect(result.isValid).toBe(false);
      expect(result.reason).toContain('full');
    });

    it('should accept move even when colors do not match', () => {
      const source = createEmptyTube(0);
      source.segments = [createSegment('#FF6B6B')];

      const dest = createEmptyTube(1);
      dest.segments = [createSegment('#45B7D1')];

      const result = validateMove(source, dest);
      expect(result.isValid).toBe(true);
    });

    it('should accept valid move to empty tube', () => {
      const source = createEmptyTube(0);
      source.segments = [createSegment('#FF6B6B')];

      const dest = createEmptyTube(1);

      const result = validateMove(source, dest);
      expect(result.isValid).toBe(true);
    });

    it('should accept valid move to any tube with space', () => {
      const source = createEmptyTube(0);
      source.segments = [createSegment('#FF6B6B'), createSegment('#FF6B6B')];

      const dest = createEmptyTube(1);
      dest.segments = [createSegment('#45B7D1')];

      const result = validateMove(source, dest);
      expect(result.isValid).toBe(true);
    });
  });
});

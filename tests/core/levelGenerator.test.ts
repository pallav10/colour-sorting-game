import { describe, it, expect } from 'vitest';
import {
  generateLevel,
  generateProgressiveLevel,
  generateEasyLevel,
  generateMediumLevel,
  generateHardLevel,
  createSimpleTestLevel,
} from '../../src/core/levelGenerator';

describe('levelGenerator', () => {
  describe('generateLevel', () => {
    it('should create a level with correct number of tubes', () => {
      const level = generateLevel(1, 3, 1);

      // 3 colors + 1 empty = 4 tubes total
      expect(level.initialTubes.length).toBe(4);
      expect(level.colors.length).toBe(3);
      expect(level.levelId).toBe(1);
    });

    it('should use dynamic capacity based on color count', () => {
      const level = generateLevel(1, 4, 1);

      // Capacity should be colors + 1 = 5
      level.initialTubes.forEach(tube => {
        expect(tube.capacity).toBe(5);
      });
    });

    it('should preserve all segments after shuffle', () => {
      const numColors = 3;
      const numEmptyTubes = 1;
      const level = generateLevel(1, numColors, numEmptyTubes);

      // Capacity = colors + 1 = 4
      const capacity = numColors + 1;

      // Total segments should be numColors * capacity
      const totalSegments = level.initialTubes.reduce(
        (sum, tube) => sum + tube.segments.length,
        0
      );

      expect(totalSegments).toBe(numColors * capacity);
    });

    it('should have exactly one empty tube after shuffle', () => {
      const level = generateLevel(1, 4, 1);

      const emptyTubes = level.initialTubes.filter(tube => tube.segments.length === 0);
      expect(emptyTubes.length).toBe(1);
    });

    it('should fill all non-empty tubes to capacity', () => {
      const level = generateLevel(1, 5, 1);

      const nonEmptyTubes = level.initialTubes.filter(tube => tube.segments.length > 0);

      nonEmptyTubes.forEach(tube => {
        expect(tube.segments.length).toBe(tube.capacity);
      });
    });
  });

  describe('generateProgressiveLevel', () => {
    it('should generate Easy tier (levels 1-3) with 4 colors', () => {
      const level1 = generateProgressiveLevel(1);
      const level2 = generateProgressiveLevel(2);
      const level3 = generateProgressiveLevel(3);

      expect(level1.colors.length).toBe(4);
      expect(level2.colors.length).toBe(4);
      expect(level3.colors.length).toBe(4);

      // Capacity should be 5 (4 + 1)
      expect(level1.initialTubes[0].capacity).toBe(5);

      // Should have 5 tubes (4 colors + 1)
      expect(level1.initialTubes.length).toBe(5);
    });

    it('should generate Medium tier (levels 4-6) with 5 colors', () => {
      const level4 = generateProgressiveLevel(4);
      const level5 = generateProgressiveLevel(5);
      const level6 = generateProgressiveLevel(6);

      expect(level4.colors.length).toBe(5);
      expect(level5.colors.length).toBe(5);
      expect(level6.colors.length).toBe(5);

      // Capacity should be 6 (5 + 1)
      expect(level4.initialTubes[0].capacity).toBe(6);

      // Should have 6 tubes (5 colors + 1)
      expect(level4.initialTubes.length).toBe(6);
    });

    it('should generate Medium-Hard tier (levels 7-10) with 6 colors', () => {
      const level7 = generateProgressiveLevel(7);
      const level10 = generateProgressiveLevel(10);

      expect(level7.colors.length).toBe(6);
      expect(level10.colors.length).toBe(6);

      // Capacity should be 7 (6 + 1)
      expect(level7.initialTubes[0].capacity).toBe(7);

      // Should have 7 tubes (6 colors + 1)
      expect(level7.initialTubes.length).toBe(7);
    });

    it('should generate Hard tier (levels 11-15) with 7 colors', () => {
      const level11 = generateProgressiveLevel(11);
      const level15 = generateProgressiveLevel(15);

      expect(level11.colors.length).toBe(7);
      expect(level15.colors.length).toBe(7);

      // Capacity should be 8 (7 + 1)
      expect(level11.initialTubes[0].capacity).toBe(8);

      // Should have 8 tubes (7 colors + 1)
      expect(level11.initialTubes.length).toBe(8);
    });

    it('should generate Very Hard tier (levels 16-21) with 8 colors', () => {
      const level16 = generateProgressiveLevel(16);
      const level21 = generateProgressiveLevel(21);

      expect(level16.colors.length).toBe(8);
      expect(level21.colors.length).toBe(8);

      // Capacity should be 9 (8 + 1)
      expect(level16.initialTubes[0].capacity).toBe(9);

      // Should have 9 tubes (8 colors + 1)
      expect(level16.initialTubes.length).toBe(9);
    });

    it('should generate Expert tier (levels 22-28) with 9 colors', () => {
      const level22 = generateProgressiveLevel(22);
      const level28 = generateProgressiveLevel(28);

      expect(level22.colors.length).toBe(9);
      expect(level28.colors.length).toBe(9);

      // Capacity should be 10 (9 + 1)
      expect(level22.initialTubes[0].capacity).toBe(10);

      // Should have 10 tubes (9 colors + 1)
      expect(level22.initialTubes.length).toBe(10);
    });

    it('should generate Master tier (levels 37-45) with 11 colors', () => {
      const level37 = generateProgressiveLevel(37);
      const level45 = generateProgressiveLevel(45);

      expect(level37.colors.length).toBe(11);
      expect(level45.colors.length).toBe(11);

      // Capacity should be 12 (11 + 1)
      expect(level37.initialTubes[0].capacity).toBe(12);

      // Should have 12 tubes (11 colors + 1)
      expect(level37.initialTubes.length).toBe(12);
    });

    it('should cap at 12 colors for levels 46+', () => {
      const level50 = generateProgressiveLevel(50);

      expect(level50.colors.length).toBe(12);
      expect(level50.initialTubes[0].capacity).toBe(13);
      expect(level50.initialTubes.length).toBe(13);
    });

    it('should always have exactly 1 empty tube', () => {
      const levels = [1, 5, 10, 15, 20, 25, 30, 40, 50];

      levels.forEach(levelNum => {
        const level = generateProgressiveLevel(levelNum);
        const emptyTubes = level.initialTubes.filter(tube => tube.segments.length === 0);

        expect(emptyTubes.length).toBe(1);
      });
    });

    it('should follow tubes = colors + 1 formula', () => {
      const levels = [1, 5, 10, 15, 20, 25, 30, 40];

      levels.forEach(levelNum => {
        const level = generateProgressiveLevel(levelNum);
        const numColors = level.colors.length;
        const numTubes = level.initialTubes.length;

        expect(numTubes).toBe(numColors + 1);
      });
    });

    it('should follow capacity = colors + 1 formula', () => {
      const levels = [1, 5, 10, 15, 20, 25, 30, 40];

      levels.forEach(levelNum => {
        const level = generateProgressiveLevel(levelNum);
        const numColors = level.colors.length;
        const capacity = level.initialTubes[0].capacity;

        expect(capacity).toBe(numColors + 1);
      });
    });
  });

  describe('preset level generators', () => {
    it('generateEasyLevel should create an easy level', () => {
      const level = generateEasyLevel(5);

      expect(level.levelId).toBe(5);
      expect(level.colors.length).toBe(3);
      // 3 colors + 2 empty = 5 tubes
      expect(level.initialTubes.length).toBe(5);
    });

    it('generateMediumLevel should create a medium level', () => {
      const level = generateMediumLevel(10);

      expect(level.levelId).toBe(10);
      expect(level.colors.length).toBe(5);
      // 5 colors + 2 empty = 7 tubes
      expect(level.initialTubes.length).toBe(7);
    });

    it('generateHardLevel should create a hard level', () => {
      const level = generateHardLevel(15);

      expect(level.levelId).toBe(15);
      expect(level.colors.length).toBe(7);
      // 7 colors + 1 empty = 8 tubes
      expect(level.initialTubes.length).toBe(8);
    });
  });

  describe('createSimpleTestLevel', () => {
    it('should create a simple test level with 2 colors and 3 tubes', () => {
      const level = createSimpleTestLevel();

      expect(level.levelId).toBe(0);
      expect(level.colors.length).toBe(2);
      expect(level.initialTubes.length).toBe(3);

      // Check tube configurations
      const tube0 = level.initialTubes[0];
      const tube1 = level.initialTubes[1];
      const tube2 = level.initialTubes[2];

      expect(tube0.segments.length).toBe(4);
      expect(tube1.segments.length).toBe(4);
      expect(tube2.segments.length).toBe(0);
    });
  });

  describe('segment distribution', () => {
    it('should distribute each color equally across all tubes', () => {
      const level = generateLevel(1, 3, 1);
      const capacity = 4; // 3 colors + 1

      // Count occurrences of each color
      const colorCounts = new Map<string, number>();

      level.initialTubes.forEach(tube => {
        tube.segments.forEach(segment => {
          const count = colorCounts.get(segment.color) || 0;
          colorCounts.set(segment.color, count + 1);
        });
      });

      // Each color should appear exactly 'capacity' times
      level.colors.forEach(color => {
        expect(colorCounts.get(color)).toBe(capacity);
      });
    });
  });

  describe('tube capacity consistency', () => {
    it('should set same capacity for all tubes in a level', () => {
      const level = generateLevel(1, 5, 1);

      const capacities = level.initialTubes.map(tube => tube.capacity);
      const uniqueCapacities = new Set(capacities);

      // All tubes should have the same capacity
      expect(uniqueCapacities.size).toBe(1);
    });
  });
});

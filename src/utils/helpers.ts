/**
 * Helper utility functions
 */

import type { Tube, Segment } from '../core/types';
import { TUBE_CAPACITY } from './constants';

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Create an empty tube
 */
export const createEmptyTube = (id: number): Tube => ({
  id,
  segments: [],
  capacity: TUBE_CAPACITY,
});

/**
 * Create a segment with a specific color
 */
export const createSegment = (color: string): Segment => ({
  color,
  id: generateId(),
});

/**
 * Get the top segment of a tube
 */
export const getTopSegment = (tube: Tube): Segment | null => {
  return tube.segments.length > 0 ? tube.segments[tube.segments.length - 1] : null;
};

/**
 * Check if a tube is empty
 */
export const isTubeEmpty = (tube: Tube): boolean => {
  return tube.segments.length === 0;
};

/**
 * Check if a tube is full
 */
export const isTubeFull = (tube: Tube): boolean => {
  return tube.segments.length === tube.capacity;
};

/**
 * Get available space in a tube
 */
export const getAvailableSpace = (tube: Tube): number => {
  return tube.capacity - tube.segments.length;
};

/**
 * Deep clone a tube (creates new segment objects with new IDs)
 */
export const cloneTube = (tube: Tube): Tube => ({
  id: tube.id,
  capacity: tube.capacity,
  segments: tube.segments.map((segment) => createSegment(segment.color)),
});

/**
 * Deep clone an array of tubes
 */
export const cloneTubes = (tubes: Tube[]): Tube[] => {
  return tubes.map((tube) => cloneTube(tube));
};

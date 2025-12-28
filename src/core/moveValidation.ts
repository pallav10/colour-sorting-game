/**
 * Move Validation Module
 * Validates whether a move from source to destination tube is legal
 */

import type { Tube, ValidationResult } from './types';
import { isTubeEmpty, isTubeFull, getAvailableSpace } from '../utils/helpers';

/**
 * Check if source tube is valid for a move
 * Requirements:
 * - Source tube must have at least one segment
 */
export const isSourceValid = (tube: Tube): boolean => {
  return !isTubeEmpty(tube);
};

/**
 * Check if destination tube is valid for receiving segments
 * Requirements:
 * - Destination just needs to have space (color matching not required)
 */
export const isDestinationValid = (): boolean => {
  // Any tube with space is valid (color matching removed)
  return true;
};

/**
 * Check if destination has enough capacity for at least one segment
 */
export const hasCapacity = (destTube: Tube, segmentsToMove: number = 1): boolean => {
  return getAvailableSpace(destTube) >= segmentsToMove;
};

/**
 * Validate a complete move from source to destination
 * Returns detailed validation result
 */
export const validateMove = (sourceTube: Tube, destTube: Tube): ValidationResult => {
  // Cannot move to the same tube
  if (sourceTube.id === destTube.id) {
    return {
      isValid: false,
      reason: 'Cannot move to the same tube',
    };
  }

  // Check source validity
  if (!isSourceValid(sourceTube)) {
    return {
      isValid: false,
      reason: 'Source tube is empty',
    };
  }

  // Check if destination is full
  if (isTubeFull(destTube)) {
    return {
      isValid: false,
      reason: 'Destination tube is full',
    };
  }

  // Destination is always valid if it has space (color matching removed)

  // Check capacity (at least 1 segment must fit)
  if (!hasCapacity(destTube, 1)) {
    return {
      isValid: false,
      reason: 'Destination tube has no available space',
    };
  }

  return {
    isValid: true,
  };
};

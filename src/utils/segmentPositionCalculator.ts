/**
 * Segment Position Calculator
 * Single source of truth for all position calculations
 */

import type { Tube } from '../core/types';

// Constants - SINGLE SOURCE OF TRUTH
export const SEGMENT_HEIGHT = 48;
export const SEGMENT_GAP = 4;
export const TUBE_PADDING = 8;

/**
 * Calculate hover Y offset above tube
 * Segments should float above the tube top
 */
export const calculateHoverOffset = (tubeCapacity: number): number => {
  const tubeHeight = tubeCapacity * (SEGMENT_HEIGHT + SEGMENT_GAP) + TUBE_PADDING * 2;
  return -(tubeHeight + 20); // 20px above the tube top
};

/**
 * Calculate where segments should land in destination tube
 * Returns relative offset from source tube's padding bottom
 *
 * CRITICAL: All calculations use the same anchor point (tube bottom padding edge)
 * - HoveringSegments uses "absolute bottom-0" → anchored at padding bottom
 * - sourceRect.bottom and destRect.bottom are border bottom
 * - We account for TUBE_PADDING offset consistently
 */
export const calculateLandingPosition = (
  sourceRect: DOMRect,
  targetRect: DOMRect,
  targetTube: Tube
): { x: number; y: number } => {
  // Existing segments in destination (tubes state not yet updated)
  const destSegmentCount = targetTube.segments.length;

  // Source anchor point: padding bottom
  const sourceAnchor = sourceRect.bottom - TUBE_PADDING;

  // Target anchor point: padding bottom
  const targetAnchor = targetRect.bottom - TUBE_PADDING;

  // Calculate stack height of existing segments
  const stackHeight = destSegmentCount * (SEGMENT_HEIGHT + SEGMENT_GAP);

  // Target Y position (padding bottom - stack height)
  const targetY = targetAnchor - stackHeight;

  // Calculate relative offset from source anchor
  return {
    x: targetRect.left - sourceRect.left,
    y: targetY - sourceAnchor,
  };
};

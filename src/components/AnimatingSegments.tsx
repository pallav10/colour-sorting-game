/**
 * AnimatingSegments Component
 * Single animation component for ALL segment movements (hover, pour, bounce)
 * Uses consistent spring animation for all scenarios
 */

import { motion } from 'framer-motion';
import type { Segment as SegmentType } from '../core/types';
import { Segment } from './Segment';

interface AnimatingSegmentsProps {
  segments: SegmentType[];
  startPosition: 'inside-tube' | 'hovering';
  targetPosition: { x: number; y: number } | null;
  hoverOffset: number;
  visibleSegmentCount: number;
  onComplete?: () => void;
}

export const AnimatingSegments = ({
  segments,
  startPosition,
  targetPosition,
  hoverOffset,
  visibleSegmentCount,
  onComplete,
}: AnimatingSegmentsProps) => {
  if (segments.length === 0) return null;

  // Standard transition for ALL movements
  const standardTransition = {
    type: 'spring' as const,
    stiffness: 300,
    damping: 25,
  };

  // Calculate actual starting position of segments in tube
  // Negative Y moves UP from tube bottom
  const SEGMENT_HEIGHT = 48;
  const SEGMENT_GAP = 4;
  const actualSegmentPosition = -(visibleSegmentCount * (SEGMENT_HEIGHT + SEGMENT_GAP));

  // Determine initial and animate states
  const getAnimationStates = () => {
    if (targetPosition) {
      // Pouring: hovering → destination
      return {
        initial: { y: hoverOffset, x: 0 },
        animate: {
          x: targetPosition.x,
          y: targetPosition.y,
        },
      };
    } else if (startPosition === 'inside-tube') {
      // Pickup: from actual position in tube (negative = up from bottom) → hover
      return {
        initial: { y: actualSegmentPosition },
        animate: { y: hoverOffset },
      };
    } else {
      // Already hovering
      return {
        initial: { y: hoverOffset },
        animate: { y: hoverOffset },
      };
    }
  };

  const { initial, animate } = getAnimationStates();

  return (
    <motion.div
      initial={initial}
      animate={animate}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
      transition={standardTransition}
      onAnimationComplete={() => {
        if (targetPosition && onComplete) {
          onComplete();
        }
      }}
      className="absolute bottom-0 left-0 right-0 pointer-events-none flex flex-col-reverse"
      style={{
        paddingLeft: '8px',
        paddingRight: '8px',
        gap: '4px',
        zIndex: targetPosition ? 100 : 30,
      }}
    >
      {segments.map((segment, index) => (
        <motion.div
          key={segment.id}
          className="flex-shrink-0"
        >
          <Segment segment={segment} position={index} />
        </motion.div>
      ))}
    </motion.div>
  );
};

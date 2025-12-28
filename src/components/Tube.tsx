/**
 * Tube Component
 * Displays a tube with colored segments
 */

import { motion, AnimatePresence } from 'framer-motion';
import type { Tube as TubeType, Segment as SegmentType } from '../core/types';
import { Segment } from './Segment';
import { HoveringSegments } from './HoveringSegments';
import { getContiguousTopSegments } from '../core/moveExecution';

interface TubeProps {
  tube: TubeType;
  isSelected: boolean;
  isShaking?: boolean;
  isPouring?: boolean;
  isReceiving?: boolean;
  pouringSegments?: SegmentType[] | null;
  receivingSegments?: SegmentType[] | null;
  destPosition?: { x: number; y: number } | null;
  onPouringComplete?: () => void;
  onClick: () => void;
}

export const Tube = ({ tube, isSelected, isShaking = false, isPouring = false, isReceiving = false, pouringSegments = null, receivingSegments = null, destPosition = null, onPouringComplete, onClick }: TubeProps) => {
  // Get segments that would be moved (contiguous top segments of same color)
  // Use pouringSegments if available (during animation), otherwise calculate from tube state
  const hoveringSegments = pouringSegments || (isSelected ? getContiguousTopSegments(tube) : []);

  // Calculate segments to render in tube
  let remainingSegments: SegmentType[];
  if (isPouring) {
    // Source tube during pouring: tube state already updated, show all remaining segments
    remainingSegments = tube.segments;
  } else if (isReceiving && receivingSegments) {
    // Destination tube: exclude the segments being poured (they're still flying)
    remainingSegments = tube.segments.slice(0, tube.segments.length - receivingSegments.length);
  } else if (isSelected) {
    // Selected tube (hovering state): exclude hovering segments
    remainingSegments = tube.segments.slice(0, tube.segments.length - hoveringSegments.length);
  } else {
    // Normal tube: show all segments
    remainingSegments = tube.segments;
  }

  // Create empty slots to fill the tube (use tube's capacity)
  const emptySlots = tube.capacity - remainingSegments.length;

  // Calculate dynamic height based on capacity
  // Each segment is 48px + 4px gap between segments
  const segmentHeight = 48;
  const gapBetweenSegments = 4;
  const tubeHeight = tube.capacity * (segmentHeight + gapBetweenSegments) + 16; // 16px for padding

  // Calculate hover offset - segments should float above the tube top
  const hoverOffset = -(tubeHeight + 20); // 20px above the tube top

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Tube container */}
      <motion.button
        onClick={onClick}
        animate={
          isShaking
            ? {
                x: [0, -10, 10, -10, 10, 0],
                transition: { duration: 0.3 },
              }
            : isSelected
            ? {
                scale: 1.05,
                y: -5,
              }
            : {
                scale: 1,
                y: 0,
              }
        }
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
        className={`
          w-20 p-2 relative
          transition-all duration-200
          cursor-pointer
          flex flex-col-reverse justify-start
          bg-white/5 border-2 border-white/20 rounded-lg
          backdrop-blur-sm shadow-lg
          ${isSelected ? 'ring-4 ring-yellow-400 ring-offset-2 ring-offset-transparent' : ''}
        `}
        style={{
          height: `${tubeHeight}px`,
          gap: `${gapBetweenSegments}px`
        }}
      >
        {/* Filled segments from bottom to top (only non-hovering segments) */}
        {remainingSegments.map((segment, index) => (
          <motion.div
            key={segment.id}
            initial={false}
            animate={{ opacity: 1 }}
            className="flex-shrink-0"
          >
            <Segment segment={segment} position={index} />
          </motion.div>
        ))}

        {/* Empty slots at the top */}
        <AnimatePresence>
          {Array(emptySlots)
            .fill(null)
            .map((_, index) => (
              <motion.div
                key={`empty-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-sm bg-white/5 flex-shrink-0"
                style={{ height: `${segmentHeight}px` }}
              />
            ))}
        </AnimatePresence>

        {/* Hovering segments when selected */}
        <AnimatePresence>
          {isSelected && hoveringSegments.length > 0 && (
            <HoveringSegments
              segments={hoveringSegments}
              hoverOffset={hoverOffset}
              isPouring={isPouring}
              destPosition={destPosition}
              onPouringComplete={onPouringComplete}
            />
          )}
        </AnimatePresence>

        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/10 rounded-lg pointer-events-none" />

        {/* Selection glow effect */}
        {isSelected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              boxShadow: '0 0 20px 5px rgba(250, 204, 21, 0.5)',
            }}
          />
        )}
      </motion.button>

      {/* Tube number label */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xs text-white/50 font-mono"
      >
        #{tube.id}
      </motion.span>
    </div>
  );
};

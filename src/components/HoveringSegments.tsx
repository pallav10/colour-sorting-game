/**
 * HoveringSegments Component
 * Displays segments hovering above a selected tube
 */

import { motion } from 'framer-motion';
import type { Segment as SegmentType } from '../core/types';
import { Segment } from './Segment';

interface HoveringSegmentsProps {
  segments: SegmentType[];
  hoverOffset: number;
  isPouring?: boolean;
  destPosition?: { x: number; y: number } | null;
  onPouringComplete?: () => void;
}

export const HoveringSegments = ({
  segments,
  hoverOffset,
  isPouring = false,
  destPosition,
  onPouringComplete,
}: HoveringSegmentsProps) => {
  if (segments.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 0, opacity: 0, scale: 0.95 }}
      animate={
        isPouring && destPosition
          ? {
              x: destPosition.x,
              y: destPosition.y, // Move to actual landing position inside destination tube
              opacity: 1,
              scale: 1, // Normal size when flying
            }
          : {
              y: hoverOffset, // Hover above the tube based on tube height
              opacity: 1,
              x: 0,
              scale: 1, // Normal size when hovering (changed from 1.05)
            }
      }
      onAnimationComplete={() => {
        if (isPouring && onPouringComplete) {
          onPouringComplete();
        }
      }}
      exit={{ opacity: 0, transition: { duration: 0 } }}
      transition={
        isPouring
          ? {
              // Use tween for pouring - more predictable and precise
              type: 'tween',
              duration: 0.5,
              ease: [0.4, 0.0, 0.2, 1], // Smooth ease out
            }
          : {
              // Use spring for hovering
              type: 'spring',
              stiffness: 250,
              damping: 20,
            }
      }
      className="absolute bottom-0 left-0 right-0 pointer-events-none flex flex-col-reverse"
      style={{
        paddingLeft: '8px',
        paddingRight: '8px',
        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))',
        gap: '4px',
        zIndex: isPouring ? 50 : 30, // Higher z-index when flying to appear above destination tube
      }}
    >
      {segments.map((segment, index) => (
        <motion.div
          key={segment.id}
          initial={{ scale: 0.95, y: 0 }}
          animate={
            isPouring
              ? {
                  scale: 1,
                  y: 0, // No floating when pouring
                }
              : {
                  scale: 1,
                  y: [0, -8, 0], // Gentle floating animation when hovering
                }
          }
          transition={{
            delay: index * 0.05,
            type: 'spring',
            stiffness: 400,
            damping: 20,
            y: isPouring
              ? {}
              : {
                  repeat: Infinity,
                  duration: 2,
                  ease: 'easeInOut',
                  delay: index * 0.1,
                },
          }}
          className="flex-shrink-0"
          style={{
            filter: 'brightness(1.1)', // Make them slightly brighter
          }}
        >
          <Segment segment={segment} position={index} />
        </motion.div>
      ))}
    </motion.div>
  );
};

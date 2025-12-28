/**
 * HoveringSegments Component
 * Displays segments hovering above a selected tube
 */

import { motion } from 'framer-motion';
import type { Segment as SegmentType } from '../core/types';
import { Segment } from './Segment';

interface HoveringSegmentsProps {
  segments: SegmentType[];
  isPouring?: boolean;
  targetPosition?: { x: number; y: number };
}

export const HoveringSegments = ({
  segments,
  isPouring = false,
  targetPosition,
}: HoveringSegmentsProps) => {
  if (segments.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 0, opacity: 0, scale: 0.95 }}
      animate={
        isPouring && targetPosition
          ? {
              x: targetPosition.x,
              y: targetPosition.y,
              opacity: 1,
              scale: 1,
            }
          : {
              y: -220, // Fly REALLY high above the tube
              opacity: 1,
              x: 0,
              scale: 1.05, // Slightly larger when hovering
            }
      }
      exit={{ y: 0, opacity: 0, scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: isPouring ? 400 : 250,
        damping: isPouring ? 30 : 20,
        duration: isPouring ? 0.6 : 0.4,
      }}
      className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none flex flex-col-reverse"
      style={{
        paddingLeft: '8px',
        paddingRight: '8px',
        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))',
        gap: '4px',
      }}
    >
      {segments.map((segment, index) => (
        <motion.div
          key={segment.id}
          initial={{ scale: 0.95, y: 0 }}
          animate={{
            scale: 1,
            y: [0, -8, 0], // Gentle floating animation
          }}
          transition={{
            delay: index * 0.05,
            type: 'spring',
            stiffness: 400,
            damping: 20,
            y: {
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

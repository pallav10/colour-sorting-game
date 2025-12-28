/**
 * PouringAnimation Component
 * Animates segments flying from source to destination tube
 */

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Segment as SegmentType } from '../core/types';
import { Segment } from './Segment';

interface PouringAnimationProps {
  segments: SegmentType[];
  sourcePosition: { x: number; y: number };
  destPosition: { x: number; y: number };
  onComplete: () => void;
}

export const PouringAnimation = ({
  segments,
  sourcePosition,
  destPosition,
  onComplete,
}: PouringAnimationProps) => {
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Small delay before starting animation
    const startTimer = setTimeout(() => setHasStarted(true), 50);

    // Call onComplete after animation duration
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 800);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!hasStarted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <motion.div
        initial={{
          position: 'absolute',
          left: sourcePosition.x,
          top: sourcePosition.y,
        }}
        animate={{
          left: destPosition.x,
          top: destPosition.y,
        }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 20,
          duration: 0.6,
        }}
        className="flex flex-col-reverse"
        style={{ width: '64px', gap: '4px' }}
      >
        {segments.map((segment, index) => (
          <motion.div
            key={segment.id}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: index * 0.05,
            }}
            className="flex-shrink-0"
          >
            <Segment segment={segment} position={index} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

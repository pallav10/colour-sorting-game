/**
 * TubeContainer Component
 * Grid layout for displaying all tubes
 */

import { motion } from 'framer-motion';
import { useRef } from 'react';
import type { Tube as TubeType } from '../core/types';
import { Tube } from './Tube';

interface TubeContainerProps {
  tubes: TubeType[];
  selectedTubeId: number | null;
  shakingTubeId?: number | null;
  onTubeClick: (tubeId: number, element?: HTMLElement) => void;
}

export const TubeContainer = ({
  tubes,
  selectedTubeId,
  shakingTubeId = null,
  onTubeClick,
}: TubeContainerProps) => {
  const tubeElementsRef = useRef<Map<number, HTMLElement>>(new Map());

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 place-items-center"
      >
        {tubes.map((tube, index) => (
          <motion.div
            key={tube.id}
            ref={(el) => {
              if (el) tubeElementsRef.current.set(tube.id, el);
            }}
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.05,
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }}
          >
            <Tube
              tube={tube}
              isSelected={selectedTubeId === tube.id}
              isShaking={shakingTubeId === tube.id}
              onClick={() => {
                const element = tubeElementsRef.current.get(tube.id);
                onTubeClick(tube.id, element);
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

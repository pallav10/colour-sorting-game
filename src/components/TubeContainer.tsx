/**
 * TubeContainer Component
 * Grid layout for displaying all tubes
 * Calculates visibility and animation props for each tube
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useRef, RefObject } from 'react';
import type { Tube as TubeType } from '../core/types';
import { Tube } from './Tube';
import { AnimatingSegments } from './AnimatingSegments';
import { getContiguousTopSegments } from '../core/moveExecution';
import {
  calculateHoverOffset,
  calculateLandingPosition,
} from '../utils/segmentPositionCalculator';

interface TubeContainerProps {
  tubes: TubeType[];
  selectedTubeId: number | null;
  pouringToTubeId: number | null;
  shakingTubeId?: number | null;
  onTubeClick: (tubeId: number, element?: HTMLElement) => void;
  onPouringComplete?: () => void;
  tubeRefs: RefObject<Map<number, HTMLElement>>;
}

export const TubeContainer = ({
  tubes,
  selectedTubeId,
  pouringToTubeId,
  shakingTubeId = null,
  onTubeClick,
  onPouringComplete,
  tubeRefs,
}: TubeContainerProps) => {
  const tubeElementsRef = useRef<Map<number, HTMLElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  // Get tube render props (visibility and animation data)
  const getTubeRenderProps = (tube: TubeType) => {
    const isSource = selectedTubeId === tube.id;

    // Get segments that are animating (if this is source tube)
    const animatingSegments = isSource ? getContiguousTopSegments(tube) : [];

    // Calculate visible segments (exclude animating ones)
    // Note: tubes state is NOT updated until animation completes
    // So we just hide the segments that are currently animating
    const visibleSegments = isSource
      ? tube.segments.slice(0, -animatingSegments.length) // Hide lifted segments
      : tube.segments; // Show all

    // Calculate hover offset for this tube
    const hoverOffset = calculateHoverOffset(tube.capacity);

    // Calculate target position (if animating to a destination)
    let targetPosition: { x: number; y: number } | null = null;
    if (isSource && pouringToTubeId !== null && tubeRefs.current) {
      const sourceEl = tubeRefs.current.get(tube.id);
      const targetEl = tubeRefs.current.get(pouringToTubeId);
      const targetTube = tubes.find((t) => t.id === pouringToTubeId);

      if (sourceEl && targetEl && targetTube) {
        const sourceRect = sourceEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();
        targetPosition = calculateLandingPosition(
          sourceRect,
          targetRect,
          targetTube
        );
      }
    }

    return {
      visibleSegments,
      animatingSegments,
      targetPosition,
      hoverOffset,
    };
  };

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto px-4 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 place-items-center"
      >
        {tubes.map((tube, index) => {
          const renderProps = getTubeRenderProps(tube);

          return (
            <motion.div
              key={tube.id}
              ref={(el) => {
                if (el) {
                  tubeElementsRef.current.set(tube.id, el);
                  if (tubeRefs.current) {
                    tubeRefs.current.set(tube.id, el);
                  }
                }
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
                visibleSegments={renderProps.visibleSegments}
                isSelected={selectedTubeId === tube.id}
                isShaking={shakingTubeId === tube.id}
                onClick={() => {
                  const element = tubeElementsRef.current.get(tube.id);
                  onTubeClick(tube.id, element);
                }}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Render AnimatingSegments at container level to ensure proper z-index */}
      {selectedTubeId !== null && (() => {
        const sourceTube = tubes.find((t) => t.id === selectedTubeId);
        if (!sourceTube) return null;

        const animatingSegments = getContiguousTopSegments(sourceTube);
        if (animatingSegments.length === 0) return null;

        const hoverOffset = calculateHoverOffset(sourceTube.capacity);

        // Calculate target position if pouring
        let targetPosition: { x: number; y: number } | null = null;
        if (pouringToTubeId !== null && tubeRefs.current) {
          const sourceEl = tubeRefs.current.get(selectedTubeId);
          const targetEl = tubeRefs.current.get(pouringToTubeId);
          const targetTube = tubes.find((t) => t.id === pouringToTubeId);

          if (sourceEl && targetEl && targetTube) {
            const sourceRect = sourceEl.getBoundingClientRect();
            const targetRect = targetEl.getBoundingClientRect();
            targetPosition = calculateLandingPosition(
              sourceRect,
              targetRect,
              targetTube
            );
          }
        }

        // Get source tube element position
        const sourceEl = tubeRefs.current?.get(selectedTubeId);
        if (!sourceEl || !containerRef.current) return null;

        const sourceRect = sourceEl.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        // Position wrapper at tube location
        return (
          <div
            style={{
              position: 'absolute',
              left: sourceRect.left - containerRect.left,
              top: sourceRect.top - containerRect.top,
              width: sourceRect.width,
              height: sourceRect.height,
              pointerEvents: 'none',
              zIndex: 1000,
            }}
          >
            <AnimatePresence mode="wait">
              <AnimatingSegments
                key={`animating-${selectedTubeId}`}
                segments={animatingSegments}
                startPosition={targetPosition ? 'hovering' : 'inside-tube'}
                targetPosition={targetPosition}
                hoverOffset={hoverOffset}
                visibleSegmentCount={sourceTube.segments.length - animatingSegments.length}
                onComplete={onPouringComplete}
              />
            </AnimatePresence>
          </div>
        );
      })()}
    </div>
  );
};

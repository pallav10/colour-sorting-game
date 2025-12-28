/**
 * TubeContainer Component
 * Grid layout for displaying all tubes
 */

import { motion } from 'framer-motion';
import { useRef, RefObject } from 'react';
import type { Tube as TubeType, Segment } from '../core/types';
import { Tube } from './Tube';

interface TubeContainerProps {
  tubes: TubeType[];
  selectedTubeId: number | null;
  isPouringToTube: number | null;
  pouringSegments: Segment[] | null;
  shakingTubeId?: number | null;
  onTubeClick: (tubeId: number, element?: HTMLElement) => void;
  onPouringComplete?: () => void;
  tubeRefs: RefObject<Map<number, HTMLElement>>;
}

export const TubeContainer = ({
  tubes,
  selectedTubeId,
  isPouringToTube,
  pouringSegments,
  shakingTubeId = null,
  onTubeClick,
  onPouringComplete,
  tubeRefs,
}: TubeContainerProps) => {
  const tubeElementsRef = useRef<Map<number, HTMLElement>>(new Map());

  // Calculate destination position for pouring animation
  const getDestPosition = (destTubeId: number) => {
    if (!tubeRefs.current) return null;

    const sourceEl = tubeRefs.current.get(selectedTubeId!);
    const destEl = tubeRefs.current.get(destTubeId);

    if (!sourceEl || !destEl || !pouringSegments) return null;

    const sourceRect = sourceEl.getBoundingClientRect();
    const destRect = destEl.getBoundingClientRect();

    // Find the destination tube
    const destTube = tubes.find((t) => t.id === destTubeId);
    if (!destTube) return null;

    // Calculate where segments should land in destination tube
    // They should stack on top of existing segments (excluding the ones being poured)
    const destSegmentCount = destTube.segments.length - pouringSegments.length;
    const segmentHeight = 48;
    const gapBetweenSegments = 4;
    const tubePadding = 8; // Tube has p-2 = 8px padding

    // IMPORTANT: HoveringSegments is positioned as "absolute bottom-0" within the tube,
    // which means its bottom edge is at the tube's padding edge (8px above border bottom).
    // However, sourceRect.bottom and destRect.bottom give us the border bottom.
    // We need to account for this 8px offset.

    // After existing segments, the flying segments should land at this Y offset from border bottom
    const yOffsetFromDestBottom = tubePadding + (destSegmentCount * (segmentHeight + gapBetweenSegments));

    // Calculate absolute Y position where HoveringSegments bottom should be (at padding edge)
    const absoluteLandingY = destRect.bottom - yOffsetFromDestBottom;

    // HoveringSegments starts at sourceRect.bottom - tubePadding (padding edge)
    // Calculate relative offset from source tube's padding bottom
    const sourceHoveringBottom = sourceRect.bottom - tubePadding;

    return {
      x: destRect.left - sourceRect.left,
      y: absoluteLandingY - sourceHoveringBottom,
    };
  };

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
              isSelected={selectedTubeId === tube.id}
              isShaking={shakingTubeId === tube.id}
              isPouring={selectedTubeId === tube.id && isPouringToTube !== null}
              isReceiving={isPouringToTube === tube.id}
              pouringSegments={selectedTubeId === tube.id ? pouringSegments : null}
              receivingSegments={isPouringToTube === tube.id ? pouringSegments : null}
              destPosition={selectedTubeId === tube.id && isPouringToTube !== null ? getDestPosition(isPouringToTube) : null}
              onPouringComplete={selectedTubeId === tube.id ? onPouringComplete : undefined}
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

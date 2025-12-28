/**
 * GameScreen Component
 * Main game screen that integrates all game components
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useCallback } from 'react';
import { useGameStore } from '../store/useGameStore';
import { useShakeAnimation } from '../hooks/useAnimation';
import { Header } from './Header';
import { TubeContainer } from './TubeContainer';
import { CompletionModal } from './CompletionModal';
import { PouringAnimation } from './PouringAnimation';
import { validateMove } from '../core/moveValidation';
import { getContiguousTopSegments } from '../core/moveExecution';
import type { Segment } from '../core/types';

export const GameScreen = () => {
  const {
    tubes,
    selectedTubeId,
    moveCount,
    currentLevel,
    isCompleted,
    optimalMoves,
    canUndo,
    getBestScore,
    getCurrentStarRating,
    attemptMove,
    undo,
    restart,
    nextLevel,
    returnToMenu,
  } = useGameStore();

  const bestScore = getBestScore(currentLevel);
  const currentStars = getCurrentStarRating();

  const { shakingTubeId, triggerShake } = useShakeAnimation();

  // Pour animation state
  const [pouringSegments, setPouringSegments] = useState<Segment[] | null>(null);
  const [sourcePos, setSourcePos] = useState({ x: 0, y: 0 });
  const [destPos, setDestPos] = useState({ x: 0, y: 0 });
  const tubeRefs = useRef<Map<number, HTMLElement>>(new Map());

  const handleTubeClick = useCallback(
    (tubeId: number, element?: HTMLElement) => {
      // Store tube element ref for position calculation
      if (element) {
        tubeRefs.current.set(tubeId, element);
      }

      // If a tube is selected and clicking a different tube
      if (selectedTubeId !== null && selectedTubeId !== tubeId) {
        const sourceTube = tubes.find((t) => t.id === selectedTubeId);
        const destTube = tubes.find((t) => t.id === tubeId);

        if (sourceTube && destTube) {
          const validation = validateMove(sourceTube, destTube);

          if (!validation.isValid) {
            // Trigger shake animation for invalid move
            triggerShake(tubeId);
            attemptMove(tubeId);
            return;
          }

          // Valid move - start pour animation
          const sourceEl = tubeRefs.current.get(selectedTubeId);
          const destEl = tubeRefs.current.get(tubeId);

          if (sourceEl && destEl) {
            const sourceRect = sourceEl.getBoundingClientRect();
            const destRect = destEl.getBoundingClientRect();

            const segments = getContiguousTopSegments(sourceTube);

            setSourcePos({
              x: sourceRect.left,
              y: sourceRect.top - 220, // Account for much higher hover offset
            });
            setDestPos({
              x: destRect.left,
              y: destRect.bottom - ((destTube.segments.length + segments.length) * 52), // Stack on top of existing segments (48px + 4px gap)
            });
            setPouringSegments(segments);

            // Call attemptMove with callback to execute after animation
            attemptMove(tubeId, () => {
              setPouringSegments(null);
            });
            return;
          }
        }
      }

      // Always call attemptMove for selection logic
      attemptMove(tubeId);
    },
    [selectedTubeId, tubes, triggerShake, attemptMove]
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with controls */}
      <Header
        level={currentLevel}
        moveCount={moveCount}
        bestScore={bestScore}
        canUndo={canUndo()}
        onUndo={undo}
        onRestart={restart}
        onReturnToMenu={returnToMenu}
      />

      {/* Main game area */}
      <main className="flex-1 flex items-center justify-center py-8">
        <TubeContainer
          key={`level-${currentLevel}`}
          tubes={tubes}
          selectedTubeId={selectedTubeId}
          shakingTubeId={shakingTubeId}
          onTubeClick={handleTubeClick}
        />
      </main>

      {/* Instructions */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="pb-8 px-4 text-center"
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={selectedTubeId?.toString() || 'default'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="text-white/60 text-sm max-w-md mx-auto"
          >
            {selectedTubeId !== null ? (
              <>
                <span className="text-yellow-400 font-semibold">
                  Tube #{selectedTubeId} selected
                </span>
                {' '}- Click another tube to pour, or click again to deselect
              </>
            ) : (
              'Click a tube to select it, then click another tube to pour'
            )}
          </motion.p>
        </AnimatePresence>
      </motion.footer>

      {/* Completion modal */}
      {isCompleted && (
        <CompletionModal
          level={currentLevel}
          moveCount={moveCount}
          optimalMoves={optimalMoves}
          stars={currentStars}
          onNextLevel={nextLevel}
          onRestart={restart}
        />
      )}

      {/* Pouring animation overlay */}
      <AnimatePresence>
        {pouringSegments && (
          <PouringAnimation
            segments={pouringSegments}
            sourcePosition={sourcePos}
            destPosition={destPos}
            onComplete={() => setPouringSegments(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

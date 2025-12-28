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
import { validateMove } from '../core/moveValidation';

export const GameScreen = () => {
  const {
    tubes,
    selectedTubeId,
    isPouringToTube,
    pouringSegments,
    moveCount,
    currentLevel,
    isCompleted,
    canUndo,
    getBestScore,
    attemptMove,
    completePour,
    undo,
    restart,
    nextLevel,
    returnToMenu,
  } = useGameStore();

  const bestScore = getBestScore(currentLevel);

  const { shakingTubeId, triggerShake } = useShakeAnimation();

  // Store tube element refs for position calculation
  const tubeRefs = useRef<Map<number, HTMLElement>>(new Map());

  // Handle animation complete
  const handlePouringComplete = useCallback(() => {
    completePour();
  }, [completePour]);

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
          attemptMove(tubeId);
          return;
        }
      }

      // Select/deselect tube
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
          isPouringToTube={isPouringToTube}
          pouringSegments={pouringSegments}
          shakingTubeId={shakingTubeId}
          onTubeClick={handleTubeClick}
          onPouringComplete={handlePouringComplete}
          tubeRefs={tubeRefs}
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
          onNextLevel={nextLevel}
          onRestart={restart}
        />
      )}
    </div>
  );
};

/**
 * Animation Hooks
 * Custom hooks for game animations
 */

import { useState, useCallback } from 'react';

/**
 * Hook for managing shake animation state
 */
export const useShakeAnimation = () => {
  const [shakingTubeId, setShakingTubeId] = useState<number | null>(null);

  const triggerShake = useCallback((tubeId: number) => {
    setShakingTubeId(tubeId);
    setTimeout(() => setShakingTubeId(null), 300);
  }, []);

  return { shakingTubeId, triggerShake };
};

/**
 * Hook for managing pour animation state
 */
export const usePourAnimation = () => {
  const [isPouring, setIsPouring] = useState(false);
  const [pourFromId, setPourFromId] = useState<number | null>(null);
  const [pourToId, setPourToId] = useState<number | null>(null);

  const startPour = useCallback((fromId: number, toId: number) => {
    setIsPouring(true);
    setPourFromId(fromId);
    setPourToId(toId);
  }, []);

  const endPour = useCallback(() => {
    setIsPouring(false);
    setPourFromId(null);
    setPourToId(null);
  }, []);

  return { isPouring, pourFromId, pourToId, startPour, endPour };
};

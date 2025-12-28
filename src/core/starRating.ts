/**
 * Star Rating Module
 * Calculates star ratings based on player performance vs optimal solution
 */

/**
 * Calculate star rating (1-3 stars) based on moves taken vs optimal moves
 *
 * @param actualMoves - Number of moves the player took
 * @param optimalMoves - Minimum number of moves needed (calculated by solver)
 * @returns Number of stars (1, 2, or 3)
 *
 * Rating criteria:
 * - 3 stars: Same as optimal (100% efficiency)
 * - 2 stars: Within 50% of optimal (100% < efficiency <= 150%)
 * - 1 star: More than 50% over optimal (efficiency > 150%)
 */
export const calculateStarRating = (
  actualMoves: number,
  optimalMoves: number | null
): number => {
  // If optimal moves not available, always give 3 stars
  if (optimalMoves === null) {
    return 3;
  }

  // Perfect score
  if (actualMoves <= optimalMoves) {
    return 3;
  }

  // Calculate percentage over optimal
  const percentageOver = ((actualMoves - optimalMoves) / optimalMoves) * 100;

  if (percentageOver <= 50) {
    return 2; // Within 50% of optimal
  }

  return 1; // More than 50% over optimal
};

/**
 * Get a descriptive message for the star rating
 */
export const getStarRatingMessage = (stars: number): string => {
  switch (stars) {
    case 3:
      return 'Perfect! Optimal solution!';
    case 2:
      return 'Great job!';
    case 1:
      return 'Level Complete!';
    default:
      return 'Level Complete!';
  }
};

/**
 * CompletionModal Component
 * Displayed when a level is completed
 */

import { motion, AnimatePresence } from 'framer-motion';

interface CompletionModalProps {
  level: number;
  moveCount: number;
  optimalMoves: number | null;
  stars: number;
  onNextLevel: () => void;
  onRestart: () => void;
}

// Confetti particle component
const Confetti = ({ delay }: { delay: number }) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#F7DC6F', '#BB8FCE'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <motion.div
      initial={{ y: -20, opacity: 0, rotate: 0 }}
      animate={{
        y: [0, 600],
        opacity: [0, 1, 1, 0],
        rotate: [0, 360],
        x: [0, (Math.random() - 0.5) * 200],
      }}
      transition={{
        duration: 2,
        delay,
        ease: 'easeOut',
      }}
      className="absolute w-3 h-3 rounded-full"
      style={{
        backgroundColor: randomColor,
        left: `${Math.random() * 100}%`,
      }}
    />
  );
};

export const CompletionModal = ({
  level,
  moveCount,
  optimalMoves,
  stars,
  onNextLevel,
  onRestart,
}: CompletionModalProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        {/* Confetti effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array(30)
            .fill(null)
            .map((_, i) => (
              <Confetti key={i} delay={i * 0.05} />
            ))}
        </div>

        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 100 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: 100 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
          className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 rounded-2xl p-8 max-w-md w-full border-2 border-white/20 shadow-2xl relative"
        >
          {/* Success icon */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.2,
                type: 'spring',
                stiffness: 200,
                damping: 10,
              }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Level Complete!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/80"
            >
              You solved Level {level} in {moveCount} moves
            </motion.p>

            {optimalMoves !== null && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/60 text-sm mt-1"
              >
                Optimal: {optimalMoves} moves
              </motion.p>
            )}
          </div>

          {/* Stars */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3].map((starNumber) => (
              <motion.span
                key={starNumber}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.4 + starNumber * 0.1,
                  type: 'spring',
                  stiffness: 300,
                  damping: 10,
                }}
                className="text-4xl"
              >
                {starNumber <= stars ? '⭐' : '☆'}
              </motion.span>
            ))}
          </div>

          {/* Star rating message */}
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center text-white/90 font-semibold mb-6"
          >
            {stars === 3 && 'Perfect! Optimal solution!'}
            {stars === 2 && 'Great job!'}
            {stars === 1 && 'Level Complete!'}
          </motion.p>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNextLevel}
              className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600
                       hover:from-green-600 hover:to-emerald-700
                       text-white font-bold rounded-lg transition-all duration-200
                       shadow-lg hover:shadow-xl"
            >
              Next Level →
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRestart}
              className="w-full py-3 px-6 bg-white/10 hover:bg-white/20
                       text-white font-medium rounded-lg transition-all duration-200
                       border border-white/30"
            >
              Replay Level
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

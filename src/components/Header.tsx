/**
 * Header Component
 * Game header with level info and controls
 */

import { motion } from 'framer-motion';

interface HeaderProps {
  level: number;
  moveCount: number;
  bestScore: number | null;
  canUndo: boolean;
  onUndo: () => void;
  onRestart: () => void;
  onReturnToMenu: () => void;
}

export const Header = ({ level, moveCount, bestScore, canUndo, onUndo, onRestart, onReturnToMenu }: HeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto px-4 py-6"
    >
      <div className="flex items-center justify-between">
        {/* Level info */}
        <div className="flex flex-col">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold text-white"
          >
            Level {level}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-white/60 flex items-center gap-2"
          >
            <span>
              Moves: <motion.span
                key={moveCount}
                initial={{ scale: 1.5, color: '#fbbf24' }}
                animate={{ scale: 1, color: 'rgba(255, 255, 255, 0.6)' }}
                transition={{ duration: 0.3 }}
                className="inline-block"
              >
                {moveCount}
              </motion.span>
            </span>
            {bestScore !== null && (
              <span className="text-amber-400/80">
                • Best: {bestScore}
              </span>
            )}
          </motion.p>
        </div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2"
        >
          <motion.button
            whileHover={canUndo ? { scale: 1.05 } : {}}
            whileTap={canUndo ? { scale: 0.95 } : {}}
            onClick={onUndo}
            disabled={!canUndo}
            className={`
              btn-primary text-sm font-medium px-3 py-2
              ${!canUndo ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/30'}
            `}
          >
            ↶ Undo
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRestart}
            className="btn-primary text-sm font-medium px-3 py-2 hover:bg-white/30"
          >
            ⟲ Restart
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReturnToMenu}
            className="btn-primary text-sm font-medium px-3 py-2 hover:bg-white/30 bg-purple-600/50"
          >
            ◄ Menu
          </motion.button>
        </motion.div>
      </div>
    </motion.header>
  );
};

/**
 * StartScreen Component
 * Initial screen with difficulty selection
 */

import { motion } from 'framer-motion';
import { useState } from 'react';

interface DifficultyOption {
  name: string;
  description: string;
  startLevel: number;
  colors: number;
  icon: string;
}

interface StartScreenProps {
  onSelectDifficulty: (startLevel: number) => void;
  onResetScores: () => void;
}

const DIFFICULTIES: DifficultyOption[] = [
  {
    name: 'Easy',
    description: '4 colors, 5 segments',
    startLevel: 1,
    colors: 4,
    icon: '🌱',
  },
  {
    name: 'Medium',
    description: '5 colors, 6 segments',
    startLevel: 4,
    colors: 5,
    icon: '🌿',
  },
  {
    name: 'Medium-Hard',
    description: '6 colors, 7 segments',
    startLevel: 7,
    colors: 6,
    icon: '🔥',
  },
  {
    name: 'Hard',
    description: '7 colors, 8 segments',
    startLevel: 11,
    colors: 7,
    icon: '⚡',
  },
  {
    name: 'Very Hard',
    description: '8 colors, 9 segments',
    startLevel: 16,
    colors: 8,
    icon: '💎',
  },
  {
    name: 'Expert',
    description: '9 colors, 10 segments',
    startLevel: 22,
    colors: 9,
    icon: '🏆',
  },
  {
    name: 'Master',
    description: '11 colors, 12 segments',
    startLevel: 37,
    colors: 11,
    icon: '👑',
  },
];

export const StartScreen = ({ onSelectDifficulty, onResetScores }: StartScreenProps) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleResetScores = () => {
    if (showConfirm) {
      onResetScores();
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowConfirm(false), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full"
      >
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Color Sort
          </h1>
          <p className="text-xl text-white/80">
            Choose your difficulty level to begin
          </p>
        </motion.div>

        {/* Difficulty Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DIFFICULTIES.map((difficulty, index) => (
            <motion.button
              key={difficulty.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectDifficulty(difficulty.startLevel)}
              className="group relative bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-xl p-6
                         hover:bg-white/20 hover:border-white/40 transition-all duration-300
                         shadow-lg hover:shadow-2xl"
            >
              {/* Icon */}
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {difficulty.icon}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-2">
                {difficulty.name}
              </h3>

              {/* Description */}
              <p className="text-white/70 text-sm mb-3">
                {difficulty.description}
              </p>

              {/* Level info */}
              <div className="text-xs text-white/50">
                Starts at level {difficulty.startLevel}
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/0 via-white/0 to-white/10
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.button>
          ))}
        </div>

        {/* Footer hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center text-white/60 text-sm mt-8"
        >
          You can change difficulty anytime by restarting the game
        </motion.p>

        {/* Reset Best Scores Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-center mt-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleResetScores}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              showConfirm
                ? 'bg-red-600 text-white border-2 border-red-400 shadow-lg shadow-red-500/50'
                : 'bg-white/10 text-white/70 border-2 border-white/20 hover:bg-white/20 hover:text-white'
            }`}
          >
            {showConfirm ? '🗑️ Click again to confirm reset' : '↻ Reset All Best Scores'}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

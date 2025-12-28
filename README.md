# Color Sorting Game

A polished web-based puzzle game where players sort colored liquids into tubes. Features smooth animations, progressive difficulty, and beautiful visual effects. Built with React, TypeScript, Zustand, and Tailwind CSS.

## Tech Stack

- **React 18+** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Zustand** - State management
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **Vitest** - Testing

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start dev server
npm run dev

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Format code
npm run format
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── core/          # Game logic and types
├── components/    # React components
├── store/         # Zustand state management
├── data/          # Level configurations
├── hooks/         # Custom React hooks
├── utils/         # Helper functions
├── styles/        # CSS files
└── tests/         # Test files
```

## Features

### ✅ Core Gameplay
- **Intuitive tap-based controls** - Select source tube, then destination
- **Smart batch transfers** - Contiguous segments of the same color move together
- **Unlimited undo system** - Reverse any move with full state restoration
- **Win detection** - Automatic level completion when all tubes are sorted
- **Restart capability** - Reset to initial level state anytime

### ✅ Difficulty Selection
- **7 difficulty tiers** - Choose your starting challenge level
- **Easy to Master** - From 4 colors to 11 colors
- **Progressive unlocking** - Start at any difficulty and advance
- **Return to menu** - Switch difficulty levels anytime

### ✅ Progressive Difficulty
- **45+ levels** with gradually increasing complexity
- **Dynamic tube capacity** - Capacity = colors + 1 (scales from 5 to 12 segments)
- **Color scaling** - Begins with 4 colors, reaches 11 colors in master levels
- **Optimal challenge curve** - Always `colors + 1` tubes (exactly 1 empty working space)
- **Intelligent shuffle algorithm** - Guaranteed solvable levels with proper randomization
- **Strategic start state** - Exactly 1 empty tube, all others filled to capacity

### ✅ Visual Polish
- **Glossy liquid segments** - Rounded edges with realistic shine and depth effects
- **Smooth pour animations** - Spring-physics based segment transfers
- **Hover effects** - Selected segments float dramatically above tubes
- **Dynamic tube heights** - Automatically adjusts based on capacity
- **12 vibrant colors** - Carefully selected for visual distinction
- **Responsive design** - Works across different screen sizes

### ✅ Player Progression
- **Best score tracking** - Saves your minimum moves per level (localStorage)
- **Reset scores** - Clear all best scores with confirmation
- **Level persistence** - Progress saved automatically
- **Performance stats** - Compare current attempt to personal best

### ✅ Game Feel
- **4px segment spacing** - Clean, uniform visual separation
- **Celebration effects** - Confetti and animations on level completion
- **Shake feedback** - Invalid moves trigger visual feedback
- **State management** - React key-based level transitions for clean resets

## Game Rules

### Tube Capacity
- **Dynamic capacity**: 4-8 segments per tube based on difficulty level
- Early levels: 4 segments (2-3 colors)
- Medium levels: 5-6 segments (4-7 colors)
- Expert levels: 7-8 segments (8+ colors)

### Move Validation
A move is valid when:
- **Source tube** has at least one segment
- **Destination tube** has available space (not full)
- **No color matching required** - segments can pour onto any color

### Batch Transfer
- All **contiguous segments of the same color** at the top of source tube transfer together
- Transfer continues until destination is full or all eligible segments moved
- Example: Red-Red-Red-Blue source → all 3 reds transfer as one move

### Win Condition
Level complete when **all tubes** are either:
- Completely full with one color only, OR
- Completely empty

### Difficulty Progression

The game features 7 difficulty tiers with progressive level intervals:

| Difficulty | Levels | Colors | Capacity | Tubes | Icon |
|------------|--------|--------|----------|-------|------|
| **Easy** | 1-3 | 4 | 5 segments | 5 | 🌱 |
| **Medium** | 4-6 | 5 | 6 segments | 6 | 🌿 |
| **Medium-Hard** | 7-10 | 6 | 7 segments | 7 | 🔥 |
| **Hard** | 11-15 | 7 | 8 segments | 8 | ⚡ |
| **Very Hard** | 16-21 | 8 | 9 segments | 9 | 💎 |
| **Expert** | 22-29 | 9 | 10 segments | 10 | 🏆 |
| **Master** | 30+ | 10-11 | 11-12 segments | 11-12 | 👑 |

**Formula**: tubes = colors + 1, capacity = colors + 1

## License

MIT

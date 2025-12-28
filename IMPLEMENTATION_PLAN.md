# Color Sorting Game - Implementation Plan

## 1. Project Overview

A web-based color sorting puzzle game where players sort colored liquid segments into tubes following strict rules. The game is deterministic, reversible, and constraint-based.

---

## 2. Technology Stack (Web Version)

### Core Stack
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
  - Lightning-fast HMR (Hot Module Replacement)
  - Optimized production builds
  - Native ESM support
  - TypeScript support out of the box

### State Management
- **Library**: Zustand
  - Minimal boilerplate
  - Built-in temporal middleware for undo/redo
  - TypeScript-first design
  - DevTools support

### Styling
- **Framework**: Tailwind CSS
  - Utility-first approach
  - JIT (Just-In-Time) compiler
  - Responsive design utilities
  - Custom color palette support

### Animation
- **Library**: Framer Motion
  - Declarative animation API
  - Physics-based spring animations
  - Layout animations
  - Gesture support
  - Optimized performance

### Testing
- **Unit Testing**: Vitest (fast, Vite-native)
- **Component Testing**: React Testing Library
- **E2E Testing**: Playwright (optional)

### Development Tools
- **Linting**: ESLint with TypeScript plugin
- **Formatting**: Prettier
- **Git Hooks**: Husky + lint-staged

### Deployment
- **Hosting**: Vercel, Netlify, or GitHub Pages
- **CI/CD**: GitHub Actions

---

## 3. Core Data Structures

### 3.1 Tube Structure
```typescript
interface Segment {
  color: string; // hex color code or color name
  id: string; // unique identifier for animation tracking
}

interface Tube {
  id: number;
  segments: Segment[]; // max 4 segments, ordered from bottom to top
  capacity: 4; // constant
}
```

### 3.2 Game State
```typescript
interface GameState {
  tubes: Tube[];
  selectedTubeId: number | null; // for two-tap interaction
  moveHistory: Move[]; // for undo functionality
  levelConfig: LevelConfig;
  isCompleted: boolean;
  moveCount: number;
  currentLevel: number;
}

interface Move {
  sourceTubeId: number;
  destinationTubeId: number;
  segmentsMoved: number;
  timestamp: number;
}

interface LevelConfig {
  levelId: number;
  colors: string[]; // list of colors used
  initialTubes: Tube[];
  maxUndos?: number; // optional limit
}
```

### 3.3 Zustand Store Structure
```typescript
interface GameStore extends GameState {
  // Actions
  selectTube: (tubeId: number) => void;
  executeMove: (destTubeId: number) => void;
  undo: () => void;
  restart: () => void;
  loadLevel: (levelId: number) => void;

  // Computed (can be selectors)
  canUndo: () => boolean;
  selectedTube: () => Tube | null;
}
```

Example Zustand implementation:
```typescript
import { create } from 'zustand';
import { temporal } from 'zustand/middleware';

const useGameStore = create<GameStore>()(
  temporal((set, get) => ({
    tubes: [],
    selectedTubeId: null,
    moveHistory: [],
    isCompleted: false,
    moveCount: 0,
    currentLevel: 1,
    levelConfig: { levelId: 1, colors: [], initialTubes: [] },

    selectTube: (tubeId) => set({ selectedTubeId: tubeId }),
    executeMove: (destTubeId) => {
      // Move execution logic here
    },
    undo: () => {
      // Undo logic using temporal middleware
    },
    restart: () => {
      // Reset to initial state
    },
    loadLevel: (levelId) => {
      // Load level configuration
    },
    canUndo: () => get().moveHistory.length > 0,
    selectedTube: () => {
      const { tubes, selectedTubeId } = get();
      return tubes.find(t => t.id === selectedTubeId) || null;
    }
  }))
);
```

---

## 4. Core Game Logic Components

### 4.1 Move Validation Module
**File**: `src/core/moveValidation.ts`

Functions needed:
- `isSourceValid(tube: Tube): boolean`
  - Check if source has at least one segment
- `isDestinationValid(sourceTube: Tube, destTube: Tube): boolean`
  - Check if destination is empty OR top color matches
- `hasCapacity(destTube: Tube, segmentsToMove: number): boolean`
  - Check if destination has enough space
- `validateMove(source: Tube, dest: Tube): ValidationResult`
  - Combines all validation checks

### 4.2 Move Execution Module
**File**: `src/core/moveExecution.ts`

Functions needed:
- `getContiguousTopSegments(tube: Tube): Segment[]`
  - Identify all top segments of the same color
- `calculateTransferCount(source: Tube, dest: Tube): number`
  - Determine how many segments can transfer (respecting capacity)
- `executeMove(source: Tube, dest: Tube): {newSource: Tube, newDest: Tube, moveCount: number}`
  - Perform the actual transfer
- `applyMove(gameState: GameState, sourceId: number, destId: number): GameState`
  - Update game state with move result

### 4.3 Win Condition Checker
**File**: `src/core/winCondition.ts`

Functions needed:
- `isTubeComplete(tube: Tube): boolean`
  - Check if tube is empty OR has 4 segments of same color
- `isLevelComplete(tubes: Tube[]): boolean`
  - Check if all tubes meet completion criteria

### 4.4 Undo/Redo System
**File**: `src/core/undoSystem.ts`

Functions needed:
- `recordMove(history: Move[], move: Move): Move[]`
- `undoLastMove(gameState: GameState): GameState`
  - Reverse the last move and update state
- `canUndo(gameState: GameState): boolean`

---

## 5. Level Management

### 5.1 Level Generator
**File**: `src/core/levelGenerator.ts`

Requirements:
- Generate solvable levels
- Ensure each color appears exactly 4 times
- Create configurable difficulty levels
- Randomize initial distribution while maintaining solvability

Algorithm considerations:
- Start with solved state (sorted tubes)
- Apply reverse moves to shuffle
- Track state to ensure solvability
- OR use constraint satisfaction approach

### 5.2 Level Configuration
**File**: `src/data/levels.json`

Store pre-generated levels with:
- Level ID
- Difficulty tier
- Initial tube configuration
- Metadata (colors count, empty tubes)

---

## 6. UI Components Structure

### 6.1 Component Hierarchy
```
App
├── GameScreen
│   ├── Header
│   │   ├── LevelNumber
│   │   └── ActionButtons (Undo, Restart)
│   ├── TubeContainer
│   │   └── Tube (multiple instances)
│   │       └── Segment (multiple instances)
│   └── Footer
│       └── MoveCounter
├── LevelSelector
└── CompletionModal
```

### 6.2 Key Components

**Tube Component** (`src/components/Tube.tsx`)
- Props: tube data, isSelected, onSelect
- Render segments with visual feedback
- Handle tap selection
- Animate pour effects

**Segment Component** (`src/components/Segment.tsx`)
- Props: color, position, isMoving
- Visual representation of liquid segment
- Animation support for transfers

**GameController** (`src/components/GameController.tsx`)
- Manage game state
- Handle user interactions
- Coordinate move execution
- Trigger animations

---

## 7. Animation Requirements

### 7.1 Pour Animation
- Animate segments moving from source to destination
- Sequential animation for multiple segments
- Duration: 300-500ms per segment
- Easing: ease-in-out for natural liquid flow

### 7.2 Selection Feedback
- Highlight selected tube (border glow or elevation)
- Shake animation for invalid moves
- Completion celebration (particles, color burst)

### 7.3 Undo Animation
- Reverse pour animation
- Slightly faster than forward animation (200-300ms)

---

## 8. Implementation Phases

### Phase 1: Core Logic (No UI)
**Duration**: Foundation phase
**Deliverables**:
- [ ] Data structures defined
- [ ] Move validation logic
- [ ] Move execution logic
- [ ] Win condition checker
- [ ] Undo system
- [ ] Unit tests for all core logic

### Phase 2: Basic UI
**Duration**: Visual foundation
**Deliverables**:
- [ ] Project setup (React + Vite + TypeScript)
- [ ] Tailwind CSS configuration
- [ ] Tube component (static)
- [ ] Segment component (static)
- [ ] Game layout (responsive grid)
- [ ] Basic click interaction (no animations)
- [ ] Display game state

### Phase 3: Interaction & State
**Duration**: Core gameplay
**Deliverables**:
- [ ] State management integration
- [ ] Two-tap move selection
- [ ] Move execution with state updates
- [ ] Undo functionality
- [ ] Restart functionality
- [ ] Move counter

### Phase 4: Animations
**Duration**: Polish
**Deliverables**:
- [ ] Pour animations
- [ ] Selection feedback
- [ ] Invalid move feedback
- [ ] Completion celebration
- [ ] Smooth transitions

### Phase 5: Level System
**Duration**: Content
**Deliverables**:
- [ ] Level generator
- [ ] Multiple difficulty levels (5-10 levels minimum)
- [ ] Level selector UI
- [ ] Progress persistence
- [ ] Completion modal

### Phase 6: Polish & Testing
**Duration**: Quality assurance
**Deliverables**:
- [ ] Sound effects (optional)
- [ ] Settings menu (sound toggle, theme)
- [ ] Responsive design testing
- [ ] Performance optimization
- [ ] Cross-device testing
- [ ] User testing & feedback

---

## 9. Testing Strategy

### 9.1 Unit Tests
- All core logic functions
- Move validation edge cases
- Win condition scenarios
- Undo/redo correctness

### 9.2 Integration Tests
- Full game flow (start to completion)
- Multiple move sequences
- Undo after various moves
- Invalid move handling

### 9.3 Manual Testing Scenarios
- Complete a level successfully
- Reach deadlock and restart
- Extensive undo usage
- Rapid tap interactions
- Different screen sizes

---

## 10. File Structure

```
colour-sorting-game/
├── src/
│   ├── core/
│   │   ├── types.ts              # TypeScript interfaces
│   │   ├── moveValidation.ts
│   │   ├── moveExecution.ts
│   │   ├── winCondition.ts
│   │   ├── undoSystem.ts
│   │   └── levelGenerator.ts
│   ├── components/
│   │   ├── Tube.tsx
│   │   ├── Segment.tsx
│   │   ├── GameScreen.tsx
│   │   ├── Header.tsx
│   │   ├── TubeContainer.tsx
│   │   ├── LevelSelector.tsx
│   │   └── CompletionModal.tsx
│   ├── store/
│   │   ├── useGameStore.ts       # Zustand store
│   │   └── middleware.ts         # Temporal middleware for undo
│   ├── data/
│   │   └── levels.json
│   ├── hooks/
│   │   ├── useGameLogic.ts
│   │   └── useAnimation.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   └── helpers.ts
│   ├── styles/
│   │   └── index.css             # Tailwind imports + custom styles
│   ├── App.tsx
│   ├── main.tsx                  # Vite entry point
│   └── vite-env.d.ts
├── tests/
│   ├── core/
│   │   ├── moveValidation.test.ts
│   │   ├── moveExecution.test.ts
│   │   └── winCondition.test.ts
│   ├── components/
│   └── integration/
├── public/
│   └── favicon.ico
├── index.html                     # Vite HTML entry
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tsconfig.node.json
├── .eslintrc.cjs
├── .prettierrc
├── package.json
└── README.md
```

---

## 11. Key Implementation Notes

### 11.1 Move Execution Algorithm
```
1. User taps source tube → store sourceId
2. User taps destination tube → validate move
3. If invalid → clear selection, show feedback
4. If valid:
   a. Get contiguous top segments from source
   b. Calculate how many can fit in destination
   c. Transfer segments one by one
   d. Update tube states
   e. Record move in history
   f. Check win condition
   g. Trigger animation
```

### 11.2 Undo Implementation
- Store complete move information (not just tube states)
- Reverse the exact segments that were moved
- Clear any selection state
- Re-check win condition (might become false)

### 11.3 Level Generation Strategy
- **Approach 1**: Backward solving
  - Start with sorted tubes
  - Apply random valid reverse moves
  - Validate solvability through forward solving
- **Approach 2**: Constraint satisfaction
  - Define constraints (4 of each color, etc.)
  - Use backtracking to find valid initial states
  - Verify solvability with solver algorithm

---

## 12. Performance Considerations

- **Immutable State Updates**: Use immutable patterns for undo/redo
- **Animation Performance**: Use `transform` CSS properties for smooth 60fps
- **Memoization**: Memoize tube components to prevent unnecessary re-renders
- **Lazy Loading**: Load level configurations on demand

---

## 13. Accessibility

- **Color Blindness**: Add pattern overlays or numbers on segments
- **Touch Targets**: Minimum 44px tap targets
- **Screen Readers**: Announce game state and moves
- **High Contrast**: Support high contrast mode

---

## 14. Future Enhancements (Post-MVP)

- Hint system (show next optimal move)
- Star rating based on moves count
- Daily challenges
- Multiple themes
- Sound effects and music
- Haptic feedback
- Leaderboards
- Share achievements

---

## 15. Success Metrics

- **Functional**: All 18 requirements sections implemented correctly
- **Performance**: 60fps animations, <100ms input latency, Lighthouse score >90
- **Quality**: >80% test coverage for core logic
- **Responsiveness**: Playable on screens from 320px to 4K (mobile to desktop)
- **Browser Support**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Bundle Size**: < 500KB gzipped for initial load

---

## 16. Open Questions to Resolve

1. **Visual Style**: Realistic liquid, flat design, or stylized/gradient tubes?
2. **Progression**: Linear levels or unlock system?
3. **Persistence**: LocalStorage only or cloud sync capability?
4. **Deployment**: Which hosting platform (Vercel recommended)?
5. **Analytics**: Track user behavior and level completion rates?

---

## 17. Project Setup Commands

### Initial Setup
```bash
# Create Vite project with React + TypeScript
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install

# Install Zustand for state management
npm install zustand

# Install Framer Motion for animations
npm install framer-motion

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install testing libraries
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# Install dev tools
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
npm install -D husky lint-staged
```

### Development Commands
```bash
# Start development server
npm run dev

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

### Environment Variables (optional)
Create `.env` file:
```
VITE_APP_TITLE=Color Sorting Game
VITE_MAX_LEVELS=50
```

---

## Next Steps

1. Review and approve this implementation plan
2. Run project setup commands
3. Configure Tailwind CSS and ESLint
4. Begin Phase 1 (Core Logic implementation)

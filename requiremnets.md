- Each color appears **exactly 4 times** across all tubes.
- The initial distribution of segments is intentionally mixed.
- All levels are **guaranteed solvable**.

---

## 5. Player Interaction

### 5.1 Input Method

- The player interacts using **tap-based input**.
- A move consists of:
1. Selecting a **source tube**
2. Selecting a **destination tube**

No dragging mechanics are used.

---

## 6. Move Validation Rules

A move is considered **valid** only if **all** the following conditions are met.

---

### 6.1 Source Tube Constraints

- The source tube must contain **at least one segment**.
- Only the **topmost segment** in the source tube is eligible for movement.

---

### 6.2 Destination Tube Constraints

The destination tube must satisfy the following:

- Have **at least one empty slot** available

**Note:** Color matching is NOT required - segments can be poured onto any color. However, having all segments of the same color in a tube is still the winning condition.

---

### 6.3 Capacity Constraint

- The destination tube must have **at least one empty slot**.
- If multiple contiguous segments of the same color exist at the top of the source tube:
- All such segments attempt to transfer together
- Transfer stops if destination capacity is reached

---

## 7. Pouring Behavior

### 7.1 Batch Transfer Rule

- When a move is initiated:
- All contiguous segments of the same color at the top of the source tube are identified.
- These segments are transferred **one by one** into the destination tube.
- Transfer halts when:
- The destination tube becomes full, OR
- All eligible segments are transferred

Partial transfers are allowed **only due to capacity limits**, not player choice.

---

## 8. Move Resolution Sequence

Each valid move resolves in the following order:

1. Identify the source tube’s top color
2. Count contiguous matching segments in the source tube
3. Verify destination compatibility
4. Verify destination capacity
5. Transfer segments sequentially
6. Update tube states
7. Check level completion condition

---

## 9. Invalid Moves

A move is rejected if **any** of the following occur:

- Source tube is empty
- Destination tube is full
- Destination top color does not match source top color
- Attempting to place a segment beyond tube capacity

Invalid moves produce **no state change**.

---

## 10. Game State Properties

- The game is **fully deterministic**
- No randomness occurs after level initialization
- The same sequence of moves always results in the same outcome
- All moves are reversible via undo

---

## 11. Undo System

- The game maintains a **move history stack**
- Each undo:
- Reverts exactly one previous move
- Restores both tubes to their prior states
- Undo may be:
- Unlimited, OR
- Limited by level design (configurable)

---

## 12. Restart Behavior

- Restart resets the level to its **initial configuration**
- Restart clears:
- All moves
- Undo history

---

## 13. Deadlock Handling

- The game **does not prevent** the player from reaching unsolvable states
- No automatic deadlock detection is required
- Player recovery options:
- Undo moves
- Restart the level

---

## 14. Difficulty Scaling Rules

Difficulty increases through combinations of:

- **Increased number of colors**: Progressively adds more colors per level (2 → 12 colors)
- **Fixed tube count formula**: Always `colors + 1` tubes (exactly 1 empty working space)
- **Dynamic tube capacity**: Grows from 4 segments (easy) to 8 segments (expert)
- **Complex initial distributions**: Redistribution shuffle ensures proper mixing
- **Reduced margin for error**: Fewer empty tubes + more colors = tighter constraints

### Capacity Scaling Table

| Difficulty | Levels | Colors | Capacity | Total Tubes | Start Level |
|------------|--------|--------|----------|-------------|-------------|
| Easy | 1-3 | 4 | 5 segments | 5 tubes | 1 |
| Medium | 4-6 | 5 | 6 segments | 6 tubes | 4 |
| Medium-Hard | 7-10 | 6 | 7 segments | 7 tubes | 7 |
| Hard | 11-15 | 7 | 8 segments | 8 tubes | 11 |
| Very Hard | 16-21 | 8 | 9 segments | 9 tubes | 16 |
| Expert | 22-29 | 9 | 10 segments | 10 tubes | 22 |
| Master | 30+ | 10-11 | 11-12 segments | 11-12 tubes | 37 |

**Formula**: `tubes = colors + 1`, `capacity = colors + 1`

**Starting State**: Exactly 1 tube is empty, all other tubes are filled to capacity with randomly distributed segments.

---

## 15. Level Completion Check

A level completion check occurs:

- After every valid move
- After every undo
- After restart

Completion is achieved **only** when all tubes meet the conditions in Section 2.

---

## 16. Non-Goals (Explicitly Out of Scope)

- No time limits
- No physics simulation
- No gravity effects beyond stacking order
- No color blending or special power-ups
- No multiplayer mechanics

---

## 17. Platform Assumptions

- Designed for mobile-first interaction
- One move per user action
- Clear visual feedback after every move

---

## 18. Visual Enhancements

### Segment Appearance
- **Rounded edges**: 8px border radius (medium rounded)
- **Glossy liquid effect**: Multi-layer gradients simulating liquid shine
- **Depth effects**: Inset shadows + external drop shadows
- **Highlight spot**: Radial gradient for realistic glossiness
- **Uniform spacing**: 4px gap between all segments

### Tube Rendering
- **Dynamic heights**: Automatically adjusts to capacity (4-8 segments)
- **Glass effect**: Transparency with backdrop blur
- **Consistent layout**: Flexbox with reverse column direction
- **Visual feedback**: Selection glow, shake animations

### Animation System
- **Pour animations**: Spring physics (stiffness: 200, damping: 20)
- **Hover effects**: 220px lift with floating bob animation
- **Precise landing**: Segments land exactly on top of existing segments
- **State transitions**: React key-based remounting for clean level changes

---

## 19. Player Progression Features

### Best Score Tracking
- **Per-level tracking**: Minimum moves saved for each level
- **LocalStorage persistence**: Scores survive browser sessions
- **UI display**: Shows "Moves: X • Best: Y" in header
- **Auto-update**: Updates only when beating previous best

### Level Progression
- **Progressive difficulty**: 45+ levels with gradual complexity increase
- **Difficulty selection**: 7 tiers (Easy, Medium, Medium-Hard, Hard, Very Hard, Expert, Master)
- **Clean transitions**: Complete state reset between levels
- **Guaranteed solvability**: Redistribution shuffle algorithm ensures all levels are solvable
- **Menu navigation**: Return to difficulty selection screen anytime

---

## 20. Difficulty Selection System

### Start Screen Features
- **7 difficulty options**: Easy (🌱), Medium (🌿), Medium-Hard (🔥), Hard (⚡), Very Hard (💎), Expert (🏆), Master (👑)
- **Skip progression**: Players can start at any difficulty level
- **Clear indicators**: Each option shows colors, capacity, and starting level
- **Best score reset**: Two-click confirmation to clear all saved best scores
- **Menu button**: Return to difficulty selection from any level

### Best Score Management
- **LocalStorage persistence**: Best scores saved per level
- **Reset feature**: "Reset All Best Scores" button on start screen
- **Confirmation pattern**: Requires two clicks to prevent accidental resets
- **Auto-cancel**: Confirmation expires after 3 seconds

---

## 21. Summary

This game is a **constraint-based sorting puzzle** with:
- **Dynamic tube capacity** (5-12 segments based on difficulty)
- **Progressive challenge** (4-11 colors across 45+ levels)
- **Optimal tube count** (always colors + 1)
- **Strict move validation** with batch transfer support
- **Reversible actions** via unlimited undo
- **Glossy visual polish** with rounded segments and liquid effects
- **Player progression** with best score tracking and reset capability
- **Difficulty selection** with 7 tiers from Easy to Master
- **A single, unambiguous win condition**

Every rule in this document is deterministic, explicit, and implementation-ready.

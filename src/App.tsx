import { GameScreen } from './components/GameScreen';
import { StartScreen } from './components/StartScreen';
import { useGameStore } from './store/useGameStore';

function App() {
  const { gameStarted, startGame, resetAllBestScores } = useGameStore();

  if (gameStarted) {
    return <GameScreen />;
  }

  return (
    <StartScreen
      onSelectDifficulty={startGame}
      onResetScores={resetAllBestScores}
    />
  );
}

export default App;

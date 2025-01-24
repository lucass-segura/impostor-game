import { GameProvider } from "../context/GameContext";
import { useGame } from "../context/GameContext";
import { GameSetup } from "../components/GameSetup";
import { WordReveal } from "../components/WordReveal";

const GameContent = () => {
  const { gameState } = useGame();

  switch (gameState.phase) {
    case "setup":
      return <GameSetup />;
    case "wordReveal":
      return <WordReveal />;
    default:
      return <GameSetup />;
  }
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <GameProvider>
        <GameContent />
      </GameProvider>
    </div>
  );
};

export default Index;
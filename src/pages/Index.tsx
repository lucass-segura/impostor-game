import { GameProvider } from "../context/GameContext";
import { PeerProvider } from "../context/PeerContext";
import { useGame } from "../context/GameContext";
import { usePeer } from "../context/PeerContext";
import { GameSetup } from "../components/GameSetup";
import { WordReveal } from "../components/WordReveal";
import { MultiplayerSetup } from "../components/MultiplayerSetup";

const GameContent = () => {
  const { gameState } = useGame();
  const { hostId } = usePeer();

  if (!hostId) {
    return <MultiplayerSetup />;
  }

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
        <PeerProvider>
          <GameContent />
        </PeerProvider>
      </GameProvider>
    </div>
  );
};

export default Index;
import { GameProvider } from "../context/GameContext";
import { PeerProvider } from "../context/PeerContext";
import { useGame } from "../context/GameContext";
import { usePeer } from "../context/PeerContext";
import { GameSetup } from "../components/GameSetup";
import { WordReveal } from "../components/WordReveal";
import { MultiplayerSetup } from "../components/MultiplayerSetup";
import { VotingScreen } from "../components/VotingScreen";

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
    case "voting":
      return <VotingScreen />;
    default:
      return <GameSetup />;
  }
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-secondary to-accent text-white">
      <div className="container mx-auto px-4 py-8">
        <GameProvider>
          <PeerProvider>
            <div className="max-w-4xl mx-auto">
              <GameContent />
            </div>
          </PeerProvider>
        </GameProvider>
      </div>
    </div>
  );
};

export default Index;
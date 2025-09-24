import { GameProvider } from "../context/GameContext";
import { PeerProvider } from "../context/PeerContext";
import { useGame } from "../context/GameContext";
import { usePeer } from "../context/PeerContext";
import { GameSetup } from "../components/GameSetup";
import { GameLobby } from "../components/GameLobby";
import { WordReveal } from "../components/WordReveal";
import { MultiplayerSetup } from "../components/MultiplayerSetup";
import { VotingScreen } from "../components/VotingScreen";
import { Results } from "../components/Results";
import { GameEnd } from "../components/GameEnd";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { SoundProvider } from "@/context/SoundContext";
import SelectorLanguage from "@/components/SelectorLanguage";

const GameContent = () => {
  const { gameState } = useGame();
  const { hostId } = usePeer();

  if (!hostId) {
    return <MultiplayerSetup />;
  }

  if (gameState.phase === "setup" && gameState.currentRound === 0) {
    return <GameSetup />;
  }

  if (gameState.phase === "setup" && gameState.currentRound >= 1) {
    return <GameLobby />;
  }

  switch (gameState.phase) {
    case "wordReveal":
      return <WordReveal />;
    case "voting":
      return <VotingScreen />;
    case "results":
      return <Results />;
    case "gameEnd":
      return <GameEnd />;
    default:
      return <GameLobby />;
  }
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-secondary to-accent text-white">
      <div className="container mx-auto px-4 py-3">
      <SelectorLanguage />
        <SoundProvider>
          <GameProvider>
            <PeerProvider>
              <div className="max-w-4xl mx-auto">
                <GameContent />
              </div>
            </PeerProvider>
          </GameProvider>
        </SoundProvider>
      </div>
      <div className="hidden md:block">
        <a
          href="https://github.com/antebrl/undercover-word-game"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-4 left-4 md:bottom-8 md:left-8"
        >
        </a>
      </div>
    </div>
  );
};

export default Index;
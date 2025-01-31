import { useGame } from "../context/GameContext";
import { usePeer } from "../context/PeerContext";
import { Button } from "@/components/ui/button";
import { UserX } from "lucide-react";
import { PlayerList } from "./PlayerList";

export const GameLobby = () => {
  const { gameState, startGame } = useGame();
  const { isHost } = usePeer();

  const handleStartNextRound = () => {
    startGame();
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-8 animate-fade-in">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">Game Lobby</h1>
      
      <PlayerList 
        players={gameState.players} 
        showEliminated={true}
        lastEliminatedId={gameState.lastEliminatedId}
      />

      {isHost && (
        <Button
          onClick={handleStartNextRound}
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 text-lg font-medium transition-colors duration-200"
        >
          Start next round ({gameState.players.filter(player => !player.isEliminated).length} players)
        </Button>
      )}
    </div>
  );
};
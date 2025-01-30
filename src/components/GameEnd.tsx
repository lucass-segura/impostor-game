import { useGame } from "../context/GameContext";
import { usePeer } from "../context/PeerContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, User } from "lucide-react";

export const GameEnd = () => {
  const { gameState, resetGame } = useGame();
  const { isHost } = usePeer();
  
  const getWinnerPlayers = () => {
    return gameState.players.filter(p => p.role === gameState.winner);
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6 animate-fade-in">
      <div className="text-center space-y-4">
        <Trophy className="w-16 h-16 text-yellow-400 mx-auto" />
        <h1 className="text-4xl font-bold text-white text-center">Game Over!</h1>
      </div>

      <Card className="p-6 glass-morphism">
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">
              {gameState.winner === "civilian" && "Civilians Win!"}
              {gameState.winner === "undercover" && "Undercover Wins!"}
              {gameState.winner === "mrwhite" && "Mr. White Wins!"}
              {gameState.winner === "infiltrators" && "Infiltrators Win!"}
            </h2>
          </div>

          <div className="space-y-3">
            {getWinnerPlayers().map((player) => (
              <div 
                key={player.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
              >
                <User className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-lg text-white">{player.name}</p>
                  <p className="text-sm text-white/70">
                    {player.role}{player.word && ` - Word: ${player.word}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {isHost && (
        <Button
          onClick={resetGame}
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 text-lg font-medium transition-colors duration-200"
        >
          Start New Round
        </Button>
      )}
    </div>
  );
};
import { useState } from "react";
import { useGame } from "../context/GameContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const WordReveal = () => {
  const { gameState, setPhase } = useGame();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = (playerId: string) => {
    setSelectedPlayer(playerId);
    setIsRevealed(true);
  };

  const handleHide = () => {
    setIsRevealed(false);
    setSelectedPlayer(null);
  };

  const handleStartDiscussion = () => {
    setPhase("discussion");
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-center mb-4">Word Reveal</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {gameState.players.map((player) => (
          <Card
            key={player.id}
            className={`p-4 text-center cursor-pointer transition-transform hover:scale-105 ${
              selectedPlayer === player.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleReveal(player.id)}
          >
            <h3 className="font-bold mb-2">{player.name}</h3>
            {selectedPlayer === player.id && isRevealed && (
              <p className="text-lg font-medium text-secondary animate-fade-in">
                {player.word}
              </p>
            )}
          </Card>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        {isRevealed && (
          <Button onClick={handleHide} variant="outline">
            Hide Word
          </Button>
        )}
        <Button onClick={handleStartDiscussion} className="bg-secondary hover:bg-secondary/90">
          Start Discussion
        </Button>
      </div>
    </div>
  );
};
import { useState } from "react";
import { useGame } from "../context/GameContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const GameSetup = () => {
  const { gameState, addPlayer, removePlayer, startGame } = useGame();
  const [playerName, setPlayerName] = useState("");

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      toast.error("Please enter a player name!");
      return;
    }
    addPlayer(playerName.trim());
    setPlayerName("");
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6 animate-fade-in">
      <h1 className="text-4xl font-bold text-primary text-center mb-8">Undercover</h1>
      
      <form onSubmit={handleAddPlayer} className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter player name"
            className="flex-1"
          />
          <Button type="submit">Add</Button>
        </div>
      </form>

      <div className="space-y-2">
        {gameState.players.map((player) => (
          <div
            key={player.id}
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow"
          >
            <span>{player.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removePlayer(player.id)}
              className="text-red-500"
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      {gameState.players.length > 0 && (
        <div className="text-center">
          <Button
            onClick={startGame}
            size="lg"
            className="w-full bg-secondary hover:bg-secondary/90"
          >
            Start Game ({gameState.players.length} players)
          </Button>
        </div>
      )}
    </div>
  );
};
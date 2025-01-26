import { useGame } from "../context/GameContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePeer } from "../context/PeerContext";
import { useEffect, useState } from "react";
import { Player } from "../types/game";

export const WordReveal = () => {
  const { gameState, setPhase } = useGame();
  const { peer, isHost } = usePeer();
  const [playerOrder, setPlayerOrder] = useState<Player[]>([]);

  const currentPlayer = gameState.players.find(p => p.id === peer?.id);

  useEffect(() => {
    // Create a random order of players, ensuring Mr. White is not first
    const generatePlayerOrder = () => {
      const nonWhitePlayers = gameState.players.filter(p => p.role !== "mrwhite");
      const whitePlayers = gameState.players.filter(p => p.role === "mrwhite");
      
      // Shuffle non-white players
      const shuffledNonWhite = [...nonWhitePlayers].sort(() => Math.random() - 0.5);
      const shuffledWhite = [...whitePlayers].sort(() => Math.random() - 0.5);
      
      setPlayerOrder([...shuffledNonWhite, ...shuffledWhite]);
    };

    if (gameState.players.length > 0) {
      generatePlayerOrder();
    }
  }, [gameState.players]);

  const handleStartVoting = () => {
    setPhase("voting");
  };

  if (!peer) {
    return <div className="text-white text-center">Connecting to game network...</div>;
  }

  if (!currentPlayer) {
    return (
      <div className="text-white text-center">
        <p>Waiting for game data...</p>
        <p className="text-sm opacity-70">Your ID: {peer.id}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-center mb-4 text-white">Your Word</h2>
      
      <Card className="p-6 text-center glass-morphism">
        <div className="space-y-4">
          {currentPlayer.role === "mrwhite" ? (
            <p className="text-lg text-white">You are Mr. White!</p>
          ) : (
            <p className="text-lg text-white">
              Your word is: <span className="font-bold text-primary">{currentPlayer.word}</span>
            </p>
          )}
          <p className="text-sm text-white/70">
            {currentPlayer.role === "mrwhite" 
              ? "Try to blend in without knowing the word!"
              : "Remember this word but don't say it directly!"}
          </p>
        </div>
      </Card>

      <div className="mt-8 space-y-4">
        <h3 className="text-xl font-semibold text-white text-center">Speaking Order</h3>
        <div className="bg-black/20 rounded-lg p-4">
          {playerOrder.map((player, index) => (
            <div 
              key={player.id} 
              className={`flex items-center space-x-2 p-2 ${
                index === 0 ? 'text-primary font-bold' : 'text-white/80'
              }`}
            >
              <span className="w-6 text-center">{index + 1}.</span>
              <span>{player.name}</span>
              {player.id === peer.id && <span className="text-primary ml-2">(You)</span>}
            </div>
          ))}
        </div>
      </div>

      {isHost && (
        <Button 
          onClick={handleStartVoting} 
          className="w-full bg-secondary hover:bg-secondary/90"
        >
          Start Voting
        </Button>
      )}
    </div>
  );
};
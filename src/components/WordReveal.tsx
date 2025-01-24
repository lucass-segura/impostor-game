import { useGame } from "../context/GameContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePeer } from "../context/PeerContext";

export const WordReveal = () => {
  const { gameState, setPhase } = useGame();
  const { peer } = usePeer();

  const currentPlayer = gameState.players.find(p => p.id === peer?.id);
  console.log("Current player:", currentPlayer, "Peer ID:", peer?.id);
  console.log("All players:", gameState.players);
  console.log("Loading state - gameState:", JSON.stringify(gameState, null, 4));

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

      <Button 
        onClick={handleStartVoting} 
        className="w-full bg-secondary hover:bg-secondary/90"
      >
        Start Voting
      </Button>
    </div>
  );
};
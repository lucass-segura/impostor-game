import { useGame } from "../context/GameContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePeer } from "../context/PeerContext";
import { PlayerList } from "./PlayerList";

export const WordReveal = () => {
  const { gameState, setPhase } = useGame();
  const { peer, isHost } = usePeer();

  const currentPlayer = gameState.players.find(p => p.id === peer?.id);

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

  // Convert speaking order IDs to player objects
  const speakingOrderPlayers = gameState.speakingOrder
    ? gameState.speakingOrder
        .map(id => gameState.players.find(p => p.id === id))
        .filter((p): p is NonNullable<typeof p> => p !== undefined)
    : [];

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
        <PlayerList 
          players={speakingOrderPlayers}
          currentPlayerId={peer.id}
          speakingOrder={true}
        />
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
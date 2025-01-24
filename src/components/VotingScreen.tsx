import { useGame } from "../context/GameContext";
import { usePeer } from "../context/PeerContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PlayerList } from "./PlayerList";

export const VotingScreen = () => {
  const { gameState, submitVote } = useGame();
  const { peer, isHost, sendToHost } = usePeer();
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");

  const currentPlayer = gameState.players.find(p => p.id === peer?.id);
  const hasVoted = currentPlayer && gameState.votingResults?.[currentPlayer.id];

  const handleVote = () => {
    if (currentPlayer && selectedPlayer) {
      if (isHost) {
        submitVote(currentPlayer.id, selectedPlayer);
      } else {
        sendToHost({
          type: "SUBMIT_VOTE",
          voterId: currentPlayer.id,
          targetId: selectedPlayer
        });
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-center mb-4 text-gradient">Vote to Eliminate</h2>
      
      <PlayerList 
        players={gameState.players}
        selectedPlayer={selectedPlayer}
        onPlayerClick={!hasVoted ? setSelectedPlayer : undefined}
        votingResults={gameState.votingResults}
        currentPlayerId={peer?.id}
      />

      {!hasVoted && (
        <Button
          onClick={handleVote}
          disabled={!selectedPlayer}
          className="w-full mt-4 bg-primary hover:bg-primary/90"
        >
          Submit Vote
        </Button>
      )}
    </div>
  );
};
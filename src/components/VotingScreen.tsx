import { useGame } from "../context/GameContext";
import { usePeer } from "../context/PeerContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export const VotingScreen = () => {
  const { gameState, submitVote } = useGame();
  const { peer, connections, hostId, isHost, sendToHost } = usePeer();
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");

  const activePlayers = gameState.players.filter(p => !p.isEliminated);
  const currentPlayer = gameState.players.find(p => p.id === peer?.id);
  const hasVoted = currentPlayer && gameState.votingResults?.[currentPlayer.id];

  const handleVote = () => {
    if (currentPlayer && selectedPlayer) {
      if (isHost) {
        // If host, directly update the game state
        submitVote(currentPlayer.id, selectedPlayer);
      } else {
        // If not host, send vote to host via WebRTC
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
      <h2 className="text-2xl font-bold text-center mb-4 text-white">Vote to Eliminate</h2>
      
      <Card className="p-6 glass-morphism">
        {!hasVoted ? (
          <div className="space-y-4">
            <RadioGroup
              value={selectedPlayer}
              onValueChange={setSelectedPlayer}
              className="space-y-2"
            >
              {activePlayers
                .filter(p => p.id !== currentPlayer?.id)
                .map((player) => (
                  <div key={player.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={player.id} id={player.id} />
                    <Label htmlFor={player.id} className="text-white">
                      {player.name}
                    </Label>
                  </div>
                ))}
            </RadioGroup>
            
            <Button
              onClick={handleVote}
              disabled={!selectedPlayer}
              className="w-full mt-4 bg-primary hover:bg-primary/90"
            >
              Submit Vote
            </Button>
          </div>
        ) : (
          <div className="text-center text-white">
            <p>Vote submitted! Waiting for other players...</p>
          </div>
        )}
      </Card>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2 text-white">Votes Cast:</h3>
        <div className="space-y-2">
          {Object.entries(gameState.votingResults || {}).map(([voterId, targetId]) => {
            const voter = gameState.players.find(p => p.id === voterId);
            const target = gameState.players.find(p => p.id === targetId);
            return (
              <div key={voterId} className="text-white/80">
                {voter?.name} voted for {target?.name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
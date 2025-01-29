import { useState } from "react";
import { useGame } from "../context/GameContext";
import { usePeer } from "../context/PeerContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export const MrWhiteGuess = () => {
  const { gameState, submitMrWhiteGuess } = useGame();
  const { peer } = usePeer();
  const [guess, setGuess] = useState("");
  
  const currentPlayer = gameState.players.find(p => p.id === peer?.id);
  
  if (!currentPlayer || currentPlayer.role !== "mrwhite") {
    return <div className="text-white text-center">Waiting for Mr. White's guess...</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMrWhiteGuess(guess.trim().toLowerCase());
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-white mb-4">
        You've Been Caught!
      </h2>
      
      <Card className="p-6 glass-morphism">
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-white text-center">
            This is your chance to win! Guess the majority word:
          </p>
          
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-white/70" />
            <Input
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              className="pl-10"
              placeholder="Enter your guess..."
            />
          </div>

          <Button 
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={!guess.trim()}
          >
            Submit Guess
          </Button>
        </form>
      </Card>
    </div>
  );
};
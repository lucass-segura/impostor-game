import { useGame } from "../context/GameContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePeer } from "@/context/PeerContext";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Send, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export const Results = () => {
  const { gameState, setPhase, submitMrWhiteGuess } = useGame();
  const { peer, isHost, sendToHost } = usePeer();
  const [guess, setGuess] = useState("");
  
  const currentPlayer = gameState.players.find(p => p.id === peer?.id);
  const eliminatedPlayer = gameState.players
    .filter(p => gameState.speakingOrder.includes(p.id))
    .find(p => p.isEliminated);

  const currentPlayerGotEliminated = eliminatedPlayer?.id === currentPlayer?.id;
  const isMrWhiteGuessing = eliminatedPlayer?.role === "mrwhite" && !gameState.mrWhiteGuess;
  const canContinue = isHost && (!isMrWhiteGuessing || gameState.mrWhiteGuess);
  
  const handleGuessSubmit = () => {
    if (!guess.trim()) {
      toast.error("Please enter a guess");
      return;
    }
    
    // Send guess to host
    sendToHost({
      type: "MR_WHITE_GUESS",
      guess: guess.trim()
    });
    
    submitMrWhiteGuess(guess.trim());
  };

  const handleContinue = () => {
    setPhase("discussion");
  };

  const renderMrWhiteGuessResult = () => {
    if (!gameState.mrWhiteGuess) return null;

    const isCorrect = gameState.mrWhiteGuess.toLowerCase() === gameState.majorityWord.toLowerCase();
    return (
      <div className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
        <div className="flex items-center gap-2">
          {isCorrect ? (
            <CheckCircle className="text-green-500" />
          ) : (
            <XCircle className="text-red-500" />
          )}
          <p className="text-white">
            Mr. White guessed: <span className="font-bold">{gameState.mrWhiteGuess}</span>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-center mb-4 text-white">Results</h2>
      
      {eliminatedPlayer && (
        <Card className="p-6 text-center glass-morphism">
          <h3 className="text-xl font-bold mb-4 text-white">
            {currentPlayerGotEliminated ? "You have been eliminated" : `${eliminatedPlayer.name} was eliminated!`}
          </h3>
          <p className="text-lg mb-2 text-white">
            {currentPlayerGotEliminated ? "You" : "They"} were a{" "}
            <span className="font-bold text-primary">
              {eliminatedPlayer.role === "mrwhite" 
                ? "Mr. White" 
                : eliminatedPlayer.role}
            </span>
          </p>
          {eliminatedPlayer.role !== "mrwhite" && currentPlayer?.isEliminated && !currentPlayerGotEliminated && (
            <p className="text-white/80">
              Their word was: {eliminatedPlayer.word}
            </p>
          )}
          
          {isMrWhiteGuessing && currentPlayerGotEliminated && (
            <div className="mt-4 space-y-4">
              <p className="text-white/80">Make your final guess!</p>
              <div className="flex gap-2">
                <Input
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="Enter your guess..."
                  className="flex-1"
                />
                <Button 
                  onClick={handleGuessSubmit}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {renderMrWhiteGuessResult()}
        </Card>
      )}

      <Button
        onClick={handleContinue}
        className="w-full"
        disabled={!canContinue}
        variant={canContinue ? "default" : "secondary"}
      >
        Continue Game
      </Button>
    </div>
  );
};
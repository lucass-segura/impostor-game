import { useGame } from "../context/GameContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Results = () => {
  const { gameState, setPhase } = useGame();
  
  const eliminatedPlayer = gameState.players.find(p => p.isEliminated);
  
  const handleContinue = () => {
    setPhase("discussion");
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-center mb-4 text-white">Results</h2>
      
      {eliminatedPlayer && (
        <Card className="p-6 text-center glass-morphism">
          <h3 className="text-xl font-bold mb-4 text-white">
            {eliminatedPlayer.name} was eliminated!
          </h3>
          <p className="text-lg mb-2 text-white">
            They were a{" "}
            <span className="font-bold text-primary">
              {eliminatedPlayer.role === "mrwhite" 
                ? "Mr. White" 
                : eliminatedPlayer.role}
            </span>
          </p>
          {eliminatedPlayer.role !== "mrwhite" && (
            <p className="text-white/80">
              Their word was: {eliminatedPlayer.word}
            </p>
          )}
        </Card>
      )}

      <Button
        onClick={handleContinue}
        className="w-full bg-primary hover:bg-primary/90"
      >
        Continue Game
      </Button>
    </div>
  );
};
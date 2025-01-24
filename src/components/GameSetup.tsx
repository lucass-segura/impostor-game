import { useGame } from "../context/GameContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Copy } from "lucide-react";
import { usePeer } from "../context/PeerContext";
import { toast } from "sonner";

export const GameSetup = () => {
  const { gameState, startGame } = useGame();
  const { hostId } = usePeer();

  const handleCopyId = () => {
    if (hostId) {
      navigator.clipboard.writeText(hostId);
      toast.success("Game ID copied to clipboard!");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6 animate-fade-in">
      <h1 className="text-4xl font-bold text-gradient text-center mb-8">Game Lobby</h1>
      
      <Card className="p-4 glass-morphism">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">Game ID:</span>
          <div className="flex items-center gap-2">
            <code className="bg-secondary/30 px-3 py-1 rounded">{hostId}</code>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyId}
              className="hover:bg-secondary/20"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Players ({gameState.players.length})</span>
          </div>
          
          <div className="space-y-2">
            {gameState.players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg"
              >
                <span>{player.name}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {gameState.players.length > 0 && (
        <div className="text-center">
          <Button
            onClick={startGame}
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 transition-colors duration-200"
          >
            Start Game ({gameState.players.length} players)
          </Button>
        </div>
      )}
    </div>
  );
};
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
      <h1 className="text-4xl font-bold text-white mb-8">Game Lobby</h1>
      
      <Card className="p-4 glass-morphism">
        <div className="bg-secondary/40 p-4 rounded-lg mb-4 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-white/90 text-lg">Game ID:</span>
            <div className="flex items-center gap-2">
              <code className="bg-primary/20 px-4 py-2 rounded text-white font-mono text-lg">{hostId}</code>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyId}
                className="hover:bg-white/10"
              >
                <Copy className="h-5 w-5 text-white" />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white/90 text-lg">
            <Users className="h-5 w-5" />
            <span>Players ({gameState.players.length})</span>
          </div>
          
          <div className="space-y-2">
            {gameState.players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
              >
                <span className="text-white text-lg">{player.name}</span>
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
            className="w-full bg-primary hover:bg-primary/90 text-lg font-medium transition-colors duration-200"
          >
            Start Game ({gameState.players.length} players)
          </Button>
        </div>
      )}
    </div>
  );
};
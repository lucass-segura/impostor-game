import { useGame } from "../context/GameContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Copy, Hash } from "lucide-react";
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
    <div className="max-w-md mx-auto p-6 space-y-8 animate-fade-in">
      <h1 className="text-4xl font-bold text-white mb-8">Game Lobby</h1>
      
      <div 
        onClick={handleCopyId}
        className="glass-morphism p-6 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-2 text-white/90 text-lg mb-4">
          <Hash className="h-5 w-5" />
          <span>Game ID</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 w-full">
            <code className="bg-white/5 px-4 py-2 rounded-lg text-[#1EAEDB] font-mono text-lg w-full text-center">{hostId}</code>
            <Copy className="h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>

      <Card className="p-6 glass-morphism">
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
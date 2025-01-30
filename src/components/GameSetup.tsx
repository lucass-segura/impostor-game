import { useGame } from "../context/GameContext";
import { usePeer } from "../context/PeerContext";
import { Button } from "@/components/ui/button";
import { Link, Hash } from "lucide-react";
import { toast } from "sonner";
import { PlayerList } from "./PlayerList";

export const GameSetup = () => {
  const { gameState, startGame } = useGame();
  const { hostId, isHost } = usePeer();

  const handleCopyLink = () => {
    if (hostId) {
      const gameLink = `${window.location.origin}${import.meta.env.BASE_URL}?gameId=${hostId}`;
      navigator.clipboard.writeText(gameLink);
      toast.success("Game link copied to clipboard!");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-8 animate-fade-in">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">Game Setup</h1>
      
      <div 
        onClick={handleCopyLink}
        className="glass-morphism p-6 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-2 text-white/90 text-lg mb-4">
          <Hash className="h-5 w-5" />
          <span>Game Link</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 w-full">
            <code className="bg-white/5 px-4 py-2 rounded-lg text-[#1EAEDB] font-mono text-lg w-full text-center">{hostId}</code>
            <Link className="h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>

      <PlayerList players={gameState.players} />

      {isHost && gameState.players.length > 0 && (
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
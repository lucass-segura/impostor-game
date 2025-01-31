import { useGame } from "../context/GameContext";
import { usePeer } from "../context/PeerContext";
import { Button } from "@/components/ui/button";
import { Link, Hash, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { PlayerList } from "./PlayerList";
import { Card } from "@/components/ui/card";

export const GameSetup = () => {
  const { gameState, startGame, updateRoleDistribution } = useGame();
  const { hostId, isHost } = usePeer();

  const handleCopyLink = () => {
    if (hostId) {
      const gameLink = `${window.location.origin}${import.meta.env.BASE_URL}?gameId=${hostId}`;
      navigator.clipboard.writeText(gameLink);
      toast.success("Game link copied to clipboard!");
    }
  };

  const handleDistributionChange = (field: 'undercovers' | 'mrWhites', change: number) => {
    const playerCount = gameState.players.length;
    const currentDist = gameState.roleDistribution;
    
    let newUndercovers = field === 'undercovers' ? Math.max(0, currentDist.undercovers + change) : currentDist.undercovers;
    let newMrWhites = field === 'mrWhites' ? Math.max(0, currentDist.mrWhites + change) : currentDist.mrWhites;
    
    // Validate the distribution
    const totalSpecialRoles = newUndercovers + newMrWhites;
    if (totalSpecialRoles >= playerCount) {
      toast.error("Too many special roles for the current player count!");
      return;
    }

    updateRoleDistribution({
      civilians: playerCount - newUndercovers - newMrWhites,
      undercovers: newUndercovers,
      mrWhites: newMrWhites,
    });
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
        <div className="space-y-6">
          <Card className="p-4 bg-white/5">
            <h3 className="text-lg font-semibold text-white mb-4">Role Distribution</h3>
            <div className="space-y-4">
              <div className="text-center text-white/70">
                Civilians: {gameState.roleDistribution.civilians}
              </div>
              <div className="flex items-center justify-between gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDistributionChange('undercovers', -1)}
                  className="bg-white/10 hover:bg-white/20"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex-1 text-center text-white">
                  {gameState.roleDistribution.undercovers} undercovers
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDistributionChange('undercovers', 1)}
                  className="bg-white/10 hover:bg-white/20"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDistributionChange('mrWhites', -1)}
                  className="bg-white/10 hover:bg-white/20"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex-1 text-center text-white">
                  {gameState.roleDistribution.mrWhites} mr whites
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDistributionChange('mrWhites', 1)}
                  className="bg-white/10 hover:bg-white/20"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

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
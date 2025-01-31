import { useGame } from "../context/GameContext";
import { usePeer } from "../context/PeerContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserX } from "lucide-react";
import { PlayerList } from "./PlayerList";
import { calculateDefaultDistribution } from "../config/roleDistribution";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const GameLobby = () => {
  const { gameState, startGame, updateRoleDistribution } = useGame();
  const { isHost } = usePeer();

  const handleStartNextRound = () => {
    startGame();
  };

  const handleDistributionChange = (field: 'undercovers' | 'mrWhites', value: string) => {
    const numValue = parseInt(value) || 0;
    const playerCount = gameState.players.length;
    const currentDist = gameState.roleDistribution;
    
    let newUndercovers = field === 'undercovers' ? numValue : currentDist.undercovers;
    let newMrWhites = field === 'mrWhites' ? numValue : currentDist.mrWhites;
    
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
      <h1 className="text-4xl font-bold text-white mb-8 text-center">Game Lobby</h1>
      
      <PlayerList 
        players={gameState.players} 
        showEliminated={true}
        lastEliminatedId={gameState.lastEliminatedId}
      />

      {isHost && (
        <div className="space-y-6">
          <Card className="p-4 bg-white/5">
            <h3 className="text-lg font-semibold text-white mb-4">Role Distribution</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="undercovers" className="text-white">Undercovers</Label>
                <Input
                  id="undercovers"
                  type="number"
                  min="0"
                  max={Math.max(0, gameState.players.length - 1)}
                  value={gameState.roleDistribution.undercovers}
                  onChange={(e) => handleDistributionChange('undercovers', e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mrwhites" className="text-white">Mr. Whites</Label>
                <Input
                  id="mrwhites"
                  type="number"
                  min="0"
                  max={Math.max(0, gameState.players.length - 1)}
                  value={gameState.roleDistribution.mrWhites}
                  onChange={(e) => handleDistributionChange('mrWhites', e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>
            <p className="mt-4 text-white/70 text-sm">
              Civilians: {gameState.roleDistribution.civilians}
            </p>
          </Card>

          <Button
            onClick={handleStartNextRound}
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-lg font-medium transition-colors duration-200"
          >
            Start next round ({gameState.players.length} players)
          </Button>
        </div>
      )}
    </div>
  );
};
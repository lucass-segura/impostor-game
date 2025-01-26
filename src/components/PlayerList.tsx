import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Player } from "../types/game";

interface PlayerListProps {
  players: Player[];
  selectedPlayer?: string;
  onPlayerClick?: (playerId: string) => void;
  votingResults?: Record<string, string>;
  currentPlayerId?: string;
}

export const PlayerList = ({ 
  players, 
  selectedPlayer, 
  onPlayerClick,
  votingResults,
  currentPlayerId
}: PlayerListProps) => {
  // Get all votes for a specific player
  const getVotesForPlayer = (playerId: string) => {
    if (!votingResults) return [];
    return Object.entries(votingResults)
      .filter(([_, targetId]) => targetId === playerId)
      .map(([voterId]) => players.find(p => p.id === voterId)?.name || '');
  };

  const hasCurrentPlayerVoted = currentPlayerId && votingResults?.[currentPlayerId];

  return (
    <Card className="p-6 glass-morphism">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white/90 text-lg">
          <Users className="h-5 w-5" />
          <span>Players ({players.length})</span>
        </div>
        
        <div className="space-y-2">
          {players.map((player) => {
            // Skip eliminated players
            if (player.isEliminated) return null;
            // Skip current player if they haven't voted yet
            if (player.id === currentPlayerId && !hasCurrentPlayerVoted) return null;
            
            const votes = getVotesForPlayer(player.id);
            
            return (
              <div
                key={player.id}
                className={`
                  flex flex-col gap-2 p-3 rounded-lg transition-all duration-200
                  ${onPlayerClick ? 'cursor-pointer' : ''}
                  ${selectedPlayer === player.id 
                    ? 'bg-primary/20 border border-primary/30' 
                    : 'bg-white/5 hover:bg-white/10'
                  }
                `}
                onClick={() => onPlayerClick?.(player.id)}
              >
                <span className="text-white text-lg">{player.name}</span>
                {hasCurrentPlayerVoted && votes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {votes.map((voterName, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-sm rounded-full bg-primary/20 text-white/90"
                      >
                        {voterName}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
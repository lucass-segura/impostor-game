import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Player } from "../types/game";

interface PlayerListProps {
  players: Player[];
  selectedPlayer?: string;
  onPlayerClick?: (playerId: string) => void;
  votingResults?: Record<string, string>;
  currentPlayerId?: string;
  speakingOrder?: boolean;
}

export const PlayerList = ({ 
  players, 
  selectedPlayer, 
  onPlayerClick,
  votingResults,
  currentPlayerId,
  speakingOrder
}: PlayerListProps) => {
  // Get all votes for a specific player
  const getVotesForPlayer = (playerId: string) => {
    if (!votingResults) return [];
    return Object.entries(votingResults)
      .filter(([_, targetId]) => targetId === playerId)
      .map(([voterId]) => players.find(p => p.id === voterId)?.name || '');
  };

  const hasCurrentPlayerVoted = currentPlayerId && votingResults?.[currentPlayerId];
  const displayPlayers = speakingOrder ? players : players.filter(p => !p.isEliminated);

  return (
    <Card className="p-6 glass-morphism">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white/90 text-lg">
          <Users className="h-5 w-5" />
          <span>Players ({displayPlayers.length})</span>
        </div>
        
        <div className="space-y-2">
          {displayPlayers.map((player, index) => {
            // Skip current player if they haven't voted yet (only in voting phase)
            if (!speakingOrder && currentPlayerId && !hasCurrentPlayerVoted && player.id === currentPlayerId) return null;
            
            const votes = getVotesForPlayer(player.id);
            const showVotes = hasCurrentPlayerVoted && votes.length > 0;
            
            return (
              <div
                key={player.id}
                className={`
                  flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                  ${onPlayerClick ? 'cursor-pointer' : ''}
                  ${selectedPlayer === player.id 
                    ? 'bg-primary/20 border border-primary/30' 
                    : 'bg-white/5 hover:bg-white/10'
                  }
                `}
                onClick={() => onPlayerClick?.(player.id)}
              >
                {speakingOrder && (
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${index === 0 ? 'bg-primary' : 'bg-white/10'}
                    ${index === 0 ? 'text-white' : 'text-white/80'}
                  `}>
                    {index + 1}
                  </div>
                )}
                <div className="flex-1">
                  <span className={`text-lg ${index === 0 && speakingOrder ? 'text-primary font-bold' : 'text-white'}`}>
                    {player.name}
                    {player.id === currentPlayerId && (
                      <span className="text-primary ml-2">(You)</span>
                    )}
                  </span>
                  {showVotes && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {votes.map((voterName, vIndex) => (
                        <span 
                          key={vIndex}
                          className="px-2 py-1 text-sm rounded-full bg-primary/20 text-white/90"
                        >
                          {voterName}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
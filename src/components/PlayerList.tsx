
import { Card } from "@/components/ui/card";
import { Users, UserX } from "lucide-react";
import { Player } from "../types/game";
import { RoleIcon } from "./RoleIcon";

interface PlayerListProps {
  players: Player[];
  selectedPlayer?: string;
  onPlayerClick?: (playerId: string) => void;
  votingResults?: Record<string, string>;
  currentPlayerId?: string;
  speakingOrder?: boolean;
  showEliminated?: boolean;
  lastEliminatedId?: string;
  showScores?: boolean;
}

export const PlayerList = ({ 
  players, 
  selectedPlayer, 
  onPlayerClick,
  votingResults,
  currentPlayerId,
  speakingOrder,
  showEliminated,
  lastEliminatedId,
  showScores
}: PlayerListProps) => {
  const getVotesForPlayer = (playerId: string) => {
    if (!votingResults) return [];
    return Object.entries(votingResults)
      .filter(([_, targetId]) => targetId === playerId)
      .map(([voterId]) => players.find(p => p.id === voterId)?.name || '');
  };

  const hasCurrentPlayerVoted = currentPlayerId && votingResults?.[currentPlayerId];
  const displayPlayers = speakingOrder ? players : (!showEliminated ? players.filter(p => !p.isEliminated) : players);

  return (
    <Card className="p-6 glass-morphism">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white/90 text-lg">
          <Users className="h-5 w-5" />
          <span>Players ({displayPlayers.length})</span>
        </div>
        
        <div className="space-y-2">
          {displayPlayers.map((player, index) => {
            const votes = getVotesForPlayer(player.id);
            const showVotes = (hasCurrentPlayerVoted || player.isEliminated) && votes.length > 0;
            const isLastEliminated = player.id === lastEliminatedId;
            
            if (!speakingOrder && currentPlayerId && !hasCurrentPlayerVoted && player.id === currentPlayerId) return null;

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
                  ${isLastEliminated ? 'border-2 border-blue-500' : ''}
                  ${player.isEliminated ? 'opacity-50' : ''}
                `}
                onClick={() => onPlayerClick?.(player.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-lg ${index === 0 && speakingOrder ? 'text-primary font-bold' : 'text-white'}`}>
                        {player.name}
                        {player.id === currentPlayerId && (
                          <span className="text-primary ml-2">(You)</span>
                        )}
                      </span>
                      {showScores && player.score !== undefined && player.score > 0 && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-white/70">Score: {player.score}</span>
                          {player.lastScore && (
                            <span className="text-sm text-green-400">+{player.lastScore}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {player.isEliminated && player.role && player.role !== "spectator" && <RoleIcon role={player.role} />}
                      {player.isEliminated && <UserX className="h-5 w-5 text-red-500" />}
                    </div>
                  </div>
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

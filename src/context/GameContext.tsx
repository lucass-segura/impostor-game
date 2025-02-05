import React, { createContext, useContext, useState } from "react";
import { GameState, Player, GamePhase, PlayerRole, RoleDistribution } from "../types/game";
import { toast } from "sonner";
import { calculateDefaultDistribution } from "../config/roleDistribution";
import { useTranslation } from "react-i18next";

interface GameContextType {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  addPlayer: (name: string, id: string) => void;
  removePlayer: (id: string) => void;
  startGame: () => void;
  setPhase: (phase: GamePhase) => void;
  submitVote: (voterId: string, targetId: string) => void;
  submitMrWhiteGuess: (guess: string) => void;
  resetGame: () => void;
  updateRoleDistribution: (distribution: RoleDistribution) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();  

  const [gameState, setGameState] = useState<GameState>({
    players: [],
    phase: "setup",
    currentRound: 0,
    majorityWord: "",
    undercoverWord: "",
    mrWhiteGuess: undefined,
    roleDistribution: calculateDefaultDistribution(4),
  });

  const addPlayer = (name: string, id: string) => {
    if (gameState.players.length >= 10) {
      toast.error("Maximum 10 players allowed!");
      return;
    }
    setGameState((prev) => {
      let role = undefined;
      let isEliminated = undefined;
      if(prev.phase !== "setup") {
        role = "spectator";
        isEliminated = true;
      }

      const newPlayers = [...prev.players, { id, name, role, isEliminated}];
      return {
        ...prev,
        players: newPlayers,
        roleDistribution: calculateDefaultDistribution(newPlayers.length),
      };
    });
  };

  const removePlayer = (id: string) => {
    setGameState((prev) => {
      const player = prev.players.find(p => p.id === id);
      if (!player) return prev;

      const newPlayers = prev.players.filter(p => p.id !== id);
      const newSpeakingOrder = prev.speakingOrder?.filter(s => s !== id);

      const gameEnd = checkGameEnd(newPlayers);
      if(gameEnd) {
        return {
          ...prev,
          phase: "gameEnd",
          winner: gameEnd,
          players: newPlayers,
          speakingOrder: newSpeakingOrder,
        };
      }
  
      return {
        ...prev,
        players: newPlayers,
        speakingOrder: newSpeakingOrder,
      };
    });
  };

  const generateSpeakingOrder = (players: Player[]) => {
    const activePlayers = players.filter(p => !p.isEliminated);
    const nonWhitePlayers = activePlayers.filter(p => p.role !== "mrwhite");
    const whitePlayers = activePlayers.filter(p => p.role === "mrwhite");
    const shuffledNonWhite = [...nonWhitePlayers].sort(() => Math.random() - 0.5);
    const shuffledWhite = [...whitePlayers].sort(() => Math.random() - 0.5);
    return [...shuffledNonWhite, ...shuffledWhite].map(player => player.id);
  };

  const checkGameEnd = (players: Player[]) => {
    const alivePlayers = players.filter(p => !p.isEliminated);
    const aliveCivilians = alivePlayers.filter(p => p.role === "civilian");
    const aliveUndercovers = alivePlayers.filter(p => p.role === "undercover");
    const aliveMrWhites = alivePlayers.filter(p => p.role === "mrwhite");

    if (aliveUndercovers.length === 0 && aliveMrWhites.length === 0) {
      if(aliveCivilians.length === 0) return null;
      return "civilian";
    }

    if (aliveCivilians.length <= 1) {
      if(aliveUndercovers.length > 0) {
        if(aliveMrWhites.length > 0) {
          return "infiltrators";
        }
        return "undercover";
      }
      return "mrwhite";
    }

    return null;
  };

  const startGame = () => {
    if (gameState.currentRound === 0) {
      if (gameState.players.length < 4) {
        toast.error("Minimum 4 players required!");
        return;
      }   
      
      const wordPairs = t("wordPairs", { returnObjects: true }) as [string, string][];
      const randomPair = wordPairs[Math.floor(Math.random() * wordPairs.length)];
      const [majorityWord, undercoverWord] = randomPair;

      const shuffledPlayers = [...gameState.players].sort(() => Math.random() - 0.5);
      const { undercovers, mrWhites } = gameState.roleDistribution;

      const updatedPlayers = shuffledPlayers.map((player, index) => {
        let role: PlayerRole = "civilian";
        let word = majorityWord;

        if (index < mrWhites) {
          role = "mrwhite";
          word = "";
        } else if (index < mrWhites + undercovers) {
          role = "undercover";
          word = undercoverWord;
        }

        return {
          ...player,
          word,
          role,
          isEliminated: false,
        };
      });

      const speakingOrder = generateSpeakingOrder(updatedPlayers);

      setGameState((prev) => ({
        ...prev,
        players: updatedPlayers,
        speakingOrder,
        phase: "wordReveal",
        majorityWord,
        undercoverWord,
        currentRound: 1,
        mrWhiteGuess: undefined,
      }));
    } else {
      setGameState((prev) => ({
        ...prev,
        speakingOrder: generateSpeakingOrder(prev.players),
        phase: "wordReveal",
        votingResults: {},
        currentRound: prev.currentRound + 1,
        mrWhiteGuess: undefined,
      }));
    }
  };

  const setPhase = (phase: GamePhase) => {
    setGameState((prev) => ({ ...prev, phase }));
  };

  const submitVote = (voterId: string, targetId: string) => {
    setGameState((prev) => {
      const newVotingResults = { ...(prev.votingResults || {}), [voterId]: targetId };
      const activePlayers = prev.players.filter(p => !p.isEliminated);
      const allVoted = activePlayers.every(p => p.id in newVotingResults);

      if (allVoted) {
        const voteCount: Record<string, number> = {};
        Object.values(newVotingResults).forEach(id => {
          voteCount[id] = (voteCount[id] || 0) + 1;
        });

        const eliminatedId = Object.entries(voteCount).reduce((a, b) => 
          (voteCount[a[0]] > voteCount[b[0]] ? a : b)
        )[0];

        const updatedPlayers = prev.players.map(p => 
          p.id === eliminatedId ? { ...p, isEliminated: true } : p
        );

        const eliminatedPlayer = updatedPlayers.find(p => p.id === eliminatedId);
        
        if (eliminatedPlayer?.role === "mrwhite") {
          return {
            ...prev,
            players: updatedPlayers,
            votingResults: {},
            phase: "results",
            lastEliminatedId: eliminatedId,
          };
        }

        const gameWinner = checkGameEnd(updatedPlayers);
        return {
          ...prev,
          players: updatedPlayers,
          votingResults: {},
          phase: gameWinner ? "gameEnd" : "results",
          winner: gameWinner || undefined,
          lastEliminatedId: eliminatedId
        };
      }

      return {
        ...prev,
        votingResults: newVotingResults
      };
    });
  };

  const submitMrWhiteGuess = (guess: string) => {
    setGameState((prev) => {
      if (guess.toLowerCase() === prev.majorityWord.toLowerCase()) {
        return {
          ...prev,
          phase: "gameEnd",
          winner: "mrwhite",
          mrWhiteGuess: guess
        };
      } else {
        const gameWinner = checkGameEnd(prev.players);
        return {
          ...prev,
          phase: gameWinner ? "gameEnd" : "results",
          winner: gameWinner || undefined,
          mrWhiteGuess: guess
        };
      }
    });
  };

  const resetGame = () => {
    setGameState((prev) => {
      const players = prev.players.map(p => ({ ...p, isEliminated: false }));
      return {
        players: players,
        phase: "setup",
        currentRound: 0,
        majorityWord: "",
        undercoverWord: "",
        mrWhiteGuess: undefined,
        roleDistribution: prev.roleDistribution,
      };
    });
  };

  const updateRoleDistribution = (distribution: RoleDistribution) => {
    setGameState(prev => ({
      ...prev,
      roleDistribution: distribution
    }));
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameState,
        addPlayer,
        removePlayer,
        startGame,
        setPhase,
        submitVote,
        submitMrWhiteGuess,
        resetGame,
        updateRoleDistribution,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

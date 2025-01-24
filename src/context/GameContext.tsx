import React, { createContext, useContext, useState } from "react";
import { GameState, Player, GamePhase, PlayerRole } from "../types/game";
import { toast } from "sonner";

interface GameContextType {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  startGame: () => void;
  setPhase: (phase: GamePhase) => void;
  submitVote: (voterId: string, targetId: string) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    phase: "setup",
    currentRound: 1,
    majorityWord: "",
    undercoverWord: "",
  });

  const addPlayer = (name: string) => {
    if (gameState.players.length >= 10) {
      toast.error("Maximum 10 players allowed!");
      return;
    }
    setGameState((prev) => ({
      ...prev,
      players: [...prev.players, { id: crypto.randomUUID(), name }],
    }));
  };

  const removePlayer = (id: string) => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.filter((p) => p.id !== id),
    }));
  };

  const startGame = () => {
    if (gameState.players.length < 4) {
      toast.error("Minimum 4 players required!");
      return;
    }

    const wordPairs = [
      ["Dog", "Cat"],
      ["Pizza", "Burger"],
      ["Beach", "Mountain"],
      ["Coffee", "Tea"],
      ["Car", "Bus"],
      ["Sun", "Moon"],
    ];
    const randomPair = wordPairs[Math.floor(Math.random() * wordPairs.length)];
    const [majorityWord, undercoverWord] = randomPair;

    const shuffledPlayers = [...gameState.players].sort(() => Math.random() - 0.5);
    const numUndercover = Math.floor(gameState.players.length / 4);
    const hasMrWhite = gameState.players.length >= 5;

    const updatedPlayers = shuffledPlayers.map((player, index) => {
      let role: PlayerRole = "civilian";
      let word = majorityWord;

      if (hasMrWhite && index === 0) {
        role = "mrwhite";
        word = undefined;
      } else if (index < numUndercover + (hasMrWhite ? 1 : 0)) {
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

    setGameState((prev) => ({
      ...prev,
      players: updatedPlayers,
      phase: "wordReveal",
      majorityWord,
      undercoverWord,
    }));
  };

  const setPhase = (phase: GamePhase) => {
    setGameState((prev) => ({ ...prev, phase }));
  };

  const submitVote = (voterId: string, targetId: string) => {
    setGameState((prev) => {
      const newVotingResults = { ...(prev.votingResults || {}), [voterId]: targetId };
      
      // Check if everyone has voted
      const activePlayers = prev.players.filter(p => !p.isEliminated);
      const allVoted = activePlayers.every(p => p.id in newVotingResults);
      
      if (allVoted) {
        // Count votes
        const voteCount: Record<string, number> = {};
        Object.values(newVotingResults).forEach(id => {
          voteCount[id] = (voteCount[id] || 0) + 1;
        });
        
        // Find player with most votes
        const eliminatedId = Object.entries(voteCount).reduce((a, b) => 
          (voteCount[a[0]] > voteCount[b[0]] ? a : b)
        )[0];
        
        // Update eliminated player
        const updatedPlayers = prev.players.map(p => 
          p.id === eliminatedId ? { ...p, isEliminated: true } : p
        );
        
        return {
          ...prev,
          players: updatedPlayers,
          votingResults: {},
          phase: "results"
        };
      }
      
      return {
        ...prev,
        votingResults: newVotingResults
      };
    });
  };

  const resetGame = () => {
    setGameState({
      players: [],
      phase: "setup",
      currentRound: 1,
      majorityWord: "",
      undercoverWord: "",
    });
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
        resetGame,
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
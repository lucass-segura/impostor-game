import React, { createContext, useContext, useState } from "react";
import { GameState, Player, GamePhase, PlayerRole } from "../types/game";
import { toast } from "sonner";

interface GameContextType {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  addPlayer: (name: string, id: string) => void;
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
    currentRound: 0,
    majorityWord: "",
    undercoverWord: "",
  });

  const addPlayer = (name: string, id: string) => {
    if (gameState.players.length >= 10) {
      toast.error("Maximum 10 players allowed!");
      return;
    }
    setGameState((prev) => ({
      ...prev,
      players: [...prev.players, { id, name }],
    }));
  };

  const removePlayer = (id: string) => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.filter((p) => p.id !== id),
    }));
  };

  const generateSpeakingOrder = (players: Player[]) => {
    // Only include non-eliminated players in speaking order
    const activePlayers = players.filter(p => !p.isEliminated);
    
    // Filter out eliminated players and Mr. White players
    const nonWhitePlayers = activePlayers.filter(p => p.role !== "mrwhite");
    const whitePlayers = activePlayers.filter(p => p.role === "mrwhite");
    
    // Shuffle non-white players
    const shuffledNonWhite = [...nonWhitePlayers].sort(() => Math.random() - 0.5);
    const shuffledWhite = [...whitePlayers].sort(() => Math.random() - 0.5);
    
    // Return only the IDs in the speaking order
    return [...shuffledNonWhite, ...shuffledWhite].map(player => player.id);
  };

  const startGame = () => {
    
    if (gameState.currentRound === 0) {
      // First round - assign roles and words
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
          word = "";  // Mr. White gets no word
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

      const speakingOrder = generateSpeakingOrder(updatedPlayers);

      setGameState((prev) => ({
        ...prev,
        players: updatedPlayers,
        speakingOrder,
        phase: "wordReveal",
        majorityWord,
        undercoverWord,
        currentRound: 1,
      }));
    } else {
      // Subsequent rounds - just update speaking order, phase, and increment round
      setGameState((prev) => ({
        ...prev,
        speakingOrder: generateSpeakingOrder(prev.players),
        phase: "wordReveal",
        votingResults: {},
        currentRound: prev.currentRound + 1,
      }));
    }
  };

  const setPhase = (phase: GamePhase) => {
    setGameState((prev) => ({ ...prev, phase }));
  };

  const submitVote = (voterId: string, targetId: string) => {
    console.log(`Vote submitted: ${voterId} voted for ${targetId}`);
    setGameState((prev) => {
      // Create new voting results object with the new vote
      const newVotingResults = { 
        ...(prev.votingResults || {}), 
        [voterId]: targetId 
      };
      
      // Get active (non-eliminated) players
      const activePlayers = prev.players.filter(p => !p.isEliminated);
      
      // Check if all active players have voted
      const allVoted = activePlayers.every(p => p.id in newVotingResults);
      
      console.log("Current votes:", newVotingResults);
      console.log("All players voted:", allVoted);
      
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
        
        // Update eliminated status
        const updatedPlayers = prev.players.map(p => 
          p.id === eliminatedId ? { ...p, isEliminated: true } : p
        );
        
        const eliminatedPlayer = updatedPlayers.find(p => p.id === eliminatedId);
        if (eliminatedPlayer) {
          toast.info(`${eliminatedPlayer.name} has been eliminated!`);
        }
        
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
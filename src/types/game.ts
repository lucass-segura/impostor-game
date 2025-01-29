export type PlayerRole = "civilian" | "undercover" | "mrwhite";

export type Player = {
  id: string;
  name: string;
  word?: string;
  role?: PlayerRole;
  isEliminated?: boolean;
};

export type GamePhase = "setup" | "wordReveal" | "discussion" | "voting" | "results" | "mrwhiteGuess" | "gameEnd";

export type GameState = {
  players: Player[];
  phase: GamePhase;
  currentRound: number;
  majorityWord: string;
  undercoverWord: string;
  votingResults?: Record<string, string>;
  speakingOrder?: string[];
  lastEliminatedId?: string;
  winner?: PlayerRole;
  mrWhiteGuess?: string;  // Added this property
};
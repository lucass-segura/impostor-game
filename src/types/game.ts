export type PlayerRole = "civilian" | "undercover" | "mrwhite";

export type Player = {
  id: string;
  name: string;
  word?: string;
  role?: PlayerRole;
  isEliminated?: boolean;
};

export type GamePhase = "setup" | "wordReveal" | "discussion" | "voting" | "results";

export type GameState = {
  players: Player[];
  phase: GamePhase;
  currentRound: number;
  majorityWord: string;
  undercoverWord: string;
  votingResults?: Record<string, string>;
  speakingOrder?: Player[];  // Added this property
};
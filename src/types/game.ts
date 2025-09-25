export type PlayerRole = "civilian" | "undercover" | "mrwhite" | "spectator";

export type RoleDistribution = {
  undercovers: number;
  mrWhites: number;
};

export type Player = {
  id: string;
  name: string;
  word?: string;
  role?: PlayerRole;
  isEliminated?: boolean;
  score?: number;
  submittedDescription?: string;
};

export type GamePhase = "setup" | "wordReveal" | "discussion" | "voting" | "results" | "gameEnd";

export type GameState = {
  players: Player[];
  phase: GamePhase;
  currentRound: number;
  majorityWord: string;
  undercoverWord: string;
  votingResults?: Record<string, string>;
  speakingOrder?: string[];
  lastEliminatedId?: string;
  winner?: string;
  mrWhiteGuess?: string;
  roleDistribution: RoleDistribution;
  selectedCollection: string;
};
export type Player = {
  id: string;
  name: string;
  word?: string;
  isUndercover?: boolean;
  isEliminated?: boolean;
};

export type GamePhase = "setup" | "wordReveal" | "discussion" | "voting" | "results";

export type GameState = {
  players: Player[];
  phase: GamePhase;
  currentRound: number;
  majorityWord: string;
  undercoverWord: string;
  timer?: number;
  votingResults?: Record<string, string>;
};
export type RoleDistribution = {
  civilians: number;
  undercovers: number;
  mrWhites: number;
};

export const DEFAULT_DISTRIBUTIONS: Record<number, RoleDistribution> = {
  4: { civilians: 3, undercovers: 1, mrWhites: 0 },
  5: { civilians: 3, undercovers: 1, mrWhites: 1 },
  6: { civilians: 4, undercovers: 1, mrWhites: 1 },
  7: { civilians: 4, undercovers: 2, mrWhites: 1 },
  8: { civilians: 5, undercovers: 2, mrWhites: 1 },
  9: { civilians: 6, undercovers: 2, mrWhites: 1 },
  10: { civilians: 6, undercovers: 3, mrWhites: 1 },
};

export const calculateDefaultDistribution = (playerCount: number): RoleDistribution => {
  return DEFAULT_DISTRIBUTIONS[playerCount] || DEFAULT_DISTRIBUTIONS[4];
};
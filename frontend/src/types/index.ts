export type EventType = "MS" | "WS" | "MD" | "WD" | "XD";

export type MatchStatus =
  | "live"
  | "finished"
  | "upcoming";

export type TournamentStatus =
  | "ongoing"
  | "past";

export interface Player {
  name: string;
  country: string;
  seed?: number;
}

export interface Match {
  event: EventType;
  round: string;
  court?: string;
  time?: string;
  status: MatchStatus;
  serving?: number;
  players: [Player, Player];
  sets: number[][];
}

export interface Tournament {
  id: string;
  name: string;
  tier: string;
  location: string;
  venue: string;
  dates: string;
  code: string;
  accent: string;
  status: TournamentStatus;
  round: string;
  matches: Match[];
}

export interface RankingStatsSingles {
  age: number;
  height: string;
  plays: string;
  high: number;
  titles: number;
  winRate: number;
  form: ("W" | "L")[];
}

export interface RankingStatsDoubles {
  since: number;
  high: number;
  titles: number;
  winRate: number;
  form: ("W" | "L")[];
}

export interface RankingEntry {
  rank: number;
  prev: number;
  name: string;
  country: string;
  points: number;
  played: number;
  stats:
    | RankingStatsSingles
    | RankingStatsDoubles;
}

export type RankingsMap = Record<
  EventType,
  RankingEntry[]
>;
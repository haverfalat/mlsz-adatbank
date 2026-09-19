import { Scored, TeamRef } from './common.js';

export type MatchDayStatus = 'finalized' | 'partial' | 'open';

export type StatusFilter = 'all' | 'finished' | 'live' | 'upcoming';

export interface MatchDayFilter {
  date?: string;
  status?: StatusFilter;
  federation?: number;
}

export interface MatchDayMatch {
  matchId?: number;
  home: TeamRef;
  away: TeamRef;
  kickoff?: Date;
  round?: number;
  status: MatchDayStatus;
  score?: Scored;
  href?: string;
}

export interface MatchDayGroup {
  federation: number;
  organizer: string;
  league: string;
  matches: MatchDayMatch[];
}

export interface MatchDay {
  groups: MatchDayGroup[];
}
import { Scored, TeamRef } from './common.js';

export type FormResult = 'W' | 'D' | 'L';

export interface FormChip {
  result: FormResult;
  matchId?: number;
  description?: string;
}

export interface NextOpponent {
  date?: Date;
  venue?: string;
  home?: string;
  away?: string;
  matchId?: number;
}

export interface StandingRow {
  position: number;
  team: TeamRef;
  logo?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  opposition?: string;
  comment?: string;
  nextOpponent?: NextOpponent;
  form: FormChip[];
}

export type Standings = StandingRow[];

export interface MatchScore {
  full: Scored;
  half?: Scored;
}
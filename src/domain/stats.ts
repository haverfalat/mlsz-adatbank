import { PlayerRef, TeamRef } from './common.js';

export interface ScorerRow {
  rank: number;
  player: PlayerRef;
  photo?: string;
  goals: number;
  club: TeamRef;
}

export interface CardRow {
  rank: number;
  player: PlayerRef;
  photo?: string;
  yellow: number;
  red: number;
  club: TeamRef;
}
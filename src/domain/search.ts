import { LeagueContext, PlayerRef, TeamRef } from './common.js';

export interface SearchPlayer {
  player: PlayerRef;
  birthDate?: Date;
  club?: string;
}

export interface SearchClub {
  club: TeamRef;
  league: string;
  context?: LeagueContext;
}

export interface SearchResults {
  query: string;
  players: SearchPlayer[];
  teams: SearchClub[];
}
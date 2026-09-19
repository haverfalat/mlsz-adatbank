import { PlayerRef, TeamRef } from './common.js';

export interface PlayerSeasonStat {
  appearances: number;
  starts: number;
  subs: number;
  bench: number;
  goals: number;
  ownGoals: number;
  yellows: number;
  reds: number;
}

export interface PlayerSeasonTotals extends PlayerSeasonStat {
  season: string;
  club: string;
}

export interface PlayerCompetitionStat extends PlayerSeasonStat {
  competition: string;
  position?: string;
  teamId?: number;
  leagueId?: number;
}

export interface PlayerSeasonBlock {
  season: string;
  club: string;
  totals: PlayerSeasonTotals;
  competitions: PlayerCompetitionStat[];
}

export interface PlayerTransfer {
  from?: string;
  to?: string;
  start?: Date;
  end?: Date;
  type?: string;
}

export interface PlayerTeammate {
  player: PlayerRef;
  age?: number;
}

export interface PlayerProfile {
  id?: number;
  name: string;
  photo?: string;
  birthDate?: Date;
  age?: number;
  club?: TeamRef;
  seasons: PlayerSeasonBlock[];
  transfers: PlayerTransfer[];
  teammates: PlayerTeammate[];
}
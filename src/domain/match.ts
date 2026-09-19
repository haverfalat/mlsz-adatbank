import { FormResult, MatchScore } from './standings.js';
import { PlayerRef, Scored, TeamRef } from './common.js';

export interface Official {
  role: string;
  name: string;
}

export interface MatchTeamForm {
  result: FormResult;
  matchId?: number;
  description?: string;
}

export interface MatchTeamBlock {
  name: string;
  href?: string;
  id?: number;
  logo?: string;
  form: MatchTeamForm[];
}

export type EventKind = 'goal' | 'ownGoal' | 'substitution' | 'yellowCard' | 'redCard';

export interface TimelineEvent {
  minute?: number;
  kind: EventKind;
  home: boolean;
  player?: string;
  off?: string;
  on?: string;
}

export interface GoalEvent {
  order: number;
  home: boolean;
  player?: string;
  playerId?: number;
  minute?: number;
  ownGoal: boolean;
  score?: Scored;
}

export interface PlayerEvent {
  kind: EventKind;
  minute: number;
}

export interface LineupEntry {
  number?: number;
  name: string;
  href?: string;
  id?: number;
  subbedBy?: PlayerRef;
  events: PlayerEvent[];
}

export interface TeamLineup {
  name: string;
  href?: string;
  logo?: string;
  starters: LineupEntry[];
  bench: LineupEntry[];
  coach?: string;
  crew: { name: string; role: string }[];
}

export interface MatchDetail {
  id: number;
  title?: string;
  league?: string;
  organizer?: string;
  kickoff?: Date;
  venue?: string;
  home: MatchTeamBlock;
  away: MatchTeamBlock;
  score?: MatchScore;
  officials: Official[];
  goals: GoalEvent[];
  timeline: TimelineEvent[];
  lineups: {
    home?: TeamLineup;
    away?: TeamLineup;
  };
}
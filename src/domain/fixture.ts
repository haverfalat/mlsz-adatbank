import { Scored, TeamRef } from './common.js';

export type FixtureState = 'scheduled' | 'played';

export interface Fixture {
  matchId?: number;
  home: TeamRef;
  away: TeamRef;
  kickoff?: Date;
  venue?: string;
  state: FixtureState;
  score?: Scored;
  href?: string;
  videoHref?: string;
}
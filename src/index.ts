import { ClientConfig, resolveConfig } from './config/defaults.js';
import { AdatbankHttp } from './http/client.js';
import { LeaguesService } from './services/leagues.js';
import { MatchesService } from './services/matches.js';
import { StandingsService } from './services/standings.js';
import { ClubsService } from './services/clubs.js';
import { PlayersService } from './services/players.js';
import { StatsService } from './services/stats.js';
import { SearchService } from './services/search.js';

export interface AdatbankClient {
  config: ClientConfig;
  leagues: LeaguesService;
  matches: MatchesService;
  standings: StandingsService;
  clubs: ClubsService;
  players: PlayersService;
  stats: StatsService;
  search: SearchService;
}

export function createAdatbankClient(overrides: Partial<ClientConfig> = {}): AdatbankClient {
  const config = resolveConfig(overrides);
  const http = new AdatbankHttp(config);

  return {
    config,
    leagues: new LeaguesService(http, config.baseUrl),
    matches: new MatchesService(http, config.baseUrl, config.meccsCenterUrl),
    standings: new StandingsService(http, config.baseUrl),
    clubs: new ClubsService(http, config.baseUrl),
    players: new PlayersService(http, config.baseUrl, config.meccsCenterUrl),
    stats: new StatsService(http, config.baseUrl, config.meccsCenterUrl),
    search: new SearchService(http, config.meccsCenterUrl),
  };
}

export { ClientConfig, resolveConfig, DEFAULT_CONFIG } from './config/defaults.js';
export { AdatbankHttp, HttpError } from './http/client.js';

export * from './domain/common.js';
export * from './domain/fixture.js';
export * from './domain/standings.js';
export * from './domain/match.js';
export * from './domain/stats.js';
export * from './domain/matchday.js';
export * from './domain/club.js';
export * from './domain/player.js';
export * from './domain/search.js';

export * from './parsers/options.js';
export * from './parsers/fixtures.js';
export * from './parsers/standings.js';
export * from './parsers/matchday.js';
export * from './parsers/stats.js';
export * from './parsers/matchDetails.js';
export * from './parsers/clubDetails.js';
export * from './parsers/playerDetails.js';
export * from './parsers/search.js';
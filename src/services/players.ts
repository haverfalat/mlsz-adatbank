import { PlayerMatchStat, PlayerProfile } from '../domain/player.js';
import { AdatbankHttp } from '../http/client.js';
import { parsePlayerMatchStats, parsePlayerProfile } from '../parsers/playerDetails.js';

export interface PlayerMatchStatsContext {
  teamLeagueId: number;
  playerId: number;
  season: string;
  leagueId: number;
}

export class PlayersService {
  constructor(
    private readonly http: AdatbankHttp,
    private readonly baseUrl: string,
    private readonly meccsCenterUrl: string,
  ) {}

  async get(playerId: number): Promise<PlayerProfile> {
    const html = await this.http.getText(`${this.baseUrl}/player/${playerId}.html`);
    return parsePlayerProfile(html, playerId);
  }

  async matchStats(context: PlayerMatchStatsContext): Promise<PlayerMatchStat[]> {
    const payload: unknown = await this.http.postJson(`${this.meccsCenterUrl}/libs/ajax.php`, {
      type: 'showStatDetailsByPlayerTd',
      teamLeagueId: context.teamLeagueId,
      playerId: context.playerId,
      season: context.season,
      leagueId: context.leagueId,
    });
    const content = (payload as { content?: unknown })?.content;
    if (typeof content !== 'string') {
      return [];
    }
    return parsePlayerMatchStats(content);
  }
}
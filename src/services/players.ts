import { PlayerProfile } from '../domain/player.js';
import { AdatbankHttp } from '../http/client.js';
import { parsePlayerProfile } from '../parsers/playerDetails.js';

export class PlayersService {
  constructor(
    private readonly http: AdatbankHttp,
    private readonly baseUrl: string,
  ) {}

  async get(playerId: number): Promise<PlayerProfile> {
    const html = await this.http.getText(`${this.baseUrl}/player/${playerId}.html`);
    return parsePlayerProfile(html, playerId);
  }
}
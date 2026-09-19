import { RoundContext } from '../domain/common.js';
import { Standings } from '../domain/standings.js';
import { AdatbankHttp } from '../http/client.js';
import { parseStandings } from '../parsers/standings.js';
import { roundUrl } from './matches.js';

export class StandingsService {
  constructor(
    private readonly http: AdatbankHttp,
    private readonly baseUrl: string,
  ) {}

  async get(ctx: RoundContext): Promise<Standings> {
    const html = await this.http.getText(roundUrl(this.baseUrl, ctx));
    return parseStandings(html);
  }
}
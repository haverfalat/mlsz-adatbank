import { AdatbankHttp } from '../http/client.js';
import { LeagueOptions, parseLeagueOptions } from '../parsers/options.js';

export class LeaguesService {
  constructor(
    private readonly http: AdatbankHttp,
    private readonly baseUrl: string,
  ) {}

  async options(): Promise<LeagueOptions> {
    return parseLeagueOptions(await this.http.getText(`${this.baseUrl}/`));
  }

  async seasons() {
    return (await this.options()).seasons;
  }

  async federations() {
    return (await this.options()).federations;
  }

  async leagues() {
    return (await this.options()).leagues;
  }

  async rounds() {
    return (await this.options()).rounds;
  }
}
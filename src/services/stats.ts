import { RoundContext } from '../domain/common.js';
import { CardRow, ScorerRow } from '../domain/stats.js';
import { AdatbankHttp } from '../http/client.js';
import { parseCards, parseScorers } from '../parsers/stats.js';

export type CardColor = 'yellow' | 'red';

export class StatsService {
  constructor(
    private readonly http: AdatbankHttp,
    private readonly baseUrl: string,
    private readonly meccsCenterUrl: string,
  ) {}

  async topScorers(ctx: RoundContext): Promise<ScorerRow[]> {
    const html = await this.http.getText(
      `${this.baseUrl}/goalshooter/${ctx.season}/${ctx.federation}/${ctx.league}/${ctx.round}.html`,
    );
    return parseScorers(html);
  }

  async cards(ctx: RoundContext, color: CardColor = 'yellow'): Promise<CardRow[]> {
    const html = await this.http.getText(`${this.meccsCenterUrl}/penality_cards`, {
      evad: ctx.season,
      szervezet: ctx.federation,
      verseny: ctx.league,
      fordulo: ctx.round,
      color: color === 'red' ? 'red' : undefined,
    });
    return parseCards(html);
  }
}
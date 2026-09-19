import { RoundContext } from '../domain/common.js';
import { Fixture } from '../domain/fixture.js';
import { MatchDay, MatchDayFilter } from '../domain/matchday.js';
import { MatchDetail } from '../domain/match.js';
import { AdatbankHttp } from '../http/client.js';
import { parseFixtures } from '../parsers/fixtures.js';
import { parseMatchDay } from '../parsers/matchday.js';
import { parseMatchDetail } from '../parsers/matchDetails.js';

const STATUS_PARAM: Record<NonNullable<MatchDayFilter['status']>, string> = {
  all: 'osszes',
  finished: 'befejezett',
  live: 'jelenleg-futo',
  upcoming: 'jovobeni',
};

export class MatchesService {
  constructor(
    private readonly http: AdatbankHttp,
    private readonly baseUrl: string,
    private readonly meccsCenterUrl: string,
  ) {}

  async listRound(ctx: RoundContext): Promise<Fixture[]> {
    const html = await this.http.getText(roundUrl(this.baseUrl, ctx));
    return parseFixtures(html);
  }

  async detail(matchId: number): Promise<MatchDetail> {
    const html = await this.http.getText(`${this.baseUrl}/match/${matchId}.html`);
    return parseMatchDetail(html, matchId);
  }

  async listByDate(filter: MatchDayFilter = {}): Promise<MatchDay> {
    const html = await this.http.getText(`${this.meccsCenterUrl}/merkozesnap`, {
      datum: filter.date,
      statusz: filter.status ? STATUS_PARAM[filter.status] : undefined,
      szervezet: filter.federation,
    });
    return parseMatchDay(html);
  }
}

export function roundUrl(baseUrl: string, ctx: RoundContext): string {
  return `${baseUrl}/league/${ctx.season}/${ctx.federation}/${ctx.league}/${ctx.round}.html`;
}
import { RoundContext } from '../domain/common.js';
import { ClubDetail } from '../domain/club.js';
import { Fixture } from '../domain/fixture.js';
import { AdatbankHttp } from '../http/client.js';
import { parseClubDetail } from '../parsers/clubDetails.js';
import { parseFixtures } from '../parsers/fixtures.js';

export class ClubsService {
  constructor(
    private readonly http: AdatbankHttp,
    private readonly baseUrl: string,
  ) {}

  async get(ctx: RoundContext, teamId: number): Promise<ClubDetail> {
    const html = await this.http.getText(clubUrl(this.baseUrl, ctx, teamId));
    return parseClubDetail(html, teamId);
  }

  async schedule(ctx: RoundContext, teamId: number): Promise<Fixture[]> {
    const html = await this.http.getText(clubUrl(this.baseUrl, ctx, teamId));
    return parseFixtures(html, '.team-sorsolas .schedule');
  }
}

export function clubUrl(baseUrl: string, ctx: RoundContext, teamId: number): string {
  return `${baseUrl}/club/${ctx.season}/${ctx.federation}/${ctx.league}/${ctx.round}/${teamId}.html`;
}
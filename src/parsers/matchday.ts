import type { Cheerio, CheerioAPI } from '../utils/html.js';
import { MatchDay, MatchDayGroup, MatchDayMatch, MatchDayStatus } from '../domain/matchday.js';
import { parseDate, parseTime, withTime } from '../utils/dates.js';
import { parseHtml } from '../utils/html.js';
import { trailingNumber } from '../utils/ids.js';
import { parseScore } from '../utils/scores.js';
import { norm } from '../utils/text.js';

export function parseMatchDay(html: string): MatchDay {
  const $ = parseHtml(html);
  const headers = $('#merkozesnap > table thead tr[id]');
  const bodies = $('#merkozesnap > .table-respo-cont');

  const groups: MatchDayGroup[] = headers.toArray().map((el, index) => {
    const header = $(el);
    const federation = intFromId(header.attr('id') ?? '');
    const organizer = norm(header.find('.merkozesnap-szervezet').text());
    const league = norm(header.text().replace(organizer, ''));
    const matches = readMatches($, bodies.eq(index));
    return { federation, organizer, league, matches };
  });

  return { groups };
}

function readMatches($: CheerioAPI, body: Cheerio): MatchDayMatch[] {
  return body
    .find('td[colspan] .db_goal_shooter-big-left-margin table tbody tr')
    .toArray()
    .slice(1)
    .map((el) => readMatch($, $(el)))
    .filter((m): m is MatchDayMatch => m !== null);
}

function readMatch($: CheerioAPI, tr: Cheerio): MatchDayMatch | null {
  const schedule = tr.find('.schedule').first();
  if (!schedule.length) {
    return null;
  }

  const link = schedule.find('.result-cont a');
  const dateCell = tr.find('td.goalShooterDate').first();
  const kickoff = withTime(parseDate(dateCell.text()), parseTime(dateCell.text()));
  const status: MatchDayStatus = tr.find('.goalShooterTime').text().includes('végleges')
    ? 'finalized'
    : tr.find('.goalShooterTime').text().includes('részleges')
      ? 'partial'
      : 'open';
  const score = parseScore(schedule.find('.result .chedule-info').text());

  return {
    matchId: trailingNumber(link.attr('href')),
    home: {
      name: norm(schedule.find('.home_team').text()),
    },
    away: {
      name: norm(schedule.find('.away_team').text()),
    },
    kickoff,
    round: int(norm(tr.find('td.goalShooterG').first().text())),
    status,
    score: score ?? undefined,
    href: link.attr('href') || undefined,
  };
}

function intFromId(id: string): number {
  const match = id.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

function int(value?: string | null): number | undefined {
  const match = (value ?? '').match(/-?\d+/);
  return match ? parseInt(match[0], 10) : undefined;
}
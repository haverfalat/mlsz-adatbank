import type { Cheerio, CheerioAPI } from '../utils/html.js';
import { Fixture, FixtureState } from '../domain/fixture.js';
import { TeamRef } from '../domain/common.js';
import { parseDate, parseTime, withTime } from '../utils/dates.js';
import { parseHtml } from '../utils/html.js';
import { trailingNumber } from '../utils/ids.js';
import { parseScore } from '../utils/scores.js';
import { norm } from '../utils/text.js';

const DEFAULT_SELECTOR = '#match_panel .schedule';

export function parseFixtures(html: string, selector: string = DEFAULT_SELECTOR): Fixture[] {
  const $ = parseHtml(html);
  return $(selector)
    .toArray()
    .map((el) => readFixture($, $(el)));
}

function readFixture($: CheerioAPI, schedule: Cheerio): Fixture {
  const resultLink = schedule.find('.result-cont a');
  const dateNode = schedule.find('.team_sorsolas_date');
  const time = parseTime(dateNode.find('span').text());
  const date = parseDate(dateNode.text());
  const scoreNode = schedule.find('.result .schedule-points');
  const score = parseScore(scoreNode.text());
  const state: FixtureState = score ? 'played' : 'scheduled';
  const href = resultLink.attr('href') ?? schedule.find('.team_sorsolas_date a').attr('href');
  const matchId = trailingNumber(schedule.attr('rel')) ?? trailingNumber(href);
  const videoHref = schedule.find('.match_video_table a, a.match_video').attr('href');

  return {
    matchId,
    home: readTeam(schedule.find('.home_team a').first()),
    away: readTeam(schedule.find('.away_team a').first()),
    kickoff: withTime(date, time),
    venue: norm(schedule.find('.team_sorsolas_arena').text()) || undefined,
    state,
    score: score ?? undefined,
    href: href || undefined,
    videoHref,
  };
}

function readTeam(a: Cheerio): TeamRef {
  const href = a.attr('href');
  return {
    name: norm(a.attr('title')) || norm(a.text()),
    id: trailingNumber(href),
    href,
  };
}
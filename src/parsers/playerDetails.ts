import type { Cheerio, CheerioAPI } from '../utils/html.js';
import {
  PlayerCompetitionStat,
  PlayerProfile,
  PlayerSeasonBlock,
  PlayerSeasonStat,
} from '../domain/player.js';
import { parseDate } from '../utils/dates.js';
import { parseHtml } from '../utils/html.js';
import { trailingNumber } from '../utils/ids.js';
import { bgImage } from '../utils/image.js';
import { int, norm } from '../utils/text.js';

export function parsePlayerProfile(html: string, playerId: number): PlayerProfile {
  const $ = parseHtml(html);
  const clubLink = $('table.team_info_wrapper tr.detail').find('a[href*="/club/"]').first();
  const clubHref = clubLink.attr('href');
  const birthDate = readFieldDate($, 'Születési idő');

  return {
    id: playerId,
    name: norm($('h1.container_title').first().text()),
    photo: bgImage($('.player_round_photo').attr('style')),
    birthDate,
    age: readFieldInt($, 'Kor'),
    club: clubLink.length
      ? {
          name: norm(clubLink.text()),
          id: trailingNumber(clubHref),
          href: clubHref,
        }
      : undefined,
    seasons: readSeasons($),
    transfers: readTransfers($),
    teammates: readTeammates($),
  };
}

function readFieldText($: CheerioAPI, dataname: string): string | undefined {
  const node = $('table.team_info_wrapper tr.detail')
    .filter((_, el) => norm($(el).find('td.dataname').text()) === dataname)
    .first()
    .find('td.datas');
  return norm(node.text()) || undefined;
}

function readFieldInt($: CheerioAPI, dataname: string): number | undefined {
  return int(readFieldText($, dataname) ?? '');
}

function readFieldDate($: CheerioAPI, dataname: string): Date | undefined {
  return parseDate(readFieldText($, dataname));
}

function readSeasons($: CheerioAPI): PlayerSeasonBlock[] {
  return $('table.player_szezon')
    .toArray()
    .map((el) => {
      const table = $(el);
      const headerText = norm(table.find('th.szezon_header').text());
      const [season, club] = splitSeasonHeader(headerText);
      const totals = readTotals(table.find('thead tr').eq(1));

return {
        season,
        club,
        totals: { ...readTotals(table.find('thead tr').eq(1)), season, club },
        competitions: table
          .find('tbody tr.hideLeague')
          .toArray()
          .map((rowEl) => readCompetition($, $(rowEl))),
      };
    });
}

function splitSeasonHeader(text: string): [string, string] {
  const index = text.indexOf('-');
  if (index === -1) {
    return [text, ''];
  }
  return [text.slice(0, index).trim(), text.slice(index + 1).trim()];
}

function readTotals(row: Cheerio): PlayerSeasonStat {
  const cells = row.find('th');
  return {
    appearances: stat(cells.eq(1)),
    starts: stat(cells.eq(2)),
    subs: stat(cells.eq(3)),
    bench: stat(cells.eq(4)),
    goals: stat(cells.eq(5)),
    ownGoals: stat(cells.eq(6)),
    yellows: stat(cells.eq(7)),
    reds: stat(cells.eq(8)),
  };
}

function readCompetition($: CheerioAPI, row: Cheerio): PlayerCompetitionStat {
  const cells = row.find('td');
  const name = norm(cells.eq(0).text());
  const position = name.match(/\((\d+\.)\)/)?.[1];
  const onclick = norm(cells.last().attr('onclick') ?? '');

  return {
    competition: name.replace(/\s*\(\d+\.\)\s*/, '').trim(),
    position: position ? `${parseInt(position, 10)}.` : undefined,
    teamId: argAt(onclick, 0),
    leagueId: argAt(onclick, 3),
    appearances: stat(cells.eq(1)),
    starts: stat(cells.eq(2)),
    subs: stat(cells.eq(3)),
    bench: stat(cells.eq(4)),
    goals: stat(cells.eq(5)),
    ownGoals: stat(cells.eq(6)),
    yellows: stat(cells.eq(7)),
    reds: stat(cells.eq(8)),
  };
}

function argAt(onclick: string, index: number): number | undefined {
  const numbers = onclick.match(/\d+(?:\.\d+)?/g);
  const value = numbers?.[index];
  return value ? parseInt(value, 10) : undefined;
}

function readTransfers($: CheerioAPI) {
  return $('#player_igazolas tr')
    .toArray()
    .filter((el) => $(el).find('td').length > 0)
    .map((el) => {
      const row = $(el);
      const until = norm(row.find('.player_igazolas_until').text());
      return {
        from: norm(row.find('.player_igazolas_from').text()) || undefined,
        to: norm(row.find('.player_igazolas_to').text()) || undefined,
        start: parseDate(row.find('.player_igazolas_begin').text()),
        end: until === '.' ? undefined : parseDate(until),
        type: norm(row.find('.player_igazolas_type').text()) || undefined,
      };
    });
}

function readTeammates($: CheerioAPI) {
  return $('#teammateList tr')
    .toArray()
    .map((el) => {
      const row = $(el);
      const link = row.find('td.teammateList_name a').first();
      const href = link.attr('href');
      return {
        player: {
          name: norm(link.text()),
          id: trailingNumber(href),
          href,
        },
        age: int(norm(row.find('td.teammateList_age').text())),
      };
    });
}

function stat(cell: Cheerio): number {
  return int(norm(cell.text())) ?? 0;
}
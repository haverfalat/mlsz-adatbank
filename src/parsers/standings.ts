import type { Cheerio, CheerioAPI } from '../utils/html.js';
import { NextOpponent, StandingRow, Standings } from '../domain/standings.js';
import { parseDate } from '../utils/dates.js';
import { readFormAnchor } from '../utils/form.js';
import { parseHtml } from '../utils/html.js';
import { trailingNumber } from '../utils/ids.js';
import { bgImage } from '../utils/image.js';
import { int, norm } from '../utils/text.js';

export function parseStandings(html: string): Standings {
  const $ = parseHtml(html);
  return $('#tableContent tr')
    .toArray()
    .map((el) => readRow($, $(el)));
}

function readRow($: CheerioAPI, tr: Cheerio): StandingRow {
  const cells = tr.find('td');
  const origRank = int(tr.attr('data-origrank') ?? '');
  const position = origRank ?? int(norm(cells.eq(0).text()));
  const clubHref = (tr.attr('onclick') ?? '').match(/location\.href='([^']+)'/)?.[1];
  const logo = bgImage(cells.eq(1).find('img').attr('style')) ?? cells.eq(1).find('img').attr('src');
  const form = tr
    .find('.team_form a')
    .toArray()
    .map((el) => readFormAnchor($(el)))
    .filter((chip): chip is NonNullable<typeof chip> => chip !== null);

  return {
    position: position ?? 0,
    team: {
      name: norm(cells.eq(2).text()),
      id: trailingNumber(clubHref),
      href: clubHref,
    },
    logo,
    played: num(cells.eq(3)),
    won: num(cells.eq(4)),
    drawn: num(cells.eq(5)),
    lost: num(cells.eq(6)),
    goalsFor: num(cells.eq(7)),
    goalsAgainst: num(cells.eq(8)),
    goalDiff: num(cells.eq(9)),
    points: num(cells.eq(10)),
    opposition: norm(cells.eq(11).text()) || undefined,
    comment: norm(cells.eq(12).text()) || undefined,
    nextOpponent: readNext(cells.eq(13)),
    form,
  };
}

function readNext(cell: Cheerio): NextOpponent | undefined {
  const link = cell.find('a').first();
  const img = cell.find('a img');
  const raw = img.attr('title');
  if (!raw && !link.attr('href')) {
    return undefined;
  }

  const next: NextOpponent = {
    matchId: trailingNumber(link.attr('href')),
  };
  const lines = raw?.split('\n').map(norm) ?? [];

  if (lines.length > 0) {
    next.date = parseDate(lines[0]);
  }
  if (lines.length > 1) {
    next.venue = norm(lines[1]) || undefined;
  }
  if (lines.length > 2) {
    next.home = norm(lines[2].replace(/-+\s*$/, '')) || undefined;
  }
  if (lines.length > 3) {
    next.away = norm(lines[3]) || undefined;
  }

  return next;
}

function num(cell: Cheerio): number {
  return int(norm(cell.text())) ?? 0;
}
import type { Cheerio, CheerioAPI } from '../utils/html.js';
import { CardRow, ScorerRow } from '../domain/stats.js';
import { parseHtml } from '../utils/html.js';
import { trailingNumber } from '../utils/ids.js';
import { bgImage } from '../utils/image.js';
import { int, norm } from '../utils/text.js';

export function parseScorers(html: string): ScorerRow[] {
  const $ = parseHtml(html);
  return $('#db_goal_shooter-results-container tbody tr.template-tr-selectable')
    .toArray()
    .map((el) => readScorer($, $(el)));
}

export function parseCards(html: string): CardRow[] {
  const $ = parseHtml(html);
  return $('#db_goal_shooter-results-container tbody tr.template-tr-selectable')
    .toArray()
    .map((el) => readCard($, $(el)));
}

function readScorer($: CheerioAPI, row: Cheerio): ScorerRow {
  const cells = row.find('td');
  const playerCell = cells.eq(1);
  const playerLink = playerCell.find('a[href*="/player/"]');

  return {
    rank: num(cells.eq(0).text()),
    player: {
      name: norm(playerCell.text()),
      id: trailingNumber(playerLink.attr('href')),
      href: playerLink.attr('href') ?? undefined,
    },
    photo: bgImage(playerCell.find('.player_round_photo_xs').attr('style')),
    goals: num(cells.eq(2).text()),
    club: readClub(cells.eq(3)),
  };
}

function readCard($: CheerioAPI, row: Cheerio): CardRow {
  const cells = row.find('td');
  const playerCell = cells.eq(1);
  const playerLink = playerCell.find('a[href*="/player/"]');

  return {
    rank: num(cells.eq(0).text()),
    player: {
      name: norm(playerCell.text()),
      id: trailingNumber(playerLink.attr('href')),
      href: playerLink.attr('href') ?? undefined,
    },
    photo: bgImage(playerCell.find('.player_round_photo_xs').attr('style')),
    yellow: num(cells.eq(3).text()),
    red: num(cells.eq(4).text()),
    club: readClub(cells.eq(2)),
  };
}

function readClub(cell: Cheerio) {
  const link = cell.find('a[href*="/club/"]').first();
  return {
    name: norm(link.text()),
    id: trailingNumber(link.attr('href')),
    href: link.attr('href') ?? undefined,
  };
}

function num(value?: string | null): number {
  return int(value) ?? 0;
}
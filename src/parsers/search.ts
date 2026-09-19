import { SearchClub, SearchPlayer, SearchResults } from '../domain/search.js';
import { parseHtml, Cheerio, CheerioAPI } from '../utils/html.js';
import { norm } from '../utils/text.js';

export function parseSearchResults(html: string, query: string): SearchResults {
  const $ = parseHtml(html);

  return {
    query,
    players: readRows($, $('tbody#finded_players tr'), readPlayerRow),
    teams: readRows($, $('tbody#finded_teams tr'), readTeamRow),
  };
}

function readRows<T>($: CheerioAPI, rows: Cheerio, reader: (row: Cheerio) => T | null): T[] {
  return rows
    .toArray()
    .map((el) => reader($(el)))
    .filter((value): value is T => value !== null);
}

function readPlayerRow(row: Cheerio): SearchPlayer | null {
  if (row.hasClass('search-noresult')) {
    return null;
  }
  const cells = row.find('td');
  const anchor = cells.eq(1).find('a');
  const href = anchor.attr('href') ?? '';
  if (!href) {
    return null;
  }

  const result: SearchPlayer = {
    player: {
      name: norm(anchor.text()) || norm(anchor.attr('title')),
      href,
      id: paramInt(href, 'itemId'),
    },
    club: norm(cells.eq(2).text()) || undefined,
  };
  const birth = norm(cells.eq(0).text());
  const parts = birth.split('-').map(Number);
  if (parts.length === 3 && parts.every(Number.isFinite)) {
    result.birthDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  }

  return result;
}

function readTeamRow(row: Cheerio): SearchClub | null {
  if (row.hasClass('search-noresult')) {
    return null;
  }
  const anchor = row.find('td a');
  const href = anchor.attr('href') ?? '';
  if (!href) {
    return null;
  }

  const season = paramInt(href, 'evad');
  const federation = paramInt(href, 'szervezet');
  const league = paramInt(href, 'verseny');
  const result: SearchClub = {
    club: {
      name: norm(anchor.text()) || norm(anchor.attr('title')),
      href,
      id: paramInt(href, 'teamId'),
    },
    league: norm(row.find('td').eq(1).text()),
  };
  if (season !== undefined && federation !== undefined && league !== undefined) {
    result.context = { season, federation, league };
  }

  return result;
}

function paramInt(href: string, key: string): number | undefined {
  const match = href.match(new RegExp(`[?&]${key}=(\\d+)`));
  return match ? Number(match[1]) : undefined;
}
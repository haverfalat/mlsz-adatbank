import type { CheerioAPI } from 'cheerio';
import { PageState, SelectOption } from '../domain/common.js';
import { parseHtml } from '../utils/html.js';
import { int, norm } from '../utils/text.js';

export interface LeagueOptions {
  state: PageState;
  seasons: SelectOption[];
  federations: SelectOption[];
  leagues: SelectOption[];
  rounds: SelectOption[];
}

export function parseLeagueOptions(html: string): LeagueOptions {
  const $ = parseHtml(html);

  return {
    state: {
      season: fieldValue($, 'hiddenEvad'),
      federation: fieldValue($, 'hiddenSzervezet'),
      league: fieldValue($, 'hiddenVerseny'),
      round: fieldValue($, 'hiddenFordulo'),
    },
    seasons: readSelect($, 'evad'),
    federations: readSelect($, 'federations'),
    leagues: readSelect($, 'leagues'),
    rounds: readSelect($, 'turns'),
  };
}

function fieldValue($: CheerioAPI, id: string): number | null {
  const raw = $(`#${id}`).attr('value');
  if (raw == null || raw === '') {
    return null;
  }
  return int(raw) ?? null;
}

function readSelect($: CheerioAPI, id: string): SelectOption[] {
  return $(`#${id} option`)
    .toArray()
    .map((el) => {
      const node = $(el);
      const raw = node.attr('value') ?? '';
      const placeholder = raw === '-1' || raw === '';
      return {
        value: placeholder ? null : (int(raw) ?? null),
        label: norm(node.text()),
        selected: node.is('[selected]'),
      };
    });
}
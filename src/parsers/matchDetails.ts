import type { Cheerio, CheerioAPI } from '../utils/html.js';
import {
  EventKind,
  GoalEvent,
  LineupEntry,
  MatchDetail,
  MatchTeamBlock,
  Official,
  PlayerEvent,
  TeamLineup,
  TimelineEvent,
} from '../domain/match.js';
import { PlayerRef } from '../domain/common.js';
import { MatchScore } from '../domain/standings.js';
import { parseDate, parseTime, withTime } from '../utils/dates.js';
import { readFormAnchor } from '../utils/form.js';
import { parseHtml } from '../utils/html.js';
import { trailingNumber } from '../utils/ids.js';
import { bgImage } from '../utils/image.js';
import { parseScore } from '../utils/scores.js';
import { int, norm } from '../utils/text.js';

const KIND_BY_SRC: Record<string, EventKind> = {
  event_goal: 'goal',
  event_own_goal: 'ownGoal',
  event_swap: 'substitution',
  event_yellowcard: 'yellowCard',
  event_redcard: 'redCard',
};

export function parseMatchDetail(html: string, matchId: number): MatchDetail {
  const $ = parseHtml(html);

  return {
    id: matchId,
    title: norm($('#headerText').text()) || undefined,
    kickoff: readKickoff($('.match_data_date').text()),
    venue: norm($('#hiddenLocation').attr('value')) || readVenue($),
    organizer: norm(readLeftParagraph($, 2)),
    league: norm(readLeftParagraph($, 3)),
    home: readTeamBlock($, $('.left-team')),
    away: readTeamBlock($, $('.right-team')),
    score: readScore($),
    officials: readOfficials($),
    goals: readGoals($),
    timeline: readTimeline($),
    lineups: {
      home: readLineup($, '#left_team'),
      away: readLineup($, '#right_team'),
    },
  };
}

function readLeftParagraph($: CheerioAPI, index: number): string | undefined {
  return $('.left-datas p').eq(index).text();
}

function readVenue($: CheerioAPI): string | undefined {
  return norm($('.left-datas p').eq(1).text());
}

function readKickoff(text: string): Date | undefined {
  return withTime(parseDate(text), parseTime(text));
}

function readTeamBlock($: CheerioAPI, section: Cheerio): MatchTeamBlock {
  const link = section.find('.team_name a');
  const href = link.attr('href');
  return {
    name: norm(link.text()),
    href,
    id: trailingNumber(href),
    logo: bgImage(section.find('.teamicon').attr('style')),
    form: section
      .find('.team_form a')
      .toArray()
      .map((el) => readFormAnchor($(el)))
      .filter((chip): chip is NonNullable<typeof chip> => chip !== null),
  };
}

function readScore($: CheerioAPI): MatchScore | undefined {
  const full = parseScore($('.match-result span').text());
  if (!full) {
    return undefined;
  }
  return {
    full,
    half: parseScore($('.match-result p').text()) ?? undefined,
  };
}

function readOfficials($: CheerioAPI): Official[] {
  return $('.right-datas .detail')
    .toArray()
    .map((el) => {
      const node = $(el);
      const name = norm(node.find('.name').text()).replace(/\s*,\s*/g, ', ');
      if (!name) {
        return null;
      }
      return {
        role: norm(node.find('.dataname').text()),
        name,
      };
    })
    .filter((o): o is Official => o !== null);
}

function readGoals($: CheerioAPI): GoalEvent[] {
  return $('.goals table.data-row tr')
    .toArray()
    .map((el, order) => {
      const row = $(el);
      const left = row.find('td.left_team_player');
      const right = row.find('td.right_team_player');
      const home = left.find('a[href*="/player/"]');

      const info = home.length ? left : right;
      const player = info.find('a[href*="/player/"]').first();
      const href = player.attr('href');
      const ownGoal = bgImage(info.find('.goals_info span').attr('style'))?.includes('own_goal') ?? false;

      return {
        order,
        home: home.length > 0,
        player: norm(player.text()) || undefined,
        playerId: trailingNumber(href),
        minute: readMinute(info.find('.goals_info').text()),
        ownGoal,
        score: parseScore(row.find('td.goals_intimes').text()) ?? undefined,
      };
    });
}

function readTimeline($: CheerioAPI): TimelineEvent[] {
  return $('.timeline-sub-container > div')
    .toArray()
    .map((el) => {
      const div = $(el);
      const img = div.find('img').first();
      const src = img.attr('src') ?? '';
      const kind = kindFromSrc(src);
      if (!kind) {
        return null;
      }
      return readTimelineEvent(kind, div.attr('style') ?? '', img.attr('title') ?? '');
    })
    .filter((e): e is TimelineEvent => e !== null);
}

function readTimelineEvent(kind: EventKind, style: string, title: string): TimelineEvent {
  const home = topPx(style) < 40;
  const lines = title.split('\n').map(norm);
  const minute = int(lines[0] ?? '') ?? undefined;
  const event: TimelineEvent = { minute, kind, home };

  if (kind === 'substitution') {
    event.off = lineValue(lines, 'Le:');
    event.on = lineValue(lines, 'Be:');
    return event;
  }

  const stopWords = new Set(['gól', 'öngól', 'sárga', 'piros', 'lap']);
  const body = (lines[0] ?? '').replace(/^-?\d+['’]?,?\s*/, '');
  const player = body.split(' ').filter((word) => !stopWords.has(word.toLowerCase())).join(' ');
  event.player = norm(player) || undefined;
  return event;
}

function lineValue(lines: string[], prefix: string): string | undefined {
  const line = lines.find((l) => l.startsWith(prefix));
  return line ? norm(line.slice(prefix.length)) : undefined;
}

function kindFromSrc(src: string): EventKind | undefined {
  const name = (src.split('/').pop() ?? '').replace(/\.\w+$/, '');
  return KIND_BY_SRC[name];
}

function topPx(style: string): number {
  const match = style.match(/top:\s*(-?\d+)px/);
  return match ? parseInt(match[1], 10) : 0;
}

function readMinute(text: string): number | undefined {
  const match = text.match(/(\d+)['’]/);
  return match ? parseInt(match[1], 10) : undefined;
}

function readLineup($: CheerioAPI, selector: string): TeamLineup | undefined {
  const section = $(selector);
  if (!section.length || !section.find('#matchContent').length) {
    return undefined;
  }

  const href = section.find('.team_info a').attr('href');
  const startersTable = section.find('#matchContent > table').first();
  const benchTable = section.find('#matchContent > table.replacement').not('.coach, .crew').first();

  return {
    name: norm(section.find('.team_info h2').text()),
    href,
    logo: bgImage(section.find('.team_info span').attr('style')),
    starters: readLineupRows($, startersTable, true),
    bench: readLineupRows($, benchTable, false),
    coach: norm(section.find('table.replacement.coach td.match_table_coach').text()) || undefined,
    crew: section
      .find('table.replacement.crew tr')
      .not('.toggleHandler')
      .toArray()
      .map((el) => readCrewRow($(el))),
  };
}

function readLineupRows($: CheerioAPI, table: Cheerio, isStarter: boolean): LineupEntry[] {
  return table
    .find('tr.template-tr-selectable')
    .toArray()
    .map((el) => readLineupRow($, $(el), isStarter));
}

function readLineupRow($: CheerioAPI, tr: Cheerio, isStarter: boolean): LineupEntry {
  const numCell = tr.find('td.match_players_num');
  const nameCell = tr.find('td.match_players_name');
  const main = nameCell.find('a:not(.match_players_changeup)').first();
  const href = main.attr('href');
  const swap = readSwap(nameCell.find('a.match_players_changeup').first());

  return {
    number: int(norm(numCell.find('a:not(.match_players_changeup) span.playerNum').text())),
    name: norm(nameCell.find('a:not(.match_players_changeup)').text()) || norm(nameCell.text()),
    href,
    id: trailingNumber(href),
    ...(swap ? (isStarter ? { replacedBy: swap } : { replaced: swap }) : {}),
    events: tr
      .find('td.match_players_cards span')
      .toArray()
      .map((el) => readPlayerEvent($(el)))
      .filter((e): e is PlayerEvent => e !== null),
  };
}

function readSwap(link: Cheerio): PlayerRef | undefined {
  const href = link.attr('href');
  const name = norm(link.text());
  if (!link.length || !name) {
    return undefined;
  }
  return { name, href, id: trailingNumber(href) };
}

function readPlayerEvent(span: Cheerio): PlayerEvent | null {
  const kind = kindFromSrc(bgImage(span.attr('style')) ?? '');
  const minute = int(norm(span.text()));
  if (!kind || minute == null) {
    return null;
  }
  return { kind, minute };
}

function readCrewRow(row: Cheerio): { name: string; role: string } {
  const text = norm(row.find('td.match_players_name').text());
  const [name, ...rest] = text.split(' - ');
  return {
    name: norm(name ?? ''),
    role: norm(rest.join(' - ')),
  };
}
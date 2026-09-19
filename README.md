# mlsz-adatbank

TypeScript client for the public fixtures, results and statistics pages of the
Hungarian football federation (MLSZ) Adatbank site.

## Table of Contents

- [Install](#install)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Services](#services)
  - [LeaguesService](#leaguesservice)
  - [MatchesService](#matchesservice)
  - [StandingsService](#standingsservice)
  - [ClubsService](#clubsservice)
- [PlayersService](#playersservice)
- [StatsService](#statsservice)
- [SearchService](#searchservice)
- [Low-level Parsers](#low-level-parsers)
- [HTTP client](#http-client)
- [Data model](#data-model)
- [Limitations](#limitations)
- [Development](#development)
- [License](#license)

## Install

```sh
npm install mlsz-adatbank
```

Requires Node.js 18 or newer. The package is pure ESM and ships its own
TypeScript declarations.

## Quick Start

```ts
import { createAdatbankClient } from 'mlsz-adatbank';

const client = createAdatbankClient();

// Pick the selected league and round from the homepage dropdowns.
const options = await client.leagues.options();
const league = options.leagues.find((o) => o.selected)!.value!;
const round = options.rounds.find((o) => o.selected)!.value!;

const roundCtx = {
  season: options.state.season!,
  federation: options.state.federation!,
  league,
  round,
};

const standings = await client.standings.get(roundCtx);
const fixtures = await client.matches.listRound(roundCtx);
const detail = await client.matches.detail(fixtures[0].matchId!);
const scorers = await client.stats.topScorers(roundCtx);
const yellowCards = await client.stats.cards(roundCtx, 'yellow');
```

Every service method returns parsed data directly. Nothing is written back to
the site.

## Configuration

```ts
createAdatbankClient({
  baseUrl: 'https://adatbank.mlsz.hu',
  meccsCenterUrl: 'https://ada1bank.mlsz.hu',
  timeoutMs: 15000,
  retries: 2,
  fetchFn: customFetch,
});
```

| Option           | Default                    | Meaning                                      |
| ---------------- | -------------------------- | -------------------------------------------- |
| `baseUrl`        | `https://adatbank.mlsz.hu` | League, match and club pages.                |
| `meccsCenterUrl` | `https://ada1bank.mlsz.hu` | Fixture and lineup pages.                    |
| `timeoutMs`      | `15000`                    | Per-request timeout in milliseconds.         |
| `retries`        | `2`                        | Extra attempts after a failed request.       |
| `fetchFn`        | global `fetch`             | Drop-in replacement for testing or proxying. |

The client sets a common browser user agent and an `accept-language: hu` header
on every request.

## Services

Methods that need a league context take a `RoundContext`:

```ts
interface LeagueContext {
  season: number;
  federation: number;
  league: number;
}

interface RoundContext extends LeagueContext {
  round: number;
}
```

### LeaguesService

Reads the homepage dropdowns and the hidden current selection.

```ts
const options = await client.leagues.options();
// { seasons, federations, leagues, rounds, state }

const seasons = await client.leagues.seasons(); // SelectOption[]
const feds = await client.leagues.federations(); // SelectOption[]
const leagues = await client.leagues.leagues(); // SelectOption[]
const rounds = await client.leagues.rounds(); // SelectOption[]
```

`options()` returns everything in one request. The other four are thin
convenience wrappers around it.

### MatchesService

```ts
const fixtures = await client.matches.listRound(roundCtx); // Fixture[]
const detail = await client.matches.detail(2186424); // MatchDetail
const day = await client.matches.listByDate({ date: '2026-09-19' }); // MatchDay
```

- `listRound` reads the round selector on the league page. Played fixtures
  carry the final score, scheduled ones carry the kickoff time. Both include
  the match page URL and, when present, the video link.
- `detail` reads the match page: teams, score, goals, timeline events,
  officials, lineups, substitutions and staff. The lineup page is hosted on a
  different domain, the redirect is followed transparently.
- `listByDate` reads all leagues for one day, grouped by federation and
  league. Match state is one of `finalized`, `partial`, `open`.

### StandingsService

```ts
const standings = await client.standings.get(roundCtx);
// { context, updatedAt, updatedBy, rows }
```

Each row gives the position, club, the full W/D/L goal tally, points, the
opposition column, the next opponent (date, venue, teams, match id) and the
recent form chips with their result descriptions.

### ClubsService

```ts
const club = await client.clubs.get(roundCtx, 328184); // ClubDetail
const schedule = await client.clubs.schedule(roundCtx, 328184); // Fixture[]
```

- `get` returns the club header block (name, logo, founded, city, official
  name, colours, website, contact) as a list that is safe to render as-is.
- `schedule` reads the club fixture list for the given round.

### PlayersService

```ts
const profile = await client.players.get(437842); // PlayerProfile
```

The profile includes the player photo, season-by-season statistics (appearances,
subs, goals, own goals, yellow/red cards), and the transfer history with dates
and club names.

### StatsService

```ts
const scorers = await client.stats.topScorers(roundCtx); // ScorerRow[]
const cards = await client.stats.cards(roundCtx, 'yellow'); // CardRow[]
const red = await client.stats.cards(roundCtx, 'red');
```

Scorer rows carry rank, player (name, id, photo), goals and club. Card rows
carry the same player bounds with the yellow and red totals.

### SearchService

```ts
const results = await client.search.search('Gipsy Jakab');
// { query, players: [...], teams: [...] }
```

Players and clubs are matched independently. Player hits carry the birth date,
the player id and the current club when it is published. Club hits carry the
club id, the league name and the season / federation / league context taken
from the result link. When a box has no match it is skipped.

## Low-level Parsers

Every page parser is exported standalone. Each takes a raw HTML string and
returns the plain data shape, which is useful if you want to cache responses or
feed in fixtures from disk.

| Parser                       | Input rule                                             |
| ---------------------------- | ------------------------------------------------------ |
| `parseLeagueOptions`         | Homepage HTML.                                         |
| `parseFixtures`              | League HTML, plus a CSS selector for the fixture pane. |
| `parseStandings`             | League HTML.                                           |
| `parseMatchDay`              | A day page HTML.                                       |
| `parseScorers`, `parseCards` | Leaderboard HTML.                                      |
| `parseMatchDetail`           | A match HTML string and the match id.                  |
| `parseClubDetail`            | A club page HTML.                                      |
| `parsePlayerProfile`         | A player page HTML.                                    |
| `parseSearchResults`         | A search page HTML, plus the query string.             |

## HTTP client

`AdatbankHttp` handles the retries, timeout and header defaults. It is exported
so you can reuse it with the parsers directly if you ever need to skip the
services layer. Requests that fail after all retries throw an `HttpError` with
the status code attached.

## Data model

The domain types are grouped by page family in `src/domain`:

- `common.ts`: `LeagueContext`, `RoundContext`, `SelectOption`, `PageState`,
  `TeamRef`, `PlayerRef`, `Scored`.
- `fixture.ts`: `Fixture` (home/away, kickoff, venue, score, whether the match
  was played, match id, page and video links).
- `standings.ts`: `Standings`, `StandingRow`, `NextOpponent`, `FormResult`.
- `match.ts`: `MatchDetail`, `TeamDetail`, `MatchScore`, `GoalEvent`,
  `TimelineEvent`, `Official`, `Lineup`, `LineupPlayer`, `CrewMember`.
- `matchday.ts`: `MatchDay`, `MatchDayGroup`, `MatchDayMatch`, `MatchState`.
- `stats.ts`: `ScorerRow`, `CardRow`, `CardColor`.
- `club.ts`: `ClubDetail`, `ClubContact`.
- `player.ts`: `PlayerProfile`, `PlayerSeasonStats`, `PlayerTransfer`.

All values are returned exactly as published, except that surrounding
whitespace is trimmed and missing optional values are `undefined` rather than
empty strings.

## Limitations

This is an unofficial client. The whole library works by scraping HTML, so a
single markup change on the site can break any parser. Treat the data as
read-only and keep your request rate low. The per-player InStat advanced
statistics feed (`ajax.php` with its query-string contract) is intentionally
not covered.

## Development

```sh
npm install
npm run build
npm test
```

The test suite runs against small captured HTML fixtures, not the live site, so
it stays deterministic and offline.

## License

MIT

import { describe, expect, it } from 'vitest';
import { parseSearchResults } from '../src/parsers/search.js';

const html = `
<html>
  <body>
    <h1 class="container_title">Keresési eredmények</h1>
    <div class="two-box-container search-results">
      <div class="box box1">
        <table id="search_result_player">
          <thead><tr><th>Szül. idő</th><th>Játékos név</th><th>Klub</th></tr></thead>
          <tbody id="finded_players">
            <tr>
              <td>1989-02-08</td>
              <td><a href="https://ada1bank.mlsz.hu/player?itemId=8170" href="barmi" title="SZABÓ PÉTER">SZABÓ PÉTER</a></td>
              <td></td>
            </tr>
            <tr>
              <td>2006-10-04</td>
              <td><a href="https://ada1bank.mlsz.hu/player?itemId=517056" title="VARGA BARNABÁS">VARGA BARNABÁS</a></td>
              <td>AKASZTÓ FC</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="box box2">
        <table id="search_result_team">
          <thead><tr><th>Csapat név</th><th>Bajnokság</th></tr></thead>
          <tbody id="finded_teams">
            <tr>
              <td><a href="https://ada1bank.mlsz.hu/club?teamId=328180&evad=67&szervezet=0&verseny=33586" target="akarmi" title="FERENCVÁROSI TC">FERENCVÁROSI TC</a></td>
              <td>OTP Bank Liga</td>
            </tr>
            <tr class="search-noresult">
              <td colspan="2">Nincs a keresésnek megfelelő találat.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </body>
</html>
`;

describe('parseSearchResults', () => {
  const result = parseSearchResults(html, 'Szabó Péter');

  it('keeps the query', () => {
    expect(result.query).toBe('Szabó Péter');
  });

  it('parses player hits', () => {
    expect(result.players).toHaveLength(2);
    expect(result.players[0].player).toMatchObject({
      name: 'SZABÓ PÉTER',
      id: 8170,
      href: 'https://ada1bank.mlsz.hu/player?itemId=8170',
    });
    expect(result.players[0].birthDate?.toISOString().slice(0, 10)).toBe('1989-02-08');
    expect(result.players[0].club).toBeUndefined();
    expect(result.players[1].club).toBe('AKASZTÓ FC');
  });

  it('parses club hits and skips the no-result row', () => {
    expect(result.teams).toHaveLength(1);
    expect(result.teams[0].club).toMatchObject({ name: 'FERENCVÁROSI TC', id: 328180 });
    expect(result.teams[0].league).toBe('OTP Bank Liga');
    expect(result.teams[0].context).toEqual({ season: 67, federation: 0, league: 33586 });
  });
});

describe('parseSearchResults empty', () => {
  const empty = parseSearchResults(
    `<div>
      <tbody id="finded_players">
        <tr class="search-noresult"><td colspan="3">Nincs a keresésnek megfelelő találat.</td></tr>
      </tbody>
      <tbody id="finded_teams">
        <tr class="search-noresult"><td colspan="2">Nincs a keresésnek megfelelő találat.</td></tr>
      </tbody>
    </div>`,
    'zzzqqqxx',
  );

  it('returns empty lists', () => {
    expect(empty.players).toEqual([]);
    expect(empty.teams).toEqual([]);
  });
});

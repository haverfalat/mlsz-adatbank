import { describe, expect, it } from 'vitest';
import { parseStandings } from '../src/parsers/standings.js';

const html = `
<table>
  <tbody id="tableContent">
    <tr class="template-tr-selectable noNb1Tr" data-origrank="1" onclick="location.href='https://adatbank.mlsz.hu/club/67/0/33586/8/328184.html'">
      <td class="standing_position">1</td>
      <td><img src="https://adatbank.mlsz.hu/img/EgyesuletLogo/Logo/12/11493.png" alt="PUSKÁS&nbsp;AKADÉMIA&nbsp;FC" width="30"/></td>
      <td>PUSKÁS&nbsp;AKADÉMIA&nbsp;FC</td>
      <td>8</td><td>5</td><td>0</td><td>3</td>
      <td>13</td><td>10</td>
      <td class="remove700">3</td>
      <td class="prow">15</td>
      <td>3/15</td>
      <td class=""></td>
      <td class="remove500">
        <a href="https://adatbank.mlsz.hu/match/2186430.html">
          <img src="https://adatbank.mlsz.hu/img/EgyesuletLogo/Logo/15/14482.png"
          title="2026.10.11. &#013;&#010;ETO Stadion &#013;&#010;ETO FC - &#013;&#010;PUSKÁS AKADÉMIA FC" width="30"/>
        </a>
      </td>
      <td class="tableForm0 remove500">
        <div class="team_form">
          <a href="https://adatbank.mlsz.hu/match/2186424.html">
            <div class="green pointer" title="PUSKÁS AKADÉMIA FC 3 - 1 KISPEST–HONVÉD FC">GY</div>
          </a>
          <a href="https://adatbank.mlsz.hu/match/2186416.html">
            <div class="red pointer" title="ZTE FC 1 - 0 PUSKÁS AKADÉMIA FC">V</div>
          </a>
          <a href="https://adatbank.mlsz.hu/match/2186390.html">
            <div class="yellow pointer" title="PAKSI FC 2 - 2 KISPEST–HONVÉD FC">D</div>
          </a>
        </div>
      </td>
    </tr>
  </tbody>
</table>
`;

describe('parseStandings', () => {
  const rows = parseStandings(html);

  it('maps numeric columns', () => {
    const [row] = rows;
    expect(row.position).toBe(1);
    expect(row.team).toMatchObject({ name: 'PUSKÁS AKADÉMIA FC', id: 328184 });
    expect(row.played).toBe(8);
    expect(row.won).toBe(5);
    expect(row.drawn).toBe(0);
    expect(row.lost).toBe(3);
    expect(row.goalsFor).toBe(13);
    expect(row.goalsAgainst).toBe(10);
    expect(row.goalDiff).toBe(3);
    expect(row.points).toBe(15);
  });

  it('parses the next opponent', () => {
    const { nextOpponent } = rows[0];
    expect(nextOpponent?.matchId).toBe(2186430);
    expect(nextOpponent?.date?.getDate()).toBe(11);
    expect(nextOpponent?.venue).toBe('ETO Stadion');
    expect(nextOpponent?.home).toBe('ETO FC');
    expect(nextOpponent?.away).toBe('PUSKÁS AKADÉMIA FC');
  });

  it('parses the form chips', () => {
    const { form } = rows[0];
    expect(form).toHaveLength(3);
    expect(form[0]).toEqual({
      result: 'W',
      matchId: 2186424,
      description: 'PUSKÁS AKADÉMIA FC 3 - 1 KISPEST–HONVÉD FC',
    });
    expect(form[1].result).toBe('L');
    expect(form[2].result).toBe('D');
  });
});
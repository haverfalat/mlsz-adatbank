import { describe, expect, it } from 'vitest';
import { parseCards, parseScorers } from '../src/parsers/stats.js';

const scorersHtml = `
<div class="template-bg-white" id="db_goal_shooter-results">
  <table id="db_goal_shooter-results-container" width="100%" class=" goal">
    <thead>
      <tr><th>hely.</th><th>góllövő neve</th><th>gól</th><th>egyesület</th><th>&nbsp;</th></tr>
    </thead>
    <tbody>
      <tr class="template-tr-selectable">
        <td class="db_goal_shooter_openforclick">1</td>
        <td class="template-td-selectable-underline db_goal_shooter_jnev">
          <a href="https://adatbank.mlsz.hu/player/639975.html">
            <div class="player_round_photo_xs" style="background-image:url(https://adatbank.mlsz.hu/img/SzemelyFoto/Foto/1803/1802438.png)"></div>
          </a>
          <a href="https://adatbank.mlsz.hu/player/639975.html">JUREK GÁBOR</a>
        </td>
        <td class="db_goal_shooter_openforclick">7</td>
        <td class="template-td-selectable-underline db_goal_shooter_enev">
          <a href="https://adatbank.mlsz.hu/club/67/0/33586/8/328189.html">
            <img src="https://adatbank.mlsz.hu/img/EgyesuletLogo/Logo/12/11497.png" height="20" />
            MTK BUDAPEST
          </a>
        </td>
        <td class="db_goal_shooter_openforclick">&nbsp;</td>
      </tr>
    </tbody>
  </table>
</div>
`;

const cardsHtml = `
<div class="template-bg-white" id="db_goal_shooter-results">
  <table id="db_goal_shooter-results-container" width="100%" class="default">
    <thead>
      <tr>
        <th>hely.</th><th>játékos neve</th><th>egyesület</th><th>sárga lapok</th><th>piros lapok</th><th>&nbsp;</th>
      </tr>
    </thead>
    <tbody>
      <tr class="template-tr-selectable">
        <td class="db_goal_shooter_openforclick">1</td>
        <td class="template-td-selectable-underline db_goal_shooter_jnev">
          <a href="https://adatbank.mlsz.hu/player/1497610.html">
            <div class="player_round_photo_xs" style="background-image:url(x.jpg)"></div>
          </a>
          <a href="https://adatbank.mlsz.hu/player/1497610.html">MEJIAS GARCIA</a>
        </td>
        <td class="template-td-selectable-underline db_goal_shooter_enev">
          <a href="https://adatbank.mlsz.hu/club/67/0/33586/8/328190.html">
            <img src="https://adatbank.mlsz.hu/img/EgyesuletLogo/Logo/12/11492.png" height="20" />
            DVSC
          </a>
        </td>
        <td align="right" class="template-td-selectable-underline db_goal_shooter_jnev">5</td>
        <td align="right" class="template-td-selectable-underline db_goal_shooter_jnev">0</td>
        <td class="db_goal_shooter_openforclick">&nbsp;</td>
      </tr>
    </tbody>
  </table>
</div>
`;

describe('parseScorers', () => {
  const [row] = parseScorers(scorersHtml);

  it('reads scorer fields', () => {
    expect(row.rank).toBe(1);
    expect(row.player).toMatchObject({ name: 'JUREK GÁBOR', id: 639975 });
    expect(row.photo).toBe('https://adatbank.mlsz.hu/img/SzemelyFoto/Foto/1803/1802438.png');
    expect(row.goals).toBe(7);
    expect(row.club).toMatchObject({ name: 'MTK BUDAPEST', id: 328189 });
  });
});

describe('parseCards', () => {
  const [row] = parseCards(cardsHtml);

  it('reads card columns', () => {
    expect(row.player.name).toBe('MEJIAS GARCIA');
    expect(row.player.id).toBe(1497610);
    expect(row.yellow).toBe(5);
    expect(row.red).toBe(0);
    expect(row.club.name).toBe('DVSC');
  });
});
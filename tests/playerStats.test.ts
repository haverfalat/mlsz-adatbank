import { describe, expect, it } from 'vitest';
import {
  parsePlayerMatchStats,
  parsePlayerProfile,
} from '../src/parsers/playerDetails.js';

const fragment = `
<tr class="matchItem">
    <td colspan="2">
        <div class="schedule_box">
            <div class="schedule">
                <div class="home_team"><span>HIDEGKÚTI SC</span></div>
                <div class="home_logo"><img src="https://adatbank.mlsz.hu/img/EgyesuletLogo/Logo/15/14362.png" width="20"></div>
                <div class="result-cont">
                    <div class="result"><span class="chedule-info"><a href="https://adatbank.mlsz.hu/match/67/5/33821/1/2233177.html" target="barmi">5 - 2</a></span></div>
                </div>
                <div class="away_logo"><img src="https://adatbank.mlsz.hu/img/EgyesuletLogo/Logo/15/14454.jpg" width="20"></div>
                <div class="away_team"><span>UTE</span></div>
            </div>
        </div>
    </td>
    <td>0</td>
    <td>1</td>
    <td>0</td>
    <td>0</td>
    <td>0</td>
    <td>0</td>
    <td>0</td>
    <td>&nbsp;</td>
</tr>
<tr class="matchItem">
    <td colspan="2">
        <div class="schedule_box">
            <div class="schedule">
                <div class="home_team"><span>RKSK</span></div>
                <div class="home_logo"><img src="https://adatbank.mlsz.hu/img/EgyesuletLogo/Logo/14/13771.png" width="20"></div>
                <div class="result-cont">
                    <div class="result"><span class="chedule-info"><a href="https://adatbank.mlsz.hu/match/67/5/33821/4/2233195.html" target="barmi">5 - 2</a></span></div>
                </div>
                <div class="away_logo"><img src="https://adatbank.mlsz.hu/img/EgyesuletLogo/Logo/15/14454.jpg" width="20"></div>
                <div class="away_team"><span>UTE</span></div>
            </div>
        </div>
    </td>
    <td>0</td>
    <td>1</td>
    <td>0</td>
    <td>0</td>
    <td>0</td>
    <td>0</td>
    <td>0</td>
    <td>&nbsp;</td>
</tr>
`;

describe('parsePlayerMatchStats', () => {
  const matches = parsePlayerMatchStats(fragment);

  it('parses the match details', () => {
    expect(matches).toHaveLength(2);
    expect(matches[0]).toMatchObject({
      round: 1,
      matchId: 2233177,
      matchHref: 'https://adatbank.mlsz.hu/match/67/5/33821/1/2233177.html',
      home: { name: 'HIDEGKÚTI SC', logo: 'https://adatbank.mlsz.hu/img/EgyesuletLogo/Logo/15/14362.png' },
      away: { name: 'UTE', logo: 'https://adatbank.mlsz.hu/img/EgyesuletLogo/Logo/15/14454.jpg' },
      score: { home: 5, away: 2 },
    });
  });

  it('maps the numeric cells to starter, sub, bench and card stats', () => {
    expect(matches[0]).toMatchObject({
      starts: 0,
      subs: 1,
      bench: 0,
      goals: 0,
      ownGoals: 0,
      yellows: 0,
      reds: 0,
    });
  });
});

describe('parsePlayerProfile match harvesting', () => {
  const html = `
<html>
  <body>
    <h1 class="container_title">TESZT JÁTÉKOS</h1>
    <div class="player_szezon_cont" id="statBySeasons">
      <div class="container_subtitle">Szezon bontás</div>
      <table class="player_szezon">
        <thead>
          <tr>
            <th class="szezon_header"><div class="all_matches_table_season">2026/2027 - UTE</div></th>
            <th>Ö<span class="under700">sszes</span></th><th>K<span class="under700">ezdő</span></th>
            <th>Cs<span class="under700">ere</span></th><th>Kispad</th><th>G<span class="under700">ól</span></th>
            <th>Öngól</th><th>S<span class="under700">árga</span></th><th>P<span class="under700">iros</span></th><th></th>
          </tr>
          <tr>
            <th></th><th>3</th><th>0</th><th>3</th><th>0</th><th>0</th><th>0</th><th>0</th><th>0</th>
            <th class="player_drop_icon" onclick="showLeaguesOnPlayer(this);"></th>
          </tr>
        </thead>
        <tbody>
          <tr class="showLeague">
            <td>BLSZ SERDÜLŐ U-15 1. CSOPORT  <b>(1.)</b></td>
            <td>3</td><td>0</td><td>3</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
            <td class="player_drop_icon reverse" onclick="showStatDetailsByPlayerTd2(335564, 555, '2026/2027', 33821);"></td>
          </tr>
          <tr class="statDetailRow335564 showLeague hideLeague" style="display: table-row;">
            <td colspan="10" class="playerMatchesCont">
              <table id="statDetail335564" style="display: table;">${fragment}</table>
            </td>
          </tr>
          <tr class="hideLeague">
            <td>MAGYAR KUPA <b>(3.)</b></td>
            <td>2</td><td>2</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td>
            <td class="player_drop_icon reverse" onclick="showStatDetailsByPlayerTd2(336666, 555, '2026/2027', 33999);"></td>
          </tr>
          <tr class="statDetailRow336666 showLeague hideLeague" style="display:none">
            <td colspan="10" class="playerMatchesCont"><table id="statDetail336666"></table></td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>
`;

  const profile = parsePlayerProfile(html, 555);

  it('reads both league rows regardless of the visibility class', () => {
    const competitions = profile.seasons[0].competitions;
    expect(competitions).toHaveLength(2);
    expect(competitions[0].competition).toBe('BLSZ SERDÜLŐ U-15 1. CSOPORT');
    expect(competitions[0].position).toBe('1.');
    expect(competitions[0].teamId).toBe(335564);
    expect(competitions[0].leagueId).toBe(33821);
    expect(competitions[1].competition).toBe('MAGYAR KUPA');
  });

  it('harvests the match rows that are already embedded in the page', () => {
    expect(profile.seasons[0].competitions[0].matches).toHaveLength(2);
    expect(profile.seasons[0].competitions[0].matches?.[0].matchId).toBe(2233177);
    expect(profile.seasons[0].competitions[1].matches).toBeUndefined();
  });
});
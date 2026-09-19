import { describe, expect, it } from 'vitest';
import { parseMatchDetail } from '../src/parsers/matchDetails.js';

const html = `
<html>
<body>
  <h1 id="headerText" class="container_title">OTP Bank Liga 8. forduló</h1>
  <div class="left-datas rankings2-row">
    <p class="match_data_date"><span class="ion-android-time"></span> 2026.09.18 - 19:30</p>
    <p>Felcsút, Puskás Akadémia Pancho Aréna</p>
    <input type="hidden" id="hiddenLocation" value="Puskás Akadémia Pancho Aréna"/>
    <p>MLSZ</p>
    <p>OTP Bank Liga</p>
  </div>
  <div class="right-datas rankings2-row">
    <div class="team_info_wrapper">
      <div class="detail address">
        <div class="dataname">Játékvezető</div>
        <div class="name datas">RÚSZ MÁRTON</div>
      </div>
      <div class="detail phone">
        <div class="dataname">Asszisztensek</div>
        <div class="name datas">ALBERT ISTVÁN , VÍGH-TARSONYI GERGŐ</div>
      </div>
    </div>
  </div>
  <div class="teamswrapper">
    <div class="left-team">
      <div class="teamicon pointer" style="background-image: url(https://adatbank.mlsz.hu/img/EgyesuletLogo/Logo/12/11493.png);"></div>
      <div class="team_head_content">
        <div class="team_name pointer">
          <a href="https://adatbank.mlsz.hu/club/67/0/33586/8/328184.html">PUSKÁS AKADÉMIA FC</a>
        </div>
        <div class="team_form">
          <a href="https://adatbank.mlsz.hu/match/2186424">
            <div class="green pointer" title="PUSKÁS AKADÉMIA FC 3 - 1 KISPEST–HONVÉD FC">GY</div>
          </a>
        </div>
      </div>
    </div>
    <div class="right-team">
      <div class="teamicon pointer" style="background-image: url(https://adatbank.mlsz.hu/img/EgyesuletLogo/Logo/13/12740.png);"></div>
      <div class="team_head_content">
        <div class="team_name pointer">
          <a href="https://adatbank.mlsz.hu/club/67/0/33586/8/328182.html">KISPEST–HONVÉD FC</a>
        </div>
      </div>
    </div>
    <div class="match-result">
      <span>3 - 1</span><p>(2 - 1)</p>
    </div>
  </div>
  <div class="timeline">
    <div class="template-bg-white" id="timeline-container" style="height: 82px; position: relative;">
      <div class="timeline-sub-container">
        <div style="position: absolute; top: 20px;">
          <img src="https://ada1bank.mlsz.hu/meccs-center/img/timeline/event_goal.png" title="16' Gól&nbsp;NÉMETH ANDRÁS" />
        </div>
        <div style="position: absolute; top: 54px;">
          <img src="https://ada1bank.mlsz.hu/meccs-center/img/timeline/event_own_goal.png" title="38' Öngól&nbsp;ARUTIUNIAN GEORGII" />
        </div>
        <div style="position: absolute; top: 54px;">
          <img src="https://ada1bank.mlsz.hu/meccs-center/img/timeline/event_swap.png" title="46', Csere
Le: EDDARRAJ REDA
Be: GARCIA RUIZ PABLO" />
        </div>
        <div style="position: absolute; top: 20px;">
          <img src="https://ada1bank.mlsz.hu/meccs-center/img/timeline/event_yellowcard.png" title="41', Sárga lap&nbsp;ORJÁN ROLAND" />
        </div>
      </div>
    </div>
  </div>
  <div class="goals">
    <table class="data-row">
      <tr>
        <td class="left_team_player">
          <a href="https://adatbank.mlsz.hu/player/437842.html">NÉMETH ANDRÁS</a>
          <div class="goals_info">
            <span style="background-image: url(https://ada1bank.mlsz.hu/meccs-center/img/timeline/event_goal.png)"></span>
            <p>16&apos;</p>
          </div>
        </td>
        <td class="goals_intimes">1 - 0</td>
        <td class="right_team_player"><p>&nbsp;</p></td>
      </tr>
      <tr>
        <td class="left_team_player"><p>&nbsp;</p></td>
        <td class="goals_intimes">2 - 1</td>
        <td class="right_team_player">
          <div class="goals_info">
            <p>38&apos;</p>
            <span style="background-image: url(https://ada1bank.mlsz.hu/meccs-center/img/timeline/event_own_goal.png)"></span>
          </div>
          <a href="https://adatbank.mlsz.hu/player/1492411.html">ARUTIUNIAN GEORGII</a>
        </td>
      </tr>
    </table>
  </div>
  <div class="match_teams_players two-row-count">
    <div id="left_team" class="left_team rankings2-row">
      <div class="team_head_wrapper">
        <div class="team_info">
          <span class="pointer" style="background-image: url(https://adatbank.mlsz.hu/img/EgyesuletLogo/Logo/12/11493.png)"></span>
          <a href="https://adatbank.mlsz.hu/club/67/0/33586/8/328184.html"><h2 class="pointer">PUSKÁS AKADÉMIA FC</h2></a>
        </div>
      </div>
      <div class="content" id="matchContent">
        <table>
          <tr class="template-tr-selectable">
            <td class="match_players_num">
              <a href="https://adatbank.mlsz.hu/player/1212123.html" title="DÁRDAI PÁL"><span class="playerNum">10</span></a>
              <a href='https://adatbank.mlsz.hu/player/512722.html' class='match_players_changeup' title='VÉKONY BENCE ZSOLT'><span class='playerNum'>18</span></a>
            </td>
            <td class="match_players_name">
              <a href="https://adatbank.mlsz.hu/player/1212123.html" title="DÁRDAI PÁL">DÁRDAI PÁL</a>
              <a href='https://adatbank.mlsz.hu/player/512722.html' class='match_players_changeup' title='VÉKONY BENCE ZSOLT'>VÉKONY BENCE ZSOLT</a>
            </td>
            <td class="match_players_cards">
              <span style="background-image: url(https://ada1bank.mlsz.hu/meccs-center/img/timeline/event_swap.png)">77&apos;</span>
              <span style="background-image: url(https://ada1bank.mlsz.hu/meccs-center/img/timeline/event_goal.png)">66&apos;</span>
            </td>
          </tr>
        </table>
        <table class="replacement">
          <tr><td colspan="3" class="match_table_subhead">CSERÉK</td></tr>
          <tr class="template-tr-selectable">
            <td class="match_players_num">
              <a href="https://adatbank.mlsz.hu/player/512722.html" title="VÉKONY BENCE ZSOLT"><span class="playerNum">18</span></a>
              <a href='https://adatbank.mlsz.hu/player/1212123.html' class='match_players_changeup' title='DÁRDAI PÁL'><span class='playerNum'>10</span></a>
            </td>
            <td class="match_players_name">
              <a href="https://adatbank.mlsz.hu/player/512722.html" title="VÉKONY BENCE ZSOLT">VÉKONY BENCE ZSOLT</a>
              <a href='https://adatbank.mlsz.hu/player/1212123.html' class='match_players_changeup' title='DÁRDAI PÁL'>DÁRDAI PÁL</a>
            </td>
            <td class="match_players_cards">
              <span style="background-image: url(https://ada1bank.mlsz.hu/meccs-center/img/timeline/event_swap.png)">77&apos;</span>
            </td>
          </tr>
        </table>
        <table class="replacement coach">
          <tr><td class="match_table_subhead" colspan="2">VEZETŐEDZŐ</td></tr>
          <tr><td class="match_table_coach">BABÓ LEVENTE</td><td class="match_players_cards"></td></tr>
        </table>
        <table class="replacement crew">
          <tr class="toggleHandler"><td class="match_table_subhead closed" colspan="2">STÁBTAGOK</td></tr>
          <tr><td class="match_players_name"><span class="playerNum"></span>SZEMERÉDY KOPPÁNY - Asszisztensedző</td></tr>
          <tr><td class="match_players_name"><span class="playerNum"></span>HAJNAL IMRE ZSOLT - Masszőr</td></tr>
        </table>
      </div>
    </div>
  </div>
</body>
</html>
`;

describe('parseMatchDetail', () => {
  const detail = parseMatchDetail(html, 2186424);

  it('reads the header', () => {
    expect(detail.id).toBe(2186424);
    expect(detail.title).toBe('OTP Bank Liga 8. forduló');
    expect(detail.league).toBe('OTP Bank Liga');
    expect(detail.organizer).toBe('MLSZ');
    expect(detail.venue).toBe('Puskás Akadémia Pancho Aréna');
    expect(detail.kickoff?.getDate()).toBe(18);
    expect(detail.kickoff?.getHours()).toBe(19);
  });

  it('reads the officials', () => {
    expect(detail.officials).toEqual([
      { role: 'Játékvezető', name: 'RÚSZ MÁRTON' },
      { role: 'Asszisztensek', name: 'ALBERT ISTVÁN, VÍGH-TARSONYI GERGŐ' },
    ]);
  });

  it('reads both teams and the score', () => {
    expect(detail.home.name).toBe('PUSKÁS AKADÉMIA FC');
    expect(detail.home.id).toBe(328184);
    expect(detail.home.logo).toBe('https://adatbank.mlsz.hu/img/EgyesuletLogo/Logo/12/11493.png');
    expect(detail.home.form[0].result).toBe('W');
    expect(detail.away.name).toBe('KISPEST–HONVÉD FC');
    expect(detail.score).toEqual({
      full: { home: 3, away: 1 },
      half: { home: 2, away: 1 },
    });
  });

  it('reads the goals and half possession is trackable from score', () => {
    expect(detail.goals).toHaveLength(2);
    expect(detail.goals[0]).toMatchObject({
      order: 0,
      home: true,
      player: 'NÉMETH ANDRÁS',
      playerId: 437842,
      minute: 16,
      ownGoal: false,
      score: { home: 1, away: 0 },
    });
    expect(detail.goals[1]).toMatchObject({
      order: 1,
      home: false,
      player: 'ARUTIUNIAN GEORGII',
      playerId: 1492411,
      minute: 38,
      ownGoal: true,
      score: { home: 2, away: 1 },
    });
  });

  it('reads the timeline', () => {
    expect(detail.timeline).toHaveLength(4);
    expect(detail.timeline[0]).toEqual({ minute: 16, kind: 'goal', home: true, player: 'NÉMETH ANDRÁS' });
    expect(detail.timeline[1]).toEqual({
      minute: 38,
      kind: 'ownGoal',
      home: false,
      player: 'ARUTIUNIAN GEORGII',
    });
    expect(detail.timeline[2]).toEqual({
      minute: 46,
      kind: 'substitution',
      home: false,
      off: 'EDDARRAJ REDA',
      on: 'GARCIA RUIZ PABLO',
    });
    expect(detail.timeline[3]).toEqual({ minute: 41, kind: 'yellowCard', home: true, player: 'ORJÁN ROLAND' });
  });

  it('reads the lineups', () => {
    const home = detail.lineups.home;
    expect(home?.name).toBe('PUSKÁS AKADÉMIA FC');
    expect(home?.coach).toBe('BABÓ LEVENTE');
    expect(home?.crew).toEqual([
      { name: 'SZEMERÉDY KOPPÁNY', role: 'Asszisztensedző' },
      { name: 'HAJNAL IMRE ZSOLT', role: 'Masszőr' },
    ]);

    const [starter] = home?.starters ?? [];
    expect(starter.number).toBe(10);
    expect(starter.name).toBe('DÁRDAI PÁL');
    expect(starter.replacedBy).toMatchObject({ name: 'VÉKONY BENCE ZSOLT', id: 512722 });
    expect(starter.events).toEqual([
      { kind: 'substitution', minute: 77 },
      { kind: 'goal', minute: 66 },
    ]);

    const [sub] = home?.bench ?? [];
    expect(sub.name).toBe('VÉKONY BENCE ZSOLT');
    expect(sub.replaced).toMatchObject({ name: 'DÁRDAI PÁL', id: 1212123 });
  });

  it('keeps the away lineup undefined', () => {
    expect(detail.lineups.away).toBeUndefined();
  });
});
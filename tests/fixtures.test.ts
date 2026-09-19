import { describe, expect, it } from 'vitest';
import { parseFixtures } from '../src/parsers/fixtures.js';

const html = `
<div class="content sorsolas_panel" id="match_panel">
  <div class="schedule_box">
    <div class="schedule ">
      <div class="home_team"><a href="https://adatbank.mlsz.hu/club/67/0/33586/8/328184.html" title="PUSKÁS AKADÉMIA FC"><span>PUSKÁS AKADÉMIA FC</span></a></div>
      <div class="home_logo "><a href="https://adatbank.mlsz.hu/club/67/0/33586/8/328184.html" title="PUSKÁS AKADÉMIA FC" ><img src="https://adatbank.mlsz.hu/img/EgyesuletLogo/Logo/12/11493.png" width="20" /></a></div>
      <div class="result-cont"><a href="https://adatbank.mlsz.hu/match/67/0/33586/8/2186424.html"><div class="result"><span class="schedule-points" data-dv="x">3 - 1</span></div></a></div>
      <div class="away_logo "><a href="https://adatbank.mlsz.hu/club/67/0/33586/8/328182.html" title="KISPEST–HONVÉD FC"><img src="https://adatbank.mlsz.hu/img/EgyesuletLogo/Logo/13/12740.png" width="20" /></a></div>
      <div class="away_team"><a href="https://adatbank.mlsz.hu/club/67/0/33586/8/328182.html" title="KISPEST–HONVÉD FC"><span>KISPEST–HONVÉD FC</span></a></div>
      <div class="team_sorsolas_date">2026. 09. 18. <span> 19:30</span></div>
      <div class="team_sorsolas_arena">Puskás Akadémia Pancho Aréna</div>
    </div>
    <div class="schedule " rel="2222222">
      <div class="home_team"><a href="https://adatbank.mlsz.hu/club/67/0/33586/8/328190.html" title="DVSC"><span>DVSC</span></a></div>
      <div class="home_logo "><a href="https://adatbank.mlsz.hu/club/67/0/33586/8/328190.html" title="DVSC" ><img src="https://adatbank.mlsz.hu/img/EgyesuletLogo/Logo/12/11492.png" width="20" /></a></div>
      <div class="result-cont"><div class="result"><span class="schedule-date" data-dv="x">09. 19.</span><span> 19:30</span></div></div>
      <div class="away_logo "><a href="https://adatbank.mlsz.hu/club/67/0/33586/8/328181.html" title="VASAS FC"><img src="https://adatbank.mlsz.hu/img/EgyesuletLogo/Logo/12/11494.png" width="20" /></a></div>
      <div class="away_team"><a href="https://adatbank.mlsz.hu/club/67/0/33586/8/328181.html" title="VASAS FC"><span>VASAS FC</span></a></div>
      <div class="team_sorsolas_date">2026. 09. 19. <span> 19:30</span></div>
      <div class="team_sorsolas_arena">Debreceni Nagyerdei Stadion</div>
      <div class="match_video_table"><a href="https://youtu.be/abc123" target="_blank" class="match_video"></a></div>
    </div>
  </div>
</div>
`;

describe('parseFixtures', () => {
  const fixtures = parseFixtures(html, '#match_panel .schedule');

  it('parses a played fixture', () => {
    const played = fixtures[0];
    expect(played.state).toBe('played');
    expect(played.score).toEqual({ home: 3, away: 1 });
    expect(played.matchId).toBe(2186424);
    expect(played.home.name).toBe('PUSKÁS AKADÉMIA FC');
    expect(played.home.id).toBe(328184);
    expect(played.away.name).toBe('KISPEST–HONVÉD FC');
    expect(played.kickoff?.getDate()).toBe(18);
    expect(played.kickoff?.getHours()).toBe(19);
    expect(played.venue).toBe('Puskás Akadémia Pancho Aréna');
    expect(played.href).toBe('https://adatbank.mlsz.hu/match/67/0/33586/8/2186424.html');
  });

  it('parses a scheduled fixture', () => {
    const scheduled = fixtures[1];
    expect(scheduled.state).toBe('scheduled');
    expect(scheduled.score).toBeUndefined();
    expect(scheduled.matchId).toBe(2222222);
    expect(scheduled.videoHref).toBe('https://youtu.be/abc123');
  });
});
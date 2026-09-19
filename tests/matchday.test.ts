import { describe, expect, it } from 'vitest';
import { parseMatchDay } from '../src/parsers/matchday.js';

const html = `
<div class="template-bg-white" id="merkozesnap">
  <table id="db_goal_shooter-results-container" width="100%" class="default">
    <thead>
      <tr id="federation0">
        <th colspan="6"><span class="merkozesnap-szervezet">MLSZ</span> OTP Bank Liga</th>
      </tr>
    </thead>
  </table>
  <div class="table-respo-cont">
    <table class="default">
      <tbody>
        <tr>
          <td colspan="6">
            <div class="db_goal_shooter-big-left-margin">
              <table width="100%" class="template-fontsize-12-thin">
                <tbody>
                  <tr>
                    <th>mérkőzés</th><th class="goalShooterG">ford.</th><th class="goalShooterDate">dátum</th><th class="goalShooterG">státusz</th>
                  </tr>
                  <tr>
                    <td>
                      <div class="schedule_box">
                        <div class="schedule">
                          <div class="home_team"><span>KISVÁRDA MASTER GOOD</span></div>
                          <div class="home_logo "><img src="x.png" width="20" /></div>
                          <div class="result-cont">
                            <a href="https://adatbank.mlsz.hu/match/67/0/33586/8/2186420.html">
                              <div class="result"><span class="chedule-info">0 - 1</span></div>
                            </a>
                          </div>
                          <div class="away_logo "><img src="y.png" width="20" /></div>
                          <div class="away_team"><span>PAKSI FC</span></div>
                        </div>
                      </div>
                    </td>
                    <td class="goalShooterG">8</td>
                    <td class="goalShooterDate">2026.09.19 17:00</td>
                    <td class="goalShooterTime">Jegyzőköny<br/>végleges</td>
                  </tr>
                  <tr>
                    <td>
                      <div class="schedule_box">
                        <div class="schedule">
                          <div class="home_team"><span>DVSC</span></div>
                          <div class="home_logo "><img src="x.png" width="20" /></div>
                          <div class="result-cont">
                            <a href="https://adatbank.mlsz.hu/match/67/0/33586/8/2186421.html">
                              <div class="result"><span class="chedule-info"> - </span></div>
                            </a>
                          </div>
                          <div class="away_logo "><img src="y.png" width="20" /></div>
                          <div class="away_team"><span>VASAS FC</span></div>
                        </div>
                      </div>
                    </td>
                    <td class="goalShooterG">8</td>
                    <td class="goalShooterDate">2026.09.19</td>
                    <td class="goalShooterTime">Lezáratlan<br/>mérkőzés</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
`;

describe('parseMatchDay', () => {
  const day = parseMatchDay(html);

  it('reads the league header', () => {
    expect(day.groups).toHaveLength(1);
    expect(day.groups[0].federation).toBe(0);
    expect(day.groups[0].organizer).toBe('MLSZ');
    expect(day.groups[0].league).toBe('OTP Bank Liga');
  });

  it('parses a finalized match', () => {
    const match = day.groups[0].matches[0];
    expect(match.matchId).toBe(2186420);
    expect(match.home.name).toBe('KISVÁRDA MASTER GOOD');
    expect(match.away.name).toBe('PAKSI FC');
    expect(match.score).toEqual({ home: 0, away: 1 });
    expect(match.status).toBe('finalized');
    expect(match.round).toBe(8);
    expect(match.kickoff?.getHours()).toBe(17);
  });

  it('parses an open match with no score', () => {
    const match = day.groups[0].matches[1];
    expect(match.status).toBe('open');
    expect(match.score).toBeUndefined();
    expect(match.matchId).toBe(2186421);
  });
});
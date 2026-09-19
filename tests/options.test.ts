import { describe, expect, it } from 'vitest';
import { parseLeagueOptions } from '../src/parsers/options.js';

const html = `
<html>
  <body>
    <input type="hidden" value="67" id="hiddenEvad" />
    <input type="hidden" value="0" id="hiddenSzervezet" />
    <input type="hidden" value="33586" id="hiddenVerseny" />
    <input type="hidden" value="8" id="hiddenFordulo" />
    <select id="evad">
      <option selected value=67>2026/2027</option>
      <option  value=63>2024/2025</option>
    </select>
    <select id="federations">
      <option value="" disabled>Válasszon</option>
      <option selected value=0>MLSZ</option>
      <option  value=1>Bács-Kiskun</option>
    </select>
    <select id="leagues">
      <option value="-1" disabled>Válasszon</option>
      <option selected value=33586>OTP Bank Liga</option>
    </select>
    <select id="turns">
      <option value="-1" disabled>Válasszon</option>
      <option  value=7>7. forduló</option>
      <option selected value=8>8. forduló</option>
    </select>
  </body>
</html>
`;

describe('parseLeagueOptions', () => {
  const result = parseLeagueOptions(html);

  it('reads the hidden page state', () => {
    expect(result.state).toEqual({ season: 67, federation: 0, league: 33586, round: 8 });
  });

  it('marks selected options', () => {
    expect(result.seasons.find((o) => o.selected)?.value).toBe(67);
    expect(result.rounds.find((o) => o.selected)?.label).toBe('8. forduló');
  });

  it('turns placeholder options into null values', () => {
    expect(result.leagues[0].value).toBeNull();
    expect(result.leagues[0].label).toBe('Válasszon');
    expect(result.federations[0].value).toBeNull();
  });
});
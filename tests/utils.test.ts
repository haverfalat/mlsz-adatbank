import { describe, expect, it } from 'vitest';
import { parseDate, parseTime, withTime } from '../src/utils/dates.js';
import { bgImage } from '../src/utils/image.js';
import { trailingNumber } from '../src/utils/ids.js';
import { parseScore } from '../src/utils/scores.js';
import { int, norm } from '../src/utils/text.js';

describe('text', () => {
  it('collapses whitespace and nbsp', () => {
    expect(norm('PUSKÁS\u00a0AKADÉMIA\u00a0FC')).toBe('PUSKÁS AKADÉMIA FC');
    expect(norm(' KISPEST–HONVÉD FC  ')).toBe('KISPEST–HONVÉD FC');
    expect(norm('Jegyzőköny\nvégleges')).toBe('Jegyzőköny végleges');
  });

  it('extracts the first integer', () => {
    expect(int('8')).toBe(8);
    expect(int(' 38&apos;')).toBe(38);
    expect(int('abc')).toBeUndefined();
    expect(int('-3')).toBe(-3);
  });
});

describe('dates', () => {
  it('parses hungarian dates', () => {
    const date = parseDate('2026. 09. 18.');
    expect(date?.getFullYear()).toBe(2026);
    expect(date?.getMonth()).toBe(8);
    expect(date?.getDate()).toBe(18);
  });

  it('parses digit-separated dates', () => {
    const date = parseDate('2026.09.19 17:00');
    expect(date?.getDate()).toBe(19);
  });

  it('combines date and time', () => {
    const kickoff = withTime(parseDate('2026. 09. 18.'), parseTime(' 19:30'));
    expect(kickoff?.getHours()).toBe(19);
    expect(kickoff?.getMinutes()).toBe(30);
  });
});

describe('scores', () => {
  it('parses a played score', () => {
    expect(parseScore('3 - 1')).toEqual({ home: 3, away: 1 });
  });

  it('rejects empty scores', () => {
    expect(parseScore(' - ')).toBeNull();
    expect(parseScore('')).toBeNull();
  });
});

describe('ids', () => {
  it('grabs the trailing number', () => {
    expect(trailingNumber('https://adatbank.mlsz.hu/match/2186424.html')).toBe(2186424);
    expect(trailingNumber('/club/67/0/33586/8/328184.html')).toBe(328184);
    expect(trailingNumber('OTP Bank Liga 8')).toBe(8);
    expect(trailingNumber('no numbers here')).toBeUndefined();
  });
});

describe('image', () => {
  it('extracts background url', () => {
    expect(bgImage("background-image:url(https://adatbank.mlsz.hu/img/SzemelyFoto/Foto/1803/1802438.png)")).toBe(
      'https://adatbank.mlsz.hu/img/SzemelyFoto/Foto/1803/1802438.png',
    );
  });
});
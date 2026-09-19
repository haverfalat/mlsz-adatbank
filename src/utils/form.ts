import type { Cheerio } from '../utils/html.js';
import type { FormChip, FormResult } from '../domain/standings.js';
import { trailingNumber } from './ids.js';
import { norm } from './text.js';

const FORM_BY_TEXT: Record<string, FormResult> = {
  GY: 'W',
  V: 'L',
  D: 'D',
};

export function readFormAnchor(a: Cheerio): FormChip | null {
  const result = FORM_BY_TEXT[norm(a.find('div').text())];
  if (!result) {
    return null;
  }
  return {
    result,
    matchId: trailingNumber(a.attr('href')),
    description: norm(a.find('div').attr('title')) || undefined,
  };
}
import { Scored } from '../domain/common.js';
import { norm } from './text.js';

export function parseScore(value?: string | null): Scored | null {
  const match = norm(value).match(/(-?\d+)\s*-\s*(-?\d+)/);
  if (!match) {
    return null;
  }
  return {
    home: parseInt(match[1], 10),
    away: parseInt(match[2], 10),
  };
}
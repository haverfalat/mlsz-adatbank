import { norm } from './text.js';

export function parseDate(value?: string | null): Date | undefined {
  const match = norm(value).match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
  if (!match) {
    return undefined;
  }
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function parseTime(value?: string | null): string | undefined {
  const match = norm(value).match(/(\d{1,2}):(\d{2})/);
  if (!match) {
    return undefined;
  }
  return `${match[1].padStart(2, '0')}:${match[2]}`;
}

export function withTime(date: Date | undefined, time?: string | null): Date | undefined {
  if (!date) {
    return undefined;
  }
  const result = new Date(date);
  const match = (time ?? '').trim().match(/^(\d{1,2}):(\d{2})$/);
  if (match) {
    result.setHours(Number(match[1]), Number(match[2]), 0, 0);
  }
  return result;
}
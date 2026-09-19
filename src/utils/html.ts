import { load } from 'cheerio';
import type { Cheerio as CheerioInstance, CheerioAPI } from 'cheerio';
import type { AnyNode } from 'domhandler';

export type { CheerioAPI };
export type Cheerio = CheerioInstance<AnyNode>;

export function parseHtml(html: string): CheerioAPI {
  return load(html);
}
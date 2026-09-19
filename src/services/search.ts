import { SearchResults } from '../domain/search.js';
import { parseSearchResults } from '../parsers/search.js';
import { AdatbankHttp } from '../http/client.js';

export class SearchService {
  constructor(
    private readonly http: AdatbankHttp,
    private readonly meccsCenterUrl: string,
  ) {}

  async search(query: string): Promise<SearchResults> {
    const url = `${this.meccsCenterUrl}/search?searchText=${encodeURIComponent(query)}`;
    return parseSearchResults(await this.http.getText(url), query);
  }
}
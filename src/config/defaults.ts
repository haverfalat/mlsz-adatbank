export interface ClientConfig {
  baseUrl: string;
  meccsCenterUrl: string;
  timeoutMs: number;
  retries: number;
  headers: Record<string, string>;
  fetchFn: typeof fetch;
}

interface ConfigOverrides {
  baseUrl?: string;
  meccsCenterUrl?: string;
  timeoutMs?: number;
  retries?: number;
  headers?: Record<string, string>;
  fetchFn?: typeof fetch;
}

export const DEFAULT_CONFIG: ClientConfig = {
  baseUrl: 'https://adatbank.mlsz.hu',
  meccsCenterUrl: 'https://ada1bank.mlsz.hu',
  timeoutMs: 15000,
  retries: 2,
  headers: {
    'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36',
    'accept-language': 'hu-HU,hu;q=0.9,en;q=0.8',
  },
  fetchFn: fetch,
};

export function resolveConfig(overrides: ConfigOverrides = {}): ClientConfig {
  return {
    ...DEFAULT_CONFIG,
    ...overrides,
    headers: {
      ...DEFAULT_CONFIG.headers,
      ...overrides.headers,
    },
  };
}
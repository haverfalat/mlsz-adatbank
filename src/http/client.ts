import { ClientConfig } from '../config/defaults.js';

export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

export class AdatbankHttp {
  private readonly config: ClientConfig;

  constructor(config: ClientConfig) {
    this.config = config;
  }

  async getText(url: string, params: Record<string, string | number | undefined> = {}): Promise<string> {
    const target = this.targetUrl(url, params);
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.config.retries; attempt++) {
      if (attempt > 0) {
        await delay(200 * attempt);
      }

      try {
        const response = await this.timeoutFetch(target);
        if (!response.ok) {
          throw new HttpError(response.status, `${response.status} for ${target}`);
        }
        return await response.text();
      } catch (err) {
        lastError = toError(err);
        if (this.config.retries === 0 || !retryable(lastError, attempt)) {
          throw lastError;
        }
      }
    }

    throw lastError ?? new Error(`no response for ${target}`);
  }

  private targetUrl(url: string, params: Record<string, string | number | undefined>): string {
    const query = Object.entries(params)
      .filter((entry): entry is [string, string | number] => entry[1] !== undefined)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');

    if (!query.length) {
      return url;
    }

    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}${query}`;
  }

  private async timeoutFetch(url: string): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);

    try {
      return await this.config.fetchFn(url, {
        headers: this.config.headers,
        redirect: 'follow',
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }
  }
}

function retryable(err: HttpError | Error, attempt: number): boolean {
  if (err instanceof HttpError) {
    return err.status >= 500;
  }
  return err.name === 'AbortError' || err.name === 'TypeError' || attempt < 1;
}

function toError(err: unknown): Error {
  return err instanceof Error ? err : new Error(String(err));
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
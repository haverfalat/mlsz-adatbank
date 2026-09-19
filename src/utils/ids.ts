export function trailingNumber(value?: string | null): number | undefined {
  const match = (value ?? '').match(/(\d+)\D*$/);
  return match ? parseInt(match[1], 10) : undefined;
}
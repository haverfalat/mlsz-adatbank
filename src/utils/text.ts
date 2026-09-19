export function norm(value?: string | null): string {
  if (value == null) {
    return '';
  }
  return value.replace(/[\s\u00a0]+/g, ' ').trim();
}

export function int(value?: string | null): number | undefined {
  const match = (value ?? '').match(/-?\d+/);
  return match ? parseInt(match[0], 10) : undefined;
}
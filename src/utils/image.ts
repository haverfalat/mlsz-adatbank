export function bgImage(style?: string | null): string | undefined {
  const match = (style ?? '').match(/url\(['"]?(.*?)['"]?\)/);
  return match ? match[1] : undefined;
}
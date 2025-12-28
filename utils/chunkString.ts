export function chunkString(str: string, n: number, acc: string[]): string[] {
  if (str.length === 0) return acc;

  acc.push(str.substring(0, n));
  return chunkString(str.substring(n), n, acc);
}

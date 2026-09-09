const G = 'en-US';

export function int(n: number): string {
  return Math.round(n).toLocaleString(G);
}

export function dec(n: number, dp = 2): string {
  return n.toLocaleString(G, { minimumFractionDigits: dp, maximumFractionDigits: dp });
}

/**
 * Fixed decimals, always. Scientific notation is never shown to a reader: a
 * price of 0.00001607 is written out, with enough places to keep four
 * significant figures.
 */
export function fixed(n: number, sig = 4): string {
  if (!Number.isFinite(n)) return '0';
  const a = Math.abs(n);
  if (a === 0) return '0';
  if (a >= 1000) return int(n);
  if (a >= 1) return dec(n, 2);
  const exp = Math.floor(Math.log10(a));
  const places = Math.min(12, Math.max(2, -exp + sig - 1));
  return n.toFixed(places);
}

/** Compact with a fixed mantissa so a column never jumps width. */
export function compact(n: number): string {
  const a = Math.abs(n);
  if (a >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (a >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (a >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toFixed(0);
}

export function eth(n: number, dp = 2): string {
  return `${dec(n, dp)} ETH`;
}

export function pct(n: number, dp = 2): string {
  return `${(n * 100).toFixed(dp)}%`;
}

export function signedEth(n: number, dp = 2): string {
  return `${n >= 0 ? '+' : '-'}${dec(Math.abs(n), dp)} ETH`;
}

export function signed(n: number, dp = 2): string {
  return `${n >= 0 ? '+' : '-'}${dec(Math.abs(n), dp)}`;
}

export function price(n: number): string {
  return fixed(n, 4);
}

export function ozs(n: number): string {
  return `${dec(n, 2)} OZ`;
}

/**
 * One epoch is one day, so there is only ever one counter. An event at hour h
 * belongs to epoch floor((h - 1) / 24) + 1, and the hour shown is its position
 * inside that epoch.
 */
export function stamp(epoch: number, hour: number): string {
  const h = hour <= 0 ? 0 : ((hour - 1) % 24) + 1;
  return `E${pad4(epoch)} ${String(h).padStart(2, '0')}H`;
}

export function pad4(n: number): string {
  return String(n).padStart(4, '0');
}

export type FormatKind =
  | 'int'
  | 'compact'
  | 'dec'
  | 'dec1'
  | 'dec3'
  | 'eth'
  | 'eth3'
  | 'pct'
  | 'pct1'
  | 'signedEth'
  | 'signed'
  | 'price'
  | 'ozs'
  | 'mult';

export const FORMATTERS: Record<FormatKind, (n: number) => string> = {
  int,
  compact,
  dec: (n) => dec(n, 2),
  dec1: (n) => dec(n, 1),
  dec3: (n) => dec(n, 3),
  eth: (n) => eth(n, 2),
  eth3: (n) => eth(n, 3),
  pct: (n) => pct(n, 2),
  pct1: (n) => pct(n, 1),
  signedEth: (n) => signedEth(n, 2),
  signed: (n) => signed(n, 2),
  price,
  ozs,
  mult: (n) => `${n.toFixed(2)}x`,
};

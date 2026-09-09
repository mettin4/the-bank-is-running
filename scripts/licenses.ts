/** Does the license auction ever fail to clear, and how varied is the day. */
import { Engine } from '../src/engine/engine';

const e = new Engine(20260909);
e.replay(40);

const buckets = new Map<string, number>();
const byRegime = new Map<string, { n: number; sold: number }>();
const rows: string[] = [];

for (let ep = 0; ep < 100; ep++) {
  for (let h = 0; h < 24; h++) e.step();
  const r = e.epochs[e.epochs.length - 1];
  const sold = r.licensesSold;
  const b =
    sold >= 100
      ? '100 sellout'
      : sold >= 90
        ? ' 90-99'
        : sold >= 70
          ? ' 70-89'
          : sold >= 40
            ? ' 40-69'
            : sold >= 10
              ? ' 10-39'
              : '  0-9';
  buckets.set(b, (buckets.get(b) ?? 0) + 1);
  const g = byRegime.get(r.regime) ?? { n: 0, sold: 0 };
  g.n += 1;
  g.sold += sold;
  byRegime.set(r.regime, g);
  if (ep % 10 === 0) {
    rows.push(
      `  E${String(r.epoch).padStart(4, '0')}  ${r.regime === 'EXPANSION' ? 'EXP' : 'CON'}  m=${r.m.toFixed(2)}  sold=${String(sold).padStart(3)}  branches=${String(r.branches).padStart(5)}`,
    );
  }
}

console.log('sample epochs:');
console.log(rows.join('\n'));

console.log('\nlicenses sold per day, over 100 epochs:');
for (const [k, v] of [...buckets].sort()) {
  console.log(`  ${String(v).padStart(3)}  ${k}`);
}

console.log('\nmean sold by regime:');
for (const [k, v] of byRegime) {
  console.log(`  ${k.padEnd(12)} ${(v.sold / v.n).toFixed(1)} over ${v.n} epochs`);
}

console.log(`\nfinal branches ${e.totalBranches}, charters live ${e.charters.length - e.chartersBurned}`);

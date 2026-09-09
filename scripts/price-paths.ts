/**
 * Price path across many seeds, measured from the point a visitor actually
 * lands on: the app replays 40 epochs before the first paint, so the price a
 * page load starts from is the price at epoch 40, not at genesis.
 *
 * Answers one question: is the long run direction decided by the market regime,
 * or is it the same whatever the regime does.
 *
 *   npm run prices
 */
import { Engine } from '../src/engine/engine';
import { GOLD_ETH_PER_OZ } from '../src/engine/constants';
import { PRERUN_EPOCHS } from '../src/engine/store';

const SEEDS = [
  20260909, 1, 7, 42, 101, 555, 777, 1234, 2024, 3141,
  4242, 5555, 6180, 7777, 8888, 9001, 12345, 31337, 65535, 99991,
];
const EPOCHS = 150;

interface Row {
  seed: number;
  genesis: number;
  start: number;
  end: number;
  min: number;
  max: number;
  ratio: number;
  drawFromPeak: number;
  expEpochs: number;
  poolEthStart: number;
  poolEthEnd: number;
  teamEth: number;
  reserveEth: number;
  polEth: number;
  circStart: number;
  circEnd: number;
  poolStdStart: number;
  poolStdEnd: number;
}

const rows: Row[] = [];

for (const seed of SEEDS) {
  const e = new Engine(seed);
  const genesis = e.pool.eth / e.pool.std;
  e.replay(PRERUN_EPOCHS);

  const start = e.pool.eth / e.pool.std;
  const poolEthStart = e.pool.eth;
  const poolStdStart = e.pool.std;
  const circStart = e.circulating;
  const teamStart = e.teamEth;
  const reserveStart = e.reserveOz * GOLD_ETH_PER_OZ;
  const polStart = e.polEth;

  let min = start;
  let max = start;
  let expEpochs = 0;

  for (let ep = 0; ep < EPOCHS; ep++) {
    for (let h = 0; h < 24; h++) {
      e.step();
      const p = e.pool.eth / e.pool.std;
      if (p < min) min = p;
      if (p > max) max = p;
    }
    if ((e.epochs[e.epochs.length - 1]?.netFlow ?? 0) > 0) expEpochs++;
  }

  const end = e.pool.eth / e.pool.std;
  rows.push({
    seed,
    genesis,
    start,
    end,
    min,
    max,
    ratio: end / start,
    drawFromPeak: end / max,
    expEpochs,
    poolEthStart,
    poolEthEnd: e.pool.eth,
    poolStdStart,
    poolStdEnd: e.pool.std,
    teamEth: e.teamEth - teamStart,
    reserveEth: e.reserveOz * GOLD_ETH_PER_OZ - reserveStart,
    polEth: e.polEth - polStart,
    circStart,
    circEnd: e.circulating,
  });
}

const f = (n: number) => n.toFixed(9);
const mean = (xs: Row[], get: (r: Row) => number) => xs.reduce((a, r) => a + get(r), 0) / xs.length;
const geo = (xs: Row[], get: (r: Row) => number) =>
  Math.exp(xs.reduce((a, r) => a + Math.log(get(r)), 0) / xs.length);

console.log(`${SEEDS.length} seeds  x  ${EPOCHS} epochs, measured from epoch ${PRERUN_EPOCHS} (what a page load starts on)\n`);
console.log('   seed        start          end          min          max     end/start   end/peak  EXP epochs');
console.log('  ' + '-'.repeat(103));
for (const r of rows) {
  console.log(
    `  ${String(r.seed).padStart(8)}  ${f(r.start)}  ${f(r.end)}  ${f(r.min)}  ${f(r.max)}  ` +
      `${r.ratio.toFixed(3).padStart(8)}x ${r.ratio >= 1 ? 'UP  ' : 'DOWN'}  ${r.drawFromPeak.toFixed(2).padStart(5)}x   ${String(r.expEpochs).padStart(3)}/${EPOCHS}`,
  );
}

const up = rows.filter((r) => r.ratio >= 1).length;
const ratios = rows.map((r) => r.ratio).sort((a, b) => a - b);

console.log('\nsummary');
console.log(`  ended up             ${up}/${rows.length}`);
console.log(`  ended down           ${rows.length - up}/${rows.length}`);
console.log(`  median end/start     ${ratios[Math.floor(ratios.length / 2)].toFixed(3)}x`);
console.log(`  geometric mean       ${geo(rows, (r) => r.ratio).toFixed(3)}x`);
console.log(`  best / worst         ${ratios[ratios.length - 1].toFixed(3)}x / ${ratios[0].toFixed(3)}x`);
console.log(`  mean end/peak        ${geo(rows, (r) => r.drawFromPeak).toFixed(3)}x`);

// Correlation between how expansionary the run was and where it ended.
const xs = rows.map((r) => r.expEpochs);
const ys = rows.map((r) => Math.log(r.ratio));
const mx = xs.reduce((a, b) => a + b, 0) / xs.length;
const my = ys.reduce((a, b) => a + b, 0) / ys.length;
const cov = xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0);
const sx = Math.sqrt(xs.reduce((a, x) => a + (x - mx) ** 2, 0));
const sy = Math.sqrt(ys.reduce((a, y) => a + (y - my) ** 2, 0));
console.log(`
  correlation(EXP epochs, log end/start)  r = ${(cov / (sx * sy)).toFixed(3)}`);

const sorted = [...rows].sort((a, b) => a.expEpochs - b.expEpochs);
const low = sorted.slice(0, 7);
const high = sorted.slice(-7);
const spread = geo(high, (r) => r.ratio) / geo(low, (r) => r.ratio);
console.log('\nregime dependence  (the point of the exercise)');
console.log(`  most bearish 7 seeds   ${mean(low, (r) => r.expEpochs).toFixed(1)} EXP epochs  ->  ${geo(low, (r) => r.ratio).toFixed(3)}x`);
console.log(`  most bullish 7 seeds   ${mean(high, (r) => r.expEpochs).toFixed(1)} EXP epochs  ->  ${geo(high, (r) => r.ratio).toFixed(3)}x`);
console.log(`  bullish / bearish      ${spread.toFixed(2)}x  ${spread > 1.6 ? '(regime decides)' : '(regime barely matters)'}`);

console.log('\nwhere the pool went, averaged over the window');
console.log(`  pool ETH        ${mean(rows, (r) => r.poolEthStart).toFixed(1)}  ->  ${mean(rows, (r) => r.poolEthEnd).toFixed(1)}`);
console.log(`  pool $STANDARD  ${(mean(rows, (r) => r.poolStdStart) / 1e6).toFixed(2)}M  ->  ${(mean(rows, (r) => r.poolStdEnd) / 1e6).toFixed(2)}M`);
console.log(`  drained to gold ${mean(rows, (r) => r.reserveEth).toFixed(1)} ETH`);
console.log(`  drained to team ${mean(rows, (r) => r.teamEth).toFixed(1)} ETH`);
console.log(`  added as POL    ${mean(rows, (r) => r.polEth).toFixed(1)} ETH`);
console.log(`  circulating     ${(mean(rows, (r) => r.circStart) / 1e6).toFixed(2)}M  ->  ${(mean(rows, (r) => r.circEnd) / 1e6).toFixed(2)}M`);

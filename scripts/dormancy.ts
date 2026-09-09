/**
 * Dormancy budget check. Runs the economy the way the app does, then reports
 * revocations per seven epoch window across 100 epochs.
 *
 *   npm run dormancy
 */
import { Engine } from '../src/engine/engine';
import { GENESIS_CHARTERS } from '../src/engine/constants';

const PRERUN = 40;
const EPOCHS = 100;
const WINDOW = 7;

const e = new Engine(20260909);
e.replay(PRERUN);

const atStart = e.revocations;
const perEpoch: number[] = [];

for (let i = 0; i < EPOCHS; i++) {
  const before = e.revocations;
  for (let h = 0; h < 24; h++) e.step();
  perEpoch.push(e.revocations - before);
}

const total = e.revocations - atStart;
const ghosts = e.charters.filter((c) => Number.isFinite(c.goesDarkAt)).length;

console.log(`seed 20260909  ·  ${PRERUN} epoch prerun  ·  ${EPOCHS} epochs measured\n`);
console.log(`agents that can ever go dormant: ${ghosts} of ${GENESIS_CHARTERS} (${((ghosts / GENESIS_CHARTERS) * 100).toFixed(1)}%)`);
console.log(`revocations over ${EPOCHS} epochs: ${total}\n`);

console.log('revocations per 7 epoch window:');
let worst = 0;
let bad = 0;
for (let w = 0; w * WINDOW < EPOCHS; w++) {
  const slice = perEpoch.slice(w * WINDOW, (w + 1) * WINDOW);
  const n = slice.reduce((a, b) => a + b, 0);
  const from = PRERUN + w * WINDOW + 1;
  const to = from + slice.length - 1;
  worst = Math.max(worst, n);
  if (n > 3) bad++;
  console.log(
    `  E${String(from).padStart(4, '0')}-E${String(to).padStart(4, '0')}  ${String(n).padStart(2)}  ${'|'.repeat(n)}${n > 3 ? '  OVER BUDGET' : ''}`,
  );
}

console.log('');
const checks: [string, boolean, string][] = [
  ['every window 0-3', bad === 0, `worst window ${worst}, ${bad} over budget`],
  ['total under 50', total < 50, `${total} revocations`],
  ['dormant slice 3-5%', ghosts >= 30 && ghosts <= 50, `${ghosts}/1000`],
];
let failed = 0;
for (const [label, ok, detail] of checks) {
  if (!ok) failed++;
  console.log(`${ok ? ' ok ' : 'FAIL'}  ${label.padEnd(20)} ${detail}`);
}
process.exit(failed > 0 ? 1 : 0);

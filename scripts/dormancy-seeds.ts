/** The dormancy budget must hold across seeds, not just the shipped one. */
import { Engine } from '../src/engine/engine';

const SEEDS = [20260909, 1, 7, 42, 555, 4242, 99991];
let bad = 0;

for (const seed of SEEDS) {
  const e = new Engine(seed);
  e.replay(40);
  const per: number[] = [];
  for (let i = 0; i < 100; i++) {
    const b = e.revocations;
    for (let h = 0; h < 24; h++) e.step();
    per.push(e.revocations - b);
  }
  let worst = 0;
  for (let w = 0; w * 7 < 100; w++) {
    const n = per.slice(w * 7, w * 7 + 7).reduce((a, x) => a + x, 0);
    worst = Math.max(worst, n);
  }
  const total = per.reduce((a, x) => a + x, 0);
  const ghosts = e.charters.filter((c) => Number.isFinite(c.goesDarkAt)).length;
  const ok = worst <= 3 && total < 50 && ghosts === 40;
  if (!ok) bad++;
  console.log(`${ok ? " ok " : "FAIL"}  seed ${String(seed).padStart(8)}  ghosts ${ghosts}  total ${String(total).padStart(3)}  worst window ${worst}`);
}
process.exit(bad > 0 ? 1 : 0);

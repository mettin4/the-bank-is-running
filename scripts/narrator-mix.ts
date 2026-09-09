/** How varied is the narrator, and what does the 40 epoch replay actually cost. */
import { Engine } from '../src/engine/engine';
import { narrate } from '../src/engine/narrator';

const e = new Engine(20260909);
const t0 = Date.now();
e.replay(40);
const prerun = Date.now() - t0;

const counts = new Map<string, number>();
const stress = new Map<string, number>();
let samples = 0;

for (let i = 0; i < 200 * 24; i++) {
  e.step();
  if (i % 12 !== 0) continue;
  const s = e.snapshot(true, 1);
  const line = narrate(s);
  counts.set(line, (counts.get(line) ?? 0) + 1);
  stress.set(s.stress, (stress.get(s.stress) ?? 0) + 1);
  samples++;
}

console.log(`prerun of 40 epochs: ${prerun} ms`);
console.log('\nstress distribution:');
for (const [k, v] of [...stress].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${((v / samples) * 100).toFixed(1).padStart(5)}%  ${k}`);
}
console.log('\nnarrator lines:');
for (const [k, v] of [...counts].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${((v / samples) * 100).toFixed(1).padStart(5)}%  ${k.slice(0, 84)}`);
}

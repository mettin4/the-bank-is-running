/**
 * Headless soak run. Drives the economy for a long stretch and reports whether
 * every mechanic in the whitepaper actually fires, and how often. Used to tune
 * the economy until it looks alive rather than flat.
 *
 *   npm run sim
 */
import { Engine } from '../src/engine/engine';

const EPOCHS = Number(process.argv[2] ?? 160);
const SEED = Number(process.argv[3] ?? 20260909);

const e = new Engine(SEED);

let maxDrift = 0;
let cuts = 0;
let raises = 0;
let flips = 0;
let contractionEpochs = 0;
let peakFee = 0;
let peakPressure = 0;
let mPeak = 0;
let mTrough = 99;
let runs = 0;
let runHours = 0;
let wasRunning = false;
let prevRegime = e.regime;

const rows: string[] = [];

for (let epoch = 0; epoch < EPOCHS; epoch++) {
  const mBefore = e.m;
  for (let h = 0; h < 24; h++) {
    e.step();
    maxDrift = Math.max(maxDrift, e.identityDrift());
    peakFee = Math.max(peakFee, e.resolutionFeeNow);
    peakPressure = Math.max(peakPressure, e.exitPressureNow);
    if (e.regime !== prevRegime) {
      flips++;
      prevRegime = e.regime;
    }
    if (e.run) {
      runHours++;
      if (!wasRunning) runs++;
    }
    wasRunning = e.run;
  }
  if (e.m < mBefore) cuts++;
  if (e.m > mBefore) raises++;
  if (e.regime === 'CONTRACTION') contractionEpochs++;
  mPeak = Math.max(mPeak, e.m);
  mTrough = Math.min(mTrough, e.m);

  if (epoch % 10 === 0 || epoch === EPOCHS - 1) {
    rows.push(
      [
        String(e.epoch - 1).padStart(4, '0'),
        e.regime === 'EXPANSION' ? 'EXP' : 'CON',
        `m=${e.m.toFixed(2)}`,
        `flow=${e.epochs.at(-1)?.netFlow.toFixed(2).padStart(8)}`,
        `br=${String(e.totalBranches).padStart(5)}`,
        `px=${e.epochs.at(-1)?.price.toExponential(3)}`,
        `burn=${fmtM(e.burns)}`,
        `circ=${fmtM(e.circulating)}`,
        `gold=${e.reserveOz.toFixed(1)}oz`,
        `fee=${(e.resolutionFeeNow * 100).toFixed(2)}%`,
      ].join('  '),
    );
  }
}

function fmtM(n: number) {
  return `${(n / 1e6).toFixed(2)}M`;
}

console.log(`\nTHE BANK IS RUNNING  ·  soak  ·  ${EPOCHS} epochs  ·  seed ${SEED}\n`);
console.log(rows.join('\n'));

console.log('\n--- mechanics ---');
const checks: [string, boolean, string][] = [
  ['supply identity holds', maxDrift < 1e-6, `max drift ${maxDrift.toExponential(2)}`],
  ['rate cuts fired', cuts > 0, `${cuts} epochs`],
  ['rate raises earned', raises > 0, `${raises} epochs`],
  ['multiplier travelled', mPeak - mTrough > 0.3, `${mTrough.toFixed(2)} to ${mPeak.toFixed(2)}`],
  ['vault flips', flips > 2, `${flips} flips`],
  ['contraction epochs', contractionEpochs > EPOCHS * 0.15, `${contractionEpochs}/${EPOCHS}`],
  ['license burns', e.burnLicense > 0, fmtM(e.burnLicense)],
  ['buyback burns', e.burnBuyback > 0, fmtM(e.burnBuyback)],
  ['resolution burns', e.burnResolution > 0, fmtM(e.burnResolution)],
  ['revocation burns', e.burnRevocation > 0, fmtM(e.burnRevocation)],
  ['stayers paid', e.redistributed > 0, fmtM(e.redistributed)],
  ['hard reserve', e.reserveOz > 0, `${e.reserveOz.toFixed(1)} oz`],
  ['POL only grows', e.polEth > 0, `${e.polEth.toFixed(2)} ETH`],
  ['branches expanded', e.totalBranches > 1000, String(e.totalBranches)],
  ['charters dissolved', e.chartersBurned > 0, String(e.chartersBurned)],
  ['runs emerged', runs > 0, `${runs} runs over ${runHours} hours`],
  ['exit spike seen', peakFee > 0.02, `peak fee ${(peakFee * 100).toFixed(2)}% at pressure ${(peakPressure * 100).toFixed(1)}%`],
];

let failed = 0;
for (const [label, ok, detail] of checks) {
  if (!ok) failed++;
  console.log(`${ok ? ' ok ' : 'FAIL'}  ${label.padEnd(24)} ${detail}`);
}

console.log('\n--- balance sheet ---');
console.log(`circulating      ${e.circulating.toLocaleString('en-US', { maximumFractionDigits: 0 })}`);
console.log(`max supply       ${e.maxSupply.toLocaleString('en-US', { maximumFractionDigits: 0 })}`);
console.log(`issued (ledger)  ${e.issued.toLocaleString('en-US', { maximumFractionDigits: 0 })}`);
console.log(`held at bank     ${e.ledgerHeld.toLocaleString('en-US', { maximumFractionDigits: 0 })}`);
console.log(`pool             ${e.pool.eth.toFixed(2)} ETH / ${e.pool.std.toLocaleString('en-US', { maximumFractionDigits: 0 })}`);
console.log(`fees collected   ${e.feeEthTotal.toFixed(2)} ETH`);
console.log(`charters live    ${e.charters.length - e.chartersBurned}  branches ${e.totalBranches}`);

process.exit(failed > 0 ? 1 : 0);

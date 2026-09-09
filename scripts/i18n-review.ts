/**
 * Side by side EN / zh dump of every user facing string, for external review.
 *
 *   npm run i18n:review > i18n-review.md
 */
import { en, enAssumed, enEvents } from '../src/i18n/en';
import { zh, zhAssumed, zhEvents } from '../src/i18n/zh';
import type { EventArgs, EventKey } from '../src/engine/events';

const cell = (s: string) => s.replace(/\|/g, '\\|').replace(/\n/g, ' ');

console.log('# EN / 中文 review\n');

const keys = Object.keys(en) as (keyof typeof en)[];
console.log(`## UI strings (${keys.length})\n`);
console.log('| key | EN | 中文 |');
console.log('|---|---|---|');
for (const k of keys) console.log(`| \`${k}\` | ${cell(en[k])} | ${cell(zh[k])} |`);

/** One representative set of numbers, so both renderers produce a full line. */
const SAMPLE: { [K in EventKey]: EventArgs[K] } = {
  genesisSeeded: {},
  foundingCharters: { n: 1000 },
  marketRegime: { sentiment: 'CAPITULATION' },
  runStarting: {},
  runSubsided: {},
  buybackTick: { amount: 7520 },
  charterSold: { id: 1042, eth: 0.184 },
  charterDissolved: { id: 376, amount: 41230 },
  charterRetired: { id: 817, branches: 2, amount: 12480, feeRate: 0.0673 },
  charterRevoked: { id: 858, days: 30, branches: 10 },
  feeRoutingFlipped: { regime: 'CONTRACTION' },
  rateCut: { from: 0.35, to: 0.2, signal: -3.34 },
  rateRaise: { from: 0.3, to: 0.35, signal: 12.7 },
  reserveAdded: { oz: 4.12, eth: 3.58 },
  epochClosed: { epoch: 41, netFlow: -1.35 },
  licenseAuctionClosed: { sold: 95, cap: 100, last: 48 },
  resolutionFeeHigh: { feeRate: 0.1246 },
};

const evKeys = Object.keys(SAMPLE) as EventKey[];
console.log(`\n## Event templates (${evKeys.length})\n`);
console.log('| event | EN | 中文 |');
console.log('|---|---|---|');
for (const k of evKeys) {
  const e = (enEvents[k] as (a: unknown) => string)(SAMPLE[k]);
  const z = (zhEvents[k] as (a: unknown) => string)(SAMPLE[k]);
  console.log(`| \`${k}\` | ${cell(e)} | ${cell(z)} |`);
}

const aKeys = Object.keys(enAssumed) as (keyof typeof enAssumed)[];
console.log(`\n## Assumed parameters (${aKeys.length})\n`);
console.log('| id | EN label | 中文 label | EN note | 中文 note |');
console.log('|---|---|---|---|---|');
for (const k of aKeys) {
  console.log(
    `| \`${k}\` | ${cell(enAssumed[k].label)} | ${cell(zhAssumed[k].label)} | ${cell(enAssumed[k].note)} | ${cell(zhAssumed[k].note)} |`,
  );
}

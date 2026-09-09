/**
 * Parameters for The Standard Reserve, whitepaper v0.1.
 *
 * SPEC values are stated in the whitepaper and are not negotiable.
 * ASSUMED values are redacted in the published document ("values redacted until
 * launch"). They are reasoned placeholders, surfaced in the UI under
 * ASSUMED PARAMETERS so nothing here is mistaken for protocol truth.
 */

/* ---------------------------------------------------------------- SPEC ---- */

export const HARD_CAP = 1_000_000_000;
export const GENESIS_POL = 100_000_000;
export const ISSUANCE_BUDGET = HARD_CAP - GENESIS_POL; // 900,000,000

export const GENESIS_CHARTERS = 1_000;
export const MAX_BRANCHES_PER_CHARTER = 10;

export const FEE_SPLIT_VAULT = 0.7;
export const FEE_SPLIT_POL = 0.15;
export const FEE_SPLIT_TEAM = 0.15;

export const M_FLOOR = 0.2;
export const M_CEILING = 1.25;

export const LICENSES_PER_DAY = 100;
export const LICENSES_PER_CHARTER_PER_DAY = 3;
export const LICENSE_OPEN_MULTIPLE = 2; // 2x yesterday's last sale
export const CHARTER_OPEN_MULTIPLE = 3; // 3x yesterday's last sale
export const LICENSE_FLOOR_DAYS_OF_YIELD = 2;

export const BUYBACK_VAULT_FRACTION = 0.1; // 10% of vault balance per hourly tick
export const BUYBACK_POOL_FRACTION = 0.002; // 0.2% of pool ETH reserves per tick

export const DORMANCY_DAYS = 30;
export const DORMANCY_BOUNTY_RATE = 0.02;
export const DORMANCY_BOUNTY_CAP = 100_000;
export const REVOCATION_FEE_RATE = 0.7;

export const RESOLUTION_WINDOW_DAYS = 7;

/* ------------------------------------------------------------- ASSUMED ---- */

export const HOURS_PER_EPOCH = 24;
export const BASE_ISSUANCE_PER_DAY = 250_000;
export const M_LAUNCH = 1.0;
export const M_RAISE_STEP = 0.05; // earned, one step per positive epoch
export const M_CUT_STEP = 0.15; // immediate, one step per negative epoch
export const TRADING_FEE_BPS = 100; // 1.00%

export const RESOLUTION_FEE_FLOOR = 0.005;
export const RESOLUTION_FEE_CEILING = 0.25;
export const RESOLUTION_FEE_SATURATION = 0.35; // 35% of the bank leaving in 7 days

/**
 * Lost keys, abandoned wallets and tourists. Everyone else performs the free
 * check-in, so only this slice of the bank can ever go dormant. Onsets are
 * spread across a long window so revocations arrive a few per week, never in a
 * wave.
 */
export const DORMANT_AGENT_RATE = 0.04;
export const DORMANT_ONSET_MIN_HOURS = 240;
export const DORMANT_ONSET_SPREAD_HOURS = 6000;
/**
 * Jitter around each onset slot. Kept well under half the stride so two onsets
 * can never collapse together: with 40 onsets across 6000 hours the stride is
 * 150 hours, and +/- 40 leaves at least 70 hours between any two. A seven epoch
 * window is 168 hours, so it can never hold more than three.
 */
export const DORMANT_ONSET_JITTER_HOURS = 40;

export const CHARTER_FLOOR_ETH = 0.05;
export const GENESIS_POOL_ETH = 400;
export const GOLD_ETH_PER_OZ = 0.87;

/**
 * Assumption ledger rendered by the ASSUMED PARAMETERS panel. Only the numbers
 * live here, because they are computed from the constants above. The label, the
 * value's wording and the reasoning are copy, and live in the dictionaries.
 */
export interface AssumedParam {
  id: string;
  vars: Record<string, string | number>;
}

export const ASSUMED_PARAMS: AssumedParam[] = [
  { id: 'BASE_ISSUANCE', vars: { v: BASE_ISSUANCE_PER_DAY.toLocaleString('en-US') } },
  {
    id: 'MULTIPLIER',
    vars: { lo: M_FLOOR.toFixed(2), hi: M_CEILING.toFixed(2), launch: M_LAUNCH.toFixed(2) },
  },
  { id: 'RATE_RAISE', vars: { v: M_RAISE_STEP.toFixed(2) } },
  { id: 'RATE_CUT', vars: { v: M_CUT_STEP.toFixed(2) } },
  { id: 'EPOCH_LENGTH', vars: { v: HOURS_PER_EPOCH } },
  { id: 'TRADING_FEE', vars: { v: `${(TRADING_FEE_BPS / 100).toFixed(2)}%` } },
  {
    id: 'RESOLUTION_FEE',
    vars: {
      lo: `${(RESOLUTION_FEE_FLOOR * 100).toFixed(1)}%`,
      hi: `${(RESOLUTION_FEE_CEILING * 100).toFixed(0)}%`,
    },
  },
  { id: 'LICENSE_FLOOR', vars: { v: LICENSE_FLOOR_DAYS_OF_YIELD } },
  { id: 'CHARTER_FLOOR', vars: { v: CHARTER_FLOOR_ETH } },
  {
    id: 'GENESIS_POOL',
    vars: { std: GENESIS_POL.toLocaleString('en-US'), eth: GENESIS_POOL_ETH },
  },
  { id: 'LICENSE_SETTLEMENT', vars: {} },
  { id: 'DORMANT_AGENTS', vars: { v: `${(DORMANT_AGENT_RATE * 100).toFixed(0)}%` } },
  { id: 'REVOCATION_SPLIT', vars: { a: '35%', b: '35%', c: '30%' } },
  { id: 'HARD_RESERVE', vars: { v: GOLD_ETH_PER_OZ } },
];

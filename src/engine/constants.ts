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

/** Assumption ledger rendered by the ASSUMED PARAMETERS panel. */
export interface AssumedParam {
  label: string;
  value: string;
  note: string;
}

export const ASSUMED_PARAMS: AssumedParam[] = [
  {
    label: 'BASE ISSUANCE',
    value: `${BASE_ISSUANCE_PER_DAY.toLocaleString('en-US')} / DAY`,
    note: 'Redacted in section 05. Sized so the 900,000,000 issuance budget lasts roughly a decade at full rate.',
  },
  {
    label: 'MULTIPLIER m',
    value: `${M_FLOOR.toFixed(2)} - ${M_CEILING.toFixed(2)}, LAUNCH ${M_LAUNCH.toFixed(2)}`,
    note: 'Range is stated on the protocol site. The launch value is not.',
  },
  {
    label: 'RATE RAISE',
    value: `+${M_RAISE_STEP.toFixed(2)} / POSITIVE EPOCH`,
    note: 'Redacted. Chosen so a sustained inflow needs 5 epochs to reach the ceiling from launch.',
  },
  {
    label: 'RATE CUT',
    value: `-${M_CUT_STEP.toFixed(2)} / NEGATIVE EPOCH`,
    note: 'Redacted. Three times the raise step, honoring "cuts are immediate, raises must be earned".',
  },
  {
    label: 'EPOCH LENGTH',
    value: `${HOURS_PER_EPOCH} PROTOCOL HOURS`,
    note: 'Redacted. The document speaks in days and in "epochs", so one epoch is read as one day.',
  },
  {
    label: 'TRADING FEE',
    value: `${(TRADING_FEE_BPS / 100).toFixed(2)}% IN ETH`,
    note: 'Redacted. Charged on both sides of every swap, as section 11 requires.',
  },
  {
    label: 'RESOLUTION FEE',
    value: `${(RESOLUTION_FEE_FLOOR * 100).toFixed(1)}% FLOOR / ${(RESOLUTION_FEE_CEILING * 100).toFixed(0)}% CEILING`,
    note: `Redacted. Quadratic between the two, saturating when ${(RESOLUTION_FEE_SATURATION * 100).toFixed(0)}% of the bank exits inside 7 days.`,
  },
  {
    label: 'LICENSE FLOOR',
    value: `${LICENSE_FLOOR_DAYS_OF_YIELD} DAYS OF ONE BRANCH YIELD`,
    note: 'Stated as an aside in section 08 and read literally: floor = base issuance x m / total branches x 2.',
  },
  {
    label: 'CHARTER FLOOR',
    value: `${CHARTER_FLOOR_ETH} ETH`,
    note: 'Section 08 calls this an admin-set reserve price and gives no number.',
  },
  {
    label: 'GENESIS POOL',
    value: `${GENESIS_POL.toLocaleString('en-US')} / ${GENESIS_POOL_ETH} ETH`,
    note: 'The token side is specified. The ETH the team pairs against it is not.',
  },
  {
    label: 'LICENSE SETTLEMENT',
    value: 'MINT AND BURN IN ONE STEP',
    note: 'Licenses are paid in $STANDARD and burned, but tokens only exist after a withdrawal. The accrued ledger balance is therefore minted and burned in the same transaction, which is why cumulative mints and cumulative burns both move while circulating supply does not.',
  },
  {
    label: 'DORMANT BANKERS',
    value: `${(DORMANT_AGENT_RATE * 100).toFixed(0)}% OF THE BANK, SPREAD OVER TIME`,
    note: 'Section 10 says staying active is free and that a zero-cost check-in exists, so an engaged banker never trips. Only lost keys and abandoned wallets do, and how many of those there are is not specified.',
  },
  {
    label: 'REVOCATION SPLIT',
    value: '35% BURN / 35% STAYERS / 30% GHOST',
    note: 'Section 10 gives a 70% fee, a 2% bounty and a 30% return, which sums past 100%. The bounty is read as coming out of the stayers half.',
  },
  {
    label: 'HARD RESERVE',
    value: `${GOLD_ETH_PER_OZ} ETH / OZ`,
    note: 'The expansion vault buys tokenized gold. The rate here is fixed for legibility.',
  },
];

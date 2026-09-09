export type Regime = 'EXPANSION' | 'CONTRACTION';

export type Sentiment = 'ACCUMULATION' | 'EXPANSION' | 'DISTRIBUTION' | 'CAPITULATION';

export type Profile = 'COMPOUNDER' | 'YIELD_TAKER' | 'FLIPPER' | 'PASSIVE' | 'DRIFTER';

export type EventKind =
  | 'EPOCH'
  | 'POLICY'
  | 'BURN'
  | 'LICENSE'
  | 'CHARTER'
  | 'EXIT'
  | 'DORMANCY'
  | 'RESERVE'
  | 'SYSTEM';

export interface ProtocolEvent {
  id: number;
  hour: number;
  epoch: number;
  kind: EventKind;
  text: string;
  /** -1 defensive, 0 neutral, 1 expansionary. Drives the one accent color. */
  tone: -1 | 0 | 1;
  /** Big moments. These interrupt the reader with a banner. */
  loud: boolean;
  /** Which kind of big moment, used to gate and dedupe the banner. */
  loudClass?: LoudClass;
}

export type LoudClass = 'FLIP' | 'RUN' | 'CUT' | 'FEE' | 'DORMANCY';

export interface Charter {
  id: number;
  branches: number;
  /** Ledger tokens settled up to accSnap. Balance is settled + branches * (acc - accSnap). */
  settled: number;
  accSnap: number;
  lastActive: number;
  profile: Profile;
  alive: boolean;
  licensesToday: number;
  /** Tokens actually minted to this banker and not yet sold. */
  wallet: number;
  /** Per-agent temperament, 0..1. */
  nerve: number;
  goesDarkAt: number;
}

export interface EpochRecord {
  epoch: number;
  netFlow: number;
  signal: number;
  m: number;
  mBefore: number;
  regime: Regime;
  sentiment: Sentiment;
  burns: number;
  circulating: number;
  price: number;
  branches: number;
  reserveOz: number;
  exitPressure: number;
  resolutionFee: number;
  /** Deltas over the epoch just closed. */
  issuedInEpoch: number;
  burnedInEpoch: number;
  withdrawnInEpoch: number;
  licensesSold: number;
  chartersSold: number;
  reserveAddedOz: number;
}

export interface AuctionState {
  /** Current price on the decay curve. */
  price: number;
  start: number;
  floor: number;
  /** Units still available today. */
  remaining: number;
  supply: number;
  soldToday: number;
  lastSale: number;
  /** Where on the curve the last sale landed, 0..1. */
  lastSaleAt: number;
  /** The day's supply is gone and the auction is closed until the next epoch. */
  soldOut: boolean;
  /** 0..1 through the 24 hour curve. */
  progress: number;
}

export interface Snapshot {
  version: number;

  hour: number;
  epoch: number;
  hourInEpoch: number;
  running: boolean;
  speed: number;

  regime: Regime;
  m: number;
  mPrev: number;
  signal: number;
  netFlowEpoch: number;
  netFlowPrev: number;

  circulating: number;
  maxSupply: number;
  mintedWithdrawal: number;
  mintedSettlement: number;
  burns: number;
  burnLicense: number;
  burnBuyback: number;
  burnResolution: number;
  burnRevocation: number;
  issued: number;
  ledgerHeld: number;

  poolEth: number;
  poolStd: number;
  price: number;
  outsideStd: number;
  /** Reserves plus permanent liquidity, per token. The floor under the market. */
  backing: number;

  expansionVault: number;
  contractionVault: number;
  reserveOz: number;
  reserveEth: number;
  polEth: number;
  polStd: number;
  teamEth: number;
  feeEthTotal: number;

  charters: number;
  chartersBurned: number;
  branches: number;
  perBranchDaily: number;

  exitPressure: number;
  resolutionFee: number;
  withdrawn7d: number;
  redistributed: number;

  licenseAuction: AuctionState;
  charterAuction: AuctionState;

  sentiment: Sentiment;
  severity: number;
  /** True while an accelerating exit is under way. Emergent, never triggered. */
  run: boolean;
  stress: 'CALM' | 'ELEVATED' | 'RUN';

  epochs: EpochRecord[];
  priceSeries: number[];
  events: ProtocolEvent[];

  /** Live proof that circulating = genesis + mints - burns holds against real balances. */
  identityDrift: number;
}

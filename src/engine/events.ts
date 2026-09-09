import type { Regime, Sentiment } from './types';

/**
 * The vocabulary of everything the bank can announce.
 *
 * The engine emits a key and its numbers, never a sentence. Rendering happens
 * at display time, so the same run reads in whichever language is selected and
 * the engine stays free of any presentation concern.
 */
export interface EventArgs {
  genesisSeeded: Record<string, never>;
  foundingCharters: { n: number };
  marketRegime: { sentiment: Sentiment };
  runStarting: Record<string, never>;
  runSubsided: Record<string, never>;
  buybackTick: { amount: number };
  charterSold: { id: number; eth: number };
  charterDissolved: { id: number; amount: number };
  charterRetired: { id: number; branches: number; amount: number; feeRate: number };
  charterRevoked: { id: number; days: number; branches: number };
  feeRoutingFlipped: { regime: Regime };
  rateCut: { from: number; to: number; signal: number };
  rateRaise: { from: number; to: number; signal: number };
  reserveAdded: { oz: number; eth: number };
  epochClosed: { epoch: number; netFlow: number };
  licenseAuctionClosed: { sold: number; cap: number; last: number };
  resolutionFeeHigh: { feeRate: number };
}

export type EventKey = keyof EventArgs;

/** One renderer per event, per language. A missing one fails the build. */
export type EventDict = { [K in EventKey]: (a: EventArgs[K]) => string };

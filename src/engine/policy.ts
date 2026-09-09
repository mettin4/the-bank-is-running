import {
  BASE_ISSUANCE_PER_DAY,
  LICENSE_FLOOR_DAYS_OF_YIELD,
  M_CEILING,
  M_CUT_STEP,
  M_FLOOR,
  M_RAISE_STEP,
  RESOLUTION_FEE_CEILING,
  RESOLUTION_FEE_FLOOR,
  RESOLUTION_FEE_SATURATION,
} from './constants';
import type { Regime } from './types';

/**
 * Whitepaper 4.1: the policy signal aggregates the two completed epochs behind
 * the current one. One manipulated hour cannot swing it.
 */
export function policySignal(flows: number[]): number {
  const n = flows.length;
  if (n === 0) return 0;
  if (n === 1) return flows[0];
  return flows[n - 1] + flows[n - 2];
}

/**
 * Whitepaper 5.2. Asymmetric by construction: the cut is taken in full the epoch
 * the signal turns, the raise is earned one step at a time.
 */
export function nextMultiplier(m: number, signal: number): number {
  if (signal > 0) return Math.min(M_CEILING, m + M_RAISE_STEP);
  return Math.max(M_FLOOR, m - M_CUT_STEP);
}

/** Fee routing reads the sign of the epoch in progress. The fast lever. */
export function routingRegime(currentEpochNetFlow: number): Regime {
  return currentEpochNetFlow > 0 ? 'EXPANSION' : 'CONTRACTION';
}

/** Whitepaper 9.1, first half. */
export function exitPressure(withdrawn7d: number, heldAtBank: number): number {
  const denom = Math.max(heldAtBank + withdrawn7d, 1);
  return withdrawn7d / denom;
}

/**
 * Whitepaper 9.1, second half. Quadratic from floor to ceiling, saturating once
 * a full run is under way. Your rate locks the moment you commit.
 */
export function resolutionFee(pressure: number): number {
  const x = Math.min(1, Math.max(0, pressure / RESOLUTION_FEE_SATURATION));
  return RESOLUTION_FEE_FLOOR + (RESOLUTION_FEE_CEILING - RESOLUTION_FEE_FLOOR) * x * x;
}

/** Whitepaper 7: the floor scales with the rate, so licenses cost more in expansion. */
export function licenseFloor(m: number, totalBranches: number): number {
  if (totalBranches <= 0) return BASE_ISSUANCE_PER_DAY * m * LICENSE_FLOOR_DAYS_OF_YIELD;
  return (BASE_ISSUANCE_PER_DAY * m * LICENSE_FLOOR_DAYS_OF_YIELD) / totalBranches;
}

/** Whitepaper 7.1: exponential decay from the open to the floor across 24 hours. */
export function dutchPrice(start: number, floor: number, progress: number): number {
  if (start <= floor) return floor;
  const t = Math.min(1, Math.max(0, progress));
  return start * Math.pow(floor / start, t);
}

export function dailyYieldPerBranch(m: number, totalBranches: number): number {
  if (totalBranches <= 0) return 0;
  return (BASE_ISSUANCE_PER_DAY * m) / totalBranches;
}

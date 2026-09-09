import { TRADING_FEE_BPS } from './constants';

export const FEE_RATE = TRADING_FEE_BPS / 10_000;

export interface Pool {
  eth: number;
  std: number;
}

export interface SwapResult {
  /** Gross ETH across the pool boundary, before fee. This is what the hook reports. */
  grossEth: number;
  /** Tokens moved. */
  std: number;
  /** ETH skimmed for the fee engine. */
  feeEth: number;
}

/** ETH in, tokens out. The fee is skimmed in ETH before the curve sees it. */
export function buy(pool: Pool, ethIn: number): SwapResult {
  if (ethIn <= 0) return { grossEth: 0, std: 0, feeEth: 0 };
  const feeEth = ethIn * FEE_RATE;
  const ethToCurve = ethIn - feeEth;
  const k = pool.eth * pool.std;
  const newEth = pool.eth + ethToCurve;
  const stdOut = pool.std - k / newEth;
  pool.eth = newEth;
  pool.std -= stdOut;
  return { grossEth: ethIn, std: stdOut, feeEth };
}

/** Tokens in, ETH out. The fee is skimmed in ETH from the proceeds. */
export function sell(pool: Pool, stdIn: number): SwapResult {
  if (stdIn <= 0) return { grossEth: 0, std: 0, feeEth: 0 };
  const k = pool.eth * pool.std;
  const newStd = pool.std + stdIn;
  const ethGross = pool.eth - k / newStd;
  const feeEth = ethGross * FEE_RATE;
  pool.std = newStd;
  pool.eth -= ethGross;
  return { grossEth: ethGross, std: stdIn, feeEth };
}

/** Protocol side swap: no fee, and never reported to the net flow hook. */
export function buyNoFee(pool: Pool, ethIn: number): number {
  if (ethIn <= 0) return 0;
  const k = pool.eth * pool.std;
  const newEth = pool.eth + ethIn;
  const stdOut = pool.std - k / newEth;
  pool.eth = newEth;
  pool.std -= stdOut;
  return stdOut;
}

export function price(pool: Pool): number {
  return pool.std > 0 ? pool.eth / pool.std : 0;
}

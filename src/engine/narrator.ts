import { ISSUANCE_BUDGET, M_CEILING, M_FLOOR } from './constants';
import type { Snapshot } from './types';

/**
 * One sentence of plain English describing what the bank is doing right now.
 * Every figure on the page is a consequence of this line, so it is written for
 * someone who has never read the whitepaper.
 */
export function narrate(s: Snapshot): string {
  if (s.run || s.stress === 'RUN') {
    return 'Heavy exits. The fee at the door is climbing, and the bankers leaving are paying the ones who stay.';
  }

  if (s.stress === 'ELEVATED') {
    return 'Exits are picking up. Leaving costs more with every withdrawal, which quietly pays the bankers who hold.';
  }

  if (s.issued >= ISSUANCE_BUDGET - 1) {
    return 'The issuance budget is spent. Nothing new is created, and the economy now runs on recycled fees alone.';
  }

  const cut = s.m < s.mPrev;
  const raised = s.m > s.mPrev;

  if (s.regime === 'CONTRACTION') {
    if (cut) {
      return 'Outflows detected. Issuance was cut this epoch, and fees now buy $STANDARD back and burn it.';
    }
    if (s.m <= M_FLOOR + 1e-9) {
      return 'Policy is at its floor. Issuance is as tight as it goes and every fee is still buying back and burning.';
    }
    return 'More ETH is leaving the pool than entering. The bank is defending its currency with buybacks.';
  }

  if (s.m >= M_CEILING - 1e-9) {
    return 'Capital keeps arriving. Issuance is at its ceiling and every fee is turning into gold and permanent liquidity.';
  }
  if (raised) {
    return 'Capital is flowing in. The bank earned a rate rise, and fees are buying hard reserve.';
  }
  if (cut) {
    return 'Inflows have returned, but the rate cut still stands. Raises have to be earned one epoch at a time.';
  }
  return 'More ETH is entering the pool than leaving. The bank is stacking gold and adding liquidity nobody can pull.';
}

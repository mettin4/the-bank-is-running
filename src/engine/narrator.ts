import { ISSUANCE_BUDGET, M_CEILING, M_FLOOR } from './constants';
import type { Snapshot } from './types';

export type NarratorKey =
  | 'nar.run'
  | 'nar.elevated'
  | 'nar.budgetSpent'
  | 'nar.cut'
  | 'nar.atFloor'
  | 'nar.contraction'
  | 'nar.atCeiling'
  | 'nar.raised'
  | 'nar.cutStands'
  | 'nar.expansion';

/**
 * Which sentence describes what the bank is doing right now. The wording lives
 * in the dictionaries; this only decides which one applies.
 */
export function narrate(s: Snapshot): NarratorKey {
  if (s.run || s.stress === 'RUN') return 'nar.run';
  if (s.stress === 'ELEVATED') return 'nar.elevated';
  if (s.issued >= ISSUANCE_BUDGET - 1) return 'nar.budgetSpent';

  const cut = s.m < s.mPrev;
  const raised = s.m > s.mPrev;

  if (s.regime === 'CONTRACTION') {
    if (cut) return 'nar.cut';
    if (s.m <= M_FLOOR + 1e-9) return 'nar.atFloor';
    return 'nar.contraction';
  }

  if (s.m >= M_CEILING - 1e-9) return 'nar.atCeiling';
  if (raised) return 'nar.raised';
  if (cut) return 'nar.cutStands';
  return 'nar.expansion';
}

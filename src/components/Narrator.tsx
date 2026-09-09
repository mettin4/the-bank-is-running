import { narrate } from '../engine/narrator';
import type { Snapshot } from '../engine/types';
import { Hint } from './Hint';

/**
 * The most important element on the page. It sits under the protocol clock on a
 * wide screen and above the chart on a narrow one, so it is never below the
 * fold on the layout where the fold arrives soonest.
 */
export function Narrator({ s, where }: { s: Snapshot; where: 'rail' | 'top' }) {
  return (
    <div className={where === 'rail' ? 'rail-block narrator narrator-rail' : 'narrator narrator-top'}>
      <div className="kicker">
        NOW HAPPENING
        <Hint text="A plain reading of the bank's current state. Every figure on this page follows from it." />
      </div>
      <p className="narrator-line">{narrate(s)}</p>
    </div>
  );
}

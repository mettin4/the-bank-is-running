import { useEffect, useRef, useState } from 'react';
import type { LoudClass, ProtocolEvent, Snapshot } from '../engine/types';

const HOLD_MS = 4000;
/** Never replaced before it has been on screen long enough to finish reading. */
const MIN_DWELL_MS = 1300;
/** The same kind of moment does not interrupt twice inside this window. */
const REPEAT_MS = 10000;

/**
 * At 16x the bank produces a big moment faster than a banner can be read, so
 * only the two that change the machine's mode get through. Everything else
 * still goes to the ticker.
 */
const AT_SPEED: Record<'slow' | 'fast', Set<LoudClass>> = {
  slow: new Set<LoudClass>(['FLIP', 'RUN', 'CUT', 'FEE', 'DORMANCY']),
  fast: new Set<LoudClass>(['FLIP', 'RUN']),
};

export function FlashBanner({ s }: { s: Snapshot }) {
  const [shown, setShown] = useState<ProtocolEvent | null>(null);
  const lastId = useRef(-1);
  const shownAt = useRef(0);
  const lastOfClass = useRef<Partial<Record<LoudClass, number>>>({});
  const hideTimer = useRef(0);

  // The hide timer lives in a ref rather than in the effect's cleanup. A new
  // loud event re-runs the effect, and a cleanup would cancel the pending hide
  // even when the new event is filtered out, leaving the banner up for good.
  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  const allowed = AT_SPEED[s.speed >= 16 ? 'fast' : 'slow'];
  const loud = s.events.find((e) => e.loud && e.loudClass && allowed.has(e.loudClass));
  const id = loud ? loud.id : -1;

  useEffect(() => {
    if (id < 0 || id <= lastId.current || !loud || !loud.loudClass) return;
    lastId.current = id;

    const now = performance.now();
    if (now - shownAt.current < MIN_DWELL_MS) return;
    if (now - (lastOfClass.current[loud.loudClass] ?? -Infinity) < REPEAT_MS) return;

    lastOfClass.current[loud.loudClass] = now;
    shownAt.current = now;
    setShown(loud);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setShown(null), HOLD_MS);
    // `loud` is read at the moment its id changes, which is the only time it matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!shown) return <div className="flash-slot" aria-hidden="true" />;

  const tone = shown.tone < 0 ? 'neg' : shown.tone > 0 ? 'pos' : 'neutral';

  return (
    <div className={`flash-slot is-on tone-${tone}`}>
      <div className="flash" role="status">
        <span className="kicker">{shown.kind}</span>
        <span className="flash-text">{shown.text}</span>
      </div>
    </div>
  );
}

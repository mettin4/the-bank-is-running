import { useEffect, useRef, useState } from 'react';
import { PRERUN_EPOCHS } from '../engine/store';

const LINES = [
  'LOADING WHITEPAPER RULES · V0.1',
  'SEEDING GENESIS LIQUIDITY · 100,000,000 $STANDARD',
  'PAIRING ETH AGAINST THE HOOKED V4 POOL',
  'CHARTERING 1,000 BANKS · ONE BRANCH EACH',
  'ARMING THE NET FLOW SIGNAL',
  `REPLAYING ${PRERUN_EPOCHS} EPOCHS`,
];

const STEP = 300;
const HOLD = 460;

export function ColdStart({ onDone }: { onDone: () => void }) {
  const [shown, setShown] = useState(0);
  const [final, setFinal] = useState(false);
  const [out, setOut] = useState(false);

  // The parent re-renders many times a second, so the callback is held in a ref
  // and the sequence is started exactly once.
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    const timers: number[] = [];
    LINES.forEach((_, i) => {
      timers.push(window.setTimeout(() => setShown(i + 1), i * STEP));
    });
    const t0 = LINES.length * STEP;
    timers.push(window.setTimeout(() => setFinal(true), t0));
    timers.push(window.setTimeout(() => setOut(true), t0 + HOLD));
    timers.push(window.setTimeout(() => done.current(), t0 + HOLD + 340));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={out ? 'cold is-done' : 'cold'} aria-hidden={out}>
      <div className="cold-lines">
        {LINES.slice(0, shown).map((l, i) => (
          <div className="cold-line" key={l}>
            <span className="i">{String(i + 1).padStart(2, '0')}</span>
            <span>{l}</span>
          </div>
        ))}
        {final ? <div className="cold-line is-final">THE BANK IS RUNNING</div> : null}
      </div>
    </div>
  );
}

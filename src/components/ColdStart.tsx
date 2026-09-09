import { useEffect, useRef, useState } from 'react';
import { PRERUN_EPOCHS } from '../engine/store';
import { useI18n } from '../i18n';
import type { DictKey } from '../i18n/en';

const KEYS: DictKey[] = ['cold.1', 'cold.2', 'cold.3', 'cold.4', 'cold.5', 'cold.6'];

const STEP = 300;
const HOLD = 460;

export function ColdStart({ onDone }: { onDone: () => void }) {
  const { t, tv } = useI18n();
  const [shown, setShown] = useState(0);
  const [final, setFinal] = useState(false);
  const [out, setOut] = useState(false);

  // The parent re-renders many times a second, so the callback is held in a ref
  // and the sequence is started exactly once.
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    const timers: number[] = [];
    KEYS.forEach((_, i) => {
      timers.push(window.setTimeout(() => setShown(i + 1), i * STEP));
    });
    const t0 = KEYS.length * STEP;
    timers.push(window.setTimeout(() => setFinal(true), t0));
    timers.push(window.setTimeout(() => setOut(true), t0 + HOLD));
    timers.push(window.setTimeout(() => done.current(), t0 + HOLD + 340));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={out ? 'cold is-done' : 'cold'} aria-hidden={out}>
      <div className="cold-lines">
        {KEYS.slice(0, shown).map((k, i) => (
          <div className="cold-line" key={k}>
            <span className="i">{String(i + 1).padStart(2, '0')}</span>
            <span>{k === 'cold.6' ? tv(k, { n: PRERUN_EPOCHS }) : t(k)}</span>
          </div>
        ))}
        {final ? <div className="cold-line is-final">THE BANK IS RUNNING</div> : null}
      </div>
    </div>
  );
}

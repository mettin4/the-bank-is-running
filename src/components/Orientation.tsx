import { useEffect, useState } from 'react';

const KEY = 'tbir.oriented.v1';

function seen(): boolean {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

function remember() {
  try {
    localStorage.setItem(KEY, '1');
  } catch {
    /* private windows and blocked storage simply show it again */
  }
}

/** Shown once, on a first visit, after the cold start has finished. */
export function Orientation({ onDone }: { onDone: () => void }) {
  const [out, setOut] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  function dismiss() {
    if (out) return;
    setOut(true);
    remember();
    window.setTimeout(onDone, 300);
  }

  return (
    <div className={out ? 'orient is-out' : 'orient'} role="dialog" aria-modal="true" aria-label="Orientation">
      <div className="orient-card">
        <div className="kicker">BEFORE YOU WATCH</div>
        <p className="orient-line">
          This is The Standard Reserve&apos;s economy, implemented early from whitepaper v0.1 and
          running autonomously in your browser.
        </p>
        <p className="orient-line">One thousand banks. One pool. One signal.</p>
        <p className="orient-line orient-line-last">Nobody can intervene. Not even you.</p>
        <button type="button" className="orient-btn" onClick={dismiss} autoFocus>
          BEGIN OBSERVATION
        </button>
      </div>
    </div>
  );
}

export const orientationSeen = seen;

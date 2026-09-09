import { stamp } from '../engine/format';
import type { Snapshot } from '../engine/types';

const TONE = ['tone-neg', '', 'tone-pos'] as const;

export function Ticker({ s }: { s: Snapshot }) {
  return (
    <div className="ticker">
      <div className="ticker-label">
        <span className={s.running ? 'ticker-dot' : 'ticker-dot is-paused'} />
        <span className="kicker">{s.running ? 'LIVE' : 'HELD'}</span>
      </div>
      <div className="ticker-track">
        {s.events.slice(0, 14).map((e) => (
          <span key={e.id} className={`ticker-item ${TONE[e.tone + 1]}`}>
            <span className="h">{stamp(e.epoch, e.hour)}</span>
            {e.text}
          </span>
        ))}
      </div>
    </div>
  );
}

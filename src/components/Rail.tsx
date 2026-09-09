import { HOURS_PER_EPOCH, M_CEILING, M_FLOOR } from '../engine/constants';
import { pad4 } from '../engine/format';
import { runtime } from '../engine/store';
import type { Snapshot } from '../engine/types';
import { Hint } from './Hint';
import { Narrator } from './Narrator';
import { Num } from './Num';

const SPEEDS: [string, number][] = [
  ['PAUSE', 0],
  ['1x', 1],
  ['4x', 4],
  ['16x', 16],
];

export function Rail({ s }: { s: Snapshot }) {
  const active = s.running ? s.speed : 0;
  const cut = s.m < s.mPrev;
  const mPct = ((s.m - M_FLOOR) / (M_CEILING - M_FLOOR)) * 100;

  return (
    <aside className="rail">
      <div className="rail-block">
        <div className="kicker">PROTOCOL CLOCK</div>
        <span className="epoch-no">{pad4(s.epoch)}</span>
        <div className="epoch-meta">
          <span>
            EPOCH {pad4(s.epoch)} · {String(s.hourInEpoch).padStart(2, '0')}/{HOURS_PER_EPOCH}H
          </span>
        </div>
        <div className="epoch-bar">
          <i style={{ width: `${(s.hourInEpoch / HOURS_PER_EPOCH) * 100}%` }} />
        </div>
      </div>

      <Narrator s={s} where="rail" />

      <div className="rail-block">
        <div className="kicker block-label">TIME</div>
        <div className="speeds" role="group" aria-label="Playback speed">
          {SPEEDS.map(([label, v]) => (
            <button
              key={label}
              type="button"
              aria-pressed={active === v}
              onClick={() => runtime.setSpeed(v)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="cap">ONE SECOND IS ONE PROTOCOL HOUR AT 1x</div>
      </div>

      <div className="rail-block">
        <div className="kicker block-label">
          EPOCH STATE
          <Hint text="Fee routing follows the sign of the epoch in progress. Positive net flow stacks reserves, negative net flow buys the token back and burns it." />
        </div>
        <div className={`regime is-${s.regime.toLowerCase()}`}>
          <span className="regime-name">{s.regime}</span>
          <div className="regime-note">
            {s.regime === 'EXPANSION' ? 'FEES BUY HARD RESERVE' : 'FEES BUY BACK AND BURN'}
          </div>
        </div>

        <div style={{ marginTop: 'var(--s3)' }}>
          <div className="row" style={{ paddingTop: 0 }}>
            <span className="k">
              POLICY RATE m
              <Hint text="The issuance multiplier. It falls in one big step the epoch capital turns negative and climbs back in small steps only while inflows persist." />
            </span>
            <span className={cut ? 'v neg' : 'v gold'}>
              <Num value={s.m} kind="mult" tau={220} />
            </span>
          </div>
          <div className={cut ? 'meter is-cut' : 'meter'}>
            <i style={{ width: `${Math.max(0, Math.min(100, mPct))}%` }} />
          </div>
          <div className="meter-scale">
            <span>{M_FLOOR.toFixed(2)}</span>
            <span>{M_CEILING.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

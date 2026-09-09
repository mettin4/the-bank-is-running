import { HOURS_PER_EPOCH, M_CEILING, M_FLOOR } from '../engine/constants';
import { pad4 } from '../engine/format';
import { runtime } from '../engine/store';
import type { Snapshot } from '../engine/types';
import { useI18n } from '../i18n';
import type { DictKey } from '../i18n/en';
import { Hint } from './Hint';
import { Narrator } from './Narrator';
import { Num } from './Num';

const SPEEDS: [DictKey | null, string, number][] = [
  ['rail.pause', 'PAUSE', 0],
  [null, '1x', 1],
  [null, '4x', 4],
  [null, '16x', 16],
];

export function Rail({ s }: { s: Snapshot }) {
  const { t } = useI18n();
  const active = s.running ? s.speed : 0;
  const cut = s.m < s.mPrev;
  const mPct = ((s.m - M_FLOOR) / (M_CEILING - M_FLOOR)) * 100;

  return (
    <aside className="rail">
      <div className="rail-block">
        <div className="kicker">{t('rail.clock')}</div>
        <span className="epoch-no">{pad4(s.epoch)}</span>
        <div className="epoch-meta">
          <span>
            {t('rail.epoch')} {pad4(s.epoch)} ·{' '}
            {String(s.hourInEpoch).padStart(2, '0')}/{HOURS_PER_EPOCH}H
          </span>
        </div>
        <div className="epoch-bar">
          <i style={{ width: `${(s.hourInEpoch / HOURS_PER_EPOCH) * 100}%` }} />
        </div>
      </div>

      <Narrator s={s} where="rail" />

      <div className="rail-block">
        <div className="kicker block-label">{t('rail.time')}</div>
        <div className="speeds" role="group" aria-label={t('rail.speedLabel')}>
          {SPEEDS.map(([key, label, v]) => (
            <button
              key={label}
              type="button"
              aria-pressed={active === v}
              onClick={() => runtime.setSpeed(v)}
            >
              {key ? t(key) : label}
            </button>
          ))}
        </div>
        <div className="cap">{t('rail.tempo')}</div>
      </div>

      <div className="rail-block">
        <div className="kicker block-label">
          {t('rail.epochState')}
          <Hint text={t('rail.epochStateHint')} />
        </div>
        <div className={`regime is-${s.regime.toLowerCase()}`}>
          <span className="regime-name">
            {s.regime === 'EXPANSION' ? t('regime.EXPANSION') : t('regime.CONTRACTION')}
          </span>
          <div className="regime-note">
            {s.regime === 'EXPANSION' ? t('rail.feesBuyReserve') : t('rail.feesBuyBack')}
          </div>
        </div>

        <div style={{ marginTop: 'var(--s3)' }}>
          <div className="row" style={{ paddingTop: 0 }}>
            <span className="k">
              {t('rail.policyRate')}
              <Hint text={t('rail.policyRateHint')} />
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

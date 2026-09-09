import { pad4, price as fmtPrice } from '../engine/format';
import type { Snapshot } from '../engine/types';
import { useI18n } from '../i18n';
import { Num } from './Num';

/** The compact readout in the top right of the header. Present on every tab. */
export function HeadStrip({ s }: { s: Snapshot }) {
  const { t } = useI18n();

  return (
    <div className="headstrip">
      <span className="headstrip-cell">
        <span className="kicker">{t('head.epoch')}</span>
        <span className="headstrip-v">{pad4(s.epoch)}</span>
      </span>
      <span className="headstrip-cell">
        <span className="kicker">{t('head.circulating')}</span>
        <span className="headstrip-v">
          <Num value={s.circulating} kind="compact" tau={180} />
        </span>
      </span>
      <span className="headstrip-cell">
        <span className="kicker">{t('head.burned')}</span>
        <span className="headstrip-v neg">
          <Num value={s.burns} kind="compact" tau={180} />
        </span>
      </span>
      <span className="headstrip-cell">
        <span className="kicker">{t('head.price')}</span>
        <span className="headstrip-v gold">{fmtPrice(s.price)}</span>
      </span>
    </div>
  );
}

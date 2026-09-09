import { price as fmtPrice } from '../engine/format';
import type { Snapshot } from '../engine/types';
import { useI18n } from '../i18n';
import { Spark } from './charts';
import { Hint } from './Hint';
import { Num } from './Num';
import { useMeasure } from './useMeasure';

export function StatRow({ s }: { s: Snapshot }) {
  const { t } = useI18n();
  const [ref, w] = useMeasure<HTMLDivElement>();

  return (
    <div className="statrow">
      <div className="statrow-cell">
        <div className="kicker">
          {t('stat.circulating')}
          <Hint text={t('stat.circulatingHint')} />
        </div>
        <span className="statrow-v">
          <Num value={s.circulating} kind="int" tau={170} />
        </span>
        <div className="sub">
          {t('stat.ofPre')} <Num value={s.maxSupply} kind="compact" tau={200} />{' '}
          {t('stat.ofPost')}
        </div>
      </div>

      <div className="statrow-cell">
        <div className="kicker">
          {t('stat.burned')}
          <Hint text={t('stat.burnedHint')} />
        </div>
        <span className="statrow-v neg">
          <Num value={s.burns} kind="int" tau={170} />
        </span>
        <div className="sub">{t('stat.retiredFromCap')}</div>
      </div>

      <div className="statrow-cell">
        <div className="kicker">
          {t('stat.hardReserve')}
          <Hint text={t('stat.hardReserveHint')} />
        </div>
        <span className="statrow-v gold">
          <Num value={s.reserveOz} kind="ozs" tau={200} />
        </span>
        <div className="sub">
          {t('stat.marketPre')} <Num value={s.reserveEth} kind="eth" tau={200} />{' '}
          {t('stat.marketPost')}
        </div>
      </div>

      <div className="statrow-cell">
        <div className="kicker">
          {t('stat.price')}
          <Hint text={t('stat.priceHint')} />
        </div>
        <span className="statrow-v">{fmtPrice(s.price)}</span>
        <div ref={ref} className="statrow-spark">
          <Spark data={s.priceSeries} width={w} height={26} stroke="var(--gold)" logScale />
        </div>
        <div className="sub statrow-caveat">{t('stat.synthetic')}</div>
      </div>
    </div>
  );
}

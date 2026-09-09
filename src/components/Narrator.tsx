import { narrate } from '../engine/narrator';
import type { Snapshot } from '../engine/types';
import { useI18n } from '../i18n';
import { Hint } from './Hint';

/**
 * The most important element on the page. It sits under the protocol clock on a
 * wide screen and above the chart on a narrow one, so it is never below the
 * fold on the layout where the fold arrives soonest.
 */
export function Narrator({ s, where }: { s: Snapshot; where: 'rail' | 'top' }) {
  const { t } = useI18n();

  return (
    <div
      className={where === 'rail' ? 'rail-block narrator narrator-rail' : 'narrator narrator-top'}
    >
      <div className="kicker">
        {t('narrator.title')}
        <Hint text={t('narrator.hint')} />
      </div>
      <p className="narrator-line">{t(narrate(s))}</p>
    </div>
  );
}

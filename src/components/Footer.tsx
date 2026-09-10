import { useI18n } from '../i18n';
import { TowerMark } from './TowerMark';

/**
 * One footer, used by the terminal and the landing, so the two can never drift
 * apart. The mark sits beside the whitepaper link as attribution to the
 * protocol, never as this site's own brand.
 */
export function Footer({ withMark = false }: { withMark?: boolean }) {
  const { t } = useI18n();

  return (
    <footer className="foot">
      <a
        href="https://www.standardreserve.xyz/whitepaper/"
        target="_blank"
        rel="noreferrer noopener"
        className={withMark ? 'foot-link-mark' : undefined}
      >
        {withMark ? <TowerMark size={16} /> : null}
        {t('foot.whitepaper')}
      </a>
      <span className="foot-sep">·</span>
      {t('foot.experimental')}
      <span className="foot-sep">·</span>
      {t('foot.unofficial')}
      <span className="foot-sep">·</span>
      {t('foot.built')}
    </footer>
  );
}

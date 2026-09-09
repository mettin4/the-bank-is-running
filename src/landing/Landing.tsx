import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Footer } from '../components/Footer';
import { LangToggle } from '../components/LangToggle';
import { TowerMark } from '../components/TowerMark';
import { useI18n } from '../i18n';
import type { DictKey } from '../i18n/en';
import { linkProps } from '../router';
import {
  SchemaBank,
  SchemaCut,
  SchemaFlow,
  SchemaLoosen,
  SchemaRun,
  SchemaTerminal,
} from './schematics';
import './landing.css';

/** Fades a card in the first time it comes into view. Nothing is ever hidden
 *  from a reader who has motion turned off, or from a crawler. */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return { ref, shown };
}

function Card({
  index,
  headline,
  sub,
  schematic,
  children,
}: {
  index: number;
  headline: DictKey;
  sub: DictKey;
  schematic: ReactNode;
  children?: ReactNode;
}) {
  const { t } = useI18n();
  const { ref, shown } = useReveal<HTMLElement>();

  return (
    <section ref={ref} className={shown ? 'lcard is-in' : 'lcard'}>
      <div className="lcard-inner">
        <div className="lcard-copy">
          <span className="lcard-index">{String(index).padStart(2, '0')}</span>
          <h2 className="lcard-head">{t(headline)}</h2>
          <p className="lcard-sub">{t(sub)}</p>
          {children}
        </div>
        <div className="lcard-figure">{schematic}</div>
      </div>
    </section>
  );
}

export function Landing() {
  const { t } = useI18n();

  useEffect(() => {
    document.title = 'THE BANK IS RUNNING';
    // Reveal on scroll is opt in, so a card is never left invisible by a
    // script that did not run.
    document.documentElement.dataset.reveal = 'on';
    return () => {
      delete document.documentElement.dataset.reveal;
    };
  }, []);

  return (
    <div className="landing">
      <header className="lhead">
        <a className="lhead-mark" href="https://www.standardreserve.xyz/" target="_blank" rel="noreferrer noopener">
          <TowerMark size={20} />
          <span className="lhead-name">THE STANDARD RESERVE</span>
          <span className="lhead-tag">{t('land.unofficialTag')}</span>
        </a>
        <div className="lhead-right">
          <LangToggle />
          <a className="lbtn lbtn-sm" {...linkProps('/app')}>
            {t('land.launch')}
          </a>
        </div>
      </header>

      <main className="lmain">
        <Card index={1} headline="land.h1" sub="land.s1" schematic={<SchemaBank />} />
        <Card index={2} headline="land.h2" sub="land.s2" schematic={<SchemaFlow />} />
        <Card index={3} headline="land.h3" sub="land.s3" schematic={<SchemaLoosen />} />
        <Card index={4} headline="land.h4" sub="land.s4" schematic={<SchemaCut />} />
        <Card index={5} headline="land.h5" sub="land.s5" schematic={<SchemaRun />} />
        <Card index={6} headline="land.h6" sub="land.s6" schematic={<SchemaTerminal />}>
          <div className="lcard-actions">
            <a className="lbtn" {...linkProps('/app')}>
              {t('land.launch')}
            </a>
            <a
              className="llink"
              href="https://www.standardreserve.xyz/whitepaper/"
              target="_blank"
              rel="noreferrer noopener"
            >
              {t('land.readWhitepaper')}
            </a>
          </div>
        </Card>

        <Footer withMark />
      </main>
    </div>
  );
}

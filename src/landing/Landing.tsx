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
  title,
  headline,
  sub,
  schematic,
  figureLabel,
  children,
}: {
  index: number;
  title: DictKey;
  headline: DictKey;
  sub: DictKey;
  schematic: ReactNode;
  /** When given, the figure is framed like a terminal panel under this label. */
  figureLabel?: DictKey;
  children?: ReactNode;
}) {
  const { t } = useI18n();
  const { ref, shown } = useReveal<HTMLElement>();

  // The side the figure sits on alternates by card number, not by position in
  // the page, so adding the hero above cannot flip the whole sequence.
  const cls = ['lcard', index % 2 === 0 ? 'is-flip' : '', shown ? 'is-in' : ''];

  return (
    <section ref={ref} className={cls.filter(Boolean).join(' ')}>
      <div className="lcard-inner">
        <div className="lcard-copy">
          <p className="lcard-kicker">
            <span className="lcard-index">{String(index).padStart(2, '0')}</span>
            <span className="lcard-title">{t(title)}</span>
            <span className="lcard-rule" aria-hidden="true" />
          </p>
          <h2 className="lcard-head">{t(headline)}</h2>
          <p className="lcard-sub">{t(sub)}</p>
          {children}
        </div>
        <div className="lcard-figure">
          {figureLabel ? (
            <figure className="lfig-panel">
              <figcaption className="lfig-panel-head">
                <span className="kicker">{t(figureLabel)}</span>
                <span className="panel-note">/APP</span>
              </figcaption>
              {schematic}
            </figure>
          ) : (
            schematic
          )}
        </div>
      </div>
    </section>
  );
}

/** The first viewport: who this is, and that there is more below. */
function Hero() {
  const { t } = useI18n();

  return (
    <section className="lhero">
      <div className="lhero-body">
        <h1 className="lhero-title">THE BANK IS RUNNING</h1>
        <p className="lhero-sub">{t('land.heroSub')}</p>
        <p className="lhero-meta">{t('land.heroMeta')}</p>
      </div>
      <div className="lhero-cue" aria-hidden="true">
        <span className="lhero-cue-word">{t('land.scroll')}</span>
        <span className="lhero-cue-line" />
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
        <Hero />

        <Card index={1} title="land.k1" headline="land.h1" sub="land.s1" schematic={<SchemaBank />} />
        <Card index={2} title="land.k2" headline="land.h2" sub="land.s2" schematic={<SchemaFlow />} />
        <Card index={3} title="land.k3" headline="land.h3" sub="land.s3" schematic={<SchemaLoosen />} />
        <Card index={4} title="land.k4" headline="land.h4" sub="land.s4" schematic={<SchemaCut />} />
        <Card index={5} title="land.k5" headline="land.h5" sub="land.s5" schematic={<SchemaRun />} />
        <Card
          index={6}
          title="land.k6"
          headline="land.h6"
          sub="land.s6"
          schematic={<SchemaTerminal />}
          figureLabel="land.figLabel6"
        >
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

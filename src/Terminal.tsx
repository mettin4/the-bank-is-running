import { useEffect, useRef, useState } from 'react';
import { ASSUMED_PARAMS } from './engine/constants';
import { useProtocol } from './engine/store';
import { ColdStart } from './components/ColdStart';
import { FlashBanner } from './components/FlashBanner';
import { HeadStrip } from './components/HeadStrip';
import { LangToggle } from './components/LangToggle';
import { Orientation, orientationSeen } from './components/Orientation';
import { useI18n } from './i18n';
import type { AssumedKey, DictKey } from './i18n/en';
import { Narrator } from './components/Narrator';
import { Rail } from './components/Rail';
import { StatRow } from './components/StatRow';
import { Tabs, type Tab } from './components/Tabs';
import { Footer } from './components/Footer';
import { Ticker } from './components/Ticker';
import {
  BurnPanel,
  CharterAuctionPanel,
  EpochLog,
  EventFeed,
  ExitPanel,
  FeeEnginePanel,
  Hero,
  LicenseAuctionPanel,
  SupplyPanel,
} from './components/panels';

export default function Terminal() {
  const { t, tv, assumed } = useI18n();
  const mainRef = useRef<HTMLElement>(null);
  const [cold, setCold] = useState(true);
  const [oriented, setOriented] = useState(() => orientationSeen());
  const [tab, setTab] = useState<Tab>('OVERVIEW');
  const s = useProtocol();

  // A new section always starts at the top, on load and on every switch.
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [tab]);

  return (
    <>
      {cold ? <ColdStart onDone={() => setCold(false)} /> : null}
      {!cold && !oriented ? <Orientation onDone={() => setOriented(true)} /> : null}

      <div className="shell">
        <header className="head">
          <div className="head-id">
            <h1 className="head-title">THE BANK IS RUNNING</h1>
            <p className="head-sub">{t('app.subtitle')}</p>
          </div>
          <div className="head-right">
            <HeadStrip s={s} />
            <LangToggle />
          </div>
        </header>

        <div className="body">
          <FlashBanner s={s} />
          <Rail s={s} />

          <main className="main" ref={mainRef}>
            <Tabs value={tab} onChange={setTab} />
            <Narrator s={s} where="top" />

            {tab === 'OVERVIEW' ? (
              <>
                <Hero s={s} />
                <StatRow s={s} />
              </>
            ) : null}

            {tab === 'SUPPLY' ? (
              <div className="grid-2">
                <SupplyPanel s={s} />
                <BurnPanel s={s} />
              </div>
            ) : null}

            {tab === 'AUCTIONS' ? (
              <div className="grid-2">
                <LicenseAuctionPanel s={s} />
                <CharterAuctionPanel s={s} />
              </div>
            ) : null}

            {tab === 'DEFENCE' ? (
              <div className="grid-2">
                <ExitPanel s={s} />
                <FeeEnginePanel s={s} />
              </div>
            ) : null}

            {tab === 'LOG' ? (
              <>
                <EpochLog s={s} />
                <EventFeed s={s} />
                <details className="disclose">
                  <summary>
                    <span className="kicker-b">{t('assumed.title')}</span>
                    <span className="chev">›</span>
                  </summary>
                  <div className="disclose-body">
                    <p className="assume n" style={{ margin: '0 0 var(--s3)' }}>
                      {t('assumed.intro')}
                    </p>
                    <div className="assume-grid">
                      {ASSUMED_PARAMS.map((p) => (
                        <div className="assume" key={p.id}>
                          <div className="k">{assumed[p.id as AssumedKey].label}</div>
                          <div className="v">{tv(`av.${p.id}` as DictKey, p.vars)}</div>
                          <div className="n">{assumed[p.id as AssumedKey].note}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </details>
              </>
            ) : null}

            <Footer />
          </main>
        </div>

        <Ticker s={s} />
      </div>
    </>
  );
}

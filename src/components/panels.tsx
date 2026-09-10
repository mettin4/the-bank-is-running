import {
  GENESIS_POL,
  HARD_CAP,
  LICENSES_PER_DAY,
  RESOLUTION_FEE_SATURATION,
} from '../engine/constants';
import {
  stamp,
  compact,
  dec,
  int,
  pad4,
  pct,
  price as fmtPrice,
  signed,
} from '../engine/format';
import type { Snapshot } from '../engine/types';
import { AuctionCurve, ExitCurve, HeroChart, Spark, heroEpochsShown } from './charts';
import { Hint } from './Hint';
import { Num } from './Num';
import { Panel, Row, Stat } from './Panel';
import { useI18n } from '../i18n';
import type { DictKey } from '../i18n/en';
import { useMeasure } from './useMeasure';

/* ---------------------------------------------------------------- hero --- */

export function Hero({ s }: { s: Snapshot }) {
  const { t, tv } = useI18n();
  const [ref, w] = useMeasure<HTMLDivElement>();
  const positive = s.netFlowEpoch >= 0;

  return (
    <section className="hero">
      <div className="hero-head">
        <div>
          <div className="kicker">
            {t('hero.netFlow')}
            <Hint text={t('hero.netFlowHint')} />
          </div>
          <span className={positive ? 'hero-figure pos' : 'hero-figure neg'}>
            <Num value={s.netFlowEpoch} kind="signedEth" tau={150} />
          </span>
        </div>
        <div>
          <div className="kicker">
            {t('hero.policyRate')}
            <Hint text={t('hero.policyRateHint')} />
          </div>
          <span className="hero-figure gold">
            <Num value={s.m} kind="mult" tau={240} />
          </span>
        </div>
        <div className="hero-legend">
          <span className="legend-item">
            <i className="swatch pos" /> {t('hero.inflowEpoch')}
          </span>
          <span className="legend-item">
            <i className="swatch neg" /> {t('hero.outflowEpoch')}
          </span>
          <span className="legend-item">
            <i className="swatch" /> {t('hero.multiplier')}
          </span>
        </div>
      </div>
      <div ref={ref}>
        <HeroChart
          epochs={s.epochs}
          liveEpoch={s.epoch}
          liveFlow={s.netFlowEpoch}
          liveM={s.m}
          width={w}
          height={320}
        />
      </div>
      <div className="cap">{tv('hero.caption', { n: heroEpochsShown(s.epochs.length) })}</div>
    </section>
  );
}

/* -------------------------------------------------------------- supply --- */

/**
 * Drift below this share of circulating supply is floating point noise from two
 * independently accumulated sums, not a real imbalance. The badge and the number
 * beside it answer to the same threshold, so the panel cannot claim the identity
 * holds while showing a figure that says otherwise.
 */
const DRIFT_BOUND = 1e-12;

export function SupplyPanel({ s }: { s: Snapshot }) {
  const { t, tv } = useI18n();
  const [ref, w] = useMeasure<HTMLDivElement>();
  const mints = s.mintedWithdrawal + s.mintedSettlement;
  const holds = s.identityDrift < DRIFT_BOUND * Math.max(1, s.circulating);
  const drift = holds ? (0).toFixed(7) : s.identityDrift.toFixed(7);

  return (
    <Panel
      title={t('supply.title')}
      note={t('supply.note')}
      hint={t('supply.hint')}
    >
      <div className="identity">
        <span className="l">{t('supply.genesis')}</span>
        <span className="r">{int(GENESIS_POL)}</span>
        <span className="l">
          <span className="op">+</span> {t('supply.mints')}
        </span>
        <span className="r">
          <Num value={mints} kind="int" tau={160} />
        </span>
        <span className="l faint" style={{ paddingLeft: 12 }}>
          {t('supply.atWithdrawal')}
        </span>
        <span className="r faint">
          <Num value={s.mintedWithdrawal} kind="int" tau={160} />
        </span>
        <span className="l faint" style={{ paddingLeft: 12 }}>
          {t('supply.settledBurned')}
        </span>
        <span className="r faint">
          <Num value={s.mintedSettlement} kind="int" tau={160} />
        </span>
        <span className="l">
          <span className="op">-</span> {t('supply.cumulativeBurns')}
        </span>
        <span className="r neg">
          <Num value={s.burns} kind="int" tau={160} />
        </span>
        <span className="l sum">{t('supply.circulating')}</span>
        <span className="r sum">
          <Num value={s.circulating} kind="int" tau={160} />
        </span>
      </div>

      <div style={{ marginTop: 'var(--s3)' }}>
        <Row label={t('supply.maxSupply')}>
          <Num value={s.maxSupply} kind="int" tau={160} />
        </Row>
        <Row label={t('supply.issued')}>
          <Num value={s.issued} kind="compact" tau={160} />
        </Row>
        <Row label={t('supply.heldAtBank')}>
          <Num value={s.ledgerHeld} kind="compact" tau={160} />
        </Row>
        <Row label={t('supply.outsidePool')}>
          <Num value={s.outsideStd} kind="compact" tau={160} />
        </Row>
        <Row label={t('supply.backing')} unit={t('unit.eth')}>
          <span className="dim">{fmtPrice(s.backing)}</span>
        </Row>
      </div>

      <div ref={ref} style={{ marginTop: 'var(--s3)' }}>
        <Spark
          data={s.epochs.map((e) => e.circulating)}
          width={w}
          height={44}
          stroke="var(--gold)"
          fill="var(--gold-ghost)"
        />
      </div>
      <div className="cap">{t('supply.receipt')}</div>

      <div className={holds ? 'proof' : 'proof is-broken'}>
        <i /> {tv(holds ? 'supply.identityHolds' : 'supply.identityBroken', { v: drift })}
      </div>
    </Panel>
  );
}

/* ---------------------------------------------------------- burn ledger --- */

export function BurnPanel({ s }: { s: Snapshot }) {
  const { t, tv } = useI18n();
  const [ref, w] = useMeasure<HTMLDivElement>();
  const total = Math.max(1e-9, s.burns);
  const parts: [string, number, string][] = [
    [t('burn.licenses'), s.burnLicense, 'var(--gold)'],
    [t('burn.buybacks'), s.burnBuyback, 'var(--neg)'],
    [t('burn.exitFees'), s.burnResolution, 'var(--pos)'],
    [t('burn.revocation'), s.burnRevocation, 'var(--dim)'],
  ];

  return (
    <Panel
      title={t('burn.title')}
      note={t('burn.note')}
      hint={t('burn.hint')}
    >
      <Stat
        label={t('burn.cumulative')}
        sub={tv('burn.ofHardCap', { v: pct(s.burns / HARD_CAP, 3) })}
        unit={t('unit.std')}
        big
      >
        <span className="neg">
          <Num value={s.burns} kind="compact" tau={180} />
        </span>
      </Stat>

      <div style={{ marginTop: 'var(--s3)' }}>
        <div className="barline">
          {parts.map(([label, v, c]) => (
            <i key={label} style={{ width: `${(v / total) * 100}%`, background: c }} />
          ))}
        </div>
        <div className="barkey">
          {parts.map(([label, v, c]) => (
            <span key={label}>
              <b style={{ background: c }} /> {label} {compact(v)}
            </span>
          ))}
        </div>
      </div>

      <div ref={ref} style={{ marginTop: 'var(--s3)' }}>
        <Spark
          data={s.epochs.map((e) => e.burns)}
          width={w}
          height={52}
          stroke="var(--neg)"
          fill="rgba(184,101,78,0.09)"
        />
      </div>
      <div className="cap">{t('burn.caption')}</div>
    </Panel>
  );
}

/* ------------------------------------------------------------- auctions --- */

export function LicenseAuctionPanel({ s }: { s: Snapshot }) {
  const { t, tv } = useI18n();
  const [ref, w] = useMeasure<HTMLDivElement>();
  const a = s.licenseAuction;

  return (
    <Panel
      title={t('lic.title')}
      note={t('lic.note')}
      hint={t('lic.hint')}
    >
      <div className="grid-2" style={{ gap: 'var(--s3)' }}>
        {a.soldOut ? (
          <Stat label={t('lic.todaysAuction')} sub={tv('lic.closedAt', { v: int(a.lastSale) })}>
            <span className="faint">{t('lic.soldOut')}</span>
          </Stat>
        ) : (
          <Stat label={t('lic.priceNow')} sub={tv('lic.floor', { v: int(a.floor) })}>
            <span className="gold">
              <Num value={a.price} kind="int" tau={120} />
            </span>
          </Stat>
        )}
        <Stat label={t('lic.soldToday')} sub={tv('lic.openedAt', { v: int(a.start) })}>
          <Num value={a.soldToday} kind="int" tau={200} />
          <span className="faint"> / {LICENSES_PER_DAY}</span>
        </Stat>
      </div>
      <div ref={ref} style={{ marginTop: 'var(--s3)' }}>
        <AuctionCurve
          start={a.start}
          floor={a.floor}
          progress={a.progress}
          soldOut={a.soldOut}
          closedAt={a.lastSaleAt}
          width={w}
          height={110}
        />
      </div>
      <div className="cap">
        {a.soldOut
          ? tv('lic.reopens', { v: int(a.lastSale * 2) })
          : t('lic.caption')}
      </div>
    </Panel>
  );
}

export function CharterAuctionPanel({ s }: { s: Snapshot }) {
  const { t, tv } = useI18n();
  const [ref, w] = useMeasure<HTMLDivElement>();
  const a = s.charterAuction;
  const open = a.supply > 0;
  const live = open && !a.soldOut;

  return (
    <Panel
      title={t('cha.title')}
      note={t('cha.note')}
      hint={t('cha.hint')}
    >
      <div className="grid-2" style={{ gap: 'var(--s3)' }}>
        {a.soldOut ? (
          <Stat label={t('cha.todaysAuction')} sub={tv('cha.closedAt', { v: `${dec(a.lastSale, 3)} ETH` })}>
            <span className="faint">{t('cha.soldOut')}</span>
          </Stat>
        ) : open ? (
          <Stat label={t('cha.priceNow')} sub={tv('lic.floor', { v: `${dec(a.floor, 2)} ETH` })}>
            <span className="gold">
              <Num value={a.price} kind="dec3" tau={120} />
            </span>
          </Stat>
        ) : (
          <Stat label={t('cha.priceNow')} sub={t('cha.noSaleSub')}>
            <span className="faint">{t('cha.noSale')}</span>
          </Stat>
        )}
        <Stat label={t('cha.seatsToday')} sub={t('cha.seatsSub')}>
          <Num value={a.soldToday} kind="int" tau={200} />
          <span className="faint"> / {a.supply}</span>
        </Stat>
      </div>
      <div ref={ref} style={{ marginTop: 'var(--s3)' }}>
        {open ? (
          <AuctionCurve
            start={a.start}
            floor={a.floor}
            progress={a.progress}
            soldOut={a.soldOut}
            closedAt={a.lastSaleAt}
            width={w}
            height={110}
          />
        ) : (
          <div className="empty-plot">
            <span className="kicker">{t('cha.noSeats')}</span>
          </div>
        )}
      </div>
      <div className="cap">
        {a.soldOut
          ? tv('cha.reopens', { v: `${dec(a.lastSale * 3, 3)} ETH` })
          : live
            ? t('cha.caption')
            : t('cha.captionClosed')}
      </div>
    </Panel>
  );
}

/* --------------------------------------------------------- exit pressure -- */

export function ExitPanel({ s }: { s: Snapshot }) {
  const { t, tv } = useI18n();
  const [ref, w] = useMeasure<HTMLDivElement>();
  const hot = s.stress !== 'CALM';

  return (
    <Panel
      title={t('exit.title')}
      note={t('exit.note')}
      hint={t('exit.hint')}
      alarmed={s.stress === 'RUN'}
    >
      <div className="grid-2" style={{ gap: 'var(--s3)' }}>
        <Stat label={t('exit.resolutionFee')} sub={t('exit.feeSub')} big>
          <span className={hot ? 'neg' : 'gold'}>
            <Num value={s.resolutionFee} kind="pct" tau={180} />
          </span>
        </Stat>
        <Stat
          label={t('exit.pressure')}
          sub={tv('exit.saturatesAt', { v: pct(RESOLUTION_FEE_SATURATION, 0) })}
          big
        >
          <span className={hot ? 'neg' : ''}>
            <Num value={s.exitPressure} kind="pct" tau={180} />
          </span>
        </Stat>
      </div>
      <div ref={ref} style={{ marginTop: 'var(--s3)' }}>
        <ExitCurve pressure={s.exitPressure} width={w} height={140} />
      </div>
      <div style={{ marginTop: 'var(--s2)' }}>
        <Row
          label={
            <>
              {t('exit.withdrawn')} <span className="win">{t('exit.trailing7d')}</span>
            </>
          }
          unit={t('unit.std')}
        >
          <Num value={s.withdrawn7d} kind="compact" tau={160} />
        </Row>
        <Row
          label={
            <>
              {t('exit.paidToStayers')} <span className="win">{t('exit.cumulative')}</span>
            </>
          }
          unit={t('unit.std')}
        >
          <span className="pos">
            <Num value={s.redistributed} kind="compact" tau={160} />
          </span>
        </Row>
      </div>
      <div className="cap">{t('exit.caption')}</div>
    </Panel>
  );
}

/* ----------------------------------------------------------- fee engine --- */

export function FeeEnginePanel({ s }: { s: Snapshot }) {
  const { t, tv } = useI18n();
  const [ref, w] = useMeasure<HTMLDivElement>();
  const expansion = s.regime === 'EXPANSION';

  return (
    <Panel
      title={t('fee.title')}
      note={t('fee.note')}
      hint={t('fee.hint')}
    >
      <div className="grid-2" style={{ gap: 'var(--s3)' }}>
        <Stat label={t('fee.hardReserve')} sub={tv('fee.goldSub', { v: `${dec(s.reserveEth, 2)} ETH` })}>
          <span className="gold">
            <Num value={s.reserveOz} kind="ozs" tau={200} />
          </span>
        </Stat>
        <Stat label={t('fee.pol')} sub={t('fee.polSub')}>
          <Num value={s.polEth} kind="eth" tau={200} />
        </Stat>
      </div>

      <div style={{ marginTop: 'var(--s3)' }}>
        <div className="kicker block-label">{t('fee.activeVault')}</div>
        <div className="barline">
          <i style={{ width: expansion ? '100%' : '0%', background: 'var(--pos)' }} />
          <i style={{ width: expansion ? '0%' : '100%', background: 'var(--neg)' }} />
        </div>
        <div className="barkey barkey-stack">
          <span>
            <b style={{ background: expansion ? 'var(--pos)' : 'var(--ghost)' }} />
            {t('fee.legendExpansion')}
          </span>
          <span>
            <b style={{ background: expansion ? 'var(--ghost)' : 'var(--neg)' }} />
            {t('fee.legendContraction')}
          </span>
        </div>
      </div>

      <div style={{ marginTop: 'var(--s3)' }}>
        <Row label={t('fee.expansionVault')}>
          <Num value={s.expansionVault} kind="eth3" tau={160} />
        </Row>
        <Row label={t('fee.contractionVault')}>
          <span className={s.contractionVault > 0 ? 'neg' : ''}>
            <Num value={s.contractionVault} kind="eth3" tau={160} />
          </span>
        </Row>
        <Row label={t('fee.boughtBurned')} unit={t('unit.std')}>
          <Num value={s.burnBuyback} kind="compact" tau={160} />
        </Row>
        <Row label={t('fee.collected')}>
          <Num value={s.feeEthTotal} kind="eth" tau={160} />
        </Row>
        <Row label={t('fee.team')}>
          <span className="faint">
            <Num value={s.teamEth} kind="eth" tau={160} />
          </span>
        </Row>
      </div>

      <div ref={ref} style={{ marginTop: 'var(--s3)' }}>
        <Spark data={s.epochs.map((e) => e.reserveOz)} width={w} height={40} stroke="var(--gold)" />
      </div>
      <div className="cap">{t('fee.caption')}</div>
    </Panel>
  );
}

/* ------------------------------------------------------------ epoch log --- */

export function EpochLog({ s }: { s: Snapshot }) {
  const { t, tv } = useI18n();
  const rows = s.epochs.slice(-80).reverse();

  return (
    <Panel
      title={t('log.title')}
      note={tv('log.note', { n: rows.length })}
      hint={t('log.hint')}
    >
      <div className="log-scroll">
        <table className="log">
          <thead>
            <tr>
              <th>{t('log.epoch')}</th>
              <th>{t('log.regime')}</th>
              <th>{t('log.netFlow')}</th>
              <th>{t('log.m')}</th>
              <th>{t('log.issued')}</th>
              <th>{t('log.burned')}</th>
              <th>{t('log.withdrawn')}</th>
              <th>{t('log.fee')}</th>
              <th>{t('log.lic')}</th>
              <th>{t('log.branches')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const cut = r.m < r.mBefore;
              return (
                <tr key={r.epoch} className={i === 0 ? 'is-fresh' : undefined}>
                  <td>{pad4(r.epoch)}</td>
                  <td>
                    <span className={r.regime === 'EXPANSION' ? 'tag exp' : 'tag con'}>
                      {r.regime === 'EXPANSION' ? t('log.exp') : t('log.con')}
                    </span>
                  </td>
                  <td className={r.netFlow >= 0 ? 'pos' : 'neg'}>{signed(r.netFlow, 2)}</td>
                  <td className={cut ? 'neg' : r.m > r.mBefore ? 'pos' : 'dim'}>
                    {r.m.toFixed(2)}
                    {cut ? ' ↓' : r.m > r.mBefore ? ' ↑' : ''}
                  </td>
                  <td className="dim">{compact(r.issuedInEpoch)}</td>
                  <td className="neg">{compact(r.burnedInEpoch)}</td>
                  <td className="dim">{compact(r.withdrawnInEpoch)}</td>
                  <td className={r.resolutionFee > 0.05 ? 'neg' : 'dim'}>
                    {pct(r.resolutionFee, 2)}
                  </td>
                  <td className="dim">{r.licensesSold}</td>
                  <td>{int(r.branches)}</td>
                </tr>
              );
            })}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={10} className="faint" style={{ textAlign: 'left' }}>
                  {t('log.empty')}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <div className="cap">{t('log.units')}</div>
    </Panel>
  );
}

/* ----------------------------------------------------------- event feed --- */

const TONE = ['tone-neg', '', 'tone-pos'] as const;

export function EventFeed({ s }: { s: Snapshot }) {
  const { t, ev } = useI18n();
  return (
    <Panel
      title={t('feed.title')}
      note={t('feed.note')}
      hint={t('feed.hint')}
    >
      <div className="feed">
        {s.events.map((e) => (
          <div className={`feed-row ${TONE[e.tone + 1]}`} key={e.id}>
            <span className="t">{stamp(e.epoch, e.hour)}</span>
            <span className="k">{t(`kind.${e.kind}` as DictKey)}</span>
            <span className="m">{ev(e)}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

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
import { AuctionCurve, ExitCurve, HeroChart, Spark } from './charts';
import { Hint } from './Hint';
import { Num } from './Num';
import { Panel, Row, Stat } from './Panel';
import { useMeasure } from './useMeasure';

/* ---------------------------------------------------------------- hero --- */

export function Hero({ s }: { s: Snapshot }) {
  const [ref, w] = useMeasure<HTMLDivElement>();
  const positive = s.netFlowEpoch >= 0;

  return (
    <section className="hero">
      <div className="hero-head">
        <div>
          <div className="kicker">
            NET ETH FLOW
            <Hint text="Every buy puts ETH into the pool and every sell takes it out. The difference across an epoch is the only input the bank has." />
          </div>
          <span className={positive ? 'hero-figure pos' : 'hero-figure neg'}>
            <Num value={s.netFlowEpoch} kind="signedEth" tau={150} />
          </span>
        </div>
        <div>
          <div className="kicker">
            POLICY RATE
            <Hint text="How much $STANDARD the bank issues, as a multiple of its base rate. Cuts land at once, raises are earned one epoch at a time." />
          </div>
          <span className="hero-figure gold">
            <Num value={s.m} kind="mult" tau={240} />
          </span>
        </div>
        <div className="hero-legend">
          <span className="legend-item">
            <i className="swatch pos" /> INFLOW EPOCH
          </span>
          <span className="legend-item">
            <i className="swatch neg" /> OUTFLOW EPOCH
          </span>
          <span className="legend-item">
            <i className="swatch" /> MULTIPLIER m
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
      <div className="cap">
        SIXTY EPOCHS. BARS ARE NET ETH FLOW, THE LINE BENEATH IS THE ISSUANCE MULTIPLIER, AND EACH
        RED TICK IS AN EPOCH THE RATE WAS CUT.
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- supply --- */

export function SupplyPanel({ s }: { s: Snapshot }) {
  const [ref, w] = useMeasure<HTMLDivElement>();
  const mints = s.mintedWithdrawal + s.mintedSettlement;

  return (
    <Panel
      title="SUPPLY IDENTITY"
      note="WHITEPAPER 3.1"
      hint="Tokens only come into existence when a banker withdraws. Everything else is a ledger entry, so circulating supply is a receipt of what has actually been taken out of the bank."
    >
      <div className="identity">
        <span className="l">GENESIS LIQUIDITY</span>
        <span className="r">{int(GENESIS_POL)}</span>
        <span className="l">
          <span className="op">+</span> MINTS
        </span>
        <span className="r">
          <Num value={mints} kind="int" tau={160} />
        </span>
        <span className="l faint" style={{ paddingLeft: 12 }}>
          AT WITHDRAWAL
        </span>
        <span className="r faint">
          <Num value={s.mintedWithdrawal} kind="int" tau={160} />
        </span>
        <span className="l faint" style={{ paddingLeft: 12 }}>
          SETTLED AND BURNED
        </span>
        <span className="r faint">
          <Num value={s.mintedSettlement} kind="int" tau={160} />
        </span>
        <span className="l">
          <span className="op">-</span> CUMULATIVE BURNS
        </span>
        <span className="r neg">
          <Num value={s.burns} kind="int" tau={160} />
        </span>
        <span className="l sum">CIRCULATING</span>
        <span className="r sum">
          <Num value={s.circulating} kind="int" tau={160} />
        </span>
      </div>

      <div style={{ marginTop: 'var(--s3)' }}>
        <Row label="MAX SUPPLY, 1B MINUS BURNS">
          <Num value={s.maxSupply} kind="int" tau={160} />
        </Row>
        <Row label="ISSUED TO LEDGER, OF 900M">
          <Num value={s.issued} kind="compact" tau={160} />
        </Row>
        <Row label="HELD AT THE BANK">
          <Num value={s.ledgerHeld} kind="compact" tau={160} />
        </Row>
        <Row label="OUTSIDE THE POOL">
          <Num value={s.outsideStd} kind="compact" tau={160} />
        </Row>
        <Row label="HARD BACKING PER TOKEN">
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
      <div className="cap">CIRCULATING SUPPLY IS A RECEIPT</div>

      <div className="proof">
        <i /> IDENTITY HOLDS · DRIFT {s.identityDrift.toFixed(7)}
      </div>
    </Panel>
  );
}

/* ---------------------------------------------------------- burn ledger --- */

export function BurnPanel({ s }: { s: Snapshot }) {
  const [ref, w] = useMeasure<HTMLDivElement>();
  const total = Math.max(1e-9, s.burns);
  const parts: [string, number, string][] = [
    ['LICENSES', s.burnLicense, 'var(--gold)'],
    ['BUYBACKS', s.burnBuyback, 'var(--neg)'],
    ['EXIT FEES', s.burnResolution, 'var(--pos)'],
    ['REVOCATION', s.burnRevocation, 'var(--dim)'],
  ];

  return (
    <Panel
      title="BURN LEDGER"
      note="BURNED TOKENS ARE GONE FOREVER"
      hint="Four ways a token dies: paying for a new branch, a buyback during contraction, half of every exit fee, and half of a dormant banker's balance."
    >
      <Stat label="CUMULATIVE BURNS" sub={`${pct(s.burns / HARD_CAP, 3)} OF THE HARD CAP`} big>
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
      <div className="cap">MAX SUPPLY, STRICTLY NON INCREASING</div>
    </Panel>
  );
}

/* ------------------------------------------------------------- auctions --- */

export function LicenseAuctionPanel({ s }: { s: Snapshot }) {
  const [ref, w] = useMeasure<HTMLDivElement>();
  const a = s.licenseAuction;

  return (
    <Panel
      title="LICENSE AUCTION"
      note="PAID IN $STANDARD · 100% BURNED"
      hint="A hundred licenses a day. The price opens high and falls toward a floor across twenty four hours, so whoever steps in first sets the price. Everything paid is destroyed."
    >
      <div className="grid-2" style={{ gap: 'var(--s3)' }}>
        {a.soldOut ? (
          <Stat label="TODAY'S AUCTION" sub={`CLOSED AT ${int(a.lastSale)}`}>
            <span className="faint">SOLD OUT</span>
          </Stat>
        ) : (
          <Stat label="PRICE NOW" sub={`FLOOR ${int(a.floor)}`}>
            <span className="gold">
              <Num value={a.price} kind="int" tau={120} />
            </span>
          </Stat>
        )}
        <Stat label="SOLD TODAY" sub={`OPENED AT ${int(a.start)}`}>
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
          ? `REOPENS NEXT EPOCH · OPENS AT 2x LAST, ${int(a.lastSale * 2)}`
          : 'THE FLOOR SCALES WITH THE RATE, SO EXPANDING COSTS MORE IN EXPANSION AND LESS IN CONTRACTION.'}
      </div>
    </Panel>
  );
}

export function CharterAuctionPanel({ s }: { s: Snapshot }) {
  const [ref, w] = useMeasure<HTMLDivElement>();
  const a = s.charterAuction;
  const open = a.supply > 0;
  const live = open && !a.soldOut;

  return (
    <Panel
      title="CHARTER AUCTION"
      note="PAID IN ETH · ROUTES TO THE FEE ENGINE"
      hint="A charter is a seat at the bank. New ones are sold for ETH on the same falling price curve, and how many are offered each day is a policy decision that starts at zero."
    >
      <div className="grid-2" style={{ gap: 'var(--s3)' }}>
        {a.soldOut ? (
          <Stat label="TODAY'S AUCTION" sub={`CLOSED AT ${dec(a.lastSale, 3)} ETH`}>
            <span className="faint">SOLD OUT</span>
          </Stat>
        ) : open ? (
          <Stat label="PRICE NOW" sub={`FLOOR ${dec(a.floor, 2)} ETH`}>
            <span className="gold">
              <Num value={a.price} kind="dec3" tau={120} />
            </span>
          </Stat>
        ) : (
          <Stat label="PRICE NOW" sub="POLICY HAS NOT ENABLED A SALE">
            <span className="faint">NO SALE</span>
          </Stat>
        )}
        <Stat label="SEATS TODAY" sub="POLICY CONTROLLED, STARTS AT ZERO">
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
            <span className="kicker">NO SEATS OFFERED THIS EPOCH</span>
          </div>
        )}
      </div>
      <div className="cap">
        {a.soldOut
          ? `REOPENS NEXT EPOCH · OPENS AT 3x LAST, ${dec(a.lastSale * 3, 3)} ETH`
          : live
            ? 'A CHARTER LIVES UNTIL ITS LAST BRANCH IS RETIRED. THERE ARE NO REVOLVING DOORS.'
            : 'CHARTER SALES ARE POLICY CONTROLLED. SEATS ARE OFFERED DURING SUSTAINED EXPANSION.'}
      </div>
    </Panel>
  );
}

/* --------------------------------------------------------- exit pressure -- */

export function ExitPanel({ s }: { s: Snapshot }) {
  const [ref, w] = useMeasure<HTMLDivElement>();
  const hot = s.stress !== 'CALM';

  return (
    <Panel
      title="EXIT PRESSURE AND THE RESOLUTION FEE"
      note="WHITEPAPER 9.1"
      hint="The more of the bank tries to leave in a week, the more leaving costs. Half of the fee is burned and half is paid to the bankers who stayed, so a run transfers value to the patient."
      alarmed={s.stress === 'RUN'}
    >
      <div className="grid-2" style={{ gap: 'var(--s3)' }}>
        <Stat label="RESOLUTION FEE" sub="HALF BURNED, HALF TO THE STAYERS" big>
          <span className={hot ? 'neg' : 'gold'}>
            <Num value={s.resolutionFee} kind="pct" tau={180} />
          </span>
        </Stat>
        <Stat
          label="7 DAY EXIT PRESSURE"
          sub={`SATURATES AT ${pct(RESOLUTION_FEE_SATURATION, 0)}`}
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
              WITHDRAWN <span className="win">· TRAILING 7D</span>
            </>
          }
        >
          <Num value={s.withdrawn7d} kind="compact" tau={160} />
        </Row>
        <Row
          label={
            <>
              PAID TO STAYERS <span className="win">· CUMULATIVE</span>
            </>
          }
        >
          <span className="pos">
            <Num value={s.redistributed} kind="compact" tau={160} />
          </span>
        </Row>
      </div>
      <div className="cap">
        WITHDRAWALS ARE NEVER PAUSED OR QUEUED. THE COST OF LEAVING IS THE ONLY CONTROL.
      </div>
    </Panel>
  );
}

/* ----------------------------------------------------------- fee engine --- */

export function FeeEnginePanel({ s }: { s: Snapshot }) {
  const [ref, w] = useMeasure<HTMLDivElement>();
  const expansion = s.regime === 'EXPANSION';

  return (
    <Panel
      title="FEE ENGINE, RESERVES, DEFENCE"
      note="70 / 15 / 15"
      hint="Every swap pays a fee in ETH. Seventy per cent goes to whichever vault the epoch calls for, fifteen to liquidity that can never be pulled, fifteen to the team."
    >
      <div className="grid-2" style={{ gap: 'var(--s3)' }}>
        <Stat label="HARD RESERVE" sub={`${dec(s.reserveEth, 2)} ETH OF TOKENIZED GOLD`}>
          <span className="gold">
            <Num value={s.reserveOz} kind="ozs" tau={200} />
          </span>
        </Stat>
        <Stat label="PROTOCOL OWNED LIQUIDITY" sub="PAIRED AND ADDED FOREVER">
          <Num value={s.polEth} kind="eth" tau={200} />
        </Stat>
      </div>

      <div style={{ marginTop: 'var(--s3)' }}>
        <div className="kicker block-label">ACTIVE VAULT THIS EPOCH</div>
        <div className="barline">
          <i style={{ width: expansion ? '100%' : '0%', background: 'var(--pos)' }} />
          <i style={{ width: expansion ? '0%' : '100%', background: 'var(--neg)' }} />
        </div>
        <div className="barkey barkey-stack">
          <span>
            <b style={{ background: expansion ? 'var(--pos)' : 'var(--ghost)' }} />
            EXPANSION · STACKS GOLD
          </span>
          <span>
            <b style={{ background: expansion ? 'var(--ghost)' : 'var(--neg)' }} />
            CONTRACTION · BUYBACK + BURN
          </span>
        </div>
      </div>

      <div style={{ marginTop: 'var(--s3)' }}>
        <Row label="EXPANSION VAULT">
          <Num value={s.expansionVault} kind="eth3" tau={160} />
        </Row>
        <Row label="CONTRACTION VAULT">
          <span className={s.contractionVault > 0 ? 'neg' : ''}>
            <Num value={s.contractionVault} kind="eth3" tau={160} />
          </span>
        </Row>
        <Row label="BOUGHT BACK AND BURNED">
          <Num value={s.burnBuyback} kind="compact" tau={160} />
        </Row>
        <Row label="FEES COLLECTED">
          <Num value={s.feeEthTotal} kind="eth" tau={160} />
        </Row>
        <Row label="TEAM">
          <span className="faint">
            <Num value={s.teamEth} kind="eth" tau={160} />
          </span>
        </Row>
      </div>

      <div ref={ref} style={{ marginTop: 'var(--s3)' }}>
        <Spark data={s.epochs.map((e) => e.reserveOz)} width={w} height={40} stroke="var(--gold)" />
      </div>
      <div className="cap">HARD RESERVE, CUMULATIVE</div>
    </Panel>
  );
}

/* ------------------------------------------------------------ epoch log --- */

export function EpochLog({ s }: { s: Snapshot }) {
  const rows = s.epochs.slice(-80).reverse();

  return (
    <Panel
      title="EPOCH LOG"
      note={`${rows.length} CLOSING SUMMARIES`}
      hint="One line per closed epoch: what flowed, what policy did about it, what was issued and what was destroyed."
    >
      <div className="log-scroll">
        <table className="log">
          <thead>
            <tr>
              <th>EPOCH</th>
              <th>REGIME</th>
              <th>NET FLOW</th>
              <th>m</th>
              <th>ISSUED</th>
              <th>BURNED</th>
              <th>WITHDRAWN</th>
              <th>FEE</th>
              <th>LIC</th>
              <th>BRANCHES</th>
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
                      {r.regime === 'EXPANSION' ? 'EXP' : 'CON'}
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
                  THE FIRST EPOCH HAS NOT CLOSED YET
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ----------------------------------------------------------- event feed --- */

const TONE = ['tone-neg', '', 'tone-pos'] as const;

export function EventFeed({ s }: { s: Snapshot }) {
  return (
    <Panel
      title="PROTOCOL EVENTS"
      note="MOST RECENT FIRST"
      hint="Everything the bank has done, newest first. The same stream runs along the bottom of the page."
    >
      <div className="feed">
        {s.events.map((e) => (
          <div className={`feed-row ${TONE[e.tone + 1]}`} key={e.id}>
            <span className="t">{stamp(e.epoch, e.hour)}</span>
            <span className="k">{e.kind}</span>
            <span className="m">{e.text}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

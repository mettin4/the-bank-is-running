import { M_CEILING, M_FLOOR, RESOLUTION_FEE_CEILING, RESOLUTION_FEE_FLOOR, RESOLUTION_FEE_SATURATION } from '../engine/constants';
import { dutchPrice, resolutionFee } from '../engine/policy';
import type { EpochRecord } from '../engine/types';
import { useI18n } from '../i18n';

/* ------------------------------------------------------------------ hero -- */

interface HeroProps {
  epochs: EpochRecord[];
  liveEpoch: number;
  liveFlow: number;
  liveM: number;
  width: number;
  height: number;
}

/**
 * Net flow per epoch as bars, the policy multiplier as a step line beneath.
 * Two plots rather than two axes on one, so neither scale lies about the other.
 */
export function HeroChart({ epochs, liveEpoch, liveFlow, liveM, width, height }: HeroProps) {
  const { t } = useI18n();
  const PAD_L = 52;
  const PAD_R = 8;
  const PAD_T = 12;
  const PAD_B = 30;
  /** Room for the hairline that separates the two strips. */
  const SPLIT = 30;

  if (width < 80) return <svg className="chart" height={height} />;

  const innerW = Math.max(10, width - PAD_L - PAD_R);
  const innerH = Math.max(10, height - PAD_T - PAD_B);

  // Two strips, each with its own axis. Nothing is plotted across both.
  const plots = innerH - SPLIT;
  const hA = plots * 0.65;
  const hB = plots * 0.35;
  const aTop = PAD_T;
  const aBot = aTop + hA;
  const splitY = aBot + SPLIT / 2;
  const bTop = aBot + SPLIT;
  const bBot = bTop + hB;

  // A fixed sixty slot window that scrolls, so the plot is never mostly empty
  // and a bar never changes width as history accumulates.
  const WINDOW = 60;
  const recent = epochs.slice(-(WINDOW - 1));
  const bars: { epoch: number; flow: number; m: number; cut: boolean; live: boolean }[] = recent.map(
    (r) => ({ epoch: r.epoch, flow: r.netFlow, m: r.m, cut: r.m < r.mBefore, live: false }),
  );
  bars.push({ epoch: liveEpoch, flow: liveFlow, m: liveM, cut: false, live: true });

  const n = bars.length;
  const step = innerW / WINDOW;
  const offset = WINDOW - n; // right aligned: the newest epoch owns the last slot
  const slot = (i: number) => PAD_L + (offset + i) * step;
  const bw = Math.max(1.5, Math.min(14, step - 2));

  const maxUp = Math.max(1e-6, ...bars.map((b) => Math.max(0, b.flow)));
  const maxDn = Math.max(1e-6, ...bars.map((b) => Math.max(0, -b.flow)));
  const zeroY = aTop + (maxUp / (maxUp + maxDn)) * hA;
  const yFlow = (v: number) =>
    v >= 0 ? zeroY - (v / maxUp) * (zeroY - aTop) : zeroY + (-v / maxDn) * (aBot - zeroY);

  // A little headroom under the floor, so a multiplier pinned at 0.20 reads as a
  // line rather than disappearing into the axis.
  const FLOOR_PAD = 7;
  const yM = (v: number) =>
    bBot - FLOOR_PAD - ((v - M_FLOOR) / (M_CEILING - M_FLOOR)) * (hB - FLOOR_PAD);

  // Policy is a step function, so it is drawn as one.
  let d = '';
  bars.forEach((b, i) => {
    const x0 = slot(i);
    const x1 = x0 + step;
    const y = yM(b.m);
    d += i === 0 ? `M${x0.toFixed(1)},${y.toFixed(1)}` : `L${x0.toFixed(1)},${y.toFixed(1)}`;
    d += `L${x1.toFixed(1)},${y.toFixed(1)}`;
  });

  const lastX = slot(n - 1) + step / 2;

  return (
    <svg
      className="chart"
      width={width}
      height={height}
      role="img"
      aria-label={t('hero.alt')}
    >
      {/* strip one: net ETH flow */}
      <line className="c-grid" x1={PAD_L} y1={aTop} x2={PAD_L + innerW} y2={aTop} />
      <line className="c-grid" x1={PAD_L} y1={aBot} x2={PAD_L + innerW} y2={aBot} />
      <line className="c-axis" x1={PAD_L} y1={zeroY} x2={PAD_L + innerW} y2={zeroY} />

      <text className="c-label" x={PAD_L - 8} y={aTop + 4} textAnchor="end">
        {`+${maxUp.toFixed(0)}`}
      </text>
      <text className="c-label" x={PAD_L - 8} y={zeroY + 3} textAnchor="end">
        0
      </text>
      <text className="c-label" x={PAD_L - 8} y={aBot + 2} textAnchor="end">
        {`-${maxDn.toFixed(0)}`}
      </text>
      <text className="c-strip" x={PAD_L} y={aTop - 3}>
        {t('hero.netFlow')}
      </text>

      {bars.map((b, i) => {
        const x = slot(i) + (step - bw) / 2;
        const y = yFlow(b.flow);
        return (
          <rect
            key={`${b.epoch}-${i}`}
            x={x}
            y={b.flow >= 0 ? y : zeroY}
            width={bw}
            height={Math.max(1, Math.abs(y - zeroY))}
            fill={b.flow >= 0 ? 'var(--pos)' : 'var(--neg)'}
            opacity={b.live ? 0.4 : 0.85}
          />
        );
      })}

      {/* the hairline that separates the two strips */}
      <line className="c-split" x1={0} y1={splitY} x2={width} y2={splitY} />

      {/* strip two: the policy multiplier */}
      <line className="c-grid" x1={PAD_L} y1={yM(M_CEILING)} x2={PAD_L + innerW} y2={yM(M_CEILING)} />
      <line className="c-grid" x1={PAD_L} y1={yM(1)} x2={PAD_L + innerW} y2={yM(1)} />
      <line className="c-axis" x1={PAD_L} y1={bBot} x2={PAD_L + innerW} y2={bBot} />

      <text className="c-label" x={PAD_L - 8} y={yM(M_CEILING) + 3} textAnchor="end">
        {M_CEILING.toFixed(2)}
      </text>
      <text className="c-label" x={PAD_L - 8} y={yM(M_FLOOR) + 3} textAnchor="end">
        {M_FLOOR.toFixed(2)}
      </text>
      <text className="c-strip" x={PAD_L} y={bTop - 3}>
        {t('hero.multiplier')}
      </text>

      <path className="c-line" d={d} stroke="var(--gold)" />

      {/* every epoch the rate was cut gets a mark on the multiplier strip */}
      {bars.map((b, i) =>
        b.cut ? (
          <rect
            key={`cut-${b.epoch}`}
            x={slot(i) + step / 2 - 0.75}
            y={bBot + 4}
            width={1.5}
            height={4}
            fill="var(--neg)"
          />
        ) : null,
      )}

      <circle className="c-dot" cx={lastX} cy={yM(liveM)} r={3} fill="var(--gold)" />

      <text className="c-label" x={slot(0)} y={height - 4}>
        {`EPOCH ${String(bars[0].epoch).padStart(4, '0')}`}
      </text>
      <text className="c-label" x={PAD_L + innerW} y={height - 4} textAnchor="end">
        {`EPOCH ${String(liveEpoch).padStart(4, '0')}`}
      </text>
    </svg>
  );
}

/* --------------------------------------------------------------- auction -- */

interface AuctionProps {
  start: number;
  floor: number;
  progress: number;
  width: number;
  height: number;
  tone?: string;
  /** The day is over. The curve goes quiet and the closing sale is marked. */
  soldOut?: boolean;
  /** Where the closing sale landed on the curve, 0..1. */
  closedAt?: number;
}

/**
 * The live decay curve with a dot on the current price. Once the day's supply
 * is gone the curve dims and the dot stops moving, sitting on the sale that
 * closed the auction.
 */
export function AuctionCurve({
  start,
  floor,
  progress,
  width,
  height,
  tone = 'var(--gold)',
  soldOut = false,
  closedAt = 0,
}: AuctionProps) {
  const { t } = useI18n();
  const PAD_T = 8;
  const PAD_B = 16;
  const PAD_L = 2;
  const PAD_R = 2;
  if (width < 60) return <svg className="chart" height={height} />;

  const w = width - PAD_L - PAD_R;
  const h = height - PAD_T - PAD_B;
  const top = Math.max(start, floor * 1.02);
  const bottom = floor * 0.94;

  const y = (v: number) => PAD_T + h - ((v - bottom) / Math.max(1e-12, top - bottom)) * h;
  const x = (t: number) => PAD_L + t * w;

  const pts: string[] = [];
  for (let i = 0; i <= 48; i++) {
    const t = i / 48;
    pts.push(`${x(t).toFixed(1)},${y(dutchPrice(start, floor, t)).toFixed(1)}`);
  }

  const at = soldOut ? closedAt : progress;
  const cx = x(at);
  const cy = y(dutchPrice(start, floor, at));

  return (
    <svg
      className="chart"
      width={width}
      height={height}
      role="img"
      aria-label={soldOut ? t('curve.altClosed') : t('curve.altLive')}
    >
      <line className="c-grid" x1={PAD_L} y1={y(floor)} x2={PAD_L + w} y2={y(floor)} />
      <polyline
        className="c-line"
        points={pts.join(' ')}
        stroke={tone}
        opacity={soldOut ? 0.28 : 0.85}
      />
      {soldOut ? null : <line className="c-grid" x1={cx} y1={PAD_T} x2={cx} y2={PAD_T + h} />}
      {soldOut ? <circle cx={cx} cy={cy} r={6.5} fill="none" stroke={tone} strokeWidth={1} opacity={0.5} /> : null}
      <circle className="c-dot" cx={cx} cy={cy} r={3.5} fill={tone} />
      <text className="c-label" x={PAD_L} y={height - 3}>
        {t('curve.open')}
      </text>
      <text className="c-label" x={PAD_L + w} y={height - 3} textAnchor="end">
        {t('curve.close')}
      </text>
      <text className="c-label" x={PAD_L + w} y={y(floor) - 5} textAnchor="end">
        {t('curve.floor')}
      </text>
    </svg>
  );
}

/* ----------------------------------------------------------- exit curve -- */

interface ExitProps {
  pressure: number;
  width: number;
  height: number;
}

/** The quadratic fee curve, with the bank's live position marked on it. */
export function ExitCurve({ pressure, width, height }: ExitProps) {
  const { t } = useI18n();
  const PAD_T = 10;
  const PAD_B = 18;
  const PAD_L = 34;
  const PAD_R = 6;
  if (width < 80) return <svg className="chart" height={height} />;

  const w = width - PAD_L - PAD_R;
  const h = height - PAD_T - PAD_B;
  const xMax = RESOLUTION_FEE_SATURATION * 1.2;

  const x = (p: number) => PAD_L + (Math.min(p, xMax) / xMax) * w;
  const y = (f: number) => PAD_T + h - (f / RESOLUTION_FEE_CEILING) * h;

  const pts: string[] = [];
  for (let i = 0; i <= 64; i++) {
    const p = (i / 64) * xMax;
    pts.push(`${x(p).toFixed(1)},${y(resolutionFee(p)).toFixed(1)}`);
  }

  const marks: [string, number][] = [
    [t('exit.quiet'), 0.02],
    [t('exit.elevated'), 0.1],
    [t('exit.heavy'), 0.2],
    [t('exit.run'), RESOLUTION_FEE_SATURATION],
  ];

  const cx = x(pressure);
  const cy = y(resolutionFee(pressure));
  const hot = pressure >= 0.17;

  return (
    <svg className="chart" width={width} height={height} role="img" aria-label={t('exit.curveAlt')}>
      <line className="c-grid" x1={PAD_L} y1={y(RESOLUTION_FEE_CEILING)} x2={PAD_L + w} y2={y(RESOLUTION_FEE_CEILING)} />
      <line className="c-axis" x1={PAD_L} y1={y(RESOLUTION_FEE_FLOOR)} x2={PAD_L + w} y2={y(RESOLUTION_FEE_FLOOR)} />

      <text className="c-label" x={PAD_L - 6} y={y(RESOLUTION_FEE_CEILING) + 4} textAnchor="end">
        {`${(RESOLUTION_FEE_CEILING * 100).toFixed(0)}%`}
      </text>
      <text className="c-label" x={PAD_L - 6} y={y(RESOLUTION_FEE_FLOOR) + 2} textAnchor="end">
        0%
      </text>

      {marks.map(([label, p]) => (
        <g key={label}>
          <line className="c-grid" x1={x(p)} y1={PAD_T} x2={x(p)} y2={PAD_T + h} />
          <text className="c-label" x={x(p)} y={height - 4} textAnchor="middle">
            {label}
          </text>
        </g>
      ))}

      <polyline className="c-line" points={pts.join(' ')} stroke="var(--gold)" opacity={0.9} />

      <line
        x1={cx}
        y1={cy}
        x2={cx}
        y2={PAD_T + h}
        stroke={hot ? 'var(--neg)' : 'var(--line-hard)'}
        strokeWidth={1}
        strokeDasharray="2 3"
      />
      <circle className="c-dot" cx={cx} cy={cy} r={hot ? 5 : 3.5} fill={hot ? 'var(--neg)' : 'var(--gold)'} />
    </svg>
  );
}

/* -------------------------------------------------------------- spark ----- */

interface SparkProps {
  data: number[];
  width: number;
  height: number;
  stroke?: string;
  fill?: string;
  logScale?: boolean;
}

export function Spark({ data, width, height, stroke = 'var(--gold)', fill, logScale }: SparkProps) {
  if (width < 20 || data.length < 2) return <svg className="chart" height={height} />;
  const vals = logScale ? data.map((v) => Math.log(Math.max(1e-18, v))) : data;
  let lo = Infinity;
  let hi = -Infinity;
  for (const v of vals) {
    if (v < lo) lo = v;
    if (v > hi) hi = v;
  }
  const span = hi - lo || 1;
  const pad = 3;
  const h = height - pad * 2;
  const x = (i: number) => (i / (vals.length - 1)) * width;
  const y = (v: number) => pad + h - ((v - lo) / span) * h;

  const line = vals.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const area = `${x(0)},${height} ${line} ${x(vals.length - 1)},${height}`;

  return (
    <svg className="chart" width={width} height={height} aria-hidden="true">
      {fill ? <polygon className="c-area" points={area} fill={fill} /> : null}
      <polyline className="c-line" points={line} stroke={stroke} />
    </svg>
  );
}

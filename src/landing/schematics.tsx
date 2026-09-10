import { useI18n } from '../i18n';
import { GAP_TRACED, towerParts } from '../components/TowerMark';

/**
 * Six schematics in the terminal's chart language: hairline strokes that never
 * thicken when the box scales, mono labels, dotted guides, no illustration.
 *
 * Every stroked element carries vectorEffect="non-scaling-stroke" so a 1.25px
 * line stays 1.25px whatever width the card is given.
 */
const VB = '0 0 360 200';

function Frame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <svg className="lschem" viewBox={VB} role="img" aria-label={label} focusable="false">
      {children}
    </svg>
  );
}

const hair = { vectorEffect: 'non-scaling-stroke' as const };

/* --------------------------------------------------- 1. the authority ---- */

/**
 * The protocol's own towers, the same geometry as the header mark, blown up
 * and left as an outline. Scale 7 takes the 24 unit field to 150.5 units tall;
 * the translate centres it on x = 180 and leaves room under it for a tag.
 */
const TOWER_S = 7;
const TOWER_T = `translate(${180 - 12 * TOWER_S} 9.5) scale(${TOWER_S})`;
const TOWER = towerParts(GAP_TRACED);

export function SchemaBank() {
  const { t } = useI18n();

  return (
    <Frame label={t('land.alt1')}>
      <g transform={TOWER_T} className="ls-line" fill="none" stroke="var(--text)">
        <path d={TOWER.west} {...hair} />
        <path d={TOWER.east} {...hair} />
        <rect {...TOWER.bridge} {...hair} />
      </g>

      {/* tags, on leader lines that stop clear of the outline */}
      <line x1="20" y1="76" x2="136" y2="76" className="ls-grid" {...hair} />
      <text x="20" y="68" className="ls-label">
        {t('land.tag.autonomous')}
      </text>
      <line x1="224" y1="120" x2="340" y2="120" className="ls-grid" {...hair} />
      <text x="340" y="112" className="ls-label" textAnchor="end">
        {t('land.tag.immutable')}
      </text>
    </Frame>
  );
}

/* --------------------------------------------------- 2. the one input ---- */

export function SchemaFlow() {
  const { t } = useI18n();

  return (
    <Frame label={t('land.alt2')}>
      {/* the pool */}
      <path
        d="M132 54 H228 L214 106 H146 Z"
        className="ls-line"
        stroke="var(--text)"
        fill="none"
        {...hair}
      />
      <line x1="137" y1="74" x2="223" y2="74" className="ls-grid" {...hair} />
      <text x="180" y="126" className="ls-label" textAnchor="middle">
        {t('land.tag.pool')}
      </text>

      {/* in */}
      <line x1="34" y1="68" x2="118" y2="68" className="ls-line" stroke="var(--pos)" {...hair} />
      <path d="M118 68 L109 63.5 L109 72.5 Z" fill="var(--pos)" />
      <text x="34" y="58" className="ls-label" fill="var(--pos)">
        {t('land.tag.in')}
      </text>

      {/* out */}
      <line x1="242" y1="92" x2="326" y2="92" className="ls-line" stroke="var(--neg)" {...hair} />
      <path d="M326 92 L317 87.5 L317 96.5 Z" fill="var(--neg)" />
      <text x="326" y="82" className="ls-label" fill="var(--neg)" textAnchor="end">
        {t('land.tag.out')}
      </text>

      {/* the single needle, well clear of the pool */}
      <path
        d="M136 182 A 44 44 0 0 1 224 182"
        className="ls-line"
        stroke="var(--line-hard)"
        fill="none"
        {...hair}
      />
      <line x1="180" y1="182" x2="205" y2="157" className="ls-line" stroke="var(--gold)" {...hair} />
      <circle cx="180" cy="182" r="3" fill="var(--gold)" />
      <text x="180" y="198" className="ls-label" textAnchor="middle">
        {t('land.tag.net')}
      </text>
    </Frame>
  );
}

/* ------------------------------------------------- 3. loosen and stack ---- */

const UP = 'M28 150 H62 V138 H96 V126 H130 V112 H164 V96 H198 V78 H232';

export function SchemaLoosen() {
  const { t } = useI18n();
  const bars = [0, 1, 2];

  return (
    <Frame label={t('land.alt3')}>
      <line x1="28" y1="164" x2="232" y2="164" className="ls-grid" {...hair} />
      <line x1="28" y1="78" x2="232" y2="78" className="ls-grid" {...hair} />
      <path d={UP} className="ls-line" stroke="var(--gold)" fill="none" {...hair} />
      <circle cx="232" cy="78" r="3.5" fill="var(--gold)" />
      <text x="28" y="184" className="ls-label">
        {t('land.tag.rate')}
      </text>

      {/* the vault fills */}
      <rect x="262" y="88" width="72" height="76" className="ls-line" fill="none" stroke="var(--text)" {...hair} />
      <line x1="262" y1="104" x2="334" y2="104" className="ls-grid" {...hair} />
      {bars.map((i) => (
        <rect
          key={i}
          x={270 + (i % 2) * 4}
          y={152 - i * 14}
          width={56 - (i % 2) * 8}
          height="10"
          fill="var(--gold)"
          opacity={0.85 - i * 0.18}
        />
      ))}
      <text x="298" y="184" className="ls-label" textAnchor="middle">
        {t('land.tag.reserve')}
      </text>
    </Frame>
  );
}

/* ---------------------------------------------------- 4. cut and burn ---- */

const DOWN = 'M28 74 H62 V82 H96 V78 H130 V150 H164 V156 H198 V160 H232';

export function SchemaCut() {
  const { t } = useI18n();

  return (
    <Frame label={t('land.alt4')}>
      <line x1="28" y1="164" x2="232" y2="164" className="ls-grid" {...hair} />
      <line x1="28" y1="74" x2="232" y2="74" className="ls-grid" {...hair} />
      <path d={DOWN} className="ls-line" stroke="var(--neg)" fill="none" {...hair} />
      <line x1="130" y1="78" x2="130" y2="150" className="ls-line" stroke="var(--neg)" strokeDasharray="2 3" {...hair} />
      <circle cx="232" cy="160" r="3.5" fill="var(--neg)" />
      <text x="28" y="184" className="ls-label">
        {t('land.tag.rate')}
      </text>

      {/* tokens fall into the burn */}
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={282 + i * 16} cy={82} r="4" className="ls-line" fill="none" stroke="var(--neg)" {...hair} />
      ))}
      <path
        d="M262 100 H334 L306 146 H290 Z"
        className="ls-line"
        stroke="var(--neg)"
        fill="none"
        {...hair}
      />
      <line x1="298" y1="146" x2="298" y2="162" className="ls-line" stroke="var(--neg)" strokeDasharray="2 3" {...hair} />
      <text x="298" y="184" className="ls-label" fill="var(--neg)" textAnchor="middle">
        {t('land.tag.burn')}
      </text>
    </Frame>
  );
}

/* ------------------------------------------------- 5. the door is priced -- */

/** Quadratic from a low floor to a ceiling, the shape the whitepaper specifies. */
function feeCurve(): string {
  const pts: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const p = i / 40;
    const x = 34 + p * 190;
    const y = 112 - p * p * 82;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(' ');
}

export function SchemaRun() {
  const { t } = useI18n();
  const at = 0.72;
  const dotX = 34 + at * 190;
  const dotY = 112 - at * at * 82;

  return (
    <Frame label={t('land.alt5')}>
      {/* the fee curve */}
      <line x1="34" y1="30" x2="224" y2="30" className="ls-grid" {...hair} />
      <line x1="34" y1="112" x2="224" y2="112" className="ls-line" stroke="var(--line-hard)" {...hair} />
      <polyline points={feeCurve()} className="ls-line" stroke="var(--gold)" fill="none" {...hair} />
      <circle cx={dotX} cy={dotY} r="4.5" fill="var(--neg)" />
      <circle cx={dotX} cy={dotY} r="9" className="ls-line" stroke="var(--neg)" fill="none" opacity="0.5" {...hair} />
      <text x="34" y="128" className="ls-label">
        {t('land.tag.quiet')}
      </text>
      <text x="224" y="128" className="ls-label" textAnchor="end">
        {t('land.tag.run')}
      </text>

      {/* what the fee does with what it collects */}
      <line x1="34" y1="146" x2="326" y2="146" className="ls-grid" {...hair} />
      <text x="34" y="164" className="ls-label" fill="var(--neg)">
        {t('land.tag.leavers')}
      </text>
      <text x="326" y="164" className="ls-label" fill="var(--pos)" textAnchor="end">
        {t('land.tag.stayers')}
      </text>

      {[0, 1, 2].map((i) => (
        <g key={`l${i}`}>
          <line x1="34" y1={176 + i * 11} x2="146" y2={176 + i * 11} className="ls-line" stroke="var(--neg)" opacity={0.9 - i * 0.2} {...hair} />
          <path d={`M146 ${176 + i * 11} L138 ${172 + i * 11} L138 ${180 + i * 11} Z`} fill="var(--neg)" opacity={0.9 - i * 0.2} />
        </g>
      ))}

      <line x1="180" y1="168" x2="180" y2="206" className="ls-line" stroke="var(--gold)" strokeDasharray="2 3" {...hair} />
      <text x="180" y="164" className="ls-label" fill="var(--gold)" textAnchor="middle">
        {t('land.tag.half')}
      </text>

      {[0, 1, 2].map((i) => (
        <g key={`s${i}`}>
          <line x1="214" y1={176 + i * 11} x2="326" y2={176 + i * 11} className="ls-line" stroke="var(--pos)" opacity={0.9 - i * 0.2} {...hair} />
          <path d={`M326 ${176 + i * 11} L318 ${172 + i * 11} L318 ${180 + i * 11} Z`} fill="var(--pos)" opacity={0.9 - i * 0.2} />
        </g>
      ))}
    </Frame>
  );
}

/* ------------------------------------------------ 6. the whitepaper runs -- */

const BARS = [
  4, 9, 6, 13, 8, 3, 11, 16, 7, 2, -5, -12, -8, -3, -9, -14, -6, -2, 5, 10, 7, 14, 9, 4, 12,
];
const MULT = [
  1, 1, 0.95, 0.95, 1, 1.05, 1.05, 1.1, 1.15, 1.15, 1, 0.85, 0.7, 0.55, 0.4, 0.25, 0.25, 0.3, 0.35,
  0.4, 0.45, 0.5, 0.55, 0.6, 0.65,
];

export function SchemaTerminal() {
  const { t } = useI18n();
  const x0 = 34;
  const w = 292;
  const step = w / BARS.length;
  const zero = 74;

  let d = '';
  MULT.forEach((m, i) => {
    const x = x0 + i * step;
    const y = 188 - ((m - 0.2) / 1.05) * 36;
    d += (i === 0 ? 'M' : 'L') + `${x.toFixed(1)},${y.toFixed(1)}L${(x + step).toFixed(1)},${y.toFixed(1)}`;
  });

  return (
    <Frame label={t('land.alt6')}>
      <line x1={x0} y1="26" x2={x0 + w} y2="26" className="ls-grid" {...hair} />
      <line x1={x0} y1={zero} x2={x0 + w} y2={zero} className="ls-line" stroke="var(--line-hard)" {...hair} />
      <line x1={x0} y1="122" x2={x0 + w} y2="122" className="ls-grid" {...hair} />
      {BARS.map((v, i) => (
        <rect
          key={i}
          x={x0 + i * step + step * 0.22}
          y={v >= 0 ? zero - v * 3 : zero}
          width={step * 0.56}
          height={Math.max(1, Math.abs(v) * 3)}
          fill={v >= 0 ? 'var(--pos)' : 'var(--neg)'}
          opacity="0.85"
        />
      ))}
      <text x={x0} y="18" className="ls-label">
        {t('land.tag.netflow')}
      </text>

      <line x1={x0} y1="132" x2={x0 + w} y2="132" className="ls-grid" {...hair} />
      <line x1={x0} y1="150" x2={x0 + w} y2="150" className="ls-grid" {...hair} />
      <line x1={x0} y1="188" x2={x0 + w} y2="188" className="ls-line" stroke="var(--line-hard)" {...hair} />
      <path d={d} className="ls-line" stroke="var(--gold)" fill="none" {...hair} />
      <text x={x0 + w} y="146" className="ls-label" textAnchor="end">
        {t('land.tag.multiplier')}
      </text>
    </Frame>
  );
}

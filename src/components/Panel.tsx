import type { ReactNode } from 'react';
import { Hint } from './Hint';

interface Props {
  title: string;
  note?: string;
  hint?: string;
  alarmed?: boolean;
  children: ReactNode;
}

export function Panel({ title, note, hint, alarmed, children }: Props) {
  return (
    <section className={alarmed ? 'panel is-alarmed' : 'panel'}>
      <header className="panel-head">
        <h2 className="panel-title">
          {title}
          {hint ? <Hint text={hint} /> : null}
        </h2>
        {note ? <span className="panel-note">{note}</span> : null}
      </header>
      {children}
    </section>
  );
}

/**
 * The asset a figure is denominated in, set dim and after the number, the way
 * the ETH and OZ formatters already print theirs. Used where the formatter
 * itself carries no unit, so no reader has to guess whether a count is ETH,
 * $STANDARD or ounces.
 */
export function Unit({ children }: { children: ReactNode }) {
  return <span className="unit">{children}</span>;
}

export function Stat({
  label,
  children,
  sub,
  big,
  hint,
  unit,
}: {
  label: string;
  children: ReactNode;
  sub?: ReactNode;
  big?: boolean;
  hint?: string;
  unit?: string;
}) {
  return (
    <div className="stat">
      <div className="kicker">
        {label}
        {hint ? <Hint text={hint} /> : null}
      </div>
      <span className={big ? 'v big' : 'v'}>
        {children}
        {unit ? <Unit>{unit}</Unit> : null}
      </span>
      {sub ? <div className="sub">{sub}</div> : null}
    </div>
  );
}

export function Row({
  label,
  children,
  unit,
}: {
  label: ReactNode;
  children: ReactNode;
  unit?: string;
}) {
  return (
    <div className="row">
      <span className="k">{label}</span>
      <span className="v">
        {children}
        {unit ? <Unit>{unit}</Unit> : null}
      </span>
    </div>
  );
}

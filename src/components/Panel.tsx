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

export function Stat({
  label,
  children,
  sub,
  big,
  hint,
}: {
  label: string;
  children: ReactNode;
  sub?: ReactNode;
  big?: boolean;
  hint?: string;
}) {
  return (
    <div className="stat">
      <div className="kicker">
        {label}
        {hint ? <Hint text={hint} /> : null}
      </div>
      <span className={big ? 'v big' : 'v'}>{children}</span>
      {sub ? <div className="sub">{sub}</div> : null}
    </div>
  );
}

export function Row({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="row">
      <span className="k">{label}</span>
      <span className="v">{children}</span>
    </div>
  );
}

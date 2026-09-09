import { useEffect, useRef } from 'react';
import { FORMATTERS, type FormatKind } from '../engine/format';

/**
 * One animation frame loop for every number on screen. Values ease toward their
 * target and are written straight to the DOM, so a ticking figure never costs a
 * React render.
 */
type Sub = (dt: number) => void;
const subs = new Set<Sub>();
let raf = 0;
let last = 0;

function loop(t: number) {
  const dt = Math.min(64, t - last);
  last = t;
  for (const fn of subs) fn(dt);
  raf = subs.size ? requestAnimationFrame(loop) : 0;
}

function join(fn: Sub) {
  subs.add(fn);
  if (!raf) {
    last = performance.now();
    raf = requestAnimationFrame(loop);
  }
  return () => {
    subs.delete(fn);
  };
}

interface Props {
  value: number;
  kind?: FormatKind;
  /** Time constant in ms. Lower is snappier. */
  tau?: number;
  className?: string;
}

export function Num({ value, kind = 'int', tau = 130, className }: Props) {
  const el = useRef<HTMLSpanElement>(null);
  const target = useRef(value);
  const current = useRef(value);
  target.current = value;

  useEffect(() => {
    const fmt = FORMATTERS[kind];
    let shown = '';
    return join((dt) => {
      const t = target.current;
      const c = current.current;
      const gap = t - c;
      if (Math.abs(gap) < Math.max(1e-12, Math.abs(t) * 1e-6)) current.current = t;
      else current.current = c + gap * (1 - Math.exp(-dt / tau));
      const next = fmt(current.current);
      if (next !== shown && el.current) {
        el.current.textContent = next;
        shown = next;
      }
    });
  }, [kind, tau]);

  return (
    <span ref={el} className={className ? `num ${className}` : 'num'}>
      {FORMATTERS[kind](value)}
    </span>
  );
}

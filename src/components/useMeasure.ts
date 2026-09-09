import { useEffect, useRef, useState } from 'react';

/** Width of a box, so hand drawn SVG can use real pixels and never distort. */
export function useMeasure<T extends HTMLElement>(): [React.RefObject<T>, number] {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const ro = new ResizeObserver((entries) => {
      const next = Math.round(entries[0].contentRect.width);
      setW((prev) => (Math.abs(prev - next) > 1 ? next : prev));
    });
    ro.observe(node);
    setW(Math.round(node.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, []);

  return [ref, w];
}

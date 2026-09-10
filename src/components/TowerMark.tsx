/**
 * The Standard Reserve's twin towers, traced from the official logomark.
 *
 * Two narrow shafts whose crowns are cut on a slant, peaks at the inner edges
 * flanking a thin gap. Each shaft widens through two steps into its base. One
 * short bar bridges the gap a little above the middle. Nothing but right angles
 * and one diagonal per crown.
 *
 * This is the protocol's mark, used here as attribution only. This site's own
 * name is THE BANK IS RUNNING, and both the header and the footer say it is
 * unofficial.
 */

/**
 * The outer silhouette, in a 24 x 24 field: the crown falls away over the top
 * eighth, the base steps out at 68% and 82% of the height, and the figure is a
 * little under half as wide as it is tall.
 *
 * Only the gap between the shafts is a variable. Traced, it is 0.6 units, which
 * at 20px lands on half a device pixel and greys the whole mark into a single
 * column. So the small instances open it to a full pixel, the ordinary optical
 * correction for a mark set this size, and the figure drawn large keeps the
 * traced width.
 */
export const GAP_TRACED = 0.6;
export const GAP_OPTICAL = 1.2;

const west = (gap: number) => {
  const inner = 12 - gap / 2;
  return `M${inner} 1.5 L8.95 4.4 L8.95 16.2 L7.95 16.2 L7.95 19.1 L6.9 19.1 L6.9 23 L${inner} 23 Z`;
};

const east = (gap: number) => {
  const inner = 12 + gap / 2;
  return `M${inner} 1.5 L15.05 4.4 L15.05 16.2 L16.05 16.2 L16.05 19.1 L17.1 19.1 L17.1 23 L${inner} 23 Z`;
};

/** West shaft, east shaft, and the skybridge spanning the gap between them. */
export function towerParts(gap: number) {
  return {
    west: west(gap),
    east: east(gap),
    bridge: { x: 12 - gap / 2, y: 9.4, width: gap, height: 1.2 },
  };
}

export function TowerMark({
  size = 20,
  className,
  gap = GAP_OPTICAL,
}: {
  size?: number;
  className?: string;
  gap?: number;
}) {
  const p = towerParts(gap);
  // The gap is centred on x = 12, which at any size lands on a device pixel
  // boundary and so splits its one pixel of darkness across two, greying the
  // seam away. Half a device pixel of offset drops it inside a single column.
  const snap = 12 / size;

  return (
    <svg
      className={className ? `towermark ${className}` : 'towermark'}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      role="img"
      aria-label="The Standard Reserve"
      focusable="false"
    >
      <g transform={`translate(${snap.toFixed(3)} 0)`}>
        <path d={p.west} />
        <path d={p.east} />
        <rect {...p.bridge} />
      </g>
    </svg>
  );
}

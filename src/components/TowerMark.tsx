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
 * The traced silhouette, in a 24 x 24 field: the crown falls away over the top
 * eighth, the base steps out at 68% and 82% of the height, and the figure is a
 * little under half as wide as it is tall. This is the geometry to draw large.
 * Small sizes use the variant below instead.
 */
export const GAP_TRACED = 0.6;

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

/**
 * The small-size variant, drawn on a 20 unit grid so that at 20px every edge
 * lands on a whole device pixel and nothing is left to antialiasing.
 *
 * The traced mark is too fine to survive here: its shafts and the gap between
 * them all fall under a pixel and grey together into one obelisk. So this
 * variant thickens each shaft to two units and opens the gap to two, keeping
 * the crowns, the two steps into each base and the bridge. It reads as two
 * towers at 20px, which the traced geometry does not.
 */
const SMALL_WEST = 'M9 1 L7 4 L7 13 L6 13 L6 16 L5 16 L5 19 L9 19 Z';
const SMALL_EAST = 'M11 1 L13 4 L13 13 L14 13 L14 16 L15 16 L15 19 L11 19 Z';
const SMALL_BRIDGE = { x: 9, y: 8, width: 2, height: 1 };

export function TowerMark({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg
      className={className ? `towermark ${className}` : 'towermark'}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="currentColor"
      role="img"
      aria-label="The Standard Reserve"
      focusable="false"
    >
      <path d={SMALL_WEST} />
      <path d={SMALL_EAST} />
      <rect {...SMALL_BRIDGE} />
    </svg>
  );
}

/**
 * The Standard Reserve's twin towers, joined by a skybridge near the top.
 * Stepped bases, notched crowns, nothing but right angles.
 *
 * This is the protocol's mark, used here as attribution only. This site's own
 * name is THE BANK IS RUNNING, and the footer says it is unofficial.
 */
export function TowerMark({ size = 20, className }: { size?: number; className?: string }) {
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
      {/* west tower, crown notched */}
      <path d="M4 4 H5.6 V6.2 H7.4 V4 H9 V19 H4 Z" />
      <rect x="3" y="19" width="7" height="1.5" />
      <rect x="2" y="20.5" width="9" height="1.5" />

      {/* east tower */}
      <path d="M15 4 H16.6 V6.2 H18.4 V4 H20 V19 H15 Z" />
      <rect x="14" y="19" width="7" height="1.5" />
      <rect x="13" y="20.5" width="9" height="1.5" />

      {/* skybridge */}
      <rect x="9" y="7.6" width="6" height="1.4" />
    </svg>
  );
}

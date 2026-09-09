export const TABS = ['OVERVIEW', 'SUPPLY', 'AUCTIONS', 'DEFENCE', 'LOG'] as const;
export type Tab = (typeof TABS)[number];

const CAPTION: Record<Tab, string> = {
  OVERVIEW: 'THE SIGNAL AND WHAT THE BANK DID ABOUT IT',
  SUPPLY: 'WHAT EXISTS, AND WHAT HAS BEEN DESTROYED',
  AUCTIONS: 'HOW BRANCHES AND SEATS ARE PRICED',
  DEFENCE: 'WHAT HAPPENS WHEN CAPITAL LEAVES',
  LOG: 'THE RECORD',
};

export function Tabs({ value, onChange }: { value: Tab; onChange: (t: Tab) => void }) {
  return (
    <div className="tabs">
      <nav className="tabs-bar" role="tablist" aria-label="Sections">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={value === t}
            className="tab"
            onClick={() => onChange(t)}
          >
            {t}
          </button>
        ))}
      </nav>
      <span className="tabs-caption">{CAPTION[value]}</span>
    </div>
  );
}

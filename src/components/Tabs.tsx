import type { DictKey } from '../i18n/en';
import { useI18n } from '../i18n';

export const TABS = ['OVERVIEW', 'SUPPLY', 'AUCTIONS', 'DEFENCE', 'LOG'] as const;
export type Tab = (typeof TABS)[number];

const LABEL: Record<Tab, DictKey> = {
  OVERVIEW: 'tab.overview',
  SUPPLY: 'tab.supply',
  AUCTIONS: 'tab.auctions',
  DEFENCE: 'tab.defence',
  LOG: 'tab.log',
};

const CAPTION: Record<Tab, DictKey> = {
  OVERVIEW: 'tabcap.overview',
  SUPPLY: 'tabcap.supply',
  AUCTIONS: 'tabcap.auctions',
  DEFENCE: 'tabcap.defence',
  LOG: 'tabcap.log',
};

export function Tabs({ value, onChange }: { value: Tab; onChange: (t: Tab) => void }) {
  const { t } = useI18n();

  return (
    <div className="tabs">
      <nav className="tabs-bar" role="tablist" aria-label={t('tab.sections')}>
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={value === tab}
            className="tab"
            onClick={() => onChange(tab)}
          >
            {t(LABEL[tab])}
          </button>
        ))}
      </nav>
      <span className="tabs-caption">{t(CAPTION[value])}</span>
    </div>
  );
}

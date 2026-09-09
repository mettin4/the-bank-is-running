import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';

const KEY = 'tbir.oriented.v1';

function seen(): boolean {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

function remember() {
  try {
    localStorage.setItem(KEY, '1');
  } catch {
    /* private windows and blocked storage simply show it again */
  }
}

/** Shown once, on a first visit, after the cold start has finished. */
export function Orientation({ onDone }: { onDone: () => void }) {
  const { t } = useI18n();
  const [out, setOut] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  function dismiss() {
    if (out) return;
    setOut(true);
    remember();
    window.setTimeout(onDone, 300);
  }

  return (
    <div
      className={out ? 'orient is-out' : 'orient'}
      role="dialog"
      aria-modal="true"
      aria-label={t('orient.label')}
    >
      <div className="orient-card">
        <div className="kicker">{t('orient.kicker')}</div>
        <p className="orient-line">{t('orient.line1')}</p>
        <p className="orient-line">{t('orient.line2')}</p>
        <p className="orient-line orient-line-last">{t('orient.line3')}</p>
        <button type="button" className="orient-btn" onClick={dismiss} autoFocus>
          {t('orient.button')}
        </button>
      </div>
    </div>
  );
}

export const orientationSeen = seen;

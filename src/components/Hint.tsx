import { useState } from 'react';
import { useI18n } from '../i18n';

/**
 * A dim question mark beside a kicker. Hover on a pointer, tap on touch, focus
 * on a keyboard. Explains one mechanic in plain language.
 */
export function Hint({ text }: { text: string }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <span className="hint-wrap" data-open={open ? 'true' : 'false'}>
      <button
        type="button"
        className="hint"
        aria-expanded={open}
        aria-label={t('hint.aria')}
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setOpen(false)}
      >
        ?
      </button>
      <span className="hint-pop" role="tooltip">
        {text}
      </span>
    </span>
  );
}

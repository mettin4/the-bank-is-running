import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { EventDict } from '../engine/events';
import type { ProtocolEvent } from '../engine/types';
import { en, enAssumed, enEvents, type AssumedDict, type Dict, type DictKey } from './en';
import { zh, zhAssumed, zhEvents } from './zh';

export type Locale = 'en' | 'zh';

const KEY = 'tbir.lang.v1';

const TABLE: Record<Locale, { dict: Dict; events: EventDict; assumed: AssumedDict }> = {
  en: { dict: en, events: enEvents, assumed: enAssumed },
  zh: { dict: zh, events: zhEvents, assumed: zhAssumed },
};

function parse(v: string | null): Locale | null {
  return v === 'zh' || v === 'en' ? v : null;
}

/**
 * ?lang=zh makes the Chinese terminal directly linkable. The parameter wins over
 * the stored choice on that load and is then written to storage, so it survives
 * the move from the landing to /app even though navigate() does not carry the
 * query along.
 */
function fromUrl(): Locale | null {
  try {
    return parse(new URLSearchParams(window.location.search).get('lang'));
  } catch {
    return null;
  }
}

function stored(): Locale {
  const url = fromUrl();
  if (url) {
    try {
      localStorage.setItem(KEY, url);
    } catch {
      /* the parameter still applies to this load, it just will not persist */
    }
    return url;
  }
  try {
    return parse(localStorage.getItem(KEY)) ?? 'en';
  } catch {
    /* private windows and blocked storage fall back to English */
  }
  return 'en';
}

/** Fill {name} placeholders. Keeps templates readable in both dictionaries. */
export function tf(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ''));
}

interface Ctx {
  lang: Locale;
  setLang: (l: Locale) => void;
  t: (k: DictKey) => string;
  tv: (k: DictKey, vars: Record<string, string | number>) => string;
  assumed: AssumedDict;
  ev: (e: ProtocolEvent) => string;
}

const LangCtx = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Locale>(stored);

  const setLang = useCallback((l: Locale) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* the choice simply does not persist */
    }
    document.documentElement.lang = l === 'zh' ? 'zh-CN' : 'en';
    document.documentElement.dataset.lang = l;
  }, []);

  const value = useMemo<Ctx>(() => {
    const { dict, events, assumed } = TABLE[lang];
    return {
      lang,
      setLang,
      t: (k) => dict[k],
      tv: (k, vars) => tf(dict[k], vars),
      assumed,
      // The event's key and its args were written together by the engine, so the
      // renderer is the right one. TypeScript cannot correlate the two through
      // the union, and this is the single place that gap is bridged.
      ev: (e) => (events[e.key] as (a: unknown) => string)(e.args),
    };
  }, [lang, setLang]);

  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}

export function useI18n(): Ctx {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error('useI18n used outside LanguageProvider');
  return ctx;
}

/** Read the stored choice before React mounts, so the first paint is correct. */
export function applyStoredLang() {
  const l = stored();
  document.documentElement.lang = l === 'zh' ? 'zh-CN' : 'en';
  document.documentElement.dataset.lang = l;
}

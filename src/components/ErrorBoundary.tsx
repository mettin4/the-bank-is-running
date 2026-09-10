import { Component, type ErrorInfo, type ReactNode } from 'react';

/**
 * The last line of defence. Anything that throws below this point would
 * otherwise unmount the root and leave a black page with no explanation, which
 * is what a stale chunk after a deploy used to produce.
 *
 * It deliberately does not use the language context: if the provider itself is
 * what threw, a consumer here would throw again. `applyStoredLang` stamps the
 * choice on the document element before React mounts, so reading it from there
 * always works.
 *
 * Nothing about the error reaches the reader. The message says what happened
 * and offers the one action that fixes it.
 */
const COPY = {
  en: {
    kicker: 'THE TERMINAL STOPPED',
    line: 'Something in this build failed to run. Reloading fetches it again.',
    action: 'RELOAD',
  },
  zh: {
    kicker: '终端已停止',
    line: '本次构建中有内容未能运行。重新加载会重新获取。',
    action: '重新加载',
  },
} as const;

function copy() {
  return document.documentElement.dataset.lang === 'zh' ? COPY.zh : COPY.en;
}

interface Props {
  children: ReactNode;
  /** Named so the report can say which boundary caught something. */
  scope: string;
}

export class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Console only, for whoever is looking at devtools. Never rendered.
    console.error(`[${this.props.scope}] render failed`, error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    const t = copy();
    return (
      <div className="crash" role="alert">
        <div className="crash-card">
          <div className="kicker">{t.kicker}</div>
          <p className="crash-line">{t.line}</p>
          <button type="button" className="crash-btn" onClick={() => window.location.reload()}>
            {t.action}
          </button>
        </div>
      </div>
    );
  }
}

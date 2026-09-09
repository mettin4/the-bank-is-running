import { useEffect, useState } from 'react';

/**
 * Two routes, so nothing heavier than this is warranted. The terminal lives at
 * /app and the story at /. A query string is never touched, so any parameters
 * on /app survive a visit to the landing and back.
 */
export function usePath(): string {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const sync = () => setPath(window.location.pathname);
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  return path;
}

export function isAppRoute(path: string): boolean {
  return path === '/app' || path.startsWith('/app/');
}

export function navigate(to: string) {
  if (window.location.pathname === to) return;
  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0 });
}

/**
 * Real anchors, so middle click and ctrl click open a tab the way a reader
 * expects. Only a plain left click is handled in page.
 */
export function linkProps(to: string) {
  return {
    href: to,
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      navigate(to);
    },
  };
}

import { lazy, Suspense } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Landing } from './landing/Landing';
import { lazyChunk } from './lazyChunk';
import { isAppRoute, usePath } from './router';

/**
 * The terminal is loaded on demand. The economy boots the moment its module is
 * evaluated, so keeping it in its own chunk is what makes the landing open with
 * nothing running behind it.
 */
const Terminal = lazy(lazyChunk(() => import('./Terminal')));

export default function App() {
  const path = usePath();

  if (!isAppRoute(path)) return <Landing />;

  return (
    <ErrorBoundary scope="terminal">
      <Suspense fallback={<div className="boot" role="status" aria-label="Loading the terminal" />}>
        <Terminal />
      </Suspense>
    </ErrorBoundary>
  );
}

import { lazy, Suspense } from 'react';
import { Landing } from './landing/Landing';
import { isAppRoute, usePath } from './router';

/**
 * The terminal is loaded on demand. The economy boots the moment its module is
 * evaluated, so keeping it in its own chunk is what makes the landing open with
 * nothing running behind it.
 */
const Terminal = lazy(() => import('./Terminal'));

export default function App() {
  const path = usePath();

  if (!isAppRoute(path)) return <Landing />;

  return (
    <Suspense fallback={<div className="boot" aria-hidden="true" />}>
      <Terminal />
    </Suspense>
  );
}

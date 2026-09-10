/**
 * A dynamic import that survives the two ways it realistically fails.
 *
 * A transient network blip: retry once, after a beat.
 *
 * A stale chunk: the reader had the landing open across a deploy, so their
 * index.html points at a hash that no longer exists and every retry of that
 * same specifier will keep failing, because React.lazy caches the rejection.
 * The only thing that recovers it is a fresh document, which re-fetches the
 * HTML and with it the new chunk graph. A sessionStorage flag makes that a
 * one-shot, so a genuinely broken build cannot put the page in a reload loop.
 */
const FLAG = 'tbir.chunkReload.v1';

function reloadedAlready(): boolean {
  try {
    return sessionStorage.getItem(FLAG) === '1';
  } catch {
    return false;
  }
}

function markReloaded() {
  try {
    sessionStorage.setItem(FLAG, '1');
  } catch {
    /* a blocked store loses the loop guard, so the reload below is skipped */
  }
}

function clearFlag() {
  try {
    sessionStorage.removeItem(FLAG);
  } catch {
    /* nothing to clear */
  }
}

export function lazyChunk<T>(load: () => Promise<T>): () => Promise<T> {
  return async () => {
    try {
      const mod = await load();
      // Only a load that actually succeeded clears the guard. Clearing it at
      // boot instead would defeat it: the reload would land, clear the flag,
      // fail again and reload forever.
      clearFlag();
      return mod;
    } catch (first) {
      await new Promise((r) => setTimeout(r, 350));
      try {
        const mod = await load();
        clearFlag();
        return mod;
      } catch (second) {
        if (!reloadedAlready()) {
          markReloaded();
          window.location.reload();
          // Keep the promise pending: the document is going away, and rejecting
          // would flash the error boundary on the way out.
          return new Promise<T>(() => {});
        }
        console.error('[lazyChunk] chunk still unavailable after a reload', second ?? first);
        throw second;
      }
    }
  };
}

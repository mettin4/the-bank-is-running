# THE BANK IS RUNNING, working notes

Standing rules for anyone, human or otherwise, changing this repository.

## Fonts are immutable once shipped

The four font files under `public/fonts/` are served **unhashed** with
`Cache-Control: public, max-age=31536000, immutable` (see `vercel.json`). A
browser that has fetched one of these paths will not ask about it again for a
year, and the immutable directive tells it not to revalidate even on a reload.

Therefore: **never change the contents of a font file in place.** A reader who
already has the old bytes cached would keep them for up to a year while the
stylesheet expects the new ones, and there is no way to force a refresh.

Any content change to a font, including resubsetting, adding a weight, changing
the foundry build, or reoptimising the file, requires all three of:

1. A new filename carrying a version suffix, for example
   `ibm-plex-mono-400-latin-v2.woff2`. Never reuse a retired name.
2. The matching `src: url(...)` updated in the `@font-face` block at the top of
   `src/styles.css`.
3. The matching `href` updated in the `rel="preload"` links in `index.html`,
   for the two faces that are preloaded.

`scripts/og.ts` reads these files by name as well, so update the `FACES` list
there too. Retired files may be deleted from the repository once the new ones
ship; the caching rule applies to the path, not to the file's presence.

### Frozen baseline

These are the files and byte sizes currently shipped. If a file's size differs
from this table, it was edited in place and the rule above was broken.

| File | Bytes |
| --- | --- |
| `public/fonts/ibm-plex-mono-300-latin.woff2` | 14748 |
| `public/fonts/ibm-plex-mono-400-latin.woff2` | 14708 |
| `public/fonts/ibm-plex-mono-500-latin.woff2` | 14888 |
| `public/fonts/instrument-serif-400-latin.woff2` | 21032 |

Total 65376 bytes. Both families are SIL Open Font License; the latin subsets
were taken from the Google Fonts CDN and are redistributed under that licence.

Weights are not arbitrary: the stylesheets reference IBM Plex Mono 300, 400 and
500 and Instrument Serif 400, and nothing else. There is no italic and no
weight 600. Adding a weight means adding a file, which means the versioning
rule above.

Chinese ships no webfont. CJK falls through the system stack declared in the
`--cjk` custom property, and the `unicode-range` on every `@font-face` excludes
CJK so the latin faces are never asked to render it.

## Evidence

A claim that a change was applied is only settled by the committed content.
Prove it with `git show <hash>:<path>` or `git grep <pattern> <hash>`, not from
the output of the script that made the change.

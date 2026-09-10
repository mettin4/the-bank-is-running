/**
 * Regenerates public/og.png, the card a shared link renders.
 *
 * Hermetic on purpose. The two faces are read from public/fonts and inlined as
 * data URIs, so the render cannot silently fall back to a system font and does
 * not touch the network. Both families are asserted before the screenshot is
 * taken, because an earlier version of this asset was produced with only the
 * serif checked and there was no way afterwards to prove which monospace had
 * actually been used.
 *
 * Playwright is not a dependency of this project: it would make every install
 * and every CI run download a browser for an image that changes almost never.
 * Run this with playwright available, for example
 *   npm i -D playwright && npx playwright install chromium && npm run og
 * and then drop it again.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const FONTS = resolve(ROOT, 'public/fonts');
const OUT = resolve(ROOT, 'public/og.png');

const WIDTH = 1600;
const HEIGHT = 900;

/** The exact faces the site itself serves. Keep in step with styles.css. */
const FACES = [
  { family: 'Instrument Serif', weight: 400, file: 'instrument-serif-400-latin.woff2' },
  { family: 'IBM Plex Mono', weight: 400, file: 'ibm-plex-mono-400-latin.woff2' },
  { family: 'IBM Plex Mono', weight: 500, file: 'ibm-plex-mono-500-latin.woff2' },
] as const;

function faceCss(): string {
  return FACES.map(({ family, weight, file }) => {
    const b64 = readFileSync(resolve(FONTS, file)).toString('base64');
    return `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};src:url(data:font/woff2;base64,${b64}) format('woff2');}`;
  }).join('\n');
}

/** Net flow bars, so the card says the thing runs rather than that it is a doc. */
const BARS = [9, 17, 12, 26, 15, 7, 21, 31, 13, 5, -11, -23, -16, -7, -18, -27, -12, -4, 10, 20, 14, 27, 18, 8, 24, 30, 16];

const MARK = `<svg width="30" height="30" viewBox="0 0 20 20" fill="#e8e6e0"><path d="M9 1 L7 4 L7 13 L6 13 L6 16 L5 16 L5 19 L9 19 Z"/><path d="M11 1 L13 4 L13 13 L14 13 L14 16 L15 16 L15 19 L11 19 Z"/><rect x="9" y="8" width="2" height="1"/></svg>`;

function html(): string {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${faceCss()}
*{box-sizing:border-box;margin:0}
body{width:${WIDTH}px;height:${HEIGHT}px;background:#1a1a18;color:#e8e6e0;
  font-family:'IBM Plex Mono',monospace;overflow:hidden;position:relative;
  -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;
  font-variant-numeric:tabular-nums}
.frame{position:absolute;inset:56px;border:1px solid rgba(232,230,224,.12)}
.pad{position:absolute;inset:56px;padding:88px 96px;display:flex;flex-direction:column;justify-content:space-between}
.top{display:flex;align-items:center;justify-content:space-between}
.mark{display:flex;align-items:center;gap:20px}
.mark svg{display:block}
.mark span{font-size:22px;font-weight:500;letter-spacing:.22em}
.tag{font-size:19px;font-weight:500;letter-spacing:.16em;color:#3c3a35;border:1px solid rgba(232,230,224,.12);padding:5px 12px}
h1{font-family:'Instrument Serif',serif;font-weight:400;font-size:150px;line-height:.98;letter-spacing:.005em}
.sub{font-size:25px;font-weight:500;letter-spacing:.15em;color:#928e85;line-height:1.75;margin-top:34px}
.foot{display:flex;align-items:flex-end;justify-content:space-between}
.meta{font-size:20px;font-weight:500;letter-spacing:.19em;color:#c9a44c}
.strip{display:flex;align-items:flex-end;gap:5px;height:74px}
.strip i{width:9px;background:#7f9c6b}
.strip i.d{background:#b8654e}
</style></head><body>
<div class="frame"></div>
<div class="pad">
  <div class="top">
    <div class="mark">${MARK}<span>THE STANDARD RESERVE</span></div>
    <span class="tag">UNOFFICIAL</span>
  </div>
  <div>
    <h1>THE BANK IS<br>RUNNING</h1>
    <div class="sub">AN UNOFFICIAL, WORKING IMPLEMENTATION<br>OF THE STANDARD RESERVE WHITEPAPER V0.1</div>
  </div>
  <div class="foot">
    <div class="meta">WHITEPAPER V0.1 · RUNNING LIVE IN THE BROWSER</div>
    <div class="strip">${BARS.map((v) => `<i class="${v < 0 ? 'd' : ''}" style="height:${Math.abs(v) * 2.2}px"></i>`).join('')}</div>
  </div>
</div></body></html>`;
}

// playwright is an optional dev tool, not a dependency of this project, so the
// type checker will not find it on a normal install. See the header.
// @ts-ignore
const { chromium } = await import('playwright').catch(() => {
  throw new Error('playwright is not installed; see the header of this file');
});

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });
await page.setContent(html(), { waitUntil: 'load' });
// Force every declared face to load rather than waiting for a glyph to need
// it: that way the assertion below validates each inlined file, not merely the
// weights this particular layout happens to use.
await page.evaluate(
  `Promise.all(${JSON.stringify(FACES.map((f) => `${f.weight} 40px "${f.family}"`))}.map((f) => document.fonts.load(f))).then(() => document.fonts.ready)`,
);

// Every face must be present, or the card ships in a fallback and nobody notices.
// Passed as source text: the loader that runs this file rewrites named function
// expressions and its helper does not exist inside the page.
const probe = `(() => {
  const faces = ${JSON.stringify(FACES.map((f) => ({ family: f.family, weight: f.weight })))};
  const out = {};
  for (const f of faces) out[f.family + ' ' + f.weight] = document.fonts.check(f.weight + ' 40px "' + f.family + '"');
  const fam = (sel) => getComputedStyle(document.querySelector(sel)).fontFamily.split(',')[0].replace(/"/g, '');
  return { checks: out, status: document.fonts.status, h1: fam('h1'), body: fam('.sub'), loaded: document.fonts.size };
})()`;
const checks = (await page.evaluate(probe)) as {
  checks: Record<string, boolean>;
  status: string;
  h1: string;
  body: string;
  loaded: number;
};

console.log('font status      :', checks.status, `(${checks.loaded} faces registered)`);
console.log('serif element    :', checks.h1);
console.log('monospace element:', checks.body);
for (const [k, v] of Object.entries(checks.checks)) console.log(`check ${k.padEnd(22)} ${v}`);

const missing = Object.entries(checks.checks).filter(([, v]) => !v).map(([k]) => k);
if (missing.length) throw new Error(`refusing to write og.png, faces unavailable: ${missing.join(', ')}`);
if (checks.h1 !== 'Instrument Serif') throw new Error(`h1 resolved to ${checks.h1}`);
if (checks.body !== 'IBM Plex Mono') throw new Error(`mono text resolved to ${checks.body}`);

const png = await page.screenshot({ type: 'png' });
writeFileSync(OUT, png);
console.log(`wrote ${OUT} ${png.length}B ${WIDTH}x${HEIGHT}`);
await browser.close();

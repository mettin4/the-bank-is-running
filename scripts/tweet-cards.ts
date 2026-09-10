/**
 * Renders the two announcement images into out/tweets/.
 *
 * These are post assets, not site assets: nothing here is served by the site
 * and nothing here is imported by it.
 *
 * Same hermetic approach as scripts/og.ts. The latin faces come from
 * public/fonts as base64 data URIs so the render cannot reach the network or
 * fall back silently, every declared face is force loaded, and nothing is
 * written unless the assertions pass.
 *
 * Chinese is the one thing that cannot be embedded: the site ships no CJK
 * webfont by design, so the second card borrows a CJK face from the machine
 * doing the rendering. That is checked rather than assumed, by rasterising two
 * different Han characters and comparing the pixels: two tofu boxes are
 * identical, two real glyphs are not.
 *
 * Playwright is not a dependency of this project. Run with it available:
 *   npm i -D playwright --no-save && npm run tweet:cards
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { en } from '../src/i18n/en';
import { zh } from '../src/i18n/zh';
import { int, pad4, signedEth, stamp } from '../src/engine/format';

const ROOT = resolve(import.meta.dirname, '..');
const FONTS = resolve(ROOT, 'public/fonts');
const OUT = resolve(ROOT, 'out/tweets');

const W = 1600;
const H = 900;

const INK = '#e8e6e0';
const DIM = '#928e85';
const GHOST = '#3c3a35';
const GOLD = '#c8a34f';
const BG = '#1a1a18';
const LINE = 'rgba(232,230,224,0.12)';

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

/**
 * The stack src/styles.css declares in --cjk. The card uses this rather than
 * forcing one family, so the Chinese on the image is drawn by the same face a
 * reader would get. Which one that is depends on the machine, so the probe
 * names it rather than assuming.
 */
const SITE_CJK =
  "'PingFang SC','Hiragino Sans GB','Microsoft YaHei','Noto Sans CJK SC','Source Han Sans SC','WenQuanYi Micro Hei',sans-serif";

/** Named faces, only so the probe can say which one the stack resolved to. */
const CJK_CANDIDATES = [
  'Microsoft YaHei',
  'Microsoft JhengHei',
  'SimSun',
  'NSimSun',
  'MingLiU',
  'Noto Sans SC',
  'Noto Sans CJK SC',
  'Source Han Sans SC',
  'PingFang SC',
  'Hiragino Sans GB',
  'WenQuanYi Micro Hei',
];

const shell = (body: string, extraCss = '', cjk = 'sans-serif') => `<!doctype html>
<html><head><meta charset="utf-8"><style>
${faceCss()}
*{box-sizing:border-box;margin:0;padding:0}
body{width:${W}px;height:${H}px;background:${BG};color:${INK};
  font-family:'IBM Plex Mono',monospace;overflow:hidden;position:relative;
  -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;
  font-variant-numeric:tabular-nums;font-feature-settings:'tnum' 1,'zero' 1}
.cjk{font-family:'IBM Plex Mono',${cjk}}
.serif{font-family:'Instrument Serif',serif;font-weight:400;letter-spacing:.005em}
.k{font-size:19px;font-weight:500;letter-spacing:.2em;text-transform:uppercase}
.strip{position:absolute;left:60px;right:60px;display:flex;justify-content:space-between;
  font-size:19px;font-weight:500;letter-spacing:.16em;color:${GHOST}}
.strip.top{top:52px}
.strip.bot{bottom:52px}
${extraCss}
</style></head><body>${body}</body></html>`;

const strips = () => `
<div class="strip top"><span>THE STANDARD RESERVE · UNOFFICIAL</span><span>THE BANK IS RUNNING</span></div>
<div class="strip bot"><span>the-bank-is-running.vercel.app</span><span>BUILT BY @0XMETO_</span></div>`;

/* ------------------------------------------------------- image 1: the grid -- */

const CARD_KEYS = [
  ['land.k1', 'land.h1'],
  ['land.k2', 'land.h2'],
  ['land.k3', 'land.h3'],
  ['land.k4', 'land.h4'],
  ['land.k5', 'land.h5'],
  ['land.k6', 'land.h6'],
] as const;

function cardsGridHtml(): { html: string; used: string[] } {
  const used: string[] = [];
  const cells = CARD_KEYS.map(([kKey, hKey], i) => {
    used.push(kKey, hKey);
    const kicker = en[kKey];
    const headline = en[hKey];
    // 06 carries two sentences, so it gets the smaller step and two lines.
    const cls = i === 5 ? 'head small' : 'head';
    return `<div class="cell">
      <div class="k"><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="lbl">${kicker}</span></div>
      <div class="${cls}">${headline}</div>
    </div>`;
  }).join('');

  return { html: `${strips()}<div class="grid">${cells}</div>`, used };
}

/* --------------------------------------------------- image 2: the terminal -- */

function zhTerminalHtml(): { html: string; lines: string[]; parts: string[] } {
  // 'THE STANDARD RESERVE · 依据白皮书 V0.1 提前实现 · 非官方 · 与官方无关联'
  const parts = zh['app.subtitle'].split(' · ');
  if (parts.length !== 4) throw new Error(`app.subtitle has ${parts.length} parts, expected 4`);
  const [protocol, implemented, unofficial, unaffiliated] = parts;
  const tabs = [zh['tab.overview'], zh['tab.supply'], zh['tab.auctions'], zh['tab.defence'], zh['tab.log']];

  // Real renderers, real formatters, plausible figures in our own formats.
  const feed = [
    { t: stamp(40, 24), k: zh['kind.EPOCH'], m: `EPOCH ${pad4(40)} 收盘 · 净流量 ${signedEth(-1.98, 2)} · 收缩`, tone: 'neg' },
    { t: stamp(41, 8), k: zh['kind.BURN'], m: `回购 · ${int(6651)} $STANDARD 已买入并销毁`, tone: 'neg' },
    { t: stamp(41, 5), k: zh['kind.LICENSE'], m: `许可拍卖结束 · 成交 100/100 · 末笔 ${int(40)} · 全部销毁`, tone: '' },
  ];
  const lines = feed.map((f) => `${f.t} ${f.k} ${f.m}`);

  const rows = feed.map((f) => `<div class="row">
      <span class="t">${f.t}</span><span class="kk cjk">${f.k}</span>
      <span class="m cjk ${f.tone}">${f.m}</span>
    </div>`).join('');


  return {
    html: `
<div class="strip top"><span class="cjk">${protocol} · ${unofficial} · ${unaffiliated}</span><span>THE BANK IS RUNNING</span></div>
<div class="strip bot"><span>the-bank-is-running.vercel.app/?lang=zh</span><span>BUILT BY @0XMETO_</span></div>
<div class="toggle"><span class="en">EN</span><span class="sep">/</span><span class="zh cjk">中文</span></div>
<div class="head-wrap">
  <div class="title">THE BANK IS RUNNING</div>
  <div class="sub cjk">${implemented}</div>
</div>
<div class="tabs">${tabs.map((x, i) => `<span class="tab cjk${i === 0 ? ' on' : ''}">${x}</span>`).join('')}</div>
<div class="feed">${rows}</div>`,
    lines,
    parts,
  };
}

/* ------------------------------------------------------------------ render -- */

// @ts-ignore playwright is an optional dev tool, see the header
const { chromium } = await import('playwright').catch(() => {
  throw new Error('playwright is not installed; see the header of this file');
});

mkdirSync(OUT, { recursive: true });
// Without this Chromium uses LCD subpixel antialiasing on some text layers and
// not others, which puts red and blue fringes on the glyph edges of whichever
// element happened to be composited differently. Measured at 59% of edge pixels
// on one cell and 0% on its neighbour, so it is not subtle.
const browser = await chromium.launch({ args: ['--disable-lcd-text'] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });

/** Which CJK face this machine actually has, proven by rasterised pixels. */
const cjkProbe = `(() => {
  const cands = ${JSON.stringify(CJK_CANDIDATES)};
  const SITE_CJK = ${JSON.stringify(SITE_CJK)};
  const ink = (fam, ch) => {
    const c = document.createElement('canvas');
    c.width = 80; c.height = 80;
    const x = c.getContext('2d');
    x.fillStyle = '#000'; x.fillRect(0, 0, 80, 80);
    x.fillStyle = '#fff'; x.font = '64px "' + fam + '"';
    x.textBaseline = 'top'; x.fillText(ch, 4, 4);
    const d = x.getImageData(0, 0, 80, 80).data;
    let on = 0; const bits = [];
    for (let i = 0; i < d.length; i += 4) { const v = d[i] > 90 ? 1 : 0; on += v; bits.push(v); }
    return { on, sig: bits.join('') };
  };
  // A family nobody has. Whatever this renders as is the system default, so a
  // candidate whose picture matches it was not installed, it only fell back.
  const cA = ink('__no_such_family_9x7__', '\u4e2d');
  const cB = ink('__no_such_family_9x7__', '\u56fd');
  const out = [{
    family: '(system fallback)', inkA: cA.on, inkB: cB.on, inkBox: 0,
    distinctGlyphs: cA.sig !== cB.sig, notTofu: true,
    hasInk: cA.on > 120 && cB.on > 120, installed: false,
  }];
  for (const fam of cands) {
    const a = ink(fam, '\\u4e2d');
    const b = ink(fam, '\\u56fd');
    const box = ink(fam, '\\ue001');
    out.push({
      family: fam,
      inkA: a.on, inkB: b.on, inkBox: box.on,
      distinctGlyphs: a.sig !== b.sig,
      notTofu: a.sig !== box.sig && b.sig !== box.sig,
      hasInk: a.on > 120 && b.on > 120,
      installed: a.sig !== cA.sig || b.sig !== cB.sig,
    });
  }
  // What the site's own stack actually resolves to on this machine. This is
  // what the card will use, so this is what has to be checked.
  const site = ink(SITE_CJK, '\u4e2d');
  const siteB = ink(SITE_CJK, '\u56fd');
  const siteBox = ink(SITE_CJK, '\ue001');
  return {
    candidates: out,
    site: {
      inkA: site.on, inkB: siteB.on, inkBox: siteBox.on,
      distinctGlyphs: site.sig !== siteB.sig,
      notTofu: site.sig !== siteBox.sig && siteB.sig !== siteBox.sig,
      hasInk: site.on > 120 && siteB.on > 120,
      // which named face draws the same picture, so the report can name it
      matches: out.filter((o) => o.inkA === site.on && o.inkB === siteB.on).map((o) => o.family),
    },
  };
})()`;

await page.setContent(shell('', '', 'sans-serif'), { waitUntil: 'load' });
await page.evaluate(
  `Promise.all(${JSON.stringify(FACES.map((f) => `${f.weight} 40px "${f.family}"`))}.map((f) => document.fonts.load(f))).then(() => document.fonts.ready)`,
);
type Cand = {
  family: string; inkA: number; inkB: number; inkBox: number;
  distinctGlyphs: boolean; notTofu: boolean; hasInk: boolean; installed: boolean;
};
const probe = (await page.evaluate(cjkProbe)) as {
  candidates: Cand[];
  site: {
    inkA: number; inkB: number; inkBox: number;
    distinctGlyphs: boolean; notTofu: boolean; hasInk: boolean; matches: string[];
  };
};
const probes = probe.candidates;

console.log('CJK face probe, rasterising 中 and 国 against a private use box:');
for (const p of probes) {
  console.log(
    `  ${p.family.padEnd(20)} ink ${String(p.inkA).padStart(4)}/${String(p.inkB).padStart(4)} box ${String(p.inkBox).padStart(4)}` +
      `  distinct=${p.distinctGlyphs} notTofu=${p.notTofu} hasInk=${p.hasInk} installed=${p.installed}`,
  );
}
// The assertion is on the stack the card actually uses: two different Han
// characters must draw two different pictures, and neither may match the tofu
// box, or the Chinese would ship as rows of empty rectangles. Note that a face
// which IS the system default cannot be shown to be "installed": asking for it
// and not asking for it draw the same picture.
const site = probe.site;
console.log('');
console.log('the site --cjk stack, as it resolves on this machine:');
console.log(`  ink ${site.inkA}/${site.inkB}  tofu box ${site.inkBox}`);
console.log(`  distinct glyphs ${site.distinctGlyphs}  not tofu ${site.notTofu}  has ink ${site.hasInk}`);
console.log(`  draws the same picture as: ${site.matches.length ? site.matches.join(', ') : '(no named candidate)'}`);
if (!(site.distinctGlyphs && site.notTofu && site.hasInk)) {
  throw new Error('the CJK stack does not render Han glyphs here; refusing to write the Chinese card');
}
const chosenFamily = SITE_CJK;

async function render(name: string, body: string, css: string, cjk: string) {
  await page.setContent(shell(body, css, cjk), { waitUntil: 'load' });
  await page.evaluate(
    `Promise.all(${JSON.stringify(FACES.map((f) => `${f.weight} 40px "${f.family}"`))}.map((f) => document.fonts.load(f))).then(() => document.fonts.ready)`,
  );
  const checks = (await page.evaluate(`(() => {
    const faces = ${JSON.stringify(FACES.map((f) => ({ family: f.family, weight: f.weight })))};
    const out = {};
    for (const f of faces) out[f.family + ' ' + f.weight] = document.fonts.check(f.weight + ' 40px "' + f.family + '"');
    let over = [];
    document.querySelectorAll('*').forEach((e) => {
      if (e === document.body || e === document.documentElement) return;
      const r = e.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      if (r.left < 59 || r.right > ${W} - 59 || r.top < 51 || r.bottom > ${H} - 51) {
        over.push((typeof e.className === 'string' ? e.className : e.tagName) + ' ' + JSON.stringify([Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)]));
      }
      const ov = getComputedStyle(e).overflow;
      if (ov !== 'visible' && (e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 1)) {
        over.push('CLIPPED ' + (typeof e.className === 'string' ? e.className : e.tagName));
      }
    });
    return { checks: out, over: over.slice(0, 6) };
  })()`)) as { checks: Record<string, boolean>; over: string[] };

  const missing = Object.entries(checks.checks).filter(([, v]) => !v).map(([k]) => k);
  if (missing.length) throw new Error(`${name}: faces unavailable: ${missing.join(', ')}`);
  if (checks.over.length) {
    const fit = (await page.evaluate(
      `[...document.querySelectorAll('.cell, .head, .row, .sub, .title')].map((e) => (typeof e.className === 'string' ? e.className : e.tagName) + ' box ' + Math.round(e.getBoundingClientRect().height) + ' content ' + e.scrollHeight)`,
    )) as string[];
    console.log(`${name}: geometry`);
    fit.forEach((f) => console.log('    ' + f));
    throw new Error(`${name}: outside the margins or clipped: ${checks.over.join(' | ')}`);
  }

  const png = await page.screenshot({ type: 'png' });
  const path = resolve(OUT, name);
  writeFileSync(path, png);
  console.log(`${name}  ${png.length}B  ${W}x${H}  faces ok  margins ok`);
  return path;
}

const grid = cardsGridHtml();
// assert the copy really is the dictionary's, not a copy that drifted
for (const [kKey, hKey] of CARD_KEYS) {
  if (!en[kKey] || !en[hKey]) throw new Error(`missing dictionary key: ${kKey} or ${hKey}`);
}
console.log('dictionary keys used by cards-grid.png:');
console.log('  ' + grid.used.join(', '));
for (const [kKey, hKey] of CARD_KEYS) console.log(`  ${kKey} = ${en[kKey]}  |  ${hKey} = ${en[hKey]}`);
console.log('');

const gridCss = `
.grid{position:absolute;left:60px;right:60px;top:210px;bottom:210px;
  display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,1fr)}
.cell{padding:32px 42px;border-right:1px solid ${LINE};border-bottom:1px solid ${LINE};
  display:flex;flex-direction:column;justify-content:flex-start}
.cell:nth-child(3n){border-right:0}
.cell:nth-child(n+4){border-bottom:0}
.k{display:flex;gap:14px;align-items:baseline;margin-bottom:22px;flex:0 0 auto}
.k .n{color:${GOLD}}
.k .lbl{color:${DIM}}
.head{font-family:'Instrument Serif',serif;font-weight:400;font-size:50px;line-height:1.16;
  letter-spacing:.005em;color:${INK};flex:0 0 auto}
.head.small{font-size:42px;line-height:1.2}`;

await render('cards-grid.png', grid.html, gridCss, chosenFamily);

const term = zhTerminalHtml();
console.log('\nzh lines rendered on zh-terminal.png, from the zh dictionary and formatters:');
term.lines.forEach((l) => console.log(`  ${l}`));
const termCss = `
.head-wrap{position:absolute;left:60px;top:196px;right:420px}
.title{font-family:'Instrument Serif',serif;font-size:76px;line-height:1;letter-spacing:.005em}
.sub{margin-top:20px;font-size:21px;font-weight:500;letter-spacing:.1em;color:${DIM};line-height:1.6}
.tabs{position:absolute;left:60px;right:60px;top:400px;display:flex;gap:56px;
  border-bottom:1px solid ${LINE}}
.tab{font-size:27px;font-weight:500;letter-spacing:.14em;color:${GHOST};position:relative;padding-bottom:20px}
.tab.on{color:${GOLD}}
.tab.on::after{content:'';position:absolute;left:0;right:0;bottom:-1px;height:2px;background:${GOLD}}
.feed{position:absolute;left:60px;right:60px;top:498px}
.row{display:grid;grid-template-columns:150px 100px 1fr;align-items:baseline;gap:26px;
  padding:26px 0;border-bottom:1px solid ${LINE};font-size:24px}
.row:last-child{border-bottom:0}
.row .t{color:${GHOST};font-weight:500;letter-spacing:.08em}
.row .kk{color:${DIM};font-weight:500;letter-spacing:.1em}
.row .m{color:${INK}}
.row .m.neg{color:#b8654e}
.toggle{position:absolute;right:60px;top:202px;display:flex;align-items:baseline;gap:16px;
  font-size:30px;font-weight:500;letter-spacing:.16em}
.toggle .en{color:${GHOST}}
.toggle .sep{color:${GHOST}}
.toggle .zh{color:${GOLD}}`;

await render('zh-terminal.png', term.html, termCss, chosenFamily);

console.log(`\nout: ${OUT}`);
await browser.close();

# THE BANK IS RUNNING

The Standard Reserve's economy, implemented early from [whitepaper v0.1](https://www.standardreserve.xyz/whitepaper/) and running autonomously in the browser.

The protocol has not launched. This runs its rules now, so anyone can watch the machine work: one thousand banks, one pool, one signal. Nobody can intervene, including the person watching. The only control is time.

**Unofficial. Not affiliated with The Standard Reserve.**

## What is actually implemented

Not a mockup. The whitepaper's mechanics execute on every tick:

- **Supply identity (3.1, 3.2).** `circulating = 100,000,000 genesis + mints − burns`, checked every tick against the tokens that actually exist across the pool and every wallet. Max supply is strictly non-increasing. Tokens are minted only at a withdrawal; issuance accrues as ledger entries.
- **Net flow signal (4.1).** A constant-product ETH/$STANDARD pool with a hook that reports gross ETH in from buys minus gross ETH out from sells. The policy signal aggregates the two completed epochs behind the current one.
- **Monetary policy (5.2).** Issuance is a base rate scaled by a multiplier in `[0.20, 1.25]`, streamed continuously to every branch. Cuts land in one step, raises are earned one epoch at a time.
- **Fee engine (11).** Every swap pays an ETH fee. 70% to the active vault, 15% to protocol owned liquidity that only grows, 15% to the team. The expansion vault buys tokenized gold; the contraction vault buys $STANDARD back and burns it, in rate limited hourly steps.
- **Auctions (7, 8).** Daily falling-price Dutch auctions for expansion licenses (paid in $STANDARD, burned) and for charters (paid in ETH, routed to the fee engine).
- **Exits (9.1).** A quadratic resolution fee against seven day exit pressure. Half burned, half paid to the bankers who stayed. Withdrawals are never paused or queued.
- **Dormancy (10).** Inactive wallets can be reported, with a bounty to the informant and a revocation fee split between the burn and the bankers still at their desks.

Around a thousand agent bankers with distinct temperaments, and a trader population whose mood walks its own cycle, drive the whole thing. Runs on the bank emerge from that population; nothing triggers them.

## Tech

Vite + React + TypeScript. No UI component library, no CSS framework, no charting library. One hand-written stylesheet with CSS variables, and every chart is hand-built SVG. The economy runs in a plain TypeScript module on its own `requestAnimationFrame` loop, decoupled from React rendering: the UI subscribes to snapshots at a fixed rate rather than once per tick.

## Run it

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build      # production build
npm test           # engine unit tests, including the supply identity invariant
npm run sim        # headless soak: 200 epochs, reports whether every mechanic fires
npm run dormancy   # dormancy budget: revocations per seven epoch window
npm run licenses   # license auction clearing, by regime
```

## Assumed parameters

The whitepaper redacts every launch value until launch: base issuance, multiplier steps, epoch length, the trading fee, the resolution fee floor and ceiling, the license and charter floors. The figures used here are reasoned placeholders, not protocol truth.

Every one of them is listed with its reasoning in the app, under **LOG → ASSUMED PARAMETERS**, and defined in [`src/engine/constants.ts`](src/engine/constants.ts) split into `SPEC` (stated in the whitepaper) and `ASSUMED` (chosen here). Final parameters will be announced by the protocol.

$STANDARD is experimental. Nothing here is investment advice.

## Credit

Built by [@0xmeto\_](https://x.com/0xmeto_) · github [mettin4](https://github.com/mettin4)

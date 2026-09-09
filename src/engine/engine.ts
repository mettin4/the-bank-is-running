import {
  BASE_ISSUANCE_PER_DAY,
  BUYBACK_POOL_FRACTION,
  BUYBACK_VAULT_FRACTION,
  CHARTER_FLOOR_ETH,
  CHARTER_OPEN_MULTIPLE,
  DORMANCY_BOUNTY_CAP,
  DORMANCY_BOUNTY_RATE,
  DORMANCY_DAYS,
  DORMANT_AGENT_RATE,
  DORMANT_ONSET_JITTER_HOURS,
  DORMANT_ONSET_MIN_HOURS,
  DORMANT_ONSET_SPREAD_HOURS,
  FEE_SPLIT_POL,
  FEE_SPLIT_TEAM,
  FEE_SPLIT_VAULT,
  GENESIS_CHARTERS,
  GENESIS_POL,
  GENESIS_POOL_ETH,
  GOLD_ETH_PER_OZ,
  HARD_CAP,
  HOURS_PER_EPOCH,
  ISSUANCE_BUDGET,
  LICENSES_PER_CHARTER_PER_DAY,
  LICENSES_PER_DAY,
  LICENSE_OPEN_MULTIPLE,
  MAX_BRANCHES_PER_CHARTER,
  M_LAUNCH,
  RESOLUTION_FEE_CEILING,
  RESOLUTION_WINDOW_DAYS,
  REVOCATION_FEE_RATE,
} from './constants';
import { buy, buyNoFee, price as poolPrice, sell, type Pool } from './amm';
import {
  dailyYieldPerBranch,
  dutchPrice,
  exitPressure,
  licenseFloor,
  nextMultiplier,
  policySignal,
  resolutionFee,
} from './policy';
import { mulberry32 } from './rng';
import type {
  Charter,
  EpochRecord,
  EventKind,
  LoudClass,
  Profile,
  ProtocolEvent,
  Regime,
  Sentiment,
  Snapshot,
} from './types';

const MAX_EVENTS = 60;
const MAX_EPOCHS = 240;
const MAX_PRICE_POINTS = 480;
const WITHDRAW_WINDOW = RESOLUTION_WINDOW_DAYS * HOURS_PER_EPOCH;

const SENTIMENT_ORDER: Sentiment[] = ['ACCUMULATION', 'EXPANSION', 'DISTRIBUTION', 'CAPITULATION'];

const SENTIMENT_BIAS: Record<Sentiment, { buy: number; sell: number }> = {
  ACCUMULATION: { buy: 1.18, sell: 0.8 },
  EXPANSION: { buy: 1.85, sell: 0.62 },
  DISTRIBUTION: { buy: 0.84, sell: 1.34 },
  CAPITULATION: { buy: 0.44, sell: 1.9 },
};

/** How fast the market's valuation anchor follows price, and how hard it pulls. */
const ANCHOR_ALPHA = 1 / 900;
const ANCHOR_PULL = 1.4;

/**
 * The bank's own balance sheet, as a floor under the market.
 *
 * A pure price anchor has no memory of what the protocol built, so a bull cycle
 * hands back everything it gained and every run ends near where it began. The
 * reserve is the memory: hard assets plus permanent liquidity, per token, times
 * the multiple a calm market pays over book. The anchor is only ever pulled UP
 * toward it, never down, so the floor ratchets and cannot fall.
 *
 * This is what makes direction depend on the regime. Expansion epochs route
 * fees into gold and the floor climbs quickly; contraction epochs spend the
 * same fees on buybacks, so only the permanent liquidity share keeps building
 * and the floor barely moves. A bull cycle keeps its gains, a long bear does
 * not get a rising floor to stand on.
 */
const BOOK_PREMIUM = 7;
const BOOK_ALPHA = 1 / 1200;

const PROFILE_MIX: { profile: Profile; weight: number }[] = [
  { profile: 'COMPOUNDER', weight: 0.3 },
  { profile: 'YIELD_TAKER', weight: 0.3 },
  { profile: 'FLIPPER', weight: 0.2 },
  { profile: 'PASSIVE', weight: 0.15 },
  { profile: 'DRIFTER', weight: 0.05 },
];

export class Engine {
  private rnd: () => number;

  /* clock */
  hour = 0;
  epoch = 1;
  hourInEpoch = 0;

  /* supply, whitepaper 3.1 and 3.2 */
  mintedWithdrawal = 0;
  mintedSettlement = 0;
  burns = 0;
  burnLicense = 0;
  burnBuyback = 0;
  burnResolution = 0;
  burnRevocation = 0;
  issued = 0;

  /* tokens that actually exist, kept so the identity can be proved, not assumed */
  pool: Pool = { eth: GENESIS_POOL_ETH, std: GENESIS_POL };
  outsideStd = 0;

  /* policy */
  m = M_LAUNCH;
  mPrev = M_LAUNCH;
  regime: Regime = 'EXPANSION';
  flows: number[] = [];
  netFlowEpoch = 0;

  /* fee engine */
  expansionVault = 0;
  contractionVault = 0;
  reserveOz = 0;
  polEth = 0;
  polStd = 0;
  teamEth = 0;
  feeEthTotal = 0;

  /* the bank */
  charters: Charter[] = [];
  chartersMinted = 0;
  chartersBurned = 0;
  /** Charters ended by the dormancy rule, as opposed to a banker walking out. */
  revocations = 0;
  totalBranches = 0;
  perBranchAcc = 0;
  redistributed = 0;
  private sumSettled = 0;
  private sumBranchAcc = 0;

  /* exits */
  private withdrawRing = new Float64Array(WITHDRAW_WINDOW);
  private withdrawCursor = 0;
  withdrawn7d = 0;

  /* auctions */
  licenseSoldToday = 0;
  licenseLastSale = 0;
  licenseLastSaleAt = 0;
  licenseStart = 0;
  charterSoldToday = 0;
  charterLastSale = CHARTER_FLOOR_ETH;
  charterLastSaleAt = 0;
  charterStart = CHARTER_FLOOR_ETH * CHARTER_OPEN_MULTIPLE;
  charterSupplyToday = 0;

  /* market mood. Nothing here is ever triggered from outside the engine. */
  sentiment: Sentiment = 'ACCUMULATION';
  severity = 1;
  run = false;
  private sentimentHoursLeft = 180;
  private runHoursLeft = 0;
  private sellQueue = 0;
  private logAnchor = Math.log(GENESIS_POOL_ETH / GENESIS_POL);
  backing = 0;

  /* epoch deltas */
  private atEpochStart = { issued: 0, burns: 0, withdrawn: 0, reserveOz: 0, m: M_LAUNCH };
  private withdrawnInEpoch = 0;

  /* history */
  epochs: EpochRecord[] = [];
  priceSeries: number[] = [];
  events: ProtocolEvent[] = [];
  private eventId = 0;

  private feeAlarm = false;
  private agentCursor = 0;
  private dormancyCursor = 0;

  version = 0;

  constructor(seed = 20260909) {
    this.rnd = mulberry32(seed);
    this.seedBank();
    this.licenseStart = licenseFloor(this.m, this.totalBranches) * LICENSE_OPEN_MULTIPLE;
    this.priceSeries.push(poolPrice(this.pool));
    this.pushEvent('SYSTEM', 'GENESIS LIQUIDITY SEEDED · 100,000,000 $STANDARD PAIRED', 0);
    this.pushEvent('SYSTEM', `${GENESIS_CHARTERS} FOUNDING CHARTERS ISSUED · ONE BRANCH EACH`, 0);
  }

  private seedBank() {
    for (let i = 0; i < GENESIS_CHARTERS; i++) {
      const r = this.rnd();
      let acc = 0;
      let profile: Profile = 'PASSIVE';
      for (const p of PROFILE_MIX) {
        acc += p.weight;
        if (r <= acc) {
          profile = p.profile;
          break;
        }
      }
      const c: Charter = {
        id: i + 1,
        branches: 1,
        settled: 0,
        accSnap: 0,
        lastActive: 0,
        profile,
        alive: true,
        licensesToday: 0,
        wallet: 0,
        nerve: this.rnd(),
        goesDarkAt: Number.POSITIVE_INFINITY,
      };
      this.charters.push(c);
      this.totalBranches += 1;
      this.sumBranchAcc += c.branches * c.accSnap;
    }

    this.markDormantAgents();
  }

  /**
   * Lost keys and abandoned wallets. Exactly this many, never more, chosen at
   * random and given onsets spread across a long window so the revocations that
   * follow arrive a few per week rather than in a wave.
   */
  private markDormantAgents() {
    const target = Math.round(GENESIS_CHARTERS * DORMANT_AGENT_RATE);
    const picked = new Set<number>();
    while (picked.size < target) picked.add(Math.floor(this.rnd() * this.charters.length));
    let k = 0;
    for (const i of picked) {
      // Deterministic stride plus jitter, so onsets never bunch up.
      const slot = (k + 0.5) / target;
      k += 1;
      const jitter = (this.rnd() - 0.5) * 2 * DORMANT_ONSET_JITTER_HOURS;
      this.charters[i].goesDarkAt = Math.max(
        DORMANT_ONSET_MIN_HOURS,
        Math.round(DORMANT_ONSET_MIN_HOURS + slot * DORMANT_ONSET_SPREAD_HOURS + jitter),
      );
    }
  }

  /* ------------------------------------------------------------ ledger ----
   * Issuance is streamed to every branch through one accumulator, so crediting
   * a thousand banks is a single addition. A charter's balance is
   *   settled + branches * (perBranchAcc - accSnap)
   * and the aggregate the exit fee needs is
   *   sumSettled + perBranchAcc * totalBranches - sumBranchAcc.
   * Every mutation goes through the three writers below so both stay exact.
   */

  private balanceOf(c: Charter): number {
    return c.settled + c.branches * (this.perBranchAcc - c.accSnap);
  }

  private writeSettled(c: Charter, value: number) {
    this.sumSettled += value - c.settled;
    c.settled = value;
  }

  private writeBranches(c: Charter, value: number) {
    this.sumBranchAcc += (value - c.branches) * c.accSnap;
    this.totalBranches += value - c.branches;
    c.branches = value;
  }

  private settle(c: Charter) {
    const bal = this.balanceOf(c);
    this.sumBranchAcc += c.branches * (this.perBranchAcc - c.accSnap);
    c.accSnap = this.perBranchAcc;
    this.writeSettled(c, bal);
  }

  /** Credit every live branch pro rata. Returns false when there is no one left. */
  private creditAllBranches(amount: number): boolean {
    if (amount <= 0 || this.totalBranches <= 0) return false;
    this.perBranchAcc += amount / this.totalBranches;
    return true;
  }

  get ledgerHeld(): number {
    return this.sumSettled + this.perBranchAcc * this.totalBranches - this.sumBranchAcc;
  }

  get circulating(): number {
    return GENESIS_POL + this.mintedWithdrawal + this.mintedSettlement - this.burns;
  }

  get maxSupply(): number {
    return HARD_CAP - this.burns;
  }

  /* -------------------------------------------------------------- burn ----
   * A ledger balance spent inside the bank is minted and burned in one step.
   * Circulating supply does not move, max supply falls. See ASSUMED PARAMETERS.
   */
  private settleBurn(amount: number, bucket: 'license' | 'resolution' | 'revocation') {
    if (amount <= 0) return;
    this.mintedSettlement += amount;
    this.burns += amount;
    if (bucket === 'license') this.burnLicense += amount;
    else if (bucket === 'resolution') this.burnResolution += amount;
    else this.burnRevocation += amount;
  }

  /* --------------------------------------------------------------- fee ---- */

  private routeProtocolEth(eth: number) {
    if (eth <= 0) return;
    this.feeEthTotal += eth;

    if (this.regime === 'EXPANSION') this.expansionVault += eth * FEE_SPLIT_VAULT;
    else this.contractionVault += eth * FEE_SPLIT_VAULT;

    // 15% to protocol owned liquidity: half swapped to $STANDARD, paired, added forever.
    const toPol = eth * FEE_SPLIT_POL;
    const half = toPol / 2;
    const bought = buyNoFee(this.pool, half);
    this.pool.eth += half;
    this.pool.std += bought;
    this.polEth += toPol;
    this.polStd += bought;

    this.teamEth += eth * FEE_SPLIT_TEAM;
  }

  /* ------------------------------------------------------------ market ---- */

  /**
   * The mood of the market walks its own cycle. Occasionally a capitulation
   * phase accelerates into a run on the bank. Nothing outside the engine can
   * start one, and nothing can stop one either.
   */
  private stepSentiment() {
    if (this.runHoursLeft > 0) {
      this.runHoursLeft -= 1;
      if (this.runHoursLeft === 0) {
        this.run = false;
        this.pushEvent('EXIT', 'RUN SUBSIDED · THE DOOR WAS PRICED, NEVER CLOSED', 0);
      }
    }

    this.sentimentHoursLeft -= 1;
    if (this.sentimentHoursLeft > 0) return;

    const i = SENTIMENT_ORDER.indexOf(this.sentiment);
    const skip = this.rnd() < 0.18 ? 2 : 1;
    this.sentiment = SENTIMENT_ORDER[(i + skip) % SENTIMENT_ORDER.length];
    this.sentimentHoursLeft = 110 + Math.floor(this.rnd() * 280);
    this.severity = 0.78 + this.rnd() * 0.9;

    const bullish = this.sentiment === 'ACCUMULATION' || this.sentiment === 'EXPANSION';
    this.pushEvent('SYSTEM', `MARKET REGIME · ${this.sentiment}`, bullish ? 1 : -1);

    if (this.sentiment === 'CAPITULATION' && this.rnd() < 0.55) {
      this.run = true;
      this.runHoursLeft = 40 + Math.floor(this.rnd() * 70);
      this.severity = Math.max(this.severity, 1.55);
      this.pushEvent('EXIT', 'EXIT VOLUME ACCELERATING · RESOLUTION FEE REPRICING THE DOOR', -1, 'RUN');
    }
  }

  /**
   * Appetite to retire branches. Mood sets it, the resolution fee takes it back.
   * This is the inverted bank run: heavy exit volume raises the fee on the
   * exiters themselves, so the relative payoff of holding rises exactly when
   * exit pressure peaks and the run puts itself out.
   */
  private get exitUrge(): number {
    let urge: number;
    if (this.run) urge = 0.16 + 0.1 * Math.max(0, this.severity - 1);
    else if (this.sentiment === 'CAPITULATION') urge = 0.032;
    else if (this.sentiment === 'DISTRIBUTION') urge = 0.009;
    else return 0;
    const deterrence = 1 - Math.min(0.93, this.resolutionFeeNow / RESOLUTION_FEE_CEILING);
    return urge * deterrence;
  }

  /**
   * Traders are not a random walk. They price the token against a slow anchor
   * and against the balance sheet the bank has actually stacked, so a rich
   * market meets sellers and a token trading under its hard backing meets the
   * bid the reserve implies. Mood decides the direction, valuation decides how
   * far it gets to run.
   */
  private stepMarket() {
    const bias = SENTIMENT_BIAS[this.sentiment];
    const bullish = this.sentiment === 'ACCUMULATION' || this.sentiment === 'EXPANSION';
    const moodBuy = bias.buy * (bullish ? this.severity : 1 / this.severity);
    const moodSell = bias.sell * (bullish ? 1 / this.severity : this.severity);

    const px0 = poolPrice(this.pool);

    // Reserves plus permanent liquidity, per token. The floor under the market.
    this.backing = (this.reserveOz * GOLD_ETH_PER_OZ + this.polEth) / Math.max(1, this.circulating);

    this.logAnchor += (Math.log(px0) - this.logAnchor) * ANCHOR_ALPHA;
    if (this.backing > 0) {
      const book = Math.log(this.backing * BOOK_PREMIUM);
      if (book > this.logAnchor) this.logAnchor += (book - this.logAnchor) * BOOK_ALPHA;
    }

    const dev = Math.log(px0) - this.logAnchor;
    const revert = Math.exp(-Math.max(-2.5, Math.min(2.5, dev)) * ANCHOR_PULL);
    const support = px0 > 0 && this.backing > px0 ? 1 + Math.min(4, this.backing / px0 - 1) * 1.6 : 1;

    const scale = this.pool.eth * 0.0062;
    const noise = () => 0.35 + this.rnd() * 1.55;

    const ethIn = scale * moodBuy * revert * support * noise();
    if (ethIn > 0) {
      const r = buy(this.pool, ethIn);
      this.outsideStd += r.std;
      this.netFlowEpoch += r.grossEth;
      this.routeProtocolEth(r.feeEth);
    }

    const px = poolPrice(this.pool);
    const drain = this.sellQueue * 0.16;
    this.sellQueue -= drain;
    let stdIn = drain;
    if (px > 0) stdIn += (scale * moodSell * noise()) / (px * revert * support);
    stdIn = Math.min(stdIn, Math.max(0, this.outsideStd * 0.035));

    if (stdIn > 0) {
      const r = sell(this.pool, stdIn);
      this.outsideStd -= r.std;
      this.netFlowEpoch -= r.grossEth;
      this.routeProtocolEth(r.feeEth);
    }
  }

  /* ---------------------------------------------------------- issuance ---- */

  private stepIssuance() {
    if (this.issued >= ISSUANCE_BUDGET) return;
    let issue = (BASE_ISSUANCE_PER_DAY * this.m) / HOURS_PER_EPOCH;
    if (this.issued + issue > ISSUANCE_BUDGET) issue = ISSUANCE_BUDGET - this.issued;
    if (this.creditAllBranches(issue)) this.issued += issue;
  }

  /* ---------------------------------------------------------- buyback ----
   * Small rate limited steps, so defence cannot be baited into one blockable
   * shot. Unspent balance rolls forward. The vault can never sell.
   */
  private stepBuyback() {
    if (this.contractionVault <= 1e-9) return;
    const spend = Math.min(
      BUYBACK_VAULT_FRACTION * this.contractionVault,
      BUYBACK_POOL_FRACTION * this.pool.eth,
    );
    if (spend <= 1e-9) return;
    this.contractionVault -= spend;
    const bought = buyNoFee(this.pool, spend);
    this.burns += bought;
    this.burnBuyback += bought;
    if (bought > 1 && this.hour % 8 === 0) {
      this.pushEvent('BURN', `BUYBACK TICK · ${fmt(bought)} $STANDARD BOUGHT AND BURNED`, -1);
    }
  }

  /* ---------------------------------------------------------- auctions ---- */

  get licenseFloorNow(): number {
    return licenseFloor(this.m, this.totalBranches);
  }

  get licensePriceNow(): number {
    const floor = this.licenseFloorNow;
    return dutchPrice(Math.max(this.licenseStart, floor), floor, this.hourInEpoch / HOURS_PER_EPOCH);
  }

  get charterPriceNow(): number {
    return dutchPrice(
      Math.max(this.charterStart, CHARTER_FLOOR_ETH),
      CHARTER_FLOOR_ETH,
      this.hourInEpoch / HOURS_PER_EPOCH,
    );
  }

  private buyLicense(c: Charter): boolean {
    if (this.licenseSoldToday >= LICENSES_PER_DAY) return false;
    if (c.licensesToday >= LICENSES_PER_CHARTER_PER_DAY) return false;
    if (c.branches >= MAX_BRANCHES_PER_CHARTER) return false;

    const price = this.licensePriceNow;
    this.settle(c);
    if (c.settled < price) return false;

    this.writeSettled(c, c.settled - price);
    this.writeBranches(c, c.branches + 1);
    c.licensesToday += 1;
    c.lastActive = this.hour;

    this.settleBurn(price, 'license');
    this.licenseSoldToday += 1;
    this.licenseLastSale = price;
    this.licenseLastSaleAt = this.hourInEpoch / HOURS_PER_EPOCH;
    return true;
  }

  private buyCharter(): boolean {
    if (this.charterSoldToday >= this.charterSupplyToday) return false;
    const price = this.charterPriceNow;
    const c: Charter = {
      id: GENESIS_CHARTERS + this.chartersMinted + 1,
      branches: 1,
      settled: 0,
      accSnap: this.perBranchAcc,
      lastActive: this.hour,
      profile: this.rnd() < 0.45 ? 'COMPOUNDER' : this.rnd() < 0.6 ? 'FLIPPER' : 'YIELD_TAKER',
      alive: true,
      licensesToday: 0,
      wallet: 0,
      nerve: this.rnd(),
      goesDarkAt: Number.POSITIVE_INFINITY,
    };
    this.charters.push(c);
    this.chartersMinted += 1;
    this.totalBranches += 1;
    this.sumBranchAcc += c.branches * c.accSnap;

    this.charterSoldToday += 1;
    this.charterLastSale = price;
    this.charterLastSaleAt = this.hourInEpoch / HOURS_PER_EPOCH;
    this.routeProtocolEth(price);
    this.pushEvent('CHARTER', `CHARTER #${pad(c.id)} SOLD AT AUCTION · ${price.toFixed(3)} ETH`, 1);
    return true;
  }

  /* --------------------------------------------------------- withdrawal ---- */

  get exitPressureNow(): number {
    return exitPressure(this.withdrawn7d, this.ledgerHeld);
  }

  get resolutionFeeNow(): number {
    return resolutionFee(this.exitPressureNow);
  }

  /** Retire k branches. Liquidates their pro rata share and destroys the vehicle. */
  private retire(c: Charter, count: number) {
    const k = Math.min(count, c.branches);
    if (k <= 0) return;

    // The rate locks the moment the banker commits.
    const feeRate = this.resolutionFeeNow;

    this.settle(c);
    const gross = c.settled * (k / c.branches);
    if (gross <= 0 && c.branches > k) return;

    this.writeSettled(c, c.settled - gross);
    this.writeBranches(c, c.branches - k);
    c.lastActive = this.hour;

    const fee = gross * feeRate;
    const net = gross - fee;

    this.mintedWithdrawal += net;
    this.outsideStd += net;

    const sellShare = c.profile === 'FLIPPER' ? 0.95 : c.profile === 'YIELD_TAKER' ? 0.7 : 0.5;
    this.sellQueue += net * sellShare;
    c.wallet += net * (1 - sellShare);

    const half = fee / 2;
    this.settleBurn(half, 'resolution');

    const dissolved = c.branches === 0;
    if (dissolved) {
      c.alive = false;
      this.chartersBurned += 1;
    }

    if (this.creditAllBranches(half)) this.redistributed += half;
    else this.settleBurn(half, 'resolution');

    this.recordWithdrawal(gross);

    if (dissolved) {
      this.pushEvent(
        'EXIT',
        `CHARTER #${pad(c.id)} DISSOLVED · LAST BRANCH RETIRED · ${fmt(gross)} REALIZED`,
        -1,
      );
    } else if (gross > 60_000 || feeRate > 0.09) {
      this.pushEvent(
        'EXIT',
        `CHARTER #${pad(c.id)} RETIRED ${k} BRANCH${k > 1 ? 'ES' : ''} · ${fmt(gross)} AT ${(feeRate * 100).toFixed(2)}% RESOLUTION FEE`,
        -1,
      );
    }
  }

  private recordWithdrawal(amount: number) {
    this.withdrawRing[this.withdrawCursor] += amount;
    this.withdrawn7d += amount;
    this.withdrawnInEpoch += amount;
  }

  private rollWithdrawWindow() {
    this.withdrawCursor = (this.withdrawCursor + 1) % WITHDRAW_WINDOW;
    this.withdrawn7d = Math.max(0, this.withdrawn7d - this.withdrawRing[this.withdrawCursor]);
    this.withdrawRing[this.withdrawCursor] = 0;
  }

  /* ---------------------------------------------------------- dormancy ---- */

  private stepDormancy() {
    const cutoff = this.hour - DORMANCY_DAYS * HOURS_PER_EPOCH;
    if (cutoff <= 0 || this.charters.length === 0) return;
    for (let scanned = 0; scanned < 24; scanned++) {
      this.dormancyCursor = (this.dormancyCursor + 1) % this.charters.length;
      const g = this.charters[this.dormancyCursor];
      if (!g.alive || g.branches === 0) continue;
      if (g.lastActive > cutoff) continue;
      if (this.rnd() > 0.3) continue;
      this.revoke(g);
      return;
    }
  }

  private revoke(g: Charter) {
    this.settle(g);
    const bal = g.settled;

    const bounty = Math.min(bal * DORMANCY_BOUNTY_RATE, DORMANCY_BOUNTY_CAP);
    const burnHalf = bal * (REVOCATION_FEE_RATE / 2);
    const stayers = Math.max(0, bal * (REVOCATION_FEE_RATE / 2) - bounty);
    const remain = bal * (1 - REVOCATION_FEE_RATE);

    const shuttered = g.branches;
    this.writeSettled(g, 0);
    this.writeBranches(g, 0);
    g.alive = false;
    this.chartersBurned += 1;
    this.revocations += 1;

    this.settleBurn(burnHalf, 'revocation');

    this.mintedWithdrawal += remain;
    this.outsideStd += remain;
    this.sellQueue += remain * 0.85;
    g.wallet += remain * 0.15;

    // The bounty is a ledger transfer from the ghost to the informant. Nothing
    // is minted and nothing is burned, so the identity is untouched.
    const reporter = this.findReporter();
    if (reporter && bounty > 0) {
      this.settle(reporter);
      this.writeSettled(reporter, reporter.settled + bounty);
      reporter.lastActive = this.hour;
    }

    if (this.creditAllBranches(stayers)) this.redistributed += stayers;
    else this.settleBurn(stayers, 'revocation');

    this.pushEvent(
      'DORMANCY',
      `CHARTER #${pad(g.id)} REVOKED · DORMANT ${DORMANCY_DAYS}D · ${shuttered} BRANCH${shuttered > 1 ? 'ES' : ''} SHUTTERED`,
      -1,
      'DORMANCY',
    );
  }

  private findReporter(): Charter | null {
    for (let i = 0; i < 40; i++) {
      const c = this.charters[Math.floor(this.rnd() * this.charters.length)];
      if (c && c.alive && c.branches > 0 && c.lastActive > this.hour - 240) return c;
    }
    return null;
  }

  /* ------------------------------------------------------------ agents ---- */

  /**
   * Appetite for a new branch, as a number of days of that branch's yield a
   * banker will pay for it. Patient profiles pay for a long payback, a sour
   * mood shortens everyone's horizon, and nobody buys a branch that cannot
   * earn its price back in a time they find tolerable. This is what makes a
   * license day clear at 100 in expansion and well short of it when capital is
   * leaving.
   */
  private paybackTolerance(c: Charter): number {
    const base =
      c.profile === 'COMPOUNDER'
        ? 95
        : c.profile === 'FLIPPER'
          ? 70
          : c.profile === 'YIELD_TAKER'
            ? 55
            : 35;
    const mood =
      this.sentiment === 'EXPANSION'
        ? 1.35
        : this.sentiment === 'ACCUMULATION'
          ? 1.1
          : this.sentiment === 'DISTRIBUTION'
            ? 0.72
            : 0.48;
    return base * mood * (0.7 + c.nerve * 0.6);
  }

  /** How often an eligible banker even considers expanding this opportunity. */
  private get expansionAppetite(): number {
    const bullish = this.sentiment === 'ACCUMULATION' || this.sentiment === 'EXPANSION';
    if (this.regime === 'EXPANSION') return bullish ? 0.85 : 0.45;
    return bullish ? 0.16 : 0.05;
  }

  /** The daily yield the branch being bought would actually earn once it opens. */
  private get marginalBranchYield(): number {
    return dailyYieldPerBranch(this.m, this.totalBranches + 1);
  }

  private tryExpand(c: Charter, appetite: number, price: number): boolean {
    if (c.branches >= MAX_BRANCHES_PER_CHARTER) return false;
    if (c.licensesToday >= LICENSES_PER_CHARTER_PER_DAY) return false;
    if (this.rnd() > appetite) return false;
    if (price > this.marginalBranchYield * this.paybackTolerance(c)) return false;
    if (this.balanceOf(c) < price) return false;
    return this.buyLicense(c);
  }

  private stepAgents() {
    const n = this.charters.length;
    if (n === 0) return;
    const urge = this.exitUrge;
    const slice = Math.max(1, Math.ceil(n / HOURS_PER_EPOCH)) * (this.run ? 3 : 1);
    const perBranchDay = dailyYieldPerBranch(this.m, this.totalBranches);
    const licensePrice = this.licensePriceNow;
    const appetite = this.expansionAppetite;
    const contracting = this.regime === 'CONTRACTION';

    for (let i = 0; i < slice; i++) {
      this.agentCursor = (this.agentCursor + 1) % n;
      const c = this.charters[this.agentCursor];
      if (!c.alive || c.branches === 0) continue;
      if (this.hour >= c.goesDarkAt) continue;

      // Staying active is free. Every banker who is still at their desk checks
      // in on every opportunity, so only a wallet that has genuinely gone dark
      // can ever run the dormancy clock out.
      c.lastActive = this.hour;

      const bal = this.balanceOf(c);
      const perBranch = bal / c.branches;

      if (urge > 0 && this.rnd() < urge * (0.35 + c.nerve * 0.5)) {
        if (c.branches === 1) {
          // Nothing to trim. Only real conviction dissolves the charter.
          if (c.nerve > 0.9) this.retire(c, 1);
        } else {
          this.retire(c, c.nerve > 0.9 ? c.branches : Math.max(1, Math.floor(c.branches / 2)));
        }
        continue;
      }

      // You cannot extract value and keep the vehicle that produced it, so a
      // bank down to its last branch grows before it harvests. Dissolving the
      // charter is a deliberate exit, not a way to take profit.
      const canHarvest = c.branches > 1;

      switch (c.profile) {
        case 'COMPOUNDER': {
          if (this.tryExpand(c, appetite, licensePrice)) continue;
          if (canHarvest && perBranch > perBranchDay * (150 + c.nerve * 120) && this.rnd() < 0.22) {
            this.retire(c, 1);
          }
          break;
        }
        case 'YIELD_TAKER': {
          if (canHarvest && perBranch > perBranchDay * (30 + c.nerve * 45)) {
            this.retire(c, 1);
            continue;
          }
          this.tryExpand(c, appetite, licensePrice);
          break;
        }
        case 'FLIPPER': {
          if (contracting && canHarvest && this.rnd() < 0.09 + c.nerve * 0.18) {
            this.retire(c, Math.max(1, Math.floor(c.branches / 2)));
            continue;
          }
          // A flipper with one branch and no conviction leaves the system.
          if (contracting && !canHarvest && c.nerve > 0.82 && this.rnd() < 0.04) {
            this.retire(c, 1);
            continue;
          }
          if (!contracting) this.tryExpand(c, appetite, licensePrice);
          break;
        }
        case 'PASSIVE': {
          if (canHarvest && perBranch > perBranchDay * (250 + c.nerve * 200) && this.rnd() < 0.07) {
            this.retire(c, 1);
            continue;
          }
          this.rnd() < 0.25 && this.tryExpand(c, appetite, licensePrice);
          break;
        }
        case 'DRIFTER': {
          break;
        }
      }
    }

    if (this.charterSupplyToday > this.charterSoldToday) {
      const p = this.charterPriceNow;
      const appetite = this.regime === 'EXPANSION' ? 0.22 : 0.04;
      if (this.rnd() < appetite / Math.max(1, p / CHARTER_FLOOR_ETH / 4)) this.buyCharter();
    }
  }

  /* ------------------------------------------------------- fee routing ----
   * The fast lever. Reads the sign of the epoch in progress, with a dust band
   * so the first hours of an epoch do not flap around zero.
   */
  private updateRegime() {
    const dust = this.pool.eth * 0.005;
    if (Math.abs(this.netFlowEpoch) < dust) return;
    const next: Regime = this.netFlowEpoch > 0 ? 'EXPANSION' : 'CONTRACTION';
    if (next === this.regime) return;
    this.regime = next;
    this.pushEvent(
      'POLICY',
      next === 'EXPANSION'
        ? 'FEE ROUTING FLIPPED · EXPANSION VAULT · HARD RESERVE ASSETS'
        : 'FEE ROUTING FLIPPED · CONTRACTION VAULT · BUYBACK AND BURN',
      next === 'EXPANSION' ? 1 : -1,
      'FLIP',
    );
  }

  /* ------------------------------------------------------------- epoch ---- */

  private closeEpoch() {
    const netFlow = this.netFlowEpoch;
    this.flows.push(netFlow);
    if (this.flows.length > 400) this.flows.shift();

    const signal = policySignal(this.flows);
    this.mPrev = this.m;
    const next = nextMultiplier(this.m, signal);

    if (next < this.m) {
      this.pushEvent(
        'POLICY',
        `RATE CUT · m ${this.m.toFixed(2)} TO ${next.toFixed(2)} · SIGNAL ${signed(signal)} ETH`,
        -1,
        'CUT',
      );
    } else if (next > this.m) {
      this.pushEvent(
        'POLICY',
        `RATE RAISE EARNED · m ${this.m.toFixed(2)} TO ${next.toFixed(2)} · SIGNAL ${signed(signal)} ETH`,
        1,
      );
    }
    const mBefore = this.m;
    this.m = next;

    if (this.expansionVault > 1e-9) {
      const oz = this.expansionVault / GOLD_ETH_PER_OZ;
      this.reserveOz += oz;
      if (oz > 0.25) {
        this.pushEvent(
          'RESERVE',
          `HARD RESERVE +${oz.toFixed(2)} OZ · ${this.expansionVault.toFixed(2)} ETH CONVERTED`,
          1,
        );
      }
      this.expansionVault = 0;
    }

    this.epochs.push({
      epoch: this.epoch,
      netFlow,
      signal,
      m: this.m,
      mBefore,
      regime: this.regime,
      sentiment: this.sentiment,
      burns: this.burns,
      circulating: this.circulating,
      price: poolPrice(this.pool),
      branches: this.totalBranches,
      reserveOz: this.reserveOz,
      exitPressure: this.exitPressureNow,
      resolutionFee: this.resolutionFeeNow,
      issuedInEpoch: this.issued - this.atEpochStart.issued,
      burnedInEpoch: this.burns - this.atEpochStart.burns,
      withdrawnInEpoch: this.withdrawnInEpoch,
      licensesSold: this.licenseSoldToday,
      chartersSold: this.charterSoldToday,
      reserveAddedOz: this.reserveOz - this.atEpochStart.reserveOz,
    });
    if (this.epochs.length > MAX_EPOCHS) this.epochs.shift();

    this.pushEvent(
      'EPOCH',
      `EPOCH ${pad(this.epoch)} CLOSED · NET FLOW ${signed(netFlow)} ETH · ${netFlow > 0 ? 'EXPANSION' : 'CONTRACTION'}`,
      netFlow > 0 ? 1 : -1,
    );

    if (this.licenseSoldToday > 0) {
      this.pushEvent(
        'LICENSE',
        `LICENSE AUCTION CLOSED · ${this.licenseSoldToday}/${LICENSES_PER_DAY} SOLD · ${fmt(this.licenseLastSale)} LAST · ALL BURNED`,
        0,
      );
    }
    this.licenseStart =
      (this.licenseSoldToday > 0 ? this.licenseLastSale : this.licenseFloorNow) *
      LICENSE_OPEN_MULTIPLE;
    this.licenseSoldToday = 0;

    this.charterStart = Math.max(
      CHARTER_FLOOR_ETH,
      (this.charterSoldToday > 0 ? this.charterLastSale : CHARTER_FLOOR_ETH) * CHARTER_OPEN_MULTIPLE,
    );
    this.charterSoldToday = 0;
    const sustained = this.flows.length >= 2 && this.flows.slice(-2).every((f) => f > 0);
    this.charterSupplyToday = !sustained ? 0 : this.m >= 1.0 ? 8 : this.m >= 0.75 ? 4 : 0;

    for (const c of this.charters) c.licensesToday = 0;

    this.epoch += 1;
    this.hourInEpoch = 0;
    this.netFlowEpoch = 0;
    this.withdrawnInEpoch = 0;
    this.atEpochStart = {
      issued: this.issued,
      burns: this.burns,
      withdrawn: this.withdrawn7d,
      reserveOz: this.reserveOz,
      m: this.m,
    };
  }

  /* -------------------------------------------------------------- step ---- */

  step() {
    this.hour += 1;
    this.hourInEpoch += 1;
    this.rollWithdrawWindow();
    this.stepSentiment();
    this.updateRegime();
    this.stepMarket();
    this.stepIssuance();
    this.stepBuyback();
    this.stepAgents();
    this.stepDormancy();

    const feeNow = this.resolutionFeeNow;
    if (!this.feeAlarm && feeNow > 0.1) {
      this.feeAlarm = true;
      this.pushEvent(
        'EXIT',
        `RESOLUTION FEE ABOVE 10% · ${(feeNow * 100).toFixed(2)}% AT THE DOOR · HALF BURNED, HALF TO THE STAYERS`,
        -1,
        'FEE',
      );
    } else if (this.feeAlarm && feeNow < 0.08) {
      this.feeAlarm = false;
    }

    if (this.hour % 2 === 0) {
      this.priceSeries.push(poolPrice(this.pool));
      if (this.priceSeries.length > MAX_PRICE_POINTS) this.priceSeries.shift();
    }

    if (this.hourInEpoch >= HOURS_PER_EPOCH) this.closeEpoch();
    this.version += 1;
  }

  /** Run the economy forward without an observer. Used to seed the first paint. */
  replay(epochs: number) {
    const steps = epochs * HOURS_PER_EPOCH;
    for (let i = 0; i < steps; i++) this.step();
  }

  /* ------------------------------------------------------------ events ---- */

  private pushEvent(
    kind: EventKind,
    text: string,
    tone: -1 | 0 | 1,
    loudClass?: LoudClass,
  ) {
    this.events.unshift({
      id: this.eventId++,
      hour: this.hour,
      epoch: this.epoch,
      kind,
      text,
      tone,
      loud: loudClass !== undefined,
      loudClass,
    });
    if (this.events.length > MAX_EVENTS) this.events.pop();
  }

  /* --------------------------------------------------------- invariant ---- */

  /** Supply claimed by 3.1 against tokens that actually exist. Must stay at zero. */
  identityDrift(): number {
    return Math.abs(this.circulating - (this.pool.std + this.outsideStd));
  }

  /* ---------------------------------------------------------- snapshot ---- */

  snapshot(running: boolean, speed: number): Snapshot {
    const floor = this.licenseFloorNow;
    const progress = this.hourInEpoch / HOURS_PER_EPOCH;
    const pressure = this.exitPressureNow;

    return {
      version: this.version,
      hour: this.hour,
      epoch: this.epoch,
      hourInEpoch: this.hourInEpoch,
      running,
      speed,

      regime: this.regime,
      m: this.m,
      mPrev: this.mPrev,
      signal: policySignal(this.flows),
      netFlowEpoch: this.netFlowEpoch,
      netFlowPrev: this.flows.length ? this.flows[this.flows.length - 1] : 0,

      circulating: this.circulating,
      maxSupply: this.maxSupply,
      mintedWithdrawal: this.mintedWithdrawal,
      mintedSettlement: this.mintedSettlement,
      burns: this.burns,
      burnLicense: this.burnLicense,
      burnBuyback: this.burnBuyback,
      burnResolution: this.burnResolution,
      burnRevocation: this.burnRevocation,
      issued: this.issued,
      ledgerHeld: this.ledgerHeld,

      poolEth: this.pool.eth,
      poolStd: this.pool.std,
      price: poolPrice(this.pool),
      outsideStd: this.outsideStd,
      backing: this.backing,

      expansionVault: this.expansionVault,
      contractionVault: this.contractionVault,
      reserveOz: this.reserveOz,
      reserveEth: this.reserveOz * GOLD_ETH_PER_OZ,
      polEth: this.polEth,
      polStd: this.polStd,
      teamEth: this.teamEth,
      feeEthTotal: this.feeEthTotal,

      charters: this.charters.length - this.chartersBurned,
      chartersBurned: this.chartersBurned,
      branches: this.totalBranches,
      perBranchDaily: dailyYieldPerBranch(this.m, this.totalBranches),

      exitPressure: pressure,
      resolutionFee: resolutionFee(pressure),
      withdrawn7d: this.withdrawn7d,
      redistributed: this.redistributed,

      licenseAuction: {
        price: this.licensePriceNow,
        start: Math.max(this.licenseStart, floor),
        floor,
        remaining: LICENSES_PER_DAY - this.licenseSoldToday,
        supply: LICENSES_PER_DAY,
        soldToday: this.licenseSoldToday,
        lastSale: this.licenseLastSale,
        lastSaleAt: this.licenseLastSaleAt,
        soldOut: this.licenseSoldToday >= LICENSES_PER_DAY,
        progress,
      },
      charterAuction: {
        price: this.charterPriceNow,
        start: Math.max(this.charterStart, CHARTER_FLOOR_ETH),
        floor: CHARTER_FLOOR_ETH,
        remaining: Math.max(0, this.charterSupplyToday - this.charterSoldToday),
        supply: this.charterSupplyToday,
        soldToday: this.charterSoldToday,
        lastSale: this.charterLastSale,
        lastSaleAt: this.charterLastSaleAt,
        soldOut: this.charterSupplyToday > 0 && this.charterSoldToday >= this.charterSupplyToday,
        progress,
      },

      sentiment: this.sentiment,
      severity: this.severity,
      run: this.run,
      stress: pressure >= 0.22 ? 'RUN' : pressure >= 0.1 ? 'ELEVATED' : 'CALM',

      epochs: this.epochs,
      priceSeries: this.priceSeries,
      events: this.events,

      identityDrift: this.identityDrift(),
    };
  }
}

function fmt(n: number): string {
  return Math.round(n).toLocaleString('en-US');
}

function pad(n: number): string {
  return String(n).padStart(4, '0');
}

function signed(n: number): string {
  return `${n >= 0 ? '+' : '-'}${Math.abs(n).toFixed(2)}`;
}

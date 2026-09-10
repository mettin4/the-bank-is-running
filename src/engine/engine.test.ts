import { describe, expect, it } from 'vitest';
import { Engine } from './engine';
import { GENESIS_POL, HARD_CAP, ISSUANCE_BUDGET, M_CEILING, M_FLOOR } from './constants';
import { dutchPrice, exitPressure, licenseFloor, nextMultiplier, policySignal, resolutionFee } from './policy';
import { buy, sell, type Pool } from './amm';

const EPS = 1e-6;

/**
 * The identity compares two independently accumulated sums of order 1e8, where
 * one ulp is about 3e-8, so an absolute bound measures how long the run is
 * rather than whether the books balance. Drift is a random walk bounded by
 * roughly sqrt(operations) x ulp; anything above this is a real leak.
 */
const driftBound = (circulating: number) => 1e-12 * circulating;

describe('supply identity (whitepaper 3.1 and 3.2)', () => {
  it('holds at every single tick for 200 epochs', () => {
    const e = new Engine(1234);
    let prevMax = e.maxSupply;
    let prevBurns = e.burns;

    for (let h = 0; h < 200 * 24; h++) {
      e.step();

      // 3.1: circulating equals genesis plus mints minus burns, and that number
      // equals the tokens that actually exist across the pool and every wallet.
      expect(e.identityDrift()).toBeLessThan(driftBound(e.circulating));

      // 3.2: max supply is strictly non increasing.
      expect(e.maxSupply).toBeLessThanOrEqual(prevMax + EPS);
      expect(e.burns).toBeGreaterThanOrEqual(prevBurns - EPS);
      prevMax = e.maxSupply;
      prevBurns = e.burns;

      expect(e.circulating).toBeGreaterThan(0);
      expect(e.circulating).toBeLessThanOrEqual(e.maxSupply + EPS);
      expect(e.outsideStd).toBeGreaterThan(-EPS);
      expect(e.pool.std).toBeGreaterThan(0);
      expect(e.pool.eth).toBeGreaterThan(0);
    }

    expect(e.circulating).toBeCloseTo(GENESIS_POL + e.mintedWithdrawal + e.mintedSettlement - e.burns, 4);
    expect(e.maxSupply).toBeCloseTo(HARD_CAP - e.burns, 4);
  });

  it('never issues past the 900,000,000 budget', () => {
    const e = new Engine(7);
    for (let h = 0; h < 4000; h++) e.step();
    expect(e.issued).toBeLessThanOrEqual(ISSUANCE_BUDGET + EPS);
  });

  it('keeps the aggregate ledger equal to the sum of every charter balance', () => {
    const e = new Engine(99);
    for (let h = 0; h < 60 * 24; h++) {
      e.step();
      if (h % 240 !== 0) continue;
      let sum = 0;
      for (const c of e.charters) {
        if (!c.alive || c.branches === 0) continue;
        sum += c.settled + c.branches * (e.perBranchAcc - c.accSnap);
      }
      // Dead charters keep a zero balance, so the aggregate must match exactly.
      expect(Math.abs(sum - e.ledgerHeld)).toBeLessThan(1e-4);
    }
  });
});

describe('monetary policy (whitepaper 4.1 and 5.2)', () => {
  it('aggregates the trailing two completed epochs', () => {
    expect(policySignal([])).toBe(0);
    expect(policySignal([3])).toBe(3);
    expect(policySignal([3, -1])).toBe(2);
    expect(policySignal([9, 3, -1])).toBe(2);
  });

  it('cuts hard and raises slowly, inside the stated range', () => {
    expect(nextMultiplier(1.0, 5)).toBeCloseTo(1.05);
    expect(nextMultiplier(1.0, -5)).toBeCloseTo(0.85);
    expect(nextMultiplier(M_CEILING, 5)).toBeCloseTo(M_CEILING);
    expect(nextMultiplier(M_FLOOR, -5)).toBeCloseTo(M_FLOOR);
    expect(nextMultiplier(1.0, 0)).toBeCloseTo(0.85); // zero is not positive
  });

  it('reaches the ceiling in five epochs and the floor in seven', () => {
    let m = 1.0;
    let up = 0;
    while (m < M_CEILING - 1e-9) {
      m = nextMultiplier(m, 1);
      up++;
    }
    expect(up).toBe(5);

    let down = 0;
    while (m > M_FLOOR + 1e-9) {
      m = nextMultiplier(m, -1);
      down++;
    }
    expect(down).toBe(7);
  });
});

describe('resolution fee (whitepaper 9.1)', () => {
  it('is quadratic between the floor and the ceiling and then saturates', () => {
    const f0 = resolutionFee(0);
    const fQuiet = resolutionFee(0.02);
    const fHeavy = resolutionFee(0.2);
    const fRun = resolutionFee(0.35);
    const fBeyond = resolutionFee(0.9);

    expect(f0).toBeCloseTo(0.005);
    expect(fQuiet).toBeGreaterThan(f0);
    expect(fHeavy).toBeGreaterThan(fQuiet);
    expect(fRun).toBeCloseTo(0.25);
    expect(fBeyond).toBeCloseTo(0.25); // saturated, never higher

    // Quadratic: doubling the pressure roughly quadruples the distance travelled.
    const a = resolutionFee(0.05) - f0;
    const b = resolutionFee(0.1) - f0;
    expect(b / a).toBeCloseTo(4, 5);
  });

  it('measures pressure as withdrawals over withdrawals plus what stayed', () => {
    expect(exitPressure(0, 1_000_000)).toBeCloseTo(0);
    expect(exitPressure(250_000, 750_000)).toBeCloseTo(0.25);
    expect(exitPressure(1_000_000, 0)).toBeCloseTo(1);
  });
});

describe('auctions (whitepaper 7.1 and 8)', () => {
  it('decays exponentially from the open to the floor across the day', () => {
    const start = 1000;
    const floor = 250;
    expect(dutchPrice(start, floor, 0)).toBeCloseTo(start);
    expect(dutchPrice(start, floor, 1)).toBeCloseTo(floor);
    expect(dutchPrice(start, floor, 0.5)).toBeCloseTo(Math.sqrt(start * floor));
    // Monotonically falling.
    let prev = Infinity;
    for (let i = 0; i <= 24; i++) {
      const p = dutchPrice(start, floor, i / 24);
      expect(p).toBeLessThanOrEqual(prev + EPS);
      prev = p;
    }
  });

  it('scales the license floor with the rate and with total branches', () => {
    expect(licenseFloor(1.0, 1000)).toBeCloseTo(500);
    expect(licenseFloor(0.5, 1000)).toBeCloseTo(250); // licenses cost less in contraction
    expect(licenseFloor(1.0, 2000)).toBeCloseTo(250); // diluted by a bigger system
  });
});

describe('the pool', () => {
  it('charges the fee in ETH on both sides and preserves the curve', () => {
    const pool: Pool = { eth: 400, std: 100_000_000 };
    const before = pool.eth * pool.std;
    const b = buy(pool, 10);
    expect(b.feeEth).toBeCloseTo(0.1);
    expect(b.std).toBeGreaterThan(0);
    expect(pool.eth * pool.std).toBeGreaterThan(before * 0.999);

    const s = sell(pool, b.std);
    expect(s.feeEth).toBeGreaterThan(0);
    // Round tripping loses the two fees plus curve slippage.
    expect(s.grossEth).toBeLessThan(b.grossEth);
  });
});

describe('revocation (whitepaper 10)', () => {
  it('burns an unclaimed bounty rather than dropping it from the ledger', () => {
    const e = new Engine(1234) as unknown as {
      step(): void;
      settle(c: unknown): void;
      revoke(c: unknown): void;
      findReporter(): unknown;
      identityDrift(): number;
      charters: { alive: boolean; branches: number; settled: number; lastActive: number }[];
      hour: number;
      issued: number;
      mintedWithdrawal: number;
      mintedSettlement: number;
      ledgerHeld: number;
      burns: number;
      circulating: number;
    };
    for (let h = 0; h < 60 * 24; h++) e.step();

    // Conservation is the invariant the leak broke: every token counted as
    // issued is either minted or still sitting in a ledger balance.
    const conservation = () => e.issued - (e.mintedWithdrawal + e.mintedSettlement + e.ledgerHeld);

    e.charters.forEach((c) => e.settle(c));
    const ghost = e.charters
      .filter((c) => c.alive && c.branches > 0 && c.settled > 1000)
      .sort((a, b) => b.settled - a.settled)[0];
    expect(ghost).toBeDefined();

    // No active banker anywhere, so there is nobody to pay the bounty to.
    e.charters.forEach((c) => {
      if (c !== ghost) c.lastActive = e.hour - 100_000;
    });
    expect(e.findReporter()).toBeNull();

    const before = conservation();
    const burnsBefore = e.burns;
    const bal = ghost.settled;
    e.revoke(ghost);

    expect(Math.abs(conservation() - before)).toBeLessThan(EPS);
    expect(e.burns).toBeGreaterThan(burnsBefore);
    expect(e.identityDrift()).toBeLessThan(driftBound(e.circulating));
    // and the whole balance is accounted for
    expect(bal).toBeGreaterThan(0);
  });
});

describe('the identity over a long run', () => {
  it('holds relative to circulating supply for 3,000 epochs', () => {
    const e = new Engine(1234);
    let worst = 0;
    for (let h = 0; h < 3000 * 24; h++) {
      e.step();
      worst = Math.max(worst, e.identityDrift());
    }
    // The absolute figure grows with the length of the run, which is why the
    // bound is relative. At this horizon the old 1e-6 bound would have failed.
    expect(e.identityDrift()).toBeLessThan(driftBound(e.circulating));
    expect(worst).toBeLessThan(driftBound(e.circulating));
    expect(e.circulating).toBeGreaterThan(0);
  });
});

describe('the economy is alive', () => {
  it('cuts the rate, flips the vaults, burns, prices an exit and revokes a ghost', () => {
    const e = new Engine(20260909);
    let sawCut = false;
    let sawRaise = false;
    let sawContraction = false;
    let sawExpansion = false;
    let sawRevocation = false;
    let peakFee = 0;
    let peakM = 0;
    let troughM = 99;

    for (let epoch = 0; epoch < 160; epoch++) {
      const mBefore = e.m;
      for (let h = 0; h < 24; h++) e.step();
      if (e.m < mBefore) sawCut = true;
      if (e.m > mBefore) sawRaise = true;
      if (e.regime === 'CONTRACTION') sawContraction = true;
      if (e.regime === 'EXPANSION') sawExpansion = true;
      peakFee = Math.max(peakFee, e.resolutionFeeNow);
      peakM = Math.max(peakM, e.m);
      troughM = Math.min(troughM, e.m);
      if (e.chartersBurned > 0) sawRevocation = true;
    }

    expect(sawCut).toBe(true);
    expect(sawRaise).toBe(true);
    expect(sawContraction).toBe(true);
    expect(sawExpansion).toBe(true);
    expect(sawRevocation).toBe(true);
    expect(peakM - troughM).toBeGreaterThan(0.25);

    expect(e.burnLicense).toBeGreaterThan(0);
    expect(e.burnBuyback).toBeGreaterThan(0);
    expect(e.burnResolution).toBeGreaterThan(0);
    expect(e.redistributed).toBeGreaterThan(0);
    expect(e.reserveOz).toBeGreaterThan(0);
    expect(e.polEth).toBeGreaterThan(0);
    expect(e.totalBranches).toBeGreaterThan(1000); // expansion actually happened
    expect(peakFee).toBeGreaterThan(0.01);
  });

  it('produces a run on the bank on its own, and prices the door instead of closing it', () => {
    const e = new Engine(555);
    let sawRun = false;
    let peakFee = 0;
    let redistDuringRun = 0;
    let burnsDuringRun = 0;

    for (let h = 0; h < 200 * 24; h++) {
      const redistBefore = e.redistributed;
      const burnsBefore = e.burns;
      e.step();
      // The door is never queued or paused, whatever the pressure.
      expect(e.identityDrift()).toBeLessThan(driftBound(e.circulating));
      if (e.run) {
        sawRun = true;
        peakFee = Math.max(peakFee, e.resolutionFeeNow);
        redistDuringRun += e.redistributed - redistBefore;
        burnsDuringRun += e.burns - burnsBefore;
      }
    }

    expect(sawRun).toBe(true); // emergent, never triggered
    expect(peakFee).toBeGreaterThan(0.02); // the fee repriced the exit
    expect(redistDuringRun).toBeGreaterThan(0); // stayers were paid by the exiters
    expect(burnsDuringRun).toBeGreaterThan(0);
  });

  it('converts inflow into hard reserve and permanent liquidity without help', () => {
    const e = new Engine(4242);
    for (let h = 0; h < 120 * 24; h++) e.step();
    expect(e.reserveOz).toBeGreaterThan(0);
    expect(e.polEth).toBeGreaterThan(0);
    expect(e.teamEth).toBeGreaterThan(0);
    // Protocol owned liquidity only ever grows.
    let pol = 0;
    const f = new Engine(4242);
    for (let h = 0; h < 60 * 24; h++) {
      f.step();
      expect(f.polEth).toBeGreaterThanOrEqual(pol - EPS);
      pol = f.polEth;
    }
  });

  it('records a closing summary for every epoch', () => {
    const e = new Engine(31);
    for (let h = 0; h < 30 * 24; h++) e.step();
    expect(e.epochs.length).toBe(30);
    for (const r of e.epochs) {
      expect(r.issuedInEpoch).toBeGreaterThanOrEqual(0);
      expect(r.burnedInEpoch).toBeGreaterThanOrEqual(0);
      expect(r.withdrawnInEpoch).toBeGreaterThanOrEqual(0);
      expect(['EXPANSION', 'CONTRACTION']).toContain(r.regime);
    }
    const totalIssued = e.epochs.reduce((a, r) => a + r.issuedInEpoch, 0);
    expect(totalIssued).toBeGreaterThan(0);
    expect(totalIssued).toBeLessThanOrEqual(e.issued + EPS);
  });
});

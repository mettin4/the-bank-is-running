import { useSyncExternalStore } from 'react';
import { Engine } from './engine';
import type { Snapshot } from './types';

/** One real second is one protocol hour at 1x. */
const PUBLISH_HZ = 14;
const MAX_STEPS_PER_FRAME = 96;

/**
 * Epochs replayed before the first paint, so a visitor lands on a chart with
 * history and a bank that has already lived through something.
 */
export const PRERUN_EPOCHS = 40;

class Runtime {
  private engine = new Engine();
  private listeners = new Set<() => void>();
  private snap: Snapshot;
  private speed = 1;
  private paused = false;
  private raf = 0;
  private last = 0;
  private hourAcc = 0;
  private publishAcc = 0;

  constructor() {
    this.engine.replay(PRERUN_EPOCHS);
    this.snap = this.engine.snapshot(true, 1);
  }

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    if (this.listeners.size === 1) this.play();
    return () => {
      this.listeners.delete(fn);
      if (this.listeners.size === 0) this.stop();
    };
  };

  getSnapshot = () => this.snap;

  setSpeed(speed: number) {
    if (speed === 0) {
      this.paused = true;
    } else {
      this.paused = false;
      this.speed = speed;
    }
    this.publish();
  }

  get currentSpeed() {
    return this.paused ? 0 : this.speed;
  }

  private play() {
    if (this.raf) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  private stop() {
    if (!this.raf) return;
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  /**
   * The economy advances here, off the React render path. Nothing in this loop
   * touches the DOM, and the UI is handed a fresh snapshot at a fixed rate
   * rather than once per tick.
   */
  private frame = (t: number) => {
    const dt = Math.min(250, t - this.last);
    this.last = t;

    if (!this.paused) {
      this.hourAcc += (dt / 1000) * this.speed;
      let steps = Math.floor(this.hourAcc);
      if (steps > MAX_STEPS_PER_FRAME) steps = MAX_STEPS_PER_FRAME;
      this.hourAcc -= steps;
      for (let i = 0; i < steps; i++) this.engine.step();
    }

    this.publishAcc += dt;
    if (this.publishAcc >= 1000 / PUBLISH_HZ) {
      this.publishAcc = 0;
      this.publish();
    }

    this.raf = requestAnimationFrame(this.frame);
  };

  private publish() {
    this.snap = this.engine.snapshot(!this.paused, this.speed);
    for (const fn of this.listeners) fn();
  }
}

export const runtime = new Runtime();

export function useProtocol(): Snapshot {
  return useSyncExternalStore(runtime.subscribe, runtime.getSnapshot, runtime.getSnapshot);
}

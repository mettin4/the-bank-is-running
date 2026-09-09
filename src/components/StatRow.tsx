import { price as fmtPrice } from '../engine/format';
import type { Snapshot } from '../engine/types';
import { Spark } from './charts';
import { Hint } from './Hint';
import { Num } from './Num';
import { useMeasure } from './useMeasure';

export function StatRow({ s }: { s: Snapshot }) {
  const [ref, w] = useMeasure<HTMLDivElement>();

  return (
    <div className="statrow">
      <div className="statrow-cell">
        <div className="kicker">
          CIRCULATING
          <Hint text="Every $STANDARD that exists. Genesis liquidity, plus everything minted when a banker withdrew, minus everything burned." />
        </div>
        <span className="statrow-v">
          <Num value={s.circulating} kind="int" tau={170} />
        </span>
        <div className="sub">OF {s.maxSupply > 0 ? <Num value={s.maxSupply} kind="compact" tau={200} /> : null} MAX</div>
      </div>

      <div className="statrow-cell">
        <div className="kicker">
          BURNED
          <Hint text="Tokens destroyed forever by licenses, buybacks, exit fees and revocations. The hard cap falls with every one of them." />
        </div>
        <span className="statrow-v neg">
          <Num value={s.burns} kind="int" tau={170} />
        </span>
        <div className="sub">RETIRED FROM THE CAP</div>
      </div>

      <div className="statrow-cell">
        <div className="kicker">
          HARD RESERVE
          <Hint text="Tokenized gold, bought by the expansion vault with ETH fees. The bank holds it and the vault can never sell." />
        </div>
        <span className="statrow-v gold">
          <Num value={s.reserveOz} kind="ozs" tau={200} />
        </span>
        <div className="sub">
          <Num value={s.reserveEth} kind="eth" tau={200} /> AT MARKET
        </div>
      </div>

      <div className="statrow-cell">
        <div className="kicker">
          PRICE
          <Hint text="ETH per $STANDARD at the one pool where this economy touches the outside world." />
        </div>
        <span className="statrow-v">{fmtPrice(s.price)}</span>
        <div ref={ref} className="statrow-spark">
          <Spark data={s.priceSeries} width={w} height={26} stroke="var(--gold)" logScale />
        </div>
        <div className="sub statrow-caveat">SYNTHETIC MARKET · NOT A FORECAST</div>
      </div>
    </div>
  );
}

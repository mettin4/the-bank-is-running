import type { EventDict } from '../engine/events';
import { dec, int, pad4, pct, signedEth } from '../engine/format';

/**
 * English is the source of truth. Every other language implements exactly these
 * keys, so a missing or stale translation is a build error rather than a blank
 * label in production.
 *
 * A {v} or {n} in a value is filled by `tf`. Names the Chinese crypto market
 * uses in English stay in English: $STANDARD, ETH, OZ, EPOCH, LP.
 */
export const en = {
  'app.subtitle':
    'THE STANDARD RESERVE, IMPLEMENTED EARLY FROM WHITEPAPER V0.1 · UNOFFICIAL · NOT AFFILIATED',
  'app.langLabel': 'Language',

  // The pair keeps its slash bound to ETH with a non breaking space, so a
  // narrow header wraps it as "$STANDARD" then "/ ETH" and never leaves the
  // slash stranded at the end of a line.
  'head.epoch': 'EPOCH',
  'head.circulating': '$STANDARD CIRCULATING',
  'head.burned': '$STANDARD BURNED',
  'head.price': '$STANDARD /\u00A0ETH',

  'tab.overview': 'OVERVIEW',
  'tab.supply': 'SUPPLY',
  'tab.auctions': 'AUCTIONS',
  'tab.defence': 'DEFENCE',
  'tab.log': 'LOG',
  'tab.sections': 'Sections',
  'tabcap.overview': 'THE SIGNAL AND WHAT THE BANK DID ABOUT IT',
  'tabcap.supply': 'WHAT EXISTS, AND WHAT HAS BEEN DESTROYED',
  'tabcap.auctions': 'HOW BRANCHES AND SEATS ARE PRICED',
  'tabcap.defence': 'WHAT HAPPENS WHEN CAPITAL LEAVES',
  'tabcap.log': 'THE RECORD',

  'rail.clock': 'PROTOCOL CLOCK',
  'rail.epoch': 'EPOCH',
  'rail.time': 'TIME',
  'rail.pause': 'PAUSE',
  'rail.speedLabel': 'Playback speed',
  'rail.tempo': 'ONE SECOND IS ONE PROTOCOL HOUR AT 1x',
  'rail.epochState': 'EPOCH STATE',
  'rail.epochStateHint':
    'Fee routing follows the sign of the epoch in progress. Positive net flow stacks reserves, negative net flow buys the token back and burns it.',
  'rail.feesBuyReserve': 'FEES BUY HARD RESERVE',
  'rail.feesBuyBack': 'FEES BUY BACK AND BURN',
  'rail.policyRate': 'POLICY RATE m',
  'rail.policyRateHint':
    'The issuance multiplier. It falls in one big step the epoch capital turns negative and climbs back in small steps only while inflows persist.',

  'regime.EXPANSION': 'EXPANSION',
  'regime.CONTRACTION': 'CONTRACTION',

  'narrator.title': 'NOW HAPPENING',
  'narrator.hint':
    "A plain reading of the bank's current state. Every figure on this page follows from it.",
  'nar.run':
    'Heavy exits. The fee at the door is climbing, and the bankers leaving are paying the ones who stay.',
  'nar.elevated':
    'Exits are picking up. Leaving costs more with every withdrawal, which quietly pays the bankers who hold.',
  'nar.budgetSpent':
    'The issuance budget is spent. Nothing new is created, and the economy now runs on recycled fees alone.',
  'nar.cut':
    'Outflows detected. Issuance was cut this epoch, and fees now buy $STANDARD back and burn it.',
  'nar.atFloor':
    'Policy is at its floor. Issuance is as tight as it goes and every fee is still buying back and burning.',
  'nar.contraction':
    'More ETH is leaving the pool than entering. The bank is defending its currency with buybacks.',
  'nar.atCeiling':
    'Capital keeps arriving. Issuance is at its ceiling and every fee is turning into gold and permanent liquidity.',
  'nar.raised':
    'Capital is flowing in. The bank earned a rate rise, and fees are buying hard reserve.',
  'nar.cutStands':
    'Inflows have returned, but the rate cut still stands. Raises have to be earned one epoch at a time.',
  'nar.expansion':
    'More ETH is entering the pool than leaving. The bank is stacking gold and adding liquidity nobody can pull.',

  'hero.netFlow': 'NET ETH FLOW',
  'hero.netFlowHint':
    'Every buy puts ETH into the pool and every sell takes it out. The difference across an epoch is the only input the bank has.',
  'hero.policyRate': 'POLICY RATE',
  'hero.policyRateHint':
    'How much $STANDARD the bank issues, as a multiple of its base rate. Cuts land at once, raises are earned one epoch at a time.',
  'hero.inflowEpoch': 'INFLOW EPOCH',
  'hero.outflowEpoch': 'OUTFLOW EPOCH',
  'hero.multiplier': 'MULTIPLIER m',
  'hero.caption':
    'SIXTY EPOCHS. BARS ARE NET ETH FLOW, THE LINE BENEATH IS THE ISSUANCE MULTIPLIER, AND EACH RED TICK IS AN EPOCH THE RATE WAS CUT.',
  'hero.alt': 'Net ETH flow per epoch above, the policy multiplier below',

  'stat.circulating': '$STANDARD CIRCULATING',
  'stat.circulatingHint':
    'Every $STANDARD that exists. Genesis liquidity, plus everything minted when a banker withdrew, minus everything burned.',
  'stat.ofPre': 'OF',
  'stat.ofPost': 'MAX',
  'stat.burned': '$STANDARD BURNED',
  'stat.burnedHint':
    'Tokens destroyed forever by licenses, buybacks, exit fees and revocations. The hard cap falls with every one of them.',
  'stat.retiredFromCap': 'RETIRED FROM THE CAP',
  'stat.hardReserve': 'HARD RESERVE',
  'stat.hardReserveHint':
    'Tokenized gold, bought by the expansion vault with ETH fees. The bank holds it and the vault can never sell.',
  'stat.marketPre': '',
  'stat.marketPost': 'AT MARKET',
  'stat.price': '$STANDARD /\u00A0ETH',
  'stat.priceHint':
    'ETH per $STANDARD at the one pool where this economy touches the outside world.',
  'stat.synthetic': 'SYNTHETIC MARKET · NOT A FORECAST',

  'supply.title': '$STANDARD SUPPLY IDENTITY',
  'supply.note': 'WHITEPAPER 3.1',
  'supply.hint':
    'Tokens only come into existence when a banker withdraws. Everything else is a ledger entry, so circulating supply is a receipt of what has actually been taken out of the bank.',
  'supply.genesis': 'GENESIS LIQUIDITY',
  'supply.mints': 'MINTS',
  'supply.atWithdrawal': 'AT WITHDRAWAL',
  'supply.settledBurned': 'SETTLED AND BURNED',
  'supply.cumulativeBurns': 'CUMULATIVE BURNS',
  'supply.circulating': 'CIRCULATING',
  'supply.maxSupply': 'MAX SUPPLY, 1B MINUS BURNS',
  'supply.issued': 'ISSUED TO LEDGER, OF 900M',
  'supply.heldAtBank': 'HELD AT THE BANK',
  'supply.outsidePool': 'OUTSIDE THE POOL',
  'supply.backing': 'HARD BACKING PER TOKEN',
  'supply.receipt': 'CIRCULATING SUPPLY IS A RECEIPT',
  'supply.identityHolds': 'IDENTITY HOLDS · DRIFT {v}',

  'burn.title': 'BURN LEDGER',
  'burn.note': 'BURNED TOKENS ARE GONE FOREVER',
  'burn.hint':
    "Four ways a token dies: paying for a new branch, a buyback during contraction, half of every exit fee, and half of a dormant banker's balance.",
  'burn.cumulative': 'CUMULATIVE BURNS',
  'burn.ofHardCap': '{v} OF THE HARD CAP',
  'burn.licenses': 'LICENSES',
  'burn.buybacks': 'BUYBACKS',
  'burn.exitFees': 'EXIT FEES',
  'burn.revocation': 'REVOCATION',
  'burn.caption': 'MAX SUPPLY, STRICTLY NON INCREASING',

  'lic.title': 'LICENSE AUCTION',
  'lic.note': 'PAID IN $STANDARD · 100% BURNED',
  'lic.hint':
    'A hundred licenses a day. The price opens high and falls toward a floor across twenty four hours, so whoever steps in first sets the price. Everything paid is destroyed.',
  'lic.todaysAuction': "TODAY'S AUCTION",
  'lic.soldOut': 'SOLD OUT',
  'lic.closedAt': 'CLOSED AT {v}',
  'lic.priceNow': 'PRICE NOW',
  'lic.floor': 'FLOOR {v}',
  'lic.soldToday': 'SOLD TODAY',
  'lic.openedAt': 'OPENED AT {v}',
  'lic.reopens': 'REOPENS NEXT EPOCH · OPENS AT 2x LAST, {v}',
  'lic.caption':
    'THE FLOOR SCALES WITH THE RATE, SO EXPANDING COSTS MORE IN EXPANSION AND LESS IN CONTRACTION.',

  'cha.title': 'CHARTER AUCTION',
  'cha.note': 'PAID IN ETH · ROUTES TO THE FEE ENGINE',
  'cha.hint':
    'A charter is a seat at the bank. New ones are sold for ETH on the same falling price curve, and how many are offered each day is a policy decision that starts at zero.',
  'cha.todaysAuction': "TODAY'S AUCTION",
  'cha.soldOut': 'SOLD OUT',
  'cha.closedAt': 'CLOSED AT {v}',
  'cha.priceNow': 'PRICE NOW',
  'cha.noSaleSub': 'POLICY HAS NOT ENABLED A SALE',
  'cha.noSale': 'NO SALE',
  'cha.seatsToday': 'SEATS TODAY',
  'cha.seatsSub': 'POLICY CONTROLLED, STARTS AT ZERO',
  'cha.noSeats': 'NO SEATS OFFERED THIS EPOCH',
  'cha.reopens': 'REOPENS NEXT EPOCH · OPENS AT 3x LAST, {v}',
  'cha.caption': 'A CHARTER LIVES UNTIL ITS LAST BRANCH IS RETIRED. THERE ARE NO REVOLVING DOORS.',
  'cha.captionClosed':
    'CHARTER SALES ARE POLICY CONTROLLED. SEATS ARE OFFERED DURING SUSTAINED EXPANSION.',

  'exit.title': 'EXIT PRESSURE AND THE RESOLUTION FEE',
  'exit.note': 'WHITEPAPER 9.1',
  'exit.hint':
    'The more of the bank tries to leave in a week, the more leaving costs. Half of the fee is burned and half is paid to the bankers who stayed, so a run transfers value to the patient.',
  'exit.resolutionFee': 'RESOLUTION FEE',
  'exit.feeSub': 'HALF BURNED, HALF TO THE STAYERS',
  'exit.pressure': '7 DAY EXIT PRESSURE',
  'exit.saturatesAt': 'SATURATES AT {v}',
  'exit.withdrawn': 'WITHDRAWN',
  'exit.trailing7d': '· TRAILING 7D',
  'exit.paidToStayers': 'PAID TO STAYERS',
  'exit.cumulative': '· CUMULATIVE',
  'exit.caption': 'WITHDRAWALS ARE NEVER PAUSED OR QUEUED. THE COST OF LEAVING IS THE ONLY CONTROL.',
  'exit.quiet': 'QUIET',
  'exit.elevated': 'ELEVATED',
  'exit.heavy': 'HEAVY',
  'exit.run': 'RUN',
  'exit.curveAlt': 'Resolution fee against seven day exit pressure',

  'fee.title': 'FEE ENGINE, RESERVES, DEFENCE',
  'fee.note': '70 / 15 / 15',
  'fee.hint':
    'Every swap pays a fee in ETH. Seventy per cent goes to whichever vault the epoch calls for, fifteen to liquidity that can never be pulled, fifteen to the team.',
  'fee.hardReserve': 'HARD RESERVE',
  'fee.goldSub': '{v} OF TOKENIZED GOLD',
  'fee.pol': 'PROTOCOL OWNED LIQUIDITY',
  'fee.polSub': 'PAIRED AND ADDED FOREVER',
  'fee.activeVault': 'ACTIVE VAULT THIS EPOCH',
  'fee.legendExpansion': 'EXPANSION · STACKS GOLD',
  'fee.legendContraction': 'CONTRACTION · BUYBACK + BURN',
  'fee.expansionVault': 'EXPANSION VAULT',
  'fee.contractionVault': 'CONTRACTION VAULT',
  'fee.boughtBurned': 'BOUGHT BACK AND BURNED',
  'fee.collected': 'FEES COLLECTED',
  'fee.team': 'TEAM',
  'fee.caption': 'HARD RESERVE, CUMULATIVE',

  'log.title': 'EPOCH LOG',
  'log.note': '{n} CLOSING SUMMARIES',
  'log.hint':
    'One line per closed epoch: what flowed, what policy did about it, what was issued and what was destroyed.',
  'log.epoch': 'EPOCH',
  'log.regime': 'REGIME',
  'log.netFlow': 'NET FLOW',
  'log.m': 'm',
  'log.issued': 'ISSUED',
  'log.burned': 'BURNED',
  'log.withdrawn': 'WITHDRAWN',
  'log.fee': 'FEE',
  'log.lic': 'LIC',
  'log.branches': 'BRANCHES',
  'log.exp': 'EXP',
  'log.con': 'CON',
  'log.empty': 'THE FIRST EPOCH HAS NOT CLOSED YET',
  'log.units': 'NET FLOW IN ETH · ISSUED, BURNED AND WITHDRAWN IN $STANDARD',

  'feed.title': 'PROTOCOL EVENTS',
  'feed.note': 'MOST RECENT FIRST',
  'feed.hint':
    'Everything the bank has done, newest first. The same stream runs along the bottom of the page.',
  'ticker.live': 'LIVE',
  'ticker.held': 'HELD',

  'kind.EPOCH': 'EPOCH',
  'kind.POLICY': 'POLICY',
  'kind.BURN': 'BURN',
  'kind.LICENSE': 'LICENSE',
  'kind.CHARTER': 'CHARTER',
  'kind.EXIT': 'EXIT',
  'kind.DORMANCY': 'DORMANCY',
  'kind.RESERVE': 'RESERVE',
  'kind.SYSTEM': 'SYSTEM',

  'mood.ACCUMULATION': 'ACCUMULATION',
  'mood.EXPANSION': 'EXPANSION',
  'mood.DISTRIBUTION': 'DISTRIBUTION',
  'mood.CAPITULATION': 'CAPITULATION',

  'curve.floor': 'FLOOR',
  'curve.open': '00H',
  'curve.close': '24H',
  'curve.altLive': 'Dutch auction price decay across the day',
  'curve.altClosed': 'Dutch auction, closed for the day',

  'cold.1': 'LOADING WHITEPAPER RULES · V0.1',
  'cold.2': 'SEEDING GENESIS LIQUIDITY · 100,000,000 $STANDARD',
  'cold.3': 'PAIRING ETH AGAINST THE HOOKED V4 POOL',
  'cold.4': 'CHARTERING 1,000 BANKS · ONE BRANCH EACH',
  'cold.5': 'ARMING THE NET FLOW SIGNAL',
  'cold.6': 'REPLAYING {n} EPOCHS',

  'orient.label': 'Orientation',
  'orient.kicker': 'BEFORE YOU WATCH',
  'orient.line1':
    "This is The Standard Reserve's economy, implemented early from whitepaper v0.1 and running autonomously in your browser.",
  'orient.line2': 'One thousand banks. One pool. One signal.',
  'orient.line3': 'Nobody can intervene. Not even you.',
  'orient.button': 'BEGIN OBSERVATION',

  'assumed.title': 'ASSUMED PARAMETERS',
  'assumed.intro':
    'The whitepaper redacts every launch value until launch. The figures below are reasoned placeholders, not protocol truth. Final parameters will be announced by the protocol.',

  'foot.whitepaper': 'THE STANDARD RESERVE WHITEPAPER',
  'foot.experimental': '$STANDARD IS EXPERIMENTAL. NOTHING HERE IS INVESTMENT ADVICE.',
  'foot.unofficial': 'UNOFFICIAL, NOT AFFILIATED WITH THE PROTOCOL.',
  'foot.built': 'BUILT BY @0XMETO_',

  'av.BASE_ISSUANCE': '{v} / DAY',
  'av.MULTIPLIER': '{lo} - {hi}, LAUNCH {launch}',
  'av.RATE_RAISE': '+{v} / POSITIVE EPOCH',
  'av.RATE_CUT': '-{v} / NEGATIVE EPOCH',
  'av.EPOCH_LENGTH': '{v} PROTOCOL HOURS',
  'av.TRADING_FEE': '{v} IN ETH',
  'av.RESOLUTION_FEE': '{lo} FLOOR / {hi} CEILING',
  'av.LICENSE_FLOOR': '{v} DAYS OF ONE BRANCH YIELD',
  'av.CHARTER_FLOOR': '{v} ETH',
  'av.GENESIS_POOL': '{std} / {eth} ETH',
  'av.LICENSE_SETTLEMENT': 'MINT AND BURN IN ONE STEP',
  'av.DORMANT_AGENTS': '{v} OF THE BANK, SPREAD OVER TIME',
  'av.REVOCATION_SPLIT': '{a} BURN / {b} STAYERS / {c} GHOST',
  'av.HARD_RESERVE': '{v} ETH / OZ',

  /* landing */
  'land.launch': 'LAUNCH APP',
  'land.readWhitepaper': 'READ THE WHITEPAPER',
  'land.unofficialTag': 'UNOFFICIAL',
  'land.heroSub': 'AN UNOFFICIAL, WORKING IMPLEMENTATION OF THE STANDARD RESERVE WHITEPAPER',
  'land.heroMeta': 'THE WHITEPAPER IN 6 CARDS · 2 MINUTES',
  'land.scroll': 'SCROLL',
  'land.k1': 'THE AUTHORITY',
  'land.k2': 'THE SIGNAL',
  'land.k3': 'EXPANSION',
  'land.k4': 'CONTRACTION',
  'land.k5': 'THE INVERTED RUN',
  'land.k6': 'THIS SITE',
  // The protocol's own headline, quoted, because the subline credits it to
  // them. Verified against the whitepaper capture, which never calls the bank
  // "the people's central bank".
  'land.h1': 'The sovereign onchain central bank.',
  'land.s1': 'THEIR WORDS, NOT OURS · FULLY AUTONOMOUS',
  'land.b1':
    'STANDARD is a monetary system run entirely by code. No board sets policy and no one can step in to change it. The rules were written once, and the bank follows them.',
  'land.h2': 'One input: net ETH flow.',
  'land.s2': 'MEASURED AT ONE POOL · NOTHING ELSE COUNTS',
  'land.b2':
    'All trading happens in a single ETH/STANDARD pool. Each epoch the bank measures one number there: ETH that came in minus ETH that left. Every decision below follows from that number.',
  'land.h3': 'Money in: rate climbs, fees buy gold.',
  'land.s3': 'RAISES ARE EARNED STEP BY STEP',
  'land.b3':
    'When net flow is positive, the bank slowly raises how much STANDARD it issues to bankers, and routes trading fees into hard reserves: tokenized gold. Good times build the balance sheet.',
  'land.h4': 'Money out: instant cut, fees burn supply.',
  'land.s4': 'CUTS LAND THE SAME EPOCH',
  'land.b4':
    'When net flow turns negative, issuance is cut immediately and fees flip to buying STANDARD back and burning it. The bank reacts to bad news first and asks questions never.',
  'land.h5': 'A bank run pays the ones who stay.',
  'land.s5': 'EXIT FEE RISES WITH THE RUN · HALF BURNED · HALF TO STAYERS',
  'land.b5':
    'Withdrawals are never paused. Instead, the cost of leaving rises with how many are leaving. Half of every exit fee is burned; the other half is paid to bankers who stayed. Panic funds patience.',
  'land.h6': "STANDARD hasn't launched. Here, its rules already run.",
  'land.s6': 'UNOFFICIAL · SYNTHETIC MARKET · EVERY ASSUMPTION LABELED',
  'land.b6':
    "This site implements the whitepaper's rules and runs them against a synthetic market: 1,000 simulated banks and bot traders. Launch parameters aren't public, so assumed values are labeled in the app. Watch how the bank will behave, before it exists.",
  'land.tag.autonomous': 'AUTONOMOUS',
  'land.tag.immutable': 'IMMUTABLE',
  'land.tag.pool': 'ONE POOL',
  'land.tag.in': 'IN',
  'land.tag.out': 'OUT',
  'land.tag.net': 'NET FLOW',
  'land.tag.rate': 'POLICY RATE',
  'land.tag.reserve': 'HARD RESERVE',
  'land.tag.burn': 'BURN',
  'land.tag.quiet': 'QUIET',
  'land.tag.run': 'RUN',
  'land.tag.leavers': 'LEAVERS',
  'land.tag.stayers': 'STAYERS',
  'land.tag.half': '50 / 50',
  'land.tag.netflow': 'NET ETH FLOW',
  'land.tag.multiplier': 'MULTIPLIER m',
  'land.figLabel6': 'LIVE IN THE APP',
  'land.alt1': "The protocol's twin towers, drawn in hairline strokes",
  'land.alt2': 'One pool, ETH in and ETH out, and a single needle for the net',
  'land.alt3': 'A rising rate staircase beside a vault filling with gold',
  'land.alt4': 'A rate staircase falling off a cliff, tokens entering a burn',
  'land.alt5': 'The quadratic exit fee curve, and value moving from leavers to stayers',
  'land.alt6': "A miniature of the terminal's net flow and multiplier chart",

  // The ticker and the asset symbols, never translated.
  'unit.std': '$STANDARD',
  'unit.eth': 'ETH',

  'hint.aria': 'What this means',
} as const;

export type DictKey = keyof typeof en;
export type Dict = Record<DictKey, string>;

export const enEvents: EventDict = {
  genesisSeeded: () => 'GENESIS LIQUIDITY SEEDED · 100,000,000 $STANDARD PAIRED',
  foundingCharters: ({ n }) => `${int(n)} FOUNDING CHARTERS ISSUED · ONE BRANCH EACH`,
  marketRegime: ({ sentiment }) => `MARKET REGIME · ${sentiment}`,
  runStarting: () => 'EXIT VOLUME ACCELERATING · RESOLUTION FEE REPRICING THE DOOR',
  runSubsided: () => 'RUN SUBSIDED · THE DOOR WAS PRICED, NEVER CLOSED',
  buybackTick: ({ amount }) => `BUYBACK TICK · ${int(amount)} $STANDARD BOUGHT AND BURNED`,
  charterSold: ({ id, eth }) => `CHARTER #${pad4(id)} SOLD AT AUCTION · ${dec(eth, 3)} ETH`,
  charterDissolved: ({ id, amount }) =>
    `CHARTER #${pad4(id)} DISSOLVED · LAST BRANCH RETIRED · ${int(amount)} REALIZED`,
  charterRetired: ({ id, branches, amount, feeRate }) =>
    `CHARTER #${pad4(id)} RETIRED ${branches} BRANCH${branches > 1 ? 'ES' : ''} · ${int(amount)} AT ${pct(feeRate, 2)} RESOLUTION FEE`,
  charterRevoked: ({ id, days, branches }) =>
    `CHARTER #${pad4(id)} REVOKED · DORMANT ${days}D · ${branches} BRANCH${branches > 1 ? 'ES' : ''} SHUTTERED`,
  feeRoutingFlipped: ({ regime }) =>
    regime === 'EXPANSION'
      ? 'FEE ROUTING FLIPPED · EXPANSION VAULT · HARD RESERVE ASSETS'
      : 'FEE ROUTING FLIPPED · CONTRACTION VAULT · BUYBACK AND BURN',
  rateCut: ({ from, to, signal }) =>
    `RATE CUT · m ${from.toFixed(2)} TO ${to.toFixed(2)} · SIGNAL ${signedEth(signal, 2)}`,
  rateRaise: ({ from, to, signal }) =>
    `RATE RAISE EARNED · m ${from.toFixed(2)} TO ${to.toFixed(2)} · SIGNAL ${signedEth(signal, 2)}`,
  reserveAdded: ({ oz, eth }) => `HARD RESERVE +${dec(oz, 2)} OZ · ${dec(eth, 2)} ETH CONVERTED`,
  epochClosed: ({ epoch, netFlow }) =>
    `EPOCH ${pad4(epoch)} CLOSED · NET FLOW ${signedEth(netFlow, 2)} · ${netFlow > 0 ? 'EXPANSION' : 'CONTRACTION'}`,
  licenseAuctionClosed: ({ sold, cap, last }) =>
    `LICENSE AUCTION CLOSED · ${sold}/${cap} SOLD · ${int(last)} LAST · ALL BURNED`,
  resolutionFeeHigh: ({ feeRate }) =>
    `RESOLUTION FEE ABOVE 10% · ${pct(feeRate, 2)} AT THE DOOR · HALF BURNED, HALF TO THE STAYERS`,
};

export const enAssumed = {
  BASE_ISSUANCE: {
    label: 'BASE ISSUANCE',
    note: 'Redacted in section 05. Sized so the 900,000,000 issuance budget lasts roughly a decade at full rate.',
  },
  MULTIPLIER: {
    label: 'MULTIPLIER m',
    note: 'Range is stated on the protocol site. The launch value is not.',
  },
  RATE_RAISE: {
    label: 'RATE RAISE',
    note: 'Redacted. Chosen so a sustained inflow needs 5 epochs to reach the ceiling from launch.',
  },
  RATE_CUT: {
    label: 'RATE CUT',
    note: 'Redacted. Three times the raise step, honoring "cuts are immediate, raises must be earned".',
  },
  EPOCH_LENGTH: {
    label: 'EPOCH LENGTH',
    note: 'Redacted. The document speaks in days and in "epochs", so one epoch is read as one day.',
  },
  TRADING_FEE: {
    label: 'TRADING FEE',
    note: 'Redacted. Charged on both sides of every swap, as section 11 requires.',
  },
  RESOLUTION_FEE: {
    label: 'RESOLUTION FEE',
    note: 'Redacted. Quadratic between the two, saturating when 35% of the bank exits inside 7 days.',
  },
  LICENSE_FLOOR: {
    label: 'LICENSE FLOOR',
    note: 'Stated as an aside in section 08 and read literally: floor = base issuance x m / total branches x 2.',
  },
  CHARTER_FLOOR: {
    label: 'CHARTER FLOOR',
    note: 'Section 08 calls this an admin-set reserve price and gives no number.',
  },
  GENESIS_POOL: {
    label: 'GENESIS POOL',
    note: 'The token side is specified. The ETH the team pairs against it is not.',
  },
  LICENSE_SETTLEMENT: {
    label: 'LICENSE SETTLEMENT',
    note: 'Licenses are paid in $STANDARD and burned, but tokens only exist after a withdrawal. The accrued ledger balance is therefore minted and burned in the same transaction, which is why cumulative mints and cumulative burns both move while circulating supply does not.',
  },
  DORMANT_AGENTS: {
    label: 'DORMANT BANKERS',
    note: 'Section 10 says staying active is free and that a zero-cost check-in exists, so an engaged banker never trips. Only lost keys and abandoned wallets do, and how many of those there are is not specified.',
  },
  REVOCATION_SPLIT: {
    label: 'REVOCATION SPLIT',
    note: 'Section 10 gives a 70% fee, a 2% bounty and a 30% return, which sums past 100%. The bounty is read as coming out of the stayers half.',
  },
  HARD_RESERVE: {
    label: 'HARD RESERVE',
    note: 'The expansion vault buys tokenized gold. The rate here is fixed for legibility.',
  },
} as const;

export type AssumedKey = keyof typeof enAssumed;
export type AssumedDict = Record<AssumedKey, { label: string; note: string }>;

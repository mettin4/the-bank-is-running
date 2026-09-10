
> the-bank-is-running@1.0.0 i18n:review
> tsx scripts/i18n-review.ts

# EN / 中文 review

## UI strings (285)

| key | EN | 中文 |
|---|---|---|
| `app.subtitle` | THE STANDARD RESERVE, IMPLEMENTED EARLY FROM WHITEPAPER V0.1 · UNOFFICIAL · NOT AFFILIATED | THE STANDARD RESERVE · 依据白皮书 V0.1 提前实现 · 非官方 · 与官方无关联 |
| `app.langLabel` | Language | 语言 |
| `head.epoch` | EPOCH | EPOCH |
| `head.circulating` | $STANDARD CIRCULATING | $STANDARD 流通量 |
| `head.burned` | $STANDARD BURNED | $STANDARD 已销毁 |
| `head.price` | $STANDARD / ETH | $STANDARD / ETH |
| `tab.overview` | OVERVIEW | 总览 |
| `tab.supply` | SUPPLY | 供应 |
| `tab.auctions` | AUCTIONS | 拍卖 |
| `tab.defence` | DEFENSE | 防御 |
| `tab.log` | LOG | 日志 |
| `tab.sections` | Sections | 分区 |
| `tabcap.overview` | THE SIGNAL AND WHAT THE BANK DID ABOUT IT | 信号，以及银行的应对 |
| `tabcap.supply` | WHAT EXISTS, AND WHAT HAS BEEN DESTROYED | 存量与销毁 |
| `tabcap.auctions` | HOW BRANCHES AND SEATS ARE PRICED | 分行与席位如何定价 |
| `tabcap.defence` | WHAT HAPPENS WHEN CAPITAL LEAVES | 资金离场时会发生什么 |
| `tabcap.log` | THE RECORD | 记录 |
| `rail.clock` | PROTOCOL CLOCK | 协议时钟 |
| `rail.epoch` | EPOCH | EPOCH |
| `rail.time` | TIME | 时间 |
| `rail.pause` | PAUSE | 暂停 |
| `rail.speedLabel` | Playback speed | 播放速度 |
| `rail.tempo` | ONE SECOND IS ONE PROTOCOL HOUR AT 1x | 1x 下 1 秒 = 1 协议小时 |
| `rail.epochState` | EPOCH STATE | EPOCH 状态 |
| `rail.epochStateHint` | Fee routing follows the sign of the epoch in progress. Positive net flow stacks reserves, negative net flow buys the token back and burns it. | 手续费流向取决于当前 EPOCH 净流量的正负。净流量为正时买入硬储备，为负时回购并销毁代币。 |
| `rail.feesBuyReserve` | FEES BUY HARD RESERVE | 手续费买入硬储备 |
| `rail.feesBuyBack` | FEES BUY BACK AND BURN | 手续费回购销毁 |
| `rail.policyRate` | POLICY RATE m | 政策利率 m |
| `rail.policyRateHint` | The issuance multiplier. It falls in one big step the epoch the signal turns negative and climbs back in small steps only while inflows persist. The signal is the trailing two epoch sum of net flow. | 发行乘数。信号转负的当个 EPOCH 一次性大幅下调，只有流入持续时才小步回升。信号是最近两个 EPOCH 净流量之和。 |
| `regime.EXPANSION` | EXPANSION | 扩张 |
| `regime.CONTRACTION` | CONTRACTION | 收缩 |
| `narrator.title` | NOW HAPPENING | 当前状况 |
| `narrator.hint` | A plain reading of the bank's current state. Every figure on this page follows from it. | 对银行当前状态的直白解读。本页每个数字都由此而来。 |
| `nar.run` | Heavy exits. The fee at the door is climbing, and the bankers leaving are paying the ones who stay. | 大量退出。门口的费率正在攀升，离场的人在为留守者买单。 |
| `nar.elevated` | Exits are picking up. Leaving costs more with every withdrawal, which quietly pays the bankers who hold. | 退出增多。每笔提取都在抬高离场成本，这笔钱转给了继续持有的银行家。 |
| `nar.budgetSpent` | The issuance budget is spent. Nothing new is created, and the economy now runs on recycled fees alone. | 发行额度已耗尽。不再有新增发行，经济体只靠回收的手续费运转。 |
| `nar.cut` | Outflows detected. Issuance was cut this epoch, and fees now buy $STANDARD back and burn it. | 监测到资金流出。本 EPOCH 发行量下调，手续费转为回购并销毁 $STANDARD。 |
| `nar.atFloor` | Policy is at its floor. Issuance is as tight as it goes and every fee is still buying back and burning. | 政策利率触及下限。发行已收紧到极限，手续费仍在回购销毁。 |
| `nar.contraction` | More ETH is leaving the pool than entering. The bank is defending its currency with buybacks. | 流出池子的 ETH 多于流入。银行正用回购护盘。 |
| `nar.atCeiling` | Capital keeps arriving. Issuance is at its ceiling and every fee is turning into gold and permanent liquidity. | 资金持续进场。发行量触及上限，手续费全部转为黄金与永久流动性。 |
| `nar.raised` | Capital is flowing in. The bank earned a rate rise, and fees are buying hard reserve. | 资金正在流入。银行挣得一次加息，手续费用于买入硬储备。 |
| `nar.cutStands` | Inflows have returned, but the rate cut still stands. Raises have to be earned one epoch at a time. | 流入已恢复，但此前的降息仍未撤销。加息必须逐个 EPOCH 挣得。 |
| `nar.expansion` | More ETH is entering the pool than leaving. The bank is stacking gold and adding liquidity nobody can pull. | 流入池子的 ETH 多于流出。银行在囤积黄金，并追加无人能撤走的流动性。 |
| `hero.netFlow` | NET ETH FLOW | ETH 净流量 |
| `hero.netFlowHint` | Every buy puts ETH into the pool and every sell takes it out. The difference across an epoch is the only input the bank has. | 每笔买入向池子注入 ETH，每笔卖出抽走 ETH。整个 EPOCH 的差额是银行唯一的输入。 |
| `hero.policyRate` | POLICY RATE | 政策利率 |
| `hero.policyRateHint` | How much $STANDARD the bank issues, as a multiple of its base rate. Cuts land at once, raises are earned one epoch at a time. | 银行的 $STANDARD 发行量，以基准发行量的倍数表示。下调即时生效，上调需逐个 EPOCH 挣得。 |
| `hero.inflowEpoch` | INFLOW EPOCH | 流入 EPOCH |
| `hero.outflowEpoch` | OUTFLOW EPOCH | 流出 EPOCH |
| `hero.multiplier` | MULTIPLIER m | 乘数 m |
| `hero.caption` | THE LAST {n} EPOCHS. BARS ARE NET ETH FLOW, THE LINE BENEATH IS THE ISSUANCE MULTIPLIER, AND EACH RED TICK IS AN EPOCH THE RATE WAS CUT. | 最近 {n} 个 EPOCH。柱为 ETH 净流量，下方折线为发行乘数，每个红色刻度代表该 EPOCH 下调了利率。 |
| `hero.alt` | Net ETH flow per epoch above, the policy multiplier below | 上方为每个 EPOCH 的 ETH 净流量，下方为政策乘数 |
| `stat.circulating` | $STANDARD CIRCULATING | $STANDARD 流通量 |
| `stat.circulatingHint` | Every $STANDARD that exists. Genesis liquidity, plus everything minted when a banker withdrew, minus everything burned. | 现存的全部 $STANDARD。创世流动性，加上银行家提取时铸造的部分，减去全部销毁。 |
| `stat.ofPre` | OF | 硬顶 |
| `stat.ofPost` | MAX |  |
| `stat.burned` | $STANDARD BURNED | $STANDARD 已销毁 |
| `stat.burnedHint` | Tokens destroyed forever by licenses, buybacks, exit fees and revocations. The hard cap falls with every one of them. | 被许可、回购、退出费与吊销永久销毁的代币。每一次销毁都会拉低硬顶。 |
| `stat.retiredFromCap` | RETIRED FROM THE CAP | 已从硬顶注销 |
| `stat.hardReserve` | HARD RESERVE | 硬储备 |
| `stat.hardReserveHint` | Tokenized gold, bought by the expansion vault with ETH fees. The bank holds it and the vault can never sell. | 扩张金库用 ETH 手续费买入的代币化黄金。由银行持有，金库永不卖出。 |
| `stat.marketPre` |  | 按市价 |
| `stat.marketPost` | AT MARKET |  |
| `stat.price` | $STANDARD / ETH | $STANDARD / ETH |
| `stat.priceHint` | ETH per $STANDARD at the one pool where this economy touches the outside world. | 在这个经济体与外界唯一接触的池子里，每枚 $STANDARD 的 ETH 价格。 |
| `stat.synthetic` | SYNTHETIC MARKET · NOT A FORECAST | 合成市场 · 非价格预测 |
| `supply.title` | $STANDARD SUPPLY IDENTITY | $STANDARD 供应恒等式 |
| `supply.note` | WHITEPAPER 3.1 | 白皮书 3.1 |
| `supply.hint` | Tokens only come into existence when a banker withdraws. Everything else is a ledger entry, so circulating supply is a receipt of what has actually been taken out of the bank. | 代币只有在银行家提取时才会诞生。其余全部是账本记录，因此流通量是一张收据，记录已被真正取走的部分。 |
| `supply.genesis` | GENESIS LIQUIDITY | 创世流动性 |
| `supply.mints` | MINTS | 铸造 |
| `supply.atWithdrawal` | AT WITHDRAWAL | 提取时铸造 |
| `supply.settledBurned` | SETTLED AND BURNED | 结算即销毁 |
| `supply.cumulativeBurns` | CUMULATIVE BURNS | 累计销毁 |
| `supply.circulating` | CIRCULATING | 流通量 |
| `supply.maxSupply` | MAX SUPPLY, 1B MINUS BURNS | 最大供应 · 10 亿减销毁 |
| `supply.issued` | ISSUED TO LEDGER, OF 900M | 已发行至账本 · 共 9 亿 |
| `supply.heldAtBank` | HELD AT THE BANK | 存于银行 |
| `supply.outsidePool` | OUTSIDE THE POOL | 池外持有 |
| `supply.backing` | HARD BACKING PER TOKEN | 每枚硬支撑 |
| `supply.receipt` | CIRCULATING SUPPLY IS A RECEIPT | 流通量是一张收据 |
| `supply.identityHolds` | IDENTITY HOLDS · DRIFT {v} | 恒等式成立 · 偏差 {v} |
| `supply.identityBroken` | IDENTITY BROKEN · DRIFT {v} | 恒等式不成立 · 偏差 {v} |
| `burn.title` | BURN LEDGER | 销毁账本 |
| `burn.note` | BURNED TOKENS ARE GONE FOREVER | 销毁的代币永不回归 |
| `burn.hint` | Four ways a token dies: paying for a new branch, a buyback during contraction, half of every exit fee, and half of a dormant banker's balance. | 代币消失的四条路径：购买新分行、收缩期回购、每笔退出费的一半，以及休眠银行家余额的一半。 |
| `burn.cumulative` | CUMULATIVE BURNS | 累计销毁 |
| `burn.ofHardCap` | {v} OF THE HARD CAP | 占硬顶 {v} |
| `burn.licenses` | LICENSES | 许可 |
| `burn.buybacks` | BUYBACKS | 回购 |
| `burn.exitFees` | EXIT FEES | 退出费 |
| `burn.revocation` | REVOCATION | 吊销 |
| `burn.caption` | MAX SUPPLY, STRICTLY NON INCREASING | 最大供应严格不增 |
| `lic.title` | LICENSE AUCTION | 许可拍卖 |
| `lic.note` | PAID IN $STANDARD · 100% BURNED | 以 $STANDARD 支付 · 100% 销毁 |
| `lic.hint` | A hundred licenses a day. The price opens high and falls toward a floor across twenty four hours, so whoever steps in first sets the price. Everything paid is destroyed. | 每天一百份扩张许可。价格高开，在二十四小时内向底价滑落，先出手的人定价。所有支付全部销毁。 |
| `lic.todaysAuction` | TODAY'S AUCTION | 今日拍卖 |
| `lic.soldOut` | SOLD OUT | 已售罄 |
| `lic.closedAt` | CLOSED AT {v} | 收于 {v} |
| `lic.priceNow` | PRICE NOW | 当前价 |
| `lic.floor` | FLOOR {v} | 底价 {v} |
| `lic.soldToday` | SOLD TODAY | 今日成交 |
| `lic.openedAt` | OPENED AT {v} | 开于 {v} |
| `lic.reopens` | REOPENS NEXT EPOCH · OPENS AT 2x LAST, {v} | 下个 EPOCH 重开 · 以末笔成交价 2 倍开盘，{v} |
| `lic.caption` | THE FLOOR SCALES WITH THE RATE, SO EXPANDING COSTS MORE IN EXPANSION AND LESS IN CONTRACTION. | 底价随利率变动，因此扩张在扩张期更贵，在收缩期更便宜。 |
| `cha.title` | CHARTER AUCTION | 牌照拍卖 |
| `cha.note` | PAID IN ETH · ROUTES TO THE FEE ENGINE | 以 ETH 支付 · 进入手续费引擎 |
| `cha.hint` | A charter is a seat at the bank. New ones are sold for ETH on the same falling price curve, and how many are offered each day is a policy decision that starts at zero. | 一张牌照就是银行里的一个席位。新牌照按同一条下行曲线以 ETH 出售，每日投放数量由政策决定，初始为零。 |
| `cha.todaysAuction` | TODAY'S AUCTION | 今日拍卖 |
| `cha.soldOut` | SOLD OUT | 已售罄 |
| `cha.closedAt` | CLOSED AT {v} | 收于 {v} |
| `cha.priceNow` | PRICE NOW | 当前价 |
| `cha.noSaleSub` | POLICY HAS NOT ENABLED A SALE | 政策尚未开放发售 |
| `cha.noSale` | NO SALE | 无发售 |
| `cha.seatsToday` | SEATS TODAY | 今日席位 |
| `cha.seatsSub` | POLICY CONTROLLED, STARTS AT ZERO | 由政策控制 · 初始为零 |
| `cha.noSeats` | NO SEATS OFFERED THIS EPOCH | 本 EPOCH 不投放席位 |
| `cha.reopens` | REOPENS NEXT EPOCH · OPENS AT 3x LAST, {v} | 下个 EPOCH 重开 · 以末笔成交价 3 倍开盘，{v} |
| `cha.caption` | A CHARTER LIVES UNTIL ITS LAST BRANCH IS RETIRED. THERE ARE NO REVOLVING DOORS. | 牌照存续到最后一个分行退役为止。没有旋转门。 |
| `cha.captionClosed` | CHARTER SALES ARE POLICY CONTROLLED. SEATS ARE OFFERED DURING SUSTAINED EXPANSION. | 牌照发售由政策控制，仅在持续扩张期投放席位。 |
| `exit.title` | EXIT PRESSURE AND THE RESOLUTION FEE | 退出压力与退出费 |
| `exit.note` | WHITEPAPER 9.1 | 白皮书 9.1 |
| `exit.hint` | The more of the bank tries to leave in a week, the more leaving costs. Half of the fee is burned and half is paid to the bankers who stayed, so a run transfers value to the patient. | 一周内想离场的比例越高，离场就越贵。费用一半销毁，一半付给留守的银行家，因此挤兑把价值从急躁者转移给有耐心的一方。 |
| `exit.resolutionFee` | RESOLUTION FEE | 退出费 |
| `exit.feeSub` | HALF BURNED, HALF TO THE STAYERS | 一半销毁 · 一半付给留守者 |
| `exit.pressure` | 7 DAY EXIT PRESSURE | 7 日退出压力 |
| `exit.saturatesAt` | SATURATES AT {v} · ASSUMED | {v} 时饱和 · 假设值 |
| `exit.withdrawn` | WITHDRAWN | 已提取 |
| `exit.trailing7d` | · TRAILING 7D | · 近 7 日 |
| `exit.paidToStayers` | PAID TO STAYERS | 支付给留守者 |
| `exit.cumulative` | · CUMULATIVE | · 累计 |
| `exit.caption` | WITHDRAWALS ARE NEVER PAUSED OR QUEUED. THE COST OF LEAVING IS THE ONLY CONTROL. WHERE THE MARKS SIT ON THE CURVE IS THIS SITE’S CHOICE. | 提取从不暂停，也不排队。离场成本是唯一的调控手段。刻度落在曲线上的位置由本站选定。 |
| `exit.quiet` | QUIET | 平静 |
| `exit.elevated` | ELEVATED | 升高 |
| `exit.saturation` | SATURATION | 饱和 |
| `exit.run` | RUN | 挤兑 |
| `exit.curveAlt` | Resolution fee against seven day exit pressure | 退出费与 7 日退出压力的关系 |
| `fee.title` | FEE ENGINE, RESERVES, DEFENSE | 手续费引擎 · 储备 · 防御 |
| `fee.note` | 70 / 15 / 15 | 70 / 15 / 15 |
| `fee.hint` | Every swap pays a fee in ETH. Seventy per cent goes to whichever vault the epoch calls for, fifteen to liquidity that can never be pulled, fifteen to the team. | 每笔兑换支付 ETH 手续费。七成进入当期对应的金库，一成五进入永不可撤的流动性，一成五归团队。 |
| `fee.hardReserve` | HARD RESERVE | 硬储备 |
| `fee.goldSub` | {v} OF TOKENIZED GOLD | 代币化黄金 {v} |
| `fee.pol` | PROTOCOL OWNED LIQUIDITY | 协议自有流动性 |
| `fee.polSub` | PAIRED AND ADDED FOREVER | 配对后永久注入 |
| `fee.activeVault` | ACTIVE VAULT THIS EPOCH | 本 EPOCH 生效金库 |
| `fee.legendExpansion` | EXPANSION · STACKS GOLD | 扩张 · 囤积黄金 |
| `fee.legendContraction` | CONTRACTION · BUYBACK + BURN | 收缩 · 回购销毁 |
| `fee.expansionVault` | EXPANSION VAULT | 扩张金库 |
| `fee.contractionVault` | CONTRACTION VAULT | 收缩金库 |
| `fee.boughtBurned` | BOUGHT BACK AND BURNED | 已回购销毁 |
| `fee.collected` | FEES COLLECTED | 手续费累计 |
| `fee.team` | TEAM | 团队 |
| `fee.caption` | HARD RESERVE, CUMULATIVE | 硬储备 · 累计 |
| `log.title` | EPOCH LOG | EPOCH 日志 |
| `log.note` | {n} CLOSING SUMMARIES | {n} 条收盘摘要 |
| `log.hint` | One row per closed epoch: how capital moved, how policy answered, what was issued and what was burned. m CLOSE is the multiplier set at that close, which governs the next epoch, so the ISSUED beside it was streamed at the previous one. | 每个已收盘 EPOCH 一行：资金流向、政策应对、发行多少、销毁多少。收盘 m 是该次收盘定下的乘数，它管的是下一个 EPOCH，因此同一行的发行量是按上一次收盘的乘数流出的。 |
| `log.epoch` | EPOCH | EPOCH |
| `log.regime` | REGIME | 状态 |
| `log.netFlow` | NET FLOW | 净流量 |
| `log.m` | m CLOSE | 收盘 m |
| `log.issued` | ISSUED | 发行 |
| `log.burned` | BURNED | 销毁 |
| `log.withdrawn` | WITHDRAWN | 提取 |
| `log.fee` | FEE | 费率 |
| `log.lic` | LIC | 许可 |
| `log.branches` | BRANCHES | 分行 |
| `log.exp` | EXP | 扩张 |
| `log.con` | CON | 收缩 |
| `log.empty` | THE FIRST EPOCH HAS NOT CLOSED YET | 第一个 EPOCH 尚未收盘 |
| `log.units` | NET FLOW IN ETH · ISSUED, BURNED AND WITHDRAWN IN $STANDARD | 净流量以 ETH 计 · 发行、销毁与提取以 $STANDARD 计 |
| `feed.title` | PROTOCOL EVENTS | 协议事件 |
| `feed.note` | MOST RECENT FIRST | 最新在前 |
| `feed.hint` | Everything the bank has done, newest first. The same stream runs along the bottom of the page. | 银行做过的一切，最新在前。同一条流也在页面底部滚动。 |
| `ticker.live` | LIVE | 实时 |
| `ticker.held` | HELD | 暂停 |
| `kind.EPOCH` | EPOCH | EPOCH |
| `kind.POLICY` | POLICY | 政策 |
| `kind.BURN` | BURN | 销毁 |
| `kind.LICENSE` | LICENSE | 许可 |
| `kind.CHARTER` | CHARTER | 牌照 |
| `kind.EXIT` | EXIT | 退出 |
| `kind.DORMANCY` | DORMANCY | 休眠 |
| `kind.RESERVE` | RESERVE | 储备 |
| `kind.SYSTEM` | SYSTEM | 系统 |
| `mood.ACCUMULATION` | ACCUMULATION | 吸筹 |
| `mood.EXPANSION` | MARKUP | 拉升 |
| `mood.DISTRIBUTION` | DISTRIBUTION | 派发 |
| `mood.CAPITULATION` | CAPITULATION | 投降 |
| `curve.floor` | FLOOR | 底价 |
| `curve.open` | 00H | 00H |
| `curve.close` | 24H | 24H |
| `curve.altLive` | Dutch auction price decay across the day | 荷兰式拍卖当日价格衰减 |
| `curve.altClosed` | Dutch auction, closed for the day | 荷兰式拍卖 · 当日已结束 |
| `cold.1` | LOADING WHITEPAPER RULES · V0.1 | 加载白皮书规则 · V0.1 |
| `cold.2` | SEEDING GENESIS LIQUIDITY · 100,000,000 $STANDARD | 注入创世流动性 · 100,000,000 $STANDARD |
| `cold.3` | PAIRING ETH AGAINST THE HOOKED V4 POOL | 向带 Hook 的 V4 池配对 ETH |
| `cold.4` | CHARTERING 1,000 BANKS · ONE BRANCH EACH | 发放 1,000 张银行牌照 · 各含一个分行 |
| `cold.5` | ARMING THE NET FLOW SIGNAL | 启动净流量信号 |
| `cold.6` | REPLAYING {n} EPOCHS | 回放 {n} 个 EPOCH |
| `orient.label` | Orientation | 导览 |
| `orient.kicker` | BEFORE YOU WATCH | 开始观察前 |
| `orient.line1` | This is The Standard Reserve's economy, implemented early from whitepaper v0.1 and running autonomously in your browser. | 这是 The Standard Reserve 的经济体，依据白皮书 v0.1 提前实现，在你的浏览器里自主运行。 |
| `orient.line2` | One thousand banks. One pool. One signal. | 一千家银行。一个池子。一个信号。 |
| `orient.line3` | Nobody can intervene. Not even you. | 没有人能干预。你也不能。 |
| `orient.button` | BEGIN OBSERVATION | 开始观察 |
| `assumed.title` | ASSUMED PARAMETERS | 假设参数 |
| `assumed.intro` | The whitepaper redacts every launch value until launch. The figures below are reasoned placeholders, not protocol truth. Final parameters will be announced by the protocol. | 白皮书在上线前隐去了所有启动参数。以下数值是经过推理的占位值，并非协议事实。最终参数将由协议公布。 |
| `foot.whitepaper` | THE STANDARD RESERVE WHITEPAPER | THE STANDARD RESERVE 白皮书 |
| `foot.experimental` | $STANDARD IS EXPERIMENTAL. NOTHING HERE IS INVESTMENT ADVICE. | $STANDARD 属实验性质。此处内容不构成投资建议。 |
| `foot.unofficial` | UNOFFICIAL, NOT AFFILIATED WITH THE PROTOCOL. | 非官方 · 与官方无关联 |
| `foot.built` | BUILT BY @0XMETO_ | BUILT BY @0XMETO_ |
| `av.BASE_ISSUANCE` | {v} / DAY | {v} / 天 |
| `av.MULTIPLIER` | {lo} - {hi}, LAUNCH {launch} | {lo} - {hi}，启动值 {launch} |
| `av.RATE_RAISE` | +{v} / POSITIVE EPOCH | +{v} / 正向 EPOCH |
| `av.RATE_CUT` | -{v} / NEGATIVE EPOCH | -{v} / 负向 EPOCH |
| `av.EPOCH_LENGTH` | {v} PROTOCOL HOURS | {v} 协议小时 |
| `av.REGIME_BAND` | {v} OF POOL ETH, ROUTING ONLY | 池子 ETH 的 {v} · 仅影响流向 |
| `av.CHARTER_SUPPLY` | {hi} SEATS AT m {mhi}, {lo} AT m {mlo} | m 达 {mhi} 时 {hi} 席 · 达 {mlo} 时 {lo} 席 |
| `av.PROTOCOL_SWAPS` | NO FEE, OUTSIDE NET FLOW | 不收手续费 · 不计入净流量 |
| `av.MARKET_MODEL` | {n} PROFILES, {v}x BOOK PREMIUM | {n} 类行为 · 账面溢价 {v} 倍 |
| `av.TRADING_FEE` | {v} IN ETH | {v} · 以 ETH 收取 |
| `av.RESOLUTION_FEE` | {lo} FLOOR / {hi} CEILING / {sat} SATURATION | 下限 {lo} / 上限 {hi} / 饱和 {sat} |
| `av.LICENSE_FLOOR` | {v} DAYS OF ONE BRANCH YIELD | 单个分行 {v} 天收益 |
| `av.CHARTER_FLOOR` | {v} ETH | {v} ETH |
| `av.GENESIS_POOL` | {std} / {eth} ETH | {std} / {eth} ETH |
| `av.LICENSE_SETTLEMENT` | MINT AND BURN IN ONE STEP | 同笔交易内铸造并销毁 |
| `av.DORMANT_AGENTS` | {v} OF THE BANK, SPREAD OVER TIME | 占银行 {v}，分散于时间 |
| `av.REVOCATION_SPLIT` | {a} BURN / {b} STAYERS / {c} GHOST | {a} 销毁 / {b} 留守者 / {c} 失联者 |
| `av.HARD_RESERVE` | {v} ETH / OZ | {v} ETH / OZ |
| `land.launch` | LAUNCH APP | 启动应用 |
| `land.readWhitepaper` | READ THE WHITEPAPER | 阅读白皮书 |
| `land.unofficialTag` | UNOFFICIAL | 非官方 |
| `land.heroSub` | AN UNOFFICIAL, WORKING IMPLEMENTATION OF THE STANDARD RESERVE WHITEPAPER | 依据 THE STANDARD RESERVE 白皮书的非官方实现 · 已在运行 |
| `land.heroMeta` | THE WHITEPAPER IN 6 CARDS · 2 MINUTES | 六张卡片读完白皮书 · 两分钟 |
| `land.scroll` | SCROLL | 向下滚动 |
| `land.k1` | THE AUTHORITY | 权威 |
| `land.k2` | THE SIGNAL | 信号 |
| `land.k3` | EXPANSION | 扩张 |
| `land.k4` | CONTRACTION | 收缩 |
| `land.k5` | THE INVERTED RUN | 反向挤兑 |
| `land.k6` | THIS SITE | 关于本站 |
| `land.h1` | The sovereign onchain central bank. | 主权链上中央银行。 |
| `land.s1` | THEIR WORDS, NOT OURS · FULLY AUTONOMOUS | 他们的原话 · 完全自主运行 |
| `land.b1` | STANDARD is a monetary system run entirely by code. It answers to no board, committee, or government. The rules were written once, 4,000 lines of immutable code, and the bank follows them. A few launch parameters stay in human hands; everything monetary does not. | STANDARD 是一套完全由代码运行的货币系统。它不向任何董事会、委员会或政府负责。规则只写一次，共 4,000 行不可更改的代码，银行照此执行。少数上线参数仍在人手中，货币规则不由人改。 |
| `land.h2` | One input: net ETH flow. | 唯一输入：ETH 净流量。 |
| `land.s2` | MEASURED AT ONE POOL · NOTHING ELSE COUNTS | 只在一个池子计量 · 其他一概不算 |
| `land.b2` | All trading happens in a single ETH/STANDARD pool. Each epoch the bank measures one number there: ETH that came in minus ETH that left. Every decision below follows from that number. | 所有交易都发生在唯一的 ETH/STANDARD 池子里。每个 EPOCH，银行只在这里计量一个数字：流入的 ETH 减去流出的 ETH。下面的每一个决策都由这个数字决定。 |
| `land.h3` | Money in: rate climbs, fees buy gold. | 资金流入：利率上调，手续费购入黄金。 |
| `land.s3` | RAISES ARE EARNED STEP BY STEP | 加息需要逐步挣得 |
| `land.b3` | When net flow is positive, the bank slowly raises how much STANDARD it issues to bankers, and routes trading fees into hard reserves: tokenized gold. Good times build the balance sheet. | 净流量为正时，银行缓慢上调发给银行家的 STANDARD 数量，并把交易手续费转入硬储备：代币化黄金。好日子用来充实资产负债表。 |
| `land.h4` | Money out: instant cut, fees burn supply. | 资金流出：立即降息，手续费销毁供应。 |
| `land.s4` | CUTS LAND THE SAME EPOCH | 降息当期生效 |
| `land.b4` | When net flow turns negative, issuance is cut immediately and fees flip to buying STANDARD back and burning it. The bank reacts to bad news first and asks questions never. | 净流量转负时，发行立即削减，手续费转为回购并销毁 STANDARD。银行对坏消息第一时间反应，且从不犹豫。 |
| `land.h5` | A bank run pays the ones who stay. | 挤兑发生时，钱付给留下的人。 |
| `land.s5` | EXIT FEE RISES WITH THE RUN · HALF BURNED · HALF TO STAYERS | 退出费随挤兑上升 · 一半销毁 · 一半分给留守者 |
| `land.b5` | Withdrawals are never paused. Instead, the cost of leaving rises with how many are leaving. Half of every exit fee is burned; the other half is paid to bankers who stayed. Panic funds patience. | 提取永不暂停。但离场成本会随离场人数上升。每笔退出费一半销毁，另一半付给留下的银行家。恐慌为耐心买单。 |
| `land.h6` | STANDARD hasn't launched. Here, its rules already run. | STANDARD 尚未上线。它的规则已在这里运行。 |
| `land.s6` | UNOFFICIAL · SYNTHETIC MARKET · EVERY ASSUMPTION LABELED | 非官方 · 合成市场 · 所有假设均已标注 |
| `land.b6` | This site implements the whitepaper's rules and runs them against a synthetic market: 1,000 synthetic banks and bot traders. Launch parameters aren't public, so assumed values are labeled in the app. Watch how the bank will behave, before it exists. | 本站实现了白皮书的规则，并让它在合成市场中运行：1,000 家程序化银行与交易机器人。上线参数尚未公布，所有假设值都在应用内标注。在银行诞生之前，先看它会如何行事。 |
| `land.tag.autonomous` | AUTONOMOUS | 自主运行 |
| `land.tag.immutable` | IMMUTABLE | 不可更改 |
| `land.tag.pool` | ONE POOL | 单一池子 |
| `land.tag.in` | IN | 流入 |
| `land.tag.out` | OUT | 流出 |
| `land.tag.net` | NET FLOW | 净流量 |
| `land.tag.rate` | POLICY RATE | 政策利率 |
| `land.tag.reserve` | HARD RESERVE | 硬储备 |
| `land.tag.burn` | BURN | 销毁 |
| `land.tag.quiet` | QUIET | 平静 |
| `land.tag.run` | RUN | 挤兑 |
| `land.tag.leavers` | LEAVERS | 离场者 |
| `land.tag.stayers` | STAYERS | 留守者 |
| `land.tag.half` | 50 / 50 | 50 / 50 |
| `land.tag.netflow` | NET ETH FLOW | ETH 净流量 |
| `land.tag.multiplier` | MULTIPLIER m | 乘数 m |
| `land.figLabel6` | LIVE IN THE APP | 应用内实时 |
| `land.alt1` | The protocol's twin towers, drawn in hairline strokes | 以细线勾勒的协议双塔 |
| `land.alt2` | One pool, ETH in and ETH out, and a single needle for the net | 单一池子的 ETH 流入流出，以及一根指示净额的指针 |
| `land.alt3` | A rising rate staircase beside a vault filling with gold | 上行的利率阶梯，旁边是逐渐装满黄金的金库 |
| `land.alt4` | A rate staircase falling off a cliff, tokens entering a burn | 利率阶梯坠落，代币进入销毁 |
| `land.alt5` | The quadratic exit fee curve, and value moving from leavers to stayers | 二次型退出费曲线，以及价值从离场者转向留守者 |
| `land.alt6` | A miniature of the terminal's net flow and multiplier chart | 终端净流量与乘数图表的缩略版 |
| `unit.std` | $STANDARD | $STANDARD |
| `unit.eth` | ETH | ETH |
| `hint.aria` | What this means | 这是什么意思 |

## Event templates (17)

| event | EN | 中文 |
|---|---|---|
| `genesisSeeded` | GENESIS LIQUIDITY SEEDED · 100,000,000 $STANDARD PAIRED | 创世流动性注入 · 100,000,000 $STANDARD 已配对 |
| `foundingCharters` | 1,000 FOUNDING CHARTERS ISSUED · ONE BRANCH EACH | 1,000 张创始牌照发放 · 各含一个分行 |
| `marketRegime` | MARKET MOOD · CAPITULATION | 市场情绪 · 投降 |
| `runStarting` | EXIT VOLUME ACCELERATING · RESOLUTION FEE REPRICING THE DOOR | 退出量加速 · 退出费正在重新为离场定价 |
| `runSubsided` | RUN SUBSIDED · THE DOOR WAS PRICED, NEVER CLOSED | 挤兑平息 · 门被定价，从未关闭 |
| `buybackTick` | BUYBACK TICK · 7,520 $STANDARD BOUGHT AND BURNED | 回购 · 7,520 $STANDARD 已买入并销毁 |
| `charterSold` | CHARTER #1042 SOLD AT AUCTION · 0.184 ETH | 牌照 #1042 拍卖成交 · 0.184 ETH |
| `charterDissolved` | CHARTER #0376 DISSOLVED · LAST BRANCH RETIRED · 41,230 REALIZED | 牌照 #0376 注销 · 最后一个分行退役 · 提取 41,230 |
| `charterRetired` | CHARTER #0817 RETIRED 2 BRANCHES · 12,480 AT 6.73% RESOLUTION FEE | 牌照 #0817 退役 2 个分行 · 提取 12,480 · 退出费 6.73% |
| `charterRevoked` | CHARTER #0858 REVOKED · DORMANT 30D · 10 BRANCHES SHUTTERED | 牌照 #0858 被吊销 · 休眠 30 天 · 10 个分行关闭 |
| `feeRoutingFlipped` | FEE ROUTING FLIPPED · CONTRACTION VAULT · BUYBACK AND BURN | 手续费流向切换 · 收缩金库 · 回购并销毁 |
| `rateCut` | RATE CUT · m 0.35 TO 0.20 · SIGNAL -3.34 ETH | 降息 · m 0.35 至 0.20 · 信号 -3.34 ETH |
| `rateRaise` | RATE RAISE EARNED · m 0.30 TO 0.35 · SIGNAL +12.70 ETH | 加息达成 · m 0.30 至 0.35 · 信号 +12.70 ETH |
| `reserveAdded` | HARD RESERVE +4.12 OZ · 3.58 ETH CONVERTED | 硬储备 +4.12 OZ · 耗用 3.58 ETH |
| `epochClosed` | EPOCH 0041 CLOSED · NET FLOW -1.35 ETH · CONTRACTION | EPOCH 0041 收盘 · 净流量 -1.35 ETH · 收缩 |
| `licenseAuctionClosed` | LICENSE AUCTION CLOSED · 95/100 SOLD · 48 LAST · ALL BURNED | 许可拍卖结束 · 成交 95/100 · 末笔 48 · 全部销毁 |
| `resolutionFeeHigh` | RESOLUTION FEE ABOVE 10% · 12.46% AT THE DOOR · HALF BURNED, HALF TO THE STAYERS | 退出费突破 10% · 门口 12.46% · 一半销毁，一半付给留守者 |

## Assumed parameters (18)

| id | EN label | 中文 label | EN note | 中文 note |
|---|---|---|---|---|
| `BASE_ISSUANCE` | BASE ISSUANCE | 基准发行量 | Redacted in section 05. Sized so the 900,000,000 issuance budget lasts roughly a decade at full rate. | 白皮书第 05 节隐去。取值使 9 亿发行额度在满速下大约维持十年。 |
| `MULTIPLIER` | MULTIPLIER m | 乘数 m | Range is stated on the protocol site. The launch value is not. | 区间在协议官网有说明，启动值没有。 |
| `RATE_RAISE` | RATE RAISE | 加息步长 | Redacted. Chosen so a sustained inflow needs 5 epochs to reach the ceiling from launch. | 隐去。取值使持续流入需要 5 个 EPOCH 从启动值升至上限。 |
| `RATE_CUT` | RATE CUT | 降息步长 | Redacted. Three times the raise step, honoring "cuts are immediate, raises must be earned". | 隐去。为加息步长的三倍，以贯彻“降息即时，加息需挣”。 |
| `EPOCH_LENGTH` | EPOCH LENGTH | EPOCH 长度 | Redacted. The document speaks in days and in "epochs", so one epoch is read as one day. | 隐去。文档中“天”与“EPOCH”并用，因此一个 EPOCH 按一天处理。 |
| `REGIME_BAND` | REGIME HYSTERESIS BAND | 状态滞回带 | Not in the whitepaper. Fee routing ignores a net flow under this share of pool ETH, so a quiet epoch does not flip the vault repeatedly. It touches intra epoch routing only: a closed epoch is recorded by the sign of its own net flow, per section 5. | 白皮书未作规定。净流量低于池子 ETH 的这一比例时，手续费流向不变，以免平静的 EPOCH 反复切换金库。它只影响 EPOCH 内的流向：已收盘的 EPOCH 按其自身净流量的正负记录，依第 5 节。 |
| `CHARTER_SUPPLY` | CHARTER SEATS PER DAY | 每日牌照席位 | Section 08 says the count starts at zero and is policy controlled, and gives no rule. Here seats open only after two consecutive positive epochs, eight a day once the rate is at or above 1.00 and four at or above 0.75. That schedule is this site’s invention. | 第 08 节只说数量从零开始、由政策控制，未给规则。此处仅在连续两个 EPOCH 净流量为正后开放：利率达到 1.00 及以上每天八席，达到 0.75 及以上四席。这套安排是本站的设定。 |
| `PROTOCOL_SWAPS` | THE BANK’S OWN SWAPS | 银行自身的兑换 | The buyback and the liquidity pairing trade against the same pool. Whether the hook counts them is unspecified, and counting them would let a buyback push net flow positive and damp its own trigger, so here they pay no fee and stay outside the signal. | 回购与流动性配对都在同一个池子里成交。Hook 是否计入它们并无规定，而计入会让回购把净流量推向为正、自行削弱触发条件，因此此处它们不收手续费，也不计入信号。 |
| `MARKET_MODEL` | THE SYNTHETIC MARKET | 合成市场 | Nothing about the traders is in the whitepaper. Bankers are split across five behaviours, compounding, taking yield, flipping, holding and drifting, and the book prices $STANDARD at a premium to its hard backing. Both are this site’s model, not protocol. | 白皮书对交易者没有任何规定。此处银行家分为五类行为：复投、取息、快进快出、持有与随波逐流，账面价格相对硬支撑存在溢价。两者都是本站的模型，不是协议内容。 |
| `TRADING_FEE` | TRADING FEE | 交易手续费 | Redacted. Charged on both sides of every swap, as section 11 requires. | 隐去。按第 11 节要求，每笔兑换双向收取。 |
| `RESOLUTION_FEE` | RESOLUTION FEE | 退出费 | Redacted. Quadratic between the two, saturating when 35% of the bank exits inside 7 days. | 隐去。在上下限之间按二次曲线变化，一周内 35% 的银行离场时饱和。 |
| `LICENSE_FLOOR` | LICENSE FLOOR | 许可底价 | Stated as an aside in section 08 and read literally: floor = base issuance x m / total branches x 2. | 第 08 节顺带提到，此处按字面处理：底价 = 基准发行量 x m / 总分行数 x 2。 |
| `CHARTER_FLOOR` | CHARTER FLOOR | 牌照底价 | Section 08 calls this an admin-set reserve price and gives no number. | 第 08 节称其为管理员设定的保留价，未给出数值。 |
| `GENESIS_POOL` | GENESIS POOL | 创世池 | The token side is specified. The ETH the team pairs against it is not. | 代币一侧有明确规定，团队配对的 ETH 一侧没有。 |
| `LICENSE_SETTLEMENT` | LICENSE SETTLEMENT | 许可结算 | Licenses are paid in $STANDARD and burned, but tokens only exist after a withdrawal. The accrued ledger balance is therefore minted and burned in the same transaction, which is why cumulative mints and cumulative burns both move while circulating supply does not. | 许可费以 $STANDARD 支付并销毁，但代币只有在提取后才存在。因此累积的账本余额在同一笔交易内铸造并销毁，这就是累计铸造与累计销毁同步上升而流通量不变的原因。 |
| `DORMANT_AGENTS` | DORMANT BANKERS | 休眠银行家 | Section 10 says staying active is free and that a zero-cost check-in exists, so an engaged banker never trips. Only lost keys and abandoned wallets do, and how many of those there are is not specified. | 第 10 节称保持活跃是免费的，并存在零成本签到，因此在场的银行家永不触发。只有丢失私钥和被弃用的钱包会，而这类占比未作规定。 |
| `REVOCATION_SPLIT` | REVOCATION SPLIT | 吊销分配 | Section 10 gives a 70% fee, a 2% bounty and a 30% return, which sums past 100%. The bounty is read as coming out of the stayers half. If no active banker is found to claim it, the bounty burns; section 10 is silent on that case. | 第 10 节给出 70% 费用、2% 赏金与 30% 返还，合计超过 100%。此处将赏金理解为从留守者的一半中支出。若找不到活跃的银行家来领取，赏金销毁；第 10 节对此未作规定。 |
| `HARD_RESERVE` | HARD RESERVE | 硬储备 | The expansion vault buys tokenized gold. The rate here is fixed for legibility. | 扩张金库买入代币化黄金。此处汇率固定以便阅读。 |

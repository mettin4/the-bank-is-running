import type { EventDict } from '../engine/events';
import type { Sentiment } from '../engine/types';
import { dec, int, pad4, pct, signedEth } from '../engine/format';
import type { AssumedDict, Dict } from './en';

/**
 * Simplified Chinese, written for a trading terminal rather than translated
 * word for word. Terms the Chinese crypto market uses in English stay in
 * English: $STANDARD, ETH, OZ, EPOCH, LP.
 */
const mood: Record<Sentiment, string> = {
  ACCUMULATION: '吸筹',
  EXPANSION: '扩张',
  DISTRIBUTION: '派发',
  CAPITULATION: '投降',
};

export const zh: Dict = {
  'app.subtitle': 'THE STANDARD RESERVE · 依据白皮书 V0.1 提前实现 · 非官方 · 与官方无关联',
  'app.langLabel': '语言',

  'head.epoch': 'EPOCH',
  'head.circulating': '流通量',
  'head.burned': '已销毁',
  'head.price': '价格',

  'tab.overview': '总览',
  'tab.supply': '供应',
  'tab.auctions': '拍卖',
  'tab.defence': '防御',
  'tab.log': '日志',
  'tab.sections': '分区',
  'tabcap.overview': '信号,以及银行的应对',
  'tabcap.supply': '存量与销毁',
  'tabcap.auctions': '分行与席位如何定价',
  'tabcap.defence': '资金离场时会发生什么',
  'tabcap.log': '记录',

  'rail.clock': '协议时钟',
  'rail.epoch': 'EPOCH',
  'rail.time': '时间',
  'rail.pause': '暂停',
  'rail.speedLabel': '播放速度',
  'rail.tempo': '1x 下 1 秒 = 1 协议小时',
  'rail.epochState': 'EPOCH 状态',
  'rail.epochStateHint':
    '手续费流向取决于当前 EPOCH 净流量的正负。为正则累积储备,为负则回购并销毁代币。',
  'rail.feesBuyReserve': '手续费买入硬储备',
  'rail.feesBuyBack': '手续费回购销毁',
  'rail.policyRate': '政策利率 m',
  'rail.policyRateHint':
    '发行乘数。资金转为净流出的当个 EPOCH 一次性大幅下调,只有流入持续时才小步回升。',

  'regime.EXPANSION': '扩张',
  'regime.CONTRACTION': '收缩',

  'narrator.title': '当前状况',
  'narrator.hint': '对银行当前状态的直白解读。本页每个数字都由此而来。',
  'nar.run': '大量退出。门口的费率正在攀升,离场的人在为留守者买单。',
  'nar.elevated': '退出增多。每笔提取都在抬高离场成本,这笔钱转给了继续持有的银行家。',
  'nar.budgetSpent': '发行额度已耗尽。不再有新增发行,经济体只靠回收的手续费运转。',
  'nar.cut': '监测到资金流出。本 EPOCH 发行量下调,手续费转为回购并销毁 $STANDARD。',
  'nar.atFloor': '政策利率触及下限。发行已收紧到极限,手续费仍在回购销毁。',
  'nar.contraction': '流出池子的 ETH 多于流入。银行正用回购护盘。',
  'nar.atCeiling': '资金持续进场。发行量触及上限,手续费全部转为黄金与永久流动性。',
  'nar.raised': '资金正在流入。银行争取到一次加息,手续费用于买入硬储备。',
  'nar.cutStands': '流入已恢复,但此前的降息仍未撤销。加息必须逐个 EPOCH 挣回。',
  'nar.expansion': '流入池子的 ETH 多于流出。银行在囤积黄金,并追加无人能撤走的流动性。',

  'hero.netFlow': 'ETH 净流量',
  'hero.netFlowHint':
    '每笔买入向池子注入 ETH,每笔卖出抽走 ETH。整个 EPOCH 的差额是银行唯一的输入。',
  'hero.policyRate': '政策利率',
  'hero.policyRateHint':
    '银行的 $STANDARD 发行量,以基准发行量的倍数表示。下调即时生效,上调需逐个 EPOCH 挣得。',
  'hero.inflowEpoch': '流入 EPOCH',
  'hero.outflowEpoch': '流出 EPOCH',
  'hero.multiplier': '乘数 m',
  'hero.caption':
    '六十个 EPOCH。柱为 ETH 净流量,下方折线为发行乘数,每个红色刻度代表该 EPOCH 下调了利率。',
  'hero.alt': '上方为每个 EPOCH 的 ETH 净流量,下方为政策乘数',

  'stat.circulating': '流通量',
  'stat.circulatingHint':
    '现存的全部 $STANDARD。创世流动性,加上银行家提取时铸造的部分,减去全部销毁。',
  'stat.ofPre': '上限',
  'stat.ofPost': '',
  'stat.burned': '已销毁',
  'stat.burnedHint': '被扩张许可、回购、退出费与吊销永久销毁的代币。每一次销毁都会拉低硬顶。',
  'stat.retiredFromCap': '已从硬顶注销',
  'stat.hardReserve': '硬储备',
  'stat.hardReserveHint': '扩张金库用 ETH 手续费买入的代币化黄金。由银行持有,金库永不卖出。',
  'stat.marketPre': '按市价',
  'stat.marketPost': '',
  'stat.price': '价格',
  'stat.priceHint': '在这个经济体与外界唯一接触的池子里,每枚 $STANDARD 的 ETH 价格。',
  'stat.synthetic': '合成市场 · 非价格预测',

  'supply.title': '供应恒等式',
  'supply.note': '白皮书 3.1',
  'supply.hint':
    '代币只有在银行家提取时才会诞生。其余全部是账本记录,因此流通量是一张收据,记录已被真正取走的部分。',
  'supply.genesis': '创世流动性',
  'supply.mints': '铸造',
  'supply.atWithdrawal': '提取铸造',
  'supply.settledBurned': '结算即销毁',
  'supply.cumulativeBurns': '累计销毁',
  'supply.circulating': '流通量',
  'supply.maxSupply': '最大供应 · 10 亿减销毁',
  'supply.issued': '已发行至账本 · 共 9 亿',
  'supply.heldAtBank': '存于银行',
  'supply.outsidePool': '池外持有',
  'supply.backing': '每枚硬支撑',
  'supply.receipt': '流通量是一张收据',
  'supply.identityHolds': '恒等式成立 · 偏差 {v}',

  'burn.title': '销毁账本',
  'burn.note': '销毁的代币永不回归',
  'burn.hint':
    '代币消失的四条路径:购买新分行、收缩期回购、每笔退出费的一半,以及休眠银行家余额的一半。',
  'burn.cumulative': '累计销毁',
  'burn.ofHardCap': '占硬顶 {v}',
  'burn.licenses': '扩张许可',
  'burn.buybacks': '回购',
  'burn.exitFees': '退出费',
  'burn.revocation': '吊销',
  'burn.caption': '最大供应严格不增',

  'lic.title': '许可拍卖',
  'lic.note': '以 $STANDARD 支付 · 100% 销毁',
  'lic.hint':
    '每天一百份扩张许可。价格高开,在二十四小时内向底价滑落,先出手的人定价。所有支付全部销毁。',
  'lic.todaysAuction': '今日拍卖',
  'lic.soldOut': '已售罄',
  'lic.closedAt': '收于 {v}',
  'lic.priceNow': '当前价',
  'lic.floor': '底价 {v}',
  'lic.soldToday': '今日成交',
  'lic.openedAt': '开于 {v}',
  'lic.reopens': '下个 EPOCH 重开 · 以末笔成交价 2 倍开盘,{v}',
  'lic.caption': '底价随利率变动,因此扩张在扩张期更贵,在收缩期更便宜。',

  'cha.title': '牌照拍卖',
  'cha.note': '以 ETH 支付 · 进入手续费引擎',
  'cha.hint':
    '一张牌照就是银行里的一个席位。新牌照按同一条下行曲线以 ETH 出售,每日投放数量由政策决定,初始为零。',
  'cha.todaysAuction': '今日拍卖',
  'cha.soldOut': '已售罄',
  'cha.closedAt': '收于 {v}',
  'cha.priceNow': '当前价',
  'cha.noSaleSub': '政策尚未开放发售',
  'cha.noSale': '无发售',
  'cha.seatsToday': '今日席位',
  'cha.seatsSub': '由政策控制 · 初始为零',
  'cha.noSeats': '本 EPOCH 不投放席位',
  'cha.reopens': '下个 EPOCH 重开 · 以末笔成交价 3 倍开盘,{v}',
  'cha.caption': '牌照存续到最后一个分行退役为止。没有旋转门。',
  'cha.captionClosed': '牌照发售由政策控制,仅在持续扩张期投放席位。',

  'exit.title': '退出压力与清算费',
  'exit.note': '白皮书 9.1',
  'exit.hint':
    '一周内想离场的比例越高,离场就越贵。费用一半销毁,一半付给留守的银行家,因此挤兑把价值从急躁者转移给有耐心的一方。',
  'exit.resolutionFee': '清算费',
  'exit.feeSub': '一半销毁 · 一半付给留守者',
  'exit.pressure': '7 日退出压力',
  'exit.saturatesAt': '{v} 时饱和',
  'exit.withdrawn': '已提取',
  'exit.trailing7d': '· 近 7 日',
  'exit.paidToStayers': '支付给留守者',
  'exit.cumulative': '· 累计',
  'exit.caption': '提取从不暂停,也不排队。离场成本是唯一的调控手段。',
  'exit.quiet': '平静',
  'exit.elevated': '升高',
  'exit.heavy': '沉重',
  'exit.run': '挤兑',
  'exit.curveAlt': '清算费与 7 日退出压力的关系',

  'fee.title': '手续费引擎 · 储备 · 防御',
  'fee.note': '70 / 15 / 15',
  'fee.hint':
    '每笔兑换支付 ETH 手续费。七成进入当期对应的金库,一成五进入永不可撤的流动性,一成五归团队。',
  'fee.hardReserve': '硬储备',
  'fee.goldSub': '代币化黄金 {v}',
  'fee.pol': '协议自有流动性',
  'fee.polSub': '配对后永久注入',
  'fee.activeVault': '本 EPOCH 生效金库',
  'fee.legendExpansion': '扩张 · 囤积黄金',
  'fee.legendContraction': '收缩 · 回购销毁',
  'fee.expansionVault': '扩张金库',
  'fee.contractionVault': '收缩金库',
  'fee.boughtBurned': '已回购销毁',
  'fee.collected': '手续费累计',
  'fee.team': '团队',
  'fee.caption': '硬储备 · 累计',

  'log.title': 'EPOCH 日志',
  'log.note': '{n} 条收盘摘要',
  'log.hint': '每个已收盘 EPOCH 一行:资金怎么流、政策如何应对、发行多少、销毁多少。',
  'log.epoch': 'EPOCH',
  'log.regime': '状态',
  'log.netFlow': '净流量',
  'log.m': 'm',
  'log.issued': '发行',
  'log.burned': '销毁',
  'log.withdrawn': '提取',
  'log.fee': '费率',
  'log.lic': '许可',
  'log.branches': '分行',
  'log.exp': '扩张',
  'log.con': '收缩',
  'log.empty': '第一个 EPOCH 尚未收盘',

  'feed.title': '协议事件',
  'feed.note': '最新在前',
  'feed.hint': '银行做过的一切,最新在前。同一条流也在页面底部滚动。',
  'ticker.live': '实时',
  'ticker.held': '暂停',

  'kind.EPOCH': 'EPOCH',
  'kind.POLICY': '政策',
  'kind.BURN': '销毁',
  'kind.LICENSE': '许可',
  'kind.CHARTER': '牌照',
  'kind.EXIT': '退出',
  'kind.DORMANCY': '休眠',
  'kind.RESERVE': '储备',
  'kind.SYSTEM': '系统',

  'mood.ACCUMULATION': '吸筹',
  'mood.EXPANSION': '扩张',
  'mood.DISTRIBUTION': '派发',
  'mood.CAPITULATION': '投降',

  'curve.floor': '底价',
  'curve.open': '00H',
  'curve.close': '24H',
  'curve.altLive': '荷兰式拍卖当日价格衰减',
  'curve.altClosed': '荷兰式拍卖 · 当日已结束',

  'cold.1': '加载白皮书规则 · V0.1',
  'cold.2': '注入创世流动性 · 100,000,000 $STANDARD',
  'cold.3': '与挂钩的 V4 池配对 ETH',
  'cold.4': '发放 1,000 张银行牌照 · 各含一个分行',
  'cold.5': '启动净流量信号',
  'cold.6': '回放 {n} 个 EPOCH',

  'orient.label': '导览',
  'orient.kicker': '开始观察前',
  'orient.line1':
    '这是 The Standard Reserve 的经济体,依据白皮书 v0.1 提前实现,在你的浏览器里自主运行。',
  'orient.line2': '一千家银行。一个池子。一个信号。',
  'orient.line3': '没有人能干预。你也不能。',
  'orient.button': '开始观察',

  'assumed.title': '假设参数',
  'assumed.intro':
    '白皮书在上线前隐去了所有启动参数。以下数值是经过推理的占位值,并非协议事实。最终参数将由协议公布。',

  'foot.whitepaper': 'THE STANDARD RESERVE 白皮书',
  'foot.experimental': '$STANDARD 属实验性质。此处内容不构成投资建议。',
  'foot.unofficial': '非官方 · 与官方无关联',
  'foot.built': 'BUILT BY @0XMETO_',

  'av.BASE_ISSUANCE': '{v} / 天',
  'av.MULTIPLIER': '{lo} - {hi},启动值 {launch}',
  'av.RATE_RAISE': '+{v} / 正向 EPOCH',
  'av.RATE_CUT': '-{v} / 负向 EPOCH',
  'av.EPOCH_LENGTH': '{v} 协议小时',
  'av.TRADING_FEE': '{v} · 以 ETH 收取',
  'av.RESOLUTION_FEE': '下限 {lo} / 上限 {hi}',
  'av.LICENSE_FLOOR': '单个分行 {v} 天收益',
  'av.CHARTER_FLOOR': '{v} ETH',
  'av.GENESIS_POOL': '{std} / {eth} ETH',
  'av.LICENSE_SETTLEMENT': '同笔交易内铸造并销毁',
  'av.DORMANT_AGENTS': '占银行 {v},分散于时间',
  'av.REVOCATION_SPLIT': '{a} 销毁 / {b} 留守者 / {c} 失联者',
  'av.HARD_RESERVE': '{v} ETH / OZ',

  /* landing */
  'land.launch': '启动应用',
  'land.readWhitepaper': '阅读白皮书',
  'land.unofficialTag': '非官方',
  'land.heroSub': '依据 THE STANDARD RESERVE 白皮书的非官方实现 · 已在运行',
  'land.heroMeta': '六张卡片读完白皮书 · 两分钟',
  'land.scroll': '向下滚动',
  'land.k1': '权威',
  'land.k2': '信号',
  'land.k3': '扩张',
  'land.k4': '收缩',
  'land.k5': '反向挤兑',
  'land.k6': '关于本站',
  'land.h1': '主权链上中央银行。',
  'land.s1': '他们的原话 · 完全自主运行',
  'land.b1':
    'STANDARD 是一套完全由代码运行的货币系统。没有董事会制定政策，也没有人能介入修改。规则只写一次，银行永远照章执行。',
  'land.h2': '唯一输入：ETH净流量。',
  'land.s2': '只在一个池子计量 · 其他一概不算',
  'land.b2':
    '所有交易都发生在唯一的 ETH/STANDARD 池子里。每个 EPOCH，银行只在这里计量一个数字：流入的 ETH 减去流出的 ETH。下面的每一个决策都由这个数字决定。',
  'land.h3': '资金流入：利率上调，手续费购入黄金。',
  'land.s3': '加息需要逐步挣得',
  'land.b3':
    '净流量为正时，银行缓慢上调发给银行家的 STANDARD 数量，并把交易手续费转入硬储备：代币化黄金。好日子用来充实资产负债表。',
  'land.h4': '资金流出：立即降息，手续费销毁供应。',
  'land.s4': '降息当期生效',
  'land.b4':
    '净流量转负时，发行立即削减，手续费转为回购并销毁 STANDARD。银行对坏消息第一时间反应，且从不犹豫。',
  'land.h5': '挤兑发生时，钱付给留下的人。',
  'land.s5': '退出费随挤兑上升 · 一半销毁 · 一半分给留守者',
  'land.b5':
    '提取永不暂停。但离场成本会随离场人数上升。每笔退出费一半销毁，另一半付给留下的银行家。恐慌为耐心买单。',
  'land.h6': 'STANDARD 尚未上线。它的规则已在这里运行。',
  'land.s6': '非官方 · 合成市场 · 所有假设均已标注',
  'land.b6':
    '本站实现了白皮书的规则，并让它在合成市场中运行：1000家模拟银行与交易机器人。上线参数尚未公布，所有假设值都在应用内标注。在银行诞生之前，先看它会如何行事。',
  'land.tag.autonomous': '自主运行',
  'land.tag.immutable': '不可更改',
  'land.tag.pool': '单一池子',
  'land.tag.in': '流入',
  'land.tag.out': '流出',
  'land.tag.net': '净流量',
  'land.tag.rate': '政策利率',
  'land.tag.reserve': '硬储备',
  'land.tag.burn': '销毁',
  'land.tag.quiet': '平静',
  'land.tag.run': '挤兑',
  'land.tag.leavers': '离场者',
  'land.tag.stayers': '留守者',
  'land.tag.half': '50 / 50',
  'land.tag.netflow': 'ETH 净流量',
  'land.tag.multiplier': '乘数 m',
  'land.figLabel6': '应用内实时',
  'land.alt1': '以细线勾勒的协议双塔',
  'land.alt2': '单一池子的 ETH 流入流出,以及一根指示净额的指针',
  'land.alt3': '上行的利率阶梯,旁边是逐渐装满黄金的金库',
  'land.alt4': '利率阶梯坠落,代币进入销毁',
  'land.alt5': '二次型退出费曲线,以及价值从离场者转向留守者',
  'land.alt6': '终端净流量与乘数图表的缩略版',

  'hint.aria': '这是什么意思',
};

export const zhEvents: EventDict = {
  genesisSeeded: () => '创世流动性注入 · 100,000,000 $STANDARD 已配对',
  foundingCharters: ({ n }) => `${int(n)} 张创始牌照发放 · 各含一个分行`,
  marketRegime: ({ sentiment }) => `市场阶段 · ${mood[sentiment]}`,
  runStarting: () => '退出量加速 · 清算费正在重新定价离场',
  runSubsided: () => '挤兑平息 · 门被定价,从未关闭',
  buybackTick: ({ amount }) => `回购 · ${int(amount)} $STANDARD 已买入并销毁`,
  charterSold: ({ id, eth }) => `牌照 #${pad4(id)} 拍卖成交 · ${dec(eth, 3)} ETH`,
  charterDissolved: ({ id, amount }) =>
    `牌照 #${pad4(id)} 解散 · 最后一个分行退役 · 兑现 ${int(amount)}`,
  charterRetired: ({ id, branches, amount, feeRate }) =>
    `牌照 #${pad4(id)} 退役 ${branches} 个分行 · ${int(amount)} · 清算费 ${pct(feeRate, 2)}`,
  charterRevoked: ({ id, days, branches }) =>
    `牌照 #${pad4(id)} 被吊销 · 休眠 ${days} 天 · ${branches} 个分行关闭`,
  feeRoutingFlipped: ({ regime }) =>
    regime === 'EXPANSION'
      ? '手续费流向切换 · 扩张金库 · 买入硬储备'
      : '手续费流向切换 · 收缩金库 · 回购并销毁',
  rateCut: ({ from, to, signal }) =>
    `降息 · m ${from.toFixed(2)} 至 ${to.toFixed(2)} · 信号 ${signedEth(signal, 2)}`,
  rateRaise: ({ from, to, signal }) =>
    `加息达成 · m ${from.toFixed(2)} 至 ${to.toFixed(2)} · 信号 ${signedEth(signal, 2)}`,
  reserveAdded: ({ oz, eth }) => `硬储备 +${dec(oz, 2)} OZ · 折合 ${dec(eth, 2)} ETH`,
  epochClosed: ({ epoch, netFlow }) =>
    `EPOCH ${pad4(epoch)} 收盘 · 净流量 ${signedEth(netFlow, 2)} · ${netFlow > 0 ? '扩张' : '收缩'}`,
  licenseAuctionClosed: ({ sold, cap, last }) =>
    `许可拍卖结束 · 成交 ${sold}/${cap} · 末笔 ${int(last)} · 全部销毁`,
  resolutionFeeHigh: ({ feeRate }) =>
    `清算费突破 10% · 门口 ${pct(feeRate, 2)} · 一半销毁,一半付给留守者`,
};

export const zhAssumed: AssumedDict = {
  BASE_ISSUANCE: {
    label: '基准发行量',
    note: '白皮书第 05 节隐去。取值使 9 亿发行额度在满速下大约维持十年。',
  },
  MULTIPLIER: {
    label: '乘数 m',
    note: '区间在协议官网有说明,启动值没有。',
  },
  RATE_RAISE: {
    label: '加息步长',
    note: '隐去。取值使持续流入需要 5 个 EPOCH 从启动值升至上限。',
  },
  RATE_CUT: {
    label: '降息步长',
    note: '隐去。为加息步长的三倍,以贯彻“降息即时,加息需挣”。',
  },
  EPOCH_LENGTH: {
    label: 'EPOCH 长度',
    note: '隐去。文档中“天”与“EPOCH”并用,因此一个 EPOCH 按一天处理。',
  },
  TRADING_FEE: {
    label: '交易手续费',
    note: '隐去。按第 11 节要求,每笔兑换双向收取。',
  },
  RESOLUTION_FEE: {
    label: '清算费',
    note: '隐去。在上下限之间按二次曲线变化,一周内 35% 的银行离场时饱和。',
  },
  LICENSE_FLOOR: {
    label: '许可底价',
    note: '第 08 节顺带提到,此处按字面处理:底价 = 基准发行量 x m / 总分行数 x 2。',
  },
  CHARTER_FLOOR: {
    label: '牌照底价',
    note: '第 08 节称其为管理员设定的保留价,未给出数值。',
  },
  GENESIS_POOL: {
    label: '创世池',
    note: '代币一侧有明确规定,团队配对的 ETH 一侧没有。',
  },
  LICENSE_SETTLEMENT: {
    label: '许可结算',
    note: '许可以 $STANDARD 支付并销毁,但代币只有在提取后才存在。因此累积的账本余额在同一笔交易内铸造并销毁,这就是累计铸造与累计销毁同步上升而流通量不变的原因。',
  },
  DORMANT_AGENTS: {
    label: '休眠银行家',
    note: '第 10 节称保持活跃是免费的,并存在零成本签到,因此在场的银行家永不触发。只有丢失私钥和被弃用的钱包会,而这类占比未作规定。',
  },
  REVOCATION_SPLIT: {
    label: '吊销分配',
    note: '第 10 节给出 70% 费用、2% 赏金与 30% 返还,合计超过 100%。此处将赏金理解为从留守者那一半中支出。',
  },
  HARD_RESERVE: {
    label: '硬储备',
    note: '扩张金库买入代币化黄金。此处汇率固定以便阅读。',
  },
};

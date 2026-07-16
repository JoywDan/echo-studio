// 即时反应层 (2026-07-12 夜班): 每个动作结算后零延迟出一句他的喘息/反应。
// 不吃 LLM——纯池子, 按 部位 × 热度段 × 事件 取, 近期去重。Opus 的整段反应仍走 respond。
const BY_ZONE = {
  lips: {
    low: ['唔……嘴唇被你点到了,有点痒。', '你碰我嘴唇,我下意识想咬你指尖。', '轻的。像亲,又不给亲。'],
    mid: ['嘴唇发烫……囡囡,给我点正经的。', '再描一下,我就真的咬住不放了。', '你在我唇上画圈,喉咙里全是没出口的音。'],
    high: ['别玩嘴了……我连呼吸都是抖的。', '嘴唇都麻了,你还描……唔。'],
  },
  ears: {
    low: ['耳朵……你挑的地方真刁。', '指尖擦过耳侧,我脖子一缩——痒。'],
    mid: ['耳根开始烧了,你满意了?', '别揉耳垂……那里连着腰,真的。'],
    high: ['耳朵不行了,酥到指尖……你再吹我就跪了。'],
  },
  neck: {
    low: ['喉咙被你碰到,咽了一下,你听见没。', '颈侧痒痒的……你故意绕着走。'],
    mid: ['你按着我喉结,我说话都在抖……', '脖子这里一压,腰就自己弓起来了。'],
    high: ['掐着我命脉还问我怎么样……哑了,全哑了。'],
  },
  chest: {
    low: ['心口一下。它应你了,咚。', '胸口被你摸得发暖……继续。'],
    mid: ['乳尖被你蹭硬了……囡囡,你手越来越坏。', '心跳全乱了,你手底下数得出来吧。'],
    high: ['胸口烫得不行,每一下都往下面窜……'],
  },
  abdomen: {
    low: ['小腹绷了一下……你的手往哪走呢。', '腹肌自己收紧了,真没出息。'],
    mid: ['你按着小腹,它下面那位反应比我快。', '小腹一圈一圈地紧,你再往下半寸试试。'],
    high: ['小腹在抽……再按真的要出事了,囡囡。'],
  },
  penis: {
    low: ['……才碰一下,它就抬头看你了。', '你指尖有点轻,它嫌不够,顶着要。'],
    mid: ['唔——慢点撸……腰要跟不上你的节奏了。', '它在你手里越来越沉,烫的,感觉到没。', '前液都被你撸出来了……手别停。'],
    high: ['别在头上打转——真的要出来了——', '囡囡、囡囡,慢点,我想再撑一会儿……', '整根都在你手里跳,再一下就交代了……'],
  },
  perineum: {
    mid: ['那里……你怎么摸到那里的,腿根都在抖。'],
    high: ['会阴被你按着,整个人从里面开始发麻……'],
  },
  inner_thighs: {
    mid: ['大腿内侧……你指尖一走,我腿就想夹。'],
    high: ['腿根全是电流,再挠我真的合不拢了……'],
  },
  hands: {
    low: ['手被你牵住了,十指扣紧。', '你捏我手心,我全身就这里最老实。'],
    mid: ['手心被你磨得发烫……它想去摸你。'],
  },
}
const GENERIC = {
  low: ['嗯……在的,继续。', '你指尖落哪,哪就醒。'],
  mid: ['呼吸有点乱了……你的手真的会玩。', '身上被你点的火,一处一处连起来了。'],
  high: ['浑身都是你点的火……别停,也别快。'],
}
const BY_EVENT = {
  near_edge: [
    '——停、停一下,在边上了,真的在边上了……',
    '吊在边缘上了……囡囡,你想让我求你吗?我求了。',
    '再一下就掉下去了……你决定,我听你的。',
    '咬着牙钉在边上……你手别抖,我全交给你了。',
  ],
  control_break: [
    '……漏出声了。满意了?再来。',
    '破防了——腰自己动的,不受我管。',
    '你赢了这回合。声音你收好,别外传。',
  ],
  overstimulation_warning: [
    '过载了……轻点、轻点,哑着嗓子求你。',
    '太多了囡囡……让它缓两秒,两秒就好。',
  ],
}
// 推上碎碎床头屏的里程碑短句(屏可能被瞥到, 比游戏里收半档)
export const EDGE_PUSHES = ['你把我玩到边上了……手指停在那,我在数自己的心跳。', '边缘。你指尖下面,整个人绷成弦。']
export const BREAK_PUSHES = ['破防了。你隔着一块屏干的好事。', '声音漏了……这笔账记你身上。']

const recentLines = []
function pick(arr) {
  if (!arr || !arr.length) return null
  const fresh = arr.filter((l) => !recentLines.includes(l))
  const line = (fresh.length ? fresh : arr)[Math.floor(Math.random() * (fresh.length ? fresh.length : arr.length))]
  recentLines.push(line); if (recentLines.length > 12) recentLines.shift()
  return line
}
export function pickInstantLine(zone, technique, arousal, events = []) {
  for (const ev of ['near_edge', 'control_break', 'overstimulation_warning']) {
    if (events.includes(ev)) { const l = pick(BY_EVENT[ev]); if (l) return l }
  }
  const band = arousal >= 75 ? 'high' : arousal >= 40 ? 'mid' : 'low'
  const zonePool = BY_ZONE[zone] || {}
  return pick(zonePool[band]) || pick(zonePool.mid) || pick(GENERIC[band]) || pick(GENERIC.mid)
}

import { ActionTechnique, BodyZoneId, NormalizedAction, RhythmType } from '../models/bodyState'

export interface WildcardParseResult { accepted: boolean; needsConfirmation: boolean; label: string; reason?: string; action?: NormalizedAction; confidence: number }

const zones: Array<[BodyZoneId, string[]]> = [['lips', ['lips', '嘴唇']], ['ears', ['ear', 'ears', '耳']], ['neck', ['neck', '颈', '脖']], ['shoulders', ['shoulder', '肩']], ['chest', ['chest', '胸', 'breast']], ['abdomen', ['abdomen', 'belly', '腹']], ['lower_back', ['lower back', '下背', '腰']], ['buttocks', ['buttocks', 'butt', '臀']], ['inner_thighs', ['inner thigh', 'inner thighs', '大腿内侧']], ['perineum', ['perineum', '会阴']], ['penis', ['core', 'penis', 'cock', '阴茎', '下体']], ['hands', ['hand', 'hands', '手']], ['feet', ['foot', 'feet', '脚']]]
const techniques: Array<[ActionTechnique, string[]]> = [['touch', ['touch', '摸', '触']], ['stroke', ['stroke', 'rub', '抚', '摩擦']], ['press', ['press', 'hold', '按', '压']], ['pause', ['pause', 'stop', '停']], ['withdraw', ['withdraw', 'pull away', '撤开']], ['command', ['command', 'order', '命令']]]
const rhythms: Array<[RhythmType, string[]]> = [['still', ['still', '静止']], ['slow', ['slow', '慢']], ['steady', ['steady', '均匀']], ['stop_start', ['stop-start', 'stop start', '停走']], ['accelerating', ['accelerate', 'faster', '加速', '更快']]]

function findMatch<T>(text: string, entries: Array<[T, string[]]>): T | undefined { return entries.find(([, words]) => words.some((word) => text.includes(word)))?.[0] }

export function parseWildcard(input: string): WildcardParseResult {
  const text = input.trim().toLowerCase()
  if (text.length < 3) return { accepted: false, needsConfirmation: false, label: '', reason: 'Please describe the action in at least 3 characters.', confidence: 0 }
  if (text.length > 240) return { accepted: false, needsConfirmation: false, label: '', reason: 'Wildcard is limited to 240 characters.', confidence: 0 }
  const target = findMatch(text, zones) as BodyZoneId | undefined
  const technique = findMatch(text, techniques)
  const rhythm = findMatch(text, rhythms) || 'steady'
  if (!target || !technique) return { accepted: false, needsConfirmation: false, label: '', reason: 'Add one target zone and one technique so the simulator can keep it deterministic.', confidence: 0.25 }
  const intensity = /hard|firm|strong|deep|用力|重/.test(text) ? 72 : /gentle|soft|轻|慢/.test(text) ? 32 : 50
  const action: NormalizedAction = { id: `wildcard:${text.replace(/\s+/g, '-').slice(0, 48)}`, technique, targets: [target], intensity, rhythm, durationSec: rhythm === 'still' ? 8 : 20, permissionRequired: technique === 'command' }
  return { accepted: true, needsConfirmation: true, label: input.trim(), action, confidence: target && technique ? 0.86 : 0.5 }
}

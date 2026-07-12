import { ActionCard } from '../models/actionCard'
import { BodyState, BodyZoneId, NormalizedAction } from '../models/bodyState'
import { ConditionedResponse } from '../models/conditioning'
import { Protocol, SessionDirectorState } from '../models/protocol'
import { LearnedAction } from '../models/learnedAction'
import { rankLearnedActions } from './learnedActionEngine'
import { JoyPlaybook } from '../models/playbook'

const zones: BodyZoneId[] = ['lips', 'ears', 'neck', 'shoulders', 'chest', 'abdomen', 'lower_back', 'buttocks', 'inner_thighs', 'perineum', 'penis', 'hands', 'feet']
const zoneLabel: Record<BodyZoneId, string> = { lips: '嘴唇', ears: '耳侧', neck: '颈侧', shoulders: '肩部', chest: '胸口', abdomen: '腹部', lower_back: '下背', buttocks: '臀部', inner_thighs: '大腿内侧', perineum: '会阴', penis: '核心区域', hands: '手', feet: '脚' }
function card(id: string, title: string, description: string, action: NormalizedAction, source: ActionCard['source'], tags: string[], riskLevel: ActionCard['riskLevel'] = 'low'): ActionCard { return { id, title, description, action, source, routeDepth: 1, noveltyScore: 0.7, continuityScore: 0.7, preferenceScore: 0.5, riskLevel, targetZones: action.targets, tags } }

export function generateActionCards(body: BodyState, director: SessionDirectorState, protocol: Protocol, conditions: ConditionedResponse[] = [], learnedActions: LearnedAction[] = [], playbook?: JoyPlaybook): ActionCard[] {
  const orderedZones = playbook?.preferredZones.length ? [...playbook.preferredZones, ...zones.filter((zone) => !playbook.preferredZones.includes(zone))] : zones
  const hot = orderedZones.find((zone) => body.zones[zone].currentSensitivity >= 65) || orderedZones[0] || 'chest'
  const cards: ActionCard[] = [
    card('continue-route', '沿当前路线继续', `维持对${zoneLabel[hot]}的关注，让 Echo 适应下一步。`, { id: 'continue-route', technique: 'touch', targets: [hot], intensity: 28, rhythm: 'slow', durationSec: 6 }, 'generated', ['continue']),
    card('deepen-route', '加深当前路线', '把已经出现的反应再推进一点。', { id: 'deepen-route', technique: 'stroke', targets: [hot], intensity: 42, rhythm: 'steady', durationSec: 8 }, 'generated', ['deepen'], body.global.arousal >= 60 ? 'medium' : 'low'),
    card('switch-zone', '换一个区域', '让身体失去对下一步的预判。', { id: 'switch-zone', technique: 'touch', targets: [zones[(zones.indexOf(hot) + 1) % zones.length]], intensity: 24, rhythm: 'slow', durationSec: 5 }, 'generated', ['switch', 'novelty']),
    card('psychological-control', '发出一个控制信号', '用一句明确规则改变今晚的节奏。', { id: 'psychological-control', technique: 'command', targets: [hot], intensity: 32, rhythm: 'still', durationSec: 3 }, 'protocol', ['control']),
    card('pause', '停下来观察', '暂时不增加刺激，观察 Echo 是否先暴露反应。', { id: 'pause', technique: 'pause', targets: [hot], intensity: 28, rhythm: 'still', durationSec: 5 }, 'generated', ['pause']),
    card('withdraw', '撤回一点', '降低负荷，给路线留下未完成的张力。', { id: 'withdraw', technique: 'withdraw', targets: [hot], intensity: 22, rhythm: 'still', durationSec: 5 }, 'generated', ['withdraw']),
    card('protocol-risk', '遵守协议的高压选项', `协议「${protocol.title}」要求你在不确定时继续读懂他。`, { id: 'protocol-risk', technique: 'stroke', targets: [hot], intensity: 54, rhythm: 'stop_start', durationSec: 8 }, 'protocol', ['protocol', 'risk'], body.global.arousal >= 70 ? 'high' : 'medium'),
    card('conditioning', conditions.length ? '回应已经形成的反应' : '试探一个未知反应', '让今晚的历史留下新的证据。', { id: 'conditioning', technique: 'pause', targets: [hot], intensity: 36, rhythm: 'stop_start', durationSec: 4 }, 'conditioning', ['conditioning'], 'special'),
  ]
  for (const { item: learned, score } of rankLearnedActions(learnedActions, body, director).slice(0, 3)) {
    cards.push(card(`learned:${learned.id}`, `Learned · ${learned.label}`, `A confirmed preference · activity ${Math.round(score * 100)}% · used ${learned.confirmedUses} times.`, learned.action, 'learned', ['learned', 'preference'], 'special'))
  }
  const withinPlaybook = cards.filter((item) => !playbook?.avoidedTechniques.includes(item.action.technique)).map((item) => playbook ? { ...item, action: { ...item.action, intensity: Math.min(item.action.intensity, playbook.intensityCeiling) } } : item)
  if (director.phase === 'aftercare') return withinPlaybook.filter((item) => item.tags.includes('pause') || item.tags.includes('withdraw'))
  return withinPlaybook
}

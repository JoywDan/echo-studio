import menu from './actionMenu.v3.json'
import { ActionTechnique, BodyZoneId, NormalizedAction, RhythmType } from '../models/bodyState'

export interface ContentActionCard { id: string; mechanicId: string; title: string; teaser: string; description: string; organs: string; method: string; rhythm: string; intensity: number; duration: string; riskLevel: string; requiresLiveCheckin: boolean; cooldown: string; stopWhen: string; nextActions: Array<{ action_id: string; reason: string }> }
export interface ContentCategory { id: string; title: string; cards: ContentActionCard[] }
export const actionMenu = menu as { version: number; categories: ContentCategory[] }

const zoneMatchers: Array<[BodyZoneId, RegExp]> = [['lips', /嘴唇/], ['ears', /耳/], ['neck', /颈|脖/], ['shoulders', /肩/], ['chest', /乳头|胸口|胸部|锁骨/], ['abdomen', /腹部|小腹/], ['lower_back', /下背|腰背|腰/], ['buttocks', /屁股|臀/], ['inner_thighs', /大腿内侧|大腿/], ['perineum', /会阴/], ['penis', /阴茎|龟头|冠状沟|阴囊/], ['hands', /手掌|手指|手腕/], ['feet', /脚|足/]]

function technique(card: ContentActionCard): ActionTechnique {
  const text = `${card.mechanicId} ${card.method}`
  if (/aftercare|full-stop|withdrawal|omission|停止|撤离/.test(text)) return 'withdraw'
  if (/command|pose|inspect|agency|命令|姿势|观察/.test(text)) return 'command'
  if (/press|hold|按压|握住/.test(text)) return 'press'
  if (/manual|stroke|edging|套弄|摩擦/.test(text)) return 'stroke'
  return 'touch'
}
function rhythm(card: ContentActionCard): RhythmType { const text = card.rhythm; if (/停|间歇|撤|交替/.test(text)) return 'stop_start'; if (/加速|递增|阶梯/.test(text)) return 'accelerating'; if (/静止|保持/.test(text)) return 'still'; if (/慢|缓/.test(text)) return 'slow'; return 'steady' }
function durationSeconds(value: string): number { const numbers = [...value.matchAll(/\d+/g)].map((match) => Number(match[0])); if (!numbers.length) return 20; const average = numbers.reduce((sum, item) => sum + item, 0) / numbers.length; return Math.max(3, Math.min(120, /分钟/.test(value) ? average * 60 : average)) }

export function contentCardToAction(card: ContentActionCard): NormalizedAction {
  const targets = zoneMatchers.filter(([, pattern]) => pattern.test(card.organs)).map(([zone]) => zone)
  return { id: `menu:${card.id}`, technique: technique(card), targets: targets.length ? targets.slice(0, 2) : ['chest'], intensity: Math.min(90, Math.max(10, card.intensity * 18)), rhythm: rhythm(card), durationSec: durationSeconds(card.duration), permissionRequired: card.requiresLiveCheckin }
}

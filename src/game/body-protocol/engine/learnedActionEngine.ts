import { BodyState } from '../models/bodyState'
import { LearnedAction } from '../models/learnedAction'
import { SessionDirectorState } from '../models/protocol'

export function learnedActionActivity(item: LearnedAction, body: BodyState, director: SessionDirectorState, now = Date.now()): number {
  if (item.status !== 'learned') return 0
  const ageDays = Math.max(0, now - Date.parse(item.lastUsedAt)) / 86_400_000
  const recency = Math.max(0.15, 1 - ageDays * 0.12)
  const zone = item.action.targets[0]
  const heat = body.zones[zone]?.currentSensitivity || 0
  const phaseFit = director.phase === 'aftercare' ? 0 : item.action.technique === 'pause' || item.action.technique === 'withdraw' ? 0.85 : 1
  return Math.max(0, Math.min(1, recency * (0.55 + heat / 220) * phaseFit))
}

export function rankLearnedActions(items: LearnedAction[], body: BodyState, director: SessionDirectorState, now = Date.now()): Array<{ item: LearnedAction; score: number }> {
  return items.map((item) => ({ item, score: learnedActionActivity(item, body, director, now) })).filter(({ score }) => score >= 0.25).sort((a, b) => b.score - a.score)
}

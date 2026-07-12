import { ConditionObservation, ConditionedResponse } from '../models/conditioning'

export function conditionSignature(observation: ConditionObservation): string { return `${observation.action.technique}:${observation.action.rhythm}:${observation.zone}:arousal_${observation.beforeArousal >= 75 ? 'high' : 'low'}` }

export function updateConditioning(existing: ConditionedResponse[], observation: ConditionObservation): { conditions: ConditionedResponse[]; triggeredIds: string[] } {
  const signature = conditionSignature(observation)
  const triggeredIds: string[] = []
  // Every observation is also a small extinction opportunity for conditions
  // that were not reinforced this turn. This keeps old preferences alive but
  // prevents them from becoming permanent rules.
  const conditions = existing.map((item) => ({ ...item, strength: Math.max(0, item.strength - 0.01), extinctionProgress: Math.min(1, item.extinctionProgress + 0.02), competingResponseIds: [...item.competingResponseIds] }))
  const found = conditions.find((item) => item.triggerSignature === signature)
  if (!found) {
    if (!observation.events.includes('near_edge') && observation.action.technique !== 'pause') return { conditions, triggeredIds }
    const item: ConditionedResponse = { id: `cond_${conditions.length + 1}`, triggerSignature: signature, responseType: observation.action.technique === 'pause' ? 'anticipatory_tension' : 'control_drop', strength: 0.2, observations: 1, status: 'suspected', contextBindings: [observation.zone, observation.action.rhythm], competingResponseIds: [], extinctionProgress: 0 }
    // Same technique/rhythm in another context becomes a competitor instead
    // of silently merging into the first learned response.
    for (const other of conditions) {
      const [technique, rhythm] = other.triggerSignature.split(':')
      if (technique === observation.action.technique && rhythm === observation.action.rhythm) {
        other.competingResponseIds = Array.from(new Set([...other.competingResponseIds, item.id]))
        item.competingResponseIds.push(other.id)
      }
    }
    conditions.push(item); triggeredIds.push(item.id); return { conditions, triggeredIds }
  }
  found.observations += 1
  found.strength = Math.min(1, found.strength + 0.12)
  found.extinctionProgress = 0
  found.status = found.strength >= 0.8 ? 'established' : found.strength >= 0.45 ? 'forming' : 'suspected'
  if (found.observations >= 3) found.contextBindings = Array.from(new Set([...found.contextBindings, observation.zone, observation.action.rhythm]))
  if (found.strength < 0.2 && found.extinctionProgress >= 1) found.status = 'suspected'
  triggeredIds.push(found.id)
  return { conditions, triggeredIds }
}

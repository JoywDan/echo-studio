import { BodyState } from '../models/bodyState'
import { Protocol, SessionDirectorState } from '../models/protocol'

export function initialDirector(): SessionDirectorState { return { phase: 'invitation', tensionBudget: 100, targetSessionLength: 30, phaseStartedAtTurn: 0, transitionReasons: ['session_started'] } }

export function advanceDirector(current: SessionDirectorState, body: BodyState, turnIndex: number, protocol: Protocol): SessionDirectorState {
  let phase = current.phase
  let reason = ''
  if (body.global.irritation >= 55) { phase = 'aftercare'; reason = 'irritation_safety_exit' }
  else if (turnIndex >= current.targetSessionLength - 2) { phase = 'resolution'; reason = 'target_length_reached' }
  else if (body.global.edgeCount >= 2 && body.global.control < 45) { phase = 'turning_point'; reason = 'edge_and_control_instability' }
  else if (body.global.arousal >= 75) { phase = 'destabilization'; reason = 'arousal_entered_unstable_range' }
  else if (turnIndex >= 8) { phase = 'pressure'; reason = 'buildup_complete' }
  else if (turnIndex >= 3) { phase = 'buildup'; reason = 'invitation_complete' }
  if (phase === current.phase) return current
  return { ...current, phase, phaseStartedAtTurn: turnIndex, tensionBudget: Math.max(0, current.tensionBudget - (protocol.modifiers.anticipatoryResponseGain * 2)), transitionReasons: [...current.transitionReasons, reason] }
}

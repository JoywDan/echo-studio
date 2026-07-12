import { BodyState, NormalizedAction, SimulationResult } from '../models/bodyState'
import { resolveAction } from './bodySimulator'
import { SeededRng } from './rng'

export interface ReplayTurn { action: NormalizedAction; result: SimulationResult }
export interface ReplayLog { seed: string; engineVersion: string; rulesetVersion: string; initialState: BodyState; turns: ReplayTurn[] }

export function replaySession(log: ReplayLog): ReplayLog {
  let state = log.initialState
  const turns: ReplayTurn[] = []
  for (const turn of log.turns) {
    const result = resolveAction(state, turn.action, new SeededRng(`${log.seed}:${turns.length}`))
    turns.push({ action: turn.action, result })
    state = result.stateAfter
  }
  return { ...log, turns }
}

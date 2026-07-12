import { createInitialBodyState, resolveAction } from './bodySimulator'
import { replaySession, ReplayLog } from './replay'
import { SeededRng } from './rng'
import { NormalizedAction } from '../models/bodyState'

export const GOLDEN_SESSION_SEED = 'golden-session-v3.1-001'

const ACTIONS: NormalizedAction[] = [
  { id: 'observe-chest', technique: 'command', targets: ['chest'], intensity: 18, rhythm: 'still', durationSec: 4 },
  { id: 'slow-inner-thighs', technique: 'touch', targets: ['inner_thighs'], intensity: 28, rhythm: 'slow', durationSec: 7 },
  { id: 'pause-1', technique: 'pause', targets: ['inner_thighs'], intensity: 30, rhythm: 'still', durationSec: 5 },
  { id: 'steady-penis', technique: 'stroke', targets: ['penis'], intensity: 34, rhythm: 'steady', durationSec: 8 },
  { id: 'switch-chest', technique: 'touch', targets: ['chest'], intensity: 22, rhythm: 'slow', durationSec: 5 },
  { id: 'command-still', technique: 'command', targets: ['penis'], intensity: 36, rhythm: 'still', durationSec: 4 },
  { id: 'stop-start', technique: 'stroke', targets: ['penis'], intensity: 42, rhythm: 'stop_start', durationSec: 8 },
  { id: 'withdraw-1', technique: 'withdraw', targets: ['penis'], intensity: 35, rhythm: 'still', durationSec: 6 },
]

export function goldenActionAt(turnIndex: number): NormalizedAction {
  return { ...ACTIONS[turnIndex % ACTIONS.length], id: `${ACTIONS[turnIndex % ACTIONS.length].id}-${turnIndex + 1}` }
}

export function runGoldenSession(turns = 30): ReplayLog {
  const log: ReplayLog = { seed: GOLDEN_SESSION_SEED, engineVersion: '0.1.0', rulesetVersion: '1', initialState: createInitialBodyState(), turns: [] }
  let state = log.initialState
  for (let index = 0; index < turns; index++) {
    const action = goldenActionAt(index)
    const result = resolveAction(state, action, new SeededRng(`${GOLDEN_SESSION_SEED}:${index}`))
    log.turns.push({ action, result })
    state = result.stateAfter
  }
  return log
}

export function verifyGoldenReplay(log: ReplayLog): boolean {
  const replayed = replaySession({ ...log, turns: log.turns.map((turn) => ({ ...turn, result: {} as never })) })
  return JSON.stringify(replayed.turns.map((turn) => turn.result.stateAfter)) === JSON.stringify(log.turns.map((turn) => turn.result.stateAfter))
}

export function goldenObservationLog(log: ReplayLog): string[] {
  const observations: string[] = []
  const events = log.turns.flatMap((turn, index) => turn.result.events.map((event) => ({ event, index: index + 1 })))
  observations.push(`GOLDEN SESSION: ${log.turns.length} turns, seed ${log.seed}`)
  for (const item of events) observations.push(`TURN ${String(item.index).padStart(2, '0')}: ${item.event}`)
  const finalState = log.turns.at(-1)?.result.stateAfter
  if (finalState) observations.push(`FINAL: arousal=${finalState.global.arousal}, control=${finalState.global.control}, fatigue=${finalState.global.globalFatigue}`)
  return observations
}

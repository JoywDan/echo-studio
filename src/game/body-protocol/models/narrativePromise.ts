import { Protocol } from './protocol'
import { SessionDirectorState } from './protocol'
export interface NarrativePromise { id: string; setup: string; expectedPayoff: string; status: 'setup' | 'developing' | 'paid_off'; payoffTurn?: number }
export function promiseForProtocol(protocol: Protocol): NarrativePromise { return { id: `promise:${protocol.id}`, setup: `Complete ${protocol.title} without skipping the current turn.`, expectedPayoff: protocol.specialRule || 'resolve_the_protocol_tension', status: 'setup' } }
export function advancePromise(promise: NarrativePromise, director: SessionDirectorState, turn: number): NarrativePromise { if (director.phase === 'resolution' || director.phase === 'aftercare') return { ...promise, status: 'paid_off', payoffTurn: turn }; if (turn > 0) return { ...promise, status: 'developing' }; return promise }

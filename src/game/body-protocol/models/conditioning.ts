import { BodyZoneId, NormalizedAction } from './bodyState'
export type ConditionStatus = 'suspected' | 'forming' | 'established' | 'deeply_conditioned'
export interface ConditionedResponse { id: string; triggerSignature: string; responseType: 'anticipatory_tension' | 'control_drop' | 'stillness'; strength: number; observations: number; status: ConditionStatus; contextBindings: string[]; competingResponseIds: string[]; extinctionProgress: number }
export interface ConditionObservation { action: NormalizedAction; beforeArousal: number; afterArousal: number; events: string[]; zone: BodyZoneId }

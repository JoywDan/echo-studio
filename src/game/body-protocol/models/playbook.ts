import { ActionTechnique, BodyZoneId } from './bodyState'
export interface JoyPlaybook { preferredZones: BodyZoneId[]; avoidedTechniques: ActionTechnique[]; intensityCeiling: number; notes: string }
export const DEFAULT_PLAYBOOK: JoyPlaybook = { preferredZones: ['chest', 'inner_thighs', 'penis'], avoidedTechniques: [], intensityCeiling: 80, notes: '' }

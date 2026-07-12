import { NormalizedAction } from './bodyState'

export interface LearnedAction {
  id: string
  label: string
  action: NormalizedAction
  observations: number
  confirmedUses: number
  status: 'candidate' | 'learned'
  createdAt: string
  lastUsedAt: string
}

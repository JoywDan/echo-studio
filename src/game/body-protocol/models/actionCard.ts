import { BodyZoneId, NormalizedAction } from './bodyState'
export type ActionCardSource = 'generated' | 'protocol' | 'conditioning' | 'learned'
export interface ActionCard { id: string; title: string; description: string; action: NormalizedAction; source: ActionCardSource; routeDepth: number; noveltyScore: number; continuityScore: number; preferenceScore: number; riskLevel: 'low' | 'medium' | 'high' | 'special'; targetZones: BodyZoneId[]; tags: string[] }

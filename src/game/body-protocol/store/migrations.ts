import { BODY_PROTOCOL_SCHEMA_VERSION, BodyState } from '../models/bodyState'
import { BodyProtocolSave, makeSave, validateSave } from './persistence'

export interface LegacyBodyProtocolSave { sessionId?: string; bodyState?: BodyState; savedAt?: string; engineVersion?: string; rulesetVersion?: string }

export function migrateSave(input: unknown): BodyProtocolSave {
  if (validateSave(input)) return structuredClone(input)
  const legacy = (input || {}) as LegacyBodyProtocolSave
  if (!legacy.sessionId || !legacy.bodyState?.global || !legacy.bodyState?.zones) throw new Error('Invalid BODY PROTOCOL save')
  const migrated = makeSave(legacy.sessionId, legacy.bodyState, undefined, legacy.engineVersion || '0.1.0', legacy.rulesetVersion || '1')
  // Keep the legacy marker so older exports remain recognizable; the payload now
  // carries a safe v2 snapshot and can be re-saved as the current schema.
  return { ...migrated, schemaVersion: 1 }
}

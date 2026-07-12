import { BodyProtocolState } from './bodyProtocolReducer'
import { decryptVault, encryptVault } from './privateVault'
import { makeSave } from './persistence'
import { deleteEncryptedVault, readEncryptedVault, writeEncryptedVault } from './vaultStorage'

export async function saveProtocolState(state: BodyProtocolState, password: string): Promise<void> {
  const save = makeSave(state.sessionId || 'unsaved', state.body, { seed: state.seed, turnIndex: state.turnIndex, protocol: state.protocol, director: state.director, conditions: state.conditions, currentCards: state.currentCards, triggeredConditionIds: state.triggeredConditionIds, agency: state.agency, recentTurnSummary: state.recentTurnSummary, phase: state.phase })
  await writeEncryptedVault(await encryptVault(save, password))
}

export async function loadProtocolBodyState(password: string) {
  const record = await readEncryptedVault()
  if (!record) return null
  return decryptVault(record, password)
}

export { deleteEncryptedVault }

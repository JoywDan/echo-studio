export interface GuardedEchoResponse { speech: string; model?: string; providerLabel?: string }

export function normalizeSpeech(value: unknown): string { return String(value ?? '').replace(/\s+/g, ' ').trim() }
export function speechFingerprint(value: unknown): string { return normalizeSpeech(value).toLowerCase().replace(/[，。！？、,.!?：:；;]/g, '').slice(0, 240) }

export function validateEchoResponse(payload: unknown): GuardedEchoResponse {
  const value = payload as { speech?: unknown; model?: unknown; provider_label?: unknown }
  const speech = normalizeSpeech(value?.speech)
  if (!speech) throw new Error('Echo returned an empty response')
  if (speech.length > 2400) throw new Error('Echo response exceeded the display limit')
  return { speech, model: value?.model ? String(value.model) : undefined, providerLabel: value?.provider_label ? String(value.provider_label) : undefined }
}

export function isRecentDuplicate(speech: string, recent: string[]): boolean {
  const fingerprint = speechFingerprint(speech)
  return !!fingerprint && recent.some((item) => speechFingerprint(item) === fingerprint)
}

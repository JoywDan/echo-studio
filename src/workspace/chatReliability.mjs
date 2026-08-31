function normalizeAttemptedModels(value) {
  return Array.isArray(value) ? value.map(String).filter(Boolean).slice(0, 3) : []
}

export function inferFailedTurn(historyMessages = [], latestFailure = null) {
  const last = historyMessages[historyMessages.length - 1]
  if (!last || last.role !== 'user') return null
  return {
    userMsgId: latestFailure?.user_msg_id || last.id || null,
    code: latestFailure?.code || 'ORPHANED_USER_TURN',
    message: latestFailure?.message || '这轮没有生成成功，原消息已经保留。',
    requestTraceId: latestFailure?.request_trace_id || null,
    attemptedModels: normalizeAttemptedModels(latestFailure?.attempted_models),
    inferred: !latestFailure,
  }
}

export function failedTurnFromStreamError(error, fallbackUserMsgId = null) {
  return {
    userMsgId: error?.userMsgId || fallbackUserMsgId || null,
    code: error?.code || 'CHAT_STREAM_FAILED',
    message: error?.message || '这轮没有生成成功，原消息已经保留。',
    requestTraceId: error?.requestTraceId || null,
    attemptedModels: normalizeAttemptedModels(error?.attemptedModels),
    inferred: false,
  }
}

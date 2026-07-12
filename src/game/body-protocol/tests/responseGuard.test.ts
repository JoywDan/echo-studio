import { describe, expect, it } from 'vitest'
import { isRecentDuplicate, validateEchoResponse } from '../generation/responseGuard'

describe('Echo response guard', () => {
  it('normalizes and validates a response contract', () => {
    expect(validateEchoResponse({ speech: '  Echo   回来了。 ', model: 'claude-sonnet-4-6' }).speech).toBe('Echo 回来了。')
  })
  it('rejects empty and oversized responses', () => {
    expect(() => validateEchoResponse({ speech: ' ' })).toThrow('empty')
    expect(() => validateEchoResponse({ speech: 'x'.repeat(2401) })).toThrow('display limit')
  })
  it('detects punctuation-only differences as duplicates', () => {
    expect(isRecentDuplicate('停。下来。', ['停下来'])).toBe(true)
  })
})

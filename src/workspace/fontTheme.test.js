import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const css = readFileSync(new URL('./app.css', import.meta.url), 'utf8')
const chatPage = readFileSync(new URL('./ChatPage.jsx', import.meta.url), 'utf8')

describe('workspace custom body font', () => {
  it('resolves the theme font on the element that owns the theme variables', () => {
    expect(css).toMatch(/\.app\s*\{[^}]*font-family:\s*var\(--font-cn\)/s)
  })

  it('keeps rich-message narration on the selected body font', () => {
    expect(css).toMatch(/\.msg-narration\s*\{[^}]*font-family:\s*inherit/s)
  })

  it('remeasures the chat composer after uploaded fonts load', () => {
    expect(css).toMatch(/\.input-field\s*\{[^}]*min-height:\s*52px/s)
    expect(chatPage).toContain('Math.max(el.scrollHeight, CHAT_INPUT_MIN_HEIGHT)')
    expect(chatPage).toContain('fonts.addEventListener?.("loadingdone", remeasure)')
  })
})

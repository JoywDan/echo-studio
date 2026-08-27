import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const css = readFileSync(new URL('./app.css', import.meta.url), 'utf8')

describe('workspace custom body font', () => {
  it('resolves the theme font on the element that owns the theme variables', () => {
    expect(css).toMatch(/\.app\s*\{[^}]*font-family:\s*var\(--font-cn\)/s)
  })

  it('keeps rich-message narration on the selected body font', () => {
    expect(css).toMatch(/\.msg-narration\s*\{[^}]*font-family:\s*inherit/s)
  })
})

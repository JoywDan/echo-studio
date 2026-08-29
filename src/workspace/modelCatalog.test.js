import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const catalog = readFileSync(new URL('./data.jsx', import.meta.url), 'utf8')
const chatPage = readFileSync(new URL('./ChatPage.jsx', import.meta.url), 'utf8')

describe('Opus 5 chat model', () => {
  it('keeps a local catalog entry with thinking enabled by default', () => {
    expect(catalog).toMatch(/label: "Opus 5\.0", id: "claude-opus-5", supportsThinking: true, defaultThinking: true/)
  })

  it('initializes the thinking toggle from the selected model', () => {
    expect(chatPage).toMatch(/think: m \? !!m\.defaultThinking : false/)
  })
})

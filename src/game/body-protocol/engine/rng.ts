/** Small deterministic PRNG. A Session stores the seed so a turn can be replayed. */
export class SeededRng {
  private state: number
  readonly draws: number[] = []

  constructor(seed: string | number) {
    const text = String(seed)
    let hash = 2166136261
    for (let i = 0; i < text.length; i++) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619)
    this.state = hash >>> 0 || 1
  }

  next(): number {
    let x = this.state
    x ^= x << 13
    x ^= x >>> 17
    x ^= x << 5
    this.state = x >>> 0
    const value = this.state / 4294967296
    this.draws.push(value)
    return value
  }
}

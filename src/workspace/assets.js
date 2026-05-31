const stk = import.meta.glob('./assets/stickers/*.png', { eager: true, import: 'default' })
export const STICKERS = Object.keys(stk).sort().map(k => stk[k])
const wsh = import.meta.glob('./assets/washi/*.png', { eager: true, import: 'default' })
export const WASHIS = Object.keys(wsh).sort().map(k => wsh[k])
import chest from './assets/chest.png'
import pantherHead from './assets/panther-head.png'
import tapeLong1 from './assets/tape-long-1.png'
import tapeLong2 from './assets/tape-long-2.png'
export const CHEST = chest
export const PANTHER_HEAD = pantherHead
export const TAPE_LONG = [tapeLong1, tapeLong2]
export const stickerAt = (i) => STICKERS[((i % STICKERS.length) + STICKERS.length) % STICKERS.length]

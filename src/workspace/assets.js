const stk = import.meta.glob('./assets/stickers/*.png', { eager: true, import: 'default' })
export const STICKERS = Object.keys(stk).sort().map(k => stk[k])
const wsh = import.meta.glob('./assets/washi/*.png', { eager: true, import: 'default' })
export const WASHIS = Object.keys(wsh).sort().map(k => wsh[k])
const clp = import.meta.glob('./assets/clips/*.png', { eager: true, import: 'default' })
export const CLIPS = Object.keys(clp).sort().map(k => clp[k])
const pcl = import.meta.glob('./assets/paperclips/*.png', { eager: true, import: 'default' })
export const PAPERCLIPS = Object.keys(pcl).sort().map(k => pcl[k])
const ttl = import.meta.glob('./assets/titles/*.png', { eager: true, import: 'default' })
export const TITLES = Object.keys(ttl).sort().map(k => ttl[k])
import chest from './assets/chest.png'
import title from './assets/title.png'
import pinnedImg from './assets/pinned-notes.png'
import newnoteImg from './assets/new-note.png'
import pantherHead from './assets/panther-head.png'
import tapeLong1 from './assets/tape-long-1.png'
import tapeLong2 from './assets/tape-long-2.png'
export const CHEST = chest
export const TITLE = title
export const PINNED_IMG = pinnedImg
export const NEWNOTE_IMG = newnoteImg
export const PANTHER_HEAD = pantherHead
export const TAPE_LONG = [tapeLong1, tapeLong2]
const deco = import.meta.glob('./assets/deco/*.png', { eager: true, import: 'default' })
export const DECO_POOL = Object.keys(deco).sort().map(k => deco[k])
export const stickerAt = (i) => STICKERS[((i % STICKERS.length) + STICKERS.length) % STICKERS.length]
export const washiAt = (i) => WASHIS[((i % WASHIS.length) + WASHIS.length) % WASHIS.length]
export const clipAt = (i) => CLIPS[((i % CLIPS.length) + CLIPS.length) % CLIPS.length]

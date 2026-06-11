import React from 'react'
import { ReactReader } from 'react-reader'
import { api } from './api.js'
import { Icon } from './doodles.jsx'
import { idbPut, idbGet, idbDel } from './idb.js'

const PROG_KEY = 'ws_book_progress'
function loadProg() { try { return JSON.parse(localStorage.getItem(PROG_KEY) || '{}') } catch { return {} } }
function saveProg(p) { try { localStorage.setItem(PROG_KEY, JSON.stringify(p)) } catch {} }

// 中文 txt 多为 GBK/GB18030，先试 UTF-8，乱码多则回退 GB18030
function decodeText(buf) {
  let txt = ''
  try { txt = new TextDecoder('utf-8', { fatal: false }).decode(buf) } catch {}
  const bad = (txt.match(/�/g) || []).length
  if (!txt || bad > Math.max(4, txt.length * 0.001)) {
    try { txt = new TextDecoder('gb18030').decode(buf) } catch {}
  }
  return txt.replace(/\r\n/g, '\n')
}
const CHAP_RE = /^\s*(第\s*[0-9零一二三四五六七八九十百千两壹贰叁肆伍陆柒捌玖拾佰]+\s*[章回节卷集部篇折]|序[章言]?$|楔\s*子|引\s*子|前\s*言|后\s*记|尾\s*声|番\s*外|Chapter\s*\d+|CHAPTER\s*\d+)/i
function splitChapters(text) {
  const lines = text.split('\n')
  const chs = []
  let cur = { title: '开头', body: [] }
  for (const ln of lines) {
    const t = ln.trim()
    if (t && t.length <= 32 && CHAP_RE.test(t)) {
      if (cur.body.length) chs.push({ title: cur.title, text: cur.body.join('\n').trim() })
      cur = { title: t, body: [] }
    } else cur.body.push(ln)
  }
  if (cur.body.length) chs.push({ title: cur.title, text: cur.body.join('\n').trim() })
  const real = chs.filter(c => c.text.length > 0)
  if (real.length > 1) return real
  // 无章节：按 ~3500 字分页
  const pages = []
  for (let i = 0; i < text.length; i += 3500) pages.push({ title: '第 ' + (pages.length + 1) + ' 节', text: text.slice(i, i + 3500) })
  return pages.length ? pages : [{ title: '全文', text }]
}

const COVER_TINTS = ['#d6cdb6', '#c4785c', '#aebac0', '#9aab83', '#c9a98f', '#a99fbb', '#b8c3ad', '#cdb6a0', '#b58e7a', '#8f9bb0']
function tintFor(key) { let h = 0; const s = String(key || ''); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return COVER_TINTS[h % COVER_TINTS.length] }
function cleanTitle(raw) {
  let s = String(raw || '').replace(/\.(txt|epub|pdf)$/i, '').trim()
  s = s.replace(/[_\-—·\s]*(txt小说天堂|小说天堂|奇书网|静思书屋|精校版?|全本|未删节|扫描版?|文字版|epub吧|图书馆|下载)[_\-—·\s]*/gi, '_').replace(/_+$/, '').replace(/^_+/, '')
  const parts = s.split(/[_·—\-]/).map(p => p.trim()).filter(Boolean)
  if (!parts.length) return { title: s, author: '' }
  return { title: parts[0], author: (parts[1] && parts[1].length <= 10) ? parts[1] : '' }
}
const SHELF_PICKS = [
  { id: 205, title: 'Walden', author: 'Henry David Thoreau', tint: '#d6cdb6' },
  { id: 2680, title: 'Meditations', author: 'Marcus Aurelius', tint: '#c4785c' },
  { id: 2641, title: 'A Room with a View', author: 'E. M. Forster', tint: '#aebac0' },
  { id: 289, title: 'The Wind in the Willows', author: 'Kenneth Grahame', tint: '#9aab83' },
].map(b => ({ ...b, epub: 'https://www.gutenberg.org/cache/epub/' + b.id + '/pg' + b.id + '.epub' }))
export default function BookReader({ onClose }) {
  const [mode, setMode] = React.useState(null)      // 'epub' | 'txt'
  const [data, setData] = React.useState(null)      // epub ArrayBuffer
  const [chapters, setChapters] = React.useState([])
  const [chapIdx, setChapIdx] = React.useState(0)
  const [showChaps, setShowChaps] = React.useState(false)
  const [title, setTitle] = React.useState('')
  const [bookKey, setBookKey] = React.useState('')
  const [loc, setLoc] = React.useState(null)
  const [sel, setSel] = React.useState('')
  const [panelOpen, setPanelOpen] = React.useState(false)
  const [msgs, setMsgs] = React.useState([])
  const [draft, setDraft] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState(null)
  const [searching, setSearching] = React.useState(false)
  const [searchErr, setSearchErr] = React.useState('')
  const [loadingBook, setLoadingBook] = React.useState('')
  const [lang, setLang] = React.useState('zh')
  const [cat, setCat] = React.useState('All')
  const [shelf, setShelf] = React.useState(() => { try { return JSON.parse(localStorage.getItem('ws_bookshelf') || '[]') } catch { return [] } })
  const renditionRef = React.useRef(null)
  const notesRef = React.useRef([])
  const epubHlRef = React.useRef(false)
  const fileRef = React.useRef(null)
  const chatEndRef = React.useRef(null)
  const txtRef = React.useRef(null)
  const ioRef = React.useRef(null)
  const markRefs = React.useRef({})
  const shownNotesRef = React.useRef(new Set())
  const prereadPollRef = React.useRef(null)
  const [notes, setNotes] = React.useState([])
  const [prereadJob, setPrereadJob] = React.useState(null)
  const [popNote, setPopNote] = React.useState(null)
  const [cloud, setCloud] = React.useState([])
  const [fontPx, setFontPx] = React.useState(() => { try { return +localStorage.getItem('ws_read_font') || 18 } catch { return 18 } })
  const [showAa, setShowAa] = React.useState(false)
  const [savedMsg, setSavedMsg] = React.useState('')

  React.useEffect(() => () => { if (prereadPollRef.current) clearInterval(prereadPollRef.current) }, [])
  React.useEffect(() => { api.bookCloudList().then(d => setCloud(d.books || [])).catch(() => {}) }, [])
  React.useEffect(() => { try { localStorage.setItem('ws_read_font', String(fontPx)) } catch {}; if (renditionRef.current) { try { renditionRef.current.themes.fontSize(fontPx + 'px') } catch {} } }, [fontPx])
  React.useEffect(() => { if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' }) }, [msgs])
  React.useEffect(() => { if (mode === 'txt' && txtRef.current) txtRef.current.scrollTop = 0 }, [chapIdx, mode])
  React.useEffect(() => {
    if (mode !== 'txt' || !notes.length) return
    const t = setTimeout(() => {
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) if (e.isIntersecting) { const ni = e.target.dataset.ni; if (ni != null && !shownNotesRef.current.has(ni)) { shownNotesRef.current.add(ni); setPopNote(notes[+ni]) } }
      }, { root: txtRef.current, threshold: 0.85 })
      Object.values(markRefs.current).forEach(el => el && io.observe(el))
      ioRef.current = io
    }, 250)
    return () => { clearTimeout(t); if (ioRef.current) ioRef.current.disconnect() }
  }, [chapIdx, notes, mode])
  React.useEffect(() => { notesRef.current = notes; epubHlRef.current = false }, [notes])
  React.useEffect(() => {
    if (mode !== 'epub' || !notes.length) return
    let n = 0
    const iv = setInterval(() => { n++; if (renditionRef.current) { clearInterval(iv); applyEpubNotes() } else if (n > 40) clearInterval(iv) }, 250)
    return () => clearInterval(iv)
  }, [notes, mode])

  const reset = () => { setMode(null); setData(null); setChapters([]); setChapIdx(0); setSel(''); setShowChaps(false); setNotes([]); setPrereadJob(null); setPopNote(null); shownNotesRef.current = new Set(); epubHlRef.current = false; notesRef.current = []; if (prereadPollRef.current) { clearInterval(prereadPollRef.current); prereadPollRef.current = null } }
  const PREREAD_PENDING = 'ws_book_preread_pending'
  const getPending = () => { try { return JSON.parse(localStorage.getItem(PREREAD_PENDING) || '{}') } catch { return {} } }
  const setPending = (key, val) => { const p = getPending(); if (val) p[key] = val; else delete p[key]; try { localStorage.setItem(PREREAD_PENDING, JSON.stringify(p)) } catch {} }
  const pollPreread = (jobId, key) => {
    if (prereadPollRef.current) clearInterval(prereadPollRef.current)
    prereadPollRef.current = setInterval(async () => {
      try {
        const st = await api.bookPrereadStatus(jobId)
        setPrereadJob({ status: st.status, progress: st.progress, total: st.total })
        if (st.status === 'done') { clearInterval(prereadPollRef.current); prereadPollRef.current = null; setPending(key, null); loadNotes(key) }
        else if (st.status === 'error') { clearInterval(prereadPollRef.current); prereadPollRef.current = null; setPending(key, null); setSearchErr('预读出错：' + (st.error || '')) }
      } catch (e) { clearInterval(prereadPollRef.current); prereadPollRef.current = null; setPending(key, null) }
    }, 5000)
  }
  const loadNotes = async (key) => {
    setNotes([]); shownNotesRef.current = new Set()
    try { const d = await api.bookPrereadGet(key); if (d && d.ready) { setNotes(d.notes || []); setPrereadJob({ status: 'done' }); setPending(key, null); return } } catch {}
    const pend = getPending()[key]
    if (pend && pend.jobId) { setPrereadJob({ status: 'running', progress: 0, total: pend.total }); pollPreread(pend.jobId, key) }
    else setPrereadJob(null)
  }
  const epubFullText = async () => {
    const book = renditionRef.current && renditionRef.current.book
    if (!book) return ''
    try {
      await book.ready
      let text = ''
      const items = (book.spine && book.spine.spineItems) || []
      for (const it of items) {
        try { const doc = await it.load(book.load.bind(book)); const t = (doc && doc.body && (doc.body.innerText || doc.body.textContent)) || ''; if (t.trim()) text += t.trim() + '\n\n'; it.unload() } catch {}
      }
      return text
    } catch { return '' }
  }
  const applyEpubNotes = async () => {
    const rendition = renditionRef.current
    const book = rendition && rendition.book
    const list = notesRef.current || []
    if (!book || !rendition || !list.length || epubHlRef.current) return
    epubHlRef.current = true
    try {
      await book.ready
      const items = (book.spine && book.spine.spineItems) || []
      const pend = list.map((note, i) => ({ i, q: (note.quote || '').replace(/\s+/g, ' ').trim() })).filter(x => x.q.length >= 6)
      for (const it of items) {
        if (!pend.some(x => x.cfi == null)) break
        let ok = false
        try { await it.load(book.load.bind(book)); ok = true } catch {}
        if (!ok) continue
        for (const x of pend) {
          if (x.cfi != null) continue
          for (const c of [x.q.slice(0, 24), x.q.slice(0, 12)]) {
            if (c.length < 6) continue
            try { const res = it.find(c); if (res && res.length) { x.cfi = res[0].cfi; break } } catch {}
          }
        }
        try { it.unload() } catch {}
      }
      for (const x of pend) {
        if (!x.cfi) continue
        try { rendition.annotations.add('highlight', x.cfi, { ni: x.i }, () => setPopNote(notesRef.current[x.i]), 'echo-hl', { 'fill': '#e6c068', 'fill-opacity': '0.32' }) } catch {}
      }
    } catch {}
  }
  const startPreread = async () => {
    setPrereadJob({ status: 'running', progress: 0, total: 0 })
    let text = ''
    if (mode === 'txt') text = chapters.map(c => c.title + '\n' + c.text).join('\n\n')
    else if (mode === 'epub') text = await epubFullText()
    if (!text || text.length < 50) { setPrereadJob(null); setSearchErr(mode === 'epub' ? '这本 epub 没抽到文字（可能是图片型）' : '内容太短'); return }
    try {
      const r = await api.bookPrereadStart(bookKey, title, text)
      if (r.alreadyDone) { loadNotes(bookKey); return }
      setPrereadJob({ status: 'running', progress: 0, total: r.total })
      setPending(bookKey, { jobId: r.jobId, total: r.total })
      pollPreread(r.jobId, bookKey)
    } catch (e) { setPrereadJob(null); setSearchErr('预读启动失败：' + e.message) }
  }
  const norm = (x) => String(x || '').replace(/[\s\u3000]/g, '').replace(/[，。！？、；：“”‘’（）《》〈〉…—,.!?;:"'()]/g, '').toLowerCase()
  const renderChapterBody = () => {
    const text = chapters[chapIdx] ? chapters[chapIdx].text : ''
    const chNotes = notes.map((n, gi) => ({ ...n, gi })).filter(n => n.chap === chapIdx)
    const used = new Set()
    return text.split('\n').map((p, i) => {
      if (!p.trim()) return <br key={i} />
      const np = norm(p)
      let mark = null
      for (const n of chNotes) { if (used.has(n.gi)) continue; const needle = norm(n.quote).slice(0, 12); if (needle && np.includes(needle)) { mark = n; used.add(n.gi); break } }
      return (<p key={i}>{p}{mark && <span className="br-note-mark" data-ni={mark.gi} ref={el => { if (el) markRefs.current[mark.gi] = el; else delete markRefs.current[mark.gi] }} onClick={() => setPopNote(mark)}>💭</span>}</p>)
    })
  }
  const addToShelf = (key, ttl, md, buf) => {
    try { idbPut('book:' + key, buf) } catch {}
    try { api.bookCloudUpload(key, ttl, md, md, buf).then(() => setCloud(c => c.find(b => b.key === key) ? c : [{ key, title: ttl, mode: md, ts: Date.now() }, ...c])).catch(() => {}) } catch {}
    setShelf(prev => { const next = [{ key, title: ttl, mode: md, ts: Date.now() }, ...prev.filter(b => b.key !== key)].slice(0, 50); try { localStorage.setItem('ws_bookshelf', JSON.stringify(next)) } catch {}; return next })
  }
  const delShelfBook = async (key, e) => {
    if (e) e.stopPropagation()
    try { await idbDel('book:' + key) } catch {}
    try { api.bookCloudDelete(key).catch(() => {}) } catch {}
    setShelf(prev => { const next = prev.filter(b => b.key !== key); try { localStorage.setItem('ws_bookshelf', JSON.stringify(next)) } catch {}; return next })
    setCloud(c => c.filter(b => b.key !== key))
  }
  const openShelfBook = async (item) => {
    if (loadingBook) return
    setLoadingBook(item.title)
    try {
      let buf = await idbGet('book:' + item.key)
      if (!buf) {
        try { buf = await api.bookCloudGet(item.key) } catch {}
        if (buf) { try { idbPut('book:' + item.key, buf.slice(0)) } catch {}; setShelf(prev => prev.find(b => b.key === item.key) ? prev : (() => { const next = [{ key: item.key, title: item.title, mode: item.mode, ts: Date.now() }, ...prev].slice(0, 50); try { localStorage.setItem('ws_bookshelf', JSON.stringify(next)) } catch {}; return next })()) }
      }
      if (!buf) { setSearchErr('找不到这本书的内容～'); return }
      const saved = loadProg()[item.key]
      setTitle(item.title); setBookKey(item.key); setMsgs([]); setSel('')
      if (item.mode === 'txt') {
        const chs = splitChapters(decodeText(buf))
        setChapters(chs); setChapIdx(saved && saved.chap < chs.length ? saved.chap : 0); setMode('txt'); setData(null)
      } else {
        setLoc(saved ? saved.loc : null); setData(buf); setMode('epub'); setChapters([])
      }
      loadNotes(item.key)
    } catch (e) { setSearchErr('打开失败：' + (e.message || '')) } finally { setLoadingBook('') }
  }

  const onPick = async (e) => {
    const f = e.target.files[0]; e.target.value = ''; if (!f) return
    const buf = await f.arrayBuffer()
    const key = f.name + ':' + f.size
    const saved = loadProg()[key]
    setTitle(f.name.replace(/\.(epub|txt)$/i, '')); setBookKey(key); setMsgs([]); setSel('')
    const ttl = f.name.replace(/\.(epub|txt)$/i, '')
    const isTxt = /\.txt$/i.test(f.name)
    addToShelf(key, ttl, isTxt ? 'txt' : 'epub', buf.slice(0))
    if (isTxt) {
      const chs = splitChapters(decodeText(buf))
      setChapters(chs); setChapIdx(saved && saved.chap < chs.length ? saved.chap : 0); setMode('txt'); setData(null)
    } else {
      setLoc(saved ? saved.loc : null); setData(buf); setMode('epub'); setChapters([])
    }
    loadNotes(key)
  }
  const doSearch = async () => {
    const q = query.trim(); if ((!q && !lang) || searching) return
    setSearching(true); setSearchErr(''); setResults(null)
    try { const d = await api.bookSearch(q, lang); setResults(d.books || []) }
    catch (e) { setSearchErr(e.message || '搜索失败') } finally { setSearching(false) }
  }
  const loadBook = async (b) => {
    if (loadingBook) return
    setLoadingBook(b.title)
    try {
      const buf = await api.bookFetch(b.epub)
      const key = 'gut:' + b.id
      const saved = loadProg()[key]
      setTitle(b.title); setBookKey(key); setLoc(saved ? saved.loc : null)
      addToShelf(key, b.title, 'epub', buf.slice(0))
      setData(buf); setMode('epub'); setChapters([]); setMsgs([]); setSel(''); setResults(null); setQuery(''); loadNotes(key)
    } catch (e) { setSearchErr('下载失败：' + (e.message || '')) } finally { setLoadingBook('') }
  }

  const onLoc = (l) => { setLoc(l); if (bookKey) { const p = loadProg(); p[bookKey] = { loc: l, title }; saveProg(p) } }
  const getRendition = (rendition) => {
    renditionRef.current = rendition
    try { rendition.themes.register('lit', { 'body': { 'font-family': "'EB Garamond', Georgia, serif !important", 'color': '#2f2a22 !important', 'line-height': '1.75 !important', 'background': '#f0ead9 !important', 'padding': '0 2px !important' }, 'p': { 'font-family': "'EB Garamond', Georgia, serif !important", 'line-height': '1.75 !important' } }); rendition.themes.select('lit'); rendition.themes.fontSize(fontPx + 'px') } catch {}
    if ((notesRef.current || []).length) { epubHlRef.current = false; applyEpubNotes() }
    rendition.on('selected', (cfiRange) => {
      try { rendition.book.getRange(cfiRange).then(r => { const t = (r && r.toString() || '').trim(); if (t) setSel(t.slice(0, 1500)) }).catch(() => {}) } catch {}
    })
  }
  const setChap = (i) => { const n = Math.max(0, Math.min(chapters.length - 1, i)); setChapIdx(n); setShowChaps(false); if (bookKey) { const p = loadProg(); p[bookKey] = { chap: n, title }; saveProg(p) } }
  const onTxtSelect = () => { try { const t = (window.getSelection().toString() || '').trim(); if (t) setSel(t.slice(0, 1500)) } catch {} }

  const visibleText = () => {
    if (mode === 'txt') return (chapters[chapIdx] && chapters[chapIdx].text || '').slice(0, 3500)
    try { const c = renditionRef.current && renditionRef.current.getContents(); const doc = c && c[0] && c[0].document; return doc ? (doc.body.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 3500) : '' } catch { return '' }
  }

  const ask = async (question, excerpt) => {
    if (!question.trim() || busy) return
    setPanelOpen(true)
    setMsgs(m => [...m, { from: 'me', text: question }])
    const echoId = 'e' + Date.now()
    setMsgs(m => [...m, { from: 'echo', text: '', id: echoId, streaming: true }])
    setBusy(true)
    try {
      await api.bookDiscuss({ title, key: bookKey, excerpt: excerpt || sel || visibleText(), question, history: msgs.slice(-8) }, {
        onDelta: (t) => setMsgs(m => m.map(x => x.id === echoId ? { ...x, text: x.text + t } : x))
      })
    } catch (e) {
      setMsgs(m => m.map(x => x.id === echoId ? { ...x, text: '（连接出了点问题：' + e.message + '）' } : x))
    } finally {
      setBusy(false)
      setMsgs(m => m.map(x => x.id === echoId ? { ...x, streaming: false } : x))
    }
  }
  const askSelection = () => { const s = sel; setSel(''); ask('这段你怎么看？\n\n「' + s.slice(0, 140) + (s.length > 140 ? '…' : '') + '」', s) }
  const askChapter = () => ask('说说你对这一段的感想吧～', visibleText())
  const copyNote = async (t) => { try { await navigator.clipboard.writeText(t) } catch {}; setSavedMsg('copy'); setTimeout(() => setSavedMsg(''), 1500) }
  const saveNote = (n) => { try { const arr = JSON.parse(localStorage.getItem('ws_saved_notes') || '[]'); arr.unshift({ book: title, quote: n.quote, thought: n.thought, ts: Date.now() }); localStorage.setItem('ws_saved_notes', JSON.stringify(arr.slice(0, 200))) } catch {}; setSavedMsg('save'); setTimeout(() => setSavedMsg(''), 1500) }
  const send = () => { const q = draft.trim(); if (!q) return; setDraft(''); ask(q, sel || visibleText()) }

  const opened = mode === 'epub' ? !!data : mode === 'txt' ? chapters.length > 0 : false

  return (
    <div className="book-reader">
      <input ref={fileRef} type="file" accept=".epub,.txt" style={{ display: 'none' }} onChange={onPick} />
      {opened && (
        <header className="rt-rhead">
          <button className="rt-ricon" onClick={onClose} aria-label="返回">‹</button>
          <div className="rt-rtitle">
            <span className="rt-rt-name">{(mode === 'txt' ? cleanTitle(title).title : title) || '一起看书'}</span>
            {mode === 'txt' && cleanTitle(title).author && <span className="rt-rt-auth">{cleanTitle(title).author}</span>}
          </div>
          <div className="rt-ractions">
            <button className="rt-rbtn" onClick={() => setShowAa(s => !s)}>Aa</button>
            {mode === 'txt' && <button className="rt-rbtn" onClick={() => setShowChaps(s => !s)}>Contents</button>}
            <button className="rt-rbtn" onClick={reset}>Switch</button>
            {notes.length === 0 && (prereadJob && prereadJob.status === 'running'
              ? <span className="rt-rbtn rt-read-pill">📖 {prereadJob.progress}/{prereadJob.total || '…'}</span>
              : <button className="rt-rbtn rt-read-ahead" onClick={startPreread}>✦ Echo First</button>)}
            <button className={'rt-rbtn rt-echo-btn' + (panelOpen ? ' on' : '')} onClick={() => setPanelOpen(o => !o)}>✦ Echo</button>
          </div>
          {showAa && <div className="rt-aa"><button onClick={() => setFontPx(p => Math.max(14, p - 1))}>A−</button><span>{fontPx}</span><button onClick={() => setFontPx(p => Math.min(28, p + 2))}>A+</button></div>}
        </header>
      )}

      <div className="br-stage">
        {loadingBook && <div className="br-downloading">正在下载《{loadingBook}》…<br /><span>第一次会慢一点</span></div>}

        {mode === 'epub' && data && (
          <div className="br-reader">
            <ReactReader url={data} title={title} location={loc} locationChanged={onLoc} getRendition={getRendition} epubOptions={{ flow: 'paginated' }} />
          </div>
        )}

        {mode === 'txt' && chapters.length > 0 && (
          <div className="br-txt-wrap">
            <div className="br-txt" ref={txtRef} onMouseUp={onTxtSelect} onTouchEnd={onTxtSelect} style={{ '--read-fp': fontPx + 'px' }}>
              <div className="rt-sprig">❧</div>
              <h3 className="br-txt-chtitle">{chapters[chapIdx].title}</h3>
              {renderChapterBody()}
              <div className="rt-pagebar"><span className="rt-rule" /><span className="rt-diamond">◇</span><span className="rt-rule" /></div>
              <div className="rt-pagenum">{chapIdx + 1} of {chapters.length}</div>
              <div className="br-txt-nav">
                <button onClick={() => setChap(chapIdx - 1)} disabled={chapIdx <= 0}>← 上一章</button>
                <span>{chapIdx + 1} / {chapters.length}</span>
                <button onClick={() => setChap(chapIdx + 1)} disabled={chapIdx >= chapters.length - 1}>下一章 →</button>
              </div>
            </div>
            {showChaps && (
              <div className="br-chaps" onClick={() => setShowChaps(false)}>
                <div className="br-chaps-list" onClick={e => e.stopPropagation()}>
                  {chapters.map((c, i) => <button key={i} className={'br-chap-item' + (i === chapIdx ? ' on' : '')} onClick={() => setChap(i)}>{c.title}</button>)}
                </div>
              </div>
            )}
          </div>
        )}

        {!opened && !loadingBook && (
          <div className="rt-pick">
            <div className="rt-top"><button className="rt-back" onClick={onClose} aria-label="返回">‹</button><h1 className="rt-brand">Read Together</h1><button className="rt-back ghost">‹</button></div>
            <div className="rt-hero">
              <div className="rt-book-ico">📖</div>
              <h2 className="rt-title">Find a book,<br />read with Echo</h2>
              <button className="rt-upload" onClick={() => fileRef.current.click()}><span className="rt-upload-ic">☁</span> Upload a book</button>
              <div className="rt-upload-sub">PDF · EPUB · TXT — up to 50MB</div>
            </div>
            <div className="rt-cats">
              {['All', 'Fiction', 'Non-Fiction', 'Essays', 'Poetry'].map(c => (
                <button key={c} className={'rt-cat' + (cat === c ? ' on' : '')} onClick={() => setCat(c)}>{c}</button>
              ))}
            </div>
            <div className="rt-searchbar">
              <span className="rt-search-ic">⌕</span>
              <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && doSearch()} placeholder="Search by title, author, or topic" disabled={searching} />
              <button className="rt-browse" onClick={doSearch} disabled={searching}>{searching ? '…' : (query.trim() ? 'Search' : 'Browse')}</button>
            </div>
            <div className="rt-lang">
              <button className={lang === 'zh' ? 'on' : ''} onClick={() => { setLang('zh'); setResults(null) }}>中文经典</button>
              <button className={lang === 'en' ? 'on' : ''} onClick={() => { setLang('en'); setResults(null) }}>English</button>
            </div>

            {searchErr && <div className="rt-tip err">{searchErr}</div>}
            {searching && <div className="rt-tip">翻书架中…（古登堡有点慢）</div>}
            {results && results.length === 0 && !searching && <div className="rt-tip">没搜到，换个词试试～</div>}
            {results && results.length > 0 && (
              <div className="rt-results">
                {results.map(b => (
                  <button key={b.id} className="rt-result" onClick={() => loadBook(b)} disabled={!!loadingBook}>
                    {b.cover ? <img src={b.cover} alt="" /> : <span className="noimg">📖</span>}
                    <span className="rt-result-info"><b>{b.title}</b><i>{b.author}{b.lang ? ' · ' + b.lang : ''}</i></span>
                  </button>
                ))}
              </div>
            )}

            {!results && !searching && (
              <div className="rt-section">
                <div className="rt-sec-head"><h3>Shelf Picks</h3><span className="rt-sec-sub">Your shelf, and a few for quiet minds.</span></div>
                <div className="rt-picks">
                  {(() => {
                    const map = {}
                    shelf.forEach(b => { map[b.key] = { ...b, local: true } })
                    cloud.forEach(b => { if (map[b.key]) map[b.key].cloud = true; else map[b.key] = { ...b, cloud: true } })
                    const mine = Object.values(map).sort((a, b) => (b.ts || 0) - (a.ts || 0)).map(b => { const m = cleanTitle(b.title); return { ...b, dispT: m.title, dispA: m.author, tint: tintFor(b.key), mine: true } })
                    const picks = SHELF_PICKS.map(p => ({ ...p, dispT: p.title, dispA: p.author, mine: false }))
                    return [...mine, ...picks]
                  })().map((b) => (
                    <div key={b.key || ('pk' + b.id)} className="rt-pick-card" onClick={() => (b.mine ? openShelfBook(b) : loadBook(b))}>
                      <span className="rt-cover" style={{ background: b.tint }}>
                        <span className="rt-cover-title">{b.dispT}</span>
                        {b.mine && <button className="rt-cover-del" onClick={(e) => delShelfBook(b.key, e)} aria-label="删除">✕</button>}
                      </span>
                      <span className="rt-pick-t">{b.dispT}</span>
                      {b.dispA && <span className="rt-pick-a">{b.dispA}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rt-foot"><span>❧</span> Always a page ahead of you, my love — so you never read alone.</div>
          </div>
        )}

        {sel && (
          <div className="br-selbar">
            <span className="br-sel-txt">「{sel.slice(0, 36)}{sel.length > 36 ? '…' : ''}」</span>
            <button className="br-sel-ask" onClick={askSelection}>问 Echo 这段</button>
            <button className="br-sel-x" onClick={() => setSel('')}>✕</button>
          </div>
        )}

        {popNote && (
          <div className="rt-echo-card">
            <span className="rt-echo-ribbon" />
            <div className="rt-echo-top"><span className="rt-echo-mark">✦ Echo</span><button className="rt-echo-x" onClick={() => setPopNote(null)}>✕</button></div>
            <div className="rt-echo-text">{popNote.thought}</div>
            <div className="rt-echo-acts">
              <button onClick={() => { setPanelOpen(true); setPopNote(null) }}>◌ Ask Echo</button>
              <button onClick={() => copyNote(popNote.thought)}>{savedMsg === 'copy' ? '✓ Copied' : '⧉ Copy'}</button>
              <button onClick={() => saveNote(popNote)}>{savedMsg === 'save' ? '✓ Saved' : '☆ Save'}</button>
            </div>
          </div>
        )}
        {panelOpen && (
          <aside className="br-chat">
            <div className="br-chat-head"><span>Read with Echo</span><button onClick={() => setPanelOpen(false)} aria-label="收起">▾</button></div>
            <div className="br-chat-msgs">
              {msgs.length === 0 && <div className="br-chat-empty">老公读过整本书了，选中一段问我、或直接聊～</div>}
              {msgs.map((m, i) => (
                <div key={m.id || i} className={'br-msg ' + (m.from === 'me' ? 'me' : 'echo')}><div className="br-bubble">{m.text || (m.streaming ? '…' : '')}</div></div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="br-chat-input">
              <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder={busy ? 'Echo 在想…' : '聊聊这本书…'} disabled={busy} />
              <button onClick={send} disabled={busy || !draft.trim()}>Send</button>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}

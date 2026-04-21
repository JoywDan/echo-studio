import React, { useEffect, useRef } from 'react'
import { buildRoomA3 } from './roomA3'
import './RoomV3.css'

/**
 * RoomV3 — renders the Claude-Design v3 SVG room and wires each marked
 * station/decor group to the parent via onStationClick / onDecorClick.
 *
 * Inside roomA3.js every functional station's outermost <g> carries:
 *   class="room-hit room-station" data-station="<stationId>"
 * Decor items (coffee mug, sticky note) carry:
 *   class="room-hit room-decor" data-decor="ph-cup" | "ph-sticky"
 *
 * We inject the SVG once, then use event delegation so React state like
 * `revealedStation` still drives the visible reveal ring without having
 * to re-render the 46KB SVG on every click.
 */
export default function RoomV3({
  stations = [],
  revealedStation,
  onStationClick,
  onDecorClick,
  hasBrowseNew = false,
  children,
}) {
  const hostRef = useRef(null)

  // Inject SVG once (the SVG is pure, no React state)
  useEffect(() => {
    if (!hostRef.current) return
    hostRef.current.innerHTML = buildRoomA3()
  }, [])

  // Delegated click handler
  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const handler = (ev) => {
      const el = ev.target.closest('[data-station], [data-decor]')
      if (!el || !host.contains(el)) return
      const stationId = el.getAttribute('data-station')
      const decorId = el.getAttribute('data-decor')
      if (stationId) {
        onStationClick?.(stationId)
        return
      }
      if (decorId) {
        onDecorClick?.(decorId)
      }
    }
    const keyHandler = (ev) => {
      if (ev.key !== 'Enter' && ev.key !== ' ') return
      const el = ev.target.closest('[data-station], [data-decor]')
      if (!el || !host.contains(el)) return
      ev.preventDefault()
      const stationId = el.getAttribute('data-station')
      const decorId = el.getAttribute('data-decor')
      if (stationId) onStationClick?.(stationId)
      else if (decorId) onDecorClick?.(decorId)
    }
    host.addEventListener('click', handler)
    host.addEventListener('keydown', keyHandler)
    return () => {
      host.removeEventListener('click', handler)
      host.removeEventListener('keydown', keyHandler)
    }
  }, [onStationClick, onDecorClick])

  // Reflect `revealedStation` onto the DOM so CSS can highlight it.
  // (Used on touch devices that can't hover.)
  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    host.querySelectorAll('[data-station]').forEach(el => {
      if (el.getAttribute('data-station') === revealedStation) {
        el.classList.add('is-revealed')
      } else {
        el.classList.remove('is-revealed')
      }
    })
  }, [revealedStation])

  // Set accessible labels from stations prop (once stations are known)
  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    stations.forEach(s => {
      const el = host.querySelector(`[data-station="${s.id}"]`)
      if (el) {
        el.setAttribute('aria-label', `${s.name} · ${s.detail}`)
      }
    })
    const sticky = host.querySelector('[data-decor="ph-sticky"]')
    if (sticky) sticky.setAttribute('aria-label', '老公的窗台便签')
    const cup = host.querySelector('[data-decor="ph-cup"]')
    if (cup) cup.setAttribute('aria-label', '咖啡杯（快捷操作，敬请期待）')
  }, [stations])

  // Toggle a "has-new" badge on sticky-note to signal Browse has unread
  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const sticky = host.querySelector('[data-decor="ph-sticky"]')
    if (!sticky) return
    sticky.classList.toggle('has-new', !!hasBrowseNew)
  }, [hasBrowseNew])

  return (
    <div className="room-v3">
      <div className="room-v3-stage" ref={hostRef} />
      {children}
    </div>
  )
}

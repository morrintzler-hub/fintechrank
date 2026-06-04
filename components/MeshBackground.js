'use client'
import { useEffect, useRef, useState } from 'react'

// Seeded random — no hydration mismatch
function sr(seed) {
  let s = seed * 9301 + 49297
  return function() {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

export default function MeshBackground() {
  const ref = useRef(null)
  const [size, setSize] = useState({ w: 1400, h: 560 })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const update = () => {
      const el = ref.current
      if (el) setSize({ w: el.offsetWidth, h: el.offsetHeight })
      setReady(true)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const { w, h } = size
  const rand = sr(37)

  // Sparse organic nodes — not a grid
  const nodeCount = Math.min(40, Math.floor(w / 35))
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    id: i,
    x: rand() * w,
    y: rand() * h,
    r: rand() * 1.5 + 0.5,
  }))

  // Connect close pairs with very faint lines
  const lines = []
  const maxD = w * 0.18
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x
      const dy = nodes[i].y - nodes[j].y
      const d = Math.sqrt(dx * dx + dy * dy)
      if (d < maxD && lines.length < 80) {
        lines.push({ id: `${i}-${j}`, x1: nodes[i].x, y1: nodes[i].y, x2: nodes[j].x, y2: nodes[j].y, op: (1 - d / maxD) * 0.08 })
      }
    }
  }

  // Gentle organic pulse paths — bezier curves, not straight lines
  const pulseCount = Math.min(8, Math.floor(w / 180))
  const pulses = Array.from({ length: pulseCount }, (_, i) => {
    const r2 = sr(i * 71 + 13)
    const x1 = r2() * w * 1.2 - w * 0.1
    const y1 = r2() * h
    const x2 = x1 + w * (0.3 + r2() * 0.4) * (r2() > 0.5 ? 1 : -1)
    const y2 = y1 + (r2() - 0.5) * h * 0.4
    const cx1 = x1 + (x2 - x1) * 0.3 + (r2() - 0.5) * 120
    const cy1 = y1 + (r2() - 0.5) * 100
    return { id: i, d: `M${x1},${y1} C${cx1},${cy1} ${cx1},${cy1} ${x2},${y2}`, dur: 5 + r2() * 6, delay: r2() * 8, size: 2 + r2() * 1.5 }
  })

  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <style>{`
        @keyframes fp { 0%{offset-distance:0%;opacity:0} 10%{opacity:1} 85%{opacity:0.8} 100%{offset-distance:100%;opacity:0} }
        @keyframes nt { 0%,100%{opacity:0.15} 50%{opacity:0.45} }
        .fp { will-change:offset-distance,opacity; animation:fp var(--d) ease-in-out var(--dl) infinite; }
        .nt { will-change:opacity; animation:nt var(--nd) ease-in-out var(--ndl) infinite; }
      `}</style>
      {ready && (
        <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice">
          <defs>
            <filter id="fb">
              <feGaussianBlur stdDeviation="2.5" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <linearGradient id="fv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0"/>
              <stop offset="15%" stopColor="white" stopOpacity="1"/>
              <stop offset="85%" stopColor="white" stopOpacity="1"/>
              <stop offset="100%" stopColor="white" stopOpacity="0"/>
            </linearGradient>
            <mask id="fm"><rect width="100%" height="100%" fill="url(#fv)"/></mask>
            {pulses.map(p => <path key={`pd-${p.id}`} id={`pp-${p.id}`} d={p.d} fill="none"/>)}
          </defs>
          <g mask="url(#fm)">
            {lines.map(l => <line key={l.id} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#94a3b8" strokeWidth="0.5" opacity={l.op}/>)}
            {nodes.map((n, i) => (
              <circle key={n.id} cx={n.x} cy={n.y} r={n.r} fill="#94a3b8" className="nt"
                style={{ '--nd': `${5 + (i % 9)}s`, '--ndl': `${(i % 13) * 0.3}s`, opacity: 0.15 }}/>
            ))}
            {pulses.map(p => (
              <circle key={p.id} r={p.size} fill="#38bdf8" filter="url(#fb)" className="fp"
                style={{ '--d': `${p.dur}s`, '--dl': `${p.delay}s`, offsetPath: `path('${p.d}')`, offsetRotate: '0deg' }}/>
            ))}
          </g>
        </svg>
      )}
    </div>
  )
}

'use client'
import { useEffect, useRef, useState } from 'react'

function sr(seed) {
  let s = seed * 9301 + 49297
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
}

export default function MeshBackground() {
  const ref = useRef(null)
  const [w, setW] = useState(1400)
  const [h, setH] = useState(560)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const update = () => {
      setW(window.innerWidth)
      setH(ref.current?.offsetHeight || 560)
      setReady(true)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const rand = sr(42)

  // Nodes — sparse, organic, extends beyond edges
  const nodes = Array.from({ length: 55 }, (_, i) => ({
    id: i,
    x: (rand() * 1.3 - 0.15) * w,
    y: rand() * h,
    r: rand() * 1.8 + 0.6,
    op: rand() * 0.3 + 0.1,
    nd: `${5 + Math.floor(rand() * 9)}s`,
    ndl: `${(rand() * 8).toFixed(1)}s`,
  }))

  // Connections — very faint
  const lines = []
  const maxD = w * 0.16
  for (let i = 0; i < nodes.length && lines.length < 100; i++) {
    for (let j = i + 1; j < nodes.length && lines.length < 100; j++) {
      const dx = nodes[i].x - nodes[j].x
      const dy = nodes[i].y - nodes[j].y
      const d = Math.sqrt(dx * dx + dy * dy)
      if (d < maxD) {
        lines.push({
          id: `${i}-${j}`,
          x1: nodes[i].x, y1: nodes[i].y,
          x2: nodes[j].x, y2: nodes[j].y,
          op: (1 - d / maxD) * 0.07,
        })
      }
    }
  }

  // Pulses — gentle organic bezier curves
  const pulseCount = Math.max(6, Math.floor(w / 160))
  const pulses = Array.from({ length: pulseCount }, (_, i) => {
    const r2 = sr(i * 137 + 31)
    const x1 = r2() * w * 1.4 - w * 0.2
    const y1 = r2() * h * 1.2 - h * 0.1
    const travelX = w * (0.25 + r2() * 0.45) * (r2() > 0.5 ? 1 : -1)
    const travelY = (r2() - 0.5) * h * 0.5
    const x2 = x1 + travelX
    const y2 = y1 + travelY
    // Organic bezier control point
    const cpx = (x1 + x2) / 2 + (r2() - 0.5) * 200
    const cpy = (y1 + y2) / 2 + (r2() - 0.5) * 150
    return {
      id: i,
      d: `M${x1.toFixed(0)},${y1.toFixed(0)} Q${cpx.toFixed(0)},${cpy.toFixed(0)} ${x2.toFixed(0)},${y2.toFixed(0)}`,
      dur: `${4 + r2() * 5}s`,
      delay: `${r2() * 10}s`,
      size: 2 + r2() * 2,
    }
  })

  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <style>{`
        @keyframes fp { 0%{offset-distance:0%;opacity:0} 8%{opacity:.9} 88%{opacity:.7} 100%{offset-distance:100%;opacity:0} }
        @keyframes nt { 0%,100%{opacity:var(--op)} 50%{opacity:calc(var(--op)*2.5)} }
        .fp{will-change:offset-distance,opacity;animation:fp var(--d) ease-in-out var(--dl) infinite}
        .nt{will-change:opacity;animation:nt var(--nd) ease-in-out var(--ndl) infinite}
      `}</style>
      {ready && (
        <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice">
          <defs>
            <filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="3" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <linearGradient id="fademask" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0"/>
              <stop offset="10%" stopColor="white" stopOpacity="1"/>
              <stop offset="90%" stopColor="white" stopOpacity="1"/>
              <stop offset="100%" stopColor="white" stopOpacity="0"/>
            </linearGradient>
            <mask id="vm"><rect width="100%" height="100%" fill="url(#fademask)"/></mask>
          </defs>
          <g mask="url(#vm)">
            {lines.map(l => (
              <line key={l.id} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                stroke="#64748b" strokeWidth="0.5" opacity={l.op}/>
            ))}
            {nodes.map(n => (
              <circle key={n.id} cx={n.x} cy={n.y} r={n.r} fill="#94a3b8"
                className="nt" style={{'--op':n.op,'--nd':n.nd,'--ndl':n.ndl,opacity:n.op}}/>
            ))}
            {pulses.map(p => (
              <circle key={p.id} r={p.size} fill="#009e80" filter="url(#glow)"
                className="fp" style={{
                  '--d': p.dur, '--dl': p.delay,
                  offsetPath: `path('${p.d}')`,
                  offsetRotate: '0deg',
                }}/>
            ))}
          </g>
        </svg>
      )}
    </div>
  )
}

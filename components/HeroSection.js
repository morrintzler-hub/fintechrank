'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

// ─── Seeded deterministic random (no hydration mismatch) ───────────────────
function seeded(seed) {
  let s = seed
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
}

// ─── Generate static mesh data once ────────────────────────────────────────
function buildMesh(W, H) {
  const rand = seeded(42)
  const NODE_COUNT = 60
  const nodes = Array.from({ length: NODE_COUNT }, (_, i) => ({
    id: i,
    ox: rand() * W,          // original x
    oy: rand() * H * 0.9 + H * 0.05,
    x: 0, y: 0,              // current (animated) position
    vx: 0, vy: 0,            // velocity
    r: rand() * 2 + 1,
    baseOp: rand() * 0.25 + 0.08,
  }))
  nodes.forEach(n => { n.x = n.ox; n.y = n.oy })

  const MAX_DIST = Math.min(W * 0.18, 220)
  const edges = []
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].ox - nodes[j].ox
      const dy = nodes[i].oy - nodes[j].oy
      const d = Math.sqrt(dx * dx + dy * dy)
      if (d < MAX_DIST && edges.length < 120) {
        edges.push({ i, j, baseOp: (1 - d / MAX_DIST) * 0.12 })
      }
    }
  }

  const PULSE_COUNT = Math.max(8, Math.floor(W / 140))
  const pulses = Array.from({ length: PULSE_COUNT }, (_, i) => {
    const r2 = seeded(i * 173 + 11)
    const startNode = nodes[Math.floor(r2() * nodes.length)]
    const endNode   = nodes[Math.floor(r2() * nodes.length)]
    const cpx = (startNode.ox + endNode.ox) / 2 + (r2() - 0.5) * 300
    const cpy = (startNode.oy + endNode.oy) / 2 + (r2() - 0.5) * 200
    return {
      id: i,
      x1: startNode.ox, y1: startNode.oy,
      x2: endNode.ox,   y2: endNode.oy,
      cpx, cpy,
      dur: 4 + r2() * 5,
      delay: r2() * 12,
      size: 2.5 + r2() * 1.5,
    }
  })

  return { nodes, edges, pulses }
}

// ─── Main component ─────────────────────────────────────────────────────────
export default function HeroSection({
  search, setSearch, onSearch,
  counts = {},
  pills = [],
  pillFilter, setPillFilter,
  setVisible,
}) {
  const svgRef   = useRef(null)
  const rafRef   = useRef(null)
  const mouse    = useRef({ x: -9999, y: -9999 })
  const meshRef  = useRef(null)
  const tickRef  = useRef(0)
  const [dim, setDim]         = useState({ w: 1400, h: 520 })
  const [frame, setFrame]     = useState(0)
  const [mounted, setMounted] = useState(false)
  const [focused, setFocused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const h = (e) => setReducedMotion(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])

  // Measure container
  useEffect(() => {
    const update = () => {
      const el = svgRef.current?.parentElement
      if (!el) return
      const w = el.offsetWidth
      const h = Math.max(480, Math.min(620, window.innerHeight * 0.68))
      setDim({ w, h })
      meshRef.current = buildMesh(w, h)
      setMounted(true)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Mouse tracking
  const onMouseMove = useCallback((e) => {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return
    mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }, [])

  // Physics animation loop
  useEffect(() => {
    if (!mounted || reducedMotion) return
    const mesh = meshRef.current
    if (!mesh) return

    const MOUSE_RADIUS  = 120
    const MOUSE_FORCE   = 0.018
    const RETURN_FORCE  = 0.04
    const DAMPING       = 0.82

    const tick = () => {
      const mx = mouse.current.x
      const my = mouse.current.y

      mesh.nodes.forEach(n => {
        const dx = n.x - mx
        const dy = n.y - my
        const d  = Math.sqrt(dx * dx + dy * dy)

        // Mouse repulsion
        if (d < MOUSE_RADIUS && d > 0) {
          const f = (1 - d / MOUSE_RADIUS) * MOUSE_FORCE
          n.vx += (dx / d) * f * 60
          n.vy += (dy / d) * f * 60
        }

        // Spring back to origin
        n.vx += (n.ox - n.x) * RETURN_FORCE
        n.vy += (n.oy - n.y) * RETURN_FORCE

        // Dampen
        n.vx *= DAMPING
        n.vy *= DAMPING

        n.x += n.vx
        n.y += n.vy
      })

      tickRef.current++
      setFrame(tickRef.current)
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [mounted, reducedMotion])

  const mesh = meshRef.current
  const { w, h } = dim

  const METRICS = [
    { value: `${counts.all || 100}+`, label: 'Companies' },
    { value: '6',       label: 'Categories' },
    { value: '48',      label: 'Features tracked' },
    { value: 'Live',    label: 'Community updates' },
  ]

  return (
    <header style={{ position: 'relative', background: '#ffffff', overflow: 'hidden', minHeight: h }}>

      {/* ── Live SVG mesh ── */}
      <div
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
        onMouseMove={onMouseMove}
      >
        <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="xMidYMid slice"
          style={{ display: 'block', willChange: 'transform' }}
        >
          <defs>
            <filter id="hs-bloom" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3.5" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <radialGradient id="hs-fade" cx="50%" cy="50%" r="55%">
              <stop offset="0%"   stopColor="white" stopOpacity="0"/>
              <stop offset="100%" stopColor="white" stopOpacity="1"/>
            </radialGradient>
            <mask id="hs-mask">
              <rect width="100%" height="100%" fill="white"/>
              <rect width="100%" height="100%" fill="url(#hs-fade)" style={{mixBlendMode:'multiply'}}/>
            </mask>
          </defs>

          <g mask="url(#hs-mask)">
            {/* Edges */}
            {mesh && mesh.edges.map(e => {
              const a = mesh.nodes[e.i]
              const b = mesh.nodes[e.j]
              return (
                <line key={`e${e.i}-${e.j}`}
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke="#e2e8f0" strokeWidth="0.7" opacity={e.baseOp}/>
              )
            })}

            {/* Nodes */}
            {mesh && mesh.nodes.map(n => {
              const dx = n.x - mouse.current.x
              const dy = n.y - mouse.current.y
              const near = Math.sqrt(dx * dx + dy * dy) < 100
              return (
                <circle key={`n${n.id}`}
                  cx={n.x} cy={n.y} r={near ? n.r * 2.2 : n.r}
                  fill={near ? '#38bdf8' : '#94a3b8'}
                  opacity={near ? 0.7 : n.baseOp}
                  style={{ transition: 'r 0.3s, fill 0.3s, opacity 0.3s' }}
                />
              )
            })}

            {/* Pulse animations */}
            {mesh && !reducedMotion && mesh.pulses.map(p => (
              <g key={`p${p.id}`}>
                <path id={`hs-pp-${p.id}`}
                  d={`M${p.x1},${p.y1} Q${p.cpx},${p.cpy} ${p.x2},${p.y2}`}
                  fill="none" stroke="none"/>
                <circle r={p.size} fill="#38bdf8" filter="url(#hs-bloom)"
                  style={{
                    offsetPath: `path('M${p.x1},${p.y1} Q${p.cpx},${p.cpy} ${p.x2},${p.y2}')`,
                    offsetRotate: '0deg',
                    willChange: 'offset-distance, opacity',
                    animation: `hs-pulse ${p.dur}s ease-in-out ${p.delay}s infinite`,
                  }}
                />
              </g>
            ))}
          </g>

          <style>{`
            @keyframes hs-pulse {
              0%   { offset-distance: 0%;   opacity: 0; }
              8%   { opacity: 0.9; }
              88%  { opacity: 0.7; }
              100% { offset-distance: 100%; opacity: 0; }
            }
          `}</style>
        </svg>
      </div>

      {/* ── Content overlay ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: h, padding: '60px 24px 48px',
        textAlign: 'center',
      }}>

        {/* Eyebrow */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontSize: 11, fontWeight: 600, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: '#64748b',
          border: '1px solid #e2e8f0', borderRadius: 100,
          padding: '6px 16px', marginBottom: 28,
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(8px)',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8' }}/>
          Independent Fintech Research
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'Manrope, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(2.6rem, 6vw, 5rem)',
          lineHeight: 1.06,
          letterSpacing: '-0.04em',
          color: '#0f172a',
          marginBottom: 12,
          maxWidth: 820,
        }}>
          Compare the world's<br/>
          <span style={{ color: '#009e80' }}>top 100 fintech</span>{' '}
          <span style={{ fontWeight: 300, color: '#94a3b8' }}>companies</span>
        </h1>

        {/* Subheading */}
        <p style={{
          fontFamily: 'Manrope, sans-serif',
          fontWeight: 400,
          fontSize: 'clamp(15px, 1.8vw, 18px)',
          color: '#64748b',
          lineHeight: 1.7,
          maxWidth: 520,
          marginBottom: 36,
        }}>
          Unbiased ratings, verified pricing, and side-by-side comparisons.
          Updated in real time by our community.
        </p>

        {/* Metrics row */}
        <div style={{
          display: 'flex',
          alignItems: 'stretch',
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(226,232,240,0.8)',
          borderRadius: 14,
          marginBottom: 24,
          overflow: 'hidden',
          boxShadow: '0 4px 24px -4px rgba(0,0,0,0.06)',
        }}>
          {METRICS.map((m, i) => (
            <div key={i} style={{
              padding: '16px 28px',
              borderRight: i < METRICS.length - 1 ? '1px solid #f1f5f9' : 'none',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 2,
            }}>
              <div style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(18px, 2.5vw, 26px)',
                color: '#0f172a',
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}>
                {m.value}
              </div>
              <div style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 400,
                fontSize: 11,
                color: '#94a3b8',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Glassmorphism search bar */}
        <div style={{
          width: '100%', maxWidth: 560,
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(16px)',
          border: `1px solid ${focused ? 'rgba(56,189,248,0.5)' : 'rgba(226,232,240,0.9)'}`,
          borderRadius: 14,
          boxShadow: focused
            ? '0 0 0 4px rgba(56,189,248,0.1), 0 8px 32px -4px rgba(0,0,0,0.1)'
            : '0 8px 32px -4px rgba(0,0,0,0.08)',
          display: 'flex', alignItems: 'center',
          padding: '4px 4px 4px 20px',
          gap: 8,
          transition: 'border-color 0.2s, box-shadow 0.2s',
          marginBottom: 16,
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="8" cy="8" r="5.5" stroke="#94a3b8" strokeWidth="1.5"/>
            <path d="M12.5 12.5L16 16" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search company, feature, or use case..."
            style={{
              flex: 1,
              padding: '12px 0',
              fontSize: 15,
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 400,
              color: '#0f172a',
              background: 'transparent',
              border: 'none',
              outline: 'none',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{
              background: 'none', border: 'none', color: '#94a3b8',
              cursor: 'pointer', fontSize: 18, padding: '0 8px', lineHeight: 1,
            }}>×</button>
          )}
          <button
            onClick={() => onSearch && onSearch(search)}
            style={{
              flexShrink: 0,
              padding: '10px 20px',
              borderRadius: 10,
              border: 'none',
              background: '#009e80',
              color: '#ffffff',
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.target.style.opacity = '0.88'}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >
            Search
          </button>
        </div>

        {/* Quick filter pills */}
        {pills.length > 0 && (
          <div style={{
            display: 'flex', gap: 8, flexWrap: 'wrap',
            justifyContent: 'center', maxWidth: 560,
          }}>
            {pills.map((pill, i) => {
              const active = pillFilter && pillFilter.value === pill.value
              return (
                <button key={i} onClick={() => {
                  setPillFilter(active ? null : pill)
                  setSearch('')
                  setVisible && setVisible(20)
                }} style={{
                  fontSize: 12, fontWeight: active ? 600 : 400,
                  padding: '5px 14px', borderRadius: 100,
                  border: `1px solid ${active ? '#009e80' : '#e2e8f0'}`,
                  background: active ? 'rgba(0,158,128,0.08)' : 'rgba(255,255,255,0.8)',
                  color: active ? '#009e80' : '#64748b',
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                  fontFamily: 'Manrope, sans-serif',
                  transition: 'all 0.15s',
                }}>
                  {pill.label || pill.value}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </header>
  )
}

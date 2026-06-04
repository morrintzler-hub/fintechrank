'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

const ACCENT = '#008489'
const ACCENT_LIGHT = 'rgba(0,132,137,0.15)'

export default function HeroSection({
  search, setSearch,
  counts = {},
  pills = [],
  pillFilter, setPillFilter,
  setVisible,
}) {
  const canvasRef  = useRef(null)
  const rafRef     = useRef(null)
  const mouseRef   = useRef({ x: -1000, y: -1000 })
  const partsRef   = useRef([])
  const [focused, setFocused] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
  }, [])

  // Canvas particle system — particles rise from bottom, connect when close
  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W, H, animId

    class Particle {
      reset() {
        this.x  = Math.random() * W
        this.y  = H + Math.random() * 150
        this.vx = (Math.random() - 0.5) * 0.4
        this.vy = -(Math.random() * 1.2 + 0.3)
        this.r  = Math.random() * 1.5 + 0.5
        this.a  = Math.random() * 0.35 + 0.08
      }
      constructor() { this.reset() }
      update() {
        // Mouse attraction
        const dx   = mouseRef.current.x - this.x
        const dy   = mouseRef.current.y - this.y
        const dist = Math.sqrt(dx*dx + dy*dy)
        if (dist < 150 && dist > 0) {
          const f = (150 - dist) / 150 * 0.018
          this.vx += dx * f
          this.vy += dy * f
        }
        this.x += this.vx
        this.y += this.vy
        if (this.y < -40) this.reset()
      }
      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,132,137,${this.a})`
        ctx.fill()
      }
    }

    function init() {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
      const count = Math.min(100, Math.floor(W / 12))
      partsRef.current = Array.from({ length: count }, () => new Particle())
    }

    function drawLines() {
      ctx.lineWidth = 0.5
      const pts = partsRef.current
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const d  = Math.sqrt(dx*dx + dy*dy)
          if (d < 100) {
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(0,132,137,${0.18 * (1 - d/100)})`
            ctx.stroke()
          }
        }
      }
    }

    function loop() {
      ctx.clearRect(0, 0, W, H)
      partsRef.current.forEach(p => { p.update(); p.draw() })
      drawLines()
      animId = requestAnimationFrame(loop)
    }

    init()
    loop()

    const onResize = () => init()
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [reduced])

  const onMouseMove = useCallback((e) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }, [])

  const METRICS = [
    { v: `${counts.all || 100}`, l: 'Companies' },
    { v: '6',    l: 'Categories' },
    { v: '48',   l: 'Features tracked' },
    { v: 'Live', l: 'Community updates' },
  ]

  return (
    <section
      onMouseMove={onMouseMove}
      style={{
        position: 'relative',
        minHeight: 'clamp(580px, 88vh, 780px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#f7f9fb',
        paddingTop: 80,
        paddingBottom: 60,
      }}
    >
      {/* Canvas background */}
      <canvas ref={canvasRef} style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        zIndex: 0, pointerEvents: 'none',
      }}/>

      {/* Radial gradient center glow */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(circle at 50% 50%, rgba(0,105,84,0.05) 0%, transparent 65%)',
      }}/>

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: 900,
        padding: '0 24px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center',
      }}>

        {/* Eyebrow pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(0,105,84,0.12)',
          borderRadius: 9999,
          padding: '6px 16px',
          marginBottom: 32,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: ACCENT,
            boxShadow: `0 0 0 3px rgba(0,132,137,0.2)`,
            animation: 'pulse-dot 2s ease infinite',
          }}/>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: '#565e74',
            fontFamily: 'Manrope, sans-serif',
          }}>
            Independent Fintech Research
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'Manrope, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
          lineHeight: 1.08,
          letterSpacing: '-0.03em',
          color: '#191c1e',
          marginBottom: 20,
          maxWidth: 800,
        }}>
          Compare the world's{' '}
          <span style={{ color: ACCENT }}>top 100 fintech</span>{' '}
          <span style={{ fontWeight: 400, color: '#6d7a74' }}>companies</span>
        </h1>

        {/* Subheading */}
        <p style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: 'clamp(15px, 1.8vw, 18px)',
          fontWeight: 400,
          color: '#3d4945',
          lineHeight: 1.7,
          maxWidth: 560,
          marginBottom: 40,
        }}>
          Unbiased ratings, verified pricing, and side-by-side feature comparisons.
          Updated in real time by our community.
        </p>

        {/* Glassmorphism search */}
        <div style={{ width: '100%', maxWidth: 640, marginBottom: 20 }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${focused ? 'rgba(0,132,137,0.4)' : 'rgba(109,122,116,0.25)'}`,
            borderRadius: 14,
            boxShadow: focused
              ? `0 0 0 4px rgba(0,132,137,0.1), 0 8px 32px rgba(0,0,0,0.09)`
              : '0 8px 32px rgba(0,0,0,0.07)',
            padding: '4px 4px 4px 18px',
            gap: 8,
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{flexShrink:0}}>
              <circle cx="8" cy="8" r="5.5" stroke="#6d7a74" strokeWidth="1.5"/>
              <path d="M12.5 12.5L16 16" stroke="#6d7a74" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text" value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search company, feature, or use case..."
              style={{
                flex: 1, padding: '13px 0',
                fontSize: 15, fontFamily: 'Manrope, sans-serif',
                fontWeight: 400, color: '#191c1e',
                background: 'transparent', border: 'none', outline: 'none',
              }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#6d7a74', fontSize: 18, padding: '0 8px', lineHeight: 1,
              }}>×</button>
            )}
            <button style={{
              flexShrink: 0, padding: '11px 22px', borderRadius: 10,
              border: 'none', background: ACCENT,
              color: '#fff', fontFamily: 'Manrope, sans-serif',
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
              transition: 'opacity 0.15s',
            }}
              onMouseEnter={e => e.target.style.opacity = '0.88'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >
              Search
            </button>
          </div>

          {/* Filter pills */}
          {pills.length > 0 && (
            <div style={{
              display: 'flex', gap: 8, flexWrap: 'wrap',
              justifyContent: 'center', marginTop: 16,
            }}>
              {pills.map((pill, i) => {
                const active = pillFilter && pillFilter.value === pill.value
                return (
                  <button key={i} onClick={() => {
                    setPillFilter(active ? null : pill)
                    setSearch('')
                    setVisible && setVisible(20)
                  }} style={{
                    fontSize: 13, fontWeight: active ? 600 : 400,
                    padding: '6px 14px', borderRadius: 8,
                    border: `1px solid ${active ? ACCENT : 'rgba(188,202,195,0.6)'}`,
                    background: active ? ACCENT_LIGHT : 'rgba(255,255,255,0.85)',
                    color: active ? '#006954' : '#565e74',
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

        {/* Stats row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          width: '100%', maxWidth: 680,
          paddingTop: 32, marginTop: 12,
          borderTop: '1px solid rgba(188,202,195,0.3)',
        }}>
          {METRICS.map((m, i) => (
            <div key={i} style={{
              textAlign: 'center',
              padding: '0 16px',
              borderRight: i < 3 ? '1px solid rgba(188,202,195,0.3)' : 'none',
            }}>
              <div style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(20px, 2.5vw, 28px)',
                color: '#191c1e',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}>{m.v}</div>
              <div style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: 10, fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#6d7a74',
                marginTop: 5,
              }}>{m.l}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.4; transform:scale(0.75); }
        }
      `}</style>
    </section>
  )
}

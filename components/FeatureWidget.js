'use client'
import { useEffect, useRef, useState } from 'react'

export default function FeatureWidget({
  title, subtitle, description, href,
  color = '#38bdf8', delay = 0,
  tag, cta = 'Explore',
  number,
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => setVisible(true), delay * 1000); obs.unobserve(el) } },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(50px)',
      transition: `opacity 0.8s cubic-bezier(0.4,0,0.2,1) ${delay * 0.1}s, transform 0.8s cubic-bezier(0.4,0,0.2,1) ${delay * 0.1}s`,
    }}>
      <a href={href} style={{ textDecoration: 'none', display: 'block' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}>
        <div style={{
          background: '#ffffff',
          borderRadius: 20,
          padding: 'clamp(32px, 5vw, 56px)',
          boxShadow: hovered
            ? '0 32px 64px -12px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.04)'
            : '0 20px 40px -10px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          transition: 'box-shadow 0.4s ease, transform 0.4s ease',
          position: 'relative',
          overflow: 'hidden',
        }}>

          {/* Subtle top accent */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, ${color}80, ${color}20, transparent)`,
            transform: hovered ? 'scaleX(1)' : 'scaleX(0.4)',
            transformOrigin: 'left',
            transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
          }}/>

          {/* Large background number */}
          {number && (
            <div style={{
              position: 'absolute', top: -20, right: 40,
              fontSize: 'clamp(80px, 12vw, 160px)',
              fontWeight: 800,
              color: '#f1f5f9',
              lineHeight: 1,
              userSelect: 'none',
              pointerEvents: 'none',
              fontFamily: 'Manrope, sans-serif',
              letterSpacing: '-0.04em',
            }}>{number}</div>
          )}

          <div style={{ position: 'relative', maxWidth: 600 }}>

            {/* Tag */}
            {tag && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 11, fontWeight: 600, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: color,
                marginBottom: 20,
              }}>
                <div style={{ width: 20, height: 1.5, background: color }}/>
                {tag}
              </div>
            )}

            {/* Title */}
            <h3 style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(22px, 3.5vw, 36px)',
              color: '#0f172a',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: subtitle ? 8 : 20,
            }}>
              {title}
            </h3>

            {/* Subtitle */}
            {subtitle && (
              <div style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 500,
                fontSize: 'clamp(15px, 2vw, 19px)',
                color: '#64748b',
                marginBottom: 20,
                lineHeight: 1.4,
                letterSpacing: '-0.01em',
              }}>
                {subtitle}
              </div>
            )}

            {/* Description */}
            <p style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 400,
              fontSize: 'clamp(14px, 1.5vw, 16px)',
              color: '#94a3b8',
              lineHeight: 1.8,
              marginBottom: 32,
              maxWidth: 520,
            }}>
              {description}
            </p>

            {/* CTA */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              fontSize: 14, fontWeight: 600,
              color: hovered ? color : '#0f172a',
              fontFamily: 'Manrope, sans-serif',
              letterSpacing: '-0.01em',
              transition: 'color 0.25s',
            }}>
              {cta}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                style={{ transform: hovered ? 'translateX(4px)' : 'translateX(0)', transition: 'transform 0.25s' }}>
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </a>
    </div>
  )
}

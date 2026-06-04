'use client'
import { useEffect, useRef, useState } from 'react'

export default function FeatureWidget({
  title, subtitle, description, href,
  color = '#009e80', delay = 0,
  tag, cta = 'Explore',
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setVisible(true), delay * 80)
          obs.unobserve(el)
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.55s cubic-bezier(0.4,0,0.2,1)`,
    }}>
      <a href={href} style={{ textDecoration: 'none', display: 'block' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}>
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: 'clamp(28px, 4vw, 48px) clamp(28px, 5vw, 56px)',
          boxShadow: hovered
            ? '0 24px 48px -8px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)'
            : '0 4px 24px -4px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)',
          transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
          transition: 'box-shadow 0.3s ease, transform 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem',
        }}>

          {/* Left accent bar */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, bottom: 0,
            width: 3,
            background: color,
            borderRadius: '16px 0 0 16px',
            transform: hovered ? 'scaleY(1)' : 'scaleY(0.3)',
            transformOrigin: 'top',
            transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
          }}/>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0, paddingLeft: 8 }}>
            {tag && (
              <div style={{
                fontSize: 11, fontWeight: 600, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: color,
                marginBottom: 10,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <div style={{ width: 16, height: 1.5, background: color, borderRadius: 2 }}/>
                {tag}
              </div>
            )}

            <h3 style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(20px, 2.8vw, 30px)',
              color: '#0f172a',
              lineHeight: 1.18,
              letterSpacing: '-0.025em',
              marginBottom: subtitle ? 6 : 14,
            }}>
              {title}
            </h3>

            {subtitle && (
              <div style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 500,
                fontSize: 'clamp(14px, 1.6vw, 17px)',
                color: '#475569',
                marginBottom: 14,
                lineHeight: 1.45,
              }}>
                {subtitle}
              </div>
            )}

            <p style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 400,
              fontSize: 'clamp(13px, 1.3vw, 15px)',
              color: '#94a3b8',
              lineHeight: 1.75,
              maxWidth: 560,
              margin: 0,
            }}>
              {description}
            </p>
          </div>

          {/* Right CTA */}
          <div style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 14,
            fontWeight: 600,
            color: hovered ? color : '#cbd5e1',
            fontFamily: 'Manrope, sans-serif',
            transition: 'color 0.25s, transform 0.25s',
            transform: hovered ? 'translateX(4px)' : 'translateX(0)',
            whiteSpace: 'nowrap',
          }}>
            {cta}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3.5 9h11M10 5l4.5 4L10 13" stroke="currentColor"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </a>
    </div>
  )
}

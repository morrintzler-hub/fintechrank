'use client'
import { useEffect, useRef, useState } from 'react'

const ACCENT = '#008489'

export default function FeatureWidget({
  title, subtitle, description, href,
  delay = 0, tag, cta = 'Explore',
  extra, // optional JSX for micro-animations inside the card
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
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(28px)',
      transition: 'opacity 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.55s cubic-bezier(0.4,0,0.2,1)',
    }}>
      <a href={href} style={{ textDecoration: 'none', display: 'block' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}>
        <div style={{
          position: 'relative',
          padding: '40px 48px',
          borderRadius: 24,
          border: `1px solid ${hovered ? 'rgba(0,132,137,0.35)' : 'rgba(188,202,195,0.35)'}`,
          background: '#ffffff',
          transition: 'border-color 0.25s, transform 0.25s, box-shadow 0.25s',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
          boxShadow: hovered
            ? '0 12px 40px -8px rgba(0,0,0,0.1)'
            : '0 1px 4px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}>

          {/* Left accent bar — slides in on hover */}
          <div style={{
            position: 'absolute',
            left: 0, top: 0, bottom: 0,
            width: 4,
            background: ACCENT,
            borderRadius: '24px 0 0 24px',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.25s',
          }}/>

          {/* Layout: content left, CTA right */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 40,
            flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1, minWidth: 260 }}>

              {/* Tag */}
              {tag && (
                <div style={{
                  fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: ACCENT,
                  fontFamily: 'Manrope, sans-serif',
                  marginBottom: 16,
                }}>
                  {tag}
                </div>
              )}

              {/* Title */}
              <h3 style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(20px, 2.6vw, 28px)',
                color: '#191c1e',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                marginBottom: subtitle ? 8 : 14,
              }}>
                {title}
              </h3>

              {/* Subtitle */}
              {subtitle && (
                <p style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 600,
                  fontSize: 15,
                  color: '#191c1e',
                  marginBottom: 10,
                  lineHeight: 1.4,
                }}>
                  {subtitle}
                </p>
              )}

              {/* Extra micro-animation slot */}
              {extra}

              {/* Description */}
              <p style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 400,
                fontSize: 14,
                color: '#3d4945',
                lineHeight: 1.75,
                maxWidth: 540,
                margin: 0,
              }}>
                {description}
              </p>
            </div>

            {/* CTA */}
            <div style={{
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 14,
              fontWeight: 600,
              color: hovered ? ACCENT : '#6d7a74',
              fontFamily: 'Manrope, sans-serif',
              transition: 'color 0.2s, transform 0.2s',
              transform: hovered ? 'translateX(4px)' : 'translateX(0)',
              whiteSpace: 'nowrap',
            }}>
              {cta}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3.5 9h11M10 5l4.5 4L10 13"
                  stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </a>
    </div>
  )
}

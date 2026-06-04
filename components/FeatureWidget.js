'use client'
import { useEffect, useRef, useState } from 'react'

/**
 * FeatureWidget — self-contained navigational card with scroll-triggered
 * data-flow border animation. No external dependencies beyond React.
 *
 * Props:
 *   title       string   — card heading
 *   description string   — supporting text
 *   href        string   — navigation target
 *   icon        string   — emoji or character
 *   color       string   — accent color (default: '#009e80')
 *   delay       number   — stagger delay in seconds (default: 0)
 *   stat        string   — optional stat to display (e.g. "100 companies")
 *   statLabel   string   — label for the stat
 *   cta         string   — CTA label (default: 'Explore →')
 */
export default function FeatureWidget({
  title,
  description,
  href,
  icon,
  color = '#009e80',
  delay = 0,
  stat,
  statLabel,
  cta = 'Explore →',
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [pulseActive, setPulseActive] = useState(false)

  // Scroll-triggered entry animation
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay * 1000)
          observer.unobserve(el)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  // Trigger pulse on hover
  useEffect(() => {
    if (hovered) {
      setPulseActive(true)
      const t = setTimeout(() => setPulseActive(false), 800)
      return () => clearTimeout(t)
    }
  }, [hovered])

  // SVG border dimensions
  const W = 400
  const H = 200
  const perimeter = 2 * (W + H)

  return (
    <div ref={ref}>
      <style>{`
        @keyframes border-trace-${color.replace('#', '')} {
          0% { stroke-dashoffset: ${perimeter}; opacity: 1; }
          80% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: -${perimeter * 0.1}; opacity: 0; }
        }
        .widget-card-${color.replace('#', '')} {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.4,0,0.2,1);
        }
        .widget-card-${color.replace('#', '')}.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <a
        href={href}
        className={`widget-card-${color.replace('#', '')}${visible ? ' visible' : ''}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'block',
          position: 'relative',
          background: '#ffffff',
          borderRadius: 12,
          padding: '1.5rem',
          textDecoration: 'none',
          border: '1px solid #e8eaed',
          transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
          transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
          boxShadow: hovered
            ? `0 8px 32px rgba(0,0,0,0.1), 0 0 0 1px ${color}30`
            : '0 1px 3px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}
      >
        {/* Animated border trace SVG */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          {pulseActive && (
            <rect
              x="1" y="1"
              width={W - 2} height={H - 2}
              rx="11" ry="11"
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeDasharray={perimeter}
              strokeDashoffset={perimeter}
              style={{
                animation: `border-trace-${color.replace('#', '')} 0.8s ease-out forwards`,
              }}
            />
          )}
        </svg>

        {/* Accent top bar */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 3,
          background: color,
          borderRadius: '12px 12px 0 0',
          transform: hovered ? 'scaleX(1)' : 'scaleX(0.3)',
          transformOrigin: 'left',
          transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
        }} />

        {/* Content */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          {/* Icon */}
          <div style={{
            width: 48, height: 48,
            borderRadius: 10,
            background: `${color}12`,
            border: `1px solid ${color}25`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
            flexShrink: 0,
            transition: 'transform 0.3s',
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
          }}>
            {icon}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'Manrope,sans-serif',
              fontWeight: 700,
              fontSize: 16,
              color: '#0a1520',
              marginBottom: 4,
              letterSpacing: '-0.01em',
            }}>
              {title}
            </div>
            <div style={{
              fontFamily: 'Manrope,sans-serif',
              fontWeight: 400,
              fontSize: 13,
              color: '#6a85a8',
              lineHeight: 1.65,
            }}>
              {description}
            </div>
          </div>
        </div>

        {/* Stat + CTA row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '1.25rem',
          paddingTop: '1rem',
          borderTop: '1px solid #f0f2f5',
        }}>
          {stat ? (
            <div>
              <div style={{
                fontFamily: 'Manrope,sans-serif',
                fontWeight: 700,
                fontSize: 20,
                color: color,
                lineHeight: 1,
              }}>{stat}</div>
              <div style={{
                fontFamily: 'Manrope,sans-serif',
                fontWeight: 400,
                fontSize: 11,
                color: '#9ab0c8',
                marginTop: 2,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>{statLabel}</div>
            </div>
          ) : <div />}

          <div style={{
            fontSize: 13,
            fontWeight: 600,
            color: color,
            fontFamily: 'Manrope,sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            transition: 'gap 0.2s',
          }}>
            {cta}
          </div>
        </div>
      </a>
    </div>
  )
}

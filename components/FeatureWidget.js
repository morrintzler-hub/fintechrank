'use client'
import { useEffect, useRef, useState } from 'react'

const ACCENT = '#008489'

export default function FeatureWidget({
  title, subtitle, description, href,
  delay = 0, tag, cta = 'Explore',
  variant = 'default', // 'shimmer' | 'pulse' | 'progress' | 'verify'
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
      <style>{`
        @keyframes shimmer-sweep {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.25; transform:scale(0.7); }
        }
        @keyframes progress-load {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes ambient-glow {
          0%,100% { opacity: 0.04; }
          50% { opacity: 0.12; }
        }
        @keyframes line-expand {
          from { width: 12px; }
          to { width: 48px; }
        }
        @keyframes icon-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <a href={href} style={{ textDecoration: 'none', display: 'block' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}>
        <div style={{
          position: 'relative',
          padding: 'clamp(20px,4vw,48px) clamp(18px,4vw,48px)',
          borderRadius: 24,
          border: `1px solid ${hovered ? 'rgba(0,132,137,0.35)' : 'rgba(188,202,195,0.35)'}`,
          background: variant === 'progress' ? 'rgba(0,132,137,0.02)' : '#ffffff',
          transition: 'border-color 0.25s, transform 0.25s, box-shadow 0.25s',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
          boxShadow: hovered
            ? '0 12px 40px -8px rgba(0,0,0,0.1)'
            : '0 1px 4px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}>

          {/* Ambient glow for Research card */}
          {variant === 'progress' && (
            <div style={{
              position: 'absolute', inset: 0,
              background: `rgba(0,132,137,0.05)`,
              animation: 'ambient-glow 4s ease-in-out infinite',
              pointerEvents: 'none',
            }}/>
          )}

          {/* Left accent bar */}
          <div style={{
            position: 'absolute',
            left: 0, top: 0, bottom: 0, width: 4,
            background: ACCENT,
            borderRadius: '24px 0 0 24px',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.25s',
          }}/>

          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            gap: 40, flexWrap: 'wrap',
            position: 'relative', zIndex: 1,
          }}>
            <div style={{ flex: 1, minWidth: 260 }}>

              {/* Tag row — shimmer variant */}
              {tag && (
                <div style={{
                  display: 'flex', alignItems: 'center',
                  gap: 10, marginBottom: 16,
                }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: ACCENT, fontFamily: 'Manrope, sans-serif',
                    position: 'relative', overflow: 'hidden',
                    display: 'inline-block', padding: '0 2px',
                  }}>
                    {variant === 'shimmer' && (
                      <span style={{
                        position: 'absolute', top: 0, left: '-100%',
                        width: '100%', height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(0,132,137,0.15), transparent)',
                        animation: 'shimmer-sweep 3s ease-in-out infinite',
                      }}/>
                    )}
                    {tag}
                  </span>
                  {/* Shimmer line for Compare card */}
                  {variant === 'shimmer' && (
                    <div style={{
                      flex: 1, height: 1, maxWidth: 120,
                      background: 'linear-gradient(90deg, rgba(0,132,137,0.25), transparent)',
                      position: 'relative', overflow: 'hidden',
                    }}>
                      <div style={{
                        position: 'absolute', top: 0, left: '-100%',
                        width: '100%', height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(0,132,137,0.4), transparent)',
                        animation: 'shimmer-sweep 3s ease-in-out infinite',
                      }}/>
                    </div>
                  )}
                </div>
              )}

              {/* Title */}
              <h3 style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(20px, 2.4vw, 26px)',
                color: '#191c1e',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                marginBottom: subtitle ? 8 : 14,
              }}>
                {title}
              </h3>

              {/* Subtitle — with pulse dots for Categories */}
              {subtitle && variant === 'pulse' ? (
                <div style={{
                  display: 'flex', flexWrap: 'wrap',
                  alignItems: 'center', gap: '6px 16px',
                  marginBottom: 12,
                }}>
                  {subtitle.split(' · ').map((cat, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: ACCENT, flexShrink: 0,
                        animation: `pulse-dot 2s ease-in-out ${i * 0.3}s infinite`,
                      }}/>
                      <span style={{
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 600, fontSize: 14,
                        color: '#191c1e',
                      }}>{cat}</span>
                    </div>
                  ))}
                </div>
              ) : subtitle && (
                <p style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 600, fontSize: 15,
                  color: '#191c1e',
                  marginBottom: 10, lineHeight: 1.4,
                }}>
                  {subtitle}
                </p>
              )}

              {/* Progress bar for Research */}
              {variant === 'progress' && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{
                    width: 160, height: 2,
                    background: 'rgba(188,202,195,0.4)',
                    borderRadius: 2, overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      background: ACCENT,
                      animation: 'progress-load 10s linear infinite',
                      borderRadius: 2,
                    }}/>
                  </div>
                </div>
              )}

              {/* Methodology expanding line */}
              {variant === 'verify' && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  marginBottom: 12,
                }}>
                  <div style={{
                    height: 1,
                    width: hovered ? 48 : 12,
                    background: ACCENT,
                    transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
                    opacity: 0.5,
                  }}/>
                </div>
              )}

              {/* Description */}
              <p style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 400, fontSize: 14,
                color: '#3d4945',
                lineHeight: 1.75,
                maxWidth: 540, margin: 0,
              }}>
                {description}
              </p>
            </div>

            {/* CTA — with verify icon for Methodology */}
            <div style={{
              flexShrink: 0,
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 14, fontWeight: 600,
              // hidden on very small screens via CSS .fw-cta
              color: hovered ? ACCENT : '#6d7a74',
              fontFamily: 'Manrope, sans-serif',
              transition: 'color 0.2s, transform 0.2s',
              transform: hovered ? 'translateX(4px)' : 'translateX(0)',
              whiteSpace: 'nowrap',
            }}>
              {variant === 'verify' && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  style={{
                    color: hovered ? ACCENT : '#6d7a74',
                    transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
                    transform: hovered ? 'rotate(360deg) scale(1.2)' : 'rotate(0deg) scale(1)',
                  }}>
                  <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
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

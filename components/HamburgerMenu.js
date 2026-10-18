'use client'
import { useState, useEffect } from 'react'

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false)

  // Close on route change
  useEffect(() => {
    setOpen(false)
  }, [])

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const links = [
    { href: '/', label: 'Home', color: '#009e80' },
    { href: '/compare', label: 'Compare', color: '#2563eb' },
    { href: '/category/payments', label: 'Payments', color: '#60a5fa' },
    { href: '/category/banking', label: 'Banking', color: '#009e80' },
    { href: '/category/investing', label: 'Investing', color: '#fbbf24' },
    { href: '/category/crypto', label: 'Crypto', color: '#c084fc' },
    { href: '/category/lending', label: 'Lending', color: '#f87171' },
    { href: '/category/business', label: 'Business', color: '#4ade80' },
    { href: '/blog', label: 'Blog', color: '#6366f1' },
    { href: '/methodology', label: 'Methodology', color: '#008489' },
    { href: '/about', label: 'About', color: '#6d7a74' },
  ]

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="nav-hamburger"
        aria-label="Open menu"
        style={{
          position: 'relative',
          zIndex: 10002,
          cursor: 'pointer',
        }}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.3)',
            zIndex: 10000,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Drawer, inside a viewport-sized clipper.
          A closed drawer must not add page width. Offsetting it (right:-280)
          or translating it past the edge both extend the scrollable area,
          because a fixed element is laid out against the viewport and
          transforms still count toward scroll overflow. So the drawer sits at
          right:0 and slides on a transform, while this wrapper - fixed to the
          viewport with overflow:hidden - clips whatever leaves the screen.
          pointerEvents:'none' keeps the wrapper from swallowing page clicks. */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        // Sized in viewport units, not inset:0. The nav uses backdrop-filter,
        // which makes it the containing block for fixed descendants, so
        // inset:0 would collapse this to the nav's own 53px-tall box and
        // crop the drawer.
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 10001,
      }}>
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 260,
        height: '100%',
        background: '#ffffff',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        visibility: open ? 'visible' : 'hidden',
        pointerEvents: open ? 'auto' : 'none',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1), visibility 0.3s',
        boxShadow: open ? '-4px 0 24px rgba(0,0,0,0.12)' : 'none',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          borderBottom: '1px solid rgba(188,202,195,0.3)',
        }}>
          <a href="/" onClick={() => setOpen(false)} style={{
            fontFamily: 'Manrope,sans-serif', fontWeight: 700,
            fontSize: 16, color: '#191c1e', textDecoration: 'none',
          }}>
            The Fintech <span style={{ color: '#008489' }}>Rank</span>
          </a>
          <button onClick={() => setOpen(false)} style={{
            width: 32, height: 32,
            border: '1px solid rgba(188,202,195,0.4)',
            borderRadius: 6, background: 'transparent',
            cursor: 'pointer', fontSize: 16, color: '#6d7a74',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            x
          </button>
        </div>

        {/* Links */}
        <div style={{ flex: 1, padding: '0.75rem 0', overflowY: 'auto' }}>
          {links.map((link, i) => (
            <a
              key={i}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 1.25rem',
                fontFamily: 'Manrope,sans-serif',
                fontSize: 14, fontWeight: 500,
                color: '#191c1e', textDecoration: 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,132,137,0.04)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: link.color, flexShrink: 0,
              }}/>
              {link.label}
            </a>
          ))}
        </div>

        {/* Footer CTA */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(188,202,195,0.3)' }}>
          <a
            href="mailto:hello@thefintechrank.com"
            style={{
              display: 'block', width: '100%', padding: '11px',
              borderRadius: 8, background: '#008489', color: 'white',
              textAlign: 'center', textDecoration: 'none',
              fontSize: 13, fontWeight: 600, fontFamily: 'Manrope,sans-serif',
              boxSizing: 'border-box',
            }}
          >
            Submit a Company
          </a>
        </div>
      </div>
      </div>
    </>
  )
}

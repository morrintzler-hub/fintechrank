'use client'
import { useEffect, useRef, useState } from 'react'

const ACCENT = '#008489'

const POSTS = [
  {
    title: 'Stripe vs PayPal 2026: The Complete Comparison for Businesses',
    cat: 'Comparison', color: '#009e80',
    date: 'June 3, 2026', time: '12 min',
    excerpt: 'The two biggest names in payments compared across fees, developer experience, global coverage, and which one is right for your business in 2026.',
    slug: 'stripe-vs-paypal-2026',
    published: true,
    image: '/blog-stripe-vs-paypal.png',
  },
  {
    title: 'Revolut vs Wise vs Monzo 2026: Which Neobank Should You Choose?',
    slug: 'revolut-vs-wise-vs-monzo-2026',
    published: true,
    cat: 'Comparison', color: '#2563eb',
    date: 'June 9, 2026', time: '11 min',
    excerpt: "Three of Europe's most popular neobanks compared on fees, features, and everyday banking. The honest answer depends on who you are.",
    image: '/blog-revolut-wise-monzo.png',
  },
  {
    title: 'Fintech Fee Study 2026: We Compared 100 Platforms So You Don\'t Have To',
    cat: 'Research', color: '#fbbf24',
    date: 'June 18, 2026', time: '15 min',
    excerpt: 'Original research analysing the true cost of using the leading Fintech platforms. The results will surprise you.',
  },
  {
    title: 'Best Crypto Exchanges 2026: Coinbase vs Binance vs Kraken vs Bybit vs OKX',
    slug: 'best-crypto-exchanges-2026',
    published: true,
    image: '/blog-crypto-exchanges.png',
    cat: 'Comparison', color: '#c084fc',
    date: 'June 25, 2026', time: '13 min',
    excerpt: 'Security, fees, coin selection, and regulatory status compared across the biggest names in crypto trading.',
  },
  {
    title: 'BNPL Guide 2026: Klarna vs Afterpay vs Affirm vs Sezzle',
    slug: 'bnpl-guide-2026',
    published: true,
    cat: 'Guide', color: '#fbbf24',
    date: 'July 2, 2026', time: '9 min',
    excerpt: 'Buy now, pay later is now the default at most online retailers. Here is how the major providers actually differ.',
  },
  {
    title: 'Global Payroll Software 2026: Deel vs Gusto vs Rippling Compared',
    slug: 'global-payroll-2026',
    published: true,
    cat: 'Comparison', color: '#4ade80',
    date: 'July 9, 2026', time: '8 min',
    excerpt: 'Hiring across borders? We break down the leading global payroll platforms on price, compliance, and ease of use.',
  },
  {
    title: 'Best Business Banking for Startups 2026: Brex vs Ramp vs Mercury',
    slug: 'best-business-banking-startups-2026',
    published: true,
    cat: 'Comparison', color: '#4ade80',
    date: 'July 16, 2026', time: '10 min',
    excerpt: 'Three of the most popular neobanks for startups compared on features, fees, and which stage of company each is built for.',
  },
  {
    title: 'How to Choose a Payment Gateway in 2026: The Complete Guide',
    cat: 'Guide', color: '#38bdf8',
    date: 'July 23, 2026', time: '13 min',
    excerpt: 'Everything a non-technical founder needs to know about choosing between Stripe, Adyen, Checkout.com, and PayPal.',
  },
]

// Hero SVG image for the published Stripe vs PayPal post
function StripeVsPaypalImage() {
  return (
    <svg viewBox="0 0 680 240" width="100%" xmlns="http://www.w3.org/2000/svg" style={{display:'block'}}>
      <rect width="680" height="240" fill="#f0f4ff"/>
      <pattern id="bp" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="#00000008"/>
      </pattern>
      <rect width="680" height="240" fill="url(#bp)"/>
      <line x1="340" y1="30" x2="340" y2="210" stroke="#e2e6ea" strokeWidth="1" strokeDasharray="4 4"/>
      <rect x="30" y="40" width="280" height="160" rx="14" fill="white" stroke="#e8eaed" strokeWidth="1"/>
      <rect x="30" y="40" width="280" height="5" rx="3" fill="#635bff"/>
      <rect x="110" y="68" width="80" height="44" rx="9" fill="#635bff"/>
      <text x="150" y="96" textAnchor="middle" fontFamily="Manrope,sans-serif" fontSize="20" fontWeight="700" fill="white">S</text>
      <text x="150" y="130" textAnchor="middle" fontFamily="Manrope,sans-serif" fontSize="15" fontWeight="600" fill="#0a1520">Stripe</text>
      <text x="150" y="147" textAnchor="middle" fontFamily="Manrope,sans-serif" fontSize="10" fill="#6a85a8">Developer-first</text>
      <line x1="50" y1="162" x2="290" y2="162" stroke="#f0f2f5" strokeWidth="1"/>
      <text x="58" y="178" fontFamily="Manrope,sans-serif" fontSize="10" fill="#6a85a8">Fee</text>
      <text x="290" y="178" textAnchor="end" fontFamily="Manrope,sans-serif" fontSize="10" fontWeight="600" fill="#635bff">1.5% + 25p</text>
      <text x="58" y="194" fontFamily="Manrope,sans-serif" fontSize="10" fill="#6a85a8">Rating</text>
      <text x="290" y="194" textAnchor="end" fontFamily="Manrope,sans-serif" fontSize="10" fontWeight="600" fill="#635bff">4.8 / 5</text>
      <rect x="370" y="40" width="280" height="160" rx="14" fill="white" stroke="#e8eaed" strokeWidth="1"/>
      <rect x="370" y="40" width="280" height="5" rx="3" fill="#003087"/>
      <rect x="450" y="68" width="80" height="44" rx="9" fill="#003087"/>
      <text x="490" y="96" textAnchor="middle" fontFamily="Manrope,sans-serif" fontSize="20" fontWeight="700" fill="white">P</text>
      <text x="490" y="130" textAnchor="middle" fontFamily="Manrope,sans-serif" fontSize="15" fontWeight="600" fill="#0a1520">PayPal</text>
      <text x="490" y="147" textAnchor="middle" fontFamily="Manrope,sans-serif" fontSize="10" fill="#6a85a8">Consumer-first</text>
      <line x1="390" y1="162" x2="630" y2="162" stroke="#f0f2f5" strokeWidth="1"/>
      <text x="398" y="178" fontFamily="Manrope,sans-serif" fontSize="10" fill="#6a85a8">Fee</text>
      <text x="630" y="178" textAnchor="end" fontFamily="Manrope,sans-serif" fontSize="10" fontWeight="600" fill="#003087">2.9% + $0.30</text>
      <text x="398" y="194" fontFamily="Manrope,sans-serif" fontSize="10" fill="#6a85a8">Rating</text>
      <text x="630" y="194" textAnchor="end" fontFamily="Manrope,sans-serif" fontSize="10" fontWeight="600" fill="#003087">4.2 / 5</text>
      <circle cx="340" cy="120" r="20" fill="white" stroke="#e2e6ea" strokeWidth="1.5"/>
      <text x="340" y="125" textAnchor="middle" fontFamily="Manrope,sans-serif" fontSize="11" fontWeight="700" fill="#0a1520">VS</text>
      <rect x="240" y="10" width="200" height="24" rx="4" fill="white" stroke="#e2e6ea" strokeWidth="1"/>
      <text x="340" y="26" textAnchor="middle" fontFamily="Manrope,sans-serif" fontSize="9" fontWeight="600" fill="#009e80">● THE FINTECH RANK · 2026</text>
    </svg>
  )
}

function BlogWidget({ post, delay = 0 }) {
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

  const El = post.published ? 'a' : 'div'

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(28px)',
      transition: 'opacity 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.55s cubic-bezier(0.4,0,0.2,1)',
    }}>
      <El
        href={post.published ? `/blog/${post.slug}` : undefined}
        style={{ textDecoration: 'none', display: 'block' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{
          position: 'relative',
          background: '#ffffff',
          borderRadius: 20,
          border: `1px solid ${hovered ? 'rgba(0,132,137,0.3)' : 'rgba(188,202,195,0.35)'}`,
          overflow: 'hidden',
          boxShadow: hovered
            ? '0 12px 40px -8px rgba(0,0,0,0.1)'
            : '0 1px 4px rgba(0,0,0,0.04)',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
          transition: 'all 0.25s',
        }}>

          {/* Left accent bar */}
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
            background: post.color || ACCENT,
            borderRadius: '20px 0 0 20px',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.25s',
          }}/>

          {/* Image or icon area */}
          {post.image === true ? (
            <div style={{ borderBottom: '1px solid rgba(188,202,195,0.2)' }}>
              <StripeVsPaypalImage />
            </div>
          ) : post.image && post.image !== false ? (
            <div style={{ borderBottom: '1px solid rgba(188,202,195,0.2)' }}>
              <img src={post.image} alt={post.title} style={{ width:'100%', display:'block', objectFit:'cover', objectPosition:'center center', maxHeight:240 }}/>
            </div>
          ) : (
            <div style={{
              height: 120,
              background: `linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.04) 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 48, borderBottom: '1px solid rgba(188,202,195,0.15)',
            }}>
              {post.icon}
            </div>
          )}

          {/* Content */}
          <div style={{ padding: '1.5rem 1.5rem 1.5rem 1.75rem' }}>
            {/* Tag + status */}
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: 10,
            }}>
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: post.color || ACCENT,
                fontFamily: 'Manrope, sans-serif',
              }}>
                {post.cat}
              </span>
              <span style={{
                fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 3,
                background: post.published ? 'rgba(0,132,137,0.1)' : 'rgba(245,158,11,0.1)',
                color: post.published ? ACCENT : '#d97706',
                border: `1px solid ${post.published ? 'rgba(0,132,137,0.2)' : 'rgba(245,158,11,0.2)'}`,
                fontFamily: 'Manrope, sans-serif',
              }}>
                {post.published ? 'Read now →' : 'Coming soon'}
              </span>
            </div>

            {/* Title */}
            <h3 style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(16px, 2.2vw, 20px)',
              color: '#191c1e',
              lineHeight: 1.3,
              letterSpacing: '-0.02em',
              marginBottom: 10,
            }}>
              {post.title}
            </h3>

            {/* Excerpt */}
            <p style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 400, fontSize: 13,
              color: '#3d4945', lineHeight: 1.7,
              marginBottom: 14,
            }}>
              {post.excerpt}
            </p>

            {/* Footer */}
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 12, borderTop: '1px solid rgba(188,202,195,0.25)',
              fontSize: 12, color: '#6d7a74',
              fontFamily: 'Manrope, sans-serif',
            }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.time} read</span>
              </div>
              <div style={{
                color: hovered ? (post.color || ACCENT) : '#6d7a74',
                fontWeight: 600, fontSize: 12,
                transition: 'color 0.2s, transform 0.2s',
                transform: hovered ? 'translateX(3px)' : 'translateX(0)',
              }}>
                {post.published ? 'Read →' : 'Notify me'}
              </div>
            </div>
          </div>
        </div>
      </El>
    </div>
  )
}

export default function BlogPage() {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? POSTS : POSTS.slice(0, 4)

  return (
    <div style={{ background: '#f7f9fb', minHeight: '100vh', position: 'relative', zIndex: 1 }}>

      {/* Header */}
      <div style={{
        maxWidth: 900, margin: '0 auto',
        padding: '3rem 2rem 2rem',
      }}>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: ACCENT,
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT, display: 'inline-block' }}/>
          Research & Comparisons
        </div>
        <h1 style={{
          fontFamily: 'Manrope, sans-serif', fontWeight: 800,
          fontSize: 'clamp(1.8rem, 4vw, 3rem)',
          color: '#191c1e', letterSpacing: '-0.03em',
          lineHeight: 1.1, marginBottom: 12,
        }}>
          The Fintech Rank Blog
        </h1>
        <p style={{
          fontFamily: 'Manrope, sans-serif', fontWeight: 400,
          fontSize: 15, color: '#3d4945', lineHeight: 1.7,
          maxWidth: 520,
        }}>
          Original research, comparisons, and guides to help you make better fintech decisions.
        </p>
      </div>

      {/* Articles — widget stack */}
      <div style={{
        maxWidth: 900, margin: '0 auto',
        padding: '0 2rem 4rem',
        display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        {visible.map((post, i) => (
          <BlogWidget key={i} post={post} delay={i} />
        ))}

        {/* Show more button */}
        {!showAll && POSTS.length > 4 && (
          <div style={{
            opacity: 1,
            transform: 'translateY(0)',
            transition: 'all 0.4s',
          }}>
            <button
              onClick={() => setShowAll(true)}
              style={{
                width: '100%', padding: '14px',
                borderRadius: 16, cursor: 'pointer',
                border: '1px solid rgba(188,202,195,0.4)',
                background: '#ffffff',
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 500, fontSize: 14,
                color: '#3d4945',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8,
                transition: 'all 0.2s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(0,132,137,0.3)'
                e.currentTarget.style.color = ACCENT
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(188,202,195,0.4)'
                e.currentTarget.style.color = '#3d4945'
              }}
            >
              Show {POSTS.length - 4} more articles
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

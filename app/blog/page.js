'use client'
import { useState } from 'react'

const POSTS = [
  {
    title: 'Stripe vs PayPal vs Adyen: The Complete 2025 Comparison',
    cat: 'Comparison', color: '#00c4a0',
    date: '2025-06-15', time: '12 min',
    excerpt: 'The three giants of payment processing compared across fees, developer experience, global coverage, and enterprise features. Which one is right for your business in 2025?',
    gradient: 'linear-gradient(135deg, var(--bg3) 0%, #1a3a5c 50%, #0d2440 100%)',
    icon: '💳', featured: true,
  },
  {
    title: "Best Neobanks in Europe 2025: Monzo vs Revolut vs Starling vs N26",
    cat: 'Guide', color: '#60a5fa',
    date: '2025-06-10', time: '10 min',
    excerpt: "A deep dive into Europe's leading digital banks. Features, fees, and which one suits your lifestyle and spending habits best.",
    gradient: 'linear-gradient(135deg, var(--bg3) 0%, #1a2a4a 50%, #0d1e38 100%)',
    icon: '🏦', featured: true,
  },
  {
    title: "Fintech Fee Study 2025: We Compared 100 Platforms So You Don't Have To",
    cat: 'Research', color: '#fbbf24',
    date: '2025-06-05', time: '15 min',
    excerpt: 'Original research analysing the true cost of using the top 100 fintech platforms — including hidden fees most users never see.',
    gradient: 'linear-gradient(135deg, #1a1200 0%, #2a2000 50%, #1a1500 100%)',
    icon: '📊', featured: true,
  },
  {
    title: 'Coinbase vs Kraken vs Binance: Fees, Security, and Features Compared',
    cat: 'Comparison', color: '#c084fc',
    date: '2025-05-28', time: '11 min',
    excerpt: 'The three largest crypto exchanges put head to head. Which offers the best rates, the strongest security, and the most advanced trading tools?',
    gradient: 'linear-gradient(135deg, #120a28 0%, #1e1040 50%, #140c30 100%)',
    icon: '₿', featured: false,
  },
  {
    title: 'Best Fintech Tools for Startups in 2025: Banking, Payments, Payroll',
    cat: 'Guide', color: '#4ade80',
    date: '2025-05-20', time: '9 min',
    excerpt: 'From Mercury for banking to Ramp for expenses and Deel for global hiring — the complete fintech stack for high-growth startups.',
    gradient: 'linear-gradient(135deg, #001a0a 0%, #002a12 50%, #001a0a 100%)',
    icon: '🚀', featured: false,
  },
  {
    title: 'Wise vs Revolut for International Transfers: Which is Cheaper?',
    cat: 'Comparison', color: '#00c4a0',
    date: '2025-05-12', time: '8 min',
    excerpt: 'We ran 50 real transfer scenarios across both platforms to find out which one actually saves you more money on international payments.',
    gradient: 'linear-gradient(135deg, #001a14 0%, #003028 50%, #002020 100%)',
    icon: '🌍', featured: false,
  },
  {
    title: 'BNPL Explained: Is Buy Now Pay Later Actually Free? The Hidden Costs',
    cat: 'Explained', color: '#f87171',
    date: '2025-05-05', time: '7 min',
    excerpt: 'Klarna, Afterpay, and Affirm promise interest-free spending. But what does the fine print actually say about fees, credit checks, and late payments?',
    gradient: 'linear-gradient(135deg, #1a0505 0%, #2a0808 50%, #1a0505 100%)',
    icon: '⚠️', featured: false,
  },
  {
    title: 'Best Payment Solutions for Freelancers with International Clients',
    cat: 'Guide', color: '#60a5fa',
    date: '2025-04-28', time: '9 min',
    excerpt: 'Wise, Payoneer, Airwallex, and Revolut compared for the modern freelancer. Which platform gives you the best rates and the least hassle?',
    gradient: 'linear-gradient(135deg, #050a1a 0%, #0a1428 50%, #050a1a 100%)',
    icon: '💼', featured: false,
  },
]

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function ArticleCard({ post, large }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: 'var(--r)',
        overflow: 'hidden',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.12)' : 'var(--border)'}`,
        background: 'var(--bg2)',
        transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? '0 8px 32px rgba(0,0,0,0.3)' : 'none',
        cursor: post.published ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
      }}>
      {post.published && (
        <a href={`/blog/${post.slug}`} style={{
          position: 'absolute', inset: 0, zIndex: 2, borderRadius: 'var(--r)'
        }} aria-label={post.title} />
      )}

      {/* Image area */}
      <div style={{
        height: large ? 200 : 140,
        background: `linear-gradient(135deg, var(--bg3) 0%, var(--bg4) 50%, var(--bg3) 100%)`,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        overflow: 'hidden',
      }}>
      {/* Color accent overlay using post color */}
      <div style={{position:'absolute',inset:0,background:post.color,opacity:0.08,pointerEvents:'none'}} />
        {/* Grid pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
        {/* Category accent line */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, ${post.color}, transparent)`,
        }} />
        {/* Icon */}
        <div style={{
          fontSize: large ? '3rem' : '2rem',
          position: 'relative', zIndex: 1,
          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
        }}>
          {post.icon}
        </div>
        {/* Category badge */}
        <div style={{
          position: 'absolute', top: 10, left: 12,
          fontSize: 9, fontWeight: 600, letterSpacing: '.1em',
          textTransform: 'uppercase', padding: '3px 8px',
          borderRadius: 3, background: post.color + '22',
          color: post.color, border: `1px solid ${post.color}44`,
          backdropFilter: 'blur(4px)',
        }}>
          {post.cat}
        </div>
        {/* Status badge */}
        <div style={{
          position: 'absolute', top: 10, right: 12,
          fontSize: 9, fontWeight: 500, padding: '3px 8px',
          borderRadius: 3,
          background: post.published ? 'rgba(0,158,128,0.15)' : 'rgba(245,158,11,0.15)',
          color: post.published ? '#009e80' : '#fbbf24',
          border: `1px solid ${post.published ? 'rgba(0,158,128,0.25)' : 'rgba(245,158,11,0.25)'}`,
        }}>
          {post.published ? 'Read now' : 'Coming soon'}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--card-bg)' }}>
        <div style={{
          fontSize: 10, color: 'var(--dim)', marginBottom: 8,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span>{formatDate(post.date)}</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--dim)', display: 'inline-block' }} />
          <span>{post.time} read</span>
        </div>
        <h3 style={{
          fontFamily: 'var(--font)', fontWeight: large ? 400 : 300,
          fontSize: large ? '1rem' : '0.9rem',
          lineHeight: 1.4, color: 'var(--text)',
          marginBottom: '.6rem', letterSpacing: '-.01em',
          flex: 0,
        }}>
          {post.title}
        </h3>
        <p style={{
          fontSize: 12, fontWeight: 300, color: 'var(--muted)',
          lineHeight: 1.65, flex: 1,
        }}>
          {post.excerpt}
        </p>
      </div>
    </div>
  )
}

export default function BlogPage() {
  const sorted = [...POSTS].sort((a, b) => new Date(b.date) - new Date(a.date))
  const featured = sorted.filter(p => p.featured)
  const rest = sorted.filter(p => !p.featured)

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '3rem 2rem 5rem', position: 'relative', zIndex: 1 }}>

      {/* Header */}
      <div className="fade-in" style={{ marginBottom: '3rem' }}>
        <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
          Research and Guides
        </div>
        <h1 style={{ fontFamily: 'var(--font)', fontWeight: 200, fontSize: 'clamp(2rem,4vw,3rem)', letterSpacing: '-.03em', lineHeight: 1.1, marginBottom: '.75rem' }}>
          The Fintech <span style={{ color: 'var(--accent)', fontWeight: 400 }}>Blog</span>
        </h1>
        <p style={{ fontSize: 14, fontWeight: 300, color: 'var(--muted)', lineHeight: 1.7, maxWidth: 520 }}>
          In-depth comparisons, original research, and practical guides. No sponsored opinions — just honest analysis.
        </p>
      </div>

      {/* Notify banner */}
      <div className="fade-up" style={{ background: 'linear-gradient(135deg,rgba(0,196,160,.08),rgba(59,130,246,.06))', border: '1px solid rgba(0,196,160,.2)', borderRadius: 'var(--r)', padding: '1rem 1.25rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>✍️</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500, color: 'var(--text)', fontSize: 13, marginBottom: 2 }}>First articles publishing soon</div>
          <div style={{ fontSize: 12, fontWeight: 300, color: 'var(--muted)' }}>Sign up to be notified when we publish.</div>
        </div>
        <a href="mailto:hello@thefintechrank.com?subject=Blog notification"
          style={{ flexShrink: 0, fontSize: 12, fontWeight: 500, padding: '7px 14px', borderRadius: 'var(--rsm)', background: 'var(--accent)', color: '#000', textDecoration: 'none' }}>
          Notify me
        </a>
      </div>

      {/* Featured - big 3-column grid */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--dim)', marginBottom: '1.25rem' }}>
          Featured
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 12 }}>
          {featured.map((post, i) => (
            <div key={post.title} className="fade-up" style={{ transitionDelay: i * 0.08 + 's' }}>
              <ArticleCard post={post} large={i === 0} />
            </div>
          ))}
        </div>
      </div>

      {/* Rest - masonry-style 2-column grid */}
      <div>
        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--dim)', marginBottom: '1.25rem' }}>
          More articles
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {rest.map((post, i) => (
            <div key={post.title} className="fade-up" style={{ transitionDelay: i * 0.06 + 's' }}>
              <ArticleCard post={post} large={false} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media(max-width:640px){
          .blog-featured { grid-template-columns: 1fr !important; }
          .blog-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

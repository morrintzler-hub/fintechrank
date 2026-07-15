'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

const USE_CASES = {
  'freelancers': {
    h1: 'Best fintech tools for', h1accent: 'freelancers',
    desc: 'Multi-currency accounts, international transfers, and low-fee payment tools for independent workers and remote professionals.',
    keywords: ['freelancer', 'international', 'transfer', 'remote', 'contractor', 'abroad', 'currency'],
    categories: ['Payments', 'Banking'], color: '#2563eb',
  },
  'startups': {
    h1: 'Best fintech tools for', h1accent: 'startups',
    desc: 'Banking, payments, payroll, and expense management tools built for fast-growing companies.',
    keywords: ['startup', 'business', 'developer', 'SaaS', 'venture', 'team', 'company'],
    categories: ['Business', 'Payments'], color: '#4ade80',
  },
  'international-payments': {
    h1: 'Best apps for', h1accent: 'international payments',
    desc: 'Send money abroad, hold foreign currencies, and pay international contractors at the best available rates.',
    keywords: ['international', 'transfer', 'abroad', 'currency', 'global', 'remittance', 'foreign'],
    categories: ['Payments', 'Banking'], color: '#008489',
  },
  'crypto-trading': {
    h1: 'Best platforms for', h1accent: 'crypto trading',
    desc: 'Regulated, secure, and cost-competitive crypto exchanges for beginners and experienced traders.',
    keywords: ['crypto', 'bitcoin', 'blockchain', 'digital asset', 'exchange', 'trading'],
    categories: ['Crypto'], color: '#c084fc',
  },
  'small-business': {
    h1: 'Best fintech for', h1accent: 'small businesses',
    desc: 'Business bank accounts, payment processing, payroll, and expense management for small and growing businesses.',
    keywords: ['small business', 'business', 'merchant', 'commerce', 'company', 'SMB'],
    categories: ['Business', 'Payments'], color: '#f87171',
  },
  'investing': {
    h1: 'Best apps for', h1accent: 'investing',
    desc: 'Commission-free stock trading, robo-advisors, and automated portfolio management for every type of investor.',
    keywords: ['invest', 'stock', 'portfolio', 'trading', 'ETF', 'retirement', 'wealth'],
    categories: ['Investing'], color: '#fbbf24',
  },
  'digital-banking': {
    h1: 'Best', h1accent: 'digital banks',
    desc: 'Mobile-first bank accounts with no monthly fees, instant notifications, and better rates than traditional banks.',
    keywords: ['bank', 'account', 'neobank', 'current account', 'banking', 'deposit'],
    categories: ['Banking'], color: '#00c4a0',
  },
  'bnpl': {
    h1: 'Best', h1accent: 'buy now pay later',
    desc: 'Split purchases into interest-free instalments at thousands of retailers. Compare fees, credit impact, and retailer coverage.',
    keywords: ['BNPL', 'instalment', 'pay later', 'split', 'checkout', 'interest-free'],
    categories: ['Payments', 'Lending'], color: '#fb923c',
  },
  'payroll': {
    h1: 'Best software for', h1accent: 'payroll',
    desc: 'Payroll, HR, and global workforce management tools for businesses of every size.',
    keywords: ['payroll', 'HR', 'employee', 'salary', 'workforce', 'contractor', 'hiring'],
    categories: ['Business'], color: '#4ade80',
  },
  'expense-management': {
    h1: 'Best tools for', h1accent: 'expense management',
    desc: 'Corporate cards, spend controls, and automated expense reporting to manage company spending.',
    keywords: ['expense', 'spend', 'receipt', 'corporate card', 'reimbursement', 'finance'],
    categories: ['Business'], color: '#38bdf8',
  },
}

function stars(r) {
  if (!r) return ''
  const f = Math.floor(r), h = (r % 1) >= .5
  return '★'.repeat(f) + (h ? '½' : '') + '☆'.repeat(5 - f - (h ? 1 : 0))
}

export default function BestForPage() {
  const { slug } = useParams()
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const meta = USE_CASES[slug?.toLowerCase()] || null

  useEffect(() => {
    if (!meta) { setLoading(false); return }
    async function load() {
      const { data } = await supabase
        .from('companies').select('*').eq('is_active', true)
        .in('category', meta.categories).order('rank')
      if (data) {
        const filtered = data.filter(c => {
          const text = ((c.best_for || '') + ' ' + (c.description || '') + ' ' + (c.tagline || '')).toLowerCase()
          return meta.keywords.some(k => text.includes(k.toLowerCase()))
        })
        setCompanies(filtered.length >= 3 ? filtered : data.slice(0, 10))
      }
      setLoading(false)
    }
    load()
  }, [slug])

  if (!meta) return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', zIndex: 1, position: 'relative' }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>404</div>
      <a href="/" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: 14 }}>Back to home</a>
    </div>
  )

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '3rem 2rem 5rem', position: 'relative', zIndex: 1 }}>
      <div className="fade-in" style={{ marginBottom: '3rem' }}>
        <a href="/" style={{ fontSize: 12, fontWeight: 300, color: 'var(--dim)', textDecoration: 'none', letterSpacing: '.04em', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: '1.5rem', transition: 'color .15s' }}
          onMouseEnter={e => e.target.style.color = 'var(--muted)'}
          onMouseLeave={e => e.target.style.color = 'var(--dim)'}>
          All companies
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: meta.color, boxShadow: `0 0 12px ${meta.color}66` }} />
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: meta.color }}>Use Case</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font)', fontWeight: 200, fontSize: 'clamp(2rem,4vw,3rem)', letterSpacing: '-.03em', lineHeight: 1.1, marginBottom: '.75rem', color: 'var(--text)' }}>
          {meta.h1} <span style={{ fontWeight: 400, color: meta.color }}>{meta.h1accent}</span>
        </h1>
        <p style={{ fontSize: 14, fontWeight: 300, color: 'var(--muted)', lineHeight: 1.7, maxWidth: 500 }}>{meta.desc}</p>
        <div style={{ fontSize: 12, fontWeight: 300, color: 'var(--dim)', marginTop: '1rem' }}>
          {loading ? '...' : `${companies.length} companies`}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 180, borderRadius: 10 }} />)}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {companies.map((c, i) => (
            <div key={c.id} className="company-card fade-up" style={{ transitionDelay: `${Math.min(i * .04, .5)}s` }}>
              <div className="card-main">
                <div className="logo-wrap">
                  <img src={`https://www.google.com/s2/favicons?domain=${(c.website || '').replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}&sz=64`}
                    alt={c.name} width={32} height={32}
                    onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block' }}
                    style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 4, display: 'block' }} />
                  <span style={{ display: 'none', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12, color: 'var(--muted)', letterSpacing: '.04em' }}>
                    {c.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="rank-badge">{c.rank}</div>
                </div>
                <div className="card-body">
                  <div className="card-header">
                    <div className="card-title-group">
                      <span className="company-name">{c.name}</span>
                      {c.badge && <span className={`badge b-${c.badge === 'featured' ? 'feat' : c.badge === 'popular' ? 'pop' : 'new'}`}>{c.badge.charAt(0).toUpperCase() + c.badge.slice(1)}</span>}
                    </div>
                    <div className="card-right-meta">
                      <div className="rating-block">
                        <div className="stars">{stars(c.rating)}</div>
                        <div className="rating-num">{c.rating} - {(c.review_count || 0).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  <div className="company-url">
                    <a href={c.website} target="_blank" rel="noopener noreferrer">{(c.website || '').replace('https://', '').replace('www.', '')}</a>
                  </div>
                  {c.best_for && <div style={{ fontSize: 12, color: meta.color, fontWeight: 500, marginBottom: 6 }}>Best for: {c.best_for}</div>}
                  <div className="company-desc">{c.description}</div>
                  <div className="card-footer">
                    <div className="pricing"><strong>Pricing:</strong> {c.pricing}</div>
                    <div style={{ display: 'flex', gap: 7 }}>
                      <a href={`/review/${c.slug}`} className="btn-review">Full review</a>
                      <a href={c.affiliate_url || c.website} target="_blank" rel="noopener noreferrer" className="btn-visit">Visit site</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '3rem', padding: '2rem', background: 'var(--card)', borderRadius: 12, border: '1px solid var(--border)', textAlign: 'center' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Want to compare these side by side?</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>Use our compare tool to see fees, features, and scores in one table.</div>
        <a href="/compare" style={{ display: 'inline-block', padding: '10px 24px', borderRadius: 8, background: 'var(--accent)', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>Compare companies</a>
      </div>
    </div>
  )
}

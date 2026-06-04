'use client'
import { useEffect, useState, Suspense, lazy } from 'react'
import { supabase } from '../lib/supabase'
import FeatureWidget from '../components/FeatureWidget'
import HeroSection from '../components/HeroSection'

const CATEGORIES = ['all','Payments','Banking','Investing','Crypto','Lending','Business']
const CAT_COLORS = {
  Payments:'#60a5fa', Banking:'#00c4a0', Investing:'#fbbf24',
  Crypto:'#c084fc', Lending:'#f87171', Business:'#4ade80'
}

// Quick-search pills — each maps to either a category or exact tag
const SUGGEST_PILLS = [
  { label: 'Payments',   type: 'category', value: 'Payments' },
  { label: 'Neobank',    type: 'tag',      value: 'Neobank' },
  { label: 'Crypto',     type: 'tag',      value: 'Crypto' },
  { label: 'BNPL',       type: 'tag',      value: 'BNPL' },
  { label: 'Payroll',    type: 'tag',      value: 'Payroll' },
  { label: 'Remittance', type: 'tag',      value: 'Remittance' },
  { label: 'Africa',     type: 'tag',      value: 'Africa' },
  { label: 'India',      type: 'tag',      value: 'India' },
]

function stars(r) {
  const f = Math.floor(r), h = (r%1)>=.5
  return '★'.repeat(f) + (h?'½':'') + '☆'.repeat(5-f-(h?1:0))
}

export default function HomePage() {
  const [companies, setCompanies]   = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [pillFilter, setPillFilter] = useState(null) // {type, value}
  const [category, setCategory]     = useState('all')
  const [sort, setSort]             = useState('rank')
  const [compare, setCompare]       = useState([])
  const [visible, setVisible]       = useState(20)
  const [counts, setCounts]         = useState({})

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('companies_with_tags')
        .select('*')
        .eq('is_active', true)
        .order('rank')

      if (data) {
        setCompanies(data)
        // Build category counts from live data
        const c = { all: data.length }
        CATEGORIES.slice(1).forEach(cat => {
          c[cat] = data.filter(x => x.category === cat).length
        })
        setCounts(c)
      }
      setLoading(false)
    }
    load()
  }, [])

  function getTags(c) {
    if (!c.tag_list) return []
    if (Array.isArray(c.tag_list)) return c.tag_list
    try { return JSON.parse(c.tag_list) } catch { return [] }
  }

  const filtered = companies
    .filter(c => {
      // Sidebar category filter
      const matchCat = category === 'all' || c.category === category

      // Pill filter - exact category or exact tag match
      let matchPill = true
      if (pillFilter) {
        if (pillFilter.type === 'category') {
          matchPill = c.category === pillFilter.value
        } else {
          const tags = getTags(c)
          matchPill = tags.some(t =>
            t.toLowerCase() === pillFilter.value.toLowerCase()
          )
        }
      }

      // Text search - only when no pill active
      let matchSearch = true
      if (search && !pillFilter) {
        const q = search.toLowerCase().trim()
        const tags = getTags(c)
        matchSearch =
          c.name.toLowerCase().includes(q) ||
          (c.description||'').toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          tags.some(t => t.toLowerCase().includes(q))
      }

      return matchCat && matchPill && matchSearch
    })
    .sort((a,b) => {
      if (sort==='rank')    return a.rank - b.rank
      if (sort==='rating')  return b.rating - a.rating
      if (sort==='name')    return a.name.localeCompare(b.name)
      if (sort==='reviews') return b.review_count - a.review_count
      return 0
    })

  function toggleCompare(id, name, slug) {
    setCompare(prev => {
      if (prev.find(x => x.id===id)) return prev.filter(x => x.id!==id)
      if (prev.length >= 3) return prev
      return [...prev, { id, name, slug }]
    })
  }

  function doCompare() {
    if (compare.length < 2) return
    const slugs = compare.map(x => x.slug || x.id).join(',')
    window.location.href = `/compare?ids=${slugs}`
  }

  return (
    <div>
      <HeroSection
          search={search} setSearch={setSearch}
          counts={counts}
          pills={SUGGEST_PILLS}
          pillFilter={pillFilter} setPillFilter={setPillFilter}
          setVisible={setVisible}
        />


      {/* Feature widgets — full width, fast stagger */}
      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: '3rem 2rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        <FeatureWidget
          href="/compare"
          tag="Compare"
          title="Find the right fintech for your business"
          subtitle="Side-by-side comparison across any 2–3 companies"
          description="Compare fees, features, global coverage, and ratings across 100 fintech companies. From Stripe vs Adyen to Revolut vs Wise — get the full picture before you decide."
          color="#009e80"
          cta="Start comparing"
          delay={0}
        />
        <FeatureWidget
          href="/category/payments"
          tag="Categories"
          title="Every corner of fintech, covered"
          subtitle="Payments · Banking · Crypto · Investing · Lending · Business"
          description="Six categories, 100 companies, verified data. Whether you need a payment processor, a neobank, or a crypto exchange — the comparison is already here."
          color="#009e80"
          cta="Browse categories"
          delay={1}
        />
        <FeatureWidget
          href="/blog/stripe-vs-paypal-2025"
          tag="Research"
          title="Stripe vs PayPal 2026: The complete breakdown"
          subtitle="New article · 12 minute read"
          description="Fees, developer experience, international coverage, and checkout conversion compared. Our most in-depth payment platform analysis."
          color="#009e80"
          cta="Read the article"
          delay={2}
        />
        <FeatureWidget
          href="/about"
          tag="Methodology"
          title="Independent research. No sponsored rankings"
          subtitle="Data you can actually trust"
          description="Every rating is based on verified pricing and community-reported accuracy. No company can pay to rank higher. Ever."
          color="#009e80"
          cta="Our methodology"
          delay={3}
        />
      </div>

      <div className="page-body">

        <Sidebar
          category={category} setCategory={setCategory}
          sort={sort} setSort={setSort}
          compare={compare} setCompare={setCompare}
          counts={counts} onCompare={doCompare}
        />

        <div className="content-area" style={{minWidth:0,overflow:'hidden'}}>
          {/* Toolbar */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
            marginBottom:'1.25rem',flexWrap:'wrap',gap:8}}>
            <div style={{fontSize:12,fontWeight:300,color:'var(--muted)',letterSpacing:'.02em'}}>
              Showing{' '}
              <strong style={{color:'var(--text)',fontWeight:400}}>
                {Math.min(visible, filtered.length)}
              </strong>{' '}of{' '}
              <strong style={{color:'var(--text)',fontWeight:400}}>
                {filtered.length}
              </strong>{' '}companies
            </div>
            {(search || pillFilter) && (
              <button onClick={() => { setSearch(''); setPillFilter(null); setVisible(20) }}
                style={{fontSize:11,padding:'4px 10px',borderRadius:2,
                  border:'1px solid var(--border)',background:'transparent',
                  color:'var(--muted)',cursor:'pointer',letterSpacing:'.04em',
                  fontFamily:'var(--font)'}}>
                Clear filter x
              </button>
            )}
          </div>

          {/* Cards */}
          {loading ? (
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {[...Array(5)].map((_,i) => (
                <div key={i} className="skeleton"
                  style={{height:200,borderRadius:10}} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{textAlign:'center',padding:'3rem',color:'var(--muted)'}}>
              <div style={{fontSize:'2rem',marginBottom:8}}>-</div>
              <div style={{fontFamily:'var(--heading)',fontSize:'1rem',
                color:'var(--text)',marginBottom:4,fontWeight:400}}>
                No companies found
              </div>
              <div style={{fontSize:12,fontWeight:300}}>
                Try a different search or category
              </div>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {filtered.slice(0, visible).map((c, i) => (
                <CompanyCard
                  key={c.id} company={c} index={i}
                  inCompare={!!compare.find(x => x.id===c.id)}
                  onToggleCompare={() => toggleCompare(c.id, c.name, c.slug)}
                />
              ))}
            </div>
          )}

          {/* Load more */}
          {visible < filtered.length && (
            <div style={{textAlign:'center',marginTop:'1.75rem'}}>
              <button className="btn-secondary"
                onClick={() => setVisible(v => v + 20)}>
                Load more companies
              </button>
              <div style={{fontSize:10,color:'var(--dim)',marginTop:6,
                letterSpacing:'.04em'}}>
                {filtered.length - visible} more
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


function CompanyLogo({ website, name }) {
  const [failed, setFailed] = useState(false)

  const domain = (website || '')
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]
    .trim()

  const initials = (name || '').slice(0, 2).toUpperCase()

  // Google's favicon service is extremely reliable and works for all domains
  const logoSrc = domain
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    : null

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {logoSrc && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoSrc}
          alt={`${name} logo`}
          onError={() => setFailed(true)}
          style={{
            width: 28, height: 28,
            objectFit: 'contain',
            borderRadius: 4,
            imageRendering: 'crisp-edges',
          }}
        />
      ) : (
        <span style={{
          fontFamily: 'var(--font)', fontWeight: 500,
          fontSize: 12, color: 'var(--muted)',
          letterSpacing: '0.04em',
        }}>
          {initials}
        </span>
      )}
    </div>
  )
}

function CompanyCard({ company: c, index, inCompare, onToggleCompare }) {
  const delay = `${Math.min(index * 0.04, 0.5)}s`
  const catKey = (c.category||'').replace(/[\s\/]/g,'')

  const badgeMap = {
    featured: { cls:'b-feat', label:'Featured' },
    popular:  { cls:'b-pop',  label:'Popular' },
    new:      { cls:'b-new',  label:'New' },
  }
  const badge = c.badge ? badgeMap[c.badge] : null

  return (
    <article
      className={`company-card fade-up${inCompare?' selected':''}`}
      style={{transitionDelay: delay}}>

      {/* Top line shimmer */}
      <div style={{position:'absolute',top:0,left:0,right:0,height:1,
        background:'linear-gradient(90deg,transparent,rgba(255,255,255,.05),transparent)'}} />

      <div className="card-main">
        {/* Logo — Clearbit auto-fetches from domain */}
        <div className="logo-wrap">
          <CompanyLogo
            website={c.website}
            name={c.name}
          />
          <div className="rank-badge">{c.rank}</div>
        </div>

        {/* Body */}
        <div className="card-body">
          {/* Header */}
          <div className="card-header">
            <div className="card-title-group">
              <span className="company-name">{c.name}</span>
              {badge && (
                <span className={`badge ${badge.cls}`}>{badge.label}</span>
              )}
              <span className={`cat-pill cat-${catKey}`}>
                {c.category}
              </span>
            </div>
            <div className="card-right-meta">
              <div className="rating-block">
                <div className="stars">{stars(c.rating||0)}</div>
                <div className="rating-num">
                  {c.rating} - {(c.review_count||0).toLocaleString()}
                </div>
              </div>
              <button
                className={`add-cmp${inCompare?' on':''}`}
                onClick={onToggleCompare}
                title="Add to compare">
                {inCompare ? '✓' : '+'}
              </button>
            </div>
          </div>

          {/* URL */}
          <div className="company-url">
            <a href={c.website} target="_blank" rel="noopener noreferrer">
              {(c.website||'').replace('https://','').replace('http://','').replace(/\/$/,'')}
            </a>
          </div>

          {/* Description */}
          <div className="company-desc">{c.description}</div>

          {/* Tags — handle both array and JSON string */}
          {(() => {
            let tags = []
            if (Array.isArray(c.tag_list)) tags = c.tag_list
            else if (c.tag_list) { try { tags = JSON.parse(c.tag_list) } catch {} }
            return tags.length > 0 ? (
              <div className="card-tags">
                {tags.slice(0, 5).map(t => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            ) : null
          })()}

          {/* Footer */}
          <div className="card-footer">
            <div className="pricing">
              <strong>Pricing:</strong> {c.pricing}
            </div>
            <div style={{display:'flex',gap:7}}>
              <a href={`/review/${c.slug}`} className="btn-review">
                Full review
              </a>
              <a
                href={c.affiliate_url || c.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-visit">
                Visit site
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

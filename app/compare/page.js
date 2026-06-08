'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const CATEGORIES = ['all','Payments','Banking','Investing','Crypto','Lending','Business']
const CAT_COLORS = {
  Payments:'#60a5fa', Banking:'#00c4a0', Investing:'#fbbf24',
  Crypto:'#c084fc', Lending:'#f87171', Business:'#4ade80'
}

// Quick-search pills — match tags that exist in the database
const SUGGEST_PILLS = [
  { label: 'Payments',     query: 'Payments' },
  { label: 'Neobank',      query: 'Neobank' },
  { label: 'Crypto',       query: 'Crypto' },
  { label: 'BNPL',         query: 'BNPL' },
  { label: 'Payroll',      query: 'Payroll' },
  { label: 'Remittance',   query: 'Remittance' },
  { label: 'Africa',       query: 'Africa' },
  { label: 'India',        query: 'India' },
]

function stars(r) {
  const f = Math.floor(r), h = (r%1)>=.5
  return '★'.repeat(f) + (h?'½':'') + '☆'.repeat(5-f-(h?1:0))
}

export default function HomePage() {
  const [companies, setCompanies]   = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
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

  const filtered = companies
    .filter(c => {
      const matchCat = category === 'all' || c.category === category
      const q = search.toLowerCase().trim()
      const matchSearch = !q ||
        c.name.toLowerCase().includes(q) ||
        (c.description||'').toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.tag_list||[]).some(t => t.toLowerCase().includes(q))
      return matchCat && matchSearch
    })
    .sort((a,b) => {
      if (sort==='rank')    return a.rank - b.rank
      if (sort==='rating')  return b.rating - a.rating
      if (sort==='name')    return a.name.localeCompare(b.name)
      if (sort==='reviews') return b.review_count - a.review_count
      return 0
    })

  function toggleCompare(id, name) {
    setCompare(prev => {
      if (prev.find(x => x.id===id)) return prev.filter(x => x.id!==id)
      if (prev.length >= 3) return prev
      return [...prev, { id, name }]
    })
  }

  function doCompare() {
    if (compare.length < 2) return
    const ids = compare.map(x => x.id).join(',')
    window.location.href = `/compare?ids=${ids}`
  }

  return (
    <div>
      <Hero search={search} setSearch={setSearch} counts={counts} />

      <div style={{maxWidth:1160,margin:'0 auto',padding:'2.5rem 1.5rem 5rem',
        display:'grid',gridTemplateColumns:'220px 1fr',gap:'2.5rem',alignItems:'start'}}>

        <Sidebar
          category={category} setCategory={setCategory}
          sort={sort} setSort={setSort}
          compare={compare} setCompare={setCompare}
          counts={counts} onCompare={doCompare}
        />

        <div>
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
            {search && (
              <button onClick={() => setSearch('')}
                style={{fontSize:11,padding:'4px 10px',borderRadius:2,
                  border:'1px solid var(--border)',background:'transparent',
                  color:'var(--muted)',cursor:'pointer',letterSpacing:'.04em',
                  fontFamily:'var(--font)'}}>
                Clear "{search}" x
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
                  onToggleCompare={() => toggleCompare(c.id, c.name)}
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

function Hero({ search, setSearch, counts }) {
  return (
    <header className="hero">
      <div className="hero-eyebrow">Independent Fintech Research</div>

      <h1>
        Compare the world's<br />
        <em>top 100 fintech</em><br />
        <strong>companies</strong>
      </h1>

      <p className="hero-sub">
        Unbiased ratings, verified pricing, and side-by-side feature comparisons.
        Updated in real time by our community.
      </p>

      {/* Search */}
      <div className="search-wrap">
        <div className="search-box">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search company, feature, or use case..."
            autoComplete="off"
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>
              ✕
            </button>
          )}
        </div>

        {/* Quick search pills */}
        <div className="search-suggest">
          {SUGGEST_PILLS.map(p => (
            <button key={p.label} className="spill"
              onClick={() => setSearch(p.query)}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats — pulled from live data */}
      <div className="hero-stats">
        {[
          [counts.all || 100, 'Companies'],
          [6,                  'Categories'],
          [48,                 'Features tracked'],
          ['32k',              'Monthly users'],
        ].map(([n, l]) => (
          <div key={l} className="stat-item">
            <div className="stat-num">{n}</div>
            <div className="stat-lbl">{l}</div>
          </div>
        ))}
      </div>
    </header>
  )
}

function Sidebar({ category, setCategory, sort, setSort, compare, setCompare, counts, onCompare }) {
  const sorts = [
    { v:'rank',    l:'Top ranked' },
    { v:'rating',  l:'Highest rated' },
    { v:'name',    l:'A-Z by name' },
    { v:'reviews', l:'Most reviewed' },
  ]

  return (
    <aside className="sidebar">

      {/* Categories — counts from live Supabase data */}
      <div className="sidebar-section slide-left">
        <div className="sidebar-title">Category</div>
        {CATEGORIES.map(cat => (
          <button key={cat}
            className={`cat-btn${category===cat?' active':''}`}
            onClick={() => setCategory(cat)}>
            <div className="cat-inner">
              {cat !== 'all' && (
                <span className="cat-dot"
                  style={{background: CAT_COLORS[cat]}} />
              )}
              {cat === 'all' ? 'All companies' : cat}
            </div>
            <span className="cat-count">
              {counts[cat] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="sidebar-section slide-left" style={{transitionDelay:'.08s'}}>
        <div className="sidebar-title">Sort by</div>
        {sorts.map(s => (
          <div key={s.v}
            className={`sort-opt${sort===s.v?' active':''}`}
            onClick={() => setSort(s.v)}>
            <div className="sort-radio">
              {sort===s.v && <div className="sort-radio-inner" />}
            </div>
            {s.l}
          </div>
        ))}
      </div>

      {/* Compare panel */}
      <div className="compare-panel slide-left" style={{transitionDelay:'.16s'}}>
        <div className="compare-panel-title">Compare companies</div>
        <div className="cslots">
          {[0,1,2].map(i => (
            <div key={i} className={`cslot${compare[i]?' filled':''}`}>
              <span>{compare[i]?.name || 'empty slot'}</span>
              {compare[i] && (
                <button className="cslot-rm"
                  onClick={() => setCompare(prev =>
                    prev.filter(x => x.id !== compare[i].id))}>
                  x
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          className={`btn-cmp${compare.length>=2?' ready':''}`}
          onClick={onCompare}
          disabled={compare.length < 2}>
          Compare now
        </button>
        <div className="cmp-hint">Select 2-3 companies</div>
      </div>

    </aside>
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
        {/* Logo */}
        <div className="logo-wrap">
          {(c.name||'').slice(0,2).toUpperCase()}
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

          {/* Tags */}
          {c.tag_list?.length > 0 && (
            <div className="card-tags">
              {c.tag_list.slice(0, 5).map(t => (
                <span key={t} className="tag"
                  style={{cursor:'pointer'}}
                  onClick={() => window.dispatchEvent(
                    new CustomEvent('search-tag', {detail: t}))}>
                  {t}
                </span>
              ))}
            </div>
          )}

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

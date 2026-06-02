'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

const CAT_META = {
  payments:  { label: 'Payments',  color: '#60a5fa', desc: 'Payment processing, wallets, remittances, POS, checkout, and BNPL platforms.' },
  banking:   { label: 'Banking',   color: '#00c4a0', desc: 'Digital banks, neobanks, and banking infrastructure providers.' },
  investing: { label: 'Investing', color: '#fbbf24', desc: 'Brokerage platforms, robo-advisors, and trading applications.' },
  crypto:    { label: 'Crypto',    color: '#c084fc', desc: 'Crypto exchanges, wallets, blockchain infrastructure, and custody.' },
  lending:   { label: 'Lending',   color: '#f87171', desc: 'Consumer and business lending, credit platforms, and BNPL.' },
  business:  { label: 'Business',  color: '#4ade80', desc: 'B2B fintech infrastructure, payroll, expense management, and finance operations.' },
}

function stars(r) {
  if (!r) return ''
  const f = Math.floor(r), h = (r%1)>=.5
  return '★'.repeat(f) + (h?'½':'') + '☆'.repeat(5-f-(h?1:0))
}

export default function CategoryPage() {
  const { slug } = useParams()
  const [companies, setCompanies] = useState([])
  const [loading, setLoading]     = useState(true)
  const meta = CAT_META[slug?.toLowerCase()] || null

  useEffect(() => {
    if (!meta) { setLoading(false); return }
    async function load() {
      const { data } = await supabase
        .from('companies')
        .select('*')
        .eq('is_active', true)
        .eq('category', meta.label)
        .order('rank')
      if (data) setCompanies(data)
      setLoading(false)
    }
    load()
  }, [slug])

  if (!meta) return (
    <div style={{textAlign:'center',padding:'4rem 2rem',position:'relative',zIndex:1}}>
      <div style={{fontSize:'2rem',marginBottom:'1rem'}}>404</div>
      <div style={{fontFamily:'var(--font)',fontWeight:400,fontSize:'1.2rem',color:'var(--text)',marginBottom:8}}>Category not found</div>
      <a href="/" style={{color:'var(--accent)',textDecoration:'none',fontSize:14}}>Back to home</a>
    </div>
  )

  return (
    <div style={{maxWidth:1000,margin:'0 auto',padding:'3rem 2rem 5rem',position:'relative',zIndex:1}}>

      {/* Header */}
      <div className="fade-in" style={{marginBottom:'3rem'}}>
        <a href="/" style={{fontSize:12,fontWeight:300,color:'var(--dim)',textDecoration:'none',
          letterSpacing:'.04em',display:'inline-flex',alignItems:'center',gap:6,marginBottom:'1.5rem',
          transition:'color .15s'}}
          onMouseEnter={e=>e.target.style.color='var(--muted)'}
          onMouseLeave={e=>e.target.style.color='var(--dim)'}>
          ← All companies
        </a>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:'1rem'}}>
          <div style={{width:12,height:12,borderRadius:'50%',background:meta.color,
            boxShadow:`0 0 12px ${meta.color}66`}} />
          <span style={{fontSize:10,fontWeight:600,letterSpacing:'.2em',textTransform:'uppercase',
            color:meta.color}}>Category</span>
        </div>
        <h1 style={{fontFamily:'var(--font)',fontWeight:200,fontSize:'clamp(2rem,4vw,3rem)',
          letterSpacing:'-.03em',lineHeight:1.1,marginBottom:'.75rem',color:'var(--text)'}}>
          {meta.label} <span style={{fontWeight:400,color:meta.color}}>companies</span>
        </h1>
        <p style={{fontSize:14,fontWeight:300,color:'var(--muted)',lineHeight:1.7,maxWidth:500}}>
          {meta.desc}
        </p>
        <div style={{fontSize:12,fontWeight:300,color:'var(--dim)',marginTop:'1rem'}}>
          {loading ? '...' : `${companies.length} companies`}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {[...Array(5)].map((_,i) => (
            <div key={i} className="skeleton" style={{height:180,borderRadius:10}} />
          ))}
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {companies.map((c, i) => (
            <div key={c.id} className="company-card fade-up"
              style={{transitionDelay:`${Math.min(i*.04,.5)}s`}}>
              <div className="card-main">
                <div className="logo-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${(c.website||'').replace(/^https?:\/\/(www\.)?/,'').split('/')[0]}&sz=64`}
                    alt={c.name}
                    width={32} height={32}
                    onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='block'}}
                    style={{width:32,height:32,objectFit:'contain',borderRadius:4,display:'block'}}
                  />
                  <span style={{display:'none',fontFamily:'var(--font)',fontWeight:500,
                    fontSize:12,color:'var(--muted)',letterSpacing:'.04em'}}>
                    {c.name.slice(0,2).toUpperCase()}
                  </span>
                  <div className="rank-badge">{c.rank}</div>
                </div>
                <div className="card-body">
                  <div className="card-header">
                    <div className="card-title-group">
                      <span className="company-name">{c.name}</span>
                      {c.badge && (
                        <span className={`badge b-${c.badge==='featured'?'feat':c.badge==='popular'?'pop':'new'}`}>
                          {c.badge.charAt(0).toUpperCase()+c.badge.slice(1)}
                        </span>
                      )}
                    </div>
                    <div className="card-right-meta">
                      <div className="rating-block">
                        <div className="stars">{stars(c.rating)}</div>
                        <div className="rating-num">{c.rating} - {(c.review_count||0).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  <div className="company-url">
                    <a href={c.website} target="_blank" rel="noopener noreferrer">
                      {(c.website||'').replace('https://','').replace('www.','')}
                    </a>
                  </div>
                  <div className="company-desc">{c.description}</div>
                  <div className="card-footer">
                    <div className="pricing"><strong>Pricing:</strong> {c.pricing}</div>
                    <div style={{display:'flex',gap:7}}>
                      <a href={`/review/${c.slug}`} className="btn-review">Full review</a>
                      <a href={c.affiliate_url||c.website} target="_blank"
                        rel="noopener noreferrer" className="btn-visit">Visit site</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

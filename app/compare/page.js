'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'

// Pre-built popular comparisons
const POPULAR = [
  { label: 'Stripe vs PayPal vs Adyen', ids: ['stripe','paypal','adyen'], category: 'Payments' },
  { label: 'Revolut vs Wise vs Monzo', ids: ['revolut','wise','monzo'], category: 'Banking' },
  { label: 'Coinbase vs Binance vs Kraken', ids: ['coinbase','binance','kraken'], category: 'Crypto' },
  { label: 'Brex vs Ramp vs Mercury', ids: ['brex','ramp','mercury'], category: 'Business' },
  { label: 'Robinhood vs eToro vs Webull', ids: ['robinhood','etoro','webull'], category: 'Investing' },
  { label: 'Klarna vs Afterpay vs Affirm', ids: ['klarna','afterpay','affirm'], category: 'Payments' },
  { label: 'Wise vs Remitly vs WorldRemit', ids: ['wise','remitly','worldremit'], category: 'Remittance' },
  { label: 'Gusto vs Deel vs Rippling', ids: ['gusto','deel','navan'], category: 'Business' },
  { label: 'Wealthfront vs Betterment vs Acorns', ids: ['wealthfront','betterment','acorns'], category: 'Investing' },
  { label: 'Monzo vs Starling vs N26', ids: ['monzo','starling-bank','n26'], category: 'Banking' },
]

const FEATURES = [
  { key: 'category',      label: 'Category' },
  { key: 'rating',        label: 'Rating' },
  { key: 'pricing',       label: 'Pricing' },
  { key: 'pricing_model', label: 'Pricing model' },
  { key: 'founded_year',  label: 'Founded' },
  { key: 'hq_country',    label: 'HQ' },
  { key: 'website',       label: 'Website' },
]

function stars(r) {
  if (!r) return '-'
  const f = Math.floor(r), h = (r%1)>=.5
  return '★'.repeat(f) + (h?'½':'') + '☆'.repeat(5-f-(h?1:0))
}

function ComparePageInner() {
  const searchParams = useSearchParams()
  const [allCompanies, setAllCompanies] = useState([])
  const [selected, setSelected]         = useState([])
  const [search, setSearch]             = useState('')
  const [loading, setLoading]           = useState(true)
  const [activePreset, setActivePreset] = useState(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('companies')
        .select('*')
        .eq('is_active', true)
        .order('rank')
      if (data) setAllCompanies(data)
      setLoading(false)
    }
    load()
  }, [])

  // Load from URL params e.g. /compare?ids=stripe,paypal
  useEffect(() => {
    const ids = searchParams.get('ids')
    if (ids && allCompanies.length > 0) {
      const slugs = ids.split(',')
      const found = slugs
        .map(s => allCompanies.find(c => c.id == s || c.slug === s))
        .filter(Boolean)
        .slice(0, 3)
      if (found.length > 0) setSelected(found)
    }
  }, [searchParams, allCompanies])

  async function loadPreset(preset) {
    setActivePreset(preset.label)
    const { data } = await supabase
      .from('companies')
      .select('*')
      .in('slug', preset.ids)
    if (data) {
      // Sort by preset order
      const sorted = preset.ids
        .map(slug => data.find(c => c.slug === slug))
        .filter(Boolean)
      setSelected(sorted)
    }
  }

  function addCompany(company) {
    if (selected.find(c => c.id === company.id)) return
    if (selected.length >= 3) return
    setSelected(prev => [...prev, company])
    setSearch('')
  }

  function removeCompany(id) {
    setSelected(prev => prev.filter(c => c.id !== id))
    setActivePreset(null)
  }

  const searchResults = search.trim()
    ? allCompanies
        .filter(c =>
          c.name.toLowerCase().includes(search.toLowerCase()) &&
          !selected.find(s => s.id === c.id)
        )
        .slice(0, 6)
    : []

  const catColors = {
    Payments:'#60a5fa', Banking:'var(--accent)', Investing:'#fbbf24',
    Crypto:'#c084fc', Lending:'var(--red)', Business:'var(--green)',
    Remittance:'#fb923c',
  }

  return (
    <div style={{maxWidth:1100,margin:'0 auto',padding:'3rem 2rem 5rem',position:'relative',zIndex:1}}>

      {/* Header */}
      <div className="fade-in" style={{marginBottom:'3rem'}}>
        <div style={{fontSize:10,fontWeight:500,letterSpacing:'.22em',textTransform:'uppercase',
          color:'var(--accent)',display:'flex',alignItems:'center',gap:8,marginBottom:'1rem'}}>
          <span style={{width:5,height:5,borderRadius:'50%',background:'var(--accent)',display:'inline-block'}}></span>
          Side-by-side comparison
        </div>
        <h1 style={{fontFamily:'var(--font)',fontWeight:200,fontSize:'clamp(2rem,4vw,3rem)',
          letterSpacing:'-.03em',lineHeight:1.1,marginBottom:'.75rem'}}>
          Compare <em style={{fontStyle:'normal',color:'var(--accent)',fontWeight:400}}>fintech</em> companies
        </h1>
        <p style={{fontSize:14,fontWeight:300,color:'var(--muted)',lineHeight:1.7,maxWidth:500}}>
          Select up to 3 companies to compare side-by-side, or choose a popular comparison below.
        </p>
      </div>

      {/* Popular presets */}
      <div className="fade-up" style={{marginBottom:'2.5rem'}}>
        <div style={{fontSize:9,fontWeight:600,letterSpacing:'.2em',textTransform:'uppercase',
          color:'var(--dim)',marginBottom:'1rem'}}>Popular comparisons</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
          {POPULAR.map(p => (
            <button key={p.label} onClick={() => loadPreset(p)}
              style={{
                fontSize:12,fontWeight:300,padding:'6px 14px',
                borderRadius:4,border:`1px solid ${activePreset===p.label?'rgba(0,196,160,.4)':'var(--border)'}`,
                background: activePreset===p.label?'rgba(0,196,160,.08)':'transparent',
                color: activePreset===p.label?'var(--accent)':'var(--muted)',
                cursor:'pointer',fontFamily:'var(--font)',transition:'all .15s',
                display:'flex',alignItems:'center',gap:7,
              }}>
              <span style={{fontSize:10,padding:'1px 6px',borderRadius:2,
                background: catColors[p.category]
                  ? `${catColors[p.category]}22` : 'rgba(255,255,255,.08)',
                color: catColors[p.category] || 'var(--muted)',
                fontWeight:500,letterSpacing:'.06em',textTransform:'uppercase'}}>
                {p.category}
              </span>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Manual selector */}
      <div className="fade-up" style={{marginBottom:'2.5rem'}}>
        <div style={{fontSize:9,fontWeight:600,letterSpacing:'.2em',textTransform:'uppercase',
          color:'var(--dim)',marginBottom:'1rem'}}>Or build your own</div>

        {/* Search FIRST — more intuitive */}
        {selected.length < 3 && (
          <div style={{position:'relative',maxWidth:500,marginBottom:'1.25rem'}}>
            <div style={{fontSize:12,fontWeight:300,color:'var(--muted)',marginBottom:8}}>
              Search and add up to 3 companies to compare:
            </div>
            <div style={{display:'flex',alignItems:'center',
              background:'var(--bg2)',border:'1px solid rgba(0,196,160,.25)',
              borderRadius:6,transition:'border-color .2s',boxShadow:'0 0 0 3px rgba(0,196,160,.06)'}}
              onFocus={e=>e.currentTarget.style.borderColor='rgba(0,196,160,.5)'}
              onBlur={e=>e.currentTarget.style.borderColor='rgba(0,196,160,.25)'}>
              <span style={{padding:'0 12px',color:'var(--accent)',fontSize:14}}>⌕</span>
              <input type="text" value={search} onChange={e=>setSearch(e.target.value)}
                placeholder={`Search company to add (${3 - selected.length} slot${3-selected.length!==1?'s':''} remaining)...`}
                autoFocus
                style={{flex:1,padding:'12px 0',fontSize:13,fontFamily:'var(--font)',
                  fontWeight:300,background:'transparent',border:'none',outline:'none',
                  color:'var(--text)'}} />
              {search && (
                <button onClick={()=>setSearch('')}
                  style={{padding:'0 12px',background:'none',border:'none',
                    color:'var(--dim)',cursor:'pointer',fontSize:14}}>✕</button>
              )}
            </div>

            {/* Search dropdown */}
            {searchResults.length > 0 && (
              <div style={{position:'absolute',top:'calc(100% + 4px)',left:0,right:0,
                background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:8,
                overflow:'hidden',zIndex:50,boxShadow:'0 8px 32px rgba(0,0,0,0.4)'}}>
                {searchResults.map(c => (
                  <div key={c.id} onClick={() => addCompany(c)}
                    style={{display:'flex',alignItems:'center',gap:12,padding:'.75rem 1rem',
                      cursor:'pointer',fontSize:13,color:'var(--text)',
                      borderBottom:'1px solid var(--border)',transition:'background .15s'}}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(0,196,160,.06)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <div style={{width:32,height:32,borderRadius:6,
                      background:'rgba(255,255,255,.06)',border:'1px solid var(--border)',
                      display:'flex',alignItems:'center',justifyContent:'center',
                      fontSize:11,fontWeight:500,color:'var(--muted)',flexShrink:0,overflow:'hidden'}}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${(c.website||'').replace(/^https?:\/\/(www\.)?/,'').split('/')[0]}&sz=32`}
                        alt={c.name}
                        onError={e=>{e.target.style.display='none'}}
                        style={{width:20,height:20,objectFit:'contain'}}
                      />
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:400,color:'var(--text)'}}>{c.name}</div>
                      <div style={{fontSize:11,color:'var(--dim)'}}>{c.category}</div>
                    </div>
                    <div style={{color:'var(--gold)',fontSize:11}}>★ {c.rating}</div>
                    <div style={{fontSize:11,color:'var(--accent)',fontWeight:500}}>+ Add</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Selected slots — shown after search */}
        {selected.length > 0 && (
          <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:'1rem'}}>
            {selected.map((c, i) => (
              <div key={c.id} style={{
                flex:1, minWidth:160,
                background:'rgba(0,196,160,.06)',
                border:'1px solid rgba(0,196,160,.3)',
                borderRadius:8, padding:'.85rem 1rem',
                display:'flex', alignItems:'center', justifyContent:'space-between',
                gap:8, minHeight:52, transition:'all .2s',
              }}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{width:32,height:32,borderRadius:6,
                    background:'rgba(255,255,255,.06)',border:'1px solid var(--border)',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:11,fontWeight:500,color:'var(--muted)',overflow:'hidden',flexShrink:0}}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${(c.website||'').replace(/^https?:\/\/(www\.)?/,'').split('/')[0]}&sz=32`}
                      alt={c.name}
                      onError={e=>{e.target.style.display='none'}}
                      style={{width:20,height:20,objectFit:'contain'}}
                    />
                  </div>
                  <div>
                    <div style={{fontSize:13,fontWeight:500,color:'var(--text)'}}>{c.name}</div>
                    <div style={{fontSize:10,color:'var(--dim)'}}>{c.category}</div>
                  </div>
                </div>
                <button onClick={() => removeCompany(c.id)}
                  style={{background:'none',border:'none',color:'var(--dim)',cursor:'pointer',
                    fontSize:16,lineHeight:1,padding:'0 2px',transition:'color .15s'}}
                  onMouseEnter={e=>e.target.style.color='var(--red)'}
                  onMouseLeave={e=>e.target.style.color='var(--dim)'}>
                  ×
                </button>
              </div>
            ))}
            {/* Empty slots indicator */}
            {selected.length < 3 && [...Array(3 - selected.length)].map((_, i) => (
              <div key={i} style={{
                flex:1, minWidth:160,
                background:'transparent',
                border:'1px dashed rgba(255,255,255,.1)',
                borderRadius:8, padding:'.85rem 1rem',
                display:'flex', alignItems:'center',
                minHeight:52, color:'var(--dim)', fontSize:12, fontWeight:300,
              }}>
                + Add company {selected.length + i + 1}
              </div>
            ))}
          </div>
        )}

        {/* Empty state — no selections yet */}
        {selected.length === 0 && (
          <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:'1rem'}}>
            {[1,2,3].map(i => (
              <div key={i} style={{
                flex:1, minWidth:160,
                background:'transparent',
                border:'1px dashed rgba(255,255,255,.1)',
                borderRadius:8, padding:'.85rem 1rem',
                display:'flex', alignItems:'center',
                minHeight:52, color:'var(--dim)', fontSize:12, fontWeight:300,
              }}>
                + Company {i}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comparison table */}
      {selected.length >= 2 ? (
        <div className="fade-up">
          <div style={{fontSize:9,fontWeight:600,letterSpacing:'.2em',textTransform:'uppercase',
            color:'var(--dim)',marginBottom:'1.25rem'}}>Comparison</div>

          <div style={{background:'var(--card-bg)',border:'1px solid var(--border)',
            borderRadius:10,overflow:'hidden'}}>

            {/* Company header row */}
            <div style={{display:'grid',
              gridTemplateColumns:`200px repeat(${selected.length}, 1fr)`,
              borderBottom:'1px solid var(--border)',background:'var(--bg2)'}}>
              <div style={{padding:'.85rem 1.25rem'}}></div>
              {selected.map(c => (
                <div key={c.id} style={{padding:'.85rem 1.25rem',
                  borderLeft:'1px solid var(--border)',textAlign:'center'}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'center',
                    gap:8,marginBottom:4}}>
                    <div style={{width:32,height:32,borderRadius:6,
                      background:'rgba(255,255,255,.06)',border:'1px solid var(--border)',
                      display:'flex',alignItems:'center',justifyContent:'center',
                      overflow:'hidden',flexShrink:0}}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${(c.website||'').replace(/^https?:\/\/(www\.)?/,'').split('/')[0]}&sz=64`}
                        alt={c.name}
                        onError={e=>{e.target.style.display='none'}}
                        style={{width:24,height:24,objectFit:'contain',borderRadius:3}}
                      />
                    </div>
                    <span style={{fontWeight:500,color:'var(--text)',fontSize:14}}>{c.name}</span>
                  </div>
                  <div style={{color:'var(--gold)',fontSize:12}}>
                    {'★'.repeat(Math.round(c.rating||0))} {c.rating}
                  </div>
                  <div style={{marginTop:8}}>
                    <a href={c.affiliate_url||c.website} target="_blank" rel="noopener noreferrer"
                      style={{fontSize:11,fontWeight:500,padding:'5px 14px',borderRadius:4,
                        background:'var(--accent)',color:'#000',textDecoration:'none',
                        display:'inline-block',transition:'opacity .15s'}}
                      onMouseEnter={e=>e.target.style.opacity='.85'}
                      onMouseLeave={e=>e.target.style.opacity='1'}>
                      Visit site
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature rows */}
            {FEATURES.map((f, i) => (
              <div key={f.key}
                style={{display:'grid',
                  gridTemplateColumns:`200px repeat(${selected.length}, 1fr)`,
                  borderBottom: i < FEATURES.length-1 ? '1px solid var(--border)' : 'none',
                  background: i%2===0 ? 'transparent' : 'rgba(255,255,255,.01)'}}>
                <div style={{padding:'.75rem 1.25rem',fontSize:12,fontWeight:400,
                  color:'var(--dim)',display:'flex',alignItems:'center'}}>
                  {f.label}
                </div>
                {selected.map(c => {
                  let val = c[f.key]
                  if (f.key === 'rating') val = `${val} (${(c.review_count||0).toLocaleString()} reviews)`
                  if (f.key === 'website') val = (val||'').replace('https://','').replace('www.','')
                  return (
                    <div key={c.id}
                      style={{padding:'.75rem 1.25rem',fontSize:13,fontWeight:300,
                        color:'var(--text)',borderLeft:'1px solid var(--border)',
                        display:'flex',alignItems:'center',justifyContent:'center',
                        textAlign:'center'}}>
                      {val || <span style={{color:'var(--dim)'}}>-</span>}
                    </div>
                  )
                })}
              </div>
            ))}

            {/* Pros row */}
            <div style={{display:'grid',
              gridTemplateColumns:`200px repeat(${selected.length}, 1fr)`,
              borderTop:'1px solid var(--border)'}}>
              <div style={{padding:'.75rem 1.25rem',fontSize:12,fontWeight:400,
                color:'var(--dim)',display:'flex',alignItems:'center'}}>
                Key strengths
              </div>
              {selected.map(c => (
                <CompanyPros key={c.id} companyId={c.id} />
              ))}
            </div>

            {/* CTA row */}
            <div style={{display:'grid',
              gridTemplateColumns:`200px repeat(${selected.length}, 1fr)`,
              borderTop:'1px solid var(--border)',
              background:'rgba(0,196,160,.03)'}}>
              <div style={{padding:'1rem 1.25rem',fontSize:12,color:'var(--dim)',
                display:'flex',alignItems:'center'}}>
                Full review
              </div>
              {selected.map(c => (
                <div key={c.id} style={{padding:'1rem 1.25rem',
                  borderLeft:'1px solid var(--border)',
                  display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                  <a href={`/review/${c.slug}`}
                    style={{fontSize:11,fontWeight:300,padding:'5px 12px',borderRadius:4,
                      border:'1px solid var(--border)',color:'var(--muted)',
                      textDecoration:'none',transition:'all .15s'}}
                    onMouseEnter={e=>{e.target.style.borderColor='var(--borderh)';e.target.style.color='var(--text)'}}
                    onMouseLeave={e=>{e.target.style.borderColor='var(--border)';e.target.style.color='var(--muted)'}}>
                    Read review
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="fade-up" style={{textAlign:'center',padding:'3rem',
          background:'var(--bg2)',border:'1px solid var(--border)',
          borderRadius:10}}>
          <div style={{fontSize:'2rem',marginBottom:'.75rem'}}>⇄</div>
          <div style={{fontFamily:'var(--font)',fontWeight:400,fontSize:'1rem',
            color:'var(--text)',marginBottom:6}}>
            Select at least 2 companies
          </div>
          <div style={{fontSize:13,fontWeight:300,color:'var(--muted)'}}>
            Choose a popular comparison above or search for companies to compare
          </div>
        </div>
      )}
    </div>
  )
}

function CompanyPros({ companyId }) {
  const [pros, setPros] = useState([])
  useEffect(() => {
    supabase.from('pros_cons').select('text')
      .eq('company_id', companyId).eq('type', 'pro')
      .order('sort_order').limit(3)
      .then(({ data }) => { if (data) setPros(data) })
  }, [companyId])

  return (
    <div style={{padding:'.75rem 1.25rem',borderLeft:'1px solid var(--border)'}}>
      {pros.length > 0 ? pros.map((p,i) => (
        <div key={i} style={{fontSize:12,fontWeight:300,color:'var(--muted)',
          padding:'3px 0',display:'flex',gap:7,alignItems:'flex-start',lineHeight:1.5}}>
          <span style={{color:'var(--green)',flexShrink:0,marginTop:1}}>+</span>
          {p.text}
        </div>
      )) : (
        <span style={{fontSize:12,color:'var(--dim)'}}>-</span>
      )}
    </div>
  )
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div style={{maxWidth:1100,margin:'0 auto',padding:'3rem 2rem'}}>
        <div className="skeleton" style={{height:60,borderRadius:8,marginBottom:'1rem'}} />
        <div className="skeleton" style={{height:200,borderRadius:8}} />
      </div>
    }>
      <ComparePageInner />
    </Suspense>
  )
}

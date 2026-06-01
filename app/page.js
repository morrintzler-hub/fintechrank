'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'

const CATEGORIES = ['all','Payments','Banking','Investing','Crypto','Lending','Business']
const CAT_COLORS = {
  Payments:'#60a5fa', Banking:'#00d4aa', Investing:'#fbbf24',
  Crypto:'#c084fc', Lending:'#f87171', Business:'#4ade80'
}

function stars(r) {
  const f = Math.floor(r), h = (r%1)>=.5
  return '★'.repeat(f) + (h?'½':'') + '☆'.repeat(5-f-(h?1:0))
}

export default function HomePage() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('rank')
  const [compare, setCompare] = useState([])
  const [visible, setVisible] = useState(20)
  const [counts, setCounts] = useState({})

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('companies_with_tags')
        .select('*')
        .eq('is_active', true)
        .order('rank')
      if (data) {
        setCompanies(data)
        const c = {}
        CATEGORIES.slice(1).forEach(cat => {
          c[cat] = data.filter(x => x.category === cat).length
        })
        c.all = data.length
        setCounts(c)
      }
      setLoading(false)
    }
    load()
  }, [])

  const filtered = companies
    .filter(c => {
      const matchCat = category === 'all' || c.category === category
      const q = search.toLowerCase()
      const matchSearch = !q || c.name.toLowerCase().includes(q) ||
        (c.description||'').toLowerCase().includes(q) ||
        (c.tag_list||[]).some(t => t.toLowerCase().includes(q)) ||
        c.category.toLowerCase().includes(q)
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
      if (prev.find(x=>x.id===id)) return prev.filter(x=>x.id!==id)
      if (prev.length >= 3) return prev
      return [...prev, {id, name}]
    })
  }

  return (
    <div style={{background:'var(--navy)'}}>
      <Hero search={search} setSearch={setSearch} counts={counts} />

      <div style={{maxWidth:1200,margin:'0 auto',padding:'2.5rem 1.5rem 4rem',display:'grid',gridTemplateColumns:'240px 1fr',gap:'2rem',alignItems:'start'}}>

        <Sidebar
          category={category} setCategory={setCategory}
          sort={sort} setSort={setSort}
          compare={compare} setCompare={setCompare}
          counts={counts}
        />

        <div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.25rem',flexWrap:'wrap',gap:8}}>
            <div style={{fontSize:13,color:'var(--muted)'}}>
              Showing <strong style={{color:'var(--text)'}}>{Math.min(visible,filtered.length)}</strong> of <strong style={{color:'var(--text)'}}>{filtered.length}</strong> companies
            </div>
            {search && (
              <button onClick={()=>setSearch('')} style={{fontSize:12,padding:'4px 10px',borderRadius:20,border:'1px solid var(--border)',background:'transparent',color:'var(--muted)',cursor:'pointer'}}>
                Clear "{search}" ✕
              </button>
            )}
          </div>

          {loading ? (
            <div className="stagger" style={{display:'flex',flexDirection:'column',gap:12}}>
              {[...Array(6)].map((_,i) => (
                <div key={i} className="skeleton fade-up" style={{height:220,borderRadius:'var(--r)'}} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{textAlign:'center',padding:'3rem',color:'var(--muted)'}}>
              <div style={{fontSize:'2rem',marginBottom:8}}>🔍</div>
              <div style={{fontFamily:'var(--heading)',fontSize:'1.1rem',color:'var(--text)',marginBottom:6}}>No companies found</div>
              <div style={{fontSize:13}}>Try a different search term or category</div>
            </div>
          ) : (
            <div className="stagger" style={{display:'flex',flexDirection:'column',gap:12}}>
              {filtered.slice(0, visible).map((c,i) => (
                <CompanyCard
                  key={c.id} company={c} index={i}
                  inCompare={!!compare.find(x=>x.id===c.id)}
                  onToggleCompare={() => toggleCompare(c.id, c.name)}
                />
              ))}
            </div>
          )}

          {visible < filtered.length && (
            <div className="fade-up" style={{textAlign:'center',marginTop:'2rem'}}>
              <button className="btn-secondary" onClick={() => setVisible(v=>v+20)}>
                Load more companies ↓
              </button>
              <div style={{fontSize:12,color:'var(--dim)',marginTop:8}}>
                {filtered.length - visible} more
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          .page-grid{grid-template-columns:1fr!important}
        }
      `}</style>
    </div>
  )
}

function Hero({ search, setSearch, counts }) {
  return (
    <div style={{position:'relative',overflow:'hidden',padding:'80px 2rem 60px',textAlign:'center',background:'radial-gradient(ellipse 60% 50% at 50% -5%,rgba(37,99,235,.22) 0%,transparent 65%)'}}>
      <div style={{position:'absolute',inset:0,opacity:.04,backgroundImage:'linear-gradient(rgba(255,255,255,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.07) 1px,transparent 1px)',backgroundSize:'40px 40px',pointerEvents:'none'}} />

      <div style={{position:'relative',zIndex:1,maxWidth:720,margin:'0 auto'}}>
        <div className="fade-up" style={{display:'inline-flex',alignItems:'center',gap:8,fontSize:11,fontWeight:500,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--accent)',border:'1px solid rgba(0,212,170,.2)',borderRadius:20,padding:'5px 14px',marginBottom:'1.5rem'}}>
          <span style={{width:6,height:6,borderRadius:'50%',background:'var(--accent)',display:'inline-block'}}></span>
          Independent Fintech Research
        </div>

        <h1 className="fade-up" style={{fontFamily:'var(--heading)',fontSize:'clamp(2.2rem,5vw,3.6rem)',fontWeight:800,lineHeight:1.1,letterSpacing:'-.03em',marginBottom:'1.25rem',animationDelay:'.1s'}}>
          Compare the world's<br /><em style={{fontStyle:'normal',color:'var(--accent)'}}>top 100 fintech</em><br /><strong style={{fontStyle:'normal',color:'var(--blue)'}}>companies</strong>
        </h1>

        <p className="fade-up" style={{fontSize:16,color:'var(--muted)',lineHeight:1.7,maxWidth:540,margin:'0 auto 2.5rem',animationDelay:'.2s'}}>
          Unbiased ratings, feature breakdowns, and side-by-side comparisons. Updated in real time by our community.
        </p>

        <div className="fade-up" style={{maxWidth:580,margin:'0 auto 1.5rem',animationDelay:'.3s'}}>
          <div style={{display:'flex',alignItems:'center',background:'var(--navy2)',border:'1px solid rgba(255,255,255,.12)',borderRadius:'var(--r)',overflow:'hidden',transition:'border-color .2s,box-shadow .2s'}}
            onFocus={e=>e.currentTarget.style.borderColor='var(--blue)'}
            onBlur={e=>e.currentTarget.style.borderColor='rgba(255,255,255,.12)'}
          >
            <span style={{padding:'0 16px',color:'var(--dim)',fontSize:18,flexShrink:0}}>⌕</span>
            <input
              type="text" value={search}
              onChange={e=>setSearch(e.target.value)}
              placeholder="Search company, feature, or use case…"
              style={{flex:1,padding:'15px 0',fontSize:15,fontFamily:'var(--font)',background:'transparent',border:'none',outline:'none',color:'var(--text)'}}
            />
            {search && (
              <button onClick={()=>setSearch('')} style={{padding:'0 16px',background:'none',border:'none',color:'var(--dim)',cursor:'pointer',fontSize:16}}>✕</button>
            )}
          </div>

          <div style={{display:'flex',gap:8,justifyContent:'center',flexWrap:'wrap',marginTop:12}}>
            {['Payments','Neobank','Crypto exchange','BNPL','Payroll','Remittance','Africa','India'].map(q => (
              <button key={q} onClick={()=>setSearch(q)}
                style={{fontSize:12,padding:'5px 12px',borderRadius:20,border:'1px solid var(--border)',color:'var(--muted)',cursor:'pointer',background:'transparent',fontFamily:'var(--font)',transition:'all .15s'}}
                onMouseEnter={e=>{e.target.style.borderColor='var(--borderh)';e.target.style.color='var(--text)'}}
                onMouseLeave={e=>{e.target.style.borderColor='var(--border)';e.target.style.color='var(--muted)'}}
              >{q}</button>
            ))}
          </div>
        </div>

        <div className="fade-up" style={{display:'flex',justifyContent:'center',gap:'3rem',paddingTop:'2.5rem',marginTop:'2.5rem',borderTop:'1px solid var(--border)',animationDelay:'.4s'}}>
          {[
            ['100', 'Companies'],
            ['6',   'Categories'],
            ['48',  'Features tracked'],
            ['32k', 'Monthly users'],
          ].map(([n,l]) => (
            <div key={l} style={{textAlign:'center'}}>
              <div style={{fontFamily:'var(--heading)',fontSize:'1.8rem',fontWeight:700,lineHeight:1}}>
                {n.replace(/\d+/,m=>`${m}`)}
              </div>
              <div style={{fontSize:12,color:'var(--dim)',marginTop:4,textTransform:'uppercase',letterSpacing:'.08em'}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Sidebar({ category, setCategory, sort, setSort, compare, setCompare, counts }) {
  const sorts = [
    {v:'rank',   l:'Top ranked'},
    {v:'rating', l:'Highest rated'},
    {v:'name',   l:'A–Z by name'},
    {v:'reviews',l:'Most reviewed'},
  ]
  return (
    <div style={{position:'sticky',top:80}}>
      {/* Categories */}
      <div className="slide-left" style={{marginBottom:'1.75rem'}}>
        <div style={{fontSize:10,fontWeight:600,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--dim)',marginBottom:10}}>Category</div>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={()=>setCategory(cat)}
            style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%',padding:'8px 12px',borderRadius:'var(--rsm)',border:`1px solid ${category===cat?'rgba(59,130,246,.25)':'transparent'}`,background:category===cat?'rgba(37,99,235,.12)':'transparent',color:category===cat?'var(--blue)':'var(--muted)',fontFamily:'var(--font)',fontSize:13,cursor:'pointer',marginBottom:3,transition:'all .15s',textAlign:'left'}}
          >
            <span style={{display:'flex',alignItems:'center',gap:10}}>
              {cat!=='all' && <span style={{width:8,height:8,borderRadius:'50%',background:CAT_COLORS[cat],flexShrink:0}} />}
              {cat === 'all' ? 'All companies' : cat}
            </span>
            <span style={{fontSize:11,padding:'1px 7px',borderRadius:10,background:category===cat?'rgba(59,130,246,.2)':'rgba(255,255,255,.06)',color:category===cat?'var(--blue)':'var(--dim)'}}>
              {counts[cat] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="slide-left" style={{marginBottom:'1.75rem',animationDelay:'.1s'}}>
        <div style={{fontSize:10,fontWeight:600,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--dim)',marginBottom:10}}>Sort by</div>
        {sorts.map(s => (
          <div key={s.v} onClick={()=>setSort(s.v)}
            style={{display:'flex',alignItems:'center',gap:8,padding:'7px 10px',borderRadius:6,cursor:'pointer',fontSize:13,color:sort===s.v?'var(--accent)':'var(--muted)',transition:'all .15s'}}
          >
            <div style={{width:14,height:14,borderRadius:'50%',border:`1.5px solid ${sort===s.v?'var(--accent)':'var(--dim)'}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              {sort===s.v && <div style={{width:6,height:6,borderRadius:'50%',background:'var(--accent)'}} />}
            </div>
            {s.l}
          </div>
        ))}
      </div>

      {/* Compare panel */}
      <div className="slide-left" style={{background:'var(--navy2)',border:'1px solid var(--border)',borderRadius:'var(--r)',padding:'1rem',animationDelay:'.2s'}}>
        <div style={{fontFamily:'var(--heading)',fontSize:13,fontWeight:700,color:'var(--text)',marginBottom:10}}>⇄ Compare</div>
        <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:12}}>
          {[0,1,2].map(i => (
            <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'7px 10px',borderRadius:'var(--rsm)',border:`1px ${compare[i]?'solid':'dashed'} ${compare[i]?'rgba(0,212,170,.3)':'rgba(255,255,255,.1)'}`,fontSize:12,color:compare[i]?'var(--accent)':'var(--dim)',background:compare[i]?'rgba(0,212,170,.06)':'transparent',minHeight:34,transition:'all .2s'}}>
              <span>{compare[i]?.name || '— empty slot —'}</span>
              {compare[i] && (
                <button onClick={()=>setCompare(prev=>prev.filter(x=>x.id!==compare[i].id))} style={{background:'none',border:'none',color:'var(--dim)',cursor:'pointer',fontSize:14,lineHeight:1}}>×</button>
              )}
            </div>
          ))}
        </div>
        <a href={compare.length>=2 ? `/compare?ids=${compare.map(x=>x.id).join(',')}` : '#'}
          style={{display:'block',width:'100%',padding:9,borderRadius:'var(--rsm)',border:'none',background:compare.length>=2?'var(--accent)':'var(--navy3)',color:compare.length>=2?'#000':'var(--dim)',fontFamily:'var(--font)',fontSize:13,fontWeight:600,cursor:compare.length>=2?'pointer':'not-allowed',textAlign:'center',textDecoration:'none',opacity:compare.length>=2?1:.4,transition:'all .2s'}}
        >Compare now →</a>
        <div style={{fontSize:11,color:'var(--dim)',textAlign:'center',marginTop:8}}>Select 2–3 companies</div>
      </div>
    </div>
  )
}

function CompanyCard({ company: c, index, inCompare, onToggleCompare }) {
  const delay = `${Math.min(index * 0.04, 0.5)}s`
  const catKey = c.category?.replace(/\s/g,'')
  const badgeMap = { featured:'Featured', popular:'Popular', new:'New' }
  const badgeStyle = {
    featured: {background:'rgba(37,99,235,.2)',color:'#60a5fa',border:'1px solid rgba(59,130,246,.25)'},
    popular:  {background:'rgba(245,158,11,.15)',color:'#fbbf24',border:'1px solid rgba(245,158,11,.25)'},
    new:      {background:'rgba(0,212,170,.12)',color:'var(--accent)',border:'1px solid rgba(0,212,170,.25)'},
  }

  return (
    <div className={`fade-up card-hover`}
      style={{background:'var(--navy2)',border:`1px solid ${inCompare?'rgba(0,212,170,.4)':'var(--border)'}`,borderRadius:'var(--r)',padding:'1.25rem 1.5rem',transitionDelay:delay,position:'relative',overflow:'hidden'}}
    >
      <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(255,255,255,.06),transparent)'}} />

      <div style={{display:'flex',gap:'1rem',alignItems:'flex-start'}}>
        {/* Logo */}
        <div style={{width:52,height:52,flexShrink:0,borderRadius:10,background:'var(--navy3)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--heading)',fontWeight:800,fontSize:13,color:'var(--muted)',position:'relative'}}>
          {c.abbr || c.name.slice(0,2).toUpperCase()}
          <div style={{position:'absolute',bottom:-6,right:-6,width:18,height:18,borderRadius:'50%',background:'var(--navy)',border:'1px solid var(--border)',fontSize:9,fontWeight:600,color:'var(--dim)',display:'flex',alignItems:'center',justifyContent:'center'}}>{c.rank}</div>
        </div>

        {/* Body */}
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:8,marginBottom:6}}>
            <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
              <span style={{fontFamily:'var(--heading)',fontSize:16,fontWeight:700,color:'var(--text)'}}>{c.name}</span>
              {c.badge && badgeMap[c.badge] && (
                <span style={{fontSize:10,fontWeight:600,letterSpacing:'.05em',padding:'2px 8px',borderRadius:4,...badgeStyle[c.badge]}}>{badgeMap[c.badge]}</span>
              )}
              <span style={{fontSize:11,fontWeight:500,padding:'3px 10px',borderRadius:20,...(c.category?{background:'rgba(37,99,235,.1)',color:'var(--muted)'}:{})}} className={`cat-${catKey}`}>{c.category}</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
              <div style={{textAlign:'right'}}>
                <div style={{color:'var(--gold)',fontSize:12,letterSpacing:.5}}>{stars(c.rating)}</div>
                <div style={{fontSize:12,color:'var(--muted)',marginTop:1}}>{c.rating} · {(c.review_count||0).toLocaleString()}</div>
              </div>
              <button onClick={onToggleCompare}
                style={{width:30,height:30,borderRadius:7,border:`1px solid ${inCompare?'rgba(0,212,170,.4)':'var(--border)'}`,background:inCompare?'rgba(0,212,170,.12)':'transparent',color:inCompare?'var(--accent)':'var(--dim)',cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center',transition:'all .15s',flexShrink:0}}
                title="Add to compare"
              >{inCompare ? '✓' : '+'}</button>
            </div>
          </div>

          <div style={{fontSize:12,color:'var(--dim)',marginBottom:6}}>
            <a href={c.website} target="_blank" rel="noopener noreferrer" style={{color:'inherit',textDecoration:'none',transition:'color .15s'}}
              onMouseEnter={e=>e.target.style.color='var(--blue)'}
              onMouseLeave={e=>e.target.style.color='var(--dim)'}
            >{c.website?.replace('https://','')}</a>
          </div>

          <div style={{fontSize:13,color:'var(--muted)',lineHeight:1.65,marginBottom:'1rem'}}>{c.description}</div>

          {/* Tags */}
          {c.tag_list?.length > 0 && (
            <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:'1rem'}}>
              {c.tag_list.slice(0,6).map(t => (
                <span key={t} style={{fontSize:11,padding:'3px 9px',borderRadius:20,border:'1px solid var(--border)',color:'var(--dim)',background:'rgba(255,255,255,.03)'}}>{t}</span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:'1rem',borderTop:'1px solid var(--border)',gap:12,flexWrap:'wrap'}}>
            <div style={{fontSize:12,color:'var(--muted)'}}>
              <strong style={{color:'var(--text)',fontWeight:500}}>Pricing:</strong> {c.pricing}
            </div>
            <div style={{display:'flex',gap:8}}>
              <a href={`/review/${c.slug}`}
                style={{fontSize:12,padding:'7px 14px',borderRadius:7,border:'1px solid var(--border)',background:'transparent',color:'var(--muted)',textDecoration:'none',transition:'all .15s',display:'inline-block'}}
                onMouseEnter={e=>{e.target.style.borderColor='var(--borderh)';e.target.style.color='var(--text)'}}
                onMouseLeave={e=>{e.target.style.borderColor='var(--border)';e.target.style.color='var(--muted)'}}
              >Full review ↗</a>
              <a href={c.affiliate_url || c.website} target="_blank" rel="noopener noreferrer"
                style={{fontSize:12,padding:'7px 16px',borderRadius:7,border:'none',background:'var(--accent)',color:'#000',textDecoration:'none',fontWeight:600,transition:'background .15s'}}
                onMouseEnter={e=>e.target.style.background='var(--accent2)'}
                onMouseLeave={e=>e.target.style.background='var(--accent)'}
              >Visit site ↗</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

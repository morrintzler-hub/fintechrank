'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'

const CATEGORIES = [
  { key:'all',       label:'All companies', color:'#009e80' },
  { key:'Payments',  label:'Payments',      color:'#60a5fa' },
  { key:'Banking',   label:'Banking',       color:'#009e80' },
  { key:'Investing', label:'Investing',     color:'#fbbf24' },
  { key:'Crypto',    label:'Crypto',        color:'#c084fc' },
  { key:'Lending',   label:'Lending',       color:'#f87171' },
  { key:'Business',  label:'Business',      color:'#4ade80' },
]

const SORT_OPTIONS = [
  { key:'rank',    label:'Top ranked'  },
  { key:'rating',  label:'Highest rated' },
  { key:'reviews', label:'Most reviewed' },
  { key:'name',    label:'A – Z'        },
]

const POPULAR = [
  { label:'Stripe vs PayPal vs Adyen',          ids:['stripe','paypal','adyen']               },
  { label:'Revolut vs Wise vs Monzo',           ids:['revolut','wise','monzo']                },
  { label:'Coinbase vs Binance vs Kraken',      ids:['coinbase','binance','kraken']           },
  { label:'Brex vs Ramp vs Mercury',            ids:['brex','ramp','mercury']                 },
  { label:'Robinhood vs eToro vs Webull',       ids:['robinhood','etoro','webull']            },
  { label:'Klarna vs Afterpay vs Affirm',       ids:['klarna','afterpay','affirm']            },
  { label:'Wise vs Remitly vs WorldRemit',      ids:['wise','remitly','worldremit']           },
  { label:'Wealthfront vs Betterment vs Acorns',ids:['wealthfront','betterment','acorns']     },
]

const FEATURES = [
  { key:'category',      label:'Category'      },
  { key:'rating',        label:'Rating'        },
  { key:'pricing',       label:'Pricing'       },
  { key:'pricing_model', label:'Pricing model' },
  { key:'founded_year',  label:'Founded'       },
  { key:'hq_country',    label:'HQ'            },
  { key:'website',       label:'Website'       },
]

function stars(r) {
  if (!r) return '-'
  const f = Math.floor(r), h = (r%1)>=.5
  return '★'.repeat(f)+(h?'½':'')+'☆'.repeat(5-f-(h?1:0))
}

function CompanyLogo({ website, name }) {
  const [failed, setFailed] = useState(false)
  const domain = (website||'').replace(/^https?:\/\/(www\.)?/,'').split('/')[0].trim()
  const initials = (name||'').slice(0,2).toUpperCase()
  return (
    <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
      {domain && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
          alt={name} onError={()=>setFailed(true)}
          style={{width:28,height:28,objectFit:'contain',borderRadius:4}}/>
      ) : (
        <span style={{fontFamily:'Manrope,sans-serif',fontWeight:600,fontSize:12,color:'#6d7a74'}}>
          {initials}
        </span>
      )}
    </div>
  )
}

function ComparePageInner() {
  const searchParams                        = useSearchParams()
  const [allCompanies, setAllCompanies]     = useState([])
  const [selected, setSelected]             = useState([])
  const [search, setSearch]                 = useState(searchParams.get('q') || '')
  const notFound                            = searchParams.get('notfound') === '1'
  const [category, setCategory]             = useState('all')
  const [sortBy, setSortBy]                 = useState('rank')
  const [loading, setLoading]               = useState(true)
  const [visible, setVisible]               = useState(20)
  const [activePreset, setActivePreset]     = useState(null)
  const [compareSearch, setCompareSearch]   = useState('')
  const [showCompare, setShowCompare]       = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('companies').select('*').eq('is_active',true).order('rank')
      if (data) setAllCompanies(data)
      setLoading(false)
    }
    load()
  }, [])

  // Load from URL params
  useEffect(() => {
    const ids = searchParams.get('ids')
    if (ids && allCompanies.length > 0) {
      const found = ids.split(',')
        .map(s => allCompanies.find(c => c.slug===s||c.id==s))
        .filter(Boolean).slice(0,3)
      if (found.length > 0) { setSelected(found); setShowCompare(true) }
    }
  }, [searchParams, allCompanies])

  async function loadPreset(preset) {
    setActivePreset(preset.label)
    const { data } = await supabase.from('companies').select('*').in('slug',preset.ids)
    if (data) {
      setSelected(preset.ids.map(s=>data.find(c=>c.slug===s)).filter(Boolean))
      setShowCompare(true)
    }
  }

  function addToCompare(c) {
    if (selected.find(s=>s.id===c.id)||selected.length>=3) return
    setSelected(prev=>[...prev,c])
  }
  function removeFromCompare(id) {
    setSelected(prev=>prev.filter(c=>c.id!==id))
    setActivePreset(null)
  }

  // Filtered + sorted company list
  const counts = {}
  allCompanies.forEach(c => { counts[c.category]=(counts[c.category]||0)+1 })

  const filtered = allCompanies
    .filter(c => {
      if (category !== 'all' && c.category !== category) return false
      if (search.trim() && !c.name.toLowerCase().includes(search.toLowerCase()) &&
          !(c.description||'').toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a,b) => {
      if (sortBy==='rating')  return (b.rating||0)-(a.rating||0)
      if (sortBy==='reviews') return (b.review_count||0)-(a.review_count||0)
      if (sortBy==='name')    return a.name.localeCompare(b.name)
      return (a.rank||999)-(b.rank||999)
    })

  const compareSearchResults = compareSearch.trim()
    ? allCompanies.filter(c =>
        c.name.toLowerCase().includes(compareSearch.toLowerCase()) &&
        !selected.find(s=>s.id===c.id)).slice(0,6)
    : []

  const catColors = {
    Payments:'#60a5fa',Banking:'#009e80',Investing:'#fbbf24',
    Crypto:'#c084fc',Lending:'#f87171',Business:'#4ade80',
  }

  return (
    <div style={{minHeight:'100vh',background:'#f7f9fb',paddingTop:24}}>

      {/* Page header */}
      <div style={{maxWidth:1400,margin:'0 auto',padding:'2rem 2rem 1.5rem'}}>
        <div style={{fontSize:10,fontWeight:600,letterSpacing:'.18em',textTransform:'uppercase',
          color:'#008489',display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
          <span style={{width:5,height:5,borderRadius:'50%',background:'#008489',display:'inline-block'}}/>
          Compare companies
        </div>
        <h1 style={{fontFamily:'Manrope,sans-serif',fontWeight:800,
          fontSize:'clamp(1.8rem,3.5vw,2.8rem)',letterSpacing:'-.03em',
          color:'#191c1e',marginBottom:8}}>
          Find the right fintech for your business
        </h1>
        <p style={{fontSize:15,color:'#3d4945',lineHeight:1.7,maxWidth:560,marginBottom:'1.5rem'}}>
          Browse 100 companies, filter by category, and compare any 2–3 side by side.
        </p>

        {/* Popular presets */}
        <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:'1.5rem'}}>
          <span style={{fontSize:11,fontWeight:600,color:'#6d7a74',letterSpacing:'.06em',
            textTransform:'uppercase',alignSelf:'center',marginRight:4}}>
            Popular:
          </span>
          {POPULAR.map(p=>(
            <button key={p.label} onClick={()=>loadPreset(p)} style={{
              fontSize:12,fontWeight:400,padding:'5px 12px',borderRadius:6,cursor:'pointer',
              border:`1px solid ${activePreset===p.label?'#008489':'rgba(188,202,195,0.5)'}`,
              background:activePreset===p.label?'rgba(0,132,137,0.08)':'#ffffff',
              color:activePreset===p.label?'#008489':'#3d4945',
              fontFamily:'Manrope,sans-serif',transition:'all .15s',
            }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile selected companies bar */}
      {selected.length > 0 && (
        <div className="compare-mobile-bar" style={{
          display:'none',
          position:'sticky',top:54,zIndex:100,
          background:'#ffffff',
          borderBottom:'1px solid rgba(188,202,195,0.4)',
          padding:'10px 1rem',
          boxShadow:'0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <div style={{display:'flex',alignItems:'center',gap:8,overflowX:'auto'}}>
            <span style={{fontSize:11,fontWeight:600,color:'#6d7a74',whiteSpace:'nowrap',fontFamily:'Manrope,sans-serif'}}>
              Comparing:
            </span>
            {selected.map(c=>(
              <div key={c.id} style={{
                display:'flex',alignItems:'center',gap:6,
                padding:'4px 10px',borderRadius:6,
                background:'rgba(0,132,137,0.08)',
                border:'1px solid rgba(0,132,137,0.2)',
                whiteSpace:'nowrap',flexShrink:0,
              }}>
                <span style={{fontSize:12,fontWeight:500,color:'#008489',fontFamily:'Manrope,sans-serif'}}>{c.name}</span>
                <button onClick={()=>removeFromCompare(c.id)} style={{
                  background:'none',border:'none',cursor:'pointer',
                  color:'#6d7a74',fontSize:14,lineHeight:1,padding:0,
                }}>×</button>
              </div>
            ))}
            {selected.length >= 2 && (
              <a href={`/compare?ids=${selected.map(c=>c.slug).join(',')}`}
                style={{
                  padding:'5px 12px',borderRadius:6,
                  background:'#008489',color:'white',
                  textDecoration:'none',fontSize:11,fontWeight:600,
                  whiteSpace:'nowrap',flexShrink:0,
                  fontFamily:'Manrope,sans-serif',
                }}>
                Compare →
              </a>
            )}
          </div>
        </div>
      )}

      {/* Main 3-column layout */}
      <div style={{
        maxWidth:1400,margin:'0 auto',
        padding:'0 1rem 4rem',
        display:'grid',
        gridTemplateColumns:'220px 1fr 260px',
        gap:24,alignItems:'start',
      }}
        className="compare-grid">

        {/* ── LEFT SIDEBAR ── */}
        <div style={{position:'sticky',top:80}}>

          {/* Category filter */}
          <div style={{marginBottom:24}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'.18em',textTransform:'uppercase',
              color:'#6d7a74',marginBottom:10,fontFamily:'Manrope,sans-serif'}}>
              Category
            </div>
            {CATEGORIES.map(cat=>(
              <button key={cat.key} onClick={()=>{setCategory(cat.key);setVisible(20)}} style={{
                display:'flex',alignItems:'center',justifyContent:'space-between',
                width:'100%',padding:'7px 10px',borderRadius:6,
                border:`1px solid ${category===cat.key?'rgba(0,132,137,0.25)':'transparent'}`,
                background:category===cat.key?'rgba(0,132,137,0.06)':'transparent',
                cursor:'pointer',marginBottom:2,fontFamily:'Manrope,sans-serif',
                transition:'all .15s',
              }}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  {cat.key!=='all' && (
                    <span style={{width:6,height:6,borderRadius:'50%',
                      background:cat.color,flexShrink:0}}/>
                  )}
                  <span style={{fontSize:13,fontWeight:category===cat.key?500:400,
                    color:category===cat.key?'#008489':'#3d4945'}}>
                    {cat.label}
                  </span>
                </div>
                <span style={{fontSize:11,color:'#6d7a74',
                  background:'rgba(0,0,0,0.04)',padding:'1px 7px',borderRadius:3}}>
                  {cat.key==='all' ? allCompanies.length : counts[cat.key]||0}
                </span>
              </button>
            ))}
          </div>

          {/* Sort */}
          <div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'.18em',textTransform:'uppercase',
              color:'#6d7a74',marginBottom:10,fontFamily:'Manrope,sans-serif'}}>
              Sort by
            </div>
            {SORT_OPTIONS.map(opt=>(
              <button key={opt.key} onClick={()=>setSortBy(opt.key)} style={{
                display:'flex',alignItems:'center',gap:8,width:'100%',
                padding:'7px 10px',borderRadius:6,border:'none',
                background:'transparent',cursor:'pointer',fontFamily:'Manrope,sans-serif',
                marginBottom:2,transition:'background .15s',
              }}>
                <div style={{
                  width:13,height:13,borderRadius:'50%',flexShrink:0,
                  border:`1.5px solid ${sortBy===opt.key?'#008489':'#bccac3'}`,
                  display:'flex',alignItems:'center',justifyContent:'center',
                }}>
                  {sortBy===opt.key && (
                    <div style={{width:6,height:6,borderRadius:'50%',background:'#008489'}}/>
                  )}
                </div>
                <span style={{fontSize:13,color:sortBy===opt.key?'#008489':'#3d4945',
                  fontWeight:sortBy===opt.key?500:400}}>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── CENTER: Company list ── */}
        <div>
          {/* Search + count */}
          <div style={{
            display:'flex',alignItems:'center',gap:12,
            marginBottom:16,
          }}>
            <div style={{
              flex:1,display:'flex',alignItems:'center',
              background:'#ffffff',border:'1px solid rgba(188,202,195,0.5)',
              borderRadius:8,padding:'0 14px',
              boxShadow:'0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" style={{flexShrink:0,marginRight:8}}>
                <circle cx="8" cy="8" r="5.5" stroke="#6d7a74" strokeWidth="1.5"/>
                <path d="M12.5 12.5L16 16" stroke="#6d7a74" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Search companies..."
                style={{flex:1,padding:'10px 0',fontSize:14,fontFamily:'Manrope,sans-serif',
                  background:'transparent',border:'none',outline:'none',color:'#191c1e'}}/>
            </div>
            <div style={{fontSize:13,color:'#6d7a74',whiteSpace:'nowrap',flexShrink:0}}>
              <strong style={{color:'#191c1e'}}>{Math.min(visible,filtered.length)}</strong>
              {' of '}
              <strong style={{color:'#191c1e'}}>{filtered.length}</strong>
              {' companies'}
            </div>
          </div>

          {/* Not found banner */}
          {notFound && search && (
            <div style={{
              padding:'14px 16px',
              borderRadius:10,
              background:'rgba(220,38,38,0.04)',
              border:'1px solid rgba(220,38,38,0.15)',
              marginBottom:12,
              display:'flex', alignItems:'center', gap:12,
            }}>
              <span style={{fontSize:18}}>🔍</span>
              <div>
                <div style={{fontFamily:'Manrope,sans-serif',fontWeight:600,
                  fontSize:14,color:'#191c1e',marginBottom:2}}>
                  No exact match for "{search}"
                </div>
                <div style={{fontFamily:'Manrope,sans-serif',fontWeight:400,
                  fontSize:13,color:'#6d7a74'}}>
                  Showing similar results below. Can't find what you need?{' '}
                  <a href="mailto:hello@thefintechrank.com?subject=Missing company: {search}"
                    style={{color:'#008489',textDecoration:'none',fontWeight:500}}>
                    Suggest a company →
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Company cards */}
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {loading ? (
              Array.from({length:5}).map((_,i)=>(
                <div key={i} className="skeleton" style={{height:140,borderRadius:12}}/>
              ))
            ) : filtered.slice(0,visible).map(c=>(
              <div key={c.id} style={{
                background:'#ffffff',border:'1px solid rgba(188,202,195,0.4)',
                borderRadius:12,padding:'1rem 1.25rem',
                boxShadow:'0 1px 3px rgba(0,0,0,0.04)',
                transition:'box-shadow .2s,border-color .2s,transform .2s',
              }}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.09)';e.currentTarget.style.borderColor='rgba(0,132,137,0.2)';e.currentTarget.style.transform='translateY(-1px)'}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)';e.currentTarget.style.borderColor='rgba(188,202,195,0.4)';e.currentTarget.style.transform='translateY(0)'}}>
                <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                  {/* Logo */}
                  <div style={{
                    width:44,height:44,flexShrink:0,borderRadius:8,
                    background:'#f0f2f5',border:'1px solid rgba(188,202,195,0.4)',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    position:'relative',overflow:'hidden',
                  }}>
                    <CompanyLogo website={c.website} name={c.name}/>
                    <div style={{
                      position:'absolute',bottom:-4,right:-4,
                      width:16,height:16,borderRadius:'50%',
                      background:'#f7f9fb',border:'1px solid rgba(188,202,195,0.4)',
                      fontSize:8,fontWeight:600,color:'#6d7a74',
                      display:'flex',alignItems:'center',justifyContent:'center',
                    }}>{c.rank}</div>
                  </div>

                  {/* Body */}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',alignItems:'flex-start',
                      justifyContent:'space-between',gap:8,marginBottom:4}}>
                      <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                        <span style={{fontFamily:'Manrope,sans-serif',fontWeight:700,
                          fontSize:15,color:'#191c1e'}}>{c.name}</span>
                        {c.badge && (
                          <span style={{
                            fontSize:9,fontWeight:700,letterSpacing:'.08em',
                            padding:'2px 7px',borderRadius:3,textTransform:'uppercase',
                            background:c.badge==='featured'?'rgba(37,99,235,0.1)':'rgba(245,158,11,0.1)',
                            color:c.badge==='featured'?'#1d4ed8':'#92400e',
                            border:`1px solid ${c.badge==='featured'?'rgba(37,99,235,0.2)':'rgba(245,158,11,0.2)'}`,
                          }}>{c.badge}</span>
                        )}
                        <span style={{
                          fontSize:10,fontWeight:500,padding:'2px 8px',borderRadius:3,
                          background:`${catColors[c.category]||'#94a3b8'}18`,
                          color:catColors[c.category]||'#6d7a74',
                        }}>{c.category}</span>
                      </div>
                      <div style={{flexShrink:0,textAlign:'right'}}>
                        <div style={{color:'#d97706',fontSize:11}}>{stars(c.rating)}</div>
                        <div style={{fontSize:11,color:'#6d7a74',marginTop:1}}>
                          {c.rating} · {(c.review_count||0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div style={{fontSize:11,color:'#6d7a74',marginBottom:5}}>
                      <a href={c.website} target="_blank" rel="noopener noreferrer"
                        style={{color:'inherit',textDecoration:'none'}}>
                        {(c.website||'').replace('https://','').replace('www.','')}
                      </a>
                    </div>
                    <p style={{fontSize:13,color:'#3d4945',lineHeight:1.65,marginBottom:12,
                      display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',
                      overflow:'hidden'}}>
                      {c.description}
                    </p>
                    <div style={{display:'flex',alignItems:'center',
                      justifyContent:'space-between',flexWrap:'wrap',gap:8,
                      paddingTop:10,borderTop:'1px solid rgba(188,202,195,0.3)'}}>
                      <div style={{fontSize:12,color:'#3d4945'}}>
                        <strong style={{fontWeight:500,color:'#191c1e'}}>Pricing: </strong>
                        {c.pricing}
                      </div>
                      <div style={{display:'flex',gap:8}}>
                        <button onClick={()=>addToCompare(c)} style={{
                          fontSize:11,padding:'5px 12px',borderRadius:6,cursor:'pointer',
                          border:`1px solid ${selected.find(s=>s.id===c.id)?'#008489':'rgba(188,202,195,0.5)'}`,
                          background:selected.find(s=>s.id===c.id)?'rgba(0,132,137,0.08)':'transparent',
                          color:selected.find(s=>s.id===c.id)?'#008489':'#6d7a74',
                          fontFamily:'Manrope,sans-serif',fontWeight:500,transition:'all .15s',
                        }}>
                          {selected.find(s=>s.id===c.id)?'✓ Added':'+ Compare'}
                        </button>
                        <a href={`/review/${c.slug}`} style={{
                          fontSize:11,padding:'5px 12px',borderRadius:6,
                          border:'1px solid rgba(188,202,195,0.5)',
                          color:'#3d4945',textDecoration:'none',fontFamily:'Manrope,sans-serif',
                          transition:'all .15s',
                        }}>
                          Full review
                        </a>
                        <a href={c.affiliate_url||c.website} target="_blank" rel="noopener noreferrer"
                          style={{
                            fontSize:11,padding:'5px 12px',borderRadius:6,
                            background:'#008489',color:'#ffffff',
                            textDecoration:'none',fontFamily:'Manrope,sans-serif',fontWeight:500,
                          }}>
                          Visit site
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load more */}
          {visible < filtered.length && (
            <div style={{textAlign:'center',marginTop:24}}>
              <button onClick={()=>setVisible(v=>v+20)} style={{
                padding:'10px 28px',borderRadius:8,
                border:'1px solid rgba(188,202,195,0.5)',
                background:'#ffffff',color:'#3d4945',
                fontFamily:'Manrope,sans-serif',fontSize:14,
                cursor:'pointer',transition:'all .15s',
              }}>
                Show {Math.min(20,filtered.length-visible)} more
              </button>
            </div>
          )}
        </div>

        {/* ── RIGHT: Compare panel ── */}
        <div style={{position:'sticky',top:80}} className="compare-panel-desktop">
          <div style={{
            background:'#ffffff',border:'1px solid rgba(188,202,195,0.4)',
            borderRadius:16,padding:'1.25rem',
            boxShadow:'0 4px 24px -4px rgba(0,0,0,0.07)',
          }}>
            <div style={{fontFamily:'Manrope,sans-serif',fontWeight:700,
              fontSize:14,color:'#191c1e',marginBottom:4}}>
              Compare companies
            </div>
            <div style={{fontSize:12,color:'#6d7a74',marginBottom:14}}>
              Select up to 3 to compare
            </div>

            {/* Selected slots */}
            <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:12}}>
              {[0,1,2].map(i=>(
                <div key={i} style={{
                  display:'flex',alignItems:'center',justifyContent:'space-between',
                  padding:'7px 10px',borderRadius:8,minHeight:34,
                  border:`1px ${selected[i]?'solid':'dashed'} ${selected[i]?'rgba(0,132,137,0.25)':'rgba(188,202,195,0.5)'}`,
                  background:selected[i]?'rgba(0,132,137,0.04)':'transparent',
                  transition:'all .2s',
                }}>
                  {selected[i] ? (
                    <>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <div style={{width:24,height:24,borderRadius:5,background:'#f0f2f5',
                          border:'1px solid rgba(188,202,195,0.4)',overflow:'hidden',
                          display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                          <CompanyLogo website={selected[i].website} name={selected[i].name}/>
                        </div>
                        <span style={{fontSize:12,fontWeight:500,color:'#008489'}}>
                          {selected[i].name}
                        </span>
                      </div>
                      <button onClick={()=>removeFromCompare(selected[i].id)} style={{
                        background:'none',border:'none',cursor:'pointer',
                        color:'#6d7a74',fontSize:16,lineHeight:1,padding:'0 2px',
                      }}>×</button>
                    </>
                  ) : (
                    <span style={{fontSize:12,color:'#6d7a74'}}>
                      + Company {i+1}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Search to add */}
            {selected.length < 3 && (
              <div style={{position:'relative',marginBottom:12}}>
                <input value={compareSearch} onChange={e=>setCompareSearch(e.target.value)}
                  placeholder="Search to add..."
                  style={{
                    width:'100%',padding:'8px 12px',borderRadius:7,
                    border:'1px solid rgba(188,202,195,0.5)',
                    fontSize:12,fontFamily:'Manrope,sans-serif',
                    background:'#f7f9fb',outline:'none',color:'#191c1e',
                    boxSizing:'border-box',
                  }}/>
                {compareSearchResults.length > 0 && (
                  <div style={{
                    position:'absolute',top:'calc(100% + 4px)',left:0,right:0,
                    background:'#ffffff',border:'1px solid rgba(188,202,195,0.5)',
                    borderRadius:8,overflow:'hidden',zIndex:50,
                    boxShadow:'0 8px 24px rgba(0,0,0,0.1)',
                  }}>
                    {compareSearchResults.map(c=>(
                      <div key={c.id} onClick={()=>{addToCompare(c);setCompareSearch('')}}
                        style={{
                          display:'flex',alignItems:'center',gap:10,
                          padding:'8px 12px',cursor:'pointer',
                          borderBottom:'1px solid rgba(188,202,195,0.3)',
                          transition:'background .12s',
                        }}
                        onMouseEnter={e=>e.currentTarget.style.background='rgba(0,132,137,0.04)'}
                        onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                        <div style={{width:28,height:28,borderRadius:5,background:'#f0f2f5',
                          border:'1px solid rgba(188,202,195,0.4)',overflow:'hidden',
                          display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                          <CompanyLogo website={c.website} name={c.name}/>
                        </div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:12,fontWeight:500,color:'#191c1e'}}>{c.name}</div>
                          <div style={{fontSize:11,color:'#6d7a74'}}>{c.category}</div>
                        </div>
                        <div style={{fontSize:11,color:'#d97706'}}>★ {c.rating}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Compare button */}
            {selected.length >= 2 ? (
              <a href={`/compare?ids=${selected.map(c=>c.slug).join(',')}`}
                style={{
                  display:'block',width:'100%',padding:'10px',borderRadius:8,
                  background:'#008489',color:'#ffffff',textAlign:'center',
                  textDecoration:'none',fontSize:13,fontWeight:600,
                  fontFamily:'Manrope,sans-serif',transition:'opacity .15s',
                }}
                onMouseEnter={e=>e.currentTarget.style.opacity='.88'}
                onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
                Compare now →
              </a>
            ) : (
              <div style={{
                padding:'10px',borderRadius:8,background:'#f0f2f5',
                color:'#6d7a74',textAlign:'center',fontSize:13,
                fontFamily:'Manrope,sans-serif',
              }}>
                {selected.length === 0 ? 'Select 2–3 companies' : 'Add 1 more company'}
              </div>
            )}
          </div>

          {/* Compare table — shown when 2+ selected */}
          {selected.length >= 2 && showCompare && (
            <div style={{
              marginTop:16,background:'#ffffff',
              border:'1px solid rgba(188,202,195,0.4)',
              borderRadius:16,overflow:'hidden',
              boxShadow:'0 4px 24px -4px rgba(0,0,0,0.07)',
            }}>
            <div style={{overflowX:'auto'}}>
              {/* Column headers */}
              <div style={{
                display:'grid',
                gridTemplateColumns:`140px repeat(${selected.length}, 1fr)`,
                borderBottom:'1px solid rgba(188,202,195,0.3)',
              }}>
                <div style={{padding:'12px 10px'}}/>
                {selected.map(c=>(
                  <div key={c.id} style={{
                    padding:'12px 8px',textAlign:'center',
                    borderLeft:'1px solid rgba(188,202,195,0.3)',
                  }}>
                    <div style={{width:28,height:28,borderRadius:6,
                      background:'#f0f2f5',margin:'0 auto 6px',
                      overflow:'hidden',border:'1px solid rgba(188,202,195,0.4)',
                      display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <CompanyLogo website={c.website} name={c.name}/>
                    </div>
                    <div style={{fontSize:11,fontWeight:700,color:'#191c1e',marginBottom:2}}>
                      {c.name}
                    </div>
                    <div style={{color:'#d97706',fontSize:10}}>★ {c.rating}</div>
                  </div>
                ))}
              </div>
              {/* Feature rows */}
              {FEATURES.map((f,fi)=>(
                <div key={f.key} style={{
                  display:'grid',
                  gridTemplateColumns:`140px repeat(${selected.length}, 1fr)`,
                  borderBottom:fi<FEATURES.length-1?'1px solid rgba(188,202,195,0.2)':'none',
                  background:fi%2===0?'transparent':'rgba(247,249,251,0.5)',
                }}>
                  <div style={{padding:'9px 10px',fontSize:11,fontWeight:600,
                    color:'#6d7a74',textTransform:'uppercase',letterSpacing:'.04em',
                    alignSelf:'center'}}>
                    {f.label}
                  </div>
                  {selected.map(c=>(
                    <div key={c.id} style={{
                      padding:'9px 8px',fontSize:12,color:'#191c1e',
                      textAlign:'center',borderLeft:'1px solid rgba(188,202,195,0.2)',
                      alignSelf:'center',
                    }}>
                      {f.key==='rating' ? (
                        <span>{c.rating} ({(c.review_count||0).toLocaleString()})</span>
                      ) : f.key==='website' ? (
                        <a href={c.website} target="_blank" rel="noopener noreferrer"
                          style={{color:'#008489',textDecoration:'none',fontSize:11}}>
                          {(c.website||'').replace('https://','').replace('www.','')}
                        </a>
                      ) : (
                        <span>{c[f.key] || '-'}</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div style={{padding:'4rem',textAlign:'center',color:'#6d7a74'}}>Loading…</div>}>
      <ComparePageInner/>
    </Suspense>
  )
}

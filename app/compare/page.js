'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'

const CATS = [
  { key:'all',       label:'All',       color:'#009e80' },
  { key:'Payments',  label:'Payments',  color:'#60a5fa' },
  { key:'Banking',   label:'Banking',   color:'#009e80' },
  { key:'Investing', label:'Investing', color:'#fbbf24' },
  { key:'Crypto',    label:'Crypto',    color:'#c084fc' },
  { key:'Lending',   label:'Lending',   color:'#f87171' },
  { key:'Business',  label:'Business',  color:'#4ade80' },
]
const SORTS = [
  { key:'rank',    label:'Top ranked'    },
  { key:'rating',  label:'Highest rated' },
  { key:'reviews', label:'Most reviewed' },
  { key:'name',    label:'A - Z'         },
]
const POPULAR = [
  { label:'Stripe vs PayPal vs Adyen',           ids:['stripe','paypal','adyen']           },
  { label:'Revolut vs Wise vs Monzo',            ids:['revolut','wise','monzo']            },
  { label:'Coinbase vs Binance vs Kraken',       ids:['coinbase','binance','kraken']       },
  { label:'Brex vs Ramp vs Mercury',             ids:['brex','ramp','mercury']             },
  { label:'Robinhood vs eToro vs Webull',        ids:['robinhood','etoro','webull']        },
  { label:'Klarna vs Afterpay vs Affirm',        ids:['klarna','afterpay','affirm']        },
  { label:'Wise vs Remitly vs WorldRemit',       ids:['wise','remitly','worldremit']       },
  { label:'Wealthfront vs Betterment vs Acorns', ids:['wealthfront','betterment','acorns'] },
]
const FIELDS = [
  { key:'rating',        label:'Editorial Score' },
  { key:'category',      label:'Type'            },
  { key:'pricing',       label:'Pricing'         },
  { key:'pricing_model', label:'Fee model'       },
  { key:'currencies_supported', label:'Currencies'      },
  { key:'tagline',              label:'Best for'        },
]
const CAT_COLORS = {
  Payments:'#60a5fa', Banking:'#009e80', Investing:'#fbbf24',
  Crypto:'#c084fc', Lending:'#f87171', Business:'#4ade80',
}

function gridCols(n) {
  let s = '130px'; for (let i=0;i<n;i++) s+=' 1fr'; return s
}
function gridColsSm(n) {
  let s = '100px'; for (let i=0;i<n;i++) s+=' 1fr'; return s
}
function shortText(s,n) { if(!s) return '-'; return s.length>n?s.slice(0,n)+'...':s }

function Logo({ website, name }) {
  const [err, setErr] = useState(false)
  const domain = (website||'').replace(/^https?:\/\/(www\.)?/,'').split('/')[0]
  const initials = (name||'').slice(0,2).toUpperCase()
  if (domain && !err) {
    return <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} alt={name} onError={()=>setErr(true)} style={{width:28,height:28,objectFit:'contain',borderRadius:4}} />
  }
  return <span style={{fontFamily:'Manrope,sans-serif',fontWeight:600,fontSize:11,color:'#6d7a74'}}>{initials}</span>
}

function Cell({ field, co }) {
  if (field==='rating') return (
    <span style={{fontSize:11}}>
      {co.rating||'-'}<br/>
      <span style={{fontSize:9,color:'#94a3b8'}}>{(co.review_count||0).toLocaleString()}</span>
    </span>
  )
  if (field==='pricing') return <span style={{fontSize:10,lineHeight:'1.4',display:'block'}}>{shortText(co.pricing,28)}</span>
  return <span style={{fontSize:11}}>{co[field]||'-'}</span>
}

function CompareTable({ selected, sm }) {
  const gc = sm ? gridColsSm(selected.length) : gridCols(selected.length)
  const mw = sm ? 260 : 320
  const lp = sm ? '7px 8px' : '10px 14px'
  const cp = sm ? '7px 6px' : '10px 8px'
  return (
    <div style={{overflowX:'auto'}}>
      <div style={{display:'grid',gridTemplateColumns:gc,borderBottom:'1px solid rgba(188,202,195,0.3)',minWidth:mw}}>
        <div style={{padding:lp,fontSize:10,fontWeight:700,color:'#6d7a74',textTransform:'uppercase'}}>Feature</div>
        {selected.map(co => (
          <div key={co.id} style={{padding:'10px 8px',textAlign:'center',borderLeft:'1px solid rgba(188,202,195,0.3)'}}>
            <div style={{width:sm?28:36,height:sm?28:36,borderRadius:8,background:'#f0f2f5',margin:'0 auto 6px',overflow:'hidden',border:'1px solid rgba(188,202,195,0.4)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Logo website={co.website} name={co.name}/>
            </div>
            <div style={{fontSize:sm?10:12,fontWeight:700,color:'#191c1e',marginBottom:2,lineHeight:1.2}}>{co.name}</div>
            <div style={{fontSize:10,color:'#d97706'}}>{co.rating}</div>
          </div>
        ))}
      </div>
      {FIELDS.map((f,fi) => (
        <div key={f.key} style={{display:'grid',gridTemplateColumns:gc,borderBottom:fi<FIELDS.length-1?'1px solid rgba(188,202,195,0.15)':'none',background:fi%2===0?'transparent':'rgba(247,249,251,0.6)',minWidth:mw}}>
          <div style={{padding:lp,fontSize:10,fontWeight:600,color:'#6d7a74',textTransform:'uppercase',alignSelf:'center'}}>{f.label}</div>
          {selected.map(co => (
            <div key={co.id} style={{padding:cp,fontSize:11,color:'#191c1e',textAlign:'center',borderLeft:'1px solid rgba(188,202,195,0.15)',alignSelf:'center',wordBreak:'break-word',lineHeight:1.4}}>
              <Cell field={f.key} co={co}/>
            </div>
          ))}
        </div>
      ))}
      <div style={{display:'grid',gridTemplateColumns:gc,borderTop:'1px solid rgba(188,202,195,0.3)',minWidth:mw}}>
        <div style={{padding:lp}}/>
        {selected.map(co => (
          <div key={co.id} style={{padding:'10px 8px',textAlign:'center',borderLeft:'1px solid rgba(188,202,195,0.2)'}}>
            <a href={'/review/'+co.slug} style={{display:'inline-block',padding:'6px 14px',borderRadius:6,background:'#008489',color:'white',textDecoration:'none',fontSize:11,fontWeight:600,fontFamily:'Manrope,sans-serif'}}>Full review</a>
          </div>
        ))}
      </div>
    </div>
  )
}

function Sidebar({ cat, setCat, sort, setSort, all, counts }) {
  return (
    <div style={{position:'sticky',top:80}}>
      <div style={{marginBottom:24}}>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:'.18em',textTransform:'uppercase',color:'#6d7a74',marginBottom:10,fontFamily:'Manrope,sans-serif'}}>Category</div>
        {CATS.map(c => (
          <button key={c.key} onClick={()=>setCat(c.key)} style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%',padding:'7px 10px',borderRadius:6,cursor:'pointer',marginBottom:2,fontFamily:'Manrope,sans-serif',transition:'all .15s',border:cat===c.key?'1px solid rgba(0,132,137,0.25)':'1px solid transparent',background:cat===c.key?'rgba(0,132,137,0.06)':'transparent'}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              {c.key!=='all' && <span style={{width:6,height:6,borderRadius:'50%',background:c.color,flexShrink:0}}/>}
              <span style={{fontSize:13,fontWeight:cat===c.key?500:400,color:cat===c.key?'#008489':'#3d4945'}}>{c.label}</span>
            </div>
            <span style={{fontSize:11,color:'#6d7a74',background:'rgba(0,0,0,0.04)',padding:'1px 7px',borderRadius:3}}>{c.key==='all'?all.length:(counts[c.key]||0)}</span>
          </button>
        ))}
      </div>
      <div>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:'.18em',textTransform:'uppercase',color:'#6d7a74',marginBottom:10,fontFamily:'Manrope,sans-serif'}}>Sort by</div>
        {SORTS.map(o => (
          <button key={o.key} onClick={()=>setSort(o.key)} style={{display:'flex',alignItems:'center',gap:8,width:'100%',padding:'7px 10px',borderRadius:6,border:'none',background:'transparent',cursor:'pointer',fontFamily:'Manrope,sans-serif',marginBottom:2}}>
            <div style={{width:13,height:13,borderRadius:'50%',flexShrink:0,border:sort===o.key?'1.5px solid #008489':'1.5px solid #bccac3',display:'flex',alignItems:'center',justifyContent:'center'}}>
              {sort===o.key && <div style={{width:6,height:6,borderRadius:'50%',background:'#008489'}}/>}
            </div>
            <span style={{fontSize:13,color:sort===o.key?'#008489':'#3d4945',fontWeight:sort===o.key?500:400}}>{o.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function RightPanel({ sel, setSel, addSel, remSel }) {
  const [csearch, setCsearch] = useState('')
  const [all, setAll] = useState([])
  useEffect(() => {
    supabase.from('companies').select('id,name,slug,website,category,rating').eq('is_active',true).order('rank')
      .then(({data})=>{ if(data) setAll(data) })
  }, [])
  const results = csearch.trim() ? all.filter(c=>c.name.toLowerCase().includes(csearch.toLowerCase())&&!sel.find(s=>s.id===c.id)).slice(0,6) : []

  return (
    <div style={{position:'sticky',top:80}} className="compare-panel-desktop">
      <div style={{background:'#fff',border:'1px solid rgba(188,202,195,0.4)',borderRadius:16,padding:'1.25rem',boxShadow:'0 4px 24px -4px rgba(0,0,0,0.07)'}}>
        <div style={{fontFamily:'Manrope,sans-serif',fontWeight:700,fontSize:14,color:'#191c1e',marginBottom:4}}>Compare companies</div>
        <div style={{fontSize:12,color:'#6d7a74',marginBottom:14}}>Select up to 3 to compare</div>
        <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:12}}>
          {[0,1,2].map(i => (
            <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'7px 10px',borderRadius:8,minHeight:34,border:sel[i]?'1px solid rgba(0,132,137,0.25)':'1px dashed rgba(188,202,195,0.5)',background:sel[i]?'rgba(0,132,137,0.04)':'transparent',transition:'all .2s'}}>
              {sel[i] ? (
                <>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <div style={{width:24,height:24,borderRadius:5,background:'#f0f2f5',border:'1px solid rgba(188,202,195,0.4)',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      <Logo website={sel[i].website} name={sel[i].name}/>
                    </div>
                    <span style={{fontSize:12,fontWeight:500,color:'#008489'}}>{sel[i].name}</span>
                  </div>
                  <button onClick={()=>remSel(sel[i].id)} style={{background:'none',border:'none',cursor:'pointer',color:'#6d7a74',fontSize:16,lineHeight:1,padding:'0 2px'}}>x</button>
                </>
              ) : (
                <span style={{fontSize:12,color:'#6d7a74'}}>+ Company {i+1}</span>
              )}
            </div>
          ))}
        </div>
        {sel.length<3 && (
          <div style={{position:'relative',marginBottom:12}}>
            <input value={csearch} onChange={e=>setCsearch(e.target.value)} placeholder="Search to add..." style={{width:'100%',padding:'8px 12px',borderRadius:7,border:'1px solid rgba(188,202,195,0.5)',fontSize:12,fontFamily:'Manrope,sans-serif',background:'#f7f9fb',outline:'none',color:'#191c1e',boxSizing:'border-box'}}/>
            {results.length>0 && (
              <div style={{position:'absolute',top:'calc(100% + 4px)',left:0,right:0,background:'#fff',border:'1px solid rgba(188,202,195,0.5)',borderRadius:8,overflow:'hidden',zIndex:50,boxShadow:'0 8px 24px rgba(0,0,0,0.1)'}}>
                {results.map(co => (
                  <div key={co.id} onClick={()=>{addSel(co);setCsearch('')}} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',cursor:'pointer',borderBottom:'1px solid rgba(188,202,195,0.3)',transition:'background .12s'}} onMouseEnter={e=>e.currentTarget.style.background='rgba(0,132,137,0.04)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <div style={{width:28,height:28,borderRadius:5,background:'#f0f2f5',border:'1px solid rgba(188,202,195,0.4)',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      <Logo website={co.website} name={co.name}/>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,fontWeight:500,color:'#191c1e'}}>{co.name}</div>
                      <div style={{fontSize:11,color:'#6d7a74'}}>{co.category}</div>
                    </div>
                    <div style={{fontSize:11,color:'#d97706'}}>{co.rating}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {sel.length>=2 ? (
          <a href={'/compare?ids='+sel.map(c=>c.slug).join(',')} style={{display:'block',width:'100%',padding:'10px',borderRadius:8,background:'#008489',color:'#fff',textAlign:'center',textDecoration:'none',fontSize:13,fontWeight:600,fontFamily:'Manrope,sans-serif'}}>Compare now</a>
        ) : (
          <div style={{padding:'10px',borderRadius:8,background:'#f0f2f5',color:'#6d7a74',textAlign:'center',fontSize:13,fontFamily:'Manrope,sans-serif'}}>{sel.length===0?'Select 2-3 companies':'Add 1 more company'}</div>
        )}
      </div>

    </div>
  )
}

function CompareInner() {
  const sp = useSearchParams()
  const [all, setAll]         = useState([])
  const [sel, setSel]         = useState([])
  const [search, setSearch]   = useState(sp.get('q')||'')
  const [cat, setCat]         = useState('all')
  const [sort, setSort]       = useState('rank')
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(20)
  const [preset, setPreset]   = useState(null)
  const notFound              = sp.get('notfound')==='1'

  useEffect(() => {
    supabase.from('companies').select('*').eq('is_active',true).order('rank')
      .then(({data})=>{ if(data) setAll(data); setLoading(false) })
  }, [])

  useEffect(() => {
    const ids = sp.get('ids')
    if (!ids||!all.length) return
    const found = ids.split(',').map(s=>all.find(c=>c.slug===s||c.id==s)).filter(Boolean).slice(0,3)
    if (found.length) setSel(found)
  }, [sp, all])

  function addSel(co) {
    if (sel.find(s=>s.id===co.id)||sel.length>=3) return
    setSel(prev => {
      const next = [...prev,co]
      if (next.length>=2) setTimeout(()=>{ const el=document.getElementById('ctable'); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}) },100)
      return next
    })
  }
  function remSel(id) { setSel(prev=>prev.filter(c=>c.id!==id)); setPreset(null) }

  async function loadPreset(p) {
    setPreset(p.label)
    const {data} = await supabase.from('companies').select('*').in('slug',p.ids)
    if (data) setSel(p.ids.map(s=>data.find(c=>c.slug===s)).filter(Boolean))
  }

  const counts = {}
  all.forEach(c=>{ counts[c.category]=(counts[c.category]||0)+1 })

  const filtered = all.filter(c => {
    if (cat!=='all'&&c.category!==cat) return false
    if (search.trim()) { const q=search.toLowerCase(); return c.name.toLowerCase().includes(q)||(c.description||'').toLowerCase().includes(q) }
    return true
  }).sort((a,b) => {
    if (sort==='rating')  return (b.rating||0)-(a.rating||0)
    if (sort==='reviews') return (b.review_count||0)-(a.review_count||0)
    if (sort==='name')    return a.name.localeCompare(b.name)
    return (a.rank||999)-(b.rank||999)
  })

  return (
    <div style={{minHeight:'100vh',background:'#f7f9fb',paddingTop:24}}>
      {sel.length>0 && (
        <div className="compare-mobile-bar" style={{display:'none',position:'sticky',top:54,zIndex:100,background:'#fff',borderBottom:'1px solid rgba(188,202,195,0.4)',padding:'10px 1rem',boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,overflowX:'auto'}}>
            <span style={{fontSize:11,fontWeight:600,color:'#6d7a74',whiteSpace:'nowrap',fontFamily:'Manrope,sans-serif'}}>Comparing:</span>
            {sel.map(co => (
              <div key={co.id} style={{display:'flex',alignItems:'center',gap:6,padding:'4px 10px',borderRadius:6,background:'rgba(0,132,137,0.08)',border:'1px solid rgba(0,132,137,0.2)',whiteSpace:'nowrap',flexShrink:0}}>
                <span style={{fontSize:12,fontWeight:500,color:'#008489',fontFamily:'Manrope,sans-serif'}}>{co.name}</span>
                <button onClick={()=>remSel(co.id)} style={{background:'none',border:'none',cursor:'pointer',color:'#6d7a74',fontSize:14,lineHeight:1,padding:0}}>x</button>
              </div>
            ))}
            {sel.length>=2 && <a href={'/compare?ids='+sel.map(c=>c.slug).join(',')} style={{padding:'5px 12px',borderRadius:6,background:'#008489',color:'white',textDecoration:'none',fontSize:11,fontWeight:600,whiteSpace:'nowrap',flexShrink:0,fontFamily:'Manrope,sans-serif'}}>Compare</a>}
          </div>
        </div>
      )}
      <div style={{maxWidth:1400,margin:'0 auto',padding:'2rem 2rem 1.5rem'}}>
        <h1 style={{fontFamily:'Manrope,sans-serif',fontWeight:800,fontSize:'clamp(1.8rem,3.5vw,2.8rem)',letterSpacing:'-.03em',color:'#191c1e',marginBottom:8}}>Find the right fintech for your business</h1>
        <p style={{fontSize:15,color:'#3d4945',lineHeight:1.7,maxWidth:560,marginBottom:'1.5rem'}}>Browse 100 companies, filter by category, and compare any 2-3 side by side.</p>
        <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:'1.5rem'}}>
          <span style={{fontSize:11,fontWeight:600,color:'#6d7a74',textTransform:'uppercase',alignSelf:'center',marginRight:4}}>Popular:</span>
          {POPULAR.map(p => (
            <button key={p.label} onClick={()=>loadPreset(p)} style={{fontSize:12,padding:'5px 12px',borderRadius:6,cursor:'pointer',fontFamily:'Manrope,sans-serif',transition:'all .15s',border:preset===p.label?'1px solid #008489':'1px solid rgba(188,202,195,0.5)',background:preset===p.label?'rgba(0,132,137,0.08)':'#fff',color:preset===p.label?'#008489':'#3d4945'}}>{p.label}</button>
          ))}
        </div>
      </div>
      <div className="compare-grid" style={{maxWidth:1400,margin:'0 auto',padding:'0 2rem 4rem',display:'grid',gridTemplateColumns:'220px 1fr 260px',gap:24,alignItems:'start'}}>
        <Sidebar cat={cat} setCat={c=>{setCat(c);setVisible(20)}} sort={sort} setSort={setSort} all={all} counts={counts}/>
        <div>
          {sel.length>=2 && (
            <div id="ctable" style={{marginBottom:24,background:'#fff',border:'1px solid rgba(188,202,195,0.4)',borderRadius:16,overflow:'hidden',boxShadow:'0 4px 24px -4px rgba(0,0,0,0.07)'}}>
              <div style={{padding:'14px 20px',borderBottom:'1px solid rgba(188,202,195,0.3)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div style={{fontFamily:'Manrope,sans-serif',fontWeight:700,fontSize:14,color:'#191c1e'}}>Comparing {sel.length} companies</div>
                <button onClick={()=>setSel([])} style={{background:'none',border:'1px solid rgba(188,202,195,0.5)',borderRadius:6,padding:'4px 10px',cursor:'pointer',fontSize:12,color:'#6d7a74',fontFamily:'Manrope,sans-serif'}}>Clear all</button>
              </div>
              <CompareTable selected={sel} sm={false}/>
            </div>
          )}
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
            <div style={{flex:1,display:'flex',alignItems:'center',background:'#fff',border:'1px solid rgba(188,202,195,0.5)',borderRadius:8,padding:'0 14px',boxShadow:'0 1px 3px rgba(0,0,0,0.04)'}}>
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" style={{flexShrink:0,marginRight:8}}>
                <circle cx="8" cy="8" r="5.5" stroke="#6d7a74" strokeWidth="1.5"/>
                <path d="M12.5 12.5L16 16" stroke="#6d7a74" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search companies..." style={{flex:1,padding:'10px 0',fontSize:14,fontFamily:'Manrope,sans-serif',background:'transparent',border:'none',outline:'none',color:'#191c1e'}}/>
            </div>
            <div style={{fontSize:13,color:'#6d7a74',whiteSpace:'nowrap',flexShrink:0}}>
              <strong style={{color:'#191c1e'}}>{Math.min(visible,filtered.length)}</strong> of <strong style={{color:'#191c1e'}}>{filtered.length}</strong>
            </div>
          </div>
          {notFound&&search && (
            <div style={{padding:'14px 16px',borderRadius:10,marginBottom:12,background:'rgba(220,38,38,0.04)',border:'1px solid rgba(220,38,38,0.15)'}}>
              <div style={{fontFamily:'Manrope,sans-serif',fontWeight:600,fontSize:14,color:'#191c1e',marginBottom:2}}>No exact match for "{search}"</div>
              <div style={{fontFamily:'Manrope,sans-serif',fontSize:13,color:'#6d7a74'}}>Showing similar results. <a href={'mailto:hello@thefintechrank.com?subject=Missing: '+search} style={{color:'#008489',textDecoration:'none',fontWeight:500}}>Suggest a company</a></div>
            </div>
          )}
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {loading ? Array.from({length:5}).map((_,i)=>(
              <div key={i} style={{height:140,borderRadius:12,background:'#e8eaed'}}/>
            )) : filtered.slice(0,visible).map(co => {
              const isSel = !!sel.find(s=>s.id===co.id)
              const tc = CAT_COLORS[co.category]||'#6d7a74'
              return (
                <div key={co.id} style={{background:'#fff',border:'1px solid rgba(188,202,195,0.4)',borderRadius:12,padding:'1rem 1.25rem',boxShadow:'0 1px 3px rgba(0,0,0,0.04)',transition:'box-shadow .2s,border-color .2s,transform .2s'}} onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.09)';e.currentTarget.style.borderColor='rgba(0,132,137,0.2)';e.currentTarget.style.transform='translateY(-1px)'}} onMouseLeave={e=>{e.currentTarget.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)';e.currentTarget.style.borderColor='rgba(188,202,195,0.4)';e.currentTarget.style.transform='translateY(0)'}}>
                  <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                    <div style={{width:44,height:44,flexShrink:0,borderRadius:8,background:'#f0f2f5',border:'1px solid rgba(188,202,195,0.4)',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
                      <Logo website={co.website} name={co.name}/>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:8,marginBottom:4}}>
                        <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                          <span style={{fontFamily:'Manrope,sans-serif',fontWeight:700,fontSize:15,color:'#191c1e'}}>{co.name}</span>
                          {co.badge && <span style={{fontSize:9,fontWeight:700,letterSpacing:'.08em',padding:'2px 7px',borderRadius:3,textTransform:'uppercase',background:'rgba(37,99,235,0.1)',color:'#1d4ed8',border:'1px solid rgba(37,99,235,0.2)'}}>{co.badge}</span>}
                          <span style={{fontSize:10,fontWeight:500,padding:'2px 8px',borderRadius:3,background:tc+'20',color:tc}}>{co.category}</span>
                        </div>
                        <div style={{flexShrink:0,textAlign:'right'}}>
                          <div style={{color:'#d97706',fontSize:11}}>{co.rating} / 5</div>
                          <div style={{fontSize:11,color:'#6d7a74',marginTop:1}}>{(co.review_count||0).toLocaleString()} reviews</div>
                        </div>
                      </div>
                      <p style={{fontSize:13,color:'#3d4945',lineHeight:1.65,marginBottom:12,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{co.description}</p>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8,paddingTop:10,borderTop:'1px solid rgba(188,202,195,0.3)'}}>
                        <div style={{fontSize:12,color:'#3d4945'}}><strong style={{fontWeight:500,color:'#191c1e'}}>Pricing: </strong>{co.pricing}</div>
                        <div style={{display:'flex',gap:8}}>
                          <button onClick={()=>addSel(co)} style={{fontSize:11,padding:'5px 12px',borderRadius:6,cursor:'pointer',fontFamily:'Manrope,sans-serif',fontWeight:500,transition:'all .15s',border:isSel?'1px solid #008489':'1px solid rgba(188,202,195,0.5)',background:isSel?'rgba(0,132,137,0.08)':'transparent',color:isSel?'#008489':'#6d7a74'}}>{isSel?'Added':'+ Compare'}</button>
                          <a href={'/review/'+co.slug} style={{fontSize:11,padding:'5px 12px',borderRadius:6,border:'1px solid rgba(188,202,195,0.5)',color:'#3d4945',textDecoration:'none',fontFamily:'Manrope,sans-serif'}}>Full review</a>
                          <a href={co.affiliate_url||co.website} target="_blank" rel="noopener noreferrer" style={{fontSize:11,padding:'5px 12px',borderRadius:6,background:'#008489',color:'#fff',textDecoration:'none',fontFamily:'Manrope,sans-serif',fontWeight:500}}>Visit site</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {visible<filtered.length && (
            <div style={{textAlign:'center',marginTop:24}}>
              <button onClick={()=>setVisible(v=>v+20)} style={{padding:'10px 28px',borderRadius:8,border:'1px solid rgba(188,202,195,0.5)',background:'#fff',color:'#3d4945',fontFamily:'Manrope,sans-serif',fontSize:14,cursor:'pointer'}}>Show {Math.min(20,filtered.length-visible)} more</button>
            </div>
          )}
        </div>
        <RightPanel sel={sel} setSel={setSel} addSel={addSel} remSel={remSel}/>
      </div>
    </div>
  )
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div style={{padding:'4rem',textAlign:'center',color:'#6d7a74'}}>Loading...</div>}>
      <CompareInner/>
    </Suspense>
  )
}

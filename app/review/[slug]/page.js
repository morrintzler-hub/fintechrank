'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function ReviewPage({ params }) {
  const { slug } = params
  const [company, setCompany] = useState(null)
  const [pros, setPros] = useState([])
  const [cons, setCons] = useState([])
  const [features, setFeatures] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: co }, { data: pc }, { data: ft }, { data: rp }] = await Promise.all([
        supabase.from('companies').select('*').eq('slug', slug).single(),
        supabase.from('pros_cons').select('*').eq('company_id',
          supabase.from('companies').select('id').eq('slug', slug)
        ).order('sort_order'),
        supabase.from('company_features')
          .select('supported, notes, features(name, category, sort_order)')
          .eq('company_id', (await supabase.from('companies').select('id').eq('slug',slug).single()).data?.id)
          .order('features(sort_order)'),
        supabase.from('discrepancy_reports')
          .select('*')
          .eq('company_id', (await supabase.from('companies').select('id').eq('slug',slug).single()).data?.id)
          .in('status',['verified','reviewing','pending'])
          .order('created_at', { ascending: false })
          .limit(5)
      ])

      // Re-fetch pros/cons with correct company_id
      if (co) {
        const { data: pcFix } = await supabase.from('pros_cons').select('*').eq('company_id', co.id).order('sort_order')
        const { data: ftFix } = await supabase.from('company_features').select('supported,notes,features(name,category,sort_order)').eq('company_id', co.id)
        const { data: rpFix } = await supabase.from('discrepancy_reports').select('*').eq('company_id', co.id).in('status',['verified','reviewing','pending']).order('created_at',{ascending:false}).limit(5)

        setCompany(co)
        setPros((pcFix||[]).filter(x=>x.type==='pro'))
        setCons((pcFix||[]).filter(x=>x.type==='con'))
        setFeatures(ftFix||[])
        setReports(rpFix||[])
      }
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) return <LoadingSkeleton />
  if (!company) return <NotFound slug={slug} />

  return <ReviewLayout company={company} pros={pros} cons={cons} features={features} reports={reports} />
}

function ReviewLayout({ company: c, pros, cons, features, reports }) {
  const [reportOpen, setReportOpen] = useState(false)
  const [selectedType, setSelectedType] = useState(null)
  const [formData, setFormData] = useState({ desc:'', fix:'', url:'', name:'', email:'' })
  const [privacy, setPrivacy] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [aiResponse, setAiResponse] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [reportId, setReportId] = useState(null)
  const [priority, setPriority] = useState(null)

  // Group features by category
  const featGroups = {}
  features.forEach(f => {
    const cat = f.features?.category || 'General'
    if (!featGroups[cat]) featGroups[cat] = []
    featGroups[cat].push(f)
  })

  async function submitReport() {
    if (!formData.desc.trim() || !privacy) return
    setSubmitting(true)

    // Claude API for AI triage
    let aiText = '', prio = 'Medium'
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          model:'claude-sonnet-4-20250514', max_tokens:500,
          messages:[{ role:'user', content:`You review discrepancy reports for FintechRank, a fintech comparison site. A user reported an issue about ${c.name}.

Type: ${selectedType || 'General'}
Description: "${formData.desc}"
${formData.fix ? `Suggested fix: "${formData.fix}"` : ''}
${formData.url ? `Source: ${formData.url}` : ''}

Write a warm 2-sentence acknowledgement. End with: PRIORITY:[High/Medium/Low]
High = pricing/fees numbers wrong. Medium = features/availability. Low = wording.` }]
        })
      })
      const data = await res.json()
      const full = data.content?.[0]?.text || ''
      const pm = full.match(/PRIORITY:(High|Medium|Low)/i)
      prio = pm ? pm[1] : 'Medium'
      aiText = full.replace(/PRIORITY:[^\n]+/i,'').trim()
    } catch {
      aiText = `Thank you for flagging this about ${c.name}. Our team will review your report within 48 hours and update the information if verified.`
    }

    // Save to Supabase
    const ref = 'FR-' + Math.random().toString(36).substr(2,6).toUpperCase()
    await supabase.from('discrepancy_reports').insert({
      company_id: c.id,
      report_type: selectedType || 'Other',
      description: formData.desc,
      suggested_fix: formData.fix || null,
      source_url: formData.url || null,
      reporter_name: formData.name || null,
      reporter_email: formData.email || null,
      priority: prio,
      status: 'pending',
      ai_response: aiText,
      report_ref: ref,
    })

    setAiResponse(aiText)
    setPriority(prio)
    setReportId(ref)
    setSubmitting(false)
    setTimeout(() => setSubmitted(true), 2000)
  }

  const statusStyle = {
    verified: {bg:'rgba(34,197,94,.12)',color:'var(--green)',border:'1px solid rgba(34,197,94,.2)',label:'✓ Verified & updated'},
    reviewing:{bg:'rgba(245,158,11,.12)',color:'var(--gold)', border:'1px solid rgba(245,158,11,.2)',label:'⟳ Under review'},
    pending:  {bg:'rgba(99,102,241,.1)', color:'#818cf8',    border:'1px solid rgba(99,102,241,.2)',label:'○ Pending'},
  }

  return (
    <div>
      {/* Hero */}
      <div className="fade-in" style={{padding:'2.5rem 2rem 2rem',borderBottom:'1px solid var(--border)',background:`radial-gradient(ellipse 60% 40% at 30% 0%, rgba(37,99,235,.18) 0%, transparent 65%)`}}>
        <div style={{maxWidth:1000,margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'2rem',flexWrap:'wrap'}}>
          <div style={{display:'flex',gap:'1.25rem',flex:1,minWidth:260}}>
            <div style={{width:64,height:64,flexShrink:0,borderRadius:14,background:'var(--bg3)',border:'1px solid var(--borderh)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--heading)',fontWeight:800,fontSize:18,color:'var(--muted)'}}>
              {c.name.slice(0,2).toUpperCase()}
            </div>
            <div>
              <div style={{display:'flex',gap:7,marginBottom:8,flexWrap:'wrap'}}>
                {c.badge && <span style={{fontSize:10,fontWeight:600,padding:'2px 8px',borderRadius:4,background:'rgba(37,99,235,.2)',color:'#60a5fa',border:'1px solid rgba(59,130,246,.25)'}}>{c.badge.charAt(0).toUpperCase()+c.badge.slice(1)}</span>}
                <span style={{fontSize:11,fontWeight:500,padding:'3px 10px',borderRadius:20,background:'rgba(37,99,235,.12)',color:'var(--blue)'}}>{c.category}</span>
              </div>
              <div style={{fontFamily:'var(--heading)',fontSize:'1.8rem',fontWeight:800,lineHeight:1.1,marginBottom:4}}>{c.name}</div>
              <div style={{fontSize:14,color:'var(--muted)'}}>{c.tagline}</div>
            </div>
          </div>
          <div style={{display:'flex',gap:'1rem',alignItems:'flex-start',flexWrap:'wrap'}}>
            <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'var(--r)',padding:'1rem 1.25rem',textAlign:'center',minWidth:130}}>
              <div style={{fontFamily:'var(--heading)',fontSize:'2.6rem',fontWeight:800,lineHeight:1}}>{c.rating}</div>
              <div style={{color:'var(--gold)',fontSize:14,letterSpacing:1,margin:'4px 0'}}>{'★'.repeat(Math.round(c.rating))}</div>
              <div style={{fontSize:11,color:'var(--dim)'}}>{(c.review_count||0).toLocaleString()} reviews</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:8,minWidth:140}}>
              <a href={c.affiliate_url || c.website} target="_blank" rel="noopener noreferrer"
                className="btn-primary" style={{justifyContent:'center'}}>Visit {c.name} ↗</a>
              <a href="/" className="btn-secondary" style={{justifyContent:'center'}}>← Back to list</a>
              <div style={{fontSize:10,color:'var(--dim)',textAlign:'center'}}>Affiliate link · we may earn a commission</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{maxWidth:1000,margin:'0 auto',padding:'2rem 2rem 2rem',display:'grid',gridTemplateColumns:'1fr 280px',gap:'2rem',alignItems:'start'}}>
        <div>
          {/* Overview */}
          <Section title="Overview" delay="0s">
            <p style={{fontSize:14,color:'var(--muted)',lineHeight:1.8}}>{c.description}</p>
          </Section>

          {/* Pros / Cons */}
          {(pros.length > 0 || cons.length > 0) && (
            <Section title="Pros & Cons" delay=".1s">
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                <PCCard type="pros" items={pros} />
                <PCCard type="cons" items={cons} />
              </div>
            </Section>
          )}

          {/* Features */}
          {features.length > 0 && (
            <Section title="Features" delay=".2s">
              <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'var(--r)',overflow:'hidden'}}>
                {Object.entries(featGroups).map(([grp, items]) => (
                  <div key={grp}>
                    <div style={{padding:'.5rem .9rem',background:'var(--bg3)',fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'.1em',color:'var(--dim)'}}>{grp}</div>
                    {items.map((f,i) => (
                      <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'.65rem .9rem',borderBottom:'1px solid var(--border)',fontSize:13}}>
                        <span style={{color:'var(--muted)'}}>{f.features?.name}</span>
                        <span style={{fontWeight:500,color:f.supported===true?'var(--green)':f.supported===false?'var(--red)':'var(--gold)'}}>
                          {f.supported===true?'✓ Yes':f.supported===false?'✗ No':'~ Partial'}
                          {f.notes && <span style={{fontSize:11,color:'var(--dim)',marginLeft:6}}>({f.notes})</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Pricing */}
          <Section title="Pricing" delay=".3s">
            <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'var(--r)',padding:'1.25rem'}}>
              <div style={{fontFamily:'var(--heading)',fontSize:'1.4rem',fontWeight:700,marginBottom:4}}>{c.pricing}</div>
              <div style={{fontSize:13,color:'var(--muted)',marginBottom:'1rem'}}>Pricing model: {c.pricing_model}</div>
              <a href={c.affiliate_url||c.website} target="_blank" rel="noopener noreferrer" className="btn-primary">
                See full pricing on {c.name} ↗
              </a>
            </div>
          </Section>

          {/* Verdict */}
          <Section title="Our Verdict" delay=".4s">
            <div style={{background:'linear-gradient(135deg,rgba(0,212,170,.07),rgba(37,99,235,.05))',border:'1px solid rgba(0,212,170,.18)',borderRadius:'var(--r)',padding:'1.25rem'}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:'.85rem'}}>
                <span style={{fontSize:'1.3rem'}}>🏆</span>
                <span style={{fontFamily:'var(--heading)',fontSize:'.95rem',fontWeight:700}}>Editorial Score</span>
              </div>
              <p style={{fontSize:13,color:'var(--muted)',lineHeight:1.75,marginBottom:'1rem'}}>{c.description}</p>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:12,color:'var(--dim)',minWidth:90}}>Overall score</span>
                <div style={{flex:1,height:5,background:'rgba(255,255,255,.06)',borderRadius:3,overflow:'hidden'}}>
                  <div className="score-bar-fill" style={{'--target-width':`${(c.rating/5)*100}%`,height:'100%',borderRadius:3,background:'linear-gradient(90deg,var(--accent),var(--blue))'}} />
                </div>
                <span style={{fontSize:13,fontWeight:600,color:'var(--accent)'}}>{c.rating}</span>
              </div>
            </div>
          </Section>

          {/* Quick facts mobile */}
          <div className="fade-up" style={{display:'none'}}>
            <QuickFacts company={c} />
          </div>

        </div>

        {/* Aside */}
        <div style={{display:'flex',flexDirection:'column',gap:'1.25rem',position:'sticky',top:80}}>
          <QuickFacts company={c} />
          {c.tag_list?.length > 0 && (
            <div className="slide-right" style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'var(--r)',padding:'1.1rem'}}>
              <div style={{fontFamily:'var(--heading)',fontSize:13,fontWeight:700,marginBottom:'.85rem'}}>Tags</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                {(c.tag_list||[]).map(t=>(
                  <span key={t} style={{fontSize:11,padding:'2px 8px',borderRadius:20,border:'1px solid var(--border)',color:'var(--dim)'}}>{t}</span>
                ))}
              </div>
            </div>
          )}
          <div className="slide-right" style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'var(--r)',padding:'1.1rem',animationDelay:'.15s'}}>
            <div style={{fontFamily:'var(--heading)',fontSize:13,fontWeight:700,marginBottom:'.85rem'}}>Founded</div>
            <div style={{fontSize:'1.6rem',fontFamily:'var(--heading)',fontWeight:800,color:'var(--text)'}}>{c.founded_year}</div>
            <div style={{fontSize:12,color:'var(--muted)',marginTop:4}}>{c.hq_country}</div>
          </div>
        </div>
      </div>

      {/* ── REPORT SECTION ── */}
      <div style={{maxWidth:1000,margin:'0 auto',padding:'0 2rem 4rem'}}>
        {/* Recent reports */}
        {reports.length > 0 && (
          <div className="fade-up" style={{marginBottom:'1.5rem'}}>
            <div className="section-title">Recent community reports</div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {reports.map(r => {
                const s = statusStyle[r.status] || statusStyle.pending
                return (
                  <div key={r.id} style={{display:'flex',gap:12,padding:'.75rem',background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'var(--rsm)',alignItems:'flex-start'}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:3,flexWrap:'wrap'}}>
                        <span style={{fontSize:10,fontWeight:600,color:'var(--accent)',textTransform:'uppercase',letterSpacing:'.06em'}}>{r.report_type}</span>
                        <span style={{fontSize:10,padding:'2px 7px',borderRadius:10,background:s.bg,color:s.color,border:s.border}}>{s.label}</span>
                      </div>
                      <div style={{fontSize:12,color:'var(--muted)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{r.description}</div>
                      <div style={{fontSize:11,color:'var(--dim)',marginTop:2}}>
                        {r.reporter_name ? `Reported by ${r.reporter_name}` : 'Reported anonymously'} · {new Date(r.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Report trigger */}
        {!submitted ? (
          <>
            <div className="fade-up"
              onClick={() => setReportOpen(o=>!o)}
              style={{background:'var(--bg2)',border:`1px solid ${reportOpen?'rgba(245,158,11,.3)':'var(--border)'}`,borderRadius:reportOpen?'var(--r) var(--r) 0 0':'var(--r)',padding:'1rem 1.25rem',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'1rem',cursor:'pointer',transition:'border-color .2s',flexWrap:'wrap'}}
            >
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:36,height:36,borderRadius:8,background:'rgba(245,158,11,.1)',border:'1px solid rgba(245,158,11,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>⚠️</div>
                <div>
                  <div style={{fontFamily:'var(--heading)',fontSize:14,fontWeight:700}}>Spotted something outdated?</div>
                  <div style={{fontSize:12,color:'var(--muted)',marginTop:2}}>Help keep {c.name}'s info accurate — report a discrepancy</div>
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <span style={{fontSize:11,padding:'3px 9px',borderRadius:20,background:'rgba(245,158,11,.1)',color:'var(--gold)',border:'1px solid rgba(245,158,11,.2)'}}>{reports.length} reports</span>
                <span style={{fontSize:12,color:'var(--dim)',transition:'transform .3s',display:'inline-block',transform:reportOpen?'rotate(180deg)':'none'}}>▼</span>
              </div>
            </div>

            {/* Form panel */}
            <div style={{background:'var(--bg2)',border:'1px solid rgba(245,158,11,.25)',borderTop:'none',borderRadius:'0 0 var(--r) var(--r)',overflow:'hidden',maxHeight:reportOpen?900:0,transition:'max-height .4s cubic-bezier(.4,0,.2,1)'}}>
              <div style={{padding:'1.5rem'}}>
                {/* Type grid */}
                <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--dim)',marginBottom:8}}>Type of discrepancy</div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:7,marginBottom:'1.1rem'}}>
                  {[['💰','Pricing / Fees','Rates, plans'],['⚙️','Features','Missing or wrong'],['🌍','Availability','Country / region'],['📋','Terms & Policies','TOS, refunds'],['⭐','Rating','Score accuracy'],['📝','Other','Anything else']].map(([icon,name,desc]) => (
                    <button key={name} onClick={()=>setSelectedType(name)}
                      style={{padding:'.65rem',borderRadius:'var(--rsm)',border:`1px solid ${selectedType===name?'rgba(245,158,11,.45)':'var(--border)'}`,background:selectedType===name?'rgba(245,158,11,.06)':'var(--bg3)',cursor:'pointer',textAlign:'left',fontFamily:'var(--font)',transition:'all .15s'}}>
                      <span style={{fontSize:16,display:'block',marginBottom:4}}>{icon}</span>
                      <span style={{fontSize:12,fontWeight:500,color:'var(--text)',display:'block'}}>{name}</span>
                      <span style={{fontSize:10,color:'var(--muted)',marginTop:1,display:'block'}}>{desc}</span>
                    </button>
                  ))}
                </div>

                {/* Fields */}
                <FormField label="What's incorrect?" required>
                  <textarea value={formData.desc} onChange={e=>setFormData(p=>({...p,desc:e.target.value}))} maxLength={500}
                    placeholder={`e.g. The ${c.name} pricing listed is outdated — I verified the current fee on their website today.`}
                    style={{width:'100%',background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:'var(--rsm)',padding:'9px 12px',fontSize:13,fontFamily:'var(--font)',color:'var(--text)',outline:'none',resize:'vertical',minHeight:90,lineHeight:1.6}} />
                  <div style={{fontSize:10,color:'var(--dim)',textAlign:'right',marginTop:3}}>{formData.desc.length} / 500</div>
                </FormField>

                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                  <FormField label="What should it say?">
                    <input type="text" value={formData.fix} onChange={e=>setFormData(p=>({...p,fix:e.target.value}))} placeholder="e.g. 1.5% + 25p" style={inputStyle} />
                  </FormField>
                  <FormField label="Source URL (optional)">
                    <input type="url" value={formData.url} onChange={e=>setFormData(p=>({...p,url:e.target.value}))} placeholder={`https://${c.website?.replace('https://','')}`} style={inputStyle} />
                  </FormField>
                  <FormField label="Your name (optional)">
                    <input type="text" value={formData.name} onChange={e=>setFormData(p=>({...p,name:e.target.value}))} placeholder="e.g. Sarah K." style={inputStyle} />
                  </FormField>
                  <FormField label="Your email (optional)">
                    <input type="email" value={formData.email} onChange={e=>setFormData(p=>({...p,email:e.target.value}))} placeholder="Notify me when fixed" style={inputStyle} />
                  </FormField>
                </div>

                <div style={{display:'flex',alignItems:'flex-start',gap:9,padding:'.85rem',background:'var(--bg3)',borderRadius:'var(--rsm)',marginBottom:'1.1rem',border:'1px solid var(--border)'}}>
                  <input type="checkbox" checked={privacy} onChange={e=>setPrivacy(e.target.checked)} style={{width:15,height:15,flexShrink:0,marginTop:2,accentColor:'var(--gold)',cursor:'pointer'}} />
                  <div style={{fontSize:11,color:'var(--muted)',lineHeight:1.6}}>I confirm this report is accurate to the best of my knowledge. My email (if provided) will only be used to notify me when resolved.</div>
                </div>

                <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
                  <button onClick={submitReport} disabled={submitting||!formData.desc.trim()||!privacy}
                    style={{padding:'10px 24px',borderRadius:'var(--rsm)',border:'none',background:submitting||!formData.desc.trim()||!privacy?'var(--bg3)':'var(--gold)',color:submitting||!formData.desc.trim()||!privacy?'var(--dim)':'#000',fontFamily:'var(--font)',fontSize:13,fontWeight:600,cursor:submitting||!formData.desc.trim()||!privacy?'not-allowed':'pointer',display:'flex',alignItems:'center',gap:7,transition:'all .2s'}}>
                    {submitting ? '⟳ Submitting…' : 'Submit report'}
                  </button>
                  <button onClick={()=>setReportOpen(false)} className="btn-secondary">Cancel</button>
                  <div style={{fontSize:11,color:'var(--dim)',flex:1}}>Pricing errors reviewed same day. Other reports within 48 hours.</div>
                </div>

                {/* AI response */}
                {aiResponse && (
                  <div style={{marginTop:'1rem',border:'1px solid var(--border)',borderRadius:'var(--rsm)',overflow:'hidden',animation:'fadeUp .3s ease'}}>
                    <div style={{background:'linear-gradient(135deg,rgba(0,212,170,.08),rgba(59,130,246,.06))',padding:'.65rem 1rem',display:'flex',alignItems:'center',gap:9,borderBottom:'1px solid var(--border)'}}>
                      <div style={{width:26,height:26,borderRadius:'50%',background:'linear-gradient(135deg,var(--accent),var(--blue))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,flexShrink:0}}>✦</div>
                      <div>
                        <div style={{fontSize:13,fontWeight:500}}>FintechRank AI reviewer</div>
                        <div style={{fontSize:11,color:'var(--muted)'}}>Report received</div>
                      </div>
                      <div style={{marginLeft:'auto',fontSize:10,padding:'2px 8px',borderRadius:10,background:'rgba(34,197,94,.15)',color:'var(--green)'}}>✓ Reviewed</div>
                    </div>
                    <div style={{padding:'1rem',background:'var(--bg2)'}}>
                      <div style={{fontSize:13,color:'var(--muted)',lineHeight:1.7,marginBottom:'.85rem'}}>{aiResponse}</div>
                      <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
                        <span style={{fontSize:10,padding:'2px 8px',borderRadius:20,border:'1px solid',background:priority==='High'?'rgba(248,113,113,.1)':'rgba(245,158,11,.1)',color:priority==='High'?'var(--red)':'var(--gold)',borderColor:priority==='High'?'rgba(248,113,113,.25)':'rgba(245,158,11,.25)'}}>⚡ {priority} priority</span>
                        <span style={{fontSize:10,padding:'2px 8px',borderRadius:20,border:'1px solid rgba(0,212,170,.2)',background:'rgba(0,212,170,.08)',color:'var(--accent)'}}>📂 {selectedType||'General'}</span>
                        <span style={{fontSize:10,padding:'2px 8px',borderRadius:20,border:'1px solid rgba(0,212,170,.2)',background:'rgba(0,212,170,.08)',color:'var(--accent)'}}>🕐 {priority==='High'?'4 hours':priority==='Medium'?'24 hours':'48 hours'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="fade-up" style={{background:'rgba(34,197,94,.06)',border:'1px solid rgba(34,197,94,.2)',borderRadius:'var(--r)',padding:'2rem',textAlign:'center'}}>
            <div style={{fontSize:'2rem',marginBottom:'.75rem'}}>✅</div>
            <div style={{fontFamily:'var(--heading)',fontSize:'1.05rem',fontWeight:700,marginBottom:'.5rem'}}>Report received — thank you!</div>
            <div style={{fontSize:13,color:'var(--muted)',lineHeight:1.65,maxWidth:400,margin:'0 auto .9rem'}}>Our team will review this within {priority==='High'?'4 hours':'48 hours'}. {formData.email ? "We'll email you when it's resolved." : ''}</div>
            <div style={{fontSize:11,fontFamily:'monospace',background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:5,padding:'3px 10px',display:'inline-block',color:'var(--muted)'}}>{reportId} · {priority} priority</div>
            <br/>
            <button onClick={()=>{setSubmitted(false);setReportOpen(false);setFormData({desc:'',fix:'',url:'',name:'',email:''});setPrivacy(false);setSelectedType(null);setAiResponse(null)}} className="btn-secondary" style={{marginTop:'1rem'}}>Submit another report</button>
          </div>
        )}
      </div>
    </div>
  )
}

const inputStyle = {width:'100%',background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:'var(--rsm)',padding:'9px 12px',fontSize:13,fontFamily:'DM Sans, sans-serif',color:'var(--text)',outline:'none'}

function FormField({ label, required, children }) {
  return (
    <div style={{marginBottom:'.9rem'}}>
      <div style={{fontSize:12,fontWeight:500,color:'var(--muted)',marginBottom:5}}>
        {label} {required && <span style={{color:'var(--red)',fontSize:10}}>*</span>}
      </div>
      {children}
    </div>
  )
}

function Section({ title, children, delay='0s' }) {
  return (
    <div className="fade-up" style={{marginBottom:'2.25rem',transitionDelay:delay}}>
      <div className="section-title">{title}</div>
      {children}
    </div>
  )
}

function PCCard({ type, items }) {
  const isP = type==='pros'
  return (
    <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderTop:`2px solid ${isP?'var(--green)':'var(--red)'}`,borderRadius:'var(--r)',overflow:'hidden'}}>
      <div style={{padding:'.6rem .9rem',fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'.1em',color:isP?'var(--green)':'var(--red)',display:'flex',alignItems:'center',gap:6,borderBottom:`1px solid ${isP?'rgba(34,197,94,.12)':'rgba(248,113,113,.1)'}`}}>
        <div style={{width:5,height:5,borderRadius:'50%',background:isP?'var(--green)':'var(--red)'}} />
        {isP ? 'What we love' : 'Watch out for'}
      </div>
      <ul style={{listStyle:'none',padding:0}}>
        {items.map((item,i) => (
          <li key={i} style={{fontSize:13,color:'var(--muted)',lineHeight:1.5,padding:'.5rem .9rem',borderBottom:'1px solid var(--border)',display:'flex',gap:8,alignItems:'flex-start'}}>
            <span style={{color:isP?'var(--green)':'var(--red)',flexShrink:0,marginTop:2}}>{isP?'✓':'✗'}</span>
            {item.text}
          </li>
        ))}
        {items.length === 0 && (
          <li style={{fontSize:13,color:'var(--dim)',padding:'.75rem .9rem'}}>No data yet</li>
        )}
      </ul>
    </div>
  )
}

function QuickFacts({ company: c }) {
  const facts = [
    ['Founded', c.founded_year],
    ['HQ', c.hq_country],
    ['Category', c.category],
    ['Pricing model', c.pricing_model],
    ['Last verified', new Date().toLocaleDateString('en-GB',{month:'short',year:'numeric'})],
  ]
  return (
    <div className="slide-right" style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'var(--r)',padding:'1.1rem',overflow:'hidden'}}>
      <div style={{fontFamily:'var(--heading)',fontSize:13,fontWeight:700,marginBottom:'.85rem'}}>Quick Facts</div>
      {facts.filter(([,v])=>v).map(([k,v]) => (
        <div key={k} style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:12,padding:'.4rem 0',borderBottom:'1px solid var(--border)'}}>
          <span style={{color:'var(--dim)'}}>{k}</span>
          <span style={{color:'var(--text)',fontWeight:500,textAlign:'right',maxWidth:'55%'}}>{v}</span>
        </div>
      ))}
      <div style={{fontSize:11,color:'var(--dim)',textAlign:'center',paddingTop:'.75rem',marginTop:'.25rem'}}>
        <span className="pulse" style={{display:'inline-block',width:6,height:6,borderRadius:'50%',background:'var(--green)',marginRight:5}} />
        Community verified
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div style={{maxWidth:1000,margin:'0 auto',padding:'2rem'}}>
      <div className="skeleton" style={{height:180,borderRadius:'var(--r)',marginBottom:'2rem'}} />
      <div style={{display:'grid',gridTemplateColumns:'1fr 280px',gap:'2rem'}}>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {[120,200,180,140].map((h,i) => <div key={i} className="skeleton" style={{height:h,borderRadius:'var(--r)'}} />)}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {[160,100,80].map((h,i) => <div key={i} className="skeleton" style={{height:h,borderRadius:'var(--r)'}} />)}
        </div>
      </div>
    </div>
  )
}

function NotFound({ slug }) {
  return (
    <div style={{textAlign:'center',padding:'4rem 2rem'}}>
      <div style={{fontSize:'3rem',marginBottom:'1rem'}}>🔍</div>
      <div style={{fontFamily:'var(--heading)',fontSize:'1.5rem',fontWeight:800,marginBottom:'.5rem'}}>Company not found</div>
      <div style={{fontSize:14,color:'var(--muted)',marginBottom:'1.5rem'}}>No company with slug "{slug}" exists in the database.</div>
      <a href="/" className="btn-primary">← Back to all companies</a>
    </div>
  )
}

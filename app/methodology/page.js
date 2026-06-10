export const metadata = {
  title: 'Our Methodology | The Fintech Rank',
  description: 'How we score and rank the leading Fintech companies. Our editorial scoring process, data sources, and transparency commitments.',
}

const DIMENSIONS = [
  {
    label: 'User sentiment',
    weight: '20%',
    desc: 'Aggregated signals from major review platforms including the App Store, Google Play, and Trustpilot. We look at volume, recency, and consistency of reviews - not just the headline number.',
  },
  {
    label: 'Product breadth',
    weight: '20%',
    desc: 'How many of the 16 core fintech features does the company offer? A company with a mobile app, API access, multi-currency accounts, and BNPL scores higher than one offering basic payments only.',
  },
  {
    label: 'Pricing transparency',
    weight: '20%',
    desc: 'Companies with clear, upfront pricing score higher than those hiding fees in small print. We reward no-fee models, transparent per-use pricing, and honest freemium tiers.',
  },
  {
    label: 'Regulatory standing',
    weight: '20%',
    desc: 'Is the company licensed and regulated in its primary market? Companies with full banking licences, FCA authorisation, or SEC registration score higher than unregulated alternatives.',
  },
  {
    label: 'Market presence',
    weight: '20%',
    desc: 'Measured by customer numbers, transaction volume, countries served, and years in operation. A company processing $1 trillion annually carries more weight than a new entrant.',
  },
]

const NOT_LIST = [
  'A direct import from Google, Trustpilot, or any single review platform',
  'Influenced by affiliate relationships or advertising spend',
  'A real-time live data feed - scores are reviewed and updated periodically',
  'A guarantee of quality - always do your own due diligence before choosing a financial product',
]

export default function MethodologyPage() {
  return (
    <div style={{ background:'#f7f9fb', minHeight:'100vh' }}>
      <div style={{ maxWidth:760, margin:'0 auto', padding:'4rem 2rem 6rem' }}>

        <div style={{ marginBottom:'3rem' }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.18em', textTransform:'uppercase', color:'#008489', display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
            <span style={{ width:5, height:5, borderRadius:'50%', background:'#008489', display:'inline-block' }}/>
            Transparency
          </div>
          <h1 style={{ fontFamily:'Manrope,sans-serif', fontWeight:800, fontSize:'clamp(2rem,4vw,3rem)', letterSpacing:'-.03em', color:'#191c1e', lineHeight:1.1, marginBottom:16 }}>
            How we score fintech companies
          </h1>
          <p style={{ fontSize:16, color:'#3d4945', lineHeight:1.8, maxWidth:620 }}>
            The Fintech Rank uses an editorial scoring model - not an algorithmic feed or paid placement. Here is exactly how it works.
          </p>
        </div>

        <div style={{ background:'#fff', border:'1px solid rgba(188,202,195,0.4)', borderRadius:16, padding:'2rem', marginBottom:'2rem', boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontFamily:'Manrope,sans-serif', fontWeight:700, fontSize:20, color:'#191c1e', marginBottom:8 }}>
            The Editorial Score (0 - 5)
          </h2>
          <p style={{ fontSize:15, color:'#3d4945', lineHeight:1.8, marginBottom:'1.5rem' }}>
            Every company is given an Editorial Score between 0 and 5, reflecting our independent research across five equally weighted dimensions:
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {DIMENSIONS.map((item, i) => (
              <div key={i} style={{ display:'flex', gap:16, padding:'16px', background:'#f7f9fb', borderRadius:10, border:'1px solid rgba(188,202,195,0.3)' }}>
                <div style={{ flexShrink:0, width:48, height:48, borderRadius:10, background:'rgba(0,132,137,0.08)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Manrope,sans-serif', fontWeight:800, fontSize:13, color:'#008489' }}>
                  {item.weight}
                </div>
                <div>
                  <div style={{ fontFamily:'Manrope,sans-serif', fontWeight:700, fontSize:14, color:'#191c1e', marginBottom:4 }}>{item.label}</div>
                  <div style={{ fontSize:13, color:'#3d4945', lineHeight:1.7 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background:'#fff', border:'1px solid rgba(188,202,195,0.4)', borderRadius:16, padding:'2rem', marginBottom:'2rem', boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontFamily:'Manrope,sans-serif', fontWeight:700, fontSize:20, color:'#191c1e', marginBottom:16 }}>
            What our score is not
          </h2>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {NOT_LIST.map((item, i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12, fontSize:14, color:'#3d4945', lineHeight:1.7 }}>
                <span style={{ flexShrink:0, marginTop:3, width:16, height:16, borderRadius:'50%', background:'rgba(220,38,38,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'#dc2626', fontWeight:700 }}>x</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background:'#fff', border:'1px solid rgba(188,202,195,0.4)', borderRadius:16, padding:'2rem', marginBottom:'2rem', boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontFamily:'Manrope,sans-serif', fontWeight:700, fontSize:20, color:'#191c1e', marginBottom:8 }}>The review count</h2>
          <p style={{ fontSize:15, color:'#3d4945', lineHeight:1.8 }}>
            The review count shown alongside each score is an estimated aggregate of publicly available reviews across major platforms (App Store, Google Play, Trustpilot). These are estimates based on our research at time of writing and are not scraped or fetched in real time. We update them periodically.
          </p>
        </div>

        <div style={{ background:'#fff', border:'1px solid rgba(188,202,195,0.4)', borderRadius:16, padding:'2rem', marginBottom:'2rem', boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontFamily:'Manrope,sans-serif', fontWeight:700, fontSize:20, color:'#191c1e', marginBottom:8 }}>Feature data</h2>
          <p style={{ fontSize:15, color:'#3d4945', lineHeight:1.8 }}>
            The 16 features listed on each company page are researched manually from each company's official website, documentation, and press releases. Features change - if you spot something out of date, please report it using the discrepancy button on any review page.
          </p>
        </div>

        <div style={{ background:'#fff', border:'1px solid rgba(188,202,195,0.4)', borderRadius:16, padding:'2rem', marginBottom:'2rem', boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontFamily:'Manrope,sans-serif', fontWeight:700, fontSize:20, color:'#191c1e', marginBottom:8 }}>How often we update</h2>
          <p style={{ fontSize:15, color:'#3d4945', lineHeight:1.8 }}>
            Editorial scores are reviewed quarterly or when a company undergoes a significant change. Pricing and feature data is reviewed monthly. The community can flag discrepancies at any time.
          </p>
        </div>

        <div style={{ background:'rgba(0,132,137,0.04)', border:'1px solid rgba(0,132,137,0.2)', borderRadius:16, padding:'2rem', marginBottom:'2rem' }}>
          <h2 style={{ fontFamily:'Manrope,sans-serif', fontWeight:700, fontSize:20, color:'#191c1e', marginBottom:8 }}>How we make money</h2>
          <p style={{ fontSize:15, color:'#3d4945', lineHeight:1.8 }}>
            Some links on The Fintech Rank are affiliate links - if you click through and sign up, we may earn a commission at no cost to you. This never influences our editorial scores or rankings. Companies cannot pay to rank higher or have negative information removed. Our editorial independence is non-negotiable.
          </p>
        </div>

        <div style={{ textAlign:'center', padding:'2rem 0' }}>
          <p style={{ fontSize:14, color:'#6d7a74', marginBottom:16 }}>Spotted something inaccurate? We want to know.</p>
          <a href="mailto:hello@thefintechrank.com" style={{ display:'inline-block', padding:'12px 28px', borderRadius:8, background:'#008489', color:'white', textDecoration:'none', fontSize:14, fontWeight:600, fontFamily:'Manrope,sans-serif' }}>
            Contact the editorial team
          </a>
        </div>

      </div>
    </div>
  )
}

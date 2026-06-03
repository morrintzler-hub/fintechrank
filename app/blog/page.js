'use client'

const POSTS = [
  { title: 'Stripe vs PayPal vs Adyen: The Complete 2025 Comparison', cat: 'Comparison', color: '#00c4a0', time: '12 min', excerpt: 'The three giants of payment processing compared across fees, developer experience, global coverage, and enterprise features.' },
  { title: "Best Neobanks in Europe 2025: Monzo vs Revolut vs Starling vs N26", cat: 'Guide', color: '#60a5fa', time: '10 min', excerpt: "A deep dive into Europe's leading digital banks — features, fees, and which one suits your lifestyle best." },
  { title: "Fintech Fee Study 2025: We Compared 100 Platforms So You Don't Have To", cat: 'Research', color: '#fbbf24', time: '15 min', excerpt: 'Original research analysing the true cost of using the top 100 fintech platforms — including hidden fees most users never see.' },
  { title: 'Coinbase vs Kraken vs Binance: Fees, Security, and Features Compared', cat: 'Comparison', color: '#c084fc', time: '11 min', excerpt: 'The three largest crypto exchanges put head to head. Which offers the best rates, the strongest security, and the most advanced trading tools?' },
  { title: 'Best Fintech Tools for Startups in 2025: Banking, Payments, Payroll', cat: 'Guide', color: '#4ade80', time: '9 min', excerpt: 'From Mercury for banking to Ramp for expenses and Deel for global hiring — the complete fintech stack for high-growth startups.' },
  { title: 'Wise vs Revolut for International Transfers: Which is Cheaper in 2025?', cat: 'Comparison', color: '#00c4a0', time: '8 min', excerpt: 'We ran 50 real transfer scenarios across both platforms to find out which actually saves you more money.' },
  { title: 'BNPL Explained: Is Buy Now Pay Later Actually Free? The Hidden Costs', cat: 'Explained', color: '#f87171', time: '7 min', excerpt: 'Klarna, Afterpay, and Affirm promise interest-free spending. But what does the fine print actually say?' },
  { title: 'Best Payment Solutions for Freelancers Working with International Clients', cat: 'Guide', color: '#60a5fa', time: '9 min', excerpt: 'Wise, Payoneer, Airwallex, and Revolut compared for the modern freelancer receiving payments from across the world.' },
]

export default function BlogPage() {
  return (
    <div style={{maxWidth:1000,margin:'0 auto',padding:'3rem 2rem 5rem',position:'relative',zIndex:1}}>

      <div className="fade-in" style={{marginBottom:'3rem'}}>
        <div style={{fontSize:10,fontWeight:500,letterSpacing:'.22em',textTransform:'uppercase',color:'var(--accent)',display:'flex',alignItems:'center',gap:8,marginBottom:'1rem'}}>
          <span style={{width:5,height:5,borderRadius:'50%',background:'var(--accent)',display:'inline-block'}}></span>
          Research and Guides
        </div>
        <h1 style={{fontFamily:'var(--font)',fontWeight:200,fontSize:'clamp(2rem,4vw,3rem)',letterSpacing:'-.03em',lineHeight:1.1,marginBottom:'.75rem'}}>
          The Fintech <span style={{color:'var(--accent)',fontWeight:400}}>Blog</span>
        </h1>
        <p style={{fontSize:14,fontWeight:300,color:'var(--muted)',lineHeight:1.7,maxWidth:520}}>
          In-depth comparisons, original research, and practical guides to help you choose the right fintech tools. No sponsored opinions — just honest analysis.
        </p>
      </div>

      <div className="fade-up" style={{background:'linear-gradient(135deg,rgba(0,196,160,.08),rgba(59,130,246,.06))',border:'1px solid rgba(0,196,160,.2)',borderRadius:'var(--r)',padding:'1.25rem 1.5rem',marginBottom:'2.5rem',display:'flex',alignItems:'center',gap:14}}>
        <div style={{fontSize:'1.5rem',flexShrink:0}}>✍️</div>
        <div style={{flex:1}}>
          <div style={{fontWeight:500,color:'var(--text)',fontSize:14,marginBottom:3}}>First articles publishing soon</div>
          <div style={{fontSize:12,fontWeight:300,color:'var(--muted)'}}>Working on in-depth research and comparisons. Sign up to be notified when we publish.</div>
        </div>
        <a href="mailto:hello@thefintechrank.com?subject=Blog notification"
          style={{flexShrink:0,fontSize:12,fontWeight:500,padding:'8px 16px',borderRadius:'var(--rsm)',background:'var(--accent)',color:'#000',textDecoration:'none',whiteSpace:'nowrap'}}>
          Notify me
        </a>
      </div>

      <div style={{fontSize:9,fontWeight:600,letterSpacing:'.2em',textTransform:'uppercase',color:'var(--dim)',marginBottom:'1.25rem'}}>
        Upcoming articles
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {POSTS.map((post, i) => (
          <div key={i} className="company-card fade-up" style={{transitionDelay: i*0.05+'s',padding:'1.1rem 1.25rem'}}>
            <div style={{display:'flex',alignItems:'flex-start',gap:'1rem',justifyContent:'space-between',flexWrap:'wrap'}}>
              <div style={{flex:1,minWidth:200}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                  <span style={{fontSize:9,fontWeight:500,letterSpacing:'.08em',textTransform:'uppercase',padding:'2px 7px',borderRadius:2,background:post.color+'22',color:post.color}}>
                    {post.cat}
                  </span>
                  <span style={{fontSize:10,fontWeight:300,color:'var(--dim)'}}>{post.time} read</span>
                </div>
                <div style={{fontWeight:400,fontSize:14,color:'var(--text)',marginBottom:4,lineHeight:1.4}}>{post.title}</div>
                <div style={{fontSize:12,fontWeight:300,color:'var(--muted)',lineHeight:1.6}}>{post.excerpt}</div>
              </div>
              <span style={{fontSize:10,padding:'3px 9px',borderRadius:20,background:'rgba(245,158,11,.1)',color:'#fbbf24',border:'1px solid rgba(245,158,11,.2)',flexShrink:0,marginTop:4}}>
                Coming soon
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function BlogPage() {
  const posts = [
    {
      slug: 'stripe-vs-paypal-vs-adyen',
      title: 'Stripe vs PayPal vs Adyen: The Complete 2025 Comparison',
      category: 'Comparison',
      categoryColor: '#00c4a0',
      date: 'Coming soon',
      readTime: '12 min read',
      excerpt: 'The three giants of payment processing compared across fees, developer experience, global coverage, and enterprise features. Which one is right for your business?',
      featured: true,
    },
    {
      slug: 'best-neobanks-europe-2025',
      title: 'Best Neobanks in Europe 2025: Monzo vs Revolut vs Starling vs N26',
      category: 'Guide',
      categoryColor: '#60a5fa',
      date: 'Coming soon',
      readTime: '10 min read',
      excerpt: 'A deep dive into Europe\'s leading digital banks — features, fees, and which one suits your lifestyle best.',
      featured: true,
    },
    {
      slug: 'fintech-fee-study-2025',
      title: 'Fintech Fee Study 2025: We Compared 100 Platforms So You Don\'t Have To',
      category: 'Research',
      categoryColor: '#fbbf24',
      date: 'Coming soon',
      readTime: '15 min read',
      excerpt: 'Original research analysing the true cost of using the world\'s top 100 fintech platforms — including hidden fees most users never see.',
      featured: true,
    },
    {
      slug: 'coinbase-vs-kraken-vs-binance',
      title: 'Coinbase vs Kraken vs Binance: Fees, Security, and Features Compared',
      category: 'Comparison',
      categoryColor: '#c084fc',
      date: 'Coming soon',
      readTime: '11 min read',
      excerpt: 'The three largest crypto exchanges put head to head. Which offers the best rates, the strongest security, and the most advanced trading tools?',
      featured: false,
    },
    {
      slug: 'best-fintech-for-startups',
      title: 'Best Fintech Tools for Startups in 2025: Banking, Payments, Payroll',
      category: 'Guide',
      categoryColor: '#4ade80',
      date: 'Coming soon',
      readTime: '9 min read',
      excerpt: 'From Mercury for banking to Ramp for expenses and Deel for global hiring — the complete fintech stack for high-growth startups.',
      featured: false,
    },
    {
      slug: 'wise-vs-revolut-transfers',
      title: 'Wise vs Revolut for International Transfers: Which is Cheaper in 2025?',
      category: 'Comparison',
      categoryColor: '#00c4a0',
      date: 'Coming soon',
      readTime: '8 min read',
      excerpt: 'We ran 50 real transfer scenarios across both platforms to find out which actually saves you more money.',
      featured: false,
    },
    {
      slug: 'bnpl-hidden-costs',
      title: 'BNPL Explained: Is Buy Now Pay Later Actually Free? The Hidden Costs',
      category: 'Explained',
      categoryColor: '#f87171',
      date: 'Coming soon',
      readTime: '7 min read',
      excerpt: 'Klarna, Afterpay, and Affirm promise interest-free spending. But what does the fine print actually say?',
      featured: false,
    },
    {
      slug: 'best-fintech-for-freelancers',
      title: 'Best Payment Solutions for Freelancers Working with International Clients',
      category: 'Guide',
      categoryColor: '#60a5fa',
      date: 'Coming soon',
      readTime: '9 min read',
      excerpt: 'Wise, Payoneer, Airwallex, and Revolut compared for the modern freelancer receiving payments from across the world.',
      featured: false,
    },
  ]

  const featured = posts.filter(p => p.featured)
  const rest = posts.filter(p => !p.featured)

  return (
    <div style={{maxWidth:1000,margin:'0 auto',padding:'3rem 2rem 5rem',position:'relative',zIndex:1}}>

      {/* Header */}
      <div className="fade-in" style={{marginBottom:'3rem'}}>
        <div style={{fontSize:10,fontWeight:500,letterSpacing:'.22em',textTransform:'uppercase',
          color:'var(--accent)',display:'flex',alignItems:'center',gap:8,marginBottom:'1rem'}}>
          <span style={{width:5,height:5,borderRadius:'50%',background:'var(--accent)',display:'inline-block'}}></span>
          Research and Guides
        </div>
        <h1 style={{fontFamily:'var(--font)',fontWeight:200,fontSize:'clamp(2rem,4vw,3rem)',
          letterSpacing:'-.03em',lineHeight:1.1,marginBottom:'.75rem'}}>
          The Fintech <span style={{color:'var(--accent)',fontWeight:400}}>Blog</span>
        </h1>
        <p style={{fontSize:14,fontWeight:300,color:'var(--muted)',lineHeight:1.7,maxWidth:520}}>
          In-depth comparisons, original research, and practical guides to help you choose the right fintech tools. No sponsored opinions — just honest analysis.
        </p>
      </div>

      {/* Coming soon banner */}
      <div className="fade-up" style={{
        background:'linear-gradient(135deg,rgba(0,196,160,.08),rgba(59,130,246,.06))',
        border:'1px solid rgba(0,196,160,.2)', borderRadius:'var(--r)',
        padding:'1.25rem 1.5rem', marginBottom:'2.5rem',
        display:'flex', alignItems:'center', gap:14,
      }}>
        <div style={{fontSize:'1.5rem',flexShrink:0}}>✍️</div>
        <div>
          <div style={{fontWeight:500,color:'var(--text)',fontSize:14,marginBottom:3}}>
            First articles publishing soon
          </div>
          <div style={{fontSize:12,fontWeight:300,color:'var(--muted)'}}>
            We are working on in-depth research and comparisons. Sign up below to be notified when we publish.
          </div>
        </div>
        <a href="mailto:hello@thefintechrank.com?subject=Blog notification"
          style={{marginLeft:'auto',flexShrink:0,fontSize:12,fontWeight:500,
            padding:'8px 16px',borderRadius:'var(--rsm)',background:'var(--accent)',
            color:'#000',textDecoration:'none',whiteSpace:'nowrap',transition:'opacity .15s'}}
          onMouseEnter={e=>e.target.style.opacity='.85'}
          onMouseLeave={e=>e.target.style.opacity='1'}>
          Notify me
        </a>
      </div>

      {/* Featured posts */}
      <div style={{marginBottom:'2.5rem'}}>
        <div style={{fontSize:9,fontWeight:600,letterSpacing:'.2em',textTransform:'uppercase',
          color:'var(--dim)',marginBottom:'1.25rem'}}>Featured articles</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:14}}>
          {featured.map((post, i) => (
            <PostCard key={post.slug} post={post} large={i===0} delay={`${i*0.08}s`} />
          ))}
        </div>
      </div>

      {/* All posts */}
      <div>
        <div style={{fontSize:9,fontWeight:600,letterSpacing:'.2em',textTransform:'uppercase',
          color:'var(--dim)',marginBottom:'1.25rem'}}>All articles</div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {rest.map((post, i) => (
            <PostRow key={post.slug} post={post} delay={`${i*0.06}s`} />
          ))}
        </div>
      </div>
    </div>
  )
}

function PostCard({ post, large, delay }) {
  return (
    <div className="fade-up company-card" style={{transitionDelay:delay,cursor:'default',padding:'1.5rem'}}>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:'1rem'}}>
        <span style={{fontSize:10,fontWeight:500,letterSpacing:'.08em',textTransform:'uppercase',
          padding:'2px 8px',borderRadius:2,
          background:`${post.categoryColor}18`,color:post.categoryColor,
          border:`1px solid ${post.categoryColor}30`}}>
          {post.category}
        </span>
        <span style={{fontSize:10,fontWeight:300,color:'var(--dim)',letterSpacing:'.04em'}}>
          {post.readTime}
        </span>
      </div>
      <h2 style={{fontFamily:'var(--font)',fontWeight:large?400:300,
        fontSize:large?'1.1rem':'1rem',lineHeight:1.35,
        color:'var(--text)',marginBottom:'.75rem',letterSpacing:'-.01em'}}>
        {post.title}
      </h2>
      <p style={{fontSize:13,fontWeight:300,color:'var(--muted)',lineHeight:1.7,marginBottom:'1.25rem'}}>
        {post.excerpt}
      </p>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <span style={{fontSize:11,fontWeight:300,color:'var(--dim)',
          padding:'4px 10px',borderRadius:20,
          background:'rgba(245,158,11,.1)',color:'#fbbf24',
          border:'1px solid rgba(245,158,11,.2)'}}>
          Coming soon
        </span>
        <span style={{fontSize:11,color:'var(--dim)',fontWeight:300}}>{post.readTime}</span>
      </div>
    </div>
  )
}

function PostRow({ post, delay }) {
  return (
    <div className="fade-up company-card" style={{transitionDelay:delay,cursor:'default',padding:'1rem 1.25rem'}}>
      <div style={{display:'flex',alignItems:'flex-start',gap:'1rem',justifyContent:'space-between',flexWrap:'wrap'}}>
        <div style={{flex:1,minWidth:200}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
            <span style={{fontSize:9,fontWeight:500,letterSpacing:'.08em',textTransform:'uppercase',
              padding:'2px 7px',borderRadius:2,
              background:`${post.categoryColor}18`,color:post.categoryColor}}>
              {post.category}
            </span>
          </div>
          <div style={{fontWeight:400,fontSize:14,color:'var(--text)',marginBottom:4,lineHeight:1.4}}>
            {post.title}
          </div>
          <div style={{fontSize:12,fontWeight:300,color:'var(--muted)',lineHeight:1.6}}>
            {post.excerpt}
          </div>
        </div>
        <div style={{flexShrink:0,display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontSize:10,fontWeight:300,color:'var(--dim)'}}>{post.readTime}</span>
          <span style={{fontSize:10,padding:'3px 9px',borderRadius:20,
            background:'rgba(245,158,11,.1)',color:'#fbbf24',
            border:'1px solid rgba(245,158,11,.2)'}}>
            Soon
          </span>
        </div>
      </div>
    </div>
  )
}

'use client'
export default function AboutPage() {
  return (
    <div style={{maxWidth:780,margin:'0 auto',padding:'3rem 2rem 5rem',position:'relative',zIndex:1}}>

      {/* Header */}
      <div className="fade-in" style={{marginBottom:'3.5rem'}}>
        <div style={{fontSize:10,fontWeight:500,letterSpacing:'.22em',textTransform:'uppercase',
          color:'var(--accent)',display:'flex',alignItems:'center',gap:8,marginBottom:'1rem'}}>
          <span style={{width:5,height:5,borderRadius:'50%',background:'var(--accent)',display:'inline-block'}}></span>
          About us
        </div>
        <h1 style={{fontFamily:'var(--font)',fontWeight:200,fontSize:'clamp(2rem,4vw,3rem)',
          letterSpacing:'-.03em',lineHeight:1.1,marginBottom:'1.25rem'}}>
          Why we built<br />
          <span style={{color:'var(--accent)',fontWeight:400}}>The Fintech Rank</span>
        </h1>
        <p style={{fontSize:15,fontWeight:300,color:'var(--muted)',lineHeight:1.85,maxWidth:600}}>
          We got tired of reading fintech reviews that were either outdated, sponsored, or written by people who had never actually used the products. So we built something better.
        </p>
      </div>

      {/* Mission */}
      <Section title="Our mission" delay="0s">
        <p>The fintech landscape changes fast. Fees change overnight. Products get acquired. Features get dropped. Regulations shift. And most comparison sites update their content once a year, if that.</p>
        <p>The Fintech Rank exists to be the most accurate, most current, and most honest source of fintech intelligence on the internet. We cover leading companies across payments, banking, investing, crypto, lending, and business finance — with real pricing, verified features, and community-powered accuracy checks.</p>
      </Section>

      {/* What makes us different */}
      <Section title="What makes us different" delay=".1s">
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:14,margin:'1.25rem 0'}}>
          {[
            ['🚫', 'No sponsored rankings', 'Companies cannot pay to rank higher. Our rankings are based on rating, review volume, and editorial assessment — nothing else.'],
            ['👥', 'Community verified', 'Every review page has a discrepancy reporting system. When pricing or features change, our community tells us. Reports are AI-triaged and resolved within 48 hours.'],
            ['🔍', 'Real pricing', 'We list actual transaction fees, monthly costs, and hidden charges — not just the headline rate companies want you to see.'],
            ['⚡', 'Updated in real time', 'Our database updates continuously. When Stripe changes their UK fees, we know within days — not months.'],
            ['🌍', 'Global perspective', 'We cover fintech from every continent — not just US and UK companies. From M-Pesa in Kenya to Nubank in Brazil to Razorpay in India.'],
            ['📊', 'Structured data', 'Every company has the same data fields, making true apples-to-apples comparison possible for the first time.'],
          ].map(([icon, title, desc]) => (
            <div key={title} className="company-card" style={{padding:'1.25rem'}}>
              <div style={{fontSize:'1.4rem',marginBottom:'.75rem'}}>{icon}</div>
              <div style={{fontWeight:500,fontSize:14,color:'var(--text)',marginBottom:6}}>{title}</div>
              <div style={{fontSize:12,fontWeight:300,color:'var(--muted)',lineHeight:1.7}}>{desc}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Transparency */}
      <Section title="Transparency and affiliate disclosure" delay=".2s">
        <p>We are completely transparent about how we make money. Some links on this site are affiliate links — if you click through and sign up for a service, we may earn a commission at no extra cost to you.</p>
        <p>Affiliate relationships <strong style={{color:'var(--text)',fontWeight:500}}>do not influence our rankings or reviews</strong>. A company with no affiliate program (like Zelle, which is free) ranks higher than it would if we were optimising for commissions. Our editorial team assesses companies independently of our commercial team.</p>
        <p>Where we have an affiliate relationship with a company, we note it on their review page. You can always trust that our ratings reflect real user data and genuine editorial assessment.</p>
        <div style={{background:'rgba(0,196,160,.06)',border:'1px solid rgba(0,196,160,.2)',
          borderRadius:'var(--rsm)',padding:'1rem 1.25rem',marginTop:'1.25rem',
          fontSize:13,fontWeight:300,color:'var(--muted)',lineHeight:1.7}}>
          <strong style={{color:'var(--accent)',fontWeight:500}}>In plain English:</strong> we get paid when you sign up for certain services through our links. This never changes which companies we recommend or how we rate them. We would rather earn less and maintain your trust than earn more and lose it.
        </div>
      </Section>

      {/* Methodology */}
      <Section title="Our methodology" delay=".3s">
        <p>Each company is assessed across five dimensions:</p>
        <div style={{margin:'1rem 0',display:'flex',flexDirection:'column',gap:8}}>
          {[
            ['Product quality', 'Based on publicly available feature comparisons and verified user feedback'],
            ['Pricing fairness', 'Assessed relative to market rates, including all fees not just headline rates'],
            ['Reliability and trust', 'Regulatory status, uptime history, and security track record'],
            ['User experience', 'Based on app store ratings, support quality, and onboarding friction'],
            ['Community score', 'Derived from our discrepancy report resolution rate and accuracy rating'],
          ].map(([name, desc]) => (
            <div key={name} style={{display:'flex',gap:12,padding:'.75rem',
              background:'var(--card-bg)',border:'1px solid var(--border)',
              borderRadius:'var(--rsm)'}}>
              <div style={{width:4,height:'auto',borderRadius:2,background:'var(--accent)',flexShrink:0}} />
              <div>
                <div style={{fontWeight:500,fontSize:13,color:'var(--text)',marginBottom:2}}>{name}</div>
                <div style={{fontSize:12,fontWeight:300,color:'var(--muted)'}}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
        <p>Ratings are updated quarterly or whenever a significant product change is reported by our community.</p>
      </Section>

      {/* Contact */}
      <Section title="Get in touch" delay=".4s">
        <p>We want to hear from you — whether you have spotted an inaccuracy, want to suggest a company we should cover, or are interested in advertising.</p>
        <div style={{display:'flex',gap:12,marginTop:'1.25rem',flexWrap:'wrap'}}>
          <a href="mailto:hello@thefintechrank.com" className="btn-primary">
            Email us
          </a>
          <a href="mailto:hello@thefintechrank.com?subject=Advertise on The Fintech Rank"
            className="btn-secondary">
            Advertise with us
          </a>
          <a href="mailto:hello@thefintechrank.com?subject=Company submission"
            className="btn-secondary">
            Submit a company
          </a>
        </div>
      </Section>

    </div>
  )
}

function Section({ title, children, delay }) {
  return (
    <div className="fade-up" style={{marginBottom:'2.5rem',transitionDelay:delay}}>
      <div className="section-title">{title}</div>
      <div style={{fontSize:14,fontWeight:300,color:'var(--muted)',lineHeight:1.85,
        display:'flex',flexDirection:'column',gap:'1rem'}}>
        {children}
      </div>
    </div>
  )
}

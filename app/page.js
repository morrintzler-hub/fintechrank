'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import HeroSection from '../components/HeroSection'
import FeatureWidget from '../components/FeatureWidget'

const SUGGEST_PILLS = [
  { type:'category', value:'payments',   label:'Payments',   href:'/category/payments'   },
  { type:'category', value:'banking',    label:'Banking',    href:'/category/banking'    },
  { type:'category', value:'crypto',     label:'Crypto',     href:'/category/crypto'     },
  { type:'category', value:'investing',  label:'Investing',  href:'/category/investing'  },
  { type:'category', value:'lending',    label:'Lending',    href:'/category/lending'    },
  { type:'category', value:'business',   label:'Business',   href:'/category/business'   },
]

export default function HomePage() {
  const [search, setSearch]         = useState('')
  const [counts, setCounts]         = useState({ all: 100 })

  useEffect(() => {
    async function loadCounts() {
      const { data } = await supabase
        .from('companies')
        .select('category')
        .eq('is_active', true)
      if (!data) return
      const c = { all: data.length }
      data.forEach(r => { c[r.category] = (c[r.category] || 0) + 1 })
      setCounts(c)
    }
    loadCounts()
  }, [])

  // Redirect search to compare or category page
  function handleSearch(q) {
    if (!q.trim()) return
    window.location.href = `/compare?q=${encodeURIComponent(q.trim())}`
  }

  return (
    <div style={{ background: '#f7f9fb', minHeight: '100vh' }}>

      {/* Hero with canvas particle system */}
      <HeroSection
        search={search}
        setSearch={setSearch}
        onSearch={handleSearch}
        counts={counts}
        pills={SUGGEST_PILLS}
      />

      {/* Feature widgets section */}
      <div style={{
        background: 'rgba(247,249,251,0.6)',
        borderTop: '1px solid rgba(188,202,195,0.2)',
        paddingBottom: '4rem',
      }}>
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '4rem 2rem 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}>

          {/* Section label */}
          <div style={{
            fontSize: 10, fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#6d7a74', fontFamily: 'Manrope, sans-serif',
            display: 'flex', alignItems: 'center', gap: 12,
            marginBottom: 8,
          }}>
            <div style={{ width: 20, height: 1, background: '#bccac3' }}/>
            Platform features
            <div style={{ flex: 1, height: 1, background: '#bccac3', opacity: 0.4 }}/>
          </div>

          <FeatureWidget
            href="/compare"
            tag="Compare"
            variant="shimmer"
            title="Find the right fintech for your business"
            subtitle="Side-by-side comparison across any 2–3 companies"
            description="Compare fees, features, global coverage, and ratings across 100 fintech companies. From Stripe vs Adyen to Revolut vs Wise — get the full picture before you decide."
            cta="Start comparing"
            delay={0}
          />
          <FeatureWidget
            href="/category/payments"
            tag="Categories"
            variant="pulse"
            title="Every corner of fintech, covered"
            subtitle="Payments · Banking · Crypto · Investing · Lending · Business"
            description="Six categories, 100 companies, verified data. Whether you need a payment processor, a neobank, or a crypto exchange — the comparison is already here."
            cta="Browse categories"
            delay={1}
          />
          <FeatureWidget
            href="/blog/stripe-vs-paypal-2025"
            tag="Research"
            variant="progress"
            title="Stripe vs PayPal 2026: The complete breakdown"
            subtitle="New article · 12 minute read"
            description="Fees, developer experience, international coverage, and checkout conversion compared. Our most in-depth payment platform analysis."
            cta="Read the article"
            delay={2}
          />
          <FeatureWidget
            href="/about"
            tag="Methodology"
            variant="verify"
            title="Independent research. No sponsored rankings"
            subtitle="Data you can actually trust"
            description="Every rating is based on verified pricing and community-reported accuracy. No company can pay to rank higher. Ever."
            cta="Our methodology"
            delay={3}
          />
          <FeatureWidget
            href="/review/stripe"
            tag="Featured review"
            variant="shimmer"
            title="Stripe — the gold standard for developer payments"
            subtitle="4.8 · 2,840 reviews · Payments"
            description="From 1.5% + 25p per transaction. Supports 135+ currencies, advanced fraud tools, and the best API in the payments industry. Used by millions of businesses worldwide."
            cta="Read full review"
            delay={4}
          />
        </div>
      </div>

      {/* Transparency section — matches reference Protocol section */}
      <div style={{
        background: '#ffffff',
        borderTop: '1px solid rgba(188,202,195,0.2)',
        padding: '5rem 2rem',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 48, alignItems: 'center',
        }}>
          <div>
            <h2 style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              color: '#191c1e',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              marginBottom: 32,
            }}>
              Transparency driven<br/>by community.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {[
                { icon: '✓', title: 'Verified Pricing', desc: 'We crowdsource and verify transaction fees to give you the real cost of doing business.' },
                { icon: '◎', title: 'Real-Time Comparisons', desc: 'Our database updates as soon as products change, ensuring you never compare outdated data.' },
                { icon: '◈', title: 'Community Audited', desc: 'No marketing fluff. Data reported and verified by actual developers and finance teams.' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'rgba(0,132,137,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, color: '#008489', flexShrink: 0, fontWeight: 700,
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: 700, fontSize: 15,
                      color: '#191c1e', marginBottom: 4,
                    }}>{item.title}</div>
                    <div style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: 400, fontSize: 14,
                      color: '#3d4945', lineHeight: 1.65,
                    }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code panel — matches reference */}
          <div style={{
            background: 'rgba(247,249,251,0.8)',
            border: '1px solid rgba(188,202,195,0.4)',
            borderRadius: 20,
            padding: 32,
            backdropFilter: 'blur(12px)',
          }}>
            <pre style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 12,
              color: '#006954',
              lineHeight: 1.8,
              margin: 0,
              whiteSpace: 'pre-wrap',
            }}>{`{
  "protocol": "FINTECH_RANK_V1",
  "data_integrity": "VERIFIED",
  "realtime_sync": true,
  "sources": [
    "Community Reports",
    "API Verification",
    "Official Docs"
  ],
  "monitoring": {
    "fees": "DAILY",
    "features": "WEEKLY"
  }
}`}</pre>
          </div>
        </div>
      </div>

    </div>
  )
}

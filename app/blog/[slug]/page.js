'use client'
import { useParams } from 'next/navigation'

const POSTS = {
  'stripe-vs-paypal-2026': {
    image: '/blog-stripe-vs-paypal.png',
    title: "Stripe vs PayPal 2026: The Complete Comparison for Businesses",
    date: "June 3, 2026",
    readTime: "12 min read",
    category: "Comparison",
    categoryColor: "#009e80",
    excerpt: "The two biggest names in payments compared across fees, developer experience, global coverage, and which one is actually right for your business in 2026.",
    content: [
      {
        type: 'intro',
        text: "Stripe and PayPal are the two most recognised names in online payments. Between them they process trillions of dollars a year. But they are fundamentally different products built for different customers — and choosing the wrong one can cost you significant money in fees, development time, and lost conversions.",
      },
      {
        type: 'verdict',
        items: [
          { label: 'Choose Stripe if', text: 'you are a developer or technical business that wants a flexible, customisable payments stack and the best API in the industry.' },
          { label: 'Choose PayPal if', text: 'you sell to consumers, especially in the US, and want the trust signal and one-click checkout that comes with 430 million active accounts.' },
          { label: 'Use both if', text: 'you want to maximise checkout conversion — many successful e-commerce businesses offer PayPal on top of a Stripe-powered primary checkout.' },
        ]
      },
      {
        type: 'h2', text: 'Fees comparison'
      },
      {
        type: 'text', text: "This is where most businesses start — and where the two platforms diverge most clearly."
      },
      {
        type: 'fees',
        stripe: [
          { label: 'Online (EU cards)', value: '1.5% + 25p' },
          { label: 'Online (non-EU cards)', value: '2.9% + 25p' },
          { label: 'In-person', value: '1.7%' },
          { label: 'Currency conversion', value: '+2%' },
          { label: 'Dispute fee', value: '£15 (refundable)' },
        ],
        paypal: [
          { label: 'Standard checkout', value: '2.9% + £0.30' },
          { label: 'PayPal Checkout', value: '1.8% + 30p' },
          { label: 'International', value: '+1.5% cross-border' },
          { label: 'Currency conversion', value: '3–4%' },
          { label: 'Dispute fee', value: '£14 (non-refundable)' },
        ]
      },
      {
        type: 'callout',
        text: "On a £100 transaction with a UK card, Stripe costs £1.75 and PayPal costs £3.20. On £100,000 monthly volume, that gap is £17,400 per year. However, PayPal's higher rate comes with a trust signal that can increase conversion rates by 6–8% for consumer businesses — which may more than offset the fee difference."
      },
      {
        type: 'h2', text: 'Developer experience'
      },
      {
        type: 'text', text: "This is Stripe's strongest suit. By almost universal consensus among developers, Stripe has the best payments API ever built. The documentation is exceptional, the test mode is fully featured, and Stripe Elements makes embedding a payment form a 30-minute job."
      },
      {
        type: 'text', text: "PayPal's developer experience is noticeably worse. The documentation is fragmented across PayPal Checkout, Braintree (PayPal's developer-focused product), and the REST API. Integration time is typically 2–3x longer than Stripe for equivalent functionality. Braintree is a significant improvement — if you want PayPal's network with better developer experience, Braintree is worth evaluating."
      },
      {
        type: 'h2', text: 'International coverage'
      },
      {
        type: 'text', text: "Stripe is available in 46+ countries, accepts payments from 195 countries, and supports 135+ currencies. It is particularly strong in the US, UK, Europe, Canada, and Australia."
      },
      {
        type: 'text', text: "PayPal is available in 200+ countries and supports 25+ currencies. Its consumer brand recognition is unmatched globally — PayPal is often the only payment method consumers in certain markets trust for cross-border purchases."
      },
      {
        type: 'h2', text: 'Side-by-side comparison'
      },
      {
        type: 'table',
        rows: [
          { usecase: 'SaaS and subscriptions', best: 'Stripe Billing' },
          { usecase: 'Marketplaces and platforms', best: 'Stripe Connect' },
          { usecase: 'Consumer e-commerce', best: 'PayPal or both' },
          { usecase: 'B2B payments', best: 'Stripe' },
          { usecase: 'Mobile-first checkout', best: 'PayPal' },
          { usecase: 'International consumer sales', best: 'PayPal' },
          { usecase: 'Developer API projects', best: 'Stripe' },
          { usecase: 'Maximum checkout conversion', best: 'Both' },
        ]
      },
      {
        type: 'h2', text: 'The bottom line'
      },
      {
        type: 'text', text: "Stripe is the better infrastructure choice for almost every technical use case. Its API, documentation, product suite, and reliability are best in class."
      },
      {
        type: 'text', text: "PayPal is a conversion tool as much as it is a payment processor. For consumer-facing businesses, especially in the US, the trust signal and one-click checkout that comes with PayPal's 430 million user base is worth paying more for."
      },
      {
        type: 'text', text: "The best strategy for most e-commerce businesses in 2025 is to use Stripe as your primary payment processor and offer PayPal as an additional checkout option. The incremental conversion lift from PayPal typically pays for the integration cost within weeks."
      },
      {
        type: 'cta',
        links: [
          { label: 'Full Stripe review', href: '/review/stripe' },
          { label: 'Full PayPal review', href: '/review/paypal' },
        ]
      }
    ]
  },
  'revolut-vs-wise-vs-monzo-2026': {
    image: '/blog-revolut-wise-monzo.png',
    title: "Revolut vs Wise vs Monzo 2026: Which Neobank Should You Choose?",
    date: "June 9, 2026",
    readTime: "11 min read",
    category: "Comparison",
    categoryColor: "#2563eb",
    excerpt: "Three of Europe's most popular neobanks compared on fees, features, international transfers, and everyday banking. The honest answer depends on who you are.",
    content: [
      { type: 'intro', text: "Revolut, Wise, and Monzo are three of the most talked-about names in European fintech. Between them they serve over 60 million customers. But they started from very different places and still serve very different needs in 2026. Picking the wrong one is an easy mistake to make." },
      { type: 'verdict', items: [
          { label: 'Choose Revolut if', text: 'you want an all-in-one financial super-app with currency exchange, crypto, stock trading, and premium metal cards in one place.' },
          { label: 'Choose Wise if', text: 'you regularly send money internationally or hold multiple currencies and want the best exchange rates with full transparency on fees.' },
          { label: 'Choose Monzo if', text: 'you want the best everyday UK current account with excellent budgeting tools, instant notifications, and the most responsive customer support.' },
      ]},
      { type: 'h2', text: 'How they started' },
      { type: 'text', text: "Monzo launched in 2015 as a pure current account replacement. Wise launched in 2011 with a single obsession: fair exchange rates for international transfers. Revolut launched in 2015 as a travel card that eliminated foreign transaction fees, and has since expanded into almost every area of finance." },
      { type: 'h2', text: 'Fees' },
      { type: 'text', text: "All three have free tiers. Revolut free gives you interbank rates on weekdays with a 1% weekend markup. Wise charges a small transparent fee on every transfer but always uses the mid-market rate. Monzo is free with no foreign transaction fees on spending abroad." },
      { type: 'h2', text: 'International transfers' },
      { type: 'text', text: "Wise wins decisively here. It was built for international transfers and uses the mid-market rate with a transparent fee on top. On a 1,000 transfer to Europe, Wise typically charges around 4 to 6. Revolut uses a similar rate on weekdays but adds a markup on weekends. Monzo routes international transfers through Wise, so you get Wise rates but pay through Monzo." },
      { type: 'h2', text: 'Everyday banking' },
      { type: 'text', text: "For day-to-day UK banking, Monzo is the strongest product. It has the best budgeting tools, spending categories, salary sorter, and savings pots of the three. Its customer support is available 24/7 and consistently ranks as the best of any bank in the UK. Revolut has improved significantly but still feels more like a fintech product than a bank account. Wise is not a current account - it is a multi-currency account optimised for holding and sending money internationally." },
      { type: 'h2', text: 'Currency accounts' },
      { type: 'text', text: "Wise wins on currency breadth with 50+ currencies and local bank details in 10 markets. You can receive USD to a real US account number, GBP to a UK sort code, EUR to an IBAN. Essential for freelancers paid in foreign currencies. Revolut holds 36 currencies with similar local details. Monzo is GBP-only but handles spending abroad well." },
      { type: 'h2', text: 'Security and regulation' },
      { type: 'text', text: "All three are FCA regulated. Monzo and Revolut hold full UK banking licences with FSCS protection up to 85,000. Wise is regulated as an electronic money institution - your money is safeguarded but not FSCS protected. For everyday use the distinction rarely matters, but for holding larger balances Monzo or Revolut offer stronger protection." },
      { type: 'h2', text: 'The verdict' },
      { type: 'text', text: "The most common winning combination in 2026 is Monzo as your primary current account plus Wise for international transfers and foreign currency. Revolut is right if you want one app that does everything including crypto and stock trading. The worst choice is picking one and expecting it to be perfect at everything." },
      { type: 'cta', links: [
          { label: 'Full Revolut review', href: '/review/revolut' },
          { label: 'Full Wise review', href: '/review/wise' },
          { label: 'Full Monzo review', href: '/review/monzo' },
      ]}
    ]
  }
}

export default function BlogPostPage() {
  const { slug } = useParams()
  const post = POSTS[slug]

  if (!post) return (
    <div style={{ textAlign: 'center', padding: '5rem 2rem', position: 'relative', zIndex: 1 }}>
      <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 12 }}>Article not found</div>
      <a href="/blog" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: 14 }}>← Back to blog</a>
    </div>
  )

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '3rem 2rem 6rem', position: 'relative', zIndex: 1 }}>

      {/* Back */}
      <a href="/blog" style={{ fontSize: 12, color: 'var(--dim)', textDecoration: 'none',
        display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: '2rem',
        transition: 'color .15s' }}
        onMouseEnter={e => e.target.style.color = 'var(--muted)'}
        onMouseLeave={e => e.target.style.color = 'var(--dim)'}>
        ← All articles
      </a>

      {/* Header */}
      <div className="fade-in" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase',
            padding: '3px 9px', borderRadius: 3, background: post.categoryColor + '15',
            color: post.categoryColor, border: `1px solid ${post.categoryColor}30` }}>
            {post.category}
          </span>
          <span style={{ fontSize: 12, color: 'var(--dim)' }}>{post.date}</span>
          <span style={{ fontSize: 12, color: 'var(--dim)' }}>·</span>
          <span style={{ fontSize: 12, color: 'var(--dim)' }}>{post.readTime}</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: 'clamp(1.6rem,3.5vw,2.4rem)',
          lineHeight: 1.2, letterSpacing: '-.02em', color: 'var(--text)', marginBottom: '1rem' }}>
          {post.title}
        </h1>
        <p style={{ fontSize: 15, fontWeight: 400, color: 'var(--muted)', lineHeight: 1.75 }}>
          {post.excerpt}
        </p>
      </div>

      {/* Hero image */}
      {post.image && post.image !== false ? (
        <div style={{ borderRadius: 'var(--r)', overflow: 'hidden', marginBottom: '2.5rem', border: '1px solid var(--border)' }}>
          <img src={post.image} alt={post.title} style={{ width: '100%', display: 'block', objectFit: 'cover', objectPosition: 'center top', maxHeight: 320 }}/>
        </div>
      ) : null}

      {/* Article body */}
      <div style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--muted)' }}>
        {post.content.map((block, i) => {
          if (block.type === 'intro') return (
            <p key={i} style={{ fontSize: 16, color: 'var(--text)', lineHeight: 1.8, marginBottom: '2rem', fontWeight: 400 }}>
              {block.text}
            </p>
          )
          if (block.type === 'h2') return (
            <h2 key={i} style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: '1.35rem',
              color: 'var(--text)', margin: '2.5rem 0 1rem', letterSpacing: '-.01em',
              paddingBottom: '.75rem', borderBottom: '2px solid var(--border)' }}>
              {block.text}
            </h2>
          )
          if (block.type === 'text') return (
            <p key={i} style={{ marginBottom: '1.25rem', fontWeight: 400 }}>{block.text}</p>
          )
          if (block.type === 'verdict') return (
            <div key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: 'var(--r)', padding: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase',
                color: 'var(--accent)', marginBottom: '1rem' }}>Quick verdict</div>
              {block.items.map((item, j) => (
                <div key={j} style={{ display: 'flex', gap: 10, marginBottom: j < block.items.length - 1 ? '1rem' : 0 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)',
                    flexShrink: 0, marginTop: 8 }} />
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: 14 }}>{item.label}: </span>
                    <span style={{ fontSize: 14, color: 'var(--muted)' }}>{item.text}</span>
                  </div>
                </div>
              ))}
            </div>
          )
          if (block.type === 'fees') return (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: '2rem' }}>
              {[
                { name: 'Stripe', color: '#635bff', fees: block.stripe },
                { name: 'PayPal', color: '#003087', fees: block.paypal },
              ].map(platform => (
                <div key={platform.name} style={{ background: 'var(--card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--r)', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', background: platform.color, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{platform.name} fees</span>
                  </div>
                  {platform.fees.map((fee, j) => (
                    <div key={j} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 14px',
                      borderBottom: j < platform.fees.length - 1 ? '1px solid var(--border)' : 'none',
                      fontSize: 13 }}>
                      <span style={{ color: 'var(--muted)' }}>{fee.label}</span>
                      <span style={{ fontWeight: 600, color: 'var(--text)' }}>{fee.value}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )
          if (block.type === 'callout') return (
            <div key={i} style={{ background: 'rgba(0,158,128,0.06)', border: '1px solid rgba(0,158,128,0.2)',
              borderLeft: '3px solid var(--accent)', borderRadius: 'var(--rsm)',
              padding: '1rem 1.25rem', marginBottom: '2rem', fontSize: 14, color: 'var(--muted)', lineHeight: 1.75 }}>
              {block.text}
            </div>
          )
          if (block.type === 'table') return (
            <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 'var(--r)', overflow: 'hidden', marginBottom: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '10px 16px',
                background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
                fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--dim)' }}>
                <span>Use case</span>
                <span>Best choice</span>
              </div>
              {block.rows.map((row, j) => (
                <div key={j} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '10px 16px',
                  borderBottom: j < block.rows.length - 1 ? '1px solid var(--border)' : 'none',
                  fontSize: 13 }}>
                  <span style={{ color: 'var(--muted)' }}>{row.usecase}</span>
                  <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{row.best}</span>
                </div>
              ))}
            </div>
          )
          if (block.type === 'cta') return (
            <div key={i} style={{ display: 'flex', gap: 12, marginTop: '2.5rem',
              paddingTop: '2rem', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: 'var(--dim)', alignSelf: 'center' }}>Read the full reviews:</span>
              {block.links.map((link, j) => (
                <a key={j} href={link.href} style={{ fontSize: 13, fontWeight: 500, padding: '7px 16px',
                  borderRadius: 'var(--rsm)', background: 'var(--accent)', color: 'white',
                  textDecoration: 'none', transition: 'opacity .15s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                  {link.label} →
                </a>
              ))}
            </div>
          )
          return null
        })}
      </div>

    </div>
  )
}

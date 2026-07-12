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
        type: 'text', text: "The best strategy for most e-commerce businesses in 2026 is to use Stripe as your primary payment processor and offer PayPal as an additional checkout option. The incremental conversion lift from PayPal typically pays for the integration cost within weeks."
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
  },
  'best-crypto-exchanges-2026': {
    image: '/blog-crypto-exchanges.png',
    title: "Best Crypto Exchanges 2026: Coinbase vs Binance vs Kraken vs Bybit vs OKX",
    date: "June 25, 2026",
    readTime: "13 min read",
    category: "Comparison",
    categoryColor: "#c084fc",
    excerpt: "Security, fees, coin selection, and regulatory status compared across the biggest names in crypto trading.",
    content: [
      { type: 'intro', text: "Choosing a crypto exchange in 2026 means balancing fees, liquidity, and regulatory safety. The cheapest exchange is rarely the most secure, and the most regulated rarely has the widest coin selection. Here is how the biggest global exchanges actually compare." },
      { type: 'verdict', items: [
        { label: 'Choose Coinbase if', text: 'you are new to crypto and want the most regulated, beginner-friendly experience in the US and UK.' },
        { label: 'Choose Kraken if', text: 'you want a US-regulated exchange with lower fees than Coinbase and a strong security track record.' },
        { label: 'Choose Binance if', text: 'you want the largest global liquidity and widest altcoin selection outside the US.' },
        { label: 'Choose Bybit or OKX if', text: 'you are an active trader wanting deep derivatives liquidity outside the US and UK.' },
      ]},
      { type: 'h2', text: 'Regulatory standing' },
      { type: 'text', text: "Coinbase and Kraken are the most heavily regulated, both accountable in the US with Coinbase listed on Nasdaq. Gemini holds a New York trust charter. Binance, Bybit, and OKX operate under lighter-touch regimes outside the US and UK, which explains their lower fees and wider coin selection but means less regulatory protection." },
      { type: 'h2', text: 'Fees' },
      { type: 'text', text: "Coinbase has the highest fees, often 1.5% or more on simple buys through the basic app, though Coinbase Advanced Trade brings this down significantly. Kraken and Binance both offer maker/taker fees starting near 0%. Bybit and OKX are similarly competitive, with futures fees as low as 0.02%." },
      { type: 'h2', text: 'Coin selection' },
      { type: 'text', text: "Binance and OKX offer the widest selection with 350+ coins each. Bybit goes further with 1000+ trading pairs. Coinbase, Kraken, and Gemini are more conservative, typically under 250 coins, prioritising regulatory compliance over breadth. For major coins this rarely matters. For smaller altcoins it matters a lot." },
      { type: 'h2', text: 'Security track record' },
      { type: 'text', text: "Coinbase, Kraken, and Gemini have never suffered a major exchange-level hack. Binance maintains a large insurance fund (SAFU) to cover losses. Bybit and OKX are newer with shorter track records, though both maintain proof-of-reserves systems for transparency." },
      { type: 'h2', text: 'US availability' },
      { type: 'text', text: "Coinbase, Kraken, and Gemini are fully available in the US. Binance operates a separate limited entity (Binance.US) for American users. Bybit and OKX do not serve US customers at all due to regulatory restrictions." },
      { type: 'h2', text: 'The verdict' },
      { type: 'text', text: "For most beginners in the US or UK, Coinbase remains the safest starting point despite higher fees. Once you are comfortable and fee-conscious, Kraken offers a similar safety profile at lower cost. For experienced traders outside the US wanting maximum liquidity and the widest coin selection, Binance, Bybit, and OKX are where the volume actually is." },
      { type: 'cta', links: [
        { label: 'Full Coinbase review', href: '/review/coinbase' },
        { label: 'Full Kraken review', href: '/review/kraken' },
        { label: 'Full Binance review', href: '/review/binance' },
      ]}
    ]
  },
  'bnpl-guide-2026': {
    image: '/blog-bnpl-guide.png',
    title: "BNPL Guide 2026: Klarna vs Afterpay vs Affirm vs Sezzle",
    date: "July 2, 2026",
    readTime: "9 min read",
    category: "Guide",
    categoryColor: "#fbbf24",
    excerpt: "Buy now, pay later is now the default at most online retailers. Here is how the major providers actually differ and what the late fees really cost you.",
    content: [
      { type: 'intro', text: "Buy now, pay later has gone from a niche checkout option to a default expectation at most online retailers. Klarna, Afterpay, Affirm, and Sezzle collectively process tens of billions in transactions annually. They are not interchangeable - each has a different structure, fee model, and credit impact." },
      { type: 'verdict', items: [
        { label: 'Choose Klarna if', text: 'you want the widest retailer acceptance and flexible payment options including pay-in-30 and longer instalments.' },
        { label: 'Choose Afterpay if', text: 'you want the simplest four-instalment model with no interest ever, as long as you pay on time.' },
        { label: 'Choose Affirm if', text: 'you are buying something expensive and want longer financing with transparent fixed interest shown upfront.' },
        { label: 'Choose Sezzle if', text: 'you want a BNPL option that reports to credit bureaus and helps build your credit history.' },
      ]},
      { type: 'h2', text: 'How the core model works' },
      { type: 'text', text: "Klarna, Afterpay, and Sezzle all use a pay-in-4 model: the purchase splits into four equal instalments paid every two weeks, with no interest if you pay on time. Affirm works differently, offering longer financing terms of 3 to 36 months with a fixed interest rate disclosed before you commit - more like a traditional instalment loan than a split payment." },
      { type: 'h2', text: 'Late fees' },
      { type: 'text', text: "Afterpay caps late fees at 25% of the order value and pauses your account if you miss a payment rather than letting fees compound. Klarna's late fees vary by plan and region. Affirm does not charge late fees at all on most loans, instead reporting missed payments to credit bureaus which can hurt your credit score more directly than a fee." },
      { type: 'h2', text: 'Credit impact' },
      { type: 'text', text: "Most pay-in-4 providers including Klarna and Afterpay traditionally did not report on-time payments to credit bureaus, meaning responsible use did not build credit history. Sezzle has been most proactive about reporting positive payment history. Affirm's longer-term loans are more likely to appear on a credit report given their resemblance to traditional instalment credit." },
      { type: 'h2', text: 'The verdict' },
      { type: 'text', text: "For everyday smaller purchases where you can pay within six weeks, Afterpay's simple four-instalment model with capped late fees is the lowest-risk choice. For larger purchases where you genuinely need months to pay, Affirm's transparent upfront interest beats hidden fees elsewhere. Klarna is the safest default given its flexibility and retailer reach. Whichever you choose, treat BNPL as a cash flow tool, not a way to afford something you could not otherwise buy." },
      { type: 'cta', links: [
        { label: 'Full Klarna review', href: '/review/klarna' },
        { label: 'Full Afterpay review', href: '/review/afterpay' },
        { label: 'Full Affirm review', href: '/review/affirm' },
      ]}
    ]
  },
  'best-business-banking-startups-2026': {
    title: "Best Business Banking for Startups 2026: Brex vs Ramp vs Mercury",
    date: "July 9, 2026",
    readTime: "10 min read",
    category: "Comparison",
    categoryColor: "#4ade80",
    excerpt: "Three of the most popular neobanks for startups compared on features, fees, credit limits, and which stage of company each is actually built for.",
    content: [
      { type: 'intro', text: "Brex, Ramp, and Mercury have collectively become the default banking stack for venture-backed startups. But they were built for different problems. Brex started as a corporate card for companies that could not get credit elsewhere. Ramp was built as a spend management tool with cost-saving as its core promise. Mercury is a bank account first, with a clean API and no monthly fees. Choosing the wrong one is an easy mistake to make early." },
      { type: 'verdict', items: [
        { label: 'Choose Brex if', text: 'you are a venture-backed startup wanting high credit limits without a personal guarantee and strong travel rewards.' },
        { label: 'Choose Ramp if', text: 'you want to actively reduce company spend with automated savings detection and smart expense controls.' },
        { label: 'Choose Mercury if', text: 'you want a clean free business bank account with no monthly fees and a great API for finance automation.' },
      ]},
      { type: 'h2', text: 'Who each product is built for' },
      { type: 'text', text: "Brex is designed for high-growth startups with VC backing - it historically required proof of venture funding or significant cash deposits. Ramp is more accessible, serving businesses of various sizes, and positions itself as a finance operations platform rather than just a card. Mercury is the most broadly accessible, available to almost any US business, and is particularly popular with early-stage founders who want great banking infrastructure without complexity." },
      { type: 'h2', text: 'Credit limits and underwriting' },
      { type: 'text', text: "Brex offers some of the highest credit limits in the startup banking space, underwritten against your company's cash balance and funding stage rather than your personal credit score. No personal guarantee is required, which matters for founders who want to keep personal and business liability separate. Ramp similarly underwrites against your business cash balance. Mercury is primarily a bank account - its card product is a charge card requiring full monthly payoff rather than a traditional credit card." },
      { type: 'h2', text: 'Fees' },
      { type: 'text', text: "Mercury has no monthly fees on its core product. Ramp has no monthly fees either. Brex has moved to a paid model for many features, with Brex Essentials free but core spend management features requiring a subscription. For cost-conscious early-stage startups, Mercury and Ramp have the lower barrier to entry." },
      { type: 'h2', text: 'Rewards and cashback' },
      { type: 'text', text: "Brex has historically offered strong rewards, particularly for travel and software purchases relevant to startups. Ramp focuses less on rewards and more on finding savings through spend analytics - the pitch is that it will save you more money by flagging wasteful spend than any rewards programme would return. Mercury's card offers modest cashback." },
      { type: 'h2', text: 'The verdict' },
      { type: 'text', text: "For pre-seed and seed startups wanting free banking with no complexity, Mercury is the right default. Once you have a team and significant monthly spend, Ramp's spend management tools start delivering real value. Brex makes most sense for Series A and beyond, when high credit limits, travel rewards, and dedicated support become meaningful. Many fast-growing startups end up using Mercury for banking and Ramp for expense management simultaneously - they are not mutually exclusive." },
      { type: 'cta', links: [
        { label: 'Full Brex review', href: '/review/brex' },
        { label: 'Full Ramp review', href: '/review/ramp' },
        { label: 'Full Mercury review', href: '/review/mercury' },
      ]}
    ]
  },
  'global-payroll-2026': {
    title: "Global Payroll Software 2026: Deel vs Gusto vs Rippling Compared",
    date: "July 9, 2026",
    readTime: "8 min read",
    category: "Comparison",
    categoryColor: "#4ade80",
    excerpt: "Hiring across borders? We break down the leading global payroll platforms on price, compliance, and ease of use.",
    content: [
      { type: 'intro', text: "Global payroll was once a problem only enterprise companies had to solve. In 2026, with remote work normalized and talent markets global, even ten-person startups are paying contractors in five countries. Deel, Gusto, and Rippling have each built solutions for this problem, but from very different starting points and with very different strengths." },
      { type: 'verdict', items: [
        { label: 'Choose Deel if', text: 'you are hiring international contractors or full-time employees in countries where you have no legal entity.' },
        { label: 'Choose Gusto if', text: 'you are a US-based small business wanting the simplest, most complete payroll and HR solution for domestic employees.' },
        { label: 'Choose Rippling if', text: 'you want to consolidate payroll, HR, IT device management, and spend management into one connected system.' },
      ]},
      { type: 'h2', text: 'What each was built to solve' },
      { type: 'text', text: "Deel was built specifically around international hiring compliance. Its core product is the Employer of Record (EOR) service, which lets you legally hire full-time employees in 150+ countries without setting up a local entity. It handles local contracts, tax filings, and statutory benefits in each market. Gusto started as a US payroll product and remains focused there, known for its clean interface and strong HR features for small teams. Rippling started as an HR and IT platform and expanded into payroll, positioning itself as the connective tissue between all people operations and finance tools." },
      { type: 'h2', text: 'International hiring' },
      { type: 'text', text: "Deel is the clear winner here and it is not close. Its EOR product covers 150+ countries, handles local compliance automatically, and includes features like equity management and immigration support. Rippling has built out international payroll capabilities and now covers many markets, making it a credible alternative for companies already on the platform. Gusto is primarily a US product - its international capabilities are limited and it is not the right choice if global hiring is your primary need." },
      { type: 'h2', text: 'Pricing' },
      { type: 'text', text: "Gusto is the most affordable for US domestic payroll, starting at around $46 per month plus $6 per employee, with clear transparent pricing. Deel's EOR pricing starts at $599 per employee per month for full-time international hires, reflecting the compliance infrastructure behind it. Contractor management starts lower. Rippling uses custom pricing based on modules selected, typically starting around $8 per employee per month for core HR, with additional costs for each module you add." },
      { type: 'h2', text: 'Ease of use' },
      { type: 'text', text: "Gusto consistently earns the highest marks for ease of use, particularly from non-HR founders running payroll for the first time. The setup process is clean and the interface rarely requires support. Deel has improved significantly and the contractor payment flow is straightforward, though EOR onboarding involves more documentation by necessity. Rippling is the most powerful but also the most complex - it rewards investment in setup with significant automation, but has a steeper learning curve." },
      { type: 'h2', text: 'The verdict' },
      { type: 'text', text: "For a US-only team under 50 people, Gusto is the right choice - it is affordable, easy to use, and handles everything from payroll to benefits to onboarding. For a team with international contractors or employees, Deel is purpose-built for exactly that problem and worth the higher price for the compliance coverage it provides. Rippling makes the most sense for companies that want to consolidate multiple tools into one platform and have the operational maturity to configure it properly. Many fast-growing companies end up using Gusto early, switching to or adding Rippling as they scale, with Deel layered in for international hires." },
      { type: 'cta', links: [
        { label: 'Full Deel review', href: '/review/deel' },
        { label: 'Full Gusto review', href: '/review/gusto' },
        { label: 'Full Rippling review', href: '/review/rippling' },
      ]}
    ]
  },
  'how-to-choose-payment-gateway-2026': {
    title: "How to Choose a Payment Gateway in 2026: The Complete Guide",
    date: "July 23, 2026",
    readTime: "13 min read",
    category: "Guide",
    categoryColor: "#38bdf8",
    excerpt: "Everything a non-technical founder needs to know about choosing between Stripe, Adyen, Checkout.com, and PayPal.",
    content: [
      { type: 'intro', text: "Choosing a payment gateway is one of the most consequential technical decisions an e-commerce or SaaS business makes. Get it wrong and you are looking at months of re-integration work, potential revenue loss during migration, and a painful conversation with your engineering team. This guide cuts through the noise and tells you exactly what to look for and which product fits which situation." },
      { type: 'verdict', items: [
        { label: 'Choose Stripe if', text: 'you are building a developer-first product, SaaS subscription business, or marketplace and want the best API in the industry.' },
        { label: 'Choose Adyen if', text: 'you are an enterprise or high-volume merchant needing local acquiring in multiple countries with a single integration.' },
        { label: 'Choose Checkout.com if', text: 'you want enterprise-grade acceptance rates with more flexible commercial terms than Adyen.' },
        { label: 'Choose PayPal if', text: 'you sell to consumers who already have PayPal and want to add it as an additional checkout option alongside your primary gateway.' },
      ]},
      { type: 'h2', text: 'What a payment gateway actually does' },
      { type: 'text', text: "A payment gateway is the infrastructure that sits between your checkout page and the banking system. When a customer enters their card details, the gateway encrypts that data, routes it to the card network (Visa, Mastercard), checks with the issuing bank for approval, and returns an accept or decline response in seconds. The gateway also handles fraud screening, currency conversion, and settlement of funds to your bank account. What most businesses call their payment gateway is often a combination of a gateway, a payment processor, and an acquirer - modern providers like Stripe and Adyen bundle all three into one product." },
      { type: 'h2', text: 'The most important factor: where your customers are' },
      { type: 'text', text: "Local acquiring is the single biggest factor affecting acceptance rates and fees that most businesses overlook. When a UK customer pays on your site and your acquirer is based in the US, the transaction is processed cross-border, which increases decline rates and often triggers additional fees. Stripe has local acquiring in most major markets now. Adyen has the broadest local acquiring network globally. If you are selling primarily in one market, almost any provider works fine. If you are selling across multiple regions, local acquiring capability should be your primary filter." },
      { type: 'h2', text: 'Pricing models explained' },
      { type: 'text', text: "Most gateways use one of three pricing models. Blended pricing (like Stripe's standard 1.5% plus 25p) combines all fees into one simple rate - easy to understand but often more expensive at higher volumes. Interchange plus pricing charges you the actual card network cost plus a fixed markup - more complex but typically cheaper once you are processing over 50,000 per month. Custom or negotiated pricing is what Adyen and Checkout.com offer at scale, where your rate is negotiated based on volume, industry, and chargeback history." },
      { type: 'h2', text: 'Developer experience vs commercial terms' },
      { type: 'text', text: "Stripe has the best developer experience in the industry by a meaningful margin. Its documentation, SDKs, and testing tools are class-leading. If your engineering team is evaluating options, they will almost always prefer Stripe. Adyen has a more complex integration but offers more granular control over routing, retry logic, and fraud rules - valuable for high-volume merchants with dedicated payment operations teams. Checkout.com sits between the two, with good documentation and more negotiating flexibility on commercial terms than Adyen typically offers at mid-market volumes." },
      { type: 'h2', text: 'Fraud and chargebacks' },
      { type: 'text', text: "All major gateways include basic fraud screening. Stripe Radar uses machine learning trained on its global transaction network. Adyen has RevenueProtect, which is highly configurable for merchants with specific fraud patterns. If fraud is a significant concern for your business (common in digital goods, travel, and high-value items), look carefully at the fraud tooling, chargeback liability policies, and whether the provider offers 3D Secure support in a way that minimises friction for legitimate customers." },
      { type: 'h2', text: 'The verdict' },
      { type: 'text', text: "For most startups and SMBs, Stripe is the right default. The developer experience is unmatched, pricing is transparent, and the product covers almost every payment use case. As you scale past a few million in annual processing volume, it is worth getting a quote from Checkout.com to compare rates. At enterprise volumes, Adyen's local acquiring network and operational tooling start to justify the more complex integration. PayPal is worth adding as a secondary checkout option if you sell to consumers, but rarely makes sense as your primary gateway." },
      { type: 'cta', links: [
        { label: 'Full Stripe review', href: '/review/stripe' },
        { label: 'Full Adyen review', href: '/review/adyen' },
        { label: 'Full Checkout.com review', href: '/review/checkout-com' },
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

'use client'
import { useState } from 'react'

const FAQS = {
  'stripe': [
    { q: 'Is Stripe safe and legitimate?', a: 'Yes. Stripe is one of the most trusted payment processors in the world, used by millions of businesses including Amazon, Google, and Shopify. It is regulated in all markets where it operates.' },
    { q: 'How long does Stripe take to pay out?', a: 'Stripe pays out on a standard 2-day rolling basis for most businesses in the US and UK. Payout schedules can be customised to daily, weekly, or monthly.' },
    { q: 'What percentage does Stripe take?', a: 'Stripe charges 1.5% + 25p per transaction for UK cards and 2.9% + 30c for US cards. There are no monthly or setup fees.' },
    { q: 'Can I use Stripe without a website?', a: 'Yes. Stripe offers payment links, invoicing, and in-person payment via Stripe Terminal - all usable without a full website integration.' },
    { q: 'Does Stripe work in my country?', a: 'Stripe is available in 47 countries. Check the Stripe website for full country availability.' },
  ],
  'revolut': [
    { q: 'Is Revolut a real bank?', a: 'Yes. Revolut received a full UK banking licence in July 2024. UK customer deposits up to GBP85,000 are protected by the FSCS.' },
    { q: 'Is Revolut safe to keep money in?', a: 'Yes for amounts up to GBP85,000 since Revolut became a licensed UK bank in 2024. For larger amounts, spread funds across multiple institutions.' },
    { q: 'Can I use Revolut as my main bank account?', a: 'Many people do. However, Monzo generally has stronger everyday banking features including better budgeting tools and 24/7 customer support.' },
    { q: 'Does Revolut charge fees for currency exchange?', a: 'On the free plan, Revolut uses the interbank rate on weekdays with a 1% markup on weekends and a fair usage limit of GBP1,000/month. Paid plans remove these limits.' },
    { q: 'What countries is Revolut available in?', a: 'Revolut is available in 36+ countries across Europe, North America, Australia, and Asia Pacific. It supports spending in 150+ currencies.' },
  ],
  'wise': [
    { q: 'Is Wise safe and regulated?', a: 'Yes. Wise is regulated by the FCA in the UK and licensed in every market where it operates. Customer funds are held in segregated accounts at top-tier banks.' },
    { q: 'How does Wise make money?', a: 'Wise charges a small transparent fee on currency transfers - typically 0.41% to 0.6% above the mid-market rate. There are no hidden margins in the exchange rate.' },
    { q: 'Is Wise FSCS protected?', a: 'Wise is regulated as an electronic money institution, not a bank. Deposits are protected through safeguarding rather than FSCS directly.' },
    { q: 'How long does a Wise transfer take?', a: '50% of Wise transfers arrive instantly. Most arrive within a few hours. The slowest routes take 1-2 business days.' },
    { q: 'Can I use Wise as a bank account?', a: 'Wise offers a multi-currency account with local bank details in 10 currencies. It works well as a secondary account but lacks full current account features.' },
  ],
  'monzo': [
    { q: 'Is Monzo a real bank?', a: 'Yes. Monzo is a fully licensed UK bank regulated by the PRA and FCA. Customer deposits up to GBP85,000 are protected by the FSCS.' },
    { q: 'Is Monzo safe?', a: 'Yes. Monzo has a full UK banking licence and has operated since 2017 with a clean track record.' },
    { q: 'Can I get paid into Monzo?', a: 'Yes. Monzo provides a full UK sort code and account number. You can receive your salary and set up direct debits just like any high street bank.' },
    { q: 'Does Monzo charge for overseas spending?', a: 'Monzo does not charge foreign transaction fees. ATM withdrawals abroad are fee-free up to GBP200/month on the free plan.' },
    { q: 'What is the difference between Monzo and Revolut?', a: 'Monzo is better for everyday UK banking with superior budgeting tools and customer support. Revolut is better for frequent travellers wanting currency exchange and crypto in one app.' },
  ],
  'coinbase': [
    { q: 'Is Coinbase safe and regulated?', a: 'Yes. Coinbase is publicly listed on Nasdaq and regulated in all markets where it operates, including FCA registration in the UK.' },
    { q: 'Are my funds protected on Coinbase?', a: 'USD balances are covered by FDIC pass-through insurance up to $250,000. Crypto holdings are not covered by government insurance schemes.' },
    { q: 'What fees does Coinbase charge?', a: 'The standard app charges 0.5-4.5%. Coinbase Advanced Trade charges 0.6%/1.2% maker/taker. Always use Advanced Trade to avoid overpaying.' },
    { q: 'Is Coinbase available in the UK?', a: 'Yes. Coinbase is fully available to UK customers and holds FCA registration.' },
    { q: 'How do I withdraw money from Coinbase to my bank?', a: 'Sell your crypto, then use the withdraw function. UK withdrawals typically arrive within 1-2 business days.' },
  ],
  'binance': [
    { q: 'Is Binance safe to use?', a: 'Binance is the largest crypto exchange by volume but carries more regulatory risk than Coinbase or Kraken. It reached a $4.3 billion settlement with US regulators in 2023.' },
    { q: 'Is Binance available in the UK?', a: 'Binance has operated in the UK with restrictions following FCA scrutiny. Always check current UK availability before signing up.' },
    { q: 'What are Binance trading fees?', a: 'Binance charges 0.1% maker and taker fees at standard volumes, reduced further with BNB token holdings.' },
    { q: 'Does Binance have a wallet?', a: 'Yes. Binance offers Trust Wallet for self-custody storage. For large holdings, a hardware wallet is recommended.' },
    { q: 'How do I withdraw from Binance to my bank?', a: 'Sell your crypto to fiat, then use the bank transfer withdrawal option. Processing typically takes 1-5 business days.' },
  ],
  'klarna': [
    { q: 'Is Klarna safe to use?', a: 'Yes. Klarna is a licensed bank in Sweden regulated by Finansinspektionen, one of the most valuable fintech companies in Europe.' },
    { q: 'Does Klarna affect your credit score?', a: 'Pay in 3 and Pay in 30 use a soft check that does not affect your score. Longer-term financing uses a hard check. Missed payments can be reported to credit bureaus.' },
    { q: 'What happens if you do not pay Klarna?', a: 'Klarna charges late fees of up to GBP5 per missed payment in the UK and may report persistent non-payment to credit bureaus.' },
    { q: 'Is Klarna free to use?', a: 'For consumers, Pay in 3 and Pay in 30 are free if paid on time. Merchants pay a fee to Klarna for the service.' },
    { q: 'Can you use Klarna anywhere?', a: 'Klarna works at 500,000+ retailers globally. The Klarna app browser extension lets you use it at retailers that do not officially support it.' },
  ],
  'paypal': [
    { q: 'Is PayPal safe to use?', a: 'Yes. PayPal is one of the most established payment platforms with 400 million+ active accounts, regulated in all markets where it operates.' },
    { q: 'Does PayPal charge fees for sending money?', a: 'Sending to friends and family in the same currency is free. Paying for goods or sending internationally incurs fees of typically 3.4% + fixed fee.' },
    { q: 'How long does PayPal take to transfer to bank?', a: 'Standard transfers take 1-3 business days. Instant transfers cost 1% (minimum GBP0.25, maximum GBP10).' },
    { q: 'Is PayPal good for businesses?', a: 'PayPal is useful as an additional checkout option - it can improve conversion by 5-15%. Stripe or Checkout.com are generally better as a primary gateway.' },
    { q: 'What is the difference between PayPal and Wise?', a: 'PayPal is primarily a consumer payment brand. Wise is a multi-currency account and transfer service with better exchange rates for international transactions.' },
  ],
  'etoro': [
    { q: 'Is eToro regulated in the UK?', a: 'Yes. eToro UK is regulated by the FCA. UK customers are protected under FCA rules and FSCS covers eligible investments up to GBP85,000.' },
    { q: 'What are eToro fees?', a: 'eToro charges no commission on stocks but makes money on the spread - typically 0.09-0.15% for liquid stocks. Crypto trades incur a 1% fee. There is a $5 withdrawal fee.' },
    { q: 'Is eToro good for beginners?', a: 'eToro is popular with beginners due to its social trading features and CopyTrader which lets you replicate successful investors automatically.' },
    { q: 'Can you withdraw money from eToro?', a: 'Yes. Minimum withdrawal is $30 with a $5 fee. Withdrawals typically take 1-5 business days.' },
    { q: 'Is eToro better than Trading 212?', a: 'Trading 212 has lower fees for pure stock trading. eToro is better if you want social trading or crypto alongside stocks.' },
  ],
  'kraken': [
    { q: 'Is Kraken safe and regulated?', a: 'Yes. Kraken has operated since 2011 and has never suffered a major exchange-level hack. It holds licences across the US and multiple European jurisdictions.' },
    { q: 'Is Kraken available in the UK?', a: 'Yes. Kraken is fully available to UK customers and is registered with the FCA.' },
    { q: 'What are Kraken trading fees?', a: 'Kraken Pro charges 0.16% maker and 0.26% taker at standard volumes. Always use Kraken Pro rather than the basic interface to get better rates.' },
    { q: 'Can UK users stake on Kraken?', a: 'Yes. UK users can stake Ethereum and other proof-of-stake assets on Kraken with rewards paid weekly.' },
    { q: 'Is Kraken better than Coinbase for UK users?', a: 'Kraken offers lower fees and stronger staking. Coinbase has a cleaner interface for beginners. For cost-conscious UK users, Kraken is often the better choice.' },
  ],
  'adyen': [
    { q: 'What is Adyen used for?', a: 'Adyen is an enterprise payment platform used by Netflix, Uber, Microsoft, and eBay. It processes both online and in-store payments globally.' },
    { q: 'Is Adyen better than Stripe?', a: 'For enterprises processing millions per month across multiple countries, Adyen can deliver better authorisation rates. For most businesses, Stripe is the better starting point.' },
    { q: 'How much does Adyen cost?', a: 'Adyen uses interchange-plus pricing. Total effective rates are often 0.3-0.8% for standard consumer cards depending on card type and market.' },
    { q: 'Is Adyen publicly listed?', a: 'Yes. Adyen is listed on Euronext Amsterdam (ticker: ADYEN) and is one of Europe\'s most valuable publicly traded fintech companies.' },
    { q: 'What is the minimum volume for Adyen?', a: 'Adyen typically requires merchants to be processing at least EUR1 million annually. It is not designed for startups or small businesses.' },
  ],
  'brex': [
    { q: 'Is Brex a real bank?', a: 'Brex is not a bank. Its banking features are provided through partner banks. Deposits are FDIC insured through these partner banks.' },
    { q: 'Do I need good credit for Brex?', a: 'No personal credit check is required. Brex underwrites against your company cash balance and funding stage, not your personal credit score.' },
    { q: 'Is Brex only for startups?', a: 'Brex started for startups but now serves companies of all sizes. It is particularly suited to venture-backed companies with significant monthly spend.' },
    { q: 'What are Brex fees?', a: 'Brex Essentials is available at no monthly fee. Brex Premium with advanced features is priced per user. No foreign transaction fees on the card.' },
    { q: 'Is Brex available outside the US?', a: 'Brex is primarily US-focused with limited international availability. For non-US businesses, Revolut Business may be a better alternative.' },
  ],
  'robinhood': [
    { q: 'Is Robinhood available in the UK?', a: 'Robinhood launched in the UK in 2024. UK users can access commission-free stock and ETF trading, though some US features are not yet available.' },
    { q: 'How does Robinhood make money if trading is free?', a: 'Robinhood makes money through payment for order flow, premium subscriptions (Robinhood Gold), interest on cash, and stock lending.' },
    { q: 'Is Robinhood safe to use?', a: 'Robinhood is regulated by FINRA and SIPC in the US, and the FCA in the UK. SIPC covers US accounts up to $500,000.' },
    { q: 'What can you trade on Robinhood?', a: 'Robinhood offers commission-free US stocks, ETFs, options, and cryptocurrency. The UK version currently has more limited features.' },
    { q: 'Is Robinhood better than eToro?', a: 'Robinhood has better execution for US stocks. eToro has stronger social trading features. For UK users, Trading 212 and Freetrade are often preferred over both.' },
  ],
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 12,
      }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', lineHeight: 1.4 }}>{q}</span>
        <span style={{ flexShrink: 0, fontSize: 18, color: 'var(--accent)', fontWeight: 300, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform .2s', display: 'inline-block' }}>+</span>
      </button>
      {open && <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, paddingBottom: 14 }}>{a}</div>}
    </div>
  )
}

export default function CompanyFAQ({ slug }) {
  const faqs = FAQS[slug]
  if (!faqs) return null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faqs.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
    </div>
  )
}

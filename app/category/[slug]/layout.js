const DESCS = {
  payments: 'Compare the best payment processors. Stripe, PayPal, Adyen and more - fees, features, and reviews.',
  banking: 'Compare the best neobanks. Revolut, Monzo, Wise, N26 and more - fees, features, and reviews.',
  investing: 'Compare the best investing apps. Robinhood, eToro, Wealthfront and more - fees and features.',
  crypto: 'Compare the best crypto exchanges. Coinbase, Binance, Kraken and more - fees and security.',
  lending: 'Compare the best fintech lenders. LendingClub, Upstart, Funding Circle and more.',
  business: 'Compare the best business finance tools. Brex, Ramp, Mercury, Gusto and more.',
}

export async function generateMetadata({ params }) {
  const slug = params.slug
  const name = slug.charAt(0).toUpperCase() + slug.slice(1)
  const desc = DESCS[slug] || `Compare the best ${name} fintech companies on The Fintech Rank.`
  const title = `Best ${name} Fintech Companies 2026 - Compare Fees and Features | The Fintech Rank`
  return {
    title,
    description: desc,
    openGraph: { title, description: desc, url: `https://thefintechrank.com/category/${slug}`, siteName: 'The Fintech Rank' },
    twitter: { card: 'summary_large_image', title, description: desc },
    alternates: { canonical: `https://thefintechrank.com/category/${slug}` },
  }
}

export default function CategoryLayout({ children }) {
  return children
}

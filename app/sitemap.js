export default async function sitemap() {
  const base = 'https://thefintechrank.com'

  const static_pages = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/compare`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/category/payments`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/category/banking`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/category/investing`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/category/crypto`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/category/lending`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/category/business`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ]

  // Hardcoded review pages - no Supabase dependency so sitemap never fails
  const slugs = [
    'stripe','paypal','revolut','wise','monzo','coinbase','adyen','klarna',
    'nubank','chime','robinhood','binance','sofi','brex','checkout-com',
    'toast','marqeta','airwallex','rapyd','flutterwave','razorpay','paytm',
    'mercado-pago','venmo','cash-app','remitly','worldremit','zelle','m-pesa',
    'starling-bank','n26','current','varo-bank','bunq','lunar','dave',
    'aspiration','oaknorth','wealthfront','betterment','etoro','acorns',
    'public','webull','trading-212','freetrade','stash','m1-finance',
    'kraken','gemini','blockchain-com','opensea','chainalysis','fireblocks',
    'consensys','ripple','circle','ledger','affirm','lendingclub','upstart',
    'prosper','avant','funding-circle','creditas','zopa','kabbage','tala',
    'ramp','mercury','navan','gusto','deel','melio','bill','tipalti',
    'wise-business','payoneer','sumup','izettle','paysafe','sezzle','afterpay',
    'greenlight','tink','solaris','anchorage-digital','bitpanda','alchemy',
    'carta','fundbox','figure','earnin','novo','qonto','pine-labs','phonepe','ynab'
  ]

  const review_pages = slugs.map(slug => ({
    url: `${base}/review/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...static_pages, ...review_pages]
}

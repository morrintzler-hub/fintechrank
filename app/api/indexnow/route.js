import { NextResponse } from 'next/server'

const KEY = '33c46b1b63de495f8a175ae009d5e2dd'
const HOST = 'https://thefintechrank.com'

const URLS = [
  HOST, `${HOST}/compare`, `${HOST}/blog`, `${HOST}/methodology`, `${HOST}/about`,
  ...[
    'stripe','paypal','revolut','wise','monzo','coinbase','binance','adyen','klarna',
    'nubank','chime','robinhood','sofi','brex','ramp','mercury','deel','wealthfront',
    'betterment','etoro','affirm','checkout-com','square','razorpay','flutterwave',
    'rapyd','payoneer','sumup','mollie','worldpay','starling-bank','n26','bunq',
    'current','varo-bank','dave','lunar','qonto','oaknorth','nova-credit','kraken',
    'gemini','blockchain-com','bitpanda','crypto-com','acorns','public','webull',
    'trading-212','freetrade','lendingclub','upstart','funding-circle','tala',
    'creditas','melio','bill','tipalti','gusto','navan','venmo','cash-app','remitly',
    'worldremit','zelle','m-pesa','airwallex','pine-labs','phonepe','paysafe',
    'aspiration','greenlight','novo','tink','solaris','ledger','fireblocks',
    'chainalysis','opensea','ripple','circle','alchemy','anchorage-digital',
    'm1-finance','ynab','carta','avant','prosper','zopa','kabbage','fundbox',
    'figure','earnin','marqeta','sezzle','afterpay','consensys','block','izettle',
    'mercado-pago','paytm','plaid','stash','toast','wise-business','nuvei',
    'crypto-com-exchange','bybit','okx','charles-schwab','fidelity','ally-bank',
    'rippling','expensify'
  ].map(s => `${HOST}/review/${s}`),
  ...['payments','banking','investing','crypto','lending','business'].map(c => `${HOST}/category/${c}`),
  ...['stripe-vs-paypal-2026','revolut-vs-wise-vs-monzo-2026','best-crypto-exchanges-2026',
      'bnpl-guide-2026','best-business-banking-startups-2026','global-payroll-2026',
      'how-to-choose-payment-gateway-2026'].map(b => `${HOST}/blog/${b}`),
]

export async function POST() {
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: 'thefintechrank.com',
      key: KEY,
      keyLocation: `${HOST}/${KEY}.txt`,
      urlList: URLS,
    }),
  })
  return NextResponse.json({ status: res.status, urlsSubmitted: URLS.length })
}

export async function GET() {
  return NextResponse.json({ urls: URLS.length, message: 'POST to submit all URLs to IndexNow' })
}

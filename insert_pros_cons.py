#!/usr/bin/env python3
import urllib.request
import json

SUPABASE_URL = "https://xkdiludpiwtihogyikg.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrZGlpdWRwaXd0aWhvZ2N5aWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMzE2MTYsImV4cCI6MjA5NTgwNzYxNn0.qltUaO2eDM1Xc_IArmupfCMlJfMtctpM8EQ6fkAxKXM"

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

# All pros/cons data
DATA = {
    "block":         [("pro","Excellent POS hardware for small businesses",1),("pro","Integrated ecosystem across Cash App and Afterpay",2),("pro","Free basic plan for SMBs",3),("con","Reserve holds common on new accounts",1),("con","US-centric with limited international features",2)],
    "adyen":         [("pro","True omnichannel solution for online and in-person",1),("pro","Advanced fraud prevention tools",2),("pro","Enterprise-grade reliability trusted by Netflix and Uber",3),("con","High minimum revenue threshold",1),("con","Complex integration not suitable for SMBs",2)],
    "klarna":        [("pro","Interest-free instalments with no hidden fees",1),("pro","500000 merchant partners globally",2),("pro","AI-powered shopping assistant features",3),("con","Can encourage overspending habits",1),("con","Late payments affect credit score in some markets",2)],
    "nubank":        [("pro","No annual fees on any core products",1),("pro","Excellent mobile UX loved by 100M customers",2),("pro","Rapid expansion across Latin America",3),("con","Primarily Brazil-focused with limited international use",1),("con","Spanish and Portuguese only",2)],
    "chime":         [("pro","No monthly fees on checking or savings",1),("pro","Early direct deposit up to 2 days ahead",2),("pro","Credit builder card for improving credit score",3),("con","US only with no international features",1),("con","No physical branches",2)],
    "robinhood":     [("pro","Zero commission on stocks ETFs and crypto",1),("pro","Fractional shares from just $1",2),("pro","Beginner-friendly interface",3),("con","Limited research and analysis tools",1),("con","US only",2)],
    "binance":       [("pro","Deepest crypto liquidity globally",1),("pro","Lowest fees at 0.1% maker/taker",2),("pro","Widest asset selection of any exchange",3),("con","Under significant global regulatory scrutiny",1),("con","Complex interface for beginners",2)],
    "sofi":          [("pro","All-in-one financial platform",1),("pro","High-yield savings account",2),("pro","Competitive personal loan rates",3),("con","US only",1),("con","Strict approval criteria",2)],
    "brex":          [("pro","No personal guarantee required for corporate card",1),("pro","High credit limits based on company financials",2),("pro","Powerful expense management built in",3),("con","Requires significant funding to qualify",1),("con","US focused with limited international availability",2)],
    "checkout-com":  [("pro","Real-time reporting and analytics",1),("pro","Local acquiring in key markets",2),("pro","Flexible API for enterprise needs",3),("con","Enterprise-focused pricing not for SMBs",1),("con","Complex onboarding process",2)],
    "toast":         [("pro","Purpose-built for restaurant operations",1),("pro","End-to-end restaurant management",2),("pro","Strong US market presence",3),("con","US only with no international availability",1),("con","Hardware costs can be expensive",2)],
    "marqeta":       [("pro","Highly flexible card issuing via open API",1),("pro","Real-time spending controls",2),("pro","Powers major fintechs like DoorDash and Uber",3),("con","Developer and enterprise only",1),("con","Niche use case limits broad appeal",2)],
    "airwallex":     [("pro","Excellent FX rates for businesses",1),("pro","Global multi-currency accounts",2),("pro","Strong embedding APIs for developers",3),("con","Onboarding can be slow",1),("con","Limited consumer use cases",2)],
    "rapyd":         [("pro","900 local payment methods in one API",1),("pro","Strong emerging market coverage",2),("con","Developer-focused only",1),("con","Documentation can be patchy",2)],
    "flutterwave":   [("pro","Deepest African market coverage",1),("pro","Single API for 34 African countries",2),("con","Past regulatory scrutiny in some markets",1),("con","Limited outside Africa",2)],
    "razorpay":      [("pro","Dominant India market share",1),("pro","Full-stack solution with payroll and lending",2),("con","India-only focus",1),("con","Occasional downtime during peak periods",2)],
    "paytm":         [("pro","200M user base in India",1),("pro","Full super-app ecosystem",2),("con","Regulatory challenges in 2024",1),("con","Complex UI compared to competitors",2)],
    "mercado-pago":  [("pro","Dominant reach across Latin America",1),("pro","Integrated with MercadoLibre commerce",2),("con","LATAM only",1),("con","Spanish and Portuguese only",2)],
    "venmo":         [("pro","Social payments UX loved by millennials",1),("pro","Instant transfers between users",2),("con","US only",1),("con","Privacy concerns with social feed",2)],
    "cash-app":      [("pro","Free instant P2P transfers",1),("pro","Bitcoin and stock investing built in",2),("con","US and UK only",1),("con","Frequent scam target",2)],
    "remitly":       [("pro","Transparent pricing with 170 receive countries",1),("pro","Strong mobile-first experience",2),("con","Not a full bank account",1),("con","Transfer speed varies by corridor",2)],
    "worldremit":    [("pro","Wide receive method options including mobile wallets",1),("pro","Strong African and Asian coverage",2),("con","Fees can add up on smaller transfers",1),("con","FX rates not always the best available",2)],
    "zelle":         [("pro","Instant bank-to-bank transfers",1),("pro","No fees and integrated into major bank apps",2),("con","US only with no buyer protection",1),("con","Scams are unfortunately common",2)],
    "m-pesa":        [("pro","Works on basic mobile phones without smartphones",1),("pro","Pioneered mobile money globally",2),("con","Africa-focused only",1),("con","Feature gaps compared to modern apps",2)],
    "starling-bank": [("pro","Consistently wins Best British Bank awards",1),("pro","Free business and personal accounts",2),("con","UK only",1),("con","No physical locations",2)],
    "n26":           [("pro","Clean minimal design with strong EU coverage",1),("pro","No monthly fee on standard plan",2),("con","Withdrew from UK market",1),("con","Customer support issues reported",2)],
    "current":       [("pro","Teen banking features built in",1),("pro","High APY savings pods",2),("con","US only",1),("con","Limited investment options",2)],
    "varo-bank":     [("pro","First US neobank with national bank charter",1),("pro","Up to 5% APY on savings",2),("con","US only",1),("con","No investment products",2)],
    "bunq":          [("pro","Strong eco and ESG features",1),("pro","Multi-IBAN accounts across EU",2),("con","No free tier available",1),("con","Monthly subscription required",2)],
    "lunar":         [("pro","Strong Scandinavian design",1),("pro","Both business and personal accounts",2),("con","Nordic markets only",1),("con","English support limited",2)],
    "dave":          [("pro","Up to 500 dollar cash advance",1),("pro","No mandatory fees",2),("con","US only",1),("con","Tips create hidden costs for users",2)],
    "aspiration":    [("pro","Eco and ESG mission built into product",1),("pro","Pay-what-is-fair pricing model",2),("con","Slow fund access reported by users",1),("con","Limited investment products",2)],
    "oaknorth":      [("pro","Specialist SME lending platform",1),("pro","High fixed-rate savings",2),("con","UK only",1),("con","Very niche focus",2)],
    "wealthfront":   [("pro","Automated tax-loss harvesting",1),("pro","High-yield cash account",2),("pro","Low 0.25% annual management fee",3),("con","US only",1),("con","No human advisor access",2)],
    "betterment":    [("pro","Goal-based investing UX",1),("pro","Access to human financial advisors",2),("con","US only",1),("con","No individual stock picking",2)],
    "etoro":         [("pro","Social and copytrading features",1),("pro","Stocks ETFs and crypto in one platform",2),("con","CFDs carry high risk",1),("con","Withdrawal fees",2)],
    "acorns":        [("pro","Perfect for beginners",1),("pro","Round-up investing is effortless",2),("con","Fee high relative to small balances",1),("con","US only",2)],
    "public":        [("pro","No PFOF for more transparent pricing",1),("pro","Bonds and alternatives available",2),("con","US only",1),("con","Advanced tools still limited",2)],
    "webull":        [("pro","Advanced charting tools",1),("pro","Extended hours trading",2),("con","Limited international markets",1),("con","Not ideal for complete beginners",2)],
    "trading-212":   [("pro","Commission-free stocks and ETFs",1),("pro","Automated Pies feature",2),("con","CFD losses for many users",1),("con","Customer support can be slow",2)],
    "freetrade":     [("pro","Clean simple UI",1),("pro","ISA and SIPP account wrappers",2),("con","UK focused",1),("con","Basic research tools",2)],
    "stash":         [("pro","Education-first approach to investing",1),("pro","Stock-Back debit card rewards",2),("con","Fee expensive for small balances",1),("con","US only",2)],
    "m1-finance":    [("pro","Custom portfolio pies",1),("pro","Portfolio line of credit",2),("con","US only",1),("con","No tax-loss harvesting on base plan",2)],
    "kraken":        [("pro","High security reputation",1),("pro","Advanced trading features",2),("pro","Kraken Bank regulated in Wyoming",3),("con","UI can be complex for beginners",1),("con","Limited fiat options in some regions",2)],
    "gemini":        [("pro","SOC 2 certified security",1),("pro","Credit card with crypto rewards",2),("con","Higher fees versus competitors",1),("con","Smaller asset selection",2)],
    "blockchain-com":[("pro","Long track record since 2011",1),("pro","Self-custody wallet option",2),("con","Exchange fees are high",1),("con","Limited DeFi integration",2)],
    "opensea":       [("pro","Largest NFT marketplace globally",1),("pro","Multi-chain support",2),("con","NFT market downturn has reduced volume",1),("con","High gas fees on Ethereum",2)],
    "chainalysis":   [("pro","Industry-standard compliance tool",1),("pro","Used by 70 governments worldwide",2),("con","Enterprise only with very high cost",1),("con","Privacy advocates have raised concerns",2)],
    "fireblocks":    [("pro","MPC-based institutional custody",1),("pro","Trusted by 1800 institutions",2),("con","Enterprise only",1),("con","Very high minimum commitment",2)],
    "consensys":     [("pro","MetaMask is the largest crypto wallet",1),("pro","Core Ethereum infrastructure",2),("con","MetaMask privacy concerns",1),("con","Complex for non-developers",2)],
    "ripple":        [("pro","Enterprise bank partnerships worldwide",1),("pro","XRP offers fast settlement",2),("con","SEC lawsuit cloud over operations",1),("con","XRP centralisation debate",2)],
    "circle":        [("pro","USDC is a highly trusted stablecoin",1),("pro","Strong regulatory compliance",2),("con","USDC briefly depegged in 2023",1),("con","Enterprise focus limits consumer access",2)],
    "ledger":        [("pro","Gold standard hardware wallet",1),("pro","Supports 5500 cryptocurrencies",2),("pro","Excellent Ledger Live app",3),("con","2020 customer data breach",1),("con","Recovery phrase controversy",2)],
    "affirm":        [("pro","Transparent loan terms upfront",1),("pro","No late fees",2),("pro","300000 merchant partners",3),("con","Interest can be high for some plans",1),("con","US only",2)],
    "lendingclub":   [("pro","Bank charter adds credibility",1),("pro","Competitive personal loan rates",2),("con","US only",1),("con","Strict credit requirements",2)],
    "upstart":       [("pro","AI-driven credit assessment",1),("pro","Higher approval rates than traditional banks",2),("con","US only",1),("con","Rates can be high for some applicants",2)],
    "prosper":       [("pro","Pioneer P2P lending platform",1),("pro","Fixed rates and terms",2),("con","Origination fees apply",1),("con","US only",2)],
    "avant":         [("pro","Serves near-prime borrowers",1),("pro","Fast approval process",2),("con","High APRs for lower credit scores",1),("con","US only",2)],
    "funding-circle":[("pro","Established SME lender",1),("pro","Fast online application",2),("con","Not for startups or new businesses",1),("con","Origination fee",2)],
    "creditas":      [("pro","Far below-market rates in Brazil",1),("pro","Secured loans reduce default risk",2),("con","Brazil only",1),("con","Complex collateral process",2)],
    "zopa":          [("pro","World pioneer in P2P lending",1),("pro","Award-winning savings rates",2),("con","UK only",1),("con","P2P investing closed to new investors",2)],
    "kabbage":       [("pro","Fast approval for SMEs",1),("pro","Now part of American Express for stability",2),("con","High fees on lines of credit",1),("con","US only",2)],
    "tala":          [("pro","Reaches truly underbanked populations",1),("pro","Smartphone-based credit scoring",2),("con","High APRs versus traditional banks",1),("con","Emerging markets only",2)],
    "ramp":          [("pro","Saves businesses money by design",1),("pro","Best-in-class expense management",2),("pro","No fees on core product",3),("con","US only",1),("con","Requires significant company size",2)],
    "mercury":       [("pro","Designed specifically for startups",1),("pro","Excellent UI and UX",2),("con","US only",1),("con","FDIC via partner bank",2)],
    "navan":         [("pro","Unified travel and expense management",1),("pro","Real-time policy enforcement",2),("con","Premium pricing",1),("con","Complex for small companies",2)],
    "gusto":         [("pro","Automated payroll taxes",1),("pro","Health insurance marketplace",2),("con","US only",1),("con","Pricing increases with team size",2)],
    "deel":          [("pro","Hire globally without entity setup",1),("pro","150 country compliance",2),("con","Can be expensive for large teams",1),("con","Complex country-specific rules",2)],
    "melio":         [("pro","Pay any vendor any way",1),("pro","AP and AR automation",2),("con","US only",1),("con","Card payments have a fee",2)],
    "bill":          [("pro","Strong QuickBooks integration",1),("pro","AP and AR automation",2),("con","Dated UI",1),("con","US only",2)],
    "tipalti":       [("pro","196 country payment coverage",1),("pro","Strong tax compliance automation",2),("con","Expensive for small companies",1),("con","Complex implementation",2)],
    "wise-business": [("pro","Mid-market rates for businesses",1),("pro","Batch payment tools",2),("con","Not a full business bank",1),("con","Approval can take time",2)],
    "payoneer":      [("pro","2000 marketplace integrations",1),("pro","Works in 190 countries",2),("con","Annual maintenance fee",1),("con","FX rates not always competitive",2)],
    "sumup":         [("pro","No monthly fees",1),("pro","Works in 35 countries",2),("con","Higher per-transaction rate",1),("con","No US operation",2)],
    "izettle":       [("pro","Backed by PayPal for reliability",1),("pro","Works across Europe and US",2),("con","1.75% transaction fee",1),("con","PayPal account required",2)],
    "paysafe":       [("pro","Serves high-risk merchants",1),("pro","Skrill and NETELLER brands included",2),("con","Complex fee structure",1),("con","High-risk industry focus limits appeal",2)],
    "sezzle":        [("pro","Interest-free BNPL",1),("pro","Credit building option",2),("con","US and Canada only",1),("con","Smaller merchant network",2)],
    "afterpay":      [("pro","Strong brand recognition",1),("pro","No interest charges",2),("con","Late fees for missed payments",1),("con","Can encourage overspending",2)],
    "greenlight":    [("pro","Best-in-class family finance app",1),("pro","Investing education for kids",2),("con","US only",1),("con","Monthly fee required",2)],
    "tink":          [("pro","Visa-backed for stability",1),("pro","18 country EU coverage",2),("con","Europe only",1),("con","Developer and B2B only",2)],
    "solaris":       [("pro","Full banking license",1),("pro","BaaS for non-banks",2),("con","B2B only",1),("con","Recent financial difficulties reported",2)],
    "anchorage-digital":[("pro","First OCC-chartered crypto bank",1),("pro","Institutional-grade custody",2),("con","Institutional only",1),("con","Very high minimums",2)],
    "bitpanda":      [("pro","Crypto stocks and metals in one account",1),("pro","European regulated platform",2),("con","Europe focused",1),("con","Higher fees than pure exchanges",2)],
    "alchemy":       [("pro","Powers 70 percent of top dApps",1),("pro","Excellent developer experience",2),("con","Developer and B2B only",1),("con","Web3 market dependent",2)],
    "carta":         [("pro","Industry standard for cap tables",1),("pro","Integrated 409A valuations",2),("con","Expensive for early-stage startups",1),("con","Data sharing controversy in 2023",2)],
    "fundbox":       [("pro","Fast approval using accounting data",1),("pro","Revolving credit line",2),("con","High APRs",1),("con","US only",2)],
    "figure":        [("pro","5-day HELOC funding",1),("pro","Blockchain efficiency reduces costs",2),("con","US only",1),("con","Home equity required",2)],
    "earnin":        [("pro","Access earned wages early",1),("pro","No mandatory fees",2),("con","US only",1),("con","Only works with qualifying employers",2)],
    "novo":          [("pro","No monthly fees",1),("pro","Instant Stripe payouts",2),("con","US only",1),("con","No savings account",2)],
    "qonto":         [("pro","Excellent EU business account",1),("pro","Strong expense management",2),("con","EU only",1),("con","Priced per user",2)],
    "pine-labs":     [("pro","Dominant India merchant presence",1),("pro","EMI and BNPL at POS",2),("con","Asia-focused only",1),("con","B2B merchant focus",2)],
    "phonepe":       [("pro","500M users in India",1),("pro","Market-leading UPI share at 48 percent",2),("con","India only",1),("con","UPI dependency on NPCI rules",2)],
    "ynab":          [("pro","Proven zero-based budgeting methodology",1),("pro","Dedicated fanbase and community",2),("pro","Education and coaching included",3),("con","Requires active daily engagement",1),("con","Not free after trial period",2)],
}

def api_request(method, path, data=None):
    url = f"{SUPABASE_URL}{path}"
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req) as r:
            return r.status, r.read().decode()
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()

# First get all company IDs
print("Fetching company IDs...")
status, body = api_request("GET", "/rest/v1/companies?select=id,slug&limit=200")
if status != 200:
    print(f"Error fetching companies: {status} {body}")
    exit(1)

companies = {c["slug"]: c["id"] for c in json.loads(body)}
print(f"Found {len(companies)} companies")

# Insert pros/cons
success = 0
skipped = 0
errors = 0

for slug, items in DATA.items():
    company_id = companies.get(slug)
    if not company_id:
        print(f"  SKIP: {slug} not found")
        skipped += 1
        continue
    
    for type_, text, order in items:
        row = {
            "company_id": company_id,
            "type": type_,
            "text": text,
            "sort_order": order
        }
        status, body = api_request(
            "POST",
            "/rest/v1/pros_cons",
            row
        )
        if status in (200, 201):
            success += 1
        elif status == 409:
            skipped += 1  # already exists
        else:
            print(f"  ERROR {status} for {slug} {type_}: {body[:100]}")
            errors += 1

print(f"\nDone: {success} inserted, {skipped} skipped, {errors} errors")

const USE_CASES = {
  'freelancers': { title: 'Best Fintech for Freelancers 2026', desc: 'Multi-currency accounts, international transfers, and low-fee payment tools for independent workers.' },
  'startups': { title: 'Best Fintech for Startups 2026', desc: 'Banking, payments, payroll, and expense management tools built for fast-growing companies.' },
  'international-payments': { title: 'Best International Payment Apps 2026', desc: 'Send money abroad, hold foreign currencies, and pay international contractors at the best rates.' },
  'crypto-trading': { title: 'Best Crypto Exchanges 2026', desc: 'Regulated, secure, and cost-competitive crypto exchanges for beginners and experienced traders.' },
  'small-business': { title: 'Best Banking for Small Businesses 2026', desc: 'Business bank accounts, payment processing, payroll, and expense management for small businesses.' },
  'investing': { title: 'Best Investing Apps 2026', desc: 'Commission-free stock trading, robo-advisors, and automated portfolio management for every investor.' },
  'digital-banking': { title: 'Best Digital Banks 2026', desc: 'Mobile-first bank accounts with no monthly fees, instant notifications, and better rates.' },
  'bnpl': { title: 'Best Buy Now Pay Later Apps 2026', desc: 'Split purchases into interest-free instalments. Compare fees, credit impact, and retailer coverage.' },
  'payroll': { title: 'Best Payroll Software 2026', desc: 'Payroll, HR, and global workforce management tools for businesses of every size.' },
  'expense-management': { title: 'Best Expense Management Tools 2026', desc: 'Corporate cards, spend controls, and automated expense reporting to manage company spending.' },
}

export async function generateMetadata({ params }) {
  const uc = USE_CASES[params.slug] || { title: 'Best Fintech | The Fintech Rank', desc: 'Find the best fintech for your needs.' }
  const title = `${uc.title} | The Fintech Rank`
  return {
    title,
    description: uc.desc,
    openGraph: { title, description: uc.desc, url: `https://thefintechrank.com/best-for/${params.slug}`, siteName: 'The Fintech Rank' },
    twitter: { card: 'summary_large_image', title, description: uc.desc },
    alternates: { canonical: `https://thefintechrank.com/best-for/${params.slug}` },
  }
}

export default function BestForLayout({ children }) {
  return children
}

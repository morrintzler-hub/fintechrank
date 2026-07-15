import { supabase } from '../../../lib/supabase'

export async function generateMetadata({ params }) {
  const { data: c } = await supabase
    .from('companies')
    .select('name, tagline, slug')
    .eq('slug', params.slug)
    .maybeSingle()

  if (!c) return { title: 'Company Review | The Fintech Rank' }

  const title = `${c.name} Review 2026 - Fees, Features and Score | The Fintech Rank`
  const desc = `${c.name} review: ${c.tagline || ''}. See pricing, features, editorial score and compare with alternatives.`

  return {
    title,
    description: desc,
    openGraph: { title, description: desc, url: `https://thefintechrank.com/review/${params.slug}`, siteName: 'The Fintech Rank', type: 'article' },
    twitter: { card: 'summary_large_image', title, description: desc },
    alternates: { canonical: `https://thefintechrank.com/review/${params.slug}` },
  }
}

export default function ReviewSlugLayout({ children }) {
  return children
}

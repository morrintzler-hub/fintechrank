import { supabase } from '../lib/supabase'

export default async function sitemap() {
  const base = 'https://www.thefintechrank.com'

  // Static pages
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

  // Dynamic review pages from Supabase
  let review_pages = []
  try {
    const { data } = await supabase
      .from('companies')
      .select('slug, updated_at')
      .eq('is_active', true)
      .order('rank')

    if (data) {
      review_pages = data.map(c => ({
        url: `${base}/review/${c.slug}`,
        lastModified: c.updated_at ? new Date(c.updated_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      }))
    }
  } catch (e) {
    console.error('Sitemap: error fetching companies', e)
  }

  return [...static_pages, ...review_pages]
}

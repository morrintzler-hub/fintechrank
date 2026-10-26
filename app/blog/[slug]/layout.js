import fs from 'fs'
import path from 'path'

const SITE = 'https://thefintechrank.com'

// Mirrors the frontmatter parser in app/api/blog/[slug]/route.js so the
// metadata and the rendered post always come from the same source.
function readPost(slug) {
  try {
    const file = path.join(process.cwd(), 'content', 'blog', `${slug}.md`)
    if (!fs.existsSync(file)) return null
    const raw = fs.readFileSync(file, 'utf8')
    const match = raw.match(/^---\n([\s\S]*?)\n---\n/)
    if (!match) return null
    const data = {}
    match[1].split('\n').forEach(line => {
      const [key, ...rest] = line.split(': ')
      if (key && rest.length) data[key.trim()] = rest.join(': ').trim().replace(/^["']|["']$/g, '')
    })
    return data
  } catch {
    return null
  }
}

function heroImage(slug, post) {
  if (post && post.image) return `${SITE}${post.image}`
  try {
    if (fs.existsSync(path.join(process.cwd(), 'public', `blog-${slug}.png`))) {
      return `${SITE}/blog-${slug}.png`
    }
  } catch {}
  return null
}

function isoDate(value) {
  const d = new Date(value)
  return isNaN(d.getTime()) ? undefined : d.toISOString()
}

export async function generateMetadata({ params }) {
  const { slug } = params
  const post = readPost(slug)
  if (!post || !post.title) return {}

  const url = `${SITE}/blog/${slug}`
  const image = heroImage(slug, post)
  // Older posts carry `excerpt`, newer ones `description` - the API route
  // treats them interchangeably, so metadata does too.
  const description = post.description || post.excerpt || ''

  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      siteName: 'The Fintech Rank',
      title: post.title,
      description,
      publishedTime: isoDate(post.date),
      ...(image ? { images: [{ url: image, alt: post.title }] } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: post.title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  }
}

export default function BlogPostLayout({ children }) {
  return children
}

'use client'
import { useEffect, useState } from 'react'

const NEWS_API_KEY = '499595836aec49ebb44524dcf208e4be'

export default function CompanyNews({ company }) {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!company?.name) return
    const query = encodeURIComponent(`"${company.name}" fintech`)
    fetch(`https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&pageSize=4&language=en&apiKey=${NEWS_API_KEY}`)
      .then(r => r.json())
      .then(data => {
        if (data.articles) setNews(data.articles.filter(a => a.title && a.url && !a.title.includes('[Removed]')).slice(0, 4))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [company?.name])

  if (loading) return (
    <div style={{ padding: '1.5rem 0' }}>
      {[1,2,3].map(i => (
        <div key={i} style={{ height: 56, borderRadius: 8, background: 'var(--bg2)', marginBottom: 8, opacity: 0.6 }} />
      ))}
    </div>
  )

  if (!news.length) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {news.map((article, i) => {
        const domain = new URL(article.url).hostname.replace('www.', '')
        const diff = Date.now() - new Date(article.publishedAt).getTime()
        const h = Math.floor(diff / 3600000)
        const ago = h < 1 ? 'just now' : h < 24 ? `${h}h ago` : h < 168 ? `${Math.floor(h/24)}d ago` : `${Math.floor(h/168)}w ago`
        return (
          <a key={i} href={article.url} target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', gap: 12, padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--card)', textDecoration: 'none', transition: 'border-color .15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,132,137,0.3)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', lineHeight: 1.45, marginBottom: 4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {article.title}
              </div>
              <div style={{ fontSize: 11, color: 'var(--dim)' }}>{domain} - {ago}</div>
            </div>
          </a>
        )
      })}
    </div>
  )
}

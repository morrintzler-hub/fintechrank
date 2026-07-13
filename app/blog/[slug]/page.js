'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function BlogPostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blog/' + slug)
      .then(r => r.json())
      .then(data => { setPost(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', color:'var(--muted)', fontFamily:'var(--font)' }}>
      Loading...
    </div>
  )

  if (!post || post.error) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', fontFamily:'var(--font)' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:48, marginBottom:16 }}>404</div>
        <div style={{ color:'var(--muted)', marginBottom:24 }}>Post not found</div>
        <Link href="/blog" style={{ color:'var(--accent)', textDecoration:'none' }}>Back to blog</Link>
      </div>
    </div>
  )

  return (
    <div style={{ background:'var(--bg)', minHeight:'100vh' }}>
      <div style={{ maxWidth:720, margin:'0 auto', padding:'3rem 2rem 6rem' }}>
        <Link href="/blog" style={{ display:'inline-flex', alignItems:'center', gap:6, color:'var(--accent)', textDecoration:'none', fontSize:14, marginBottom:'2rem' }}>
          Back to all articles
        </Link>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
          <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:4, background:(post.categoryColor||'#2563eb')+'20', color:post.categoryColor||'#2563eb', textTransform:'uppercase', letterSpacing:'.06em' }}>{post.category}</span>
          <span style={{ fontSize:13, color:'var(--dim)' }}>{post.date}</span>
          <span style={{ fontSize:13, color:'var(--dim)' }}>{post.readTime}</span>
        </div>
        <h1 style={{ fontFamily:'var(--heading)', fontWeight:800, fontSize:'clamp(1.6rem,3vw,2.2rem)', lineHeight:1.2, color:'var(--text)', marginBottom:16, letterSpacing:'-.02em' }}>{post.title}</h1>
        <p style={{ fontSize:17, color:'var(--muted)', lineHeight:1.7, marginBottom:'2rem', borderBottom:'1px solid var(--border)', paddingBottom:'2rem' }}>{post.excerpt}</p>
        {post.image && (
          <div style={{ borderRadius:'var(--r)', overflow:'hidden', marginBottom:'2.5rem', border:'1px solid var(--border)' }}>
            <img src={post.image} alt={post.title} style={{ width:'100%', display:'block', objectFit:'cover', objectPosition:'center top', maxHeight:380 }}/>
          </div>
        )}
        <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.html }}/>
        <div style={{ marginTop:'3rem', paddingTop:'2rem', borderTop:'1px solid var(--border)', display:'flex', gap:12, flexWrap:'wrap' }}>
          <Link href="/compare" style={{ padding:'10px 20px', borderRadius:'var(--rsm)', background:'var(--accent)', color:'#fff', textDecoration:'none', fontSize:14, fontWeight:600, fontFamily:'var(--font)' }}>Compare companies</Link>
          <Link href="/blog" style={{ padding:'10px 20px', borderRadius:'var(--rsm)', border:'1px solid var(--border)', color:'var(--text)', textDecoration:'none', fontSize:14, fontFamily:'var(--font)' }}>More articles</Link>
        </div>
      </div>
    </div>
  )
}

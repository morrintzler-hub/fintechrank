'use client'
import { useEffect, useState } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (consent) return
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const isEU = tz.startsWith('Europe/') || ['Atlantic/Azores','Atlantic/Canary','Atlantic/Madeira'].includes(tz)
    if (isEU) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem('cookie-consent', 'accepted')
    if (window.gtag) window.gtag('consent', 'update', { analytics_storage: 'granted' })
    setVisible(false)
  }

  function reject() {
    localStorage.setItem('cookie-consent', 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999, width: 'calc(100% - 48px)', maxWidth: 520,
      background: '#1a1d23', borderRadius: 12, padding: '16px 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.24)', flexWrap: 'wrap',
    }}>
      <p style={{ margin: 0, fontSize: 13, color: '#c8cdd6', lineHeight: 1.5, flex: 1, minWidth: 200 }}>
        We use cookies to improve your experience and analyse traffic.{' '}
        <a href="/methodology" style={{ color: '#008489', textDecoration: 'none' }}>Learn more</a>
      </p>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button onClick={reject} style={{
          padding: '7px 14px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.12)',
          background: 'transparent', color: '#8a9ab0', fontSize: 12, cursor: 'pointer',
          fontFamily: 'Manrope, sans-serif', fontWeight: 500,
        }}>Reject</button>
        <button onClick={accept} style={{
          padding: '7px 16px', borderRadius: 6, border: 'none',
          background: '#008489', color: '#fff', fontSize: 12, cursor: 'pointer',
          fontFamily: 'Manrope, sans-serif', fontWeight: 600,
        }}>Accept</button>
      </div>
    </div>
  )
}

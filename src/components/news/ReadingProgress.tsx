'use client'
import { useState, useEffect } from 'react'

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const article = document.getElementById('article-content')
      if (!article) return
      const rect = article.getBoundingClientRect()
      const articleTop = rect.top + window.scrollY
      const articleBottom = articleTop + rect.height
      const windowH = window.innerHeight
      // Start when article enters viewport bottom, end when article bottom reaches viewport bottom
      const start = articleTop - windowH
      const end = articleBottom - windowH
      if (end <= start) return
      setProgress(Math.min(100, Math.max(0, ((window.scrollY - start) / (end - start)) * 100)))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent pointer-events-none">
      <div
        className="h-full"
        style={{
          width: `${progress}%`,
          background: 'var(--cp)',
          transition: 'width 80ms linear',
          opacity: progress > 0 && progress < 100 ? 1 : 0,
          transitionProperty: 'width, opacity',
        }}
      />
    </div>
  )
}

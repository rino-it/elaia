import { useEffect, useState } from 'react'
import { useLenis } from '../providers/SmoothScrollProvider'

export default function StickyBar() {
  const lenis = useLenis()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!lenis) {
      const onNativeScroll = () => setShow(window.scrollY > 800)
      window.addEventListener('scroll', onNativeScroll, { passive: true })
      return () => window.removeEventListener('scroll', onNativeScroll)
    }
    const onScroll = () => setShow(lenis.scroll > 800)
    lenis.on('scroll', onScroll)
    return () => lenis.off('scroll', onScroll)
  }, [lenis])

  const handleBrochure = () => {
    if (lenis) {
      lenis.scrollTo('#contatti', { offset: -80, duration: 1.4 })
    } else {
      const el = document.querySelector('#contatti')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className={`sticky-bar${show ? ' show' : ''}`}>
      <button onClick={handleBrochure} className="sticky-btn sticky-form" aria-label="Vai al form richiesta brochure">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
        </svg>
        Brochure
      </button>
      <a href="tel:+393332895941" className="sticky-btn sticky-call" aria-label="Chiama Massimo Brissoni">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
        </svg>
        Chiama Massimo
      </a>
    </div>
  )
}

import { type MouseEvent, useEffect, useState } from 'react'
import { useLenis } from '../providers/SmoothScrollProvider'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return
    const onScroll = () => setScrolled(lenis.scroll > 50)
    lenis.on('scroll', onScroll)
    return () => lenis.off('scroll', onScroll)
  }, [lenis])

  const handleAnchor = (e: MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault()
    lenis?.scrollTo(target, { offset: -80, duration: 1.4 })
  }

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
      <a
        href="#hero"
        className="logo logo-wordmark"
        onClick={(e) => handleAnchor(e, '#hero')}
        aria-label="ELAIA Ponteranica — torna in cima"
      >
        ELAIA
      </a>
      <a
        href="#contatti"
        className="nav-cta"
        onClick={(e) => handleAnchor(e, '#contatti')}
      >
        Richiedi info
      </a>
    </nav>
  )
}

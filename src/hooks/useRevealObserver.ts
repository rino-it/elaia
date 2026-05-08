import { useEffect } from 'react'
import { ScrollTrigger } from '../lib/gsap'

export function useRevealObserver() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    if (elements.length === 0) return

    const triggers = elements.map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom-=30',
        once: true,
        onEnter: () => el.classList.add('visible'),
      })
    )

    ScrollTrigger.refresh()

    return () => {
      triggers.forEach((t) => t.kill())
    }
  }, [])
}

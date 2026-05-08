import { useEffect, useRef } from 'react'
import { useLenis } from '../providers/SmoothScrollProvider'

export default function Progress() {
  const ref = useRef<HTMLDivElement>(null)
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      if (h > 0 && ref.current) {
        ref.current.style.width = `${(lenis.scroll / h) * 100}%`
      }
    }
    update()
    lenis.on('scroll', update)
    return () => lenis.off('scroll', update)
  }, [lenis])

  return <div ref={ref} className="progress" id="progress" />
}

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

export function initGsapWithLenis(lenis: Lenis) {
  const onScroll = () => ScrollTrigger.update()
  lenis.on('scroll', onScroll)

  const tickerCallback = (time: number) => lenis.raf(time * 1000)
  gsap.ticker.add(tickerCallback)
  gsap.ticker.lagSmoothing(0)

  return () => {
    lenis.off('scroll', onScroll)
    gsap.ticker.remove(tickerCallback)
    gsap.ticker.lagSmoothing(500, 33)
  }
}

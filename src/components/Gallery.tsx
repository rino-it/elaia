import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import '../lib/gsap'

type Card = {
  num: string
  ttl: string
  src: string
  alt: string
}

const CARDS: Card[] = [
  {
    num: '01',
    ttl: 'Vista frontale',
    src: '/images/gallery/gallery-01.webp',
    alt: 'Vista frontale ELAIA — facciata principale e ingresso',
  },
  {
    num: '02',
    ttl: 'Vista aerea',
    src: '/images/gallery/gallery-02.webp',
    alt: 'Vista aerea ELAIA — terrazze a giardino pensile',
  },
  {
    num: '03',
    ttl: 'Terrazza panoramica',
    src: '/images/gallery/gallery-03.webp',
    alt: 'Terrazza ELAIA con affaccio sul Parco dei Colli',
  },
  {
    num: '04',
    ttl: 'Living interno',
    src: '/images/gallery/gallery-04.webp',
    alt: 'Living ELAIA — pavimenti in rovere, ampie vetrate',
  },
  {
    num: '05',
    ttl: 'Verde integrato',
    src: '/images/gallery/gallery-05.webp',
    alt: 'Giardino pensile ELAIA — lavanda e ulivi sulla terrazza',
  },
  {
    num: '06',
    ttl: 'Dettaglio architettonico',
    src: '/images/gallery/gallery-06.webp',
    alt: 'Dettaglio architettonico ELAIA — serramenti e materiali',
  },
]

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      const track = trackRef.current
      if (!section || !track) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const compute = () => track.scrollWidth - window.innerWidth
        if (compute() <= 0) return

        gsap.to(track, {
          x: () => -compute(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${compute()}`,
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(track, { x: 0 })
      })

      return () => mm.revert()
    },
    { scope: sectionRef, dependencies: [] },
  )

  return (
    <section className="gallery-section" id="gallery" ref={sectionRef}>
      <div className="gallery-head">
        <div className="eyebrow">Galleria</div>
        <h2 className="section-title">
          Ogni angolo, <span className="ital">un'emozione</span>.
        </h2>
      </div>
      <div className="gallery-viewport">
        <div className="gallery-track" ref={trackRef}>
          {CARDS.map((c) => (
            <div key={c.num} className="gallery-card">
              <div className="gallery-img-bg">
                <img src={c.src} alt={c.alt} loading="lazy" />
              </div>
              <div className="gallery-label">
                <div className="num">— {c.num}</div>
                <div className="ttl">{c.ttl}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

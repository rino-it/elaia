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
  const imagesRef = useRef<HTMLImageElement[]>([])
  const counterRef = useRef<HTMLSpanElement>(null)
  const captionRef = useRef<HTMLSpanElement>(null)
  const dotsRef = useRef<HTMLDivElement>(null)
  const lastIdxRef = useRef(0)

  const setImageRef = (el: HTMLImageElement | null, i: number) => {
    if (el) imagesRef.current[i] = el
  }

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const imgs = imagesRef.current.filter(Boolean)
        if (imgs.length === 0) return

        // Stato iniziale: solo la prima visibile a scale 1, le altre invisibili a scale 0.85
        gsap.set(imgs[0], { opacity: 1, scale: 1 })
        imgs.slice(1).forEach((img) => {
          gsap.set(img, { opacity: 0, scale: 0.85 })
        })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            pin: true,
            start: 'top top',
            end: () => `+=${CARDS.length * 55}%`,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(
                CARDS.length - 1,
                Math.floor(self.progress * CARDS.length + 0.0001),
              )
              if (idx !== lastIdxRef.current) {
                lastIdxRef.current = idx
                const newCounter = String(idx + 1).padStart(2, '0')
                const newCaption = CARDS[idx].ttl
                if (counterRef.current) {
                  gsap
                    .timeline()
                    .to(counterRef.current, { opacity: 0, duration: 0.16, ease: 'power2.in' })
                    .call(() => {
                      if (counterRef.current) counterRef.current.textContent = newCounter
                    })
                    .to(counterRef.current, { opacity: 1, duration: 0.22, ease: 'power2.out' })
                }
                if (captionRef.current) {
                  gsap
                    .timeline()
                    .to(captionRef.current, { yPercent: 100, opacity: 0, duration: 0.18, ease: 'power2.in' })
                    .call(() => {
                      if (captionRef.current) captionRef.current.textContent = newCaption
                    })
                    .set(captionRef.current, { yPercent: -100 })
                    .to(captionRef.current, { yPercent: 0, opacity: 1, duration: 0.22, ease: 'power2.out' })
                }
                if (dotsRef.current) {
                  const dots = dotsRef.current.querySelectorAll<HTMLSpanElement>('.gallery-cinema-dot')
                  dots.forEach((d, i) => d.classList.toggle('is-active', i === idx))
                }
              }
            },
          },
        })

        // Sequenza zoom: ogni immagine entra (scale 0.85→1, opacity 0→1)
        // mentre la precedente esce (scale 1→1.15, opacity 1→0).
        for (let i = 1; i < imgs.length; i++) {
          const t = i // tempo timeline = indice transizione
          tl.fromTo(
            imgs[i],
            { opacity: 0, scale: 0.85 },
            { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' },
            t,
          ).to(
            imgs[i - 1],
            { opacity: 0, scale: 1.15, duration: 1, ease: 'power2.in' },
            t,
          )
        }
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        // Fallback: tutte visibili in stack verticale (CSS si occupa via classe section)
        const imgs = imagesRef.current.filter(Boolean)
        imgs.forEach((img) => gsap.set(img, { opacity: 1, scale: 1, clearProps: 'transform' }))
      })

      return () => mm.revert()
    },
    { scope: sectionRef, dependencies: [] },
  )

  return (
    <section className="gallery-cinema" id="gallery" ref={sectionRef} aria-label="Galleria render">
      <div className="gallery-cinema-sticky">
        <div className="gallery-cinema-head">
          <div className="eyebrow">Galleria</div>
          <h2 className="section-title">
            Ogni angolo, <span className="ital">un'emozione</span>.
          </h2>
        </div>

        <div className="gallery-cinema-frame">
          {CARDS.map((c, i) => (
            <img
              key={c.num}
              ref={(el) => setImageRef(el, i)}
              src={c.src}
              alt={c.alt}
              className="gallery-cinema-img"
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'auto'}
            />
          ))}
        </div>

        <div className="gallery-cinema-meta">
          <div className="gallery-cinema-counter" aria-hidden="true">
            <span className="counter-mask">
              <span ref={counterRef} className="counter-num">01</span>
            </span>
            <span className="counter-sep">—</span>
            <span className="counter-total">{String(CARDS.length).padStart(2, '0')}</span>
          </div>
          <div className="gallery-cinema-caption-wrap" aria-live="polite">
            <span ref={captionRef} className="gallery-cinema-caption">
              {CARDS[0].ttl}
            </span>
          </div>
        </div>

        <div className="gallery-cinema-dots" ref={dotsRef} aria-hidden="true">
          {CARDS.map((c, i) => (
            <span key={c.num} className={`gallery-cinema-dot${i === 0 ? ' is-active' : ''}`} />
          ))}
        </div>
      </div>
    </section>
  )
}

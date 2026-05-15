import { useRef, type CSSProperties } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

type TodState = {
  key: 'dawn' | 'day' | 'dusk' | 'night'
  time: string
  title: string
  body: string
  img: string
  imgMobile?: string
  alt: string
}

const STATES: TodState[] = [
  {
    key: 'dawn',
    time: '07:30',
    title: 'La mattina.',
    body: 'Il caffè ha un panorama nuovo. Le terrazze a giardino pensile e la luce dei colli, prima del rumore della città.',
    img: '/images/tod/dawn.webp',
    imgMobile: '/images/tod/dawn_mobile.webp',
    alt: 'Mattina ELAIA — terrazza con caffè e vista sui colli',
  },
  {
    key: 'day',
    time: '13:00',
    title: 'Il pomeriggio.',
    body: 'Il verde è parte della casa. Lavanda, ulivi, fiori sulla terrazza: la natura non è fuori, è con voi.',
    img: '/images/tod/day.webp',
    imgMobile: '/images/tod/day_mobile.webp',
    alt: 'Pomeriggio ELAIA — giardino pensile e verde integrato',
  },
  {
    key: 'dusk',
    time: '20:00',
    title: 'La sera.',
    body: 'Cena sotto le stelle, affacciati sulle luci della valle. Ogni sera diventa un\'occasione.',
    img: '/images/tod/dusk.webp',
    imgMobile: '/images/tod/dusk_mobile.webp',
    alt: 'Sera ELAIA — cena in terrazza con vista sulla valle',
  },
  {
    key: 'night',
    time: '22:30',
    title: 'La notte.',
    body: 'Il silenzio del Parco dei Colli, le luci di Bergamo Alta in lontananza. Ponteranica come l\'avete sempre immaginata.',
    img: '/images/tod/night.webp',
    imgMobile: '/images/tod/night_mobile.webp',
    alt: 'Notte ELAIA — silenzio del Parco dei Colli e luci di Bergamo Alta',
  },
]

type StackVarStyle = CSSProperties & { '--tod-i': number }

export default function TimesOfDay() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLElement[]>([])

  const setCardRef = (el: HTMLElement | null, i: number) => {
    if (el) cardsRef.current[i] = el
  }

  useGSAP(
    () => {
      const cards = cardsRef.current.filter(Boolean)
      if (cards.length === 0) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        cards.forEach((card, i) => {
          if (i === cards.length - 1) return

          gsap.to(card, {
            scale: 0.9,
            opacity: 0.15,
            y: -30,
            scrollTrigger: {
              trigger: cards[i + 1],
              start: 'top top+=100',
              end: 'top top+=20',
              scrub: 0.6,
            },
          })
        })

        ScrollTrigger.refresh()
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(cards, { scale: 1, opacity: 1, y: 0 })
      })

      return () => mm.revert()
    },
    { scope: sectionRef, dependencies: [] },
  )

  return (
    <section className="tod" id="times-of-day" ref={sectionRef}>
      <div className="tod-stack">
        {STATES.map((s, i) => (
          <article
            key={s.key}
            ref={(el) => setCardRef(el, i)}
            className="tod-card"
            data-state={s.key}
            style={{ '--tod-i': i } as StackVarStyle}
          >
            <div className="tod-bg">
              <picture>
                {s.imgMobile && (
                  <source srcSet={s.imgMobile} media="(max-width: 768px)" />
                )}
                <img src={s.img} alt={s.alt} loading="lazy" />
              </picture>
            </div>
            <div className="tod-state">
              <p className="eyebrow tod-time">{s.time}</p>
              <h2 className="tod-title serif">{s.title}</h2>
              <p className="tod-body">{s.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

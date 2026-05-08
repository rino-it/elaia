import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

type TodState = {
  key: 'dawn' | 'day' | 'dusk' | 'night'
  time: string
  title: string
  body: string
  textColor: string
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
    textColor: '#1a1a1a',
    img: '/images/tod/dawn.webp',
    imgMobile: '/images/tod/dawn_mobile.webp',
    alt: 'Mattina ELAIA — terrazza con caffè e vista sui colli',
  },
  {
    key: 'day',
    time: '13:00',
    title: 'Il pomeriggio.',
    body: 'Il verde è parte della casa. Lavanda, ulivi, fiori sulla terrazza: la natura non è fuori, è con voi.',
    textColor: '#1a1a1a',
    img: '/images/tod/day.webp',
    imgMobile: '/images/tod/day_mobile.webp',
    alt: 'Pomeriggio ELAIA — giardino pensile e verde integrato',
  },
  {
    key: 'dusk',
    time: '20:00',
    title: 'La sera.',
    body: 'Cena sotto le stelle, affacciati sulle luci della valle. Ogni sera diventa un\'occasione.',
    textColor: '#f5f5f0',
    img: '/images/tod/dusk.webp',
    imgMobile: '/images/tod/dusk_mobile.webp',
    alt: 'Sera ELAIA — cena in terrazza con vista sulla valle',
  },
  {
    key: 'night',
    time: '22:30',
    title: 'La notte.',
    body: 'Il silenzio del Parco dei Colli, le luci di Bergamo Alta in lontananza. Ponteranica come l\'avete sempre immaginata.',
    textColor: '#f5f5f0',
    img: '/images/tod/night.webp',
    imgMobile: '/images/tod/night_mobile.webp',
    alt: 'Notte ELAIA — silenzio del Parco dei Colli e luci di Bergamo Alta',
  },
]

export default function TimesOfDay() {
  const sectionRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', (ctx) => {
        const conditions = ctx.conditions as { isMobile?: boolean } | undefined
        const isMobile = conditions?.isMobile ?? window.matchMedia('(max-width: 768px)').matches

        const section = sectionRef.current
        const sticky = stickyRef.current
        if (!section || !sticky) return

        const bgs = sticky.querySelectorAll<HTMLDivElement>('.tod-bg')
        const states = sticky.querySelectorAll<HTMLDivElement>('.tod-state')
        const dots = sticky.querySelectorAll<HTMLSpanElement>('.tod-dot')
        if (bgs.length === 0 || states.length === 0) return

        const numStates = 4

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${isMobile ? 160 : 220}%`,
            pin: sticky,
            scrub: isMobile ? 0.25 : 0.5,
            anticipatePin: 1,
          },
        })

        // bg cross-fade + stato testo + dot indicator
        for (let i = 1; i < numStates; i++) {
          tl.to(bgs[i - 1], { opacity: 0, duration: 1 }, i)
            .to(bgs[i], { opacity: 1, duration: 1 }, '<')
            .to(states[i - 1], { opacity: 0, y: -20, duration: 0.6 }, '<')
            .to(states[i], { opacity: 1, y: 0, duration: 0.6 }, '<+0.2')
            .to(dots[i - 1], { width: 8, duration: 0.4 }, '<')
            .to(dots[i], { width: 32, duration: 0.4 }, '<')
        }
      }, { isMobile: window.matchMedia('(max-width: 768px)').matches })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        // mostra solo lo stato "day", statico, senza pin
      })

      return () => mm.revert()
    },
    { scope: sectionRef, dependencies: [] },
  )

  const visibleStates = STATES

  return (
    <section className="tod" id="times-of-day" ref={sectionRef}>
      <div className="tod-sticky" ref={stickyRef}>
        {visibleStates.map((s, i) => (
          <div
            key={`bg-${s.key}`}
            className="tod-bg"
            data-state={s.key}
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <picture>
              {s.imgMobile && (
                <source srcSet={s.imgMobile} media="(max-width: 768px)" />
              )}
              <img src={s.img} alt={s.alt} loading="lazy" />
            </picture>
          </div>
        ))}

        <div className="tod-content">
          {visibleStates.map((s, i) => (
            <div
              key={`state-${s.key}`}
              className="tod-state"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <p className="eyebrow tod-time">{s.time}</p>
              <h2 className="tod-title serif">{s.title}</h2>
              <p className="tod-body">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="tod-indicator" aria-hidden="true">
          {visibleStates.map((s, i) => (
            <span
              key={`dot-${s.key}`}
              className="tod-dot"
              style={{ width: i === 0 ? 32 : 8 }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

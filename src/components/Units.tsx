import { useRef, type CSSProperties, type MouseEvent } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useLenis } from '../providers/SmoothScrollProvider'

type Unit = {
  num: string
  name: string
  img: string | null
  imgAlt: string
  specs: string
  price: string
  body: string
}

const UNITS: Unit[] = [
  {
    num: '1.T',
    name: 'Trilocale',
    img: '/images/units/unit-trilocale.webp',
    imgAlt: 'Trilocale ELAIA — terrazza vivibile con vista sulle colline',
    specs: '~85 m² · 2 camere · 2 bagni · terrazza vivibile · 3 disponibili',
    price: '295.000',
    body:
      'Il taglio più richiesto. Living luminoso, due camere, doppi servizi, terrazza vivibile con affaccio sulle colline.',
  },
  {
    num: '2.Q',
    name: 'Quadrilocale',
    img: '/images/units/unit-quadrilocale.webp',
    imgAlt: 'Quadrilocale ELAIA — doppio affaccio e giardino pensile privato',
    specs: '~120 m² · 3 camere · 2 bagni · giardino pensile · 2 disponibili',
    price: '420.000',
    body:
      'Ampi spazi, doppio affaccio, giardino pensile privato. Pensato per chi cerca la giusta misura tra eleganza e quotidianità.',
  },
  {
    num: '3.A',
    name: 'Attico',
    img: '/images/units/unit-attico.webp',
    imgAlt: 'Attico ELAIA — terrazza panoramica 180° sul Parco dei Colli',
    specs: '~150 m² · 4+ locali · terrazza panoramica 180° · 2 disponibili',
    price: '600.000',
    body:
      'La cima dell\'eccellenza. Terrazza panoramica 180° sul Parco dei Colli, esposizione studiata, distribuzione interna disegnata su misura.',
  },
]

type StackVarStyle = CSSProperties & { '--stack-i': number }

export default function Units() {
  const lenis = useLenis()
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLElement[]>([])

  const setCardRef = (el: HTMLElement | null, i: number) => {
    if (el) cardsRef.current[i] = el
  }

  const handleAnchor = (e: MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault()
    lenis?.scrollTo(target, { offset: -80, duration: 1.4 })
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
    <section className="units-section" id="residenze" ref={sectionRef}>
      <div className="units-head reveal">
        <div className="eyebrow">Le Residenze</div>
        <h2 className="section-title">
          Tre tipologie, sette esemplari,
          <br />
          <span className="ital">un unico standard</span>.
        </h2>
      </div>

      <div className="units-stack">
        {UNITS.map((u, i) => (
          <article
            key={u.num}
            ref={(el) => setCardRef(el, i)}
            className="unit-card"
            style={{ '--stack-i': i } as StackVarStyle}
          >
            <div className="unit-image-wrap">
              {u.img ? (
                <img src={u.img} alt={u.imgAlt} loading="lazy" />
              ) : (
                <div className="ph-int">
                  <span className="ph-tag">Render in arrivo</span>
                </div>
              )}
            </div>
            <div className="unit-body">
              <div className="unit-eyebrow">— {u.num}</div>
              <h3 className="unit-name serif ital">{u.name}</h3>
              <p className="unit-specs">{u.specs}</p>
              <p className="unit-price">
                <span className="unit-price__label">da</span>
                <span className="unit-price__value">€ {u.price}</span>
              </p>
              <p className="unit-desc">{u.body}</p>
              <a
                href="#contatti"
                className="unit-cta"
                onClick={(e) => handleAnchor(e, '#contatti')}
              >
                Richiedi info →
              </a>
            </div>
          </article>
        ))}
      </div>

      <p className="units-disclaimer reveal">
        Metrature indicative. Distribuzioni interne, finiture e personalizzazioni concordate in fase di capitolato finale presso gli showroom convenzionati.
      </p>
    </section>
  )
}

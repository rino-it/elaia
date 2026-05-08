import { type CSSProperties, type ReactNode } from 'react'

type Card = {
  num: string
  label: string
  img: string
  alt: string
  title: ReactNode
  intro: string
  bullets: string[]
}

const CARDS: Card[] = [
  {
    num: '01',
    label: 'Energia',
    img: '/images/bento/bento-dettaglio.webp',
    alt: 'Dettaglio architettonico ELAIA — facciata e serramenti',
    title: (
      <>
        Classe A4 <span className="ital">reale</span>
      </>
    ),
    intro: 'Efficienza massima. Bollette vicine allo zero, comfort tutto l\'anno.',
    bullets: [
      'Cappotto 14 cm, tripli vetri a taglio termico',
      'Pompa di calore Immergas autonoma',
      'Predisposizione fotovoltaico individuale',
    ],
  },
  {
    num: '02',
    label: 'Design',
    img: '/images/bento/bento-giardino.webp',
    alt: 'Interni ELAIA — pavimenti in rovere e ampie vetrate',
    title: (
      <>
        Design <span className="ital">italiano</span>
      </>
    ),
    intro: 'Materiali nobili, dettagli pensati. Niente compromessi.',
    bullets: [
      'Pavimenti in rovere prefinito 14 mm',
      'Sanitari sospesi, rubinetterie cromate',
      'Domotica BTicino Living Now integrata',
    ],
  },
  {
    num: '03',
    label: 'Verde',
    img: '/images/bento/bento-piazza.webp',
    alt: 'Terrazza con giardino pensile ELAIA',
    title: (
      <>
        Verde <span className="ital">integrato</span>
      </>
    ),
    intro: 'Ogni piano è un giardino privato.',
    bullets: [
      'Terrazze con giardini pensili',
      'Lavanda, ulivi, fiori — natura come parte della casa',
      'Spazi vivibili tutto l\'anno',
    ],
  },
  {
    num: '04',
    label: 'Vista',
    img: '/images/bento/bento-terrazza.webp',
    alt: 'Affaccio panoramico ELAIA — Parco dei Colli',
    title: (
      <>
        Vista <span className="ital">colline</span>
      </>
    ),
    intro: 'Affaccio sul Parco dei Colli. Ogni giorno, un panorama diverso.',
    bullets: [
      'Esposizione studiata per la luce',
      'Skyline di Bergamo Alta in lontananza',
      'Silenzio del bosco a portata di sguardo',
    ],
  },
]

export default function Bento() {
  return (
    <section className="bento-section" id="progetto">
      <div className="bento-head reveal">
        <div className="eyebrow">Il Progetto</div>
        <h2 className="section-title">
          Quattro motivi per scegliere
          <br />
          <span className="ital">ELAIA</span>.
        </h2>
      </div>
      <div className="bento-grid bento-grid-4">
        {CARDS.map((c, i) => (
          <div
            key={c.num}
            className="bento-card image"
            style={{ '--bento-i': i } as CSSProperties}
          >
            <div className="bento-img-bg">
              <img src={c.img} alt={c.alt} loading="lazy" />
            </div>
            <div className="bento-text">
              <div className="bento-num">
                {c.num} — {c.label}
              </div>
              <h3 className="bento-card-title">{c.title}</h3>
              <p className="bento-intro">{c.intro}</p>
              <ul className="bento-bullets">
                {c.bullets.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

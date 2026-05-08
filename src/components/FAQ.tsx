import { type MouseEvent, type ReactNode, useState } from 'react'
import { useLenis } from '../providers/SmoothScrollProvider'

type QA = {
  q: string
  a: ReactNode
  schema: string
}

const FAQS: QA[] = [
  {
    q: 'Le soluzioni sono già tutte disponibili?',
    a: (
      <>
        <p><strong>No. Alcune sono già oggetto di forte interesse.</strong></p>
        <p>In questa fase la scelta è ancora ampia, ma la disponibilità cambia rapidamente. Per questo motivo le richieste vengono gestite in ordine di arrivo.</p>
      </>
    ),
    schema:
      'No. Alcune soluzioni sono già oggetto di forte interesse. In questa fase la scelta è ancora ampia, ma la disponibilità cambia rapidamente. Le richieste vengono gestite in ordine di arrivo.',
  },
  {
    q: 'Posso scegliere finiture e personalizzazioni?',
    a: (
      <>
        <p><strong>Sì, ma dipende dal momento in cui blocchi l'immobile.</strong></p>
        <p>Prima intervieni, più margine hai per personalizzare spazi e finiture secondo le tue esigenze. Aspettare significa, spesso, dover accettare scelte già definite.</p>
      </>
    ),
    schema:
      "Sì, ma dipende dal momento in cui blocchi l'immobile. Prima intervieni, più margine hai per personalizzare. Aspettare significa accettare scelte già definite.",
  },
  {
    q: 'Come funziona la prenotazione di una soluzione?',
    a: (
      <>
        <p>Dopo la consulenza, se trovi la soluzione giusta per te, puoi <strong>bloccarla</strong>. Questo ti permette di:</p>
        <ul>
          <li>fermare il prezzo attuale</li>
          <li>evitare che venga proposta ad altri</li>
          <li>prenderti il tempo necessario per definire tutto con calma</li>
        </ul>
      </>
    ),
    schema:
      "Dopo la consulenza, se trovi la soluzione giusta per te, puoi bloccarla. Questo ti permette di fermare il prezzo, evitare che venga proposta ad altri, prenderti il tempo per definire tutto con calma.",
  },
  {
    q: 'I prezzi sono destinati a cambiare?',
    a: (
      <>
        <p><strong>In operazioni come questa, è normale.</strong></p>
        <p>Con l'avanzamento dei lavori e la riduzione delle disponibilità, le condizioni iniziali tendono a non essere più replicabili. Chi entra prima, di solito, ha un vantaggio concreto.</p>
      </>
    ),
    schema:
      "In operazioni come questa è normale. Con l'avanzamento dei lavori e la riduzione delle disponibilità, le condizioni iniziali non sono più replicabili. Chi entra prima ha un vantaggio concreto.",
  },
  {
    q: 'Che garanzie ho sulla qualità costruttiva?',
    a: (
      <>
        <p>Il progetto prevede edifici in <strong>classe A4</strong> con impianti di ultima generazione. Questo significa:</p>
        <ul>
          <li>alti standard di isolamento termico e acustico</li>
          <li>comfort abitativo costante tutto l'anno</li>
          <li>riduzione significativa dei consumi</li>
        </ul>
        <p>In più, hai tutte le garanzie previste per legge sulle nuove costruzioni.</p>
      </>
    ),
    schema:
      "Edifici in classe A4 con impianti di ultima generazione: alti standard di isolamento, comfort abitativo costante, riduzione significativa dei consumi. In più, tutte le garanzie previste per legge sulle nuove costruzioni.",
  },
  {
    q: 'È un buon investimento, oltre che una casa?',
    a: (
      <>
        <p><strong>Se guardi i trend attuali, la risposta è sì.</strong></p>
        <p>Zona in sviluppo + nuova infrastruttura + alta efficienza energetica = immobili sempre più richiesti nel tempo.</p>
        <p>Tradotto: <strong>maggiore tenuta del valore</strong> e migliore rivendibilità.</p>
      </>
    ),
    schema:
      "Sì. Zona in sviluppo, nuove infrastrutture e alta efficienza energetica rendono questi immobili sempre più richiesti nel tempo. Tradotto: maggiore tenuta del valore e migliore rivendibilità.",
  },
  {
    q: 'Quanto tempo ho per decidere?',
    a: (
      <>
        <p><strong>Meno di quanto pensi.</strong></p>
        <p>Le opportunità migliori vengono scelte per prime. Aspettare troppo, spesso, significa dover rivedere le proprie aspettative.</p>
      </>
    ),
    schema:
      "Meno di quanto pensi. Le opportunità migliori vengono scelte per prime. Aspettare troppo significa dover rivedere le proprie aspettative.",
  },
  {
    q: "Cosa succede se aspetto ancora un po'?",
    a: (
      <>
        <p>Succede quello che succede sempre.</p>
        <p><strong>Torni — e la soluzione che ti aveva colpito non c'è più.</strong></p>
      </>
    ),
    schema:
      "Succede quello che succede sempre: torni, e la soluzione che ti aveva colpito non c'è più.",
  },
]

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, schema }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: schema },
  })),
}

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  const lenis = useLenis()

  const toggle = (i: number) => {
    setOpenIdx((curr) => (curr === i ? null : i))
  }

  const handleAnchor = (e: MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault()
    if (lenis) {
      lenis.scrollTo(target, { offset: -80, duration: 1.4 })
    } else {
      const el = document.querySelector(target)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="faq" id="faq">
      <header className="faq-header reveal">
        <p className="eyebrow">FAQ</p>
        <h2 className="section-title">
          Le domande che <span className="ital">fanno la differenza</span>.
        </h2>
      </header>

      <ul className="faq-list">
        {FAQS.map((item, i) => {
          const open = openIdx === i
          const id = `faq-panel-${i}`
          return (
            <li key={i} className={`faq-item${open ? ' open' : ''}`}>
              <button
                type="button"
                className="faq-q"
                aria-expanded={open}
                aria-controls={id}
                onClick={() => toggle(i)}
              >
                <span className="faq-q-text">{item.q}</span>
                <span className="faq-q-icon" aria-hidden="true">
                  {open ? '−' : '+'}
                </span>
              </button>
              <div
                id={id}
                className="faq-a"
                role="region"
                aria-hidden={!open}
              >
                <div className="faq-a-content">{item.a}</div>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="faq-cta-banner reveal">
        <h3 className="faq-cta-title serif">
          Vuoi capire se c'è ancora la <span className="ital">soluzione giusta</span> per te?
        </h3>
        <p className="faq-cta-sub">
          Bastano pochi minuti per capire se ha senso approfondire.
        </p>
        <a
          href="#contatti"
          className="faq-cta-btn"
          onClick={(e) => handleAnchor(e, '#contatti')}
        >
          Richiedi le disponibilità aggiornate
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>

      <footer className="faq-footer reveal">
        <p>
          Altre domande? Scrivete su WhatsApp a{' '}
          <a
            href="https://wa.me/393332895941?text=Ciao%2C%20ho%20una%20domanda%20su%20ELAIA%20Ponteranica"
            target="_blank"
            rel="noopener noreferrer"
          >
            Massimo Brissoni
          </a>{' '}
          — risponde direttamente.
        </p>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
    </section>
  )
}

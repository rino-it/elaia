import { useState } from 'react'

type QA = { q: string; a: string }

const FAQS: QA[] = [
  {
    q: 'Le soluzioni sono già tutte disponibili?',
    a: 'Sì, ma con disponibilità calante. Sette residenze totali: 3 trilocali, 2 quadrilocali, 2 attici. Le condizioni di prezzo aggiornate e l\'elenco delle unità ancora libere sono riservate a chi richiede una consulenza — su listino pubblico non vengono mai esposte.',
  },
  {
    q: 'In che classe energetica costruite?',
    a: 'Classe A4 reale. Cappotto 14 cm, tripli vetri a taglio termico, pompa di calore Immergas autonoma per riscaldamento e raffrescamento, predisposizione per fotovoltaico individuale. Bollette vicine allo zero. La certificazione APE è disponibile per ogni unità in fase preliminare.',
  },
  {
    q: 'Posso scegliere finiture e personalizzazioni?',
    a: 'Sì. Fino a 6 mesi prima della consegna potete personalizzare zona giorno, bagni e zona notte. Mettiamo a disposizione un capitolato con tre selezioni di base (chiaro, naturale, scuro) più variazioni puntuali su materiali e cromie. Il progettista vi segue personalmente.',
  },
  {
    q: 'Come funziona la prenotazione di una soluzione?',
    a: 'Vi proponiamo una proposta di prelazione di 30 giorni con caparra restituibile fino alla firma del preliminare. È un modo per fermare un\'unità senza dover decidere tutto subito. Senza fretta, senza pressione commerciale.',
  },
  {
    q: 'Che garanzie ho sulla qualità costruttiva?',
    a: 'Polizza decennale postuma obbligatoria, certificazione APE, garanzie sui materiali secondo le condizioni dei fornitori (Immergas, Garofoli, Grohe, BTicino, Geberit). Capitolato leggibile e completo prima della firma del preliminare — non dopo.',
  },
  {
    q: 'È un buon investimento oltre che una casa?',
    a: 'Ponteranica è tra le aree a più alta crescita immobiliare della provincia di Bergamo (+12% negli ultimi cinque anni). Solo sette unità, classe A4 certificata, vincoli paesaggistici del Parco dei Colli che proteggono il valore nel tempo. Non un condominio: esclusività che difende il prezzo.',
  },
  {
    q: 'Quanto tempo ho per decidere?',
    a: 'Tutto il tempo che vi serve per essere sicuri — non un minuto in più. Vi proponiamo di vedere il cantiere prima di decidere, di persona, senza appuntamento commerciale e senza firmare nulla. Le sette residenze però non torneranno disponibili: è un dato di fatto, non una tattica di vendita.',
  },
  {
    q: 'Cosa succede se aspetto ancora un po\'?',
    a: 'I prezzi sono fissati alla data di firma del preliminare. Più aspettate, più alta è la probabilità che la soluzione che vi interessava venga prenotata. Possiamo rispondere a tutte le vostre domande in una telefonata di quindici minuti, senza alcun impegno.',
  },
]

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  const toggle = (i: number) => {
    setOpenIdx((curr) => (curr === i ? null : i))
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
                <p>{item.a}</p>
              </div>
            </li>
          )
        })}
      </ul>

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

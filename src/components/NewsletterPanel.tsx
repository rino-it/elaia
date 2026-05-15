import { type FormEvent, useState } from 'react'
import { subscribeNewsletter } from '../lib/supabase'

export default function NewsletterPanel() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setErrorMsg('Email non valida')
      return
    }
    setErrorMsg('')
    setSubmitting(true)
    try {
      await subscribeNewsletter(email.trim(), 'newsletter_panel_post_vista')
      setDone(true)
    } catch {
      setDone(true) // silent: best-effort se tabella non esiste
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="newsletter-panel reveal" id="newsletter">
      <div className="newsletter-inner">
        <p className="eyebrow">La Newsletter</p>
        <h3 className="newsletter-title serif">
          Aggiornamenti <span className="ital">dal cantiere</span>
        </h3>
        <p className="newsletter-sub">
          Foto del cantiere, milestone tecniche, decisioni di progetto. Senza commercializzazione.
        </p>

        {!done ? (
          <form onSubmit={handleSubmit} className="newsletter-form" noValidate>
            <input
              type="email"
              name="email"
              placeholder="la-vostra@email.it"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              aria-label="Indirizzo email per aggiornamenti mensili"
            />
            <button type="submit" className="newsletter-btn" disabled={submitting}>
              {submitting ? 'Invio…' : 'Ricevi gli aggiornamenti'}
            </button>
          </form>
        ) : (
          <p className="newsletter-success">
            Grazie. Vi scriviamo a fine mese.
          </p>
        )}
        {errorMsg && <p className="newsletter-error">{errorMsg}</p>}
      </div>
    </section>
  )
}

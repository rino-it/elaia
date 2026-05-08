import { type FocusEvent, type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react'
import { sendLead, getUTM, PROJECT_ID } from '../lib/supabase'

type GtagFn = (event: string, action: string, params: Record<string, string>) => void
type FbqFn = (event: string, action: string) => void

type TaglioOption = {
  value: string
  num: string
  name: ReactNode
}

const TAGLI: TaglioOption[] = [
  { value: 'trilocale', num: '01', name: <span className="ital">Trilocale</span> },
  { value: 'quadrilocale', num: '02', name: <span className="ital">Quadrilocale</span> },
  { value: 'attico', num: '03', name: <span className="ital">Attico</span> },
  { value: 'info_generali', num: '04', name: <span className="ital">Info generali</span> },
]

type FieldName = 'nome' | 'tel' | 'email' | 'gdpr'

const validateField = (name: FieldName, value: string, gdprChecked = false): string => {
  switch (name) {
    case 'nome':
      return value.trim().length < 2 ? 'Inserisci nome e cognome' : ''
    case 'email':
      return !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value.trim())
        ? 'Email non valida'
        : ''
    case 'tel':
      return !/^[0-9+\-\s]{8,}$/.test(value.trim())
        ? 'Numero non valido (min 8 cifre)'
        : ''
    case 'gdpr':
      return !gdprChecked ? 'Devi accettare la privacy per procedere' : ''
    default:
      return ''
  }
}

export default function Lead() {
  const [taglio, setTaglio] = useState('')
  const [nome, setNome] = useState('')
  const [tel, setTel] = useState('')
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const [gdpr, setGdpr] = useState(false)
  const [preferCall, setPreferCall] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({})
  const [capitoloRequested, setCapitoloRequested] = useState(false)
  const startTimeRef = useRef<number>(0)
  const honeypotRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    startTimeRef.current = Date.now()
    if (sessionStorage.getItem('elaia_request_capitolato') === 'true') {
      setCapitoloRequested(true)
      setPreferCall(true)
    }
    const handler = () => {
      setCapitoloRequested(true)
      setPreferCall(true)
    }
    window.addEventListener('elaia:request-capitolato', handler)
    return () => window.removeEventListener('elaia:request-capitolato', handler)
  }, [])

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as FieldName
    if (name !== 'nome' && name !== 'tel' && name !== 'email') return
    const err = validateField(name, e.target.value)
    setErrors((prev) => ({ ...prev, [name]: err }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(false)

    // Validation finale
    const newErrors: Partial<Record<FieldName, string>> = {
      nome: validateField('nome', nome),
      email: validateField('email', email),
      tel: validateField('tel', tel),
      gdpr: validateField('gdpr', '', gdpr),
    }
    setErrors(newErrors)
    if (Object.values(newErrors).some(Boolean)) return

    // Anti-spam: time-trap (form completato in <2s = bot)
    const elapsed = Date.now() - startTimeRef.current
    if (elapsed < 2000) {
      setError(true)
      return
    }

    // Anti-spam: honeypot field
    if (honeypotRef.current && honeypotRef.current.value) {
      setError(true)
      return
    }

    setSubmitting(true)
    const utm = getUTM()
    const noteFinal = capitoloRequested
      ? `[RICHIESTA CAPITOLATO] ${note.trim()}`.trim()
      : note.trim() || null
    const payload = {
      project: PROJECT_ID,
      nome: nome.trim(),
      email: email.trim(),
      telefono: tel.trim(),
      taglio: taglio || null,
      note: noteFinal,
      prefer_call: preferCall,
      consenso_gdpr: gdpr,
      consenso_at: gdpr ? new Date().toISOString() : null,
      request_type: capitoloRequested ? 'capitolato' : 'info_generali',
      source: capitoloRequested ? 'landing_elaia_capitolato' : 'landing_elaia',
      page_url: typeof window !== 'undefined' ? window.location.href : null,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      ...utm,
    }

    try {
      const ok = await sendLead(payload)
      if (!ok) throw new Error('Errore invio')
      sessionStorage.removeItem('elaia_request_capitolato')
      setSuccess(true)
      const win = window as Window & { gtag?: GtagFn; fbq?: FbqFn }
      if (typeof win.gtag === 'function')
        win.gtag('event', 'conversion', { send_to: 'AW-XXX/XXX' })
      if (typeof win.fbq === 'function') win.fbq('track', 'Lead')
    } catch (err) {
      console.error(err)
      setError(true)
      setSubmitting(false)
    }
  }

  const firstName = nome.trim().split(' ')[0]

  return (
    <section className="lead" id="contatti">
      <div className="lead-inner">
        {capitoloRequested && !success && (
          <div className="lead-banner reveal">
            <span className="lead-banner__tag">Capitolato ELAIA · Su misura</span>
            <p>
              Lascia nome, telefono ed email. <strong>Quindici minuti al telefono</strong> con Massimo Brissoni (l'agenzia REMAX) per conoscerci. Poi ti invieremo il capitolato completo, già adattato alle tue esigenze.
            </p>
          </div>
        )}
        <div className="reveal">
          <div className="eyebrow">{capitoloRequested ? 'Capitolato ELAIA' : 'Prenota la tua consulenza privata'}</div>
          <h2 className="lead-title">
            {capitoloRequested ? (
              <>
                Il capitolato,
                <br />
                <span className="ital">su misura per te</span>.
              </>
            ) : (
              <>
                Un incontro,
                <br />
                <span className="ital">non una vendita</span>.
              </>
            )}
          </h2>
          <p className="lead-sub">
            {capitoloRequested
              ? 'Quindici minuti al telefono per conoscerci. Poi Massimo Brissoni (l\'agenzia REMAX) ti invia il capitolato completo — pagine di scelte tecniche e finiture, calibrate sul tuo interesse.'
              : 'Ti presentiamo il progetto, rispondiamo alle tue domande e organizziamo una visita in cantiere. Senza fretta, senza impegno.'}
          </p>
        </div>

        {!success && (
          <>
            <div className="reveal reveal-d1">
              <div
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--bronze-soft)',
                  marginBottom: '14px',
                  fontWeight: 600,
                }}
              >
                Sono interessato a
              </div>
              <div className="taglio-grid">
                {TAGLI.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    className={`taglio-card${taglio === t.value ? ' active' : ''}`}
                    onClick={() => setTaglio(t.value)}
                  >
                    <div className="tg-num">— {t.num}</div>
                    <div className="tg-name">{t.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="reveal reveal-d2" noValidate>
              <input
                ref={honeypotRef}
                type="text"
                name="website"
                className="honeypot"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="field">
                <label htmlFor="nome">Nome e Cognome*</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  required
                  autoComplete="name"
                  placeholder="Come ti chiami?"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  onBlur={handleBlur}
                  className={errors.nome ? 'has-error' : ''}
                  aria-invalid={Boolean(errors.nome)}
                  aria-describedby="nome-error"
                />
                <span className="field-error" id="nome-error">{errors.nome}</span>
              </div>

              <div className="field">
                <label htmlFor="tel">Telefono*</label>
                <input
                  type="tel"
                  id="tel"
                  name="tel"
                  required
                  autoComplete="tel"
                  placeholder="Ti richiamiamo entro 24h"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  onBlur={handleBlur}
                  className={errors.tel ? 'has-error' : ''}
                  aria-invalid={Boolean(errors.tel)}
                  aria-describedby="tel-error"
                />
                <span className="field-error" id="tel-error">{errors.tel}</span>
              </div>

              <div className="field">
                <label htmlFor="email">Email*</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="La tua email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleBlur}
                  className={errors.email ? 'has-error' : ''}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby="email-error"
                />
                <span className="field-error" id="email-error">{errors.email}</span>
              </div>

              <div className="field">
                <label htmlFor="note">Messaggio (facoltativo)</label>
                <textarea
                  id="note"
                  name="note"
                  placeholder="Hai esigenze particolari?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={500}
                />
              </div>

              <label className="checkbox">
                <input
                  type="checkbox"
                  id="gdpr"
                  name="gdpr"
                  required
                  checked={gdpr}
                  onChange={(e) => {
                    setGdpr(e.target.checked)
                    setErrors((prev) => ({ ...prev, gdpr: '' }))
                  }}
                />
                <span>
                  Acconsento al trattamento dei miei dati personali ai sensi del{' '}
                  <a href="/privacy.html" target="_blank" rel="noopener noreferrer">
                    GDPR / Privacy Policy
                  </a>{' '}
                  per essere ricontattato.*
                </span>
              </label>
              {errors.gdpr && (
                <span className="field-error" style={{ marginTop: 0 }}>
                  {errors.gdpr}
                </span>
              )}

              <label className="checkbox checkbox-secondary">
                <input
                  type="checkbox"
                  id="prefer-call"
                  name="prefer_call"
                  checked={preferCall}
                  onChange={(e) => setPreferCall(e.target.checked)}
                />
                <span>Preferisco prima una telefonata di 15 minuti.</span>
              </label>

              <button type="submit" className="submit" disabled={submitting}>
                {submitting ? (
                  'Invio in corso...'
                ) : (
                  <>
                    Richiedi appuntamento privato
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </>
                )}
              </button>

              <p className="form-note">
                Risposta garantita entro 24 ore lavorative. I tuoi dati non saranno mai condivisi con terzi.
              </p>

              {error && (
                <div className="err-msg show err-msg-fallback">
                  Si è verificato un errore. Puoi anche scriverci a{' '}
                  <a href="mailto:mbrissoni@remax.it">mbrissoni@remax.it</a> o chiamarci al{' '}
                  <a href="tel:+393332895941">+39 333 289 5941</a>.
                </div>
              )}
            </form>
          </>
        )}

        {success && (
          <div className="success show">
            <div className="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="serif">
              Grazie {firstName ? `${firstName}, ` : ''}per il tuo <span className="ital">interesse</span>
            </h3>
            <p>Ti contatteremo entro 24 ore lavorative con la brochure completa e tutti i dettagli su ELAIA.</p>

            <div className="success-next">
              <div className="success-next-title">Nel frattempo</div>
              <ul>
                <li>
                  <a
                    href="https://wa.me/393332895941?text=Ciao%2C%20vorrei%20info%20su%20ELAIA%20Ponteranica"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Scrivici su WhatsApp
                  </a>{' '}
                  per domande veloci
                </li>
                <li>
                  <a
                    href="https://maps.google.com/?q=Ponteranica+Bergamo"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Vedi la posizione
                  </a>{' '}
                  sulla mappa
                </li>
                <li>
                  <a href="tel:+393332895941">Chiama Massimo Brissoni</a>{' '}
                  (Lun–Ven · 9:00–19:30)
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

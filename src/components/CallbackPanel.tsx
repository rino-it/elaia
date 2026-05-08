import { type FormEvent, useState } from 'react'
import { requestCallback } from '../lib/supabase'

type TimeSlot = 'mattina' | 'pranzo' | 'sera'

const SLOTS: Array<{ value: TimeSlot; label: string }> = [
  { value: 'mattina', label: 'Mattina · 9–12' },
  { value: 'pranzo', label: 'Pranzo · 12–14' },
  { value: 'sera', label: 'Sera · 17–20' },
]

export default function CallbackPanel() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [slot, setSlot] = useState<TimeSlot>('mattina')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (name.trim().length < 2) {
      setErrorMsg('Inserisci nome e cognome')
      return
    }
    if (!/^[0-9+\-\s]{8,}$/.test(phone.trim())) {
      setErrorMsg('Numero di telefono non valido')
      return
    }
    setErrorMsg('')
    setSubmitting(true)
    try {
      await requestCallback(name.trim(), phone.trim(), slot)
      setDone(true)
    } catch {
      setDone(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="callback-panel reveal" id="callback">
      <div className="callback-inner">
        <p className="eyebrow">Una telefonata</p>
        <h3 className="callback-title serif">
          Quindici minuti con <span className="ital">Massimo</span>.
        </h3>
        <p className="callback-sub">
          Quando vi è comodo. Senza appuntamento commerciale, senza spiegare nulla in dieci minuti.
        </p>

        {!done ? (
          <form onSubmit={handleSubmit} className="callback-form" noValidate>
            <div className="callback-row">
              <input
                type="text"
                name="name"
                placeholder="Nome e cognome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                aria-label="Nome e cognome"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Telefono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                autoComplete="tel"
                aria-label="Numero di telefono"
              />
            </div>
            <fieldset className="callback-slots">
              <legend>Quando preferite</legend>
              {SLOTS.map((s) => (
                <label key={s.value} className={`callback-slot${slot === s.value ? ' active' : ''}`}>
                  <input
                    type="radio"
                    name="slot"
                    value={s.value}
                    checked={slot === s.value}
                    onChange={() => setSlot(s.value)}
                  />
                  <span>{s.label}</span>
                </label>
              ))}
            </fieldset>
            <button type="submit" className="callback-btn" disabled={submitting}>
              {submitting ? 'Invio…' : 'Richiedi una telefonata'}
            </button>
            {errorMsg && <p className="callback-error">{errorMsg}</p>}
          </form>
        ) : (
          <p className="callback-success">
            Grazie. Massimo vi richiama nella fascia indicata.
          </p>
        )}
      </div>
    </section>
  )
}

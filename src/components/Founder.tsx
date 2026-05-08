import { useEffect, useRef } from 'react'
import { ScrollTrigger } from '../lib/gsap'

type Chapter = {
  year: string
  title: string
  body: string
}

const CHAPTERS: Chapter[] = [
  {
    year: 'Fine anni ’60',
    title: 'L’origine — Edilvertova',
    body: 'Luigi Rinaldi avvia l’attività nella bergamasca, prima come artigiano edile, poi come piccola impresa artigiana. Da queste radici nasce Edilvertova.',
  },
  {
    year: '1987',
    title: 'A 360° nel settore edile',
    body: 'Edilvertova è una realtà consolidata sul territorio. Opera a tutto campo: residenziale, industriale, nuove costruzioni, ristrutturazioni e recuperi edilizi. La villa singola di Vertova è una testimonianza di quegli anni.',
  },
  {
    year: '2005',
    title: 'Operazioni immobiliari',
    body: 'Al gruppo si aggiunge Società Generale Iniziative Immobiliari Srl. Le competenze si ampliano: dall’edilizia pura alle operazioni immobiliari complete.',
  },
  {
    year: 'Anni 2010',
    title: 'Il passaggio',
    body: 'Il mestiere e la passione si tramandano da Luigi al figlio Giuseppe Rinaldi. Stesso metodo, nuove sfide: efficienza energetica, antisismica, certificazioni di qualità.',
  },
  {
    year: '2026',
    title: 'Home IN Evolution — EDEL Ponteranica',
    body: 'Dalla fusione tra Edilvertova e SGI Immobiliari nasce Home IN Evolution: tradizione e innovazione, progettazione su misura. EDEL Ponteranica è il primo progetto residenziale del nuovo gruppo.',
  },
]

const STATS: Array<{ value: number; suffix?: string; label: string }> = [
  { value: 60, suffix: '+', label: 'anni di mestiere' },
  { value: 87, label: 'cantieri firmati' },
  { value: 12, label: 'unità EDEL' },
]

function useCounter(targetRef: React.RefObject<HTMLElement | null>, target: number) {
  useEffect(() => {
    const el = targetRef.current
    if (!el) return

    let started = false
    let raf = 0

    const animate = (start: number) => (ts: number) => {
      const elapsed = ts - start
      const duration = 1400
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(target * eased)
      el.textContent = String(current)
      if (progress < 1) raf = requestAnimationFrame(animate(start))
    }

    const trigger = () => {
      if (started) return
      started = true
      const start = performance.now()
      raf = requestAnimationFrame(animate(start))
    }

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              trigger()
              obs.disconnect()
            }
          })
        },
        { threshold: 0.4 }
      )
      obs.observe(el)
      return () => {
        obs.disconnect()
        if (raf) cancelAnimationFrame(raf)
      }
    } else {
      trigger()
      return () => {
        if (raf) cancelAnimationFrame(raf)
      }
    }
  }, [targetRef, target])
}

function StatItem({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLElement>(null)
  useCounter(ref, value)
  return (
    <li>
      <strong className="founder__stats-value">
        <span ref={ref} className="founder__stats-num">0</span>
        {suffix && <span className="founder__stats-suffix">{suffix}</span>}
      </strong>
      <span className="founder__stats-label">{label}</span>
    </li>
  )
}

export default function Founder() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = sectionRef.current
    if (!root) return

    const chapters = root.querySelectorAll<HTMLElement>('.founder__chapter')
    const lineFill = root.querySelector<HTMLElement>('.founder__chapters-line-fill')
    const chaptersList = root.querySelector<HTMLElement>('.founder__chapters')
    if (!chapters.length || !lineFill || !chaptersList) return

    const triggers: ReturnType<typeof ScrollTrigger.create>[] = []

    triggers.push(
      ScrollTrigger.create({
        trigger: chaptersList,
        start: 'top 75%',
        end: 'bottom 75%',
        scrub: 0.5,
        onUpdate: (self) => {
          lineFill.style.height = `${self.progress * 100}%`
        },
      })
    )

    chapters.forEach((el) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: 'top 78%',
          once: true,
          onEnter: () => el.classList.add('is-on'),
        })
      )
    })

    return () => {
      triggers.forEach((t) => t.kill())
      chapters.forEach((el) => el.classList.add('is-on'))
      lineFill.style.height = '100%'
    }
  }, [])

  return (
    <section className="founder" id="founder" ref={sectionRef}>
      <div className="founder__inner">
        <header className="founder__header">
          <p className="eyebrow">Famiglia Rinaldi · Dal 1968</p>
          <h2 className="founder__title">
            Sessant'anni di mestiere edile a Bergamo.
          </h2>
        </header>

        <figure className="founder__photo">
          <img
            src="/images/founder/luigi-1971.jpg"
            alt="Cantiere Rinaldi, Bergamo, primavera 1971"
            loading="lazy"
          />
          <figcaption>Cantiere Rinaldi, Bergamo, primavera 1971.</figcaption>
        </figure>

        <ol className="founder__chapters" aria-label="Storia della famiglia Rinaldi">
          <span className="founder__chapters-line" aria-hidden="true">
            <span className="founder__chapters-line-fill" />
          </span>
          {CHAPTERS.map((c) => (
            <li key={c.year} className="founder__chapter">
              <div className="founder__chapter-marker">
                <span className="founder__chapter-dot" aria-hidden="true" />
              </div>
              <div className="founder__chapter-body">
                <span className="founder__chapter-year">{c.year}</span>
                <h3 className="founder__chapter-title">{c.title}</h3>
                <p className="founder__chapter-text">{c.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <blockquote className="founder__quote">
          <p>
            "Una casa è fatta bene quando dura cinquant'anni senza chiedere scuse. È il nostro standard, dalla famiglia Rinaldi."
          </p>
        </blockquote>

        <ul className="founder__stats">
          {STATS.map((s) => (
            <StatItem key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </ul>
      </div>
    </section>
  )
}

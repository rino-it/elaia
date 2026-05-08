export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-col">
          <span className="footer-logo-wordmark">ELAIA</span>
          <p>Residenza Ponteranica · Bergamo</p>
          <div className="footer-col-line" />
          <p className="footer-meta">7 residenze in classe A4 con vista sul Parco dei Colli</p>
        </div>

        <div className="footer-col">
          <div className="footer-col-heading">Commercializzato da</div>
          <img className="footer-agency-img" src="/logo-remax.svg" alt="RE/MAX Expo Italia" loading="lazy" />
          <p>Massimo Brissoni</p>
          <p>Piazza Don Sergio Colombo, 4</p>
          <p>24124 Bergamo (BG)</p>
          <div className="footer-col-line" />
          <p>
            <a href="tel:+393332895941">+39 333 289 5941</a>
          </p>
          <p>
            <a href="mailto:mbrissoni@remax.it">mbrissoni@remax.it</a>
          </p>
          <p>
            <a
              href="https://wa.me/393332895941"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </p>
          <p className="footer-meta">Lun–Ven · 9:00–19:30</p>
        </div>

        <div className="footer-col footer-col-legal">
          <p className="footer-meta">© 2026 ELAIA Residenza — Tutti i diritti riservati.</p>
          <p className="footer-meta">
            Le immagini sono render di progetto a scopo illustrativo.
          </p>
          <p className="footer-meta">
            <a href="/privacy.html" target="_blank" rel="noopener noreferrer">
              Privacy
            </a>
            {' · '}Cookie · GDPR
          </p>
          <div className="footer-col-line" />
          <p className="footer-meta">
            Commercializzazione esclusiva RE/MAX Expo Italia
          </p>
          <p className="footer-meta">
            ELAIA Ponteranica · P.IVA [TBD]
          </p>
        </div>
      </div>
    </footer>
  )
}

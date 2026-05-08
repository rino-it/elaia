const PLACES: Array<[string, string, string]> = [
  ['01', 'Bergamo centro', '5 min'],
  ['02', 'Aeroporto Orio al Serio', '15 min'],
  ['03', 'Milano (A4)', '45 min'],
  ['04', 'Parco dei Colli', 'a piedi'],
]

export default function Location() {
  return (
    <section className="location" id="location">
      <div className="location-inner">
        <div className="reveal">
          <div className="eyebrow">La Posizione</div>
          <h2 className="section-title">
            A cinque minuti da tutto.
            <br />
            <span className="ital">Lontano dal caos</span>.
          </h2>
          <p className="location-address">Ponteranica (BG) · Vista Parco dei Colli</p>
          <p className="location-text">
            Ponteranica unisce la tranquillità delle colline alla vicinanza ai servizi di Bergamo. Centro storico, ospedale Papa Giovanni XXIII, Aeroporto di Orio al Serio, casello A4 verso Milano: tutto a portata di mano. Scuole e servizi in paese, Parco dei Colli a piedi.
          </p>
        </div>
        <ul className="loc-list reveal reveal-d1">
          {PLACES.map(([num, name, time]) => (
            <li key={num} className="loc-row">
              <span className="loc-num">{num}</span>
              <span className="loc-name serif">{name}</span>
              <span className="loc-time">{time}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

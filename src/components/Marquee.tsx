const ITEMS = [
  '7 residenze',
  '85–150 m²',
  'classe A4',
  'Ponteranica',
  'Bergamo',
  'vista Parco dei Colli',
]

export default function Marquee() {
  const doubled = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS]
  return (
    <div className="marquee">
      <div className="marquee-track">
        {doubled.map((it, i) => (
          <span key={i} className="marquee-item">
            {it}
          </span>
        ))}
      </div>
    </div>
  )
}

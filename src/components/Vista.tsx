export default function Vista() {
  return (
    <section className="vista reveal" id="vista">
      <div className="vista-bg">
        <picture>
          <source srcSet="/images/vista/vista-panoramica_mobile.webp" media="(max-width: 768px)" />
          <img
            src="/images/vista/vista-panoramica.webp"
            alt="Vista panoramica ELAIA — Parco dei Colli e Bergamo Alta in lontananza"
            loading="lazy"
          />
        </picture>
      </div>
      <div className="vista-content">
        <p className="vista-eyebrow">La vista</p>
        <h2 className="vista-title">
          Il Parco dei Colli, <span className="ital">tutto attorno</span>.
        </h2>
        <p className="vista-body">
          A Ponteranica la collina inizia dove la città finisce. Cinque minuti dal centro di Bergamo. Il silenzio dei colli a portata di sguardo.
        </p>
      </div>
    </section>
  )
}

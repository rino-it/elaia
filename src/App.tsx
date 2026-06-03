import { SmoothScrollProvider } from './providers/SmoothScrollProvider'
import { useRevealObserver } from './hooks/useRevealObserver'
import Progress from './components/Progress'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Statement from './components/Statement'
import Vista from './components/Vista'
import NewsletterPanel from './components/NewsletterPanel'
import TimesOfDay from './components/TimesOfDay'
import Bento from './components/Bento'
import Units from './components/Units'
import Location from './components/Location'
import Finishes from './components/Finishes'
import CallbackPanel from './components/CallbackPanel'
import FAQ from './components/FAQ'
import Lead from './components/Lead'
import Footer from './components/Footer'

function AppInner() {
  useRevealObserver()
  return (
    <>
      <Progress />
      <Nav />
      <Hero />
      <Marquee />
      <Statement />
      <Vista />
      <NewsletterPanel />
      <TimesOfDay />
      <Bento />
      <Units />
      <Location />
      <Finishes />
      <CallbackPanel />
      <FAQ />
      <Lead />
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <SmoothScrollProvider>
      <AppInner />
    </SmoothScrollProvider>
  )
}

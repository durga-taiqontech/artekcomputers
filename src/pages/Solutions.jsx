import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import { solutions } from '../data/solutions'
import { PHONE, PHONE_LINK } from '../constants'

export default function Solutions() {
  return (
    <>
      <Seo
        title="IT and Security Solutions in Dubai | Artek Computers LLC"
        description="CCTV, IT services, networking, cybersecurity, cloud, Microsoft, computer systems, telephony and data center relocation for businesses in Dubai and the UAE."
        path="/solutions"
      />

      <section className="hero-band sol-list-hero">
        <div className="wrap">
          <Breadcrumbs tone="light" items={[{ name: 'Home', to: '/' }, { name: 'Solutions' }]} />
          <h1>IT and security solutions in Dubai</h1>
          <p className="lead">
            Ten services from one company, supplied, installed and supported by Artek Computers LLC.
          </p>
        </div>
      </section>

      <section className="sol-sec" aria-labelledby="sol-h">
        <div className="wrap">
          <h2 id="sol-h" className="sr-only">Our solutions</h2>
          <div className="sol-grid">
            {solutions.map((s) => (
              <Link className="sol-lcard hover-card" key={s.slug} to={`/solutions/${s.slug}`} aria-label={`Learn more about ${s.title}`}>
                <h3>{s.title}</h3>
                <p>{s.blurb}</p>
                <span className="sol-more">Learn more</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="closing sol-list-closing">
        <div className="wrap">
          <h2>Not sure which service you need?</h2>
          <p>Tell us about your business and we will point you to the right solution.</p>
          <div className="hero-btns">
            <a className="btn white" href={PHONE_LINK}>Call {PHONE}</a>
            <Link className="btn outline" to="/contact">Send an enquiry</Link>
          </div>
        </div>
      </section>
    </>
  )
}

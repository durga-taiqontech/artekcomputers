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

      <section className="hero-band">
        <div className="wrap">
          <Breadcrumbs tone="light" items={[{ name: 'Home', to: '/' }, { name: 'Solutions' }]} />
          <h1>IT and security solutions in Dubai</h1>
          <p className="lead">
            Nine services from one company, supplied, installed and supported by Artek Computers LLC.
          </p>
        </div>
      </section>

      <section className="sol-sec" aria-labelledby="sol-h">
        <div className="wrap">
          <h2 id="sol-h" className="sr-only">Our solutions</h2>
          <div className="ac-grid">
            {solutions.map((s) => (
              <div className="ac-card prod" key={s.slug}>
                <h3>{s.title}</h3>
                <p>{s.blurb}</p>
                <div className="card-links">
                  <Link className="enq" to={`/solutions/${s.slug}`}>Learn more about {s.title}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="closing">
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

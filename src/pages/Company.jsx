import { Link } from 'react-router-dom'
import { FaCheck } from 'react-icons/fa'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import { PHONE, PHONE_LINK } from '../constants'

const proof = [
  'IT integrated systems company',
  'Authorized dealer of leading brands',
  'Residential to corporate',
  'Computer Street, Bur Dubai',
]
const glance = [
  'Established in the United Arab Emirates',
  'IT integrated systems company',
  'Residential to corporate customers',
  'Authorized dealer of leading brands',
  'Computer Street, Bur Dubai',
]

const mission = [
  'To contribute outstanding value to clients, employees, vendors and society at large.',
  'To build long-term partnerships with enthusiastically satisfied customers.',
  'To expand our business and technology leadership position.',
  'To become an incredibly easy company to do business with, through a culture of customer service.',
]

const values = [
  'An environment of fairness, honesty, courtesy and appreciation.',
  'A solid foundation for learning and growth, developing ourselves to the highest standards.',
  'Attention to consistency, detail and planning, and excellence in execution.',
  'Excitement about technology, and the ability to turn it into business value.',
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  mainEntity: {
    '@type': 'Organization',
    name: 'Artek Computers LLC',
    url: 'https://artekcomputer.com',
    telephone: '+971 4 379 7128',
    email: 'info@artekteam.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'P.O Box 112280, Al Rafa Road, Computer Street',
      addressLocality: 'Bur Dubai, Dubai',
      addressCountry: 'AE',
    },
    slogan: 'Transforming Ideas',
  },
}

export default function Company() {
  return (
    <>
      <Seo
        title="About Artek Computers LLC | IT Integrated Systems Company in Dubai"
        description="Artek Computers LLC is an IT integrated systems company in Dubai, UAE, providing computers, networks, cabling, CCTV, ELV and support for customers from residential to corporate."
        path="/company"
        jsonLd={jsonLd}
      />

      <section className="hero-band">
        <div className="wrap">
          <Breadcrumbs tone="light" items={[{ name: 'Home', to: '/' }, { name: 'Company' }]} />
          <h1>About Artek Computers LLC</h1>
          <p className="lead">
            An IT integrated systems company in Dubai, providing end-to-end technology solutions for customers
            from residential to corporate.
          </p>
          <ul className="proof">
            {proof.map((item) => (
              <li key={item}>
                <FaCheck aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="about" aria-labelledby="about-h">
        <div className="wrap about-cols">
          <div className="prose">
            <h2 id="about-h">Who we are</h2>
            <p>
              Artek Computers LLC is an IT integrated systems company established in the United Arab Emirates.
              We provide end-to-end solutions supporting the most advanced information technologies:{' '}
              <Link to="/solutions/computer-systems" className="prose-link">computer systems (hardware and software)</Link>,
              computer accessories and consumables,{' '}
              <Link to="/solutions/network-solutions" className="prose-link">networks and telecommunications</Link>,{' '}
              <Link to="/solutions/network-solutions" className="prose-link">intelligent cabling</Link>, printers,
              cartridges and toners,{' '}
              <Link to="/solutions/elv-access-control" className="prose-link">ELV systems</Link> and
              application software solutions. We provide services from residential to corporate customers.
            </p>
            <p>
              Whatever your needs, wherever you are, we can help. We supply new parts, options, replacements,
              upgrades and complete units for{' '}
              <Link to="/products#computers" className="prose-link">branded PCs, desktops, laptops, servers</Link>,
              printers, toners,{' '}
              <Link to="/solutions/voice-telephony" className="prose-link">PABX</Link> and{' '}
              <Link to="/solutions/elv-access-control" className="prose-link">biometric access control</Link>.
              We help you cut lead times and reduce costs, with packages tailored to a company like yours.
            </p>
          </div>
          <div className="glance-card hover-card">
            <h3>At a glance</h3>
            <ul>
              {glance.map((item) => (
                <li key={item}>
                  <FaCheck aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="vm" aria-labelledby="mv-h">
        <div className="wrap">
          <h2 id="mv-h" className="sr-only">Mission and vision</h2>
          <div className="vm-grid">
            <div className="vm-card hover-card">
              <h3>Our mission</h3>
              <ul>
                {mission.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div className="vm-card hover-card">
              <h3>Our vision</h3>
              <p>
                To be a respected and agile corporation that continuously enhances the value we provide through
                best-of-breed business solutions, delivered by best-in-class people.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="values-sec" aria-labelledby="values-h">
        <div className="wrap">
          <h2 id="values-h">Our values and commitment</h2>
          <div className="values-cols">
            <div>
              <h3>Our values</h3>
              <ul className="values-list">
                {values.map((item) => (
                  <li key={item}>
                    <FaCheck aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Our commitment</h3>
              <p className="values-p">
                We continuously seek new technologies and concepts to keep our customers at the forefront of
                technology. Our research and development section explores new solutions that increase the
                efficiency, professionalism and profitability of the companies we serve.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="co-offer" aria-labelledby="co-offer-h">
        <div className="wrap">
          <h2 id="co-offer-h">What we offer</h2>
          <div className="co-offer-grid">
            <Link to="/solutions" className="hover-card co-offer-card">
              <h3>Solutions</h3>
              <p>Ten services from one company: CCTV, ELV and access control, IT support, networking, cloud, telephony and more.</p>
            </Link>
            <Link to="/products" className="hover-card co-offer-card">
              <h3>Products</h3>
              <p>Cables, networking, computers and security equipment, supplied and supported.</p>
            </Link>
            <Link to="/brands" className="hover-card co-offer-card">
              <h3>Brands</h3>
              <p>Technology from the brands your business already trusts.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="closing">
        <div className="wrap">
          <h2>Talk to Artek Computers LLC</h2>
          <p>Tell us what your business needs. We will recommend the right solution and quote clearly.</p>
          <div className="hero-btns">
            <a className="btn white" href={PHONE_LINK}>Call {PHONE}</a>
            <Link className="btn outline" to="/contact">Send an enquiry</Link>
          </div>
        </div>
      </section>
    </>
  )
}

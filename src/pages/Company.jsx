import { Link } from 'react-router-dom'
import { FaCheck } from 'react-icons/fa'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import { brandGroups } from '../data/catalog'


const mission = [
  'To contribute outstanding value to clients, employees, vendors and society at large.',
  'To build long-term partnerships with enthusiastically satisfied customers.',
  'To expand our business and technology leadership position.',
  'To become an incredibly easy company to do business with, through a culture of customer service.',
]


// Optional photo hero: only rendered when a matching file exists in src/assets/company/.
const heroPhoto = import.meta.glob('../assets/company/about-hero.{webp,jpg,jpeg,png}', { eager: true, import: 'default' })
const heroPhotoSrc = Object.values(heroPhoto)[0]

// First four brand group names, straight from the catalogue data.
const coreLines = brandGroups.slice(0, 4).map((g) => g.title).join(', ')

const why = [
  'One source for IT hardware, cabling, security and telephony.',
  'Authorized distributor and dealer of leading brands.',
  'Supply, installation and support from one team.',
  'Packages tailored to your company.',
  'Help to cut lead times and reduce costs.',
  'Customers from residential to corporate.',
  'Located on Computer Street, Bur Dubai.',
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
        description="Artek Computers LLC is an IT integrated systems company in Dubai supplying computers, networking, cabling, CCTV and ELV products for customers from residential to corporate."
        path="/company"
        jsonLd={jsonLd}
      />

      <section className="hero-band company-hero">
        {heroPhotoSrc && (
          <img
            className="company-hero-img"
            src={heroPhotoSrc}
            alt=""
            loading="eager"
            decoding="async"
            fetchPriority="high"
            width="1920"
            height="700"
          />
        )}
        {heroPhotoSrc && <div className="company-hero-shade" aria-hidden="true" />}
        <div className="company-breadcrumb">
          <Breadcrumbs tone="light" items={[{ name: 'Home', to: '/' }, { name: 'Company' }]} />
        </div>
        <div className="wrap company-hero-wrap">
          <p className="company-kicker">About Artek Computers LLC</p>
          <h1>One trusted source for IT, ELV and security products</h1>
        </div>
      </section>

      <section className="company-band company-band--white" aria-labelledby="about-h">
        <div className="wrap">
          <h2 id="about-h" className="company-h2">Who we are</h2>
          <div className="company-bar" aria-hidden="true" />
          <div className="company-prose">
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
        </div>
      </section>

      <section className="company-band company-band--grey" aria-labelledby="lines-h">
        <div className="wrap">
          <h2 id="lines-h" className="company-h2">Our core lines of business</h2>
          <div className="company-bar" aria-hidden="true" />
          <p className="company-lines-p">
            Our main lines of business include {coreLines}, together with computers, storage and
            peripherals from leading brands.
          </p>
          <Link className="company-btn" to="/brands">See all brands</Link>
        </div>
      </section>

      <section className="company-band company-band--white" aria-labelledby="mv-h">
        <div className="wrap">
          <h2 id="mv-h" className="sr-only">Mission and vision</h2>
          <div className="company-cards">
            <div className="company-card hover-card">
              <h3>Our mission</h3>
              <ul>
                {mission.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div className="company-card hover-card">
              <h3>Our vision</h3>
              <p>
                To be a respected and agile corporation that continuously enhances the value we provide through
                best-of-breed business solutions, delivered by best-in-class people.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="company-band company-band--grey" aria-labelledby="why-h">
        <div className="wrap">
          <h2 id="why-h" className="company-h2">Why customers choose Artek</h2>
          <div className="company-bar" aria-hidden="true" />
          <p className="company-intro">Here is how we work with every customer.</p>
          <ul className="values-list company-why">
            {why.map((item) => (
              <li key={item}>
                <FaCheck aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

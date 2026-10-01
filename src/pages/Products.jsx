import { Link } from 'react-router-dom'
import {
  FaCloud,
  FaDesktop,
  FaHeadset,
  FaLaptop,
  FaMobileAlt,
  FaNetworkWired,
  FaPhotoVideo,
  FaPrint,
  FaServer,
  FaShieldAlt,
} from 'react-icons/fa'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import { PHONE, PHONE_LINK } from '../constants'

const categories = [
  {
    slug: 'networking',
    title: 'Networking and network infrastructure',
    icon: FaNetworkWired,
    text: 'Routers, switches, Wi-Fi, structured cabling and fibre optic networks, designed and installed for offices and commercial buildings.',
  },
  {
    slug: 'servers',
    title: 'Servers and data centers',
    icon: FaServer,
    text: 'Enterprise servers, virtualization and storage, plus data center setup and relocation.',
  },
  {
    slug: 'desktops',
    title: 'Desktops and workstations',
    icon: FaDesktop,
    text: 'Business desktops and engineering workstations, from everyday office PCs to high-performance machines.',
  },
  {
    slug: 'laptops',
    title: 'Laptops and computer services',
    icon: FaLaptop,
    text: 'Laptop sales, repairs, upgrades and maintenance for business and personal use.',
  },
  {
    slug: 'printers',
    title: 'Printers and cartridges',
    icon: FaPrint,
    text: 'Printers, scanners and genuine cartridges, with sales, rental and maintenance.',
  },
  {
    slug: 'mobile-devices',
    title: 'Smartphones, tablets and mobile devices',
    icon: FaMobileAlt,
    text: 'Business smartphones, tablets and iPads, with setup, configuration and mobile device management.',
  },
  {
    slug: 'cybersecurity',
    title: 'Cybersecurity',
    icon: FaShieldAlt,
    text: 'Firewalls, antivirus, threat detection and security audits to protect your business data.',
  },
  {
    slug: 'it-support',
    title: 'IT support and maintenance',
    icon: FaHeadset,
    text: '24/7 technical support, system maintenance, troubleshooting and managed IT services.',
  },
  {
    slug: 'audio-visual',
    title: 'Audio visual systems',
    icon: FaPhotoVideo,
    text: 'Video conferencing, presentation systems, digital signage and meeting room technology.',
    alt: { to: '/elv-access-control', label: 'See our ELV and AV solutions' },
  },
  {
    slug: 'cloud',
    title: 'Cloud computing',
    icon: FaCloud,
    text: 'Cloud migration, storage, backup and SaaS implementation.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: categories.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: { '@type': 'Thing', name: c.title, description: c.text },
    })),
  },
  publisher: {
    '@type': 'Organization',
    name: 'Artek Computers LLC',
    telephone: '+971 4 379 7128',
    email: 'info@artekteam.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'P.O Box 112280, Al Rafa Road, Computer Street',
      addressLocality: 'Bur Dubai, Dubai',
      addressCountry: 'AE',
    },
  },
}

export default function Products() {
  return (
    <>
      <Seo
        title="IT Products in Dubai for Businesses | Networking, Servers, Laptops, Printers | Artek Computers LLC"
        description="IT products and services in Dubai and across the UAE: networking, servers, desktops, laptops, printers, mobile devices, cybersecurity, AV and cloud. Supplied, configured and supported by Artek Computers LLC."
        path="/products"
        jsonLd={jsonLd}
      />

      <section className="hero-band">
        <div className="wrap">
          <Breadcrumbs tone="light" items={[{ name: 'Home', to: '/' }, { name: 'Products' }]} />
          <h1>IT products in Dubai for growing businesses</h1>
          <p className="lead">
            From networking and servers to laptops, printers and cybersecurity, Artek Computers LLC supplies,
            configures and supports the technology your business runs on.
          </p>
          <div className="hero-btns">
            <a className="btn white" href={PHONE_LINK}>Call {PHONE}</a>
            <Link className="btn outline" to="/contact">Get a free quote</Link>
          </div>
        </div>
      </section>

      <section className="prod-sec" aria-labelledby="prod-h">
        <div className="wrap">
          <h2 id="prod-h">What we supply and support</h2>
          <div className="ac-grid">
            {categories.map((c) => (
              <div key={c.slug} className="ac-card prod hover-card">
                <c.icon aria-hidden="true" />
                <h3>{c.title}</h3>
                <p>{c.text}</p>
                <div className="card-links">
                  <Link className="enq" to={`/contact?service=${c.slug}`}>Enquire about {c.title}</Link>
                  {c.alt && <Link className="alt" to={c.alt.to}>{c.alt.label}</Link>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="closing">
        <div className="wrap">
          <h2>Not sure what your business needs?</h2>
          <p>
            Tell us about your office or site. We will recommend the right equipment, quote clearly and handle
            installation and support.
          </p>
          <div className="hero-btns">
            <a className="btn white" href={PHONE_LINK}>Call {PHONE}</a>
            <Link className="btn outline" to="/contact">Get a free quote</Link>
          </div>
        </div>
      </section>
    </>
  )
}

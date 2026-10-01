import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  FaBuilding,
  FaCheck,
  FaCheckCircle,
  FaCloud,
  FaDesktop,
  FaHome,
  FaNetworkWired,
  FaPhoneAlt,
  FaShieldAlt,
  FaTools,
  FaTruck,
  FaVideo,
  FaWarehouse,
  FaWindows,
} from 'react-icons/fa'
import Seo from '../components/Seo'
import { solutionSlugs } from '../data/solutions'
import { PHONE, PHONE_LINK } from '../constants'
import reception from '../assets/cameras/reception.jpg'
import serverRoom from '../assets/cameras/server-room.jpg'
import warehouse from '../assets/cameras/warehouse.jpg'
import carPark from '../assets/cameras/car-park.jpg'

const proof = [
  'Authorized dealer of leading brands',
  'Residential to corporate',
  'End-to-end solutions',
  'Computer Street, Bur Dubai',
  'Service level agreements',
]

const brands = [
  'Dell', 'HP', 'Apple', 'Lenovo', 'Microsoft', 'Acer', 'ASUS', 'Samsung', 'Intel',
  'Fortinet', 'Kaspersky', 'Symantec', 'Synology', 'QNAP', 'TP-Link', 'D-Link', 'Linksys',
  'Epson', 'Brother', 'Logitech', 'Hikvision', 'Dahua',
]

const serve = [
  { icon: FaBuilding, title: 'Corporate offices', text: 'Networks, computers, telephony and support for offices of every size.' },
  { icon: FaWarehouse, title: 'Warehouses and commercial buildings', text: 'Cabling, CCTV and access control for larger sites.' },
  { icon: FaHome, title: 'Homes and villas', text: 'Security cameras and connectivity for residential properties.' },
]

const cameras = [
  { cam: 'CAM 01', label: 'Reception', img: reception, view: 'CCTV view of the reception desk and entrance' },
  { cam: 'CAM 02', label: 'Server room', img: serverRoom, view: 'CCTV view of server racks in the server room' },
  { cam: 'CAM 03', label: 'Warehouse', img: warehouse, view: 'CCTV view of the warehouse' },
  { cam: 'CAM 04', label: 'Car park', img: carPark, view: 'CCTV view of the car park' },
]

const solutions = [
  {
    icon: FaVideo,
    title: 'CCTV & Security Systems',
    text: 'SIRA-compliant CCTV design, supply and installation, with the approval process handled for you.',
    cls: 'feature',
    slug: 'cctv-security',
    check: [
      'Installation and maintenance',
      'Access control and video storage',
      'Annual maintenance contracts',
    ],
  },
  {
    icon: FaCloud,
    title: 'Cloud Computing',
    text: 'Cloud migration, backup and storage.',
    cls: 'cloud',
    slug: 'cloud-computing',
    check: [
      'Public, private and hybrid cloud',
      'Cloud integration with your systems',
      'Outsourced helpdesk and infrastructure management',
    ],
  },
  {
    icon: FaTools,
    title: 'IT Services',
    text: 'Managed IT support, AMC contracts and onsite helpdesk cover for businesses across Dubai.',
    cls: 'wide',
    slug: 'it-services',
  },
  { icon: FaWindows, title: 'Microsoft Solutions', text: 'Microsoft 365, Azure and licensing, deployed and migrated for you.', slug: 'microsoft-solutions' },
  { icon: FaDesktop, title: 'Computer Systems', text: 'Workstations, servers and POS hardware supplied and configured.', slug: 'computer-systems' },
  { icon: FaNetworkWired, title: 'Network Solutions', text: 'Structured cabling, switching and office Wi-Fi design.', slug: 'network-solutions' },
  { icon: FaPhoneAlt, title: 'Voice & Telephony', text: 'IP PBX and business phone systems, installed and maintained.', slug: 'voice-telephony' },
  { icon: FaTruck, title: 'Data Center Relocation', text: 'Server room and rack moves, planned to keep downtime as short as possible.', slug: 'data-center-relocation' },
  { icon: FaShieldAlt, title: 'CyberSecurity', text: 'Firewalls, endpoint protection and secure video storage.', slug: 'cybersecurity' },
]

function useDubaiTime() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Dubai', hour12: false })
}

function MonitorWall() {
  const time = useDubaiTime()
  return (
    <div className="wall" aria-label="CCTV monitor wall showing four live camera feeds">
      <div className="tiles">
        {cameras.map((c) => (
          <div key={c.cam} className="tile" aria-label={c.view} role="img">
            <span
              className="photo"
              aria-hidden="true"
              style={{ backgroundImage: `url(${c.img}), linear-gradient(180deg,#16233a,#0d1728)` }}
            />
            <span className="scrim" aria-hidden="true" />
            <span className="cam">{c.cam} {c.label}</span>
            <span className="rec">REC</span>
            <time dateTime={time}>{time} GST</time>
          </div>
        ))}
      </div>
      <p className="wall-status">
        <FaCheckCircle aria-hidden="true" />
        CCTV and access control, installed and supported by one team
      </p>
    </div>
  )
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness'],
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
  areaServed: 'United Arab Emirates',
}

const faqs = [
  { q: 'What does Artek Computers do?', a: 'Artek Computers LLC is an IT integrated systems company. We supply and support computers, networks, CCTV, cabling, telephony and cloud services for customers from residential to corporate.' },
  { q: 'Where are you based?', a: 'On Computer Street, Bur Dubai, and we serve businesses across the UAE.' },
  { q: 'Are you an authorized dealer of the brands you supply?', a: 'We are an authorized distributor and dealer of leading IT and telecommunications brands. See the list above.' },
  { q: 'Can you handle CCTV, networking and IT support together?', a: 'Yes. One team plans, installs and supports all of them, so your systems work together.' },
  { q: 'How do I get a quote?', a: 'Call +971 4 379 7128 or send an enquiry. We will ask about your site and requirements, then quote clearly.' },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
 }

export default function Home() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location.hash])

  return (
    <>
      <Seo
        title="IT Solutions, CCTV and Networking in Dubai | Artek Computers LLC"
        description="Artek Computers LLC is an IT integrated systems company in Dubai: computers, networking, CCTV, cabling, cloud, telephony and support for customers from residential to corporate."
        path="/"
        jsonLd={[orgJsonLd, faqJsonLd]}
      />
      <section className="hero">
        <div className="wrap">
          <div className="hero-in">
            <div>
              <h1>IT solutions, CCTV and networking for businesses in Dubai</h1>
              <p className="lead">
                Artek Computers LLC is an IT integrated systems company. We provide end-to-end solutions,
                from computers and networks to CCTV, cabling and cloud, for customers from residential to corporate.
              </p>
              <div className="hero-btns">
                <a className="btn white" href={PHONE_LINK}>Call {PHONE}</a>
                <Link className="btn outline" to="/contact">Request a free quote</Link>
              </div>
            </div>
            <MonitorWall />
          </div>
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

      <section className="services" id="solutions">
        <div className="wrap">
          <h2>Our IT and security solutions in Dubai</h2>
          <div className="bento">
            {solutions.map((s) => {
              const to = s.slug && solutionSlugs.has(s.slug) ? `/solutions/${s.slug}` : null
              const cls = `bt${s.cls ? ` ${s.cls}` : ''}`
              const body = (
                <>
                  <s.icon aria-hidden="true" />
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  {s.check && (
                    <ul className="check">
                      {s.check.map((item) => (
                        <li key={item}>
                          <FaCheck aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )
              return to
                ? <Link key={s.title} to={to} className={cls}>{body}</Link>
                : <div key={s.title} className={cls}>{body}</div>
            })}
          </div>
        </div>
      </section>

      <section className="brands-home" aria-labelledby="brands-h">
        <div className="wrap">
          <h2 id="brands-h">Authorized dealer of leading brands</h2>
          <p className="intro">We supply and support technology from the brands your business already trusts.</p>
          <div className="brand-pills">
            {brands.map((brand) => <span key={brand}>{brand}</span>)}
          </div>
        </div>
      </section>

      <section className="serve" aria-labelledby="serve-h">
        <div className="wrap">
          <h2 id="serve-h">Who we serve</h2>
          <div className="ac-grid">
            {serve.map((s) => (
              <div className="ac-card" key={s.title}>
                <s.icon aria-hidden="true" />
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
          <p className="serve-note">Based on Computer Street, Bur Dubai, and serving businesses across Dubai, Abu Dhabi and the UAE.</p>
        </div>
      </section>

      <section className="faq-sec" aria-labelledby="faq-h">
        <div className="wrap">
          <h2 id="faq-h">Common questions</h2>
          <div className="faq">
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="closing">
        <div className="wrap">
          <h2>Ready to talk about your IT or security needs?</h2>
          <p>Call us or send an enquiry. We will recommend the right solution and quote clearly.</p>
          <div className="hero-btns">
            <a className="btn white" href={PHONE_LINK}>Call {PHONE}</a>
            <Link className="btn outline" to="/contact">Request a free quote</Link>
          </div>
        </div>
      </section>
    </>
  )
}

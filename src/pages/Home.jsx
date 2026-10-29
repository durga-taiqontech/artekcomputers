import { Fragment, lazy, Suspense, useEffect, useState } from 'react'
import { motion, useReducedMotion, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  FaBuilding,
  FaCheck,
  FaCloud,
  FaDesktop,
  FaHome,
  FaMapMarkerAlt,
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
import { PHONE, PHONE_LINK, COMPANY_NAME_AR } from '../constants'

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
  { icon: FaBuilding, title: 'Corporate offices', text: 'Networks, computers, telephony and support for offices of every size.', img: '/images/serve/corporate.webp', alt: 'Corporate office with structured network cabling and IT equipment in Dubai' },
  { icon: FaWarehouse, title: 'Warehouses and commercial buildings', text: 'Cabling, CCTV and access control for larger sites.', img: '/images/serve/warehouse.webp', alt: 'Warehouse interior with CCTV and access control coverage in Dubai' },
  { icon: FaHome, title: 'Homes and villas', text: 'Security cameras and connectivity for residential properties.', img: '/images/serve/villa.webp', alt: 'Villa exterior with security cameras and home networking in Dubai' },
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

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness'],
  name: 'Artek Computers LLC',
  alternateName: COMPANY_NAME_AR,
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

/* ---------- Hero animation helpers (framer-motion only) ---------- */

const headlineWords = 'IT solutions, CCTV and networking for businesses in Dubai'.split(' ')

const wordVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.12, duration: 0.5, ease: 'easeOut' },
  }),
}

const proofVariants = {
  hidden: { opacity: 0 },
  visible: (i) => ({
    opacity: 1,
    transition: { delay: 1.1 + i * 0.15, duration: 0.5 },
  }),
}

function GlowBlobs({ reduced }) {
  const drift = (x, y, s, d) =>
    reduced
      ? {}
      : {
          animate: { x: [0, x, 0], y: [0, y, 0], scale: [1, s, 1] },
          transition: { duration: d, repeat: Infinity, ease: 'easeInOut' },
        }

  return (
    <>
      <motion.div className="hero-glow g1" aria-hidden="true" {...drift(60, 40, 1.15, 16)} />
      <motion.div className="hero-glow g2" aria-hidden="true" {...drift(-50, -30, 1.1, 19)} />
      <motion.div className="hero-glow g3" aria-hidden="true" {...drift(-40, 50, 1.2, 22)} />
    </>
  )
}

const HeroCamera = lazy(() => import('../components/HeroCamera'))

// 3D only on screens 768px and wider, and not for reduced-motion users.
function useIs3D(reduced) {
  const [wide, setWide] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const update = () => setWide(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return wide && !reduced
}

function StaticCamera() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="hero-visual-glow" />
      <img
        src="/hero-camera.png"
        alt=""
        onError={(e) => { e.currentTarget.style.display = 'none' }}
      />
    </div>
  )
}

function HeroVisual({ reduced }) {
  const is3D = useIs3D(reduced)
  if (!is3D) return <StaticCamera />
  return (
    <Suspense fallback={<StaticCamera />}>
      <HeroCamera />
    </Suspense>
  )
}

/* ---------- Section headings ---------- */

function SectionTitle({ id, reduced, children }) {
  return (
    <motion.h2
      id={id}
      className="sec-title"
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
      <motion.span
        className="sec-line"
        aria-hidden="true"
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
      />
    </motion.h2>
  )
}

/* ---------- Solutions: animated spotlight card ---------- */

// motion.create on newer framer-motion, motion() on older versions
const MotionLink = (motion.create || motion)(Link)

function SolutionCard({ s, index, reduced }) {
  const to = s.slug && solutionSlugs.has(s.slug) ? `/solutions/${s.slug}` : null
  const cls = `bt${s.cls ? ` ${s.cls}` : ''}`

  const handleMove = (e) => {
    if (reduced) return
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  const motionProps = {
    className: cls,
    onMouseMove: handleMove,
    initial: reduced ? false : { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    whileHover: reduced ? undefined : { y: -4, transition: { duration: 0.2, delay: 0 } },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.55, delay: (index % 3) * 0.1, ease: 'easeOut' },
  }

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

  return to ? (
    <MotionLink to={to} {...motionProps}>{body}</MotionLink>
  ) : (
    <motion.div {...motionProps}>{body}</motion.div>
  )
}

/* ---------- Brands marquee ---------- */

const rowA = brands.slice(0, 11)
const rowB = brands.slice(11)

function MarqueeRow({ items, reverse }) {
  return (
    <div className={`marquee${reverse ? ' rev' : ''}`}>
      <div className="marquee-track">
        {[0, 1].map((n) => (
          <ul className="marquee-set" key={n} aria-hidden={n === 1 ? 'true' : undefined}>
            {items.map((b) => <li key={b}>{b}</li>)}
          </ul>
        ))}
      </div>
    </div>
  )
}

/* ---------- Who we serve ---------- */

function ServeCard({ s, index, reduced }) {
  const rx = useSpring(0, { stiffness: 200, damping: 20 })
  const ry = useSpring(0, { stiffness: 200, damping: 20 })

  const onMove = (e) => {
    if (reduced) return
    const r = e.currentTarget.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 10)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      className="ac-card hover-card serve-tilt"
      style={reduced ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 800 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: 'easeOut' }}
    >
      <div className="serve-img">
        <img
          src={s.img}
          alt={s.alt}
          width="640"
          height="400"
          loading="lazy"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
      </div>
      <div className="serve-body">
        <s.icon className="chip" aria-hidden="true" />
        <h3>{s.title}</h3>
        <p>{s.text}</p>
      </div>
    </motion.div>
  )
}

function LocationNote({ reduced }) {
  return (
    <motion.div
      className="loc-note"
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <span className="loc-pin" aria-hidden="true"><FaMapMarkerAlt /></span>
      <p>
        <strong>Based on Computer Street, Bur Dubai</strong>, and serving businesses across Dubai, Abu Dhabi and the UAE.
      </p>
      <a
        className="loc-link"
        href="https://www.google.com/maps/search/?api=1&query=Artek+Computers+Computer+Street+Bur+Dubai"
        target="_blank"
        rel="noopener noreferrer"
      >
        Get directions
      </a>
    </motion.div>
  )
}

export default function Home() {
  const reduced = useReducedMotion()

  return (
    <>
      <Seo
        title="IT Solutions, CCTV and Networking in Dubai | Artek Computers"
        description="Artek Computers LLC is an IT integrated systems company in Dubai: computers, networking, CCTV, cabling and cloud, for customers from residential to corporate."
        path="/"
        jsonLd={[orgJsonLd, faqJsonLd]}
      />

      {/* Hero */}
      <section className="hero">
        <GlowBlobs reduced={reduced} />
        <div className="wrap">
          <div className="hero-in">
            <div>
              <h1>
                {headlineWords.map((word, i) => (
                  <Fragment key={`${word}-${i}`}>
                    <motion.span
                      className="word"
                      custom={i}
                      variants={wordVariants}
                      initial={reduced ? false : 'hidden'}
                      animate="visible"
                    >
                      {word}
                    </motion.span>{' '}
                  </Fragment>
                ))}
              </h1>
              <p className="lead">
                Artek Computers LLC is an IT integrated systems company. We provide end-to-end solutions,
                from computers and networks to CCTV, cabling and cloud, for customers from residential to corporate.
              </p>
              <div className="hero-btns">
                <a className="btn white" href={PHONE_LINK}>Call {PHONE}</a>
                <Link className="btn outline" to="/contact">Request a free quote</Link>
              </div>
            </div>
            <HeroVisual reduced={reduced} />
          </div>
          <ul className="proof">
            {proof.map((item, i) => (
              <motion.li
                key={item}
                custom={i}
                variants={proofVariants}
                initial={reduced ? false : 'hidden'}
                animate="visible"
              >
                <FaCheck aria-hidden="true" />
                {item}
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* Solutions */}
      <section className="services" id="solutions">
        <div className="wrap">
          <SectionTitle reduced={reduced}>Our IT and security solutions in Dubai</SectionTitle>
          <div className="bento">
            {solutions.map((s, i) => (
              <SolutionCard key={s.title} s={s} index={i} reduced={reduced} />
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="brands-home" aria-labelledby="brands-h">
        <div className="wrap">
          <SectionTitle id="brands-h" reduced={reduced}>Authorized dealer of leading brands</SectionTitle>
          <p className="intro">We supply and support technology from the brands your business already trusts.</p>
        </div>
        <div className="marquees">
          <MarqueeRow items={rowA} />
          <MarqueeRow items={rowB} reverse />
        </div>
        <div className="wrap">
          <p className="brands-more"><Link to="/brands">See all brands</Link></p>
        </div>
      </section>

      {/* Who we serve */}
      <section className="serve" aria-labelledby="serve-h">
        <div className="wrap">
          <SectionTitle id="serve-h" reduced={reduced}>Who we serve</SectionTitle>
          <div className="ac-grid">
            {serve.map((s, i) => (
              <ServeCard key={s.title} s={s} index={i} reduced={reduced} />
            ))}
          </div>
          <LocationNote reduced={reduced} />
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-sec" aria-labelledby="faq-h">
        <div className="wrap">
          <SectionTitle id="faq-h" reduced={reduced}>Common questions</SectionTitle>
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

      {/* Closing call to action */}
      <section className="closing">
        <div className="wrap">
          <SectionTitle reduced={reduced}>Ready to talk about your IT or security needs?</SectionTitle>
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
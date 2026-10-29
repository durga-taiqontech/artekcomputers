import { Fragment, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  FaBullseye,
  FaDesktop,
  FaEye,
  FaNetworkWired,
  FaPlug,
  FaShieldAlt,
  FaSnowflake,
} from 'react-icons/fa'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import { brandGroups } from '../data/catalog'
import { PHONE, PHONE_LINK } from '../constants'

const mission = [
  'To contribute outstanding value to clients, employees, vendors and society at large.',
  'To build long-term partnerships with enthusiastically satisfied customers.',
  'To expand our business and technology leadership position.',
  'To become an incredibly easy company to do business with, through a culture of customer service.',
]

// First four brand group names, straight from the catalogue data.
const coreLines = brandGroups.slice(0, 4).map((g) => g.title).join(', ')

// Tiles use only the lines named in the paragraph above.
const lineTiles = [
  { icon: FaPlug, label: 'Copper and fiber cabling' },
  { icon: FaNetworkWired, label: 'Networking and IT infrastructure' },
  { icon: FaShieldAlt, label: 'ELV and security' },
  { icon: FaSnowflake, label: 'Power and cooling' },
  { icon: FaDesktop, label: 'Computers, storage and peripherals' },
]

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

/* ---------- Helpers (all local to this file) ---------- */

// Sets --mx / --my on the element so the CSS spotlight can follow the cursor.
function trackSpot(e) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

function SectionTitle({ id, reduced, children }) {
  return (
    <motion.h2
      id={id}
      className="co-title"
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
      <motion.span
        className="co-title-line"
        aria-hidden="true"
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
      />
    </motion.h2>
  )
}

// Word-by-word reveal. The words stay real text inside the parent element.
function RevealWords({ text, reduced, delay = 0, step = 0.08 }) {
  return text.split(' ').map((word, i) => (
    <Fragment key={`${word}-${i}`}>
      <motion.span
        className="co-word"
        initial={reduced ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + i * step, duration: 0.5, ease: 'easeOut' }}
      >
        {word}
      </motion.span>{' '}
    </Fragment>
  ))
}

// Image reveal: a navy panel slides away (transform) while the image eases down to scale 1.
function RevealImage({ src, alt, width, height, reduced }) {
  return (
    <div className="co-media">
      <div className="co-frame">
        <motion.img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          initial={reduced ? false : { scale: 1.1 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        {!reduced && (
          <motion.span
            className="co-cover"
            aria-hidden="true"
            initial={{ x: '0%' }}
            whileInView={{ x: '101%' }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          />
        )}
      </div>
    </div>
  )
}

function LineTile({ item, index, reduced }) {
  return (
    <motion.li
      className="co-tile co-spot"
      onMouseMove={reduced ? undefined : trackSpot}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={reduced ? undefined : { y: -4, transition: { duration: 0.2, delay: 0 } }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
    >
      <item.icon className="co-tile-icon" aria-hidden="true" />
      <span>{item.label}</span>
    </motion.li>
  )
}

function InfoCard({ icon: Icon, title, delay, reduced, children }) {
  return (
    <motion.div
      className="co-card co-spot"
      onMouseMove={reduced ? undefined : trackSpot}
      initial={reduced ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={reduced ? undefined : { y: -4, transition: { duration: 0.2, delay: 0 } }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      <h3 className="co-card-title">
        <span className="co-chip" aria-hidden="true"><Icon /></span>
        {title}
      </h3>
      {children}
    </motion.div>
  )
}

function WhyItem({ text, index, reduced }) {
  return (
    <motion.li
      className="co-why-item"
      initial={reduced ? false : { opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, delay: (index % 2) * 0.08, ease: 'easeOut' }}
    >
      <span className="co-tick" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="#1E6BFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <motion.path
            d="M5 12.5l4.5 4.5L19 7"
            initial={reduced ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
          />
        </svg>
      </span>
      <span className="co-why-text">{text}</span>
    </motion.li>
  )
}

export default function Company() {
  const reduced = useReducedMotion()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  return (
    <>
      <Seo
        title="About Artek Computers LLC | IT Integrated Systems Company in Dubai"
        description="Artek Computers LLC is an IT integrated systems company in Dubai supplying computers, networking, cabling, CCTV and ELV products for customers from residential to corporate."
        path="/company"
        jsonLd={jsonLd}
      />

      {/* Hero (background image is decorative: empty alt + aria-hidden) */}
      <section className="co-hero" ref={heroRef}>
        <motion.div className="co-hero-bg" aria-hidden="true" style={reduced ? undefined : { y: bgY }}>
          <img
            src="/images/company/hero.webp"
            alt=""
            aria-hidden="true"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            width="1920"
            height="700"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        </motion.div>
        <div className="co-hero-shade" aria-hidden="true" />
        <div className="wrap co-breadcrumb">
          <Breadcrumbs tone="light" items={[{ name: 'Home', to: '/' }, { name: 'Company' }]} />
        </div>
        <div className="wrap co-hero-inner">
          <p className="co-kicker">
            <RevealWords text="About Artek Computers LLC" reduced={reduced} />
          </p>
          <h1>
            <RevealWords text="One trusted source for IT, ELV and security products" reduced={reduced} delay={0.35} />
          </h1>
          <motion.span
            className="co-hero-line"
            aria-hidden="true"
            initial={reduced ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.2, duration: 0.7, ease: 'easeOut' }}
          />
        </div>
      </section>

      {/* Who we are */}
      <section className="co-band co-band--white" aria-labelledby="about-h">
        <div className="wrap">
          <SectionTitle id="about-h" reduced={reduced}>Who we are</SectionTitle>
          <div className="co-split">
            <div className="co-prose">
              <motion.p
                initial={reduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
              >
                Artek Computers LLC is an IT integrated systems company established in the United Arab Emirates.
                We provide end-to-end solutions supporting the most advanced information technologies:{' '}
                <Link to="/solutions/computer-systems" className="co-link">computer systems (hardware and software)</Link>,
                computer accessories and consumables,{' '}
                <Link to="/solutions/network-solutions" className="co-link">networks and telecommunications</Link>,{' '}
                <Link to="/solutions/network-solutions" className="co-link">intelligent cabling</Link>, printers,
                cartridges and toners,{' '}
                <Link to="/solutions/elv-access-control" className="co-link">ELV systems</Link> and
                application software solutions. We provide services from residential to corporate customers.
              </motion.p>
              <motion.p
                initial={reduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: 0.15, ease: 'easeOut' }}
              >
                Whatever your needs, wherever you are, we can help. We supply new parts, options, replacements,
                upgrades and complete units for{' '}
                <Link to="/products#computers" className="co-link">branded PCs, desktops, laptops, servers</Link>,
                printers, toners,{' '}
                <Link to="/solutions/voice-telephony" className="co-link">PABX</Link> and{' '}
                <Link to="/solutions/elv-access-control" className="co-link">biometric access control</Link>.
                We help you cut lead times and reduce costs, with packages tailored to a company like yours.
              </motion.p>
            </div>
            <RevealImage
              src="/images/company/team.webp"
              alt="Artek Computers team supporting IT and security projects in Dubai"
              width="960"
              height="720"
              reduced={reduced}
            />
          </div>
        </div>
      </section>

      {/* Core lines of business */}
      <section className="co-band co-band--grey" aria-labelledby="lines-h">
        <div className="wrap">
          <SectionTitle id="lines-h" reduced={reduced}>Our core lines of business</SectionTitle>
          <p className="co-lines-p">
            Our main lines of business include {coreLines}, together with computers, storage and
            peripherals from leading brands.
          </p>
          <ul className="co-tiles">
            {lineTiles.map((item, i) => (
              <LineTile key={item.label} item={item} index={i} reduced={reduced} />
            ))}
          </ul>
          <Link className="co-btn" to="/brands">See all brands</Link>
        </div>
      </section>

      {/* Mission and vision */}
      <section className="co-band co-band--white" aria-labelledby="mv-h">
        <div className="wrap">
          <h2 id="mv-h" className="sr-only">Mission and vision</h2>
          <div className="co-cards">
            <InfoCard icon={FaBullseye} title="Our mission" delay={0} reduced={reduced}>
              <ul>
                {mission.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </InfoCard>
            <InfoCard icon={FaEye} title="Our vision" delay={0.15} reduced={reduced}>
              <p>
                To be a respected and agile corporation that continuously enhances the value we provide through
                best-of-breed business solutions, delivered by best-in-class people.
              </p>
            </InfoCard>
          </div>
        </div>
      </section>

      {/* Why customers choose Artek */}
      <section className="co-band co-band--grey" aria-labelledby="why-h">
        <div className="wrap">
          <SectionTitle id="why-h" reduced={reduced}>Why customers choose Artek</SectionTitle>
          <p className="co-intro">Here is how we work with every customer.</p>
          <ul className="co-why">
            {why.map((item, i) => (
              <WhyItem key={item} text={item} index={i} reduced={reduced} />
            ))}
          </ul>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="co-cta" aria-labelledby="co-cta-h">
        <div className="wrap">
          <SectionTitle id="co-cta-h" reduced={reduced}>Ready to talk about your IT or security needs?</SectionTitle>
          <p>Call us or send an enquiry. We will recommend the right solution and quote clearly.</p>
          <div className="co-cta-btns">
            <a className="co-btn co-btn-white" href={PHONE_LINK}>Call {PHONE}</a>
            <Link className="co-btn co-btn-ghost" to="/contact">Request a free quote</Link>
          </div>
        </div>
      </section>
    </>
  )
}
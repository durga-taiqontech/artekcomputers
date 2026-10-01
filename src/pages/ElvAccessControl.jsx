import { Link } from 'react-router-dom'
import {
  FaFingerprint,
  FaIdBadge,
  FaIdCard,
  FaMobileAlt,
  FaProjectDiagram,
  FaUserClock,
} from 'react-icons/fa'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import { PHONE, PHONE_LINK } from '../constants'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'ELV, AV and Access Control Systems',
  areaServed: 'United Arab Emirates',
  provider: {
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

export default function ElvAccessControl() {
  return (
    <>
      <Seo
        title="ELV, AV and Access Control Systems in Dubai, UAE | Artek Computers LLC"
        description="SIRA-approved ELV, AV and access control systems in Dubai and across the UAE: biometric readers, card and mobile access, structured cabling, video conferencing and digital signage. Free site survey."
        path="/elv-access-control"
        jsonLd={jsonLd}
      />

      <section className="hero-band">
        <div className="wrap">
          <Breadcrumbs tone="light" items={[{ name: 'Home', to: '/' }, { name: 'ELV & Access Control' }]} />
          <h1>ELV, AV and access control solutions in the UAE</h1>
          <p className="lead">
            Artek Computers LLC delivers access control systems, AV solutions and ELV (Extra Low Voltage)
            infrastructure for businesses across Dubai and the UAE.
          </p>
          <div className="hero-btns">
            <a className="btn white" href={PHONE_LINK}>Call {PHONE}</a>
            <Link className="btn outline" to="/contact">Get a free site survey</Link>
          </div>
        </div>
      </section>

      <section className="elv-two" aria-labelledby="elv-h av-h">
        <div className="wrap">
          <div className="elv-cols">
            <div>
              <h2 id="elv-h">ELV systems in Dubai</h2>
              <p className="intro">Our ELV systems cover the essential technologies every business environment relies on.</p>
              <ul className="item-list">
                <li>
                  <h3>Structured cabling for ELV infrastructure</h3>
                  <p>Robust cabling that supports all your communication needs with reliable, high-speed data transmission.</p>
                </li>
                <li>
                  <h3>Integrated security and access control</h3>
                  <p>
                    Advanced security solutions such as <Link to="/#solutions">CCTV surveillance</Link>,
                    intrusion detection and fire alarm systems, fully integrated.
                  </p>
                </li>
                <li>
                  <h3>Public address and voice alarm</h3>
                  <p>Public address systems for efficient communication and emergency response in commercial and industrial facilities.</p>
                </li>
              </ul>
            </div>
            <div>
              <h2 id="av-h">AV solutions in Dubai and across the UAE</h2>
              <p className="intro">Our AV solutions improve how your teams communicate and collaborate.</p>
              <ul className="item-list">
                <li>
                  <h3>Video conferencing</h3>
                  <p>High-definition systems that enable remote collaboration and reduce travel.</p>
                </li>
                <li>
                  <h3>Digital signage and display systems</h3>
                  <p>Dynamic displays for information, advertising or critical announcements.</p>
                </li>
                <li>
                  <h3>Interactive displays</h3>
                  <p>Touch-screen displays and projectors that make meetings and presentations more productive.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="ac-sec" aria-labelledby="ac-h">
        <div className="wrap">
          <h2 id="ac-h">Access control systems in UAE: biometric and smart security</h2>
          <p className="intro">
            Modern access control goes beyond locks. We offer biometric authentication, card-based access,
            mobile credentials and centralised management for complete facility security.
          </p>
          <div className="ac-grid">
            <div className="ac-card hover-card">
              <FaFingerprint aria-hidden="true" />
              <h3>Biometric access control in Dubai</h3>
              <p>Fingerprint, facial recognition and iris scanning for restricted areas.</p>
            </div>
            <div className="ac-card hover-card">
              <FaIdCard aria-hidden="true" />
              <h3>Card-based systems</h3>
              <p>RFID proximity and smart cards with encrypted credentials.</p>
            </div>
            <div className="ac-card hover-card">
              <FaMobileAlt aria-hidden="true" />
              <h3>Mobile access</h3>
              <p>Smartphone entry using Bluetooth and NFC.</p>
            </div>
            <div className="ac-card hover-card">
              <FaUserClock aria-hidden="true" />
              <h3>Time attendance integration</h3>
              <p>Automated employee tracking tied into your access control.</p>
            </div>
            <div className="ac-card hover-card">
              <FaIdBadge aria-hidden="true" />
              <h3>Visitor management</h3>
              <p>Check-in, badge printing and temporary credentials for visitors and contractors.</p>
            </div>
            <div className="ac-card hover-card">
              <FaProjectDiagram aria-hidden="true" />
              <h3>System integration</h3>
              <p>Works with CCTV, alarms and building management systems.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="why" aria-labelledby="why-h">
        <div className="wrap">
          <h2 id="why-h">Why choose Artek Computers LLC</h2>
          <div className="why-grid">
            <div>
              <h3>Trusted partner</h3>
              <p>We work with leading access control and AV manufacturers and provide genuine solutions with full support across the UAE.</p>
            </div>
            <div>
              <h3>Expert guidance</h3>
              <p>Our team helps you choose the right ELV, AV and access control solution for your business needs in Dubai and the UAE.</p>
            </div>
            <div>
              <h3>End-to-end support</h3>
              <p>From consultation and installation to ongoing 24/7 technical support.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="closing">
        <div className="wrap">
          <h2>Secure and streamline your business</h2>
          <p>
            Talk to Artek Computers LLC about ELV, AV and access control solutions. We survey your site,
            quote clearly and handle the installation.
          </p>
          <div className="hero-btns">
            <a className="btn white" href={PHONE_LINK}>Call {PHONE}</a>
            <Link className="btn outline" to="/contact">Get a free site survey</Link>
          </div>
        </div>
      </section>
    </>
  )
}

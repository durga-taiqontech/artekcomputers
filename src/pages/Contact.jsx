import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa'
import { WHATSAPP } from '../constants'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'

const services = [
  'CCTV & Security',
  'IT Services',
  'Network Solutions',
  'Microsoft Solutions',
  'Computer Systems',
  'Voice & Telephony',
  'Data Center Relocation',
  'CyberSecurity',
  'Desktops and workstations',
  'Laptops',
  'Printers',
  'Mobile devices',
  'Audio visual',
  'Cloud computing',
  'Other',
]

// Maps ?service= slugs from the Products page to select options.
const SERVICE_BY_SLUG = {
  'cctv-security': 'CCTV & Security',
  networking: 'Network Solutions',
  servers: 'Computer Systems',
  cybersecurity: 'CyberSecurity',
  'it-support': 'IT Services',
  desktops: 'Desktops and workstations',
  laptops: 'Laptops',
  printers: 'Printers',
  'mobile-devices': 'Mobile devices',
  'audio-visual': 'Audio visual',
  cloud: 'Cloud computing',
}

const MAPS_LINK = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  'Artek Computers LLC Computer Street Bur Dubai',
)}`

const initial = { name: '', phone: '', email: '', service: '', message: '' }

// Single submit path: swap this for a real API later, the form will not change.
async function sendEnquiry(data) {
  const body = `Name: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}\nService: ${data.service}\n\n${data.message}`
  window.location.href = `mailto:info@artekteam.com?subject=${encodeURIComponent(
    `Website enquiry — ${data.service}`,
  )}&body=${encodeURIComponent(body)}`
}

function validate(f) {
  const errs = {}
  if (!f.name.trim()) errs.name = 'Please enter your full name.'
  if (!f.phone.trim()) errs.phone = 'Please enter a phone number we can call you on.'
  else if (f.phone.replace(/\D/g, '').length < 7) errs.phone = 'Please enter a valid phone number, at least 7 digits long.'
  if (!f.email.trim()) errs.email = 'Please enter your email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) errs.email = 'Please enter a valid email address, like name@company.com.'
  if (!f.service) errs.service = 'Please choose the service you need.'
  if (!f.message.trim()) errs.message = 'Please tell us a little about what you need.'
  return errs
}

export default function Contact() {
  const [searchParams] = useSearchParams()
  const preset = SERVICE_BY_SLUG[searchParams.get('service')]
  const [f, setF] = useState({ ...initial, service: services.includes(preset) ? preset : '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const aria = (key, err) => (err ? { 'aria-invalid': true, 'aria-describedby': `${key}-err` } : {})

  const set = (key) => (e) => {
    setF({ ...f, [key]: e.target.value })
    if (errors[key]) setErrors({ ...errors, [key]: undefined })
  }

  async function submit(e) {
    e.preventDefault()
    const errs = validate(f)
    if (Object.keys(errs).length) {
      setErrors(errs)
      document.getElementById(Object.keys(errs)[0])?.focus()
      return
    }
    const payload = {
      name: f.name.trim(),
      phone: f.phone.trim(),
      email: f.email.trim(),
      service: f.service,
      message: f.message.trim(),
    }
    setStatus('sending')
    await new Promise((r) => setTimeout(r, 400)) // brief visible "sending" state
    await sendEnquiry(payload)
    setStatus('sent')
    setF(initial)
  }

  return (
    <section className="contact">
      <Seo
        title="Contact Artek Computers LLC | IT & CCTV Company in Bur Dubai"
        description="Call, email or visit Artek Computers LLC on Computer Street, Bur Dubai. Free site survey and clear quotes for CCTV, IT and ELV projects."
        path="/contact"
      />
      <div className="wrap">
        <div className="contact-in">
          <div>
            <Breadcrumbs tone="dark" items={[{ name: 'Home', to: '/' }, { name: 'Contact Us' }]} />
            <h1>Let&apos;s talk about your site</h1>
            <p className="lead">Tell us what you need. We survey the site, quote clearly, and handle SIRA approval for you.</p>
            <dl className="info">
              <dt>Call</dt>
              <dd>
                <a href="tel:+97143797128">+971 4 379 7128</a><br />
                <a href="tel:+97143797138">+971 4 379 7138</a><br />
                <a href="tel:+971502236842">+971 50 223 6842</a>
              </dd>
              <dt>Email</dt>
              <dd>
                <a href="mailto:info@artekteam.com">info@artekteam.com</a><br />
                <a href="mailto:sales@artekteam.com">sales@artekteam.com</a>
              </dd>
              <dt>Visit</dt>
              <dd>P.O Box 112280, Al Rafa Road,<br />Computer Street, Bur Dubai, Dubai, UAE</dd>
            </dl>
            <a className="btn blue wa-btn" href={WHATSAPP} target="_blank" rel="noreferrer">
              <FaWhatsapp aria-hidden="true" />
              Chat on WhatsApp
            </a>
          </div>

          <form noValidate onSubmit={submit}>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input id="name" name="name" autoComplete="name" value={f.name} onChange={set('name')} {...aria('name', errors.name)} />
              {errors.name && <p className="err" id="name-err">{errors.name}</p>}
            </div>

            <div className="two">
              <div className="field">
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={f.phone} onChange={set('phone')} {...aria('phone', errors.phone)} />
                {errors.phone && <p className="err" id="phone-err">{errors.phone}</p>}
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" autoComplete="email" value={f.email} onChange={set('email')} {...aria('email', errors.email)} />
                {errors.email && <p className="err" id="email-err">{errors.email}</p>}
              </div>
            </div>

            <div className="field">
              <label htmlFor="service">Service needed</label>
              <select id="service" name="service" value={f.service} onChange={set('service')} {...aria('service', errors.service)}>
                <option value="" disabled>Select a service</option>
                {services.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.service && <p className="err" id="service-err">{errors.service}</p>}
            </div>

            <div className="field">
              <label htmlFor="message">How can we help?</label>
              <textarea id="message" name="message" rows="4" value={f.message} onChange={set('message')} {...aria('message', errors.message)} />
              {errors.message && <p className="err" id="message-err">{errors.message}</p>}
            </div>

            <button className="btn blue" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send enquiry'}
            </button>
            {status === 'sent' && (
              <p className="ok" role="status">Thanks, we&apos;ll call you back within one working day.</p>
            )}
          </form>
        </div>

        <div className="map-card">
          <div className="map-canvas" aria-hidden="true">
            <FaMapMarkerAlt className="map-pin" />
          </div>
          <div className="map-foot">
            <p>Artek Computers LLC, P.O Box 112280, Al Rafa Road, Computer Street, Bur Dubai, Dubai, UAE</p>
            <a href={MAPS_LINK} target="_blank" rel="noreferrer">Get directions</a>
          </div>
        </div>
      </div>
    </section>
  )
}

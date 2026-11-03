import { Fragment, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaTimes, FaWhatsapp } from 'react-icons/fa'
import { WHATSAPP } from '../constants'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'

const services = [
  'CCTV & Security',
  'ELV & Access Control',
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

// Select options: the service names above plus "Products" for catalogue enquiries.
const serviceOptions = [
  { value: 'products', label: 'Products' },
  ...services.map((s) => ({ value: s, label: s })),
]

// Maps ?service= slugs from the Products and catalogue pages to select values.
const SERVICE_BY_SLUG = {
  'elv-access-control': 'ELV & Access Control',
  products: 'products',
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

// Maps ?category= (a product group title from the catalogue) to a service option.
// Only clear matches are listed; anything else leaves the dropdown unselected.
const SERVICE_BY_CATEGORY = {
  'Copper cabling': 'Network Solutions',
  'Fiber optic': 'Network Solutions',
  'Specialty and ELV cables': 'ELV & Access Control',
  Networking: 'Network Solutions',
  Computers: 'Computer Systems',
  'Telephony and displays': 'Voice & Telephony',
}

// Query values are untrusted: strip control and invisible direction characters, collapse spaces, cap at 120.
function cleanParam(value) {
  return String(value ?? '')
    .replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u202A-\u202E\u2066-\u2069]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120)
    .trim()
}

const MAPS_LINK = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  'Artek Computers LLC Computer Street Bur Dubai',
)}`

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Artek Computers LLC',
  url: 'https://artekcomputer.com/contact',
}

const initial = { name: '', phone: '', email: '', service: '', message: '' }

// Web3Forms key comes from the VITE_WEB3FORMS_KEY env var. Never hardcoded, never logged.
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || ''

const PHONE_INVALID = 'Please enter a valid UAE phone number, for example +971 4 379 7128 or +971 50 223 6842.'

// Strips spaces/dashes/brackets and one pasted +971 / 00971 / leading 0. May keep letters; validation rejects them.
function uaeDigits(raw) {
  let s = String(raw).replace(/[\s\-()]/g, '')
  if (s.startsWith('+971')) s = s.slice(4)
  else if (s.startsWith('00971')) s = s.slice(5)
  else if (s.startsWith('0')) s = s.slice(1)
  return s
}

// Mobile: 5 + 8 digits (9 total). Landline: area 2/3/4/6/7/9 + 7 digits (8 total).
const isUaeMobile = (d) => /^5\d{8}$/.test(d)
const isUaeLandline = (d) => /^[234679]\d{7}$/.test(d)
const isUaeNumber = (d) => isUaeMobile(d) || isUaeLandline(d)

// Progressive grouping: mobile 2-3-4 ("50 223 6842"), landline 1-3-4 ("4 379 7128").
function formatUae(digits) {
  if (!digits) return ''
  const groups = digits[0] === '5' ? [2, 3, 4] : [1, 3, 4]
  const parts = []
  let i = 0
  for (const g of groups) {
    if (i >= digits.length) break
    parts.push(digits.slice(i, i + g))
    i += g
  }
  if (i < digits.length) parts.push(digits.slice(i))
  return parts.join(' ')
}

// Single submit path: Web3Forms when a key is configured, mailto fallback otherwise.
async function sendEnquiry(data) {
  if (import.meta.env.DEV) console.log('[enquiry] web3forms key found:', Boolean(WEB3FORMS_KEY))
  let delivered = false
  if (WEB3FORMS_KEY) {
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Website enquiry — ${data.service}`,
          name: data.name,
          phone: data.phone,
          email: data.email,
          service: data.service,
          message: data.message,
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (import.meta.env.DEV) {
        console.log(`[enquiry] web3forms response: status=${res.status} message=${JSON.stringify(json.message ?? null)}`)
      }
      delivered = res.ok && json.success === true
    } catch (err) {
      if (import.meta.env.DEV) console.log('[enquiry] web3forms request failed: ' + (err && err.message))
    }
  }
  if (!delivered) {
    const body = `Name: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}\nService: ${data.service}\n\n${data.message}`
    window.location.href = `mailto:info@artekteam.com?subject=${encodeURIComponent(
      `Website enquiry — ${data.service}`,
    )}&body=${encodeURIComponent(body)}`
  }
  if (import.meta.env.DEV) console.log('[enquiry] mailto fallback used:', !delivered)
  return delivered
}

function validate(f) {
  const errs = {}
  if (!f.name.trim()) errs.name = 'Please enter your full name.'
  if (!f.phone.trim()) errs.phone = 'Please enter a phone number we can call you on.'
  else if (!isUaeNumber(uaeDigits(f.phone))) errs.phone = PHONE_INVALID
  if (!f.email.trim()) errs.email = 'Please enter your email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) errs.email = 'Please enter a valid email address, like name@company.com.'
  if (!f.service) errs.service = 'Please choose the service you need.'
  if (!f.message.trim()) errs.message = 'Please tell us a little about what you need.'
  return errs
}

/* ---------- Visual helpers (no effect on what the form sends) ---------- */

// Word-by-word reveal; the words stay real text inside the parent element.
function RevealWords({ text, reduced, delay = 0, step = 0.08 }) {
  return text.split(' ').map((word, i) => (
    <Fragment key={`${word}-${i}`}>
      <motion.span
        className="ct-word"
        initial={reduced ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + i * step, duration: 0.5, ease: 'easeOut' }}
      >
        {word}
      </motion.span>{' '}
    </Fragment>
  ))
}

// The live region always exists, so screen readers announce a message when it appears.
function FieldError({ id, message, reduced }) {
  return (
    <div aria-live="polite">
      {message && (
        <motion.p
          className="err"
          id={id}
          initial={reduced ? false : { opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  )
}

function InfoGroup({ icon: Icon, label, index, reduced, children }) {
  return (
    <motion.div
      className="ct-group"
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: 'easeOut' }}
    >
      <dt>
        <span className="ct-chip" aria-hidden="true"><Icon /></span>
        {label}
      </dt>
      <dd>{children}</dd>
    </motion.div>
  )
}

function SuccessPanel({ reduced, onReset }) {
  return (
    <motion.div
      className="ct-success"
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <svg className="ct-check" viewBox="0 0 52 52" aria-hidden="true" focusable="false">
        <motion.circle
          cx="26"
          cy="26"
          r="24"
          fill="none"
          stroke="#1e6bff"
          strokeWidth="3"
          initial={reduced ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        <motion.path
          d="M15 27l8 8 14-16"
          fill="none"
          stroke="#38d4ff"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduced ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, delay: 0.5, ease: 'easeOut' }}
        />
      </svg>
      <p className="ok" role="status">Thanks, we have received your enquiry. We will call you back within 1 hour during working hours.</p>
      <button className="btn blue ct-again" type="button" onClick={onReset}>Send another enquiry</button>
    </motion.div>
  )
}

export default function Contact() {
  const [searchParams, setSearchParams] = useSearchParams()
  const product = cleanParam(searchParams.get('product'))
  const category = cleanParam(searchParams.get('category'))

  // Prefill is worked out once, on first load. It never overwrites what the visitor types.
  const [prefill] = useState(() => {
    const preset = SERVICE_BY_SLUG[searchParams.get('service')]
    const fromCategory = Object.prototype.hasOwnProperty.call(SERVICE_BY_CATEGORY, category)
      ? SERVICE_BY_CATEGORY[category]
      : ''
    const candidate = serviceOptions.some((o) => o.value === preset) ? preset : fromCategory
    return {
      service: serviceOptions.some((o) => o.value === candidate) ? candidate : '',
      message: product
        ? `I would like a quote for: ${product}${category ? ` (${category})` : ''}.`
        : '',
    }
  })
  const [f, setF] = useState({ ...initial, service: prefill.service, message: prefill.message })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const reduced = useReducedMotion()
  const mapRef = useRef(null)
  const mapInView = useInView(mapRef, { once: true })
  const aria = (key, err) => (err ? { 'aria-invalid': true, 'aria-describedby': `${key}-err` } : {})

  const set = (key) => (e) => {
    setF({ ...f, [key]: e.target.value })
    if (errors[key]) setErrors({ ...errors, [key]: undefined })
  }

  // Formats as the visitor types and keeps the caret stable across the reformat.
  const setPhone = (e) => {
    const el = e.target
    const caret = el.selectionStart ?? el.value.length
    const digitsBefore = el.value.slice(0, caret).replace(/\D/g, '').length
    const digits = uaeDigits(el.value).replace(/\D/g, '')
    const next = formatUae(digits)
    setF({ ...f, phone: next })
    if (errors.phone) setErrors({ ...errors, phone: undefined })
    requestAnimationFrame(() => {
      const target = Math.min(digitsBefore, digits.length)
      let seen = 0
      let pos = 0
      while (pos < next.length && seen < target) {
        if (/\d/.test(next[pos])) seen++
        pos++
      }
      el.setSelectionRange(pos, pos)
    })
  }

  // Visual only: once a field has been touched (blurred), show its message using the same rules as submit.
  const touch = (key) => () => {
    const err = validate(f)[key]
    setErrors((prev) => ({ ...prev, [key]: err }))
  }

  // Removes the quote request: clears the query and any prefill the visitor has not changed.
  const clearQuote = () => {
    setF((cur) => ({
      ...cur,
      message: cur.message === prefill.message ? '' : cur.message,
      service: cur.service === prefill.service ? '' : cur.service,
    }))
    setErrors((cur) => ({ ...cur, message: undefined, service: undefined }))
    setSearchParams({}, { replace: true })
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
      phone: `+971${uaeDigits(f.phone).replace(/\D/g, '')}`,
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
        title="Contact Artek Computers LLC | IT and CCTV Company in Dubai"
        description="Call +971 4 379 7128 or send an enquiry to Artek Computers LLC, Computer Street, Bur Dubai. Free consultation for IT, networking, CCTV and support."
        path="/contact"
        jsonLd={jsonLd}
      />
      <div className="wrap">
        <div className="contact-in">
          <div>
            <motion.div
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Breadcrumbs tone="dark" items={[{ name: 'Home', to: '/' }, { name: 'Contact Us' }]} />
            </motion.div>
            <h1><RevealWords text="Let's talk about your site" reduced={reduced} delay={0.15} /></h1>
            <motion.span
              className="ct-h1-line"
              aria-hidden="true"
              initial={reduced ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.6, ease: 'easeOut' }}
            />
            <p className="lead">Tell us what you need. We survey the site, quote clearly, and handle SIRA approval for you.</p>
            <dl className="ct-info">
              <InfoGroup icon={FaPhoneAlt} label="Call" index={0} reduced={reduced}>
                <a href="tel:+97143797128">+971 4 379 7128</a><br />
                <a href="tel:+97143797138">+971 4 379 7138</a><br />
                <a href="tel:+971502236842">+971 50 223 6842</a>
              </InfoGroup>
              <InfoGroup icon={FaEnvelope} label="Email" index={1} reduced={reduced}>
                <a href="mailto:info@artekteam.com">info@artekteam.com</a><br />
                <a href="mailto:sales@artekteam.com">sales@artekteam.com</a>
              </InfoGroup>
              <InfoGroup icon={FaMapMarkerAlt} label="Visit" index={2} reduced={reduced}>
                P.O Box 112280, Al Rafa Road,<br />Computer Street, Bur Dubai, Dubai, UAE
              </InfoGroup>
            </dl>
            <a className="btn blue wa-btn ct-wa" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              <FaWhatsapp aria-hidden="true" />
              Chat on WhatsApp
            </a>
          </div>

          {status === 'sent' ? (
            <SuccessPanel
              reduced={reduced}
              onReset={() => {
                setErrors({})
                setSearchParams({}, { replace: true }) // the quote request is done: no stale chip
                setStatus('idle')
              }}
            />
          ) : (
            <form className="ct-form" noValidate onSubmit={submit} aria-busy={status === 'sending'}>
              {product && (
                <div className="pq-chip">
                  <span className="pq-chip-text">Quote request for: {product}</span>
                  <button
                    type="button"
                    className="pq-chip-x"
                    onClick={clearQuote}
                    aria-label={`Remove quote request for ${product}`}
                  >
                    <FaTimes aria-hidden="true" />
                  </button>
                </div>
              )}

              <div className="field">
                <label htmlFor="name">Full name</label>
                <input id="name" name="name" autoComplete="name" value={f.name} onChange={set('name')} onBlur={touch('name')} {...aria('name', errors.name)} />
                <FieldError id="name-err" message={errors.name} reduced={reduced} />
              </div>

              <div className="two">
                <div className="field">
                  <label htmlFor="phone">Phone</label>
                  <div className="phone-wrap">
                    <span className="phone-prefix" aria-hidden="true">+971</span>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel-national"
                      placeholder="50 223 6842"
                      value={f.phone}
                      onChange={setPhone}
                      onBlur={touch('phone')}
                      {...aria('phone', errors.phone)}
                    />
                  </div>
                  <FieldError id="phone-err" message={errors.phone} reduced={reduced} />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" autoComplete="email" value={f.email} onChange={set('email')} onBlur={touch('email')} {...aria('email', errors.email)} />
                  <FieldError id="email-err" message={errors.email} reduced={reduced} />
                </div>
              </div>

              <div className="field">
                <label htmlFor="service">Service needed</label>
                <select id="service" name="service" value={f.service} onChange={set('service')} onBlur={touch('service')} {...aria('service', errors.service)}>
                  <option value="" disabled>Select a service</option>
                  {serviceOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <FieldError id="service-err" message={errors.service} reduced={reduced} />
              </div>

              <div className="field">
                <label htmlFor="message">How can we help?</label>
                <textarea id="message" name="message" rows="4" value={f.message} onChange={set('message')} onBlur={touch('message')} {...aria('message', errors.message)} />
                <FieldError id="message-err" message={errors.message} reduced={reduced} />
              </div>

              <button className="btn blue ct-submit" type="submit" disabled={status === 'sending'}>
                {status === 'sending' && <span className="ct-spinner" aria-hidden="true" />}
                {status === 'sending' ? 'Sending…' : 'Send enquiry'}
              </button>
              <p className="form-note">We will call you back within 1 hour during working hours.</p>
            </form>
          )}
        </div>

        <div className="map-card" ref={mapRef}>
          {mapInView ? (
            <iframe
              className="map-frame"
              src="https://www.google.com/maps?q=Artek+Computers+LLC+Computer+Street+Bur+Dubai&output=embed"
              title="Map showing Artek Computers LLC on Computer Street, Bur Dubai"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="map-frame ct-map-ph" aria-hidden="true" />
          )}
          <div className="map-foot">
            <p>Artek Computers LLC, P.O Box 112280, Al Rafa Road, Computer Street, Bur Dubai, Dubai, UAE</p>
            <a className="ct-dir" href={MAPS_LINK} target="_blank" rel="noopener noreferrer">Get directions</a>
          </div>
        </div>
      </div>
    </section>
  )
}
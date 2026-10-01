import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
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
                    {...aria('phone', errors.phone)}
                  />
                </div>
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
            <p className="form-note">We will call you back within 1 hour during working hours.</p>
            {status === 'sent' && (
              <p className="ok" role="status">Thanks, we have received your enquiry. We will call you back within 1 hour during working hours.</p>
            )}
          </form>
        </div>

        <div className="map-card">
          <iframe
            className="map-frame"
            src="https://www.google.com/maps?q=Artek+Computers+LLC+Computer+Street+Bur+Dubai&output=embed"
            title="Map showing Artek Computers LLC on Computer Street, Bur Dubai"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="map-foot">
            <p>Artek Computers LLC, P.O Box 112280, Al Rafa Road, Computer Street, Bur Dubai, Dubai, UAE</p>
            <a href={MAPS_LINK} target="_blank" rel="noreferrer">Get directions</a>
          </div>
        </div>
      </div>
    </section>
  )
}

import { Fragment, lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { FaArrowRight, FaShieldAlt } from 'react-icons/fa'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import { solutions } from '../data/solutions'
import { PHONE, PHONE_LINK } from '../constants'

// Solution photos live in src/assets/solutions/<slug>.<ext>; missing slug = no photo.
const IMAGE_BY_SLUG = Object.fromEntries(
  Object
    .entries(import.meta.glob('../assets/solutions/*.{jpg,jpeg,webp,png}', { eager: true, import: 'default' }))
    .map(([file, url]) => [file.split('/').pop().replace(/\.[^.]+$/, ''), url]),
)

const ORG = {
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
}

// motion.create on newer framer-motion, motion() on older versions
const MotionLink = (motion.create || motion)(Link)

// Slugs that get the 3D scene in "How it works". Add more slugs here later.
const scene3D = new Set([])
const ProcessScene = lazy(() => import('../components/ProcessScene'))

// Generic step photos in public/images/steps, matched by step index (extra steps reuse the last one).
const STEP_IMAGES = [
  '/images/steps/survey.png',
  '/images/steps/design.png',
  '/images/steps/install.png',
  '/images/steps/handover.png',
  '/images/steps/support.png',
]
const stepImage = (i) => STEP_IMAGES[Math.min(i, STEP_IMAGES.length - 1)]

// Run a handler for real mouse pointers only (touch is handled by click/focus).
const mouseOnly = (fn) => (e) => { if (e.pointerType === 'mouse') fn(e) }

/* ---------- Local helpers ---------- */

// Sets --mx / --my so the CSS spotlight follows the cursor.
function trackSpot(e) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

function useMinWidth(px) {
  const [ok, setOk] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${px}px)`)
    const update = () => setOk(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [px])
  return ok
}

function SectionTitle({ id, reduced, children }) {
  return (
    <motion.h2
      id={id}
      className="sd-title"
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
      <motion.span
        className="sd-title-line"
        aria-hidden="true"
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
      />
    </motion.h2>
  )
}

// Word-by-word reveal; the words stay real text inside the parent element.
function RevealWords({ text, reduced, delay = 0, step = 0.08 }) {
  return text.split(' ').map((word, i) => (
    <Fragment key={`${word}-${i}`}>
      <motion.span
        className="sd-word"
        initial={reduced ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + i * step, duration: 0.5, ease: 'easeOut' }}
      >
        {word}
      </motion.span>{' '}
    </Fragment>
  ))
}

function OfferCard({ item, index, reduced }) {
  return (
    <motion.div
      className="sd-card sd-spot"
      onMouseMove={reduced ? undefined : trackSpot}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={reduced ? undefined : { y: -4, transition: { duration: 0.2, delay: 0 } }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.1, ease: 'easeOut' }}
    >
      {item.icon && <item.icon className="sd-card-icon" aria-hidden="true" />}
      <h3>{item.title}</h3>
      <p>{item.text}</p>
    </motion.div>
  )
}

function Step({ step, index, active, reduced, onHover, onPick }) {
  return (
    <li
      className={`sd-step${active ? ' is-active' : ''}`}
      onPointerEnter={mouseOnly(onHover)}
      onClick={onPick}
    >
      <motion.h3
        className="sd-step-h"
        initial={reduced ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, delay: index * 0.15 + 0.1, ease: 'easeOut' }}
      >
        <button
          type="button"
          className="sd-step-btn"
          aria-current={active ? 'step' : undefined}
          onFocus={onPick}
        >
          <motion.span
            className="sd-num"
            aria-hidden="true"
            initial={reduced ? false : { opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: index * 0.15 }}
          >
            {index + 1}
          </motion.span>
          {step.title}
        </button>
      </motion.h3>
      <motion.p
        initial={reduced ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, delay: index * 0.15 + 0.1, ease: 'easeOut' }}
      >
        {step.text}
      </motion.p>
    </li>
  )
}

// Photo panel: crossfade with a slight scale-down. Falls back to a navy gradient with the step number.
function PhotoPanel({ index, label, reduced }) {
  const [failed, setFailed] = useState({})
  const fade = { duration: reduced ? 0 : 0.7, ease: 'easeOut' }

  return (
    <div className="sd-panel-photo">
      <AnimatePresence initial={false}>
        {failed[index] ? (
          <motion.div
            key={`fallback-${index}`}
            className="sd-panel-fallback"
            initial={reduced ? false : { opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={fade}
          >
            <span>{index + 1}</span>
          </motion.div>
        ) : (
          <motion.img
            key={`img-${index}`}
            src={stepImage(index)}
            alt=""
            width="1200"
            height="600"
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
            initial={reduced ? false : { opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={fade}
            onError={() => setFailed((f) => ({ ...f, [index]: true }))}
          />
        )}
      </AnimatePresence>
      <span className="sd-panel-cap">{label}</span>
    </div>
  )
}

function ProcessPanel({ use3D, index, label, reduced }) {
  const photoPanel = <PhotoPanel index={index} label={label} reduced={reduced} />
  return (
    <div className="sd-panel" aria-hidden="true">
      {use3D ? (
        <Suspense fallback={photoPanel}>
          <ProcessScene step={index} label={label} fallback={photoPanel} />
        </Suspense>
      ) : (
        photoPanel
      )}
    </div>
  )
}

function Timeline({ steps, slug, reduced }) {
  const wide = useMinWidth(900)
  const canScene = useMinWidth(768)
  const vertical = steps.length > 6 // too many columns on desktop: stay vertical
  const horizontal = wide && !vertical
  const use3D = scene3D.has(slug) && canScene && !reduced

  const rootRef = useRef(null)
  const olRef = useRef(null)
  const inView = useInView(rootRef, { amount: 0.3 })
  const [active, setActive] = useState(0)
  const [hold, setHold] = useState(false)
  const hoverRef = useRef(false)
  const timerRef = useRef(null)
  const [vm, setVm] = useState({ len: 0, offset: 0 })

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }
  const resumeLater = () => {
    clearTimer()
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      if (!hoverRef.current) setHold(false)
    }, 6000)
  }
  const pick = (i) => { setActive(i); setHold(true); resumeLater() } // focus, tap, click
  const hoverStep = (i) => { hoverRef.current = true; clearTimer(); setHold(true); setActive(i) }
  const enter = () => { hoverRef.current = true; clearTimer(); setHold(true) }
  const leave = () => { hoverRef.current = false; resumeLater() }

  useEffect(() => clearTimer, [])

  // Auto-advance every 4s: not with reduced motion, only while in view, paused while interacting.
  useEffect(() => {
    if (reduced || hold || !inView || steps.length < 2) return undefined
    const id = setInterval(() => setActive((a) => (a + 1) % steps.length), 4000)
    return () => clearInterval(id)
  }, [reduced, hold, inView, steps.length])

  // Vertical layout: measure where the active step sits so the glowing line can reach it.
  useEffect(() => {
    if (horizontal) return undefined
    const measure = () => {
      const nodes = olRef.current?.querySelectorAll('.sd-step')
      if (!nodes || nodes.length < 2) return
      const first = nodes[0].offsetTop
      setVm({
        len: nodes[nodes.length - 1].offsetTop - first,
        offset: nodes[active].offsetTop - first,
      })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [horizontal, active, steps.length])

  const hRatio = steps.length > 1 ? active / (steps.length - 1) : 0
  const vRatio = vm.len ? vm.offset / vm.len : 0
  const label = `Step ${active + 1} · ${steps[active].title}`
  const panel = <ProcessPanel use3D={use3D} index={active} label={label} reduced={reduced} />

  // Keyed items: in the vertical layout the panel sits directly under the active step.
  const items = []
  steps.forEach((step, i) => {
    items.push(
      <Step
        key={step.title}
        step={step}
        index={i}
        active={i === active}
        reduced={reduced}
        onHover={() => hoverStep(i)}
        onPick={() => pick(i)}
      />,
    )
    if (!horizontal && i === active) {
      items.push(
        <li key="sd-panel" className="sd-panel-item" aria-hidden="true">{panel}</li>,
      )
    }
  })

  return (
    <div
      ref={rootRef}
      className="sd-process"
      onPointerEnter={mouseOnly(enter)}
      onPointerLeave={mouseOnly(leave)}
    >
      <div
        className={`sd-timeline${vertical ? ' sd-timeline--v' : ''}`}
        style={{ '--n': steps.length, '--vlen': `${vm.len}px` }}
      >
        <span className="sd-line-track" aria-hidden="true" />
        <motion.span
          key={horizontal ? 'h' : 'v'}
          className="sd-line"
          aria-hidden="true"
          style={{ transformOrigin: horizontal ? 'left center' : 'center top' }}
          initial={reduced ? false : (horizontal ? { scaleX: 0 } : { scaleY: 0 })}
          animate={horizontal ? { scaleX: inView ? hRatio : 0 } : { scaleY: inView ? vRatio : 0 }}
          transition={{ duration: reduced ? 0 : 0.6, ease: 'easeInOut' }}
        />
        <ol className="sd-steps" ref={olRef}>
          {items}
        </ol>
      </div>
      {horizontal && <div className="sd-panel-wrap">{panel}</div>}
    </div>
  )
}

// Native <details>, animated open and close. The answer stays in the DOM at all times.
function FaqItem({ q, a, reduced }) {
  const detailsRef = useRef(null)
  const bodyRef = useRef(null)
  const animRef = useRef(null)
  const closingRef = useRef(false)
  const [isOpen, setIsOpen] = useState(false)

  const onToggle = (e) => {
    e.preventDefault()
    const d = detailsRef.current
    const body = bodyRef.current
    if (!d || !body) return

    const closing = d.open && !closingRef.current
    animRef.current?.cancel()
    setIsOpen(!closing)

    if (reduced || typeof body.animate !== 'function') {
      d.open = !closing
      closingRef.current = false
      return
    }

    if (closing) {
      closingRef.current = true
      const anim = body.animate(
        [{ height: `${body.offsetHeight}px`, opacity: 1 }, { height: '0px', opacity: 0 }],
        { duration: 250, easing: 'ease' },
      )
      animRef.current = anim
      anim.onfinish = () => {
        d.open = false
        closingRef.current = false
        animRef.current = null
      }
    } else {
      closingRef.current = false
      d.open = true
      const anim = body.animate(
        [{ height: '0px', opacity: 0 }, { height: `${body.scrollHeight}px`, opacity: 1 }],
        { duration: 300, easing: 'ease' },
      )
      animRef.current = anim
      anim.onfinish = () => { animRef.current = null }
    }
  }

  return (
    <details ref={detailsRef}>
      <summary onClick={onToggle}>
        {q}
        <span className={`sd-faq-icon${isOpen ? ' is-open' : ''}`} aria-hidden="true" />
      </summary>
      <div className="sd-faq-body" ref={bodyRef}>
        <p>{a}</p>
      </div>
    </details>
  )
}

function NotFound() {
  return (
    <section className="nf">
      <div className="wrap">
        <h1>Page not found</h1>
        <p className="lead dim">The page you are looking for does not exist. Visit our home page or contact us directly.</p>
        <div className="hero-btns">
          <Link className="btn blue" to="/">Back to home</Link>
          <Link className="btn blue" to="/contact">Contact us</Link>
        </div>
      </div>
    </section>
  )
}

function ComingSoon({ solution }) {
  return (
    <>
      <Seo
        title={`${solution.title} in Dubai, UAE | Artek Computers LLC`}
        description={solution.blurb}
        path={`/solutions/${solution.slug}`}
      />
      <section className="hero-band">
        <div className="wrap">
          <Breadcrumbs
            tone="light"
            items={[{ name: 'Home', to: '/' }, { name: 'Solutions', to: '/solutions' }, { name: solution.title }]}
          />
          <h1>{solution.title}</h1>
          <p className="lead">{solution.blurb}</p>
          <p className="hero-note">
            Full details for this service are on the way. Call us or send an enquiry and our team will help you today.
          </p>
          <div className="hero-btns">
            <a className="btn white" href={PHONE_LINK}>Call {PHONE}</a>
            <Link className="btn outline" to={`/contact?service=${solution.slug}`}>Send an enquiry</Link>
          </div>
        </div>
      </section>
    </>
  )
}

function SolutionPage({ solution }) {
  const { page } = solution
  const reduced = useReducedMotion()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])

  const contactHref = `/contact?service=${page.contactValue}`
  const image = IMAGE_BY_SLUG[solution.slug]
  const others = solutions.filter((s) => s.slug !== solution.slug).slice(0, 4)

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: solution.title,
      description: page.seo.description,
      serviceType: solution.title,
      areaServed: 'United Arab Emirates',
      provider: ORG,
    },
    page.faqs?.length
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: page.faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }
      : null,
  ].filter(Boolean)

  return (
    <>
      <Seo title={page.seo.title} description={page.seo.description} path={`/solutions/${solution.slug}`} jsonLd={jsonLd} image={image ? `https://artekcomputer.com${image}` : undefined} />

      {/* Hero: background photo is decorative (aria-hidden); navy gradient if there is no photo */}
      <section className="sd-hero" ref={heroRef}>
        {image && (
          <>
            <motion.div className="sd-hero-bg" aria-hidden="true" style={reduced ? undefined : { y: bgY }}>
              <img
                src={image}
                alt=""
                aria-hidden="true"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                width="1920"
                height="1080"
                style={{ objectPosition: page.heroFocus || 'center 35%' }}
              />
            </motion.div>
            <div className="sd-hero-shade" aria-hidden="true" />
          </>
        )}
        <div className="wrap">
          <div className="sd-hero-content">
            <motion.div
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Breadcrumbs
                tone="light"
                items={[{ name: 'Home', to: '/' }, { name: 'Solutions', to: '/solutions' }, { name: solution.title }]}
              />
            </motion.div>
            <h1><RevealWords text={page.h1} reduced={reduced} delay={0.2} /></h1>
            <motion.span
              className="sd-hero-line"
              aria-hidden="true"
              initial={reduced ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.9, duration: 0.7, ease: 'easeOut' }}
            />
            <motion.p
              className="sd-lead"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6, ease: 'easeOut' }}
            >
              {page.lead}
            </motion.p>
            <div className="sd-hero-btns">
              <a className="sd-btn sd-btn-white" href={PHONE_LINK}>Call {PHONE}</a>
              <Link className="sd-btn sd-btn-ghost" to={contactHref}>Get a free site survey</Link>
            </div>
          </div>
        </div>
      </section>

      {page.offer && (
        <section className="sd-band sd-band--grey" aria-labelledby="offer-h">
          <div className="wrap">
            <SectionTitle id="offer-h" reduced={reduced}>{page.offer.h2}</SectionTitle>
            {page.offer.intro && <p className="sd-intro">{page.offer.intro}</p>}
            <div className="sd-cards" data-count={page.offer.items.length}>
              {page.offer.items.map((item, i) => (
                <OfferCard key={item.title} item={item} index={i} reduced={reduced} />
              ))}
            </div>
            {page.brands?.length > 0 && (
              <div className="sd-brands">
                <strong>Brands:</strong>
                <ul className="sd-pills">
                  {page.brands.map((b) => <li key={b}>{b}</li>)}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {page.feature?.p1 && (
        <section className="sd-band sd-band--white" aria-labelledby="feature-h">
          <div className="wrap">
            <SectionTitle id="feature-h" reduced={reduced}>{page.feature.h2}</SectionTitle>
            <motion.div
              className="sd-callout"
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <span className="sd-callout-icon" aria-hidden="true"><FaShieldAlt /></span>
              <div className="sd-callout-text">
                <p>{page.feature.p1}</p>
                {page.feature.p2 && <p>{page.feature.p2}</p>}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {page.steps && (
        <section className="sd-band sd-band--grey" aria-labelledby="steps-h">
          <div className="wrap">
            <SectionTitle id="steps-h" reduced={reduced}>How it works</SectionTitle>
            <Timeline steps={page.steps} slug={solution.slug} reduced={reduced} />
          </div>
        </section>
      )}

      {page.faqs?.length > 0 && (
        <section className="sd-band sd-band--white" aria-labelledby="faq-h">
          <div className="wrap">
            <SectionTitle id="faq-h" reduced={reduced}>Frequently asked questions</SectionTitle>
            <div className="sd-faq">
              {page.faqs.map((f) => (
                <FaqItem key={f.q} q={f.q} a={f.a} reduced={reduced} />
              ))}
            </div>
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="sd-band sd-band--grey" aria-labelledby="more-h">
          <div className="wrap">
            <SectionTitle id="more-h" reduced={reduced}>Explore other solutions</SectionTitle>
            <div className="sd-more" data-count={others.length}>
              {others.map((s, i) => (
                <MotionLink
                  key={s.slug}
                  to={`/solutions/${s.slug}`}
                  className="sd-more-card"
                  initial={reduced ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={reduced ? undefined : { y: -4, transition: { duration: 0.2, delay: 0 } }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
                >
                  <h3>{s.title}</h3>
                  {s.blurb && <p>{s.blurb}</p>}
                  <span className="sd-more-go">
                    Learn more <FaArrowRight aria-hidden="true" />
                  </span>
                </MotionLink>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Closing call to action */}
      <section className="sd-cta" aria-labelledby="sd-cta-h">
        <div className="wrap">
          <SectionTitle id="sd-cta-h" reduced={reduced}>Ready to talk about your IT or security needs?</SectionTitle>
          <p>Call us or send an enquiry. We will recommend the right solution and quote clearly.</p>
          <div className="sd-cta-btns">
            <a className="sd-btn sd-btn-white" href={PHONE_LINK}>Call {PHONE}</a>
            <Link className="sd-btn sd-btn-ghost" to="/contact">Request a free quote</Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default function Solution() {
  const { slug } = useParams()
  const solution = solutions.find((s) => s.slug === slug)

  if (!solution) return <NotFound />
  if (!solution.page) return <ComingSoon solution={solution} />
  return <SolutionPage solution={solution} />
}
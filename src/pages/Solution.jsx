import { Link, useParams } from 'react-router-dom'
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
  const contactHref = `/contact?service=${page.contactValue}`
  const image = IMAGE_BY_SLUG[solution.slug]

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

      <section className="hero-band sol-hero">
        {image && (
          <>
            <img
              className="sol-hero-img"
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
            <div className="sol-hero-shade" aria-hidden="true" />
          </>
        )}
        <div className="wrap">
          <div className="sol-hero-content">
            <Breadcrumbs
              tone="light"
              items={[{ name: 'Home', to: '/' }, { name: 'Solutions', to: '/solutions' }, { name: solution.title }]}
            />
            <h1>{page.h1}</h1>
            <p className="lead">{page.lead}</p>
            <div className="hero-btns">
              <a className="btn white" href={PHONE_LINK}>Call {PHONE}</a>
              <Link className="btn outline" to={contactHref}>Get a free site survey</Link>
            </div>
          </div>
        </div>
      </section>
      {page.offer && (
        <section className="sol-sec" aria-labelledby="offer-h">
          <div className="wrap">
            <h2 id="offer-h" className="sol-h2">{page.offer.h2}</h2>
            {page.offer.intro && <p className="sol-intro">{page.offer.intro}</p>}
            <div className="sol-cards">
              {page.offer.items.map((item) => (
                <div className="sol-card hover-card" key={item.title}>
                  <item.icon aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
            {page.brands?.length > 0 && (
              <p className="sol-brands-line"><strong>Brands:</strong> {page.brands.join(', ')}</p>
            )}
          </div>
        </section>
      )}

      {page.feature?.p1 && (
        <section className="sol-sec" aria-labelledby="feature-h">
          <div className="wrap">
            <div className="sol-info">
              <h2 id="feature-h" className="sol-h2">{page.feature.h2}</h2>
              <p className="sol-body">{page.feature.p1}</p>
              {page.feature.p2 && <p className="sol-body">{page.feature.p2}</p>}
            </div>
          </div>
        </section>
      )}

      {page.steps && (
        <section className="sol-sec" aria-labelledby="steps-h">
          <div className="wrap">
            <h2 id="steps-h" className="sol-h2">How it works</h2>
            <ol className="sol-steps">
              {page.steps.map((step) => (
                <li key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {page.faqs?.length > 0 && (
        <section className="sol-sec" aria-labelledby="faq-h">
          <div className="wrap">
            <h2 id="faq-h" className="sol-h2">Frequently asked questions</h2>
            <div className="sol-faq">
              {page.faqs.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
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

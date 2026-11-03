import { Link, useLocation, useParams } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import { PHONE, PHONE_LINK, whatsappLink } from '../constants'
import { brandGroups, productGroups, slugify } from '../data/catalog'
import { solutions } from '../data/solutions'

// Category photos live in src/assets/products/<group slug>.<ext>; no file = no figure.
const IMAGE_BY_SLUG = Object.fromEntries(
  Object
    .entries(import.meta.glob('../assets/products/*.{jpg,jpeg,webp,png}', { eager: true, import: 'default' }))
    .map(([file, url]) => [file.split('/').pop().replace(/\.[^.]+$/, ''), url]),
)

// Brand logos live in src/assets/brands/<slugify(brand)>.<ext>; no file = wordmark tile.
const LOGO_BY_SLUG = Object.fromEntries(
  Object
    .entries(import.meta.glob('../assets/brands/*.{svg,png,webp}', { eager: true, import: 'default' }))
    .map(([file, url]) => [file.split('/').pop().replace(/\.[^.]+$/, ''), url]),
)

const FAQS = [
  { q: 'How do I get a quote?', a: 'Send an enquiry with the products and quantities you need, or call +971 4 379 7128. We will quote clearly.' },
  { q: 'Do you supply other products too?', a: 'Yes. See the full list on our Products page.' },
]

const SUFFIX = ' Supplied and supported by Artek Computers LLC in Dubai.'

// Meta description = intro + suffix, trimmed to 160 characters at a word boundary.
function metaDescription(intro) {
  const full = intro + SUFFIX
  if (full.length <= 160) return full
  const cut = full.slice(0, 160)
  return cut.slice(0, cut.lastIndexOf(' ')).trim()
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

export default function ProductCategory() {
  const { group: groupSlug } = useParams()
  const { pathname } = useLocation()
  const group = productGroups.find((g) => g.slug === groupSlug)

  if (!group) return <NotFound />

  const image = IMAGE_BY_SLUG[group.slug]
  const brandGroup = brandGroups.find((b) => b.title === group.brandGroupTitle)
  const relatedSolution = solutions.find((s) => s.slug === group.relatedSolution)
  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: group.items.map((name, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Thing',
            name,
            url: `https://artekcomputer.com/products/${group.slug}#${slugify(name)}`,
          },
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
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]

  return (
    <>
      <Seo
        title={`${group.title} in Dubai | Artek Computers LLC`}
        description={metaDescription(group.intro)}
        path={`/products/${group.slug}`}
        jsonLd={jsonLd}
        image={image ? `https://artekcomputer.com${image}` : undefined}
      />

      <section className="hero-band">
        <div className="wrap">
          <Breadcrumbs
            tone="light"
            items={[{ name: 'Home', to: '/' }, { name: 'Products', to: '/products' }, { name: group.title }]}
          />
          <h1>{group.title} in Dubai</h1>
          <p className="lead">{group.intro}</p>
        </div>
      </section>

      <section className="pcat" aria-labelledby="pcat-h">
        <div className="wrap">
          <h2 id="pcat-h" className="sr-only">{group.title} we supply</h2>
          <div className={image ? 'pcat-split' : 'pcat-full'}>
            <div className="pcat-items">
              {group.items.map((name) => {
                const slug = slugify(name)
                const waText = `Hi, I'm interested in ${name} (${group.title}). ${origin}${pathname}#${slug}`
                return (
                  <div className="ac-card hover-card cat-item pq-item" id={slug} key={name}>
                    <h3>{name}</h3>
                    <div className="pq-actions">
                      <Link
                        className="pq-btn pq-quote"
                        to={`/contact?product=${encodeURIComponent(name)}&category=${encodeURIComponent(group.title)}`}
                        rel="nofollow"
                        aria-label={`Request a quote for ${name}`}
                      >
                        Get a quote
                      </Link>
                      <a
                        className="pq-btn pq-wa"
                        href={whatsappLink(waText)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Ask about ${name} on WhatsApp (opens in a new tab)`}
                      >
                        <FaWhatsapp aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
            {image && (
              <figure className="sol-photo pcat-photo">
                <img
                  src={image}
                  alt={`${group.title} supplied by Artek Computers LLC`}
                  loading="lazy"
                  decoding="async"
                  width="800"
                  height="500"
                />
              </figure>
            )}
          </div>
        </div>
      </section>

      {brandGroup && (
        <section className="pcat-brands" aria-labelledby="pcat-brands-h">
          <div className="wrap">
            <h2 id="pcat-brands-h">Brands we supply in this area</h2>
            <div className="brand-tiles">
              {brandGroup.brands.map((brand) => {
                const logo = LOGO_BY_SLUG[slugify(brand)]
                return (
                  <div className="brand-tile" key={brand}>
                    {logo
                      ? <img src={logo} alt={brand} width="120" height="36" loading="lazy" />
                      : <span className="wordmark">{brand}</span>}
                  </div>
                )
              })}
            </div>
            <p className="brands-more"><Link to="/brands">See all brands</Link></p>
          </div>
        </section>
      )}

      {relatedSolution && (
        <section className="pcat-related" aria-labelledby="pcat-related-h">
          <div className="wrap">
            <h2 id="pcat-related-h">Need installation or support?</h2>
            <p className="pcat-related-p">Where this is part of a project we can also plan, install and support it.</p>
            <p className="brands-more">
              <Link to={`/solutions/${relatedSolution.slug}`}>{relatedSolution.title}</Link>
            </p>
          </div>
        </section>
      )}

      <section className="faq-sec" aria-labelledby="pcat-faq-h">
        <div className="wrap">
          <h2 id="pcat-faq-h">Frequently asked questions</h2>
          <div className="faq">
            {FAQS.map((f) => (
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
          <h2>Looking for {group.title.toLowerCase()}?</h2>
          <p>
            Tell us the products and quantities you need. We will check availability, quote clearly and handle
            delivery and support.
          </p>
          <div className="hero-btns">
            <a className="btn white" href={PHONE_LINK}>Call {PHONE}</a>
            <Link className="btn outline" to="/contact">Request a free quote</Link>
          </div>
        </div>
      </section>
    </>
  )
}
import { Link, useLocation } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import { PHONE, PHONE_LINK, whatsappLink } from '../constants'
import { productGroups, slugify } from '../data/catalog'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: productGroups.map((g, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Thing',
        name: g.title,
        url: `https://artekcomputer.com/products#${g.slug}`,
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
}

export default function Products() {
  const { pathname } = useLocation()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  return (
    <>
      <Seo
        title="Products in Dubai: Cabling, Networking, Computers and Security | Artek Computers LLC"
        description="Cat6 and fiber cabling, switches, routers, cabinets, UPS, laptops, desktops, IP phones and CCTV cable, supplied and supported by Artek Computers LLC in Dubai."
        path="/products"
        jsonLd={jsonLd}
      />

      <section className="hero-band">
        <div className="wrap">
          <Breadcrumbs tone="light" items={[{ name: 'Home', to: '/' }, { name: 'Products' }]} />
          <h1>IT, cabling and security products in Dubai</h1>
          <p className="lead">
            Cables, networking, computers and security equipment, supplied and supported by Artek Computers LLC.
          </p>
        </div>
      </section>

      <nav className="cat-nav" aria-label="Product groups">
        <div className="wrap">
          {productGroups.map((g) => (
            <a key={g.slug} href={`#${g.slug}`}>{g.title}</a>
          ))}
        </div>
      </nav>

      {productGroups.map((g) => (
        <section className="cat-sec" id={g.slug} key={g.slug} aria-labelledby={`${g.slug}-h`}>
          <div className="wrap">
            <h2 id={`${g.slug}-h`}><Link to={`/products/${g.slug}`}>{g.title}</Link></h2>
            <p className="cat-view"><Link to={`/products/${g.slug}`}>View {g.title}</Link></p>
            <div className="cat-grid">
              {g.items.map((name) => {
                const slug = slugify(name)
                const waText = `Hi, I'm interested in ${name} (${g.title}). ${origin}${pathname}#${slug}`
                return (
                  <div className="ac-card hover-card cat-item pq-item" id={slug} key={name}>
                    <h3>{name}</h3>
                    <div className="pq-actions">
                      <Link
                        className="pq-btn pq-quote"
                        to={`/contact?product=${encodeURIComponent(name)}&category=${encodeURIComponent(g.title)}`}
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
          </div>
        </section>
      ))}

      <section className="closing">
        <div className="wrap">
          <h2>Looking for a specific product?</h2>
          <p>
            Tell us the product and brand you need. We will check availability, quote clearly and handle
            delivery, installation and support.
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
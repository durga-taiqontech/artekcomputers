import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import { PHONE, PHONE_LINK } from '../constants'
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
            <h2 id={`${g.slug}-h`}>{g.title}</h2>
            <div className="cat-grid">
              {g.items.map((name) => (
                <div className="ac-card hover-card cat-item" id={slugify(name)} key={name}>
                  <h3>{name}</h3>
                  <Link className="enq" to={`/contact?service=products&product=${encodeURIComponent(name)}`}>
                    Enquire
                  </Link>
                </div>
              ))}
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

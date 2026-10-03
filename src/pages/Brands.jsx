import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import { PHONE, PHONE_LINK } from '../constants'
import { brandGroups, slugify } from '../data/catalog'

// Brand logos live in src/assets/brands/<slugify(brand)>.<ext>; a brand with
// no file renders as a wordmark instead. Missing folder = no logos, by design.
const LOGO_BY_SLUG = Object.fromEntries(
  Object
    .entries(import.meta.glob('../assets/brands/*.{svg,png,webp}', { eager: true, import: 'default' }))
    .map(([file, url]) => [file.split('/').pop().replace(/\.[^.]+$/, ''), url]),
)

// Groups at or under this size pair up side by side; the rest span the page.
const SHORT_GROUP = 6

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: brandGroups.map((g, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: { '@type': 'Thing', name: g.title },
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

export default function Brands() {
  return (
    <>
      <Seo
        title="Brands We Supply in Dubai | Cisco, Fortinet, Hikvision, Dell, HP | Artek Computers LLC"
        description="Networking, cabling, security, power and computer brands supplied and supported by Artek Computers LLC in Dubai."
        path="/brands"
        jsonLd={jsonLd}
      />

      <section className="hero-band">
        <div className="wrap">
          <Breadcrumbs tone="light" items={[{ name: 'Home', to: '/' }, { name: 'Brands' }]} />
          <h1>Brands we supply in Dubai</h1>
          <p className="lead">
            Technology from the brands your business already trusts, supplied and supported by Artek Computers LLC.
          </p>
        </div>
      </section>

      <section className="brands-page">
        <div className="wrap">
          <div className="brand-panels">
            {brandGroups.map((g) => (
              <div className={`brand-panel${g.brands.length <= SHORT_GROUP ? ' half' : ''}`} key={g.title}>
                <h2>{g.title}</h2>
                <div className="brand-tiles">
                  {g.brands.map((brand) => {
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
              </div>
            ))}
          </div>
          <p className="brand-note">All brand names are trademarks of their respective owners.</p>
        </div>
      </section>

      <section className="closing">
        <div className="wrap">
          <h2>Do not see the brand you need?</h2>
          <p>
            We supply many more brands than we can list. Tell us what you are looking for and we will source
            it, supply it and support it.
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

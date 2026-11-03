import {
  SITE,
  SITE_NAME,
  LOGO,
  PHONE,
  EMAIL,
  ADDRESS,
  SAME_AS,
  absoluteUrl,
} from './site'

export const ORG_ID = `${SITE}/#organization`
const WEBSITE_ID = `${SITE}/#website`

export const graph = (...nodes) => ({
  '@context': 'https://schema.org',
  '@graph': nodes.filter(Boolean),
})

export const localBusiness = () => ({
  '@type': 'LocalBusiness',
  '@id': ORG_ID,
  name: SITE_NAME,
  alternateName: 'أرتيك للكمبيوتر ش.ذ.م.م',
  url: `${SITE}/`,
  logo: LOGO,
  image: LOGO,
  telephone: PHONE,
  email: EMAIL,
  address: { '@type': 'PostalAddress', ...ADDRESS },
  areaServed: [
    { '@type': 'City', name: 'Dubai' },
    { '@type': 'Country', name: 'United Arab Emirates' },
  ],
  sameAs: SAME_AS,
})

export const webSite = () => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE}/`,
  name: SITE_NAME,
  publisher: { '@id': ORG_ID },
})

// trail: [{ name, path }, ...] starting from Home.
export const breadcrumb = (trail) => ({
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
})

export const service = (solution, path) => ({
  '@type': 'Service',
  '@id': `${absoluteUrl(path)}#service`,
  name: solution.page.h1,
  serviceType: solution.title,
  description: solution.page.seo.description,
  url: absoluteUrl(path),
  provider: { '@id': ORG_ID },
  areaServed: [
    { '@type': 'City', name: 'Dubai' },
    { '@type': 'Country', name: 'United Arab Emirates' },
  ],
})

// Only use this where the same questions are visible on the page.
export const faqPage = (faqs) =>
  faqs && faqs.length
    ? {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null

// Names only (no Product schema: there are no prices/offers to mark up).
export const itemList = (names) => ({
  '@type': 'ItemList',
  itemListElement: names.map((name, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
  })),
})

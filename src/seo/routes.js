// One place that knows every indexable URL and its title, description and
// JSON-LD. Used by:
//   - pages:      <Seo {...seoFor('/products')} />
//   - prerender:  scripts/prerender.mjs (via entry-server.jsx)
//   - sitemap.xml generation
import { solutions } from '../data/solutions'
import { productGroups } from '../data/catalog'
import { BRAND_SHORT } from './site'
import {
  graph,
  localBusiness,
  webSite,
  breadcrumb,
  service,
  faqPage,
  itemList,
} from './schema'

const HOME = { name: 'Home', path: '/' }
const SOLUTIONS = { name: 'Solutions', path: '/solutions' }
const PRODUCTS = { name: 'Products', path: '/products' }

// Titles from solutions.js are 70-100 characters, and Google cuts them at
// roughly 60. These shorter versions keep the keyword + "Dubai" visible.
const SOLUTION_TITLES = {
  'cctv-security': `SIRA-compliant CCTV Installation in Dubai | ${BRAND_SHORT}`,
  'elv-access-control': `ELV, AV & Access Control Systems in Dubai | ${BRAND_SHORT}`,
  'it-services': `IT Service Provider in Dubai | ${BRAND_SHORT}`,
  'network-solutions': `Network & Structured Cabling in Dubai | ${BRAND_SHORT}`,
  cybersecurity: `Cybersecurity Solutions in Dubai | ${BRAND_SHORT}`,
  'cloud-computing': `Cloud Computing Services in Dubai | ${BRAND_SHORT}`,
  'microsoft-solutions': `Microsoft Licensing & Solutions in Dubai | ${BRAND_SHORT}`,
  'computer-systems': `Laptops, Computers & Servers in Dubai | ${BRAND_SHORT}`,
  'voice-telephony': `IP Telephony & PBX Systems in Dubai | ${BRAND_SHORT}`,
  'data-center-relocation': `Data Center & Server Relocation in Dubai | ${BRAND_SHORT}`,
}

const staticPages = {
  '/': {
    title: `SIRA-compliant CCTV & IT Services in Dubai | ${BRAND_SHORT}`,
    description:
      'CCTV, access control, networking, IT support and cabling for businesses in Dubai, from Artek Computers on Computer Street, Bur Dubai. Book a free site survey.',
    jsonLd: () => graph(localBusiness(), webSite()),
  },
  '/company': {
    title: `About Artek Computers LLC | IT & Security Company in Dubai`,
    description:
      'Artek Computers LLC is an IT integrated systems company on Computer Street, Bur Dubai, providing IT, networking, CCTV and ELV solutions for businesses across the UAE.',
    jsonLd: () => graph(breadcrumb([HOME, { name: 'Company', path: '/company' }])),
  },
  '/contact': {
    title: `Contact Artek Computers | Computer Street, Bur Dubai`,
    description:
      'Call +971 4 379 7128 or WhatsApp +971 50 223 6842, or request a free site survey from Artek Computers, Al Rafa Road, Computer Street, Bur Dubai.',
    jsonLd: () => graph(breadcrumb([HOME, { name: 'Contact', path: '/contact' }])),
  },
  '/solutions': {
    title: `IT, Security & ELV Solutions in Dubai | ${BRAND_SHORT}`,
    description:
      'CCTV, access control, networking, cybersecurity, cloud, Microsoft licensing, computer systems, telephony and data center relocation for UAE businesses.',
    jsonLd: () => graph(breadcrumb([HOME, SOLUTIONS])),
  },
  '/products': {
    title: `IT, Cabling & Security Products in Dubai | ${BRAND_SHORT}`,
    description:
      'Cat6, Cat6A, Cat8 and fiber optic cabling, CCTV and ELV cables, cabinets, networking, computers and IP phones from Artek Computers, Bur Dubai. Get a quote on WhatsApp.',
    jsonLd: () => graph(breadcrumb([HOME, PRODUCTS])),
  },
  '/brands': {
    title: `Brands We Supply in Dubai | ${BRAND_SHORT}`,
    description:
      'Belden, Panduit, Corning, Cisco, Fortinet, Hikvision, Dell, HP and more, supplied and supported by Artek Computers in Bur Dubai. Request a quote.',
    jsonLd: () => graph(breadcrumb([HOME, { name: 'Brands', path: '/brands' }])),
  },
}

const NOT_FOUND = {
  title: `Page not found | ${BRAND_SHORT}`,
  description: 'This page could not be found.',
  noindex: true,
}

const clean = (p) => (p.length > 1 ? p.replace(/\/+$/, '') : p)

export function seoFor(rawPath) {
  const path = clean(rawPath)

  const page = staticPages[path]
  if (page) {
    return { title: page.title, description: page.description, path, jsonLd: page.jsonLd() }
  }

  const sol = path.match(/^\/solutions\/([^/]+)$/)
  if (sol) {
    const s = solutions.find((x) => x.slug === sol[1])
    if (s) {
      return {
        title: SOLUTION_TITLES[s.slug] ?? s.page.seo.title,
        description: s.page.seo.description,
        path,
        jsonLd: graph(
          breadcrumb([HOME, SOLUTIONS, { name: s.title, path }]),
          service(s, path),
          faqPage(s.page.faqs),
        ),
      }
    }
  }

  const grp = path.match(/^\/products\/([^/]+)$/)
  if (grp) {
    const g = productGroups.find((x) => x.slug === grp[1])
    if (g) {
      return {
        title: `${g.title} in Dubai | ${BRAND_SHORT}`,
        description: `${g.intro} Supplied by Artek Computers, Bur Dubai. Get a quote.`,
        path,
        jsonLd: graph(
          breadcrumb([HOME, PRODUCTS, { name: g.title, path }]),
          itemList(g.items),
        ),
      }
    }
  }

  return { ...NOT_FOUND, path }
}

// Every URL that should be prerendered and listed in sitemap.xml.
export function getPageRoutes() {
  return [
    ...Object.keys(staticPages),
    ...solutions.map((s) => `/solutions/${s.slug}`),
    ...productGroups.map((g) => `/products/${g.slug}`),
  ]
}
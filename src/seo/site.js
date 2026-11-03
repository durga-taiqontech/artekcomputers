// Single source of truth for site-wide facts used in meta tags and JSON-LD.
// Keep the name, address and phone EXACTLY the same as on the Google
// Business Profile and in the footer (local SEO "NAP" consistency).

export const SITE = 'https://artekcomputer.com'
export const SITE_NAME = 'Artek Computers LLC'
export const BRAND_SHORT = 'Artek Computers'

// TODO: add a 1200x630 image at public/og-default.jpg (used for link previews
// on WhatsApp, LinkedIn, Facebook, X).
export const OG_IMAGE = `${SITE}/og-default.jpg`
// TODO: copy src/assets/logo.png to public/logo.png (or change this path).
export const LOGO = `${SITE}/logo.png`

export const PHONE = '+971 4 379 7128'
export const WHATSAPP_PHONE = '+971 50 223 6842'
export const EMAIL = 'sales@artekteam.com'

export const ADDRESS = {
  postOfficeBoxNumber: '112280',
  streetAddress: 'Al Rafa Road, Computer Street, Bur Dubai',
  addressLocality: 'Dubai',
  addressCountry: 'AE',
}

export const SAME_AS = [
  'https://www.facebook.com/ArtekComputers',
  'https://x.com/Artekcomputers/',
  'https://www.instagram.com/artek_computers/',
  'https://www.linkedin.com/company/artek-computers-llc/',
  'https://www.pinterest.com/artekcomputers/',
]

// Canonical URL convention: no trailing slash, except the homepage.
export function absoluteUrl(path = '/') {
  const clean = path.length > 1 ? path.replace(/\/+$/, '') : path
  return `${SITE}${clean}`
}
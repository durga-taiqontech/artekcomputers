// Old WordPress URL -> new URL. Becomes real 301 redirects at build time
// (dist/_redirects). Built from the links seen on the old homepage only:
// compare against the old sitemap (artekcomputer.com/sitemap_index.xml)
// and add anything missing before launch.
//
// Decision to confirm: the old "Company" menu item pointed at
// /it-solutions-company-dubai/. It is mapped to the IT Services page because
// that is the keyword it ranks for. Change it to '/company' if you prefer.

const CCTV = '/solutions/cctv-security'
const ELV = '/solutions/elv-access-control'
const IT = '/solutions/it-services'
const NET = '/solutions/network-solutions'
const PCS = '/solutions/computer-systems'

export const redirects = [
  // Already existed in the new app
  ['/elv-access-control', ELV],

  // Core pages
  ['/contact-us', '/contact'],
  ['/it-products-dubai', '/products'],

  // Solutions
  ['/enterprise-computer-systems-uae', PCS],
  ['/microsoft-solutions', '/solutions/microsoft-solutions'],
  ['/network-solutions', NET],
  ['/voice-telephony-solutions', '/solutions/voice-telephony'],
  ['/voice-telephony', '/solutions/voice-telephony'],
  ['/cloud-computing', '/solutions/cloud-computing'],
  ['/data-center-relocation-uae', '/solutions/data-center-relocation'],
  ['/cybersecurity-solutions', '/solutions/cybersecurity'],
  ['/vapt-services-in-dubai-uae-artek-computers-llc', '/solutions/cybersecurity'],

  // CCTV and access control
  ['/sira-approved-cctv-company-dubai', CCTV],
  ['/sira', CCTV], // until a dedicated SIRA page exists
  ['/cctv-installation-service-in-dubai', CCTV],
  ['/cctv-camera-maintenance-dubai', CCTV],
  ['/best-cctv-distributor-in-dubai', CCTV],
  ['/hikvision-distributor-in-dubai', CCTV],
  ['/hikvision-supplier-in-uae', CCTV],
  ['/access-control-systems-uae', ELV],
  ['/access-control-solutions-in-dubai', ELV],
  ['/biometric-access-control-solutions-in-dubai', ELV],

  // IT services (several near-duplicate pages merged into one)
  ['/it-solutions-company-dubai', IT],
  ['/it-service-provider-in-dubai', IT],
  ['/it-service', IT],
  ['/it-support-companies-in-dubai', IT],
  ['/it-solutions-in-uae', IT],
  ['/it-company-in-dubai', IT],

  // Cabling and computers
  ['/structured-cabling-supplier-in-dubai', '/products/copper-cabling'],
  ['/networking-cabling-suppliers-in-dubai', '/products/copper-cabling'],
  ['/computer-distributor-in-dubai', '/products/computers'],
  ['/computer-sales-and-services-dubai', PCS],
  ['/laptop-repair-services-in-dubai', PCS],
  ['/laptop-accessories-supplier-in-dubai', '/products/computers'],
  ['/laptop-spare-parts-in-dubai', '/products/computers'],

  // Not mapped yet: /blog/ (no blog in the new app) and old blog posts.
]
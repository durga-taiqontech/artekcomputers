// Source of truth for the product catalogue (/products) and the brand lists
// (/brands). Names only: no descriptions, prices, claims or images.

// "MPO & MTP Patch Cords" -> "mpo-mtp-patch-cords". Used for group anchors on
// /products and for item card ids, so keep it stable.
export function slugify(name) {
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const productGroups = [
  {
    slug: 'copper-cabling',
    title: 'Copper cabling',
    items: [
      'Cat6 Cable',
      'Cat6 Outdoor Cable',
      'Cat6A Cable',
      'Cat7 Cable',
      'Cat8 Cable',
      'Network Cable',
      'Copper Patch Cord',
      'Copper Patch Panel',
    ],
  },
  {
    slug: 'fiber-optic',
    title: 'Fiber optic',
    items: [
      'Fiber Adaptor',
      'Fiber Optic Cable',
      'Fiber Optic Patch Cord',
      'Fiber Optic Patch Panels',
      'Fiber Optic Pigtails',
      'Fiber Optic Splitter',
      'FO Distribution Box',
      'FTTH Drop Cable',
      'MPO & MTP Patch Cords',
      'Media Converter',
      'PLC Splitter',
      'Transceiver',
    ],
  },
  {
    slug: 'specialty-cables',
    title: 'Specialty and ELV cables',
    items: [
      'Audio Cable',
      'CCTV Cable',
      'Control Cable',
      'EIB BUS Cable',
      'Fire Alarm Cable',
      'HDMI Cable',
      'Instrumentation Cable',
      'Lift Cable',
      'RG59 Cable',
      'RG6 Cable',
      'Speaker Cable',
    ],
  },
  {
    slug: 'cabinets-power',
    title: 'Cabinets and power',
    items: ['Network Cabinet', 'Patch Free Cabinet', 'PDU', 'UPS'],
  },
  {
    slug: 'networking',
    title: 'Networking',
    items: ['Network Router', 'Network Switches', 'Industrial Switches'],
  },
  {
    slug: 'computers',
    title: 'Computers',
    items: ['Desktops', 'Gaming PC', 'Laptops'],
  },
  {
    slug: 'telephony-displays',
    title: 'Telephony and displays',
    items: ['IP PBX', 'IP Phone', 'Interactive Screen'],
  },
]

export const brandGroups = [
  {
    title: 'Copper and fiber cabling',
    brands: [
      'Belden',
      'Panduit',
      'ExTell',
      'Corning',
      '3M',
      'Opterna',
      'Norden',
      'Dconnect',
      'Molex',
      'Kuwes',
      'Techlogiks',
    ],
  },
  {
    title: 'Networking and IT infrastructure',
    brands: [
      'Cisco',
      'Fortinet',
      'SonicWall',
      'Ubiquiti',
      'Aruba',
      'Ruckus',
      'D-Link',
      'Linksys',
      'TP-Link',
      'MikroTik',
      'Grandstream',
      'EnGenius',
    ],
  },
  {
    title: 'ELV and security',
    brands: ['Hikvision', 'Dahua', 'Axis', 'Toten'],
  },
  {
    title: 'Power and cooling',
    brands: ['APC', 'Eaton', 'Schneider'],
  },
  {
    title: 'Computers, storage and peripherals',
    brands: [
      'Dell',
      'HP',
      'Lenovo',
      'Apple',
      'Acer',
      'ASUS',
      'Samsung',
      'Synology',
      'QNAP',
      'WD',
      'Seagate',
      'Epson',
      'Brother',
      'Logitech',
      'Microsoft',
      'Kaspersky',
      'Symantec',
    ],
  },
]

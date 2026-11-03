// Runs after the client build and the SSR build (see the "build" script).
// For every route it writes dist/<route>/index.html containing the rendered
// page and its head tags, then writes sitemap.xml, robots.txt, _redirects and
// 404.html.
import { access, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-server')

async function findEntry() {
  for (const name of ['entry-server.js', 'entry-server.mjs']) {
    const file = path.join(ssrDir, name)
    try {
      await access(file)
      return file
    } catch {
      /* try the next name */
    }
  }
  throw new Error('SSR bundle not found in dist-server/. Did the SSR build run?')
}

const { render, getPageRoutes, seoFor, redirects, SITE, SITE_NAME, OG_IMAGE, absoluteUrl } =
  await import(pathToFileURL(await findEntry()).href)

const template = await readFile(path.join(dist, 'index.html'), 'utf8')
if (!template.includes('<div id="root"></div>')) {
  throw new Error('dist/index.html has no <div id="root"></div> to render into.')
}

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function headFor(seo) {
  const tags = [
    `<title>${esc(seo.title)}</title>`,
    `<meta name="description" content="${esc(seo.description)}">`,
    `<meta name="robots" content="${seo.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}">`,
  ]
  if (!seo.noindex) {
    tags.push(
      `<link rel="canonical" href="${esc(absoluteUrl(seo.path))}">`,
      `<meta property="og:url" content="${esc(absoluteUrl(seo.path))}">`,
      
    )
  }
  tags.push(
    `<meta property="og:title" content="${esc(seo.title)}">`,
    `<meta property="og:description" content="${esc(seo.description)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}">`,
    `<meta property="og:image" content="${esc(OG_IMAGE)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(seo.title)}">`,
    `<meta name="twitter:description" content="${esc(seo.description)}">`,
    `<meta name="twitter:image" content="${esc(OG_IMAGE)}">`,
  )
  if (seo.jsonLd) {
    const json = JSON.stringify(seo.jsonLd).replace(/</g, '\\u003c')
    tags.push(`<script type="application/ld+json" data-seo-prerender>${json}</script>`)
  }
  return tags.join('\n    ')
}

// Replacement callbacks (not strings) so "$&" etc. in the HTML stay literal.
// Replacement callbacks (not strings) so "$&" etc. in the HTML stay literal.
function buildPage(seo, body) {
  return template
    .replace(/<title>[\s\S]*?<\/title>/i, () => '')
    .replace(/<meta\s+name=["']description["'][^>]*>/i, () => '')
    .replace(/<link\s+rel=["']canonical["'][^>]*>/i, () => '')
    .replace(/<meta\s+name=["']robots["'][^>]*>/gi, () => '')
    .replace(/<meta\s+(?:property|name)=["'](?:og:|twitter:)[^"']*["'][^>]*>/gi, () => '')
    .replace('</head>', () => `    ${headFor(seo)}\n  </head>`)
    .replace('<div id="root"></div>', () => `<div id="root">${body}</div>`)
}

async function writePage(file, html) {
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, html)
}

// 1. Pages
const routes = getPageRoutes()
for (const route of routes) {
  const html = buildPage(seoFor(route), render(route))
  const file =
    route === '/' ? path.join(dist, 'index.html') : path.join(dist, route, 'index.html')
  await writePage(file, html)
}

// 2. 404 (the host serves it with a 404 status for unknown URLs)
await writePage(path.join(dist, '404.html'), buildPage(seoFor('/404'), render('/404')))

// 3. sitemap.xml and robots.txt
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes.map((r) => `  <url><loc>${esc(absoluteUrl(r))}</loc></url>`).join('\n') +
  `\n</urlset>\n`
await writeFile(path.join(dist, 'sitemap.xml'), sitemap)
await writeFile(
  path.join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`,
)

// 4. 301 redirects (Netlify / Cloudflare Pages format). Both the plain and the
//    trailing-slash form are listed because the old WordPress URLs ended in "/".
const lines = redirects.flatMap(([from, to]) => [`${from} ${to} 301`, `${from}/ ${to} 301`])
await writeFile(path.join(dist, '_redirects'), lines.join('\n') + '\n')

// 5. Tidy up
await rm(ssrDir, { recursive: true, force: true })

console.log(
  `Prerendered ${routes.length} pages + 404.html, sitemap.xml, robots.txt and ${redirects.length} redirects.`,
)

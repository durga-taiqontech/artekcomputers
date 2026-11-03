import { useEffect } from 'react'
import { SITE_NAME, OG_IMAGE, absoluteUrl } from '../seo/site'

/**
 * Keeps title, description, canonical, Open Graph, Twitter and JSON-LD in
 * sync while people navigate inside the app.
 *
 * The prerender step (scripts/prerender.mjs) writes the same tags into each
 * page's static HTML, so crawlers and link previews see them without running
 * JavaScript. Usage:  <Seo {...seoFor('/products')} />
 */
export default function Seo({
  title,
  description,
  path,
  jsonLd,
  image = OG_IMAGE,
  noindex = false,
}) {
  const ld = jsonLd ? JSON.stringify(jsonLd) : null

  useEffect(() => {
    document.title = title

    const setMeta = (attr, key, content) => {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('name', 'description', description)
    setMeta(
      'name',
      'robots',
      noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large',
    )

    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:site_name', SITE_NAME)
    setMeta('property', 'og:image', image)

    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', image)

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (noindex) {
      canonical?.remove()
    } else {
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.rel = 'canonical'
        document.head.appendChild(canonical)
      }
      canonical.href = absoluteUrl(path)
      setMeta('property', 'og:url', absoluteUrl(path))
    }

    // Drop the JSON-LD the prerender wrote, then add the current page's.
    document.head
      .querySelectorAll('script[data-seo-prerender]')
      .forEach((node) => node.remove())
    let script = null
    if (ld) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = ld
      document.head.appendChild(script)
    }
    return () => script?.remove()
  }, [title, description, path, ld, image, noindex])

  return null
}
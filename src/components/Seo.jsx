import { useEffect } from 'react'

const SITE = 'https://artekcomputer.com'

/**
 * Sets document title, meta description, canonical link and Open Graph tags,
 * creating any tag that is missing. Optionally injects JSON-LD structured
 * data, removed again on unmount.
 */
export default function Seo({ title, description, path, jsonLd, image }) {
  useEffect(() => {
    document.title = title
    const url = `${SITE}${path}`

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
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:url', url)
    if (image) {
      setMeta('property', 'og:image', image)
      setMeta('name', 'twitter:image', image)
    }

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url

    const scripts = (jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []).map((entry) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(entry)
      document.head.appendChild(script)
      return script
    })
    return () => {
      scripts.forEach((script) => script.remove())
    }
  }, [title, description, path, jsonLd, image])

  return null
}

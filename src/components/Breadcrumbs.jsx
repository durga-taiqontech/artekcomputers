import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const SITE = 'https://artekcomputer.com'

/**
 * Breadcrumb trail. `items` is [{name, to}] with the last item carrying no
 * `to`. `tone` is "light" for dark hero bands and "dark" for the page
 * background. Injects a BreadcrumbList JSON-LD script while mounted.
 */
export default function Breadcrumbs({ items, tone = 'dark' }) {
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        ...(item.to ? { item: `${SITE}${item.to}` } : {}),
      })),
    })
    document.head.appendChild(script)
    return () => script.remove()
  }, [items])

  return (
    <nav aria-label="Breadcrumb" className={`crumbs ${tone}`}>
      <ol>
        {items.map((item) => (
          <li key={item.name}>
            {item.to
              ? <Link to={item.to}>{item.name}</Link>
              : <span aria-current="page">{item.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

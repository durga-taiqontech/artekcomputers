import { renderToString } from 'react-dom/server'
// React Router v7 exports StaticRouter from 'react-router'. If your installed
// version reports it missing, import it from 'react-router-dom/server' instead.
import { StaticRouter } from 'react-router'
import App from './App'

export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  )
}

// Re-exported so scripts/prerender.mjs only has to load this one bundle.
export { getPageRoutes, seoFor } from './seo/routes'
export { redirects } from './seo/redirects'
export { SITE, SITE_NAME, OG_IMAGE, absoluteUrl } from './seo/site'
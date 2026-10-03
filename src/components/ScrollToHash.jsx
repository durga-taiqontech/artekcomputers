import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Fragment scrolling for the whole app. React Router does not scroll to
 * #fragments on its own, so on every location change: with a hash, wait for
 * the element to exist (retrying for up to 1 second) and scroll it into view —
 * targets carry scroll-margin-top so the fixed navbar clears them; without a
 * hash, jump to the top of the page. Smooth unless the visitor prefers
 * reduced motion.
 */
export default function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }
    const id = hash.slice(1)
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    let tries = 0
    const timer = setInterval(() => {
      const el = document.getElementById(id)
      tries += 1
      if (el) {
        clearInterval(timer)
        el.scrollIntoView({ behavior })
      } else if (tries >= 20) {
        clearInterval(timer)
      }
    }, 50)
    return () => clearInterval(timer)
  }, [pathname, hash])

  return null
}

import { Suspense, useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/**
 * Renders `fallback` on the server and during hydration, then the real
 * children in the browser. Use it around the three.js scenes so the prerender
 * never loads them, and so they download only after the page has painted.
 *
 *   const HeroCamera = lazy(() => import('../components/HeroCamera'))
 *   <ClientOnly fallback={<img src={heroPoster} alt="CCTV camera" />}>
 *     <HeroCamera />
 *   </ClientOnly>
 */
export default function ClientOnly({ children, fallback = null }) {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
  return mounted ? <Suspense fallback={fallback}>{children}</Suspense> : fallback
}
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { FaPhoneAlt, FaWhatsapp, FaEnvelope } from 'react-icons/fa'
import mark from '../assets/logo-mark.png'
import { solutions } from '../data/solutions'
import { productGroups, brandGroups, slugify } from '../data/catalog'
import { PHONE, PHONE_LINK, WHATSAPP, COMPANY_NAME_AR } from '../constants'

// Products columns: three groups stand alone, the rest stack in the fourth.
const [pFirst, pSecond, pThird, ...pRest] = productGroups
const productColumns = [[pFirst], [pSecond], [pThird], pRest].filter((c) => c[0])

// Brands columns: groups 1 and 2 stand alone, groups 3 and 4 stack, group 5+ last.
const brandColumns = [
  [brandGroups[0]],
  [brandGroups[1]],
  [brandGroups[2], brandGroups[3]],
  brandGroups.slice(4),
].map((c) => c.filter(Boolean)).filter((c) => c.length)

function Mega({ columns, groupTo, itemTo, itemsOf, allTo, allLabel, onLink }) {
  return (
    <div className="mega">
      <div className="mega-scroll">
        <div className="mega-grid">
          {columns.map((groups, i) => (
            <div className="mega-col" key={i}>
              {groups.map((g) => {
                const items = itemsOf(g)
                return (
                  <div className={`mega-group${items.length > 12 ? ' two' : ''}`} key={g.slug || g.title}>
                    <Link className="mega-h" to={groupTo(g)} onClick={onLink}>{g.title}</Link>
                    <ul>
                      {items.map((name) => (
                        <li key={name}>
                          <Link to={itemTo(g, name)} onClick={onLink}>{name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        <Link className="mega-all" to={allTo} onClick={onLink}>{allLabel}</Link>
      </div>
    </div>
  )
}

export default function Header() {

  const [isShrunk, setIsShrunk] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const onScroll = () => setIsShrunk(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const [open, setOpen] = useState(false)
  // Which desktop panel is open: 'sub' (Solutions), 'products', 'brands' or null.
  const [panel, setPanel] = useState(null)
  // A panel closed by a link click stays shut until the pointer leaves it.
  const [latched, setLatched] = useState(null)
  const refs = useRef({})
  const timers = useRef({})
  const close = () => setOpen(false)
  const { pathname } = useLocation()
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setPanel(null)
    setLatched(null)
  }

  const clearAll = () => {
    Object.values(timers.current).forEach(clearTimeout)
  }

  // Clear pending timers on unmount so they never fire on a dead header.
  useEffect(() => () => clearAll(), [])

  // Escape and click-outside close the open panel immediately.
  useEffect(() => {
    if (!panel) return
    const onDown = (e) => {
      const el = refs.current[panel]
      if (el && !el.contains(e.target)) {
        clearAll()
        setPanel(null)
        setLatched(null)
      }
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        clearAll()
        setPanel(null)
        setLatched(null)
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [panel])

  // Panels are mutually exclusive but race-free: entering an item while another
  // panel is open does nothing (a diagonal pointer path into a panel crosses the
  // neighbouring item). The open panel closes through its own 300ms leave grace,
  // and the next pointer move over the other item then opens its panel.
  const openPanel = (id) => {
    clearTimeout(timers.current[id])
    if ((panel && panel !== id) || latched === id) return
    setPanel(id)
  }
  const hoverMove = (id) => {
    if (!panel && latched !== id) setPanel(id)
  }
  const scheduleClose = (id) => {
    clearTimeout(timers.current[id])
    timers.current[id] = setTimeout(() => {
      setPanel((p) => (p === id ? null : p))
      setLatched((l) => (l === id ? null : l))
    }, 300)
  }
  const closeAfterClick = (id) => {
    clearAll()
    setPanel(null)
    setLatched(id)
  }
  const linkClick = (id) => (e) => {
    closeAfterClick(id)
    close()
    e.currentTarget.blur()
  }
  /* eslint-disable react-hooks/refs -- itemProps is a handler factory for the race-free hover
     panels: the closures only run on events, and the timer/node maps must stay refs. */
  const itemProps = (id) => ({
    ref: (el) => { refs.current[id] = el },
    onMouseEnter: () => openPanel(id),
    onMouseLeave: () => scheduleClose(id),
    onMouseMove: () => hoverMove(id),
    onBlur: (e) => {
      if (!e.currentTarget.contains(e.relatedTarget)) setPanel((p) => (p === id ? null : p))
    },
  })
  /* eslint-enable react-hooks/refs */

  return (
    <>
      {/* Top strip: scrolls away with the page */}
      <div className="topstrip">
        <div className="wrap topstrip-in">
          <p className="topstrip-msg">
            Looking for IT, CCTV or ELV solutions?
            <Link to="/contact">Get a free quote</Link>
          </p>
          <ul className="topstrip-links">
            <li>
              <a href={PHONE_LINK}><FaPhoneAlt aria-hidden="true" /> {PHONE}</a>
            </li>
            <li>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp +971 50 223 6842 (opens in a new tab)">
                <FaWhatsapp aria-hidden="true" /> +971 50 223 6842
              </a>
            </li>
            <li>
              <a href="mailto:sales@artekteam.com"><FaEnvelope aria-hidden="true" /> sales@artekteam.com</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Main bar: dark, full width, sticky */}
      <header className="mainbar">
        <nav className="wrap mainbar-in" aria-label="Main">
          <Link to="/" className="brand" onClick={close}>
            <span className="brand-badge"><img src={mark} alt="" /></span>
            <span className="brand-ar-lockup">
              <span>Artek <b>Computers</b></span>
              <span className="brand-ar brand-ar--bar" lang="ar" dir="rtl">{COMPANY_NAME_AR}</span>
            </span>
          </Link>

          <button className="burger" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? '✕' : '☰'}
          </button>

          <ul className={open ? 'menu show' : 'menu'}>
            <li><NavLink to="/" end onClick={close}>Home</NavLink></li>
            <li><NavLink to="/company" onClick={close}>Company</NavLink></li>

            <li className={`has-sub${panel === 'sub' ? ' open' : ''}`} {...itemProps('sub')}>
              <Link
                to="/solutions"
                className={pathname.startsWith('/solutions') ? 'active' : ''}
                aria-haspopup="true"
                aria-expanded={panel === 'sub'}
                onFocus={() => openPanel('sub')}
                onClick={close}
              >
                Solutions ▾
              </Link>
              <ul className="sub">
                {solutions.map((s) => (
                  <li key={s.slug}>
                    <Link to={`/solutions/${s.slug}`} onClick={linkClick('sub')}>{s.title}</Link>
                  </li>
                ))}
              </ul>
            </li>

            <li className={`has-mega${panel === 'products' ? ' open' : ''}`} {...itemProps('products')}>
              <NavLink
                to="/products"
                aria-haspopup="true"
                aria-expanded={panel === 'products'}
                onFocus={() => openPanel('products')}
                onClick={close}
              >
                Products ▾
              </NavLink>
              <Mega
                columns={productColumns}
                groupTo={(g) => `/products/${g.slug}`}
                itemTo={(g, name) => `/products/${g.slug}#${slugify(name)}`}
                itemsOf={(g) => g.items}
                allTo="/products"
                allLabel="View all products"
                onLink={linkClick('products')}
              />
              <ul className="sub mega-m">
                {productGroups.map((g) => (
                  <li key={g.slug}>
                    <Link to={`/products/${g.slug}`} onClick={close}>{g.title}</Link>
                  </li>
                ))}
              </ul>
            </li>

            <li className={`has-mega${panel === 'brands' ? ' open' : ''}`} {...itemProps('brands')}>
              <NavLink
                to="/brands"
                aria-haspopup="true"
                aria-expanded={panel === 'brands'}
                onFocus={() => openPanel('brands')}
                onClick={close}
              >
                Brands ▾
              </NavLink>
              <Mega
                columns={brandColumns}
                groupTo={(g) => `/brands#${slugify(g.title)}`}
                itemTo={(g) => `/brands#${slugify(g.title)}`}
                itemsOf={(g) => g.brands}
                allTo="/brands"
                allLabel="View all brands"
                onLink={linkClick('brands')}
              />
              <ul className="sub mega-m">
                {brandGroups.map((g) => (
                  <li key={g.title}>
                    <Link to={`/brands#${slugify(g.title)}`} onClick={close}>{g.title}</Link>
                  </li>
                ))}
              </ul>
            </li>

            <li><NavLink to="/contact" onClick={close}>Contact Us</NavLink></li>
          </ul>

          <div className="bar-cta">
            <a href="/Artek-Computers-LLC-Corporate-Profile.pdf" target="_blank" rel="noopener" className="ghost" aria-label="Company profile (PDF, opens in a new tab)">Profile</a>
            <Link to="/contact" className="btn blue">Enquiry</Link>
          </div>
        </nav>
      </header>
    </>
  )
}
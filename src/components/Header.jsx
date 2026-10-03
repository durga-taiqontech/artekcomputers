import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import mark from '../assets/logo-mark.png'
import { solutions } from '../data/solutions'
import { productGroups, slugify } from '../data/catalog'

// Mega-menu columns: the first three groups stand alone, the remaining groups
// stack in the fourth column so the column heights stay similar.
const [first, second, third, ...rest] = productGroups
const megaColumns = [[first], [second], [third], rest].filter((col) => col[0])

export default function Header() {
  const [open, setOpen] = useState(false)
  const [subOpen, setSubOpen] = useState(false)
  const [subClickClosed, setSubClickClosed] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [megaClickClosed, setMegaClickClosed] = useState(false)
  const subRef = useRef(null)
  const megaRef = useRef(null)
  const close = () => setOpen(false)
  const { pathname } = useLocation()
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setSubOpen(false)
    setSubClickClosed(false)
    setMegaOpen(false)
    setMegaClickClosed(false)
  }

  // Escape and click-outside close whichever panel is open.
  useEffect(() => {
    if (!subOpen && !megaOpen) return
    const onDown = (e) => {
      if (subOpen && subRef.current && !subRef.current.contains(e.target)) {
        setSubOpen(false)
        setSubClickClosed(false)
      }
      if (megaOpen && megaRef.current && !megaRef.current.contains(e.target)) {
        setMegaOpen(false)
        setMegaClickClosed(false)
      }
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setSubOpen(false)
        setSubClickClosed(false)
        setMegaOpen(false)
        setMegaClickClosed(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [subOpen, megaOpen])

  // Opening one panel closes the other.
  const openSub = () => {
    if (!subClickClosed) {
      setSubOpen(true)
      setMegaOpen(false)
      setMegaClickClosed(false)
    }
  }
  const openMega = () => {
    if (!megaClickClosed) {
      setMegaOpen(true)
      setSubOpen(false)
      setSubClickClosed(false)
    }
  }
  const closeSubAfterClick = () => {
    setSubOpen(false)
    setSubClickClosed(true)
  }
  const closeMegaAfterClick = () => {
    setMegaOpen(false)
    setMegaClickClosed(true)
  }
  const megaLinkClick = (e) => {
    closeMegaAfterClick()
    close()
    e.currentTarget.blur()
  }

  return (
    <header className="bar">
      <nav className="pill">
        <Link to="/" className="brand" onClick={close}>
          <img src={mark} alt="" />
          <span>Artek <b>Computers</b></span>
        </Link>

        <button className="burger" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          {open ? '✕' : '☰'}
        </button>

        <ul className={open ? 'menu show' : 'menu'}>
          <li><NavLink to="/" end onClick={close}>Home</NavLink></li>
          <li><NavLink to="/company" onClick={close}>Company</NavLink></li>
          <li
            className={`has-sub${subOpen ? ' open' : ''}`}
            ref={subRef}
            onMouseEnter={openSub}
            onMouseLeave={() => {
              setSubOpen(false)
              setSubClickClosed(false)
            }}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setSubOpen(false)
            }}
          >
            <Link
              to="/solutions"
              className={pathname.startsWith('/solutions') ? 'active' : ''}
              aria-haspopup="true"
              aria-expanded={subOpen}
              onFocus={openSub}
              onClick={() => {
                closeSubAfterClick()
                close()
              }}
            >
              Solutions ▾
            </Link>
            <ul className="sub">
              {solutions.map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/solutions/${s.slug}`}
                    onClick={(e) => {
                      closeSubAfterClick()
                      close()
                      e.currentTarget.blur()
                    }}
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li
            className={`has-mega${megaOpen ? ' open' : ''}`}
            ref={megaRef}
            onMouseEnter={openMega}
            onMouseLeave={() => {
              setMegaOpen(false)
              setMegaClickClosed(false)
            }}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setMegaOpen(false)
            }}
          >
            <NavLink
              to="/products"
              aria-haspopup="true"
              aria-expanded={megaOpen}
              onFocus={openMega}
              onClick={() => {
                closeMegaAfterClick()
                close()
              }}
            >
              Products ▾
            </NavLink>
            <div className="mega">
              <div className="mega-grid">
                {megaColumns.map((groups, i) => (
                  <div className="mega-col" key={i}>
                    {groups.map((g) => (
                      <div className="mega-group" key={g.slug}>
                        <Link className="mega-h" to={`/products#${g.slug}`} onClick={megaLinkClick}>{g.title}</Link>
                        <ul>
                          {g.items.map((name) => (
                            <li key={name}>
                              <Link to={`/products#${slugify(name)}`} onClick={megaLinkClick}>{name}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <Link className="mega-all" to="/products" onClick={megaLinkClick}>View all products</Link>
            </div>
            <ul className="sub mega-m">
              {productGroups.map((g) => (
                <li key={g.slug}>
                  <Link to={`/products#${g.slug}`} onClick={close}>{g.title}</Link>
                </li>
              ))}
            </ul>
          </li>
          <li><NavLink to="/brands" onClick={close}>Brands</NavLink></li>
          <li><NavLink to="/contact" onClick={close}>Contact Us</NavLink></li>
          <li className="menu-profile">
            <a href="/Artek-Computers-LLC-Corporate-Profile.pdf" target="_blank" rel="noopener" onClick={close} aria-label="Company profile (PDF, opens in a new tab)">Company profile (PDF)</a>
          </li>
        </ul>

        <div className="bar-cta">
          <a href="/Artek-Computers-LLC-Corporate-Profile.pdf" target="_blank" rel="noopener" className="ghost" aria-label="Company profile (PDF, opens in a new tab)">Profile</a>
          <Link to="/contact" className="btn blue">Enquiry</Link>
        </div>
      </nav>
    </header>
  )
}

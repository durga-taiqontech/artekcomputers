import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import mark from '../assets/logo-mark.png'
import { solutions } from '../data/solutions'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [subOpen, setSubOpen] = useState(false)
  const [clickClosed, setClickClosed] = useState(false)
  const subRef = useRef(null)
  const close = () => setOpen(false)
  const { pathname } = useLocation()
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setSubOpen(false)
    setClickClosed(false)
  }

  // Escape and click-outside close the dropdown.
  useEffect(() => {
    if (!subOpen) return
    const onDown = (e) => {
      if (subRef.current && !subRef.current.contains(e.target)) {
        setSubOpen(false)
        setClickClosed(false)
      }
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setSubOpen(false)
        setClickClosed(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [subOpen])

  const openSub = () => {
    if (!clickClosed) setSubOpen(true)
  }
  const closeSubAfterClick = () => {
    setSubOpen(false)
    setClickClosed(true)
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
              setClickClosed(false)
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
          <li><NavLink to="/elv-access-control" onClick={close}>ELV &amp; Access Control</NavLink></li>
          <li><NavLink to="/products" onClick={close}>Products</NavLink></li>
          <li><a href="#" onClick={close}>Blog</a></li>
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

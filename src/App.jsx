import { Routes, Route } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Company from './pages/Company'
import Contact from './pages/Contact'
import ElvAccessControl from './pages/ElvAccessControl'
import Products from './pages/Products'
import Solution from './pages/Solution'
import Solutions from './pages/Solutions'
import { WHATSAPP } from './constants'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/company" element={<Company />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/elv-access-control" element={<ElvAccessControl />} />
          <Route path="/products" element={<Products />} />
          <Route path="/solutions/:slug" element={<Solution />} />
          <Route path="/solutions" element={<Solutions />} />
        </Routes>
      </main>
      <Footer />
      <a className="wa" href={WHATSAPP} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
        <FaWhatsapp />
      </a>
    </>
  )
}
import { Navigate, Route, Routes } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Company from './pages/Company'
import Contact from './pages/Contact'
import Products from './pages/Products'
import Brands from './pages/Brands'
import Solution from './pages/Solution'
import Solutions from './pages/Solutions'
import ProductCategory from './pages/ProductCategory'
import ScrollToHash from './components/ScrollToHash'
import { WHATSAPP } from './constants'

export default function App() {
  return (
    <>
      <ScrollToHash />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/company" element={<Company />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/elv-access-control" element={<Navigate to="/solutions/elv-access-control" replace />} />
          <Route path="/products" element={<Products />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/products/:group" element={<ProductCategory />} />
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
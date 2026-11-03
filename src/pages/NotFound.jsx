import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { seoFor } from '../seo/routes'
import { PHONE } from '../seo/site'
import './notfound.css'

export default function NotFound() {
  return (
    <>
      <Seo {...seoFor('/404')} />
      <section className="nf">
        <div className="nf__inner">
          <h1>We could not find that page</h1>
          <p>
            The address may have changed, or the page may have been removed. Try one of
            these instead, or call us on {PHONE}.
          </p>
          <ul className="nf__links">
            <li><Link to="/solutions">Our solutions</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/brands">Brands we supply</Link></li>
            <li><Link to="/contact">Contact us</Link></li>
          </ul>
        </div>
      </section>
    </>
  )
}
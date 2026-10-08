import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPinterestP } from 'react-icons/fa'
import { COMPANY_NAME_AR } from '../constants'
import { FaXTwitter } from 'react-icons/fa6'
import mark from '../assets/logo-mark.png'

const socials = [
  { label: 'Facebook', Icon: FaFacebookF },
  { label: 'X', Icon: FaXTwitter },
  { label: 'Instagram', Icon: FaInstagram },
  { label: 'LinkedIn', Icon: FaLinkedinIn },
  { label: 'Pinterest', Icon: FaPinterestP },
]

export default function Footer() {
  return (
    <footer>
      <div className="wrap foot-in">
        <div className="foot-brand">
          <img src={mark} alt="" />
          <div>
            <strong>Artek Computers LLC</strong>
            <span className="brand-ar brand-ar--foot" lang="ar" dir="rtl">{COMPANY_NAME_AR}</span>
            <p>P.O Box 112280, Al Rafa Road, Computer Street, Bur Dubai, Dubai, UAE</p>
          </div>
        </div>
        <div>
          <p>+971 4 379 7128 / 7138</p>
          <p>+971 50 223 6842</p>
          <a className="foot-link" href="/Artek-Computers-LLC-Corporate-Profile.pdf" target="_blank" rel="noopener" aria-label="Company profile (PDF, opens in a new tab)">Download our company profile (PDF)</a>
        </div>
        <div>
          <p>info@artekteam.com</p>
          <p>sales@artekteam.com</p>
          <ul className="social">
            {socials.map(({ label, Icon }) => (
              <li key={label}>
                <a href="#" target="_blank" rel="noreferrer" aria-label={label}>
                  <Icon />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="copy">© {new Date().getFullYear()} Artek Computers LLC. All rights reserved.</div>
    </footer>
  )
}

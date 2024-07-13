import React from 'react'
import styles from './footer.module.scss'
import { Link } from 'react-router-dom'
import { FaFacebook, FaTiktok, FaWhatsapp, FaEnvelope } from 'react-icons/fa'

const logo = (
  <div className={styles.logo}>
    <Link to="/">
      <h2>
        Hasa<span>Wears</span>.
      </h2>
    </Link>
  </div>
)

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles['footer-columns']}>
        <div className={styles['footer-column']}>
          <h2>{logo}</h2>
          <p>
            Your one-stop shop for your online clothings, accessories, bags and
            all.
          </p>
        </div>
        <div className={styles['footer-column']}>
          <h3>Products</h3>
          <ul>
            <li>Product 1</li>
            <li>Product 2</li>
            <li>Product 3</li>
            <li>Product 4</li>
            <li>Product 5</li>
          </ul>
        </div>
        <div className={styles['footer-column']}>
          <h3>Company</h3>
          <ul>
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Contact Us</a>
            </li>
          </ul>
        </div>
        <div className={styles['footer-column']}>
          <h3>Legal</h3>
          <ul>
            <li>
              <a href="#">Terms</a>
            </li>
            <li>
              <a href="#">Privacy</a>
            </li>
            <li>
              <a href="#">Cookies</a>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles['footer-bottom']}>
        <p>© 2024 ReedoShop. All rights reserved.</p>
        <div className={styles['socials-wrapper']}>
          <div className={styles.message}>
            {' '}
            <FaEnvelope color="#fff" />
          </div>

          <div className={styles['social-icons']}>
            <FaFacebook />
            <FaTiktok />
            <FaWhatsapp />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

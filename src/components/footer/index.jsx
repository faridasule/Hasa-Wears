import React from 'react';
import styles from './footer.module.scss';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTiktok, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

const logo = (
  <div className={styles.logo}>
    <Link to="/">
      <h2>
        Hasa<span>Wears</span>.
      </h2>
    </Link>
  </div>
);

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
          <h3>Categories</h3>
          <ul>
            <li>Men</li>
            <li>Women</li>
            <li>Footwear</li>
            <li>Electronics</li>
            <li>Accessories</li>
          </ul>
        </div>
        <div className={styles['footer-column']}>
          <h3>Company</h3>
          <ul>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
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
        <p>© 2024 HasaWears. All rights reserved.</p>
        <div className={styles['socials-wrapper']}>
          <div className={styles.message}>
            <FaEnvelope fontSize={'18px'} color="#fff" />
          </div>

          <div className={styles['social-icons']}>
            <a href="https://www.facebook.com/bello.ozozahuwa?mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://www.tiktok.com/@hasawears.hasawea?_t=8oSjDdZCeub&_r=1" target="_blank" rel="noopener noreferrer">
              <FaTiktok />
            </a>
            <a href="https://wa.me/2348108928985" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

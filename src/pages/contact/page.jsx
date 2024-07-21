import styles from './contact.module.scss'
import contact from '../../assets/contact.png'
import { FiMapPin, FiPhone, FiInstagram } from 'react-icons/fi'
import Contact from '../../components/contact'

const ContactPage = () => {

  return (
    <section className={styles.section}>
      <div className={`container ${styles.contact}`}>
        <div className={styles['info-wrap']}>
          <div className={styles['img']}>
            <img src={contact} alt="contact image" />
          </div>
          <div className={styles['info']}>
            <h2>Get in touch with us& Let’s talk.</h2>
            <p>
              Our customer support is here to serve you at your time of need.
              Please do not hesitate.
            </p>

            <div className={styles.contactInfo}>
              <p>
                <FiMapPin color="#007AFF" className={styles.icon} /> HasaWears,
                Kubwa,Arab-Road, Abuja.
              </p>
              <p>
                <FiPhone color="#007AFF" className={styles.icon} /> +234  818 533
                7683
              </p>
              <p>
                <FiInstagram color="#007AFF" className={styles.icon} /> @hasawears
              </p>
            </div>
          </div>
        </div>
        <div className={styles['contact-wrapper']}>
          <Contact />
        </div>
      </div>
    </section>
  )
}

export default ContactPage

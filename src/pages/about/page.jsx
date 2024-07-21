import styles from './about.module.scss'
import about from '../../assets/about.png'
import HotSales from '../../components/hot-sales'
import TopReviews from '../../components/top-reviews'

const AboutPage = () => {
  return (
    <section className={styles.section}>
      <div className={`container ${styles.about}`}>
        <div className={styles['section-one']}>
          <div className={styles['info']}>
            <h2>Your Premier Online Destination for Quality Products</h2>
            <p>
              At Hasa Wears, we are dedicated to providing you with a seamless and
              enjoyable shopping experience. From the latest trends to timeless
              classics, Hasa Wears offers high-quality items at competitive
              prices.
            </p>
            <div className={styles.btn}>
              <button
                  className="--btn --btn-primary" >Explore our products</button>
            </div>
          </div>
          <div className={styles['img']}><img src={about} alt="about-image" /></div>
              </div>
              
              <div>
                <HotSales/>
              </div>
               <div>
                <TopReviews/>
              </div>
      </div>
    </section>
  )
}

export default AboutPage

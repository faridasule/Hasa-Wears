import React, { useEffect, useState } from 'react'
import useFetchCollection from '../../custopm-hook/useFetchCollection'
import styles from './top-review.module.scss'
import defaultImage from '../../assets/user.svg'

// Function to get star rating as stars
const StarRating = ({ rate }) => {
  return (
    <div className={styles.stars}>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} className={index < rate ? styles.starFilled : styles.starEmpty} >
          ★
        </span>
      ))}
    </div>
  )
}

const TopReviews = () => {
  const { data: reviewsData, isLoading } = useFetchCollection('reviews')
  const [topReviews, setTopReviews] = useState([])

  useEffect(() => {
    if (reviewsData) {
      // Sort reviews by creation date and get top 4
      const sortedReviews = reviewsData.sort(
        (a, b) => b.createdAt.seconds - a.createdAt.seconds,
      )
      setTopReviews(sortedReviews.slice(0, 4))
    }
  }, [reviewsData])

  return (
    <section className={styles.section}>
      <p style={{ textAlign: 'center' }}>Happy HassaWears Users</p>
      <h2>Here are what our clients have to say</h2>
      {isLoading ? (
        <p style={{textAlign: 'center'}}>Loading...</p>
      ) : (
        <div className={styles.reviewsContainer}>
          {topReviews.map((review) => (
            <div key={review.id} className={styles.reviewCard}>
              <img
                src={defaultImage}
                alt={review.userName}
                className={styles.reviewImage}
              />
              <div className={styles.reviewContent}>
                <p>{review.review}</p>
                <h3>{review.userName}</h3>
                <StarRating rate={review.rate || 0} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default TopReviews

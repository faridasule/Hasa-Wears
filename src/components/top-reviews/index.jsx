import React, { useEffect, useState } from 'react'
import useFetchCollection from '../../custopm-hook/useFetchCollection'
import styles from './top-review.module.scss'
import defaultImage from '../../assets/user.svg'
import StarRating from '../star'


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
                <h3>{`By: ${review.userName}`}</h3>
                  <StarRating
                  count={5}
                  value={review.rate || 0}
                  size={16}
                  color={"#ffd700"} 
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default TopReviews

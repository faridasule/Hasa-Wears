import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  ADD_TO_CART,
  CALCULATE_TOTAL_QUANTITY,
} from '../../../redux/features/cartSlice';
import {
  ADD_TO_WISHLIST,
  selectWishlistItems,
} from "../../../redux/features/wishlistSlice";
import Card from '../../card/index';
import styles from './product-item.module.scss';
import { IoCartOutline, IoHeartOutline } from 'react-icons/io5';
import useFetchCollection from '../../../custopm-hook/useFetchCollection';
import { Loader } from '@mantine/core';
import { FiEye } from 'react-icons/fi';
import StarRating from '../../star/index'; // Import the custom star rating component

const ProductItem = ({ grid, id, name, price, imageURL }) => {
  const dispatch = useDispatch();
  const { data } = useFetchCollection('reviews');

  // Filter reviews for the current product
  const filteredReviews = data.filter((review) => review.productID === id);

  // Extract ratings from filtered reviews
  const ratings = filteredReviews.map((review) => review.rate);

  // Calculate average rating
  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((a, b) => a + b, 0);
    return sum / ratings.length;
  };

  const averageRating = calculateAverageRating(ratings);

  const shortenText = (text, n) => {
    if (text.length > n) {
      const shortenedText = text.substring(0, n).concat('...');
      return shortenedText;
    }
    return text;
  };

  const addToCart = (product) => {
    dispatch(ADD_TO_CART(product));
    dispatch(CALCULATE_TOTAL_QUANTITY());
  };

  const addToWishlist = (product) => {
    dispatch(ADD_TO_WISHLIST(product));
  };

  const formatPrice = (price) => {
    return price
      .toLocaleString('en-US', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
      })
      .replace('NGN', '₦'); // Remove the currency code and add the naira symbol
  };

  return (
    <Card cardClass={grid ? `${styles.grid}` : `${styles.list}`}>
      <div className={styles.img}>
        {imageURL ? (
          <img src={imageURL} alt={name} />
        ) : (
          <Loader color="#007AFF" size="lg" type="dots" />
        )}
        <div className={styles.iconContainer}>
          <IoCartOutline
            size={20}
            className={styles.cartIcon}
            color="#007AFF"
            title='add-cart'
            onClick={() => addToCart({ id, name, price, imageURL })}
          />
          <IoHeartOutline
            size={20}
            className={styles.wishlistIcon}
            color="#007AFF"
            title='add-wishlist'
            onClick={() => addToWishlist({ id, name, price, imageURL })}
          />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.details}>
          <h3>{shortenText(name, 18)}</h3>
          <div className={styles.box}>
            <p>{formatPrice(price)}</p>
            <Link to={`/product-details/${id}`}>
              <div className={styles.cart}>
                <FiEye title='view-details' color="#007AFF" size={18} />
              </div>
            </Link>
          </div>
        </div>
        <div className={styles.ratingSection}>
          <StarRating
            count={5}
            value={averageRating}
            size={15}
            color={'#F8C51B'}
          />
          <p className={styles.commentCount}>
            ({filteredReviews.length})
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ProductItem;

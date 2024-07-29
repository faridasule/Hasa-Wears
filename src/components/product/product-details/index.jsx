import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ADD_TO_CART,
  CALCULATE_TOTAL_QUANTITY,
  DECREASE_CART,
  selectCartItems,
} from '../../../redux/features/cartSlice';
import {
  ADD_TO_WISHLIST,
  selectWishlistItems,
} from '../../../redux/features/wishlistSlice';
import useFetchDocument from '../../../custopm-hook/useFetchDocument';
import useFetchCollection from '../../../custopm-hook/useFetchCollection';
import defaultImage from '../../../assets/user.svg';
import styles from './product-detail.module.scss';
import { setBreadCrumb } from '../../../redux/features/siteSlice';
import BreadCrumbLayout from '../../bread-crumb';
import { FaHeart } from 'react-icons/fa';
import Loader from '../../content-loader';
import { capitalizeWords, formatNaira } from '../../../@core/utils';
import StarRating from '../../star/index';

const ProductDetails = () => {
  // Retrieve product ID from URL parameters
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const wishlistItems = useSelector(selectWishlistItems);
  const { document } = useFetchDocument('products', id);
  const { data } = useFetchCollection('reviews');

  // Filter reviews to match the current product ID
  const filteredReviews = data.filter((review) => review.productID === id);
  const cart = cartItems.find((cart) => cart.id === id);
  const isCartAdded = cartItems.findIndex((cart) => cart.id === id);

  // Breadcrumb structure
  const breadcrumb = [
    { title: 'Home', url: '/' },
    { title: 'Product', url: '/#product' },
    { title: 'Product Details' },
  ];

  // Set breadcrumb on component mount
  useEffect(() => {
    dispatch(setBreadCrumb(breadcrumb));
  }, [dispatch]);

  // Set product details when the document is fetched
  useEffect(() => {
    setProduct(document);
  }, [document]);

  // Add product to cart with selected sizes
  const addToCart = (product, sizes) => {
    const productWithSizes = { ...product, sizes };
    dispatch(ADD_TO_CART(productWithSizes));
    dispatch(CALCULATE_TOTAL_QUANTITY());
  };

  // Decrease quantity of product in cart
  const decreaseCart = (product) => {
    dispatch(DECREASE_CART(product));
    dispatch(CALCULATE_TOTAL_QUANTITY());
  };

  // Add product to wishlist
  const addToWishlist = (product) => {
    dispatch(ADD_TO_WISHLIST(product));
  };

  // Extract ratings from filtered reviews
  const ratings = filteredReviews.map((review) => review.rate);

  // Calculate average rating from reviews
  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((a, b) => a + b, 0);
    return sum / ratings.length;
  };

  const averageRating = calculateAverageRating(ratings);

  // Handle size selection for product
  const handleSizeSelect = (size) => {
    setSelectedSizes((prevSizes) =>
      prevSizes.includes(size)
        ? prevSizes.filter((s) => s !== size)
        : [...prevSizes, size],
    );
  };

  return (
    <>
      <div className={styles['bread-crumb']}>
        <BreadCrumbLayout title="Product Details" />
      </div>

      <section className={styles.section}>
        <div className={`container ${styles.product}`}>
          {product === null ? (
            <Loader />
          ) : (
            <>
              <div className={styles.details}>
                <div className={styles.img}>
                  <img src={product.imageURL} alt={product.name} />
                </div>
                <div className={styles.content}>
                  <span className={styles.new}>New!</span>
                  <h3>{product.name}</h3>
                  <h3>{formatNaira(product.price)}</h3>
                  <div className={styles.ratingSection}>
                    <StarRating
                      count={5}
                      value={averageRating}
                      size={15}
                      color={'#F8C51B'}
                    />
                    <span className={styles.commentCount}>
                      ({`Total ${filteredReviews.length} Received`})
                    </span>
                  </div>
                  <p className={styles.desc}>{product.desc}</p>
                  <p>
                    <b>Category:</b> {product.category}
                  </p>

                  {product.brand && (
                    <p>
                      <b>Brand:</b> {product.brand}
                    </p>
                  )}

                  <p className={styles.sizes}>
                    <b>Sizes:</b>
                    <ul>
                      {product?.sizes?.map((size) => (
                        <li
                          key={size}
                          className={
                            selectedSizes.includes(size) ? styles.selected : ''
                          }
                          onClick={() => handleSizeSelect(size)}
                        >
                          {capitalizeWords(size)}
                        </li>
                      ))}
                    </ul>
                  </p>
                  {isCartAdded < 0 ? null : (
                    <>
                      <p className={styles.qty}>Quantity</p>
                      <div className={styles.count}>
                        <button
                          className="--btn"
                          onClick={() => decreaseCart(product)}
                        >
                          -
                        </button>
                        <p>
                          <b>{cart.cartQuantity}</b>
                        </p>
                        <button
                          className="--btn"
                          onClick={() => addToCart(product, selectedSizes)}
                          style={{ marginLeft: '5px' }}
                        >
                          +
                        </button>
                      </div>
                    </>
                  )}
                  <button
                    style={{ width: '60%' }}
                    className="--btn --btn-primary"
                    onClick={() => addToCart(product, selectedSizes)}
                  >
                    Add to Cart
                  </button>
                  <button
                    style={{
                      width: '60%',
                      background: 'transparent',
                      display: 'flex',
                      gap: '10px',
                    }}
                    className="--btn"
                    onClick={() => addToWishlist(product)}
                  >
                    <FaHeart color="#B0BABF" />{' '}
                    <span style={{ color: '#252C32', fontWeight: '400' }}>
                      Add to Wishlist
                    </span>
                  </button>
                </div>
              </div>
              <div className={styles.reviews}>
                <h4>Customer Reviews ({filteredReviews.length})</h4>
                {filteredReviews.length === 0 ? (
                  <p>No reviews yet.</p>
                ) : (
                  <div className={styles.gridWrap}>
                    {filteredReviews.map((eachReview, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          border: '1px solid #B0BABF',
                          borderRadius: '6px',
                          padding: '18px',
                        }}
                      >
                        <div className={styles.reviewContainer}>
                          <img
                            width={80}
                            height={80}
                            className={styles.reviewPicture}
                            src={defaultImage}
                            alt="user-profile-picture"
                          />
                          <div className={styles['review-count']}>
                            <div className={styles['review-wrap']}>
                              <h5>{eachReview.userName}</h5>
                              <div style={{ marginTop: '1rem' }}>
                                <StarRating
                                  count={5}
                                  value={eachReview.rate}
                                  size={20}
                                  color={'#F8C51B'}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <p style={{ marginTop: '16px', color: '#000' }}>
                          {eachReview.review}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default ProductDetails;

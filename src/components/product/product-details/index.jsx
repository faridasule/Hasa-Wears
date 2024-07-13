import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import spinnerImg from "../../../assets/spinner.jpg";
import {
  ADD_TO_CART,
  CALCULATE_TOTAL_QUANTITY,
  DECREASE_CART,
  selectCartItems,
} from "../../../redux/features/cartSlice";
import {
  ADD_TO_WISHLIST,
  selectWishlistItems,
} from "../../../redux/features/wishlistSlice";
import useFetchDocument from "../../../custopm-hook/useFetchDocument";
import useFetchCollection from "../../../custopm-hook/useFetchCollection";
import StarsRating from "react-star-rate";
import defaultImage from "../../../assets/user.svg";
import styles from "./product-detail.module.scss";
import { setBreadCrumb } from "../../../redux/features/siteSlice";
import BreadCrumbLayout from "../../layout";
import { FaHeart } from "react-icons/fa";
import { Loader } from "@mantine/core";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const wishlistItems = useSelector(selectWishlistItems);
  const { document } = useFetchDocument("products", id);
  const { data } = useFetchCollection("reviews");
  const filteredReviews = data.filter((review) => review.productID === id);
  const cart = cartItems.find((cart) => cart.id === id);
  const isCartAdded = cartItems.findIndex((cart) => cart.id === id);

  const breadcrumb = [
    { title: "Home", url: "/" },
    { title: "Product", url: "/#product" },
    { title: "Product Details" },
  ];
  useEffect(() => {
    dispatch(setBreadCrumb(breadcrumb));
  }, [dispatch]);

  useEffect(() => {
    setProduct(document);
  }, [document]);

  const addToCart = (product) => {
    dispatch(ADD_TO_CART(product));
    dispatch(CALCULATE_TOTAL_QUANTITY());
  };

  const decreaseCart = (product) => {
    dispatch(DECREASE_CART(product));
    dispatch(CALCULATE_TOTAL_QUANTITY());
  };

  const addToWishlist = (product) => {
    dispatch(ADD_TO_WISHLIST(product));
  };

  const formatPrice = (price) => {
    return price
      .toLocaleString("en-US", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
      })
      .replace("NGN", "₦"); // Remove the currency code and add the naira symbol
  };

  // Extract ratings from filtered reviews
  const ratings = filteredReviews.map((review) => review.rate);

  // Calculate average rating
  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((a, b) => a + b, 0);
    return sum / ratings.length;
  };

  const averageRating = calculateAverageRating(ratings);

  return (
    <>
      <div className={styles["bread-crumb"]}>
        <BreadCrumbLayout title="Product Details" />
      </div>

      <section className={styles.section}>
        <div className={`container ${styles.product}`}>
          {product === null ? (
            <img src={spinnerImg} alt="Loading" style={{ width: "50px" }} />
          ) : (
            <>
              <div className={styles.details}>
                <div className={styles.img}>
                  {product.imageURL ? (
                    <img src={product.imageURL} alt={product.name} />
                  ) : (
                    <Loader color="#007AFF" size="lg" type="dots" />
                  )}
                </div>
                <div className={styles.content}>
                  <span className={styles.new}>New!</span>
                  <h3>{product.name}</h3>
                  <h3>{formatPrice(product.price)}</h3>
                  <div className={styles.ratingSection}>
                    <StarsRating
                      count={5}
                      value={averageRating}
                      size={15}
                      color={"#005EB2"}
                      activeColor={"#005EB2"}
                      isHalf={true}
                      edit={false}
                      emptyIcon={<i className="far fa-star"></i>}
                      halfIcon={<i className="fa fa-star-half-alt"></i>}
                      filledIcon={<i className="fa fa-star"></i>}
                    />
                    <span className={styles.commentCount}>
                      ({`Total ${filteredReviews.length} Received`})
                    </span>
                  </div>
                  <p>{product.desc}</p>
                  <p>
                    <b>Category:</b> {product.category}
                  </p>
                  <p>
                    <b>Brand:</b> {product.brand}
                  </p>
                  <p className={styles.qty}>Quantity</p>
                  <div className={styles.count}>
                    {isCartAdded < 0 ? null : (
                      <>
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
                          onClick={() => addToCart(product)}
                          style={{ marginLeft: "5px" }}
                        >
                          +
                        </button>
                      </>
                    )}
                  </div>
                  <button
                    style={{ width: "50%" }}
                    className="--btn --btn-primary"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <button
                    style={{
                      width: "50%",
                      background: "transparent",
                      display: "flex",
                      gap: "14px",
                    }}
                    className="--btn"
                    onClick={() => addToWishlist(product)}
                  >
                    <FaHeart color="#B0BABF" />{" "}
                    <span style={{ color: "#252C32", fontWeight: "400" }}>
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
                          display: "flex",
                          flexDirection: "column",
                          border: "1px solid #B0BABF",
                          borderRadius: "6px",
                          padding: "18px",
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
                          <div className={styles["review-count"]}>
                            <div className={styles["review-wrap"]}>
                              <h5>{eachReview.userName}</h5>
                              <div style={{ marginLeft: "-10px" }}>
                                <StarsRating
                                  color="#005EB2"
                                  starRatedColor="#005EB2"
                                  value={eachReview.rate}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <p style={{ marginTop: "16px" }}>{eachReview.review}</p>
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

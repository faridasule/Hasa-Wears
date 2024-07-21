import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUserID, selectUserName } from "../../redux/features/authSlice";
import styles from "./review-product.module.scss";
import StarsRating from "react-star-rate";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-toastify";
import useFetchDocument from "../../custopm-hook/useFetchDocument";
import { Textarea } from "evergreen-ui";
import LoadingIcons from "react-loading-icons";


const ReviewProducts = ({ id, onClose }) => {
  const [rate, setRate] = useState(0);
  const [review, setReview] = useState("");
  const [product, setProduct] = useState(null);
   const [loading, setLoading] = useState(false);
  const { document } = useFetchDocument("products", id);
  const userID = useSelector(selectUserID);
  const userName = useSelector(selectUserName);

  useEffect(() => {
    setProduct(document);
  }, [document]);

  const submitReview = (e) => {
    e.preventDefault();
    setLoading(true);

    const today = new Date();
    const date = today.toDateString();
    const reviewConfig = {
      userID,
      userName,
      productID: id,
      rate,
      review,
      reviewDate: date,
      createdAt: Timestamp.now().toDate(),
    };
    try {
      addDoc(collection(db, "reviews"), reviewConfig);
      toast.success("Review submitted successfully");
      setRate(0);
      setReview("");
       onClose(); 
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className={`container ${styles.review}`}>
      

          <form onSubmit={(e) => submitReview(e)}>
          <label>Rating:</label>
          <div className={styles.rating}>
            <StarsRating
              value={rate}
              onChange={(rate) => {
                setRate(rate);
              }}
            />
            </div>
            <label>Review</label>
            <Textarea
              value={review}
              required
              onChange={(e) => setReview(e.target.value)}
              cols="30"
              rows="10"
          />
          <div className={styles.button}>
            <button type="submit" className="--btn --btn-primary" disabled={loading}>
              {loading ? (
               <LoadingIcons.ThreeDots/>
              ) : (
                "Submit"
              )}
            </button>
            </div>
          </form>
      </div>
    </section>
  );
};

export default ReviewProducts;

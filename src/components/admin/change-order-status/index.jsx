import { doc, setDoc, Timestamp } from "firebase/firestore";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../../../firebase/config";
import Card from "../../card/index";
import Loader from "../../content-loader";
import { Select } from "evergreen-ui";
import styles from "./change-order-status.module.scss";
import { selectEmail } from '../../../redux/features/authSlice';
import { useSelector } from 'react-redux';


const ChangeOrderStatus = ({ order, id }) => {

  // State variables
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); 
  const userEmail = useSelector(selectEmail);


  // Function to edit order status
  const editOrder = async (e, id) => {
    e.preventDefault();
    setIsLoading(true); 

    // Configuration for the updated order
    const orderConfig = {
      userID: order.userID,
      userEmail: order.userEmail,
      orderDate: order.orderDate,
      orderTime: order.orderTime,
      orderAmount: order.orderAmount,
      orderStatus: status, // Updated order status
      cartItems: order.cartItems,
      shippingAddress: order.shipping,
      createdAt: order.createdAt,
      editedAt: Timestamp.now().toDate(),
    };

    // Update the order in Firestore
    try {
      await setDoc(doc(db, "orders", id), orderConfig);

      setIsLoading(false); 
      toast.success("Order status changed successfully"); 
      navigate("/admin/orders");
    } catch (error) {
      setIsLoading(false); 
      toast.error(error.message);
    }
  };

  return (
    <>
      {isLoading && <Loader />} {/* Show loader if loading state is true */}

      <div className={styles.status}>
        <Card cardClass={styles.card}>
          <h4>Update Status</h4>
          <form onSubmit={(e) => editOrder(e, id)}>
            <span>
              {/* Select dropdown for order status */}
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                width='100%'
                height={45}
                appearance="default"
                marginBottom={'2rem'}
                marginTop={"1rem"}
              >
                <option value="" disabled>
                  -- Choose one --
                </option>
                <option value="Order Placed...">Order Placed...</option>
                <option value="Processing...">Processing...</option>
                <option value="Shipped...">Shipped...</option>
                <option value="Delivered">Delivered</option>
              </Select>
            </span>
            <span className={styles.button}>
              <button  disabled={userEmail === 'guest@gmail.com'} type="submit" className="--btn --btn-primary">
                Update Status
              </button>
            </span>
          </form>
        </Card>
      </div>
    </>
  );
};

export default ChangeOrderStatus;

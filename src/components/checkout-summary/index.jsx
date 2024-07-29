import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  selectCartItems,
  selectCartTotalAmount,
  selectCartTotalQuantity,
} from "../../redux/features/cartSlice";
import Card from "../card/index";
import styles from "./checkout-summary.module.scss";
import { Pane } from "evergreen-ui";
import { formatNaira } from "../../@core/utils";

const CheckoutSummary = () => {
  const cartItems = useSelector(selectCartItems);
  const cartTotalAmount = useSelector(selectCartTotalAmount);
  const cartTotalQuantity = useSelector(selectCartTotalQuantity);

  
  return (
    <div>
      <div>
        {cartItems.lenght === 0 ? (
          <>
            <p>No item in your cart.</p>
            <button className="--btn">
              <Link to="/#products">Back To Shop</Link>
            </button>
          </>
        ) : (
          <div>
            {cartItems.map((item, index) => {
              const { id, name, price, cartQuantity, imageURL } = item;
              return (
                <Card key={id} cardClass={styles.card}>
                  {/* <Pane> */}
                                      <img                       className={styles.image} src={imageURL} alt="" />

                  {/* </Pane> */}
                  <Pane>
                       <h4>{name}</h4>
                  <p>Quantity: {cartQuantity}</p>
                  {/* <p>Unit price: {price}</p> */}
                  <p>Set price: N{price * cartQuantity}</p>
               </Pane>
                </Card>
                
              );
            })}
              
               <div className={styles.summary}>
                <Card cardClass={styles.cardSummary}>
                  <div className={styles.text}>
                    <h4>Tax</h4>
                    <h3>₦0</h3>
                  </div>
                  <div className={styles.text}>
                    <h4>Shipping</h4>
                    <h3>₦0</h3>
                  </div>
                  <div className={styles.text}>
                    <h4>Items</h4>
                    <h3>{`${cartTotalQuantity}`}</h3>
                  </div>
                  <div className={styles.text}>
                    <h4>Subtotal</h4>
                    <h3>{formatNaira(cartTotalAmount)}</h3>
                  </div>

                </Card>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutSummary;

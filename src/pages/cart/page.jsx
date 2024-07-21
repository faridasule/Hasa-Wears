import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  ADD_TO_CART,
  CALCULATE_SUBTOTAL,
  CALCULATE_TOTAL_QUANTITY,
  CLEAR_CART,
  DECREASE_CART,
  REMOVE_FROM_CART,
  SAVE_URL,
  selectCartItems,
  selectCartTotalAmount,
  selectCartTotalQuantity,
} from '../../redux/features/cartSlice'
import styles from './cart.module.scss'
import { HiOutlineTrash } from 'react-icons/hi2'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../../components/card/index'
import { selectIsLoggedIn } from '../../redux/features/authSlice'
import { CiShoppingCart } from 'react-icons/ci'
import { setBreadCrumb } from '../../redux/features/siteSlice'
import BreadCrumbLayout from '../../components/bread-crumb/index'
import { ChevronDownIcon, ChevronRightIcon } from 'evergreen-ui'

const Cart = () => {
  const cartItems = useSelector(selectCartItems)
  const cartTotalAmount = useSelector(selectCartTotalAmount)
  const cartTotalQuantity = useSelector(selectCartTotalQuantity)
  const dispatch = useDispatch()
  const isLoggedIn = useSelector(selectIsLoggedIn)

  const breadcrumb = [
    { title: 'Home', url: '/' },
    { title: 'Product', url: '/#product' },
    { title: 'Cart' },
  ]

  dispatch(setBreadCrumb(breadcrumb))

  const navigate = useNavigate()

  const increaseCart = (cart) => {
    dispatch(ADD_TO_CART(cart))
  }

  const decreaseCart = (cart) => {
    dispatch(DECREASE_CART(cart))
  }

  const removeFromCart = (cart) => {
    dispatch(REMOVE_FROM_CART(cart))
  }

  const clearCart = () => {
    dispatch(CLEAR_CART())
  }

  useEffect(() => {
    dispatch(CALCULATE_SUBTOTAL())
    dispatch(CALCULATE_TOTAL_QUANTITY())
    dispatch(SAVE_URL(''))
  }, [cartItems, dispatch])

  const url = window.location.href

  const checkout = () => {
    if (isLoggedIn) {
      navigate('/checkout-details')
    } else {
      dispatch(SAVE_URL(url))
      navigate('/login')
    }
  }

   const continueShop = () => {
      navigate('/#product')  
  }

  const formatNaira = (amount) => {
    return '₦' + amount.toLocaleString()
  }

  const [showPreview, setShowPreview] = React.useState(
    Array(cartItems.length).fill(false),
  )

  const handlePreview = (e, index) => {
    e.stopPropagation()
    const updateshowPreview = [...showPreview]
    updateshowPreview[index] = !updateshowPreview[index]
    setShowPreview(updateshowPreview)

    // Close all previews when screen size is larger than 600px
    if (window.innerWidth > 600) {
      setShowPreview(Array(cartItems.length).fill(false))
    }
  }
  return (
    <>
      <section>
        <div className={`container ${styles.table}`}>
          <div className={styles['bread-crumb']}>
            <BreadCrumbLayout title="Your Cart" />
          </div>

          {cartItems.length === 0 ? (
            <div className={styles['empty-container']}>
              <div className={styles['cart-icon']}>
                <CiShoppingCart color="#007AFF" size={70} />
              </div>
              <p>Your cart is currently empty.</p>
              <br />
              <div>
                <a href="/#product" className="--btn --btn-primary">
                  Shop Now
                </a>
              </div>
            </div>
          ) : (
              <div className={styles['table-content']}>
                
                <div>
                    <table>
                <thead>
                  <tr>
                    <th>s/n</th>
                        <th>Product</th>
                                                <th>Name</th>

                    <th className={styles.hideOnMobile}>Price</th>
                    <th className={styles.hideOnMobile}>Quantity</th>
                    <th className={styles.hideOnMobile}>Total</th>
                    <th>Action</th>
                    <th className={styles.showOnMobile}></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((cart, index) => {
                    const { id, name, price, imageURL, cartQuantity } = cart
                    return (
                      <React.Fragment key={id}>
                        <tr className={styles.productRow}>
                          <td>{index + 1}</td>
                          <td>
                            <div className={styles.img}>
                              <img
                                src={imageURL}
                                alt={name}
                                style={{ width: '100px' }}
                              />
                            </div>
                              {/* <p>
                              <b>{name}</b>
                            </p> */}
                          </td>

                                                    <td>{name}</td>

                          <td className={styles.hideOnMobile}>
                            {formatNaira(price)}
                          </td>
                          <td className={styles.hideOnMobile}>
                            <div className={styles.count}>
                              <button
                                className="--btn"
                                onClick={() => decreaseCart(cart)}
                              >
                                -
                              </button>
                              <p>
                                <b>{cartQuantity}</b>
                              </p>
                              <button
                                className="--btn"
                                onClick={() => increaseCart(cart)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className={styles.hideOnMobile}>
                            {formatNaira(price * cartQuantity)}
                          </td>
                          <td className={styles.icons}>
                            <HiOutlineTrash
                              size={19}
                              color="#FF3B30"
                              onClick={() => removeFromCart(cart)}
                            />
                          </td>
                          <td className={styles.showOnMobile}>
                            <button
                              onClick={(e) => handlePreview(e, index)}
                              title="preview-button"
                            >
                              {!showPreview[index] ? (
                                <ChevronRightIcon
                                  color="#007AFF"
                                  size={25}
                                  title="right-arrow-icon"
                                />
                              ) : (
                                <ChevronDownIcon
                                  color="#007AFF"
                                  size={25}
                                  title="down-arrow-icon"
                                />
                              )}
                            </button>
                          </td>
                        </tr>
                        {showPreview[index] && (
                          <tr className={styles.additionalRow}>
                            <td colSpan="6" className={styles.additionalInfo}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <p><strong>Name: </strong>{name}</p>
                                <p><strong>Price: </strong>{formatNaira(price)}</p>
                                <p>
                                <strong>Quantity: </strong>{cartQuantity}
                                  <div className={styles.count}>
                                    <button
                                      className="--btn"
                                      onClick={() => decreaseCart(cart)}
                                    >
                                      -
                                    </button>
                                    <p>
                                      <b>{cartQuantity}</b>
                                    </p>
                                    <button
                                      className="--btn"
                                     
                                      onClick={() => increaseCart(cart)}
                                    >
                                      +
                                    </button>
                                  </div>
                                </p>
                                <p>
                                  <strong>Total: </strong>{formatNaira(price * cartQuantity)}
                                </p>
                              </div>
                              <div
                                onClick={() => removeFromCart(cart)}
                                style={{ color: '#FF3B30', textAlign: 'right' }}
                                color="#FF3B30"
                              >
                                Delete
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
              <div className={styles.summary}>
                <Card cardClass={styles.card}>
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

                  <button
                    className="--btn --btn-primary --btn-block"
                    onClick={checkout}
                    style={{ marginTop: '16px' }}
                  >
                    Checkout
                  </button>

                  <button
                    className="--btn  --btn-block"
                    onClick={continueShop}
                    style={{
                      border: '1px solid ##B0BABF',
                      color: '#000000',
                      fontWeight: '600',
                      marginTop: '14px',
                    }}
                  >
                    Continue Shipping
                  </button>
                </Card>
              </div>
            </div>
          )}

          {cartItems.length !== 0 ? (
            <button
              className="--btn"
              style={{
                border: '1px solid #FF3B30',
                color: '#000',
                background: 'transparent',
                fontWeight: '500',
              }}
              onClick={clearCart}
            >
              Clear Cart
            </button>
          ) : null}
        </div>
      </section>
    </>
  )
}

export default Cart

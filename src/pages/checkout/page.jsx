import React, { useState } from 'react'
import { CountryDropdown } from 'react-country-region-selector'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/card/index'
import CheckoutSummary from '../../components/checkout-summary/index'
import {
  SAVE_SHIPPING_ADDRESS,
} from '../../redux/features/checkoutSlice'
import styles from './checkout.module.scss'
import { setBreadCrumb } from '../../redux/features/siteSlice'
import BreadCrumbLayout from '../../components/bread-crumb/index'
import { selectEmail, selectUserID } from '../../redux/features/authSlice'
import {
  CLEAR_CART,
  selectCartItems,
  selectCartTotalAmount,
} from '../../redux/features/cartSlice'
import { selectShippingAddress } from '../../redux/features/checkoutSlice'
import { addDoc, collection, Timestamp } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { Dialog, Pane, Text, Heading } from 'evergreen-ui'
import FlutterPay from "../../components/paystack/paystack"
import LoadingIcons from "react-loading-icons"
import PaystackPay from '../../components/paystack/paystack'

const initialAddressState = {
  name: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
  phone: '',
}

const CheckoutDetails = () => {
  const [shippingAddress, setShippingAddress] = useState(initialAddressState)
  const [isDialogShown, setIsDialogShown] = useState(false)
  const [loading, setLoading] = useState(false)

  const userID = useSelector(selectUserID)
  const userEmail = useSelector(selectEmail)
  const cartItems = useSelector(selectCartItems)
  const cartTotalAmount = useSelector(selectCartTotalAmount)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Breadcrumbs navigation for the page
  const breadcrumb = [
    { title: 'Home', url: '/' },
    { title: 'Cart', url: '/cart' },
    { title: 'Checkout Details' },
  ]

  // Set breadcrumb navigation in the Redux store
  dispatch(setBreadCrumb(breadcrumb))

  // Handle changes in shipping address input fields
  const handleShipping = (e) => {
    const { name, value } = e.target
    setShippingAddress({
      ...shippingAddress,
      [name]: value,
    })
  }

  // Save order to Firestore
  const saveOrder = async () => {
    const today = new Date()
    const date = today.toDateString()
    const time = today.toLocaleTimeString()
    const orderConfig = {
      userID,
      userEmail,
      orderDate: date,
      orderTime: time,
      orderAmount: cartTotalAmount,
      orderStatus: 'Order Placed',
      cartItems,
      shipping: shippingAddress,
      createdAt: Timestamp.now().toDate(),
    }
    try {
      await addDoc(collection(db, 'orders'), orderConfig)
      dispatch(CLEAR_CART())
      setIsDialogShown(true)
    } catch (error) {
      console.error('Error saving order: ', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    dispatch(SAVE_SHIPPING_ADDRESS(shippingAddress))
    saveOrder()
  }

  // Close the dialog and navigate to order history
  const handleDialogClose = () => {
    setIsDialogShown(false)
    navigate('/order-history')
  }

  return (
    <section>
      <div className={`container ${styles.checkout}`}>
        {/* Breadcrumb navigation */}
        <div className={styles['bread-crumb']}>
          <BreadCrumbLayout title="Checkout Details" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.wrapper}>
            <h3>Shipping Address</h3>
            <Card cardClass={styles.card}>
              {/* Input fields for shipping address */}
              <label>Fullname</label>
              <input
                type="text"
                required
                name="name"
                value={shippingAddress.name}
                onChange={handleShipping}
              />
              <label>Phone</label>
              <input
                type="text"
                required
                name="phone"
                value={shippingAddress.phone}
                onChange={handleShipping}
              />
              <label>Address line 1</label>
              <input
                type="text"
                required
                name="line1"
                value={shippingAddress.line1}
                onChange={handleShipping}
              />
              <label>Address line 2</label>
              <input
                type="text"
                name="line2"
                value={shippingAddress.line2}
                onChange={handleShipping}
              />
              <div className={styles['city-country']}>
                <div>
                  <label>City</label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleShipping}
                  />
                </div>
                <div>
                  <label>Country</label>
                  <CountryDropdown
                    className={styles.select}
                    valueType="short"
                    value={shippingAddress.country}
                    onChange={(val) =>
                      handleShipping({
                        target: {
                          name: 'country',
                          value: val,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div className={styles['city-country']}>
                <div>
                  <label>State</label>
                  <input
                    type="text"
                    required
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleShipping}
                  />
                </div>
                <div>
                  <label>Postal code</label>
                  <input
                    type="text"
                    required
                    name="postal_code"
                    value={shippingAddress.postal_code}
                    onChange={handleShipping}
                  />
                </div>
              </div>
              {/* Button to proceed to checkout */}
              <button
                style={{ fontSize: '16px', width: '100%', marginTop: '20px', height: '40px' }}
                type="submit"
                className="--btn --btn-primary"
              >
                {loading ? <LoadingIcons.ThreeDots height={"0.5rem"} /> : 'Proceed To Checkout'}
              </button>
            </Card>
          </div>
          {/* Summary card */}
          <div className={styles['summary-card']}>
            <Card cardClass={styles.card}>
              <CheckoutSummary />
            </Card>
          </div>
        </form>

        {/* Dialog for successful order */}
        <Dialog
          isShown={isDialogShown}
          onCloseComplete={handleDialogClose}
          hasFooter={false}
        >
          <Pane textAlign={'center'} marginBottom={'2rem'}>
            <Heading marginBottom={'2rem'} size={600}>
              Your Order was successful!
            </Heading>
            <Text style={{ marginTop: '3rem', lineHeight: '18px' }} size={400}>
              Thank you for choosing HasaWear, we make sure that our customers
              get the best out of our store.!
            </Text>
          </Pane>
          <Pane display="flex" justifyContent="flex-end" marginTop={20}>
         <PaystackPay onPay={handleSubmit}  handleDialogClose={handleDialogClose} />
          </Pane>
        </Dialog>
      </div>
    </section>
  )
}

export default CheckoutDetails

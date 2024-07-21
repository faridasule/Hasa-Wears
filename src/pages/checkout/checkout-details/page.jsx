import React, { useState } from 'react'
import { CountryDropdown } from 'react-country-region-selector'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Card from '../../../components/card/index'
import CheckoutSummary from '../../../components/checkout-summary/index'
import {
  SAVE_SHIPPING_ADDRESS,
} from '../../../redux/features/checkoutSlice'
import styles from './checkout-details.module.scss'
import { setBreadCrumb } from '../../../redux/features/siteSlice'
import BreadCrumbLayout from '../../../components/bread-crumb/index'
import { selectEmail, selectUserID } from '../../../redux/features/authSlice'
import {
  CLEAR_CART,
  selectCartItems,
  selectCartTotalAmount,
} from '../../../redux/features/cartSlice'
import { selectShippingAddress } from '../../../redux/features/checkoutSlice'
import { addDoc, collection, Timestamp } from 'firebase/firestore'
import { db } from '../../../firebase/config'
import { Dialog, Pane, Text, Heading } from 'evergreen-ui'
import FlutterPay from "../../../components/flutter/flutter";
import LoadingIcons from "react-loading-icons";




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
  const [shippingAddress, setShippingAddress] = useState({
    ...initialAddressState,
  })

  const [isDialogShown, setIsDialogShown] = useState(false)
    const [loading, setLoading] = useState(false)


  const userID = useSelector(selectUserID)
  const userEmail = useSelector(selectEmail)
  const cartItems = useSelector(selectCartItems)
  const cartTotalAmount = useSelector(selectCartTotalAmount)
  const shipping = useSelector(selectShippingAddress)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const breadcrumb = [
    { title: 'Home', url: '/' },
    { title: 'Cart', url: '/cart' },
    { title: 'Checkout Details' },
  ]

  dispatch(setBreadCrumb(breadcrumb))

  const handleShipping = (e) => {
    const { name, value } = e.target
    setShippingAddress({
      ...shippingAddress,
      [name]: value,
    })
  }

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
      shipping:shippingAddress,
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


  const handleSubmit = (e) => {
    e.preventDefault()
        setLoading(true)

    dispatch(SAVE_SHIPPING_ADDRESS(shippingAddress))
    console.log(shippingAddress, 'address')
    saveOrder()
  }

  const handleDialogClose = () => {
    setIsDialogShown(false)
    navigate('/order-history')
  }

  return (
    <section>
      <div className={`container ${styles.checkout}`}>
        <div className={styles['bread-crumb']}>
          <BreadCrumbLayout title="Checkout Details" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.wrapper}>
            <h3>Shipping Address</h3>
            <Card cardClass={styles.card}>
              <label>Fullname</label>
              <input
                type="text"
                required
                name="name"
                value={shippingAddress.name}
                onChange={(e) => handleShipping(e)}
              />
              <label>Phone</label>
              <input
                type="text"
                required
                name="phone"
                value={shippingAddress.phone}
                onChange={(e) => handleShipping(e)}
              />
              <label>Address line 1</label>
              <input
                type="text"
                required
                name="line1"
                value={shippingAddress.line1}
                onChange={(e) => handleShipping(e)}
              />
              <label>Address line 2</label>
              <input
                type="text"
                name="line2"
                value={shippingAddress.line2}
                onChange={(e) => handleShipping(e)}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '10px',
                }}
              >
                <div>
                  <label>City</label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={shippingAddress.city}
                    onChange={(e) => handleShipping(e)}
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
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '10px',
                }}
              >
                <div>
                  <label>State</label>
                  <input
                    type="text"
                    required
                    name="state"
                    value={shippingAddress.state}
                    onChange={(e) => handleShipping(e)}
                  />
                </div>
                <div>
                  <label>Postal code</label>
                  <input
                    type="text"
                    required
                    name="postal_code"
                    value={shippingAddress.postal_code}
                    onChange={(e) => handleShipping(e)}
                  />
                </div>
              </div>
              <button
                width={'100%'}
                style={{
                  fontSize: '16px',
                  width: '100%',
                  marginTop: '20px',
                  height: '40px',
                }}
                type="submit"
                className="--btn --btn-primary"
              >
                 {loading ?  <LoadingIcons.ThreeDots height={"0.5rem"} /> : 'Proceed To Checkout'}

                {/* Proceed To Checkout */}
              </button>
            </Card>
          </div>
          <div className={styles['summary-card']}>
            <Card cardClass={styles.card}>
              <CheckoutSummary />
            </Card>
          </div>
        </form>

        <Dialog
          isShown={isDialogShown}
          // title="Checkout Successful"
          onCloseComplete={handleDialogClose}
          hasFooter={false}
          // hasHeader={false}
        >
          <Pane textAlign={'center'} marginBottom={'2rem'}>
            <Heading marginBottom={'2rem'} size={600}>
              Your Order was successful!
            </Heading>
            <Text style={{marginTop: '3rem', lineHeight: '18px'}} size={400}>
              Thank you for choosing HasaWear, we make sure that our customers
              gets the best out of our store.!
            </Text>
          </Pane>
          <Pane display="flex" justifyContent="flex-end" marginTop={20}>
            {/* <button   className="--btn --btn-primary" onClick={handleDialogClose} appearance="primary">
              Okay
            </button> */}

                                  <FlutterPay onPay={handleDialogClose}/>

          </Pane>
        </Dialog>

      </div>
    </section>
  )
}

export default CheckoutDetails

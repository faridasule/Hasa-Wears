import React, { useEffect, useState } from 'react'
import useFetchDocument from '../../../custopm-hook/useFetchDocument'
import styles from './order-details.module.scss'
import {useParams } from 'react-router-dom'
import ChangeOrderStatus from '../change-order-status/index'
import { setBreadCrumb } from '../../../redux/features/siteSlice'
import BreadCrumbLayout from '../../bread-crumb/index'
import { useDispatch } from 'react-redux'
import { ChevronRightIcon, ChevronDownIcon } from 'evergreen-ui'
import Loader from '../../content-loader'
import { formatNaira } from '../../../@core/utils'

const OrderDetails = () => {
  const [order, setOrder] = useState(null)
  const [imageErrors, setImageErrors] = useState({})
  const { id } = useParams()
  const { document } = useFetchDocument('orders', id)
  const dispatch = useDispatch()

  const breadcrumb = [
    { title: 'Dashboard', url: '/dashboard' },
    { title: 'Orders', url: '/admin/orders' },
    { title: 'Order Details' },
  ]

  useEffect(() => {
    dispatch(setBreadCrumb(breadcrumb))
  }, [dispatch])

  useEffect(() => {
    setOrder(document)
  }, [document])

  const [showPreview, setShowPreview] = useState([])

  useEffect(() => {
    if (order) {
      setShowPreview(Array(order.cartItems.length).fill(false))
    }
  }, [order])

  const shippingAddress = order?.shipping || {}
  const { line1, line2, city, state, country } = shippingAddress

  const handleImageError = (index) => {
    setImageErrors((prevErrors) => ({
      ...prevErrors,
      [index]: true,
    }))
  }

  const handlePreview = (e, index) => {
    e.stopPropagation()
    const updateShowPreview = [...showPreview]
    updateShowPreview[index] = !updateShowPreview[index]
    setShowPreview(updateShowPreview)

    if (window.innerWidth > 600) {
      setShowPreview(Array(order.cartItems.length).fill(false))
    }
  }


  if (!order) {
    return <Loader/>
  }

  return (
    <>
      <div className={styles.table}>
        <div className={styles['bread-crumb']}>
          <BreadCrumbLayout title="Manage Orders Details" />
        </div>
        <div className={styles['details-wrapper']}>
          <table>
            <thead>
              <tr>
                <th className={styles.hideOnMobile}>s/n</th>
                <th>Product</th>
                <th className={styles.hideOnMobile}>Price</th>
                <th className={styles.hideOnMobile}>Quantity</th>
                <th className={styles.hideOnMobile}>Total</th>
                <th className={styles.showOnMobile}></th>
              </tr>
            </thead>
            <tbody>
              {order.cartItems.map((cart, index) => {
                const { id, name, price, imageURL, cartQuantity } = cart
                return (
                  <React.Fragment key={id}>
                    <tr>
                      <td className={styles.hideOnMobile}>{index + 1}</td>
                      <td>
                        <p>
                          <b>{name}</b>
                        </p>
                        {imageErrors[index] ? (
                          <p>
                            Image not available (Product might have been
                            deleted)
                          </p>
                        ) : (
                          <img
                            src={imageURL}
                            alt={name}
                            style={{ width: '100px' }}
                            onError={() => handleImageError(index)}
                          />
                        )}
                      </td>
                      <td className={styles.hideOnMobile}>
                        {formatNaira(price)}
                      </td>
                      <td className={styles.hideOnMobile}>{cartQuantity}</td>
                      <td className={styles.hideOnMobile}>
                        {formatNaira(price * cartQuantity)}
                      </td>
                      <td className={`${styles.icons} ${styles.showOnMobile}`}>
                        <button
                          onClick={(e) => handlePreview(e, index)}
                          title="preview-button"
                        >
                          {!showPreview[index] ? (
                            <ChevronRightIcon
                              color="#007AFF"
                              size={20}
                              title="right-arrow-icon"
                            />
                          ) : (
                            <ChevronDownIcon
                              color="#007AFF"
                              size={20}
                              title="down-arrow-icon"
                            />
                          )}
                        </button>
                      </td>
                    </tr>

                    {showPreview[index] && (
                      <tr className={styles['additional-row']}>
                        <td colSpan="6">
                          <div className={styles['toggle-content']}>
                            <p>
                              <b>Price:</b> {formatNaira(price)}
                            </p>
                            <p>
                              <b>Cart Quantity:</b>
                              {cartQuantity}
                            </p>
                            <p>
                              <b>Total Price:</b>{' '}
                              {formatNaira(price * cartQuantity)}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
          <div className={styles['summary-wrapper']}>
            <p>
              <b>Order ID:</b> {order.id}
            </p>
            <p>
              <b>Order Amount:</b> {formatNaira(order.orderAmount)}
            </p>
            <p>
              <b>Order Status:</b> {order.orderStatus}
            </p>
            <p>
              <b>Shipping Address:</b> {line1 || 'N/A'}, {line2 || 'N/A'},{' '}
              {city || 'N/A'}
            </p>
            <p>
              <b>State:</b> {state || 'N/A'}
            </p>
            <p>
              <b>Country:</b> {country || 'N/A'}
            </p>
            <br />
            <ChangeOrderStatus order={order} id={id} />
          </div>
        </div>
      </div>
    </>
  )
}

export default OrderDetails

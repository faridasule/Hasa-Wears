import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import useFetchDocument from '../../custopm-hook/useFetchDocument'
import Loader from '../../components/content-loader/index'
import styles from './order-details.module.scss'
import { setBreadCrumb } from '../../redux/features/siteSlice'
import BreadCrumbLayout from '../../components/bread-crumb/index'
import { useDispatch } from 'react-redux'
import { ChevronDownIcon, ChevronRightIcon, Dialog } from 'evergreen-ui'
import ReviewProduct from '../../components/review-product/index'

const OrderDetails = () => {
  const [order, setOrder] = useState(null)
  const { id } = useParams()
  const { document } = useFetchDocument('orders', id)
  const [showDetails, setShowDetails] = useState({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [reviewProductId, setReviewProductId] = useState(null)
  const dispatch = useDispatch()

  const breadcrumb = [
    { title: 'Home', url: '/' },
    { title: 'Order History', url: '/order-history' },
    { title: 'Order Details' },
  ]

  dispatch(setBreadCrumb(breadcrumb))

  useEffect(() => {
    setOrder(document)
  }, [document])

  const handleToggle = (index) => {
    setShowDetails((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }))
  }

  const openDialog = (productId) => {
    setReviewProductId(productId)
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setReviewProductId(null)
  }

  return (
    <section className={styles.section}>
      <div className={`container ${styles.table}`}>
        <div className={styles['bread-crumb']}>
          <BreadCrumbLayout title="Order Details" />
        </div>
        {order === null ? (
          <Loader />
        ) : (
          <>
            <div className={styles['details-div']}>
              <p>
                <b>Order ID:</b> {order.id}
              </p>
              <p>
                <b>Order Amount:</b> ${order.orderAmount}
              </p>
              <p>
                <b>Order Status:</b>{' '}
                <span
                  className={
                    order.orderStatus !== 'Delivered'
                      ? `${styles.pending}`
                      : `${styles.delivered}`
                  }
                >
                  {order.orderStatus}
                </span>
              </p>
              <br />
            </div>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th className={styles.desktopRow}>Name</th>
                  <th className={styles.desktopRow}>Price</th>
                  <th className={styles.desktopRow}>Quantity</th>
                  <th className={styles.desktopRow}>Total</th>
                  <th className={styles.desktopRow}></th>
                  <th className={styles.showOnMobile}>Toggle</th>
                </tr>
              </thead>
              <tbody>
                {order.cartItems.map((cart, index) => {
                  const { id, name, price, imageURL, cartQuantity } = cart
                  const isToggled = showDetails[index]

                  return (
                    <React.Fragment key={id}>
                      <tr>
                        <td>
                          <img
                            src={imageURL}
                            alt={name}
                            style={{ width: '100px' }}
                          />
                        </td>
                        <td className={styles.desktopRow}>{name}</td>
                        <td className={styles.desktopRow}>${price}</td>
                        <td className={styles.desktopRow}>{cartQuantity}</td>
                        <td className={styles.desktopRow}>
                          ${(price * cartQuantity).toFixed(2)}
                        </td>
                        <td
                          className={`${styles.desktopRow} ${styles.icons}`}
                        >
                          <Link href='#' onClick={() => openDialog(id)}>
                            Review Product
                          </Link>
                        </td>

                        <td className={styles.showOnMobile}>
                          <button onClick={() => handleToggle(index)}>
                            {!isToggled ? (
                              <ChevronRightIcon color="#007AFF" size={25} />
                            ) : (
                              <ChevronDownIcon color="#007AFF" size={25} />
                            )}
                          </button>
                        </td>
                      </tr>
                      {isToggled && (
                        <tr className={styles.mobileDetails}>
                          <td colSpan="6">
                            <div className={styles.details}>
                              <p>
                                <b>Name:</b> {name}
                              </p>
                              <p>
                                <b>Price:</b> ${price}
                              </p>
                              <p>
                                <b>Quantity:</b> {cartQuantity}
                              </p>
                              <p>
                                <b>Total:</b> $
                                {(price * cartQuantity).toFixed(2)}
                              </p>
                              <button onClick={() => openDialog(id)}>
                                Review Product
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </>
        )}

        {/* Dialog for ReviewProduct */}
        <Dialog
          isShown={isDialogOpen}
          title="Review Product"
          onCloseComplete={closeDialog}
          hasFooter={false}
          shouldCloseOnOverlayClick={true}
        >
          {reviewProductId && <ReviewProduct  onClose={closeDialog}  id={reviewProductId} />}
        </Dialog>
      </div>
    </section>
  )
}

export default OrderDetails

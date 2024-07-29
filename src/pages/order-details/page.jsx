import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useFetchDocument from '../../custopm-hook/useFetchDocument';
import Loader from '../../components/content-loader/index';
import styles from './order-details.module.scss';
import { setBreadCrumb } from '../../redux/features/siteSlice';
import BreadCrumbLayout from '../../components/bread-crumb/index';
import { useDispatch } from 'react-redux';
import { ChevronDownIcon, ChevronRightIcon, Dialog, Pagination } from 'evergreen-ui';
import ReviewProduct from '../../components/review-product/index';
import { formatNaira } from '../../@core/utils';

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const { id } = useParams();
  const { document } = useFetchDocument('orders', id);
  const [showDetails, setShowDetails] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reviewProductId, setReviewProductId] = useState(null);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

   // Breadcrumbs navigation for the page
  const breadcrumb = [
    { title: 'Home', url: '/' },
    { title: 'Order History', url: '/order-history' },
    { title: 'Order Details' },
  ];

  // Set breadcrumb navigation in the Redux store
  useEffect(() => {
    dispatch(setBreadCrumb(breadcrumb));
  }, [dispatch]);

  useEffect(() => {
    setOrder(document);
  }, [document]);

  const handleToggle = (index) => {
    setShowDetails((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  //Open Dialog
  const openDialog = (productId) => {
    setReviewProductId(productId);
    setIsDialogOpen(true);
  };

 //Close Dialog
  const closeDialog = () => {
    setIsDialogOpen(false);
    setReviewProductId(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = order ? order.cartItems.slice(indexOfFirstItem, indexOfLastItem) : [];
  const totalPages = order ? Math.ceil(order.cartItems.length / itemsPerPage) : 1;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
                <b>Order Amount:</b> {formatNaira(order.orderAmount)}
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
                {currentItems.map((cart, index) => {
                  const { id, name, price, imageURL, cartQuantity } = cart;
                  const isToggled = showDetails[index];

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
                        <td className={styles.desktopRow}>{formatNaira(price)}</td>
                        <td className={styles.desktopRow}>{cartQuantity}</td>
                        <td className={styles.desktopRow}>
                          {formatNaira(price * cartQuantity)}
                        </td>
                        <td
                          className={`${styles.desktopRow} ${styles.icons}`}
                        >
                          <Link to="#" onClick={() => openDialog(id)}>
                            Review Product
                          </Link>
                        </td>
                        <td className={styles.showOnMobile}>
                          <button onClick={() => handleToggle(index)}>
                            {!isToggled ? (
                              <ChevronRightIcon title="open" color="#007AFF" size={25} />
                            ) : (
                              <ChevronDownIcon title="close" color="#007AFF" size={25} />
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
                                <b>Price:</b> {formatNaira(price)}
                              </p>
                              <p>
                                <b>Quantity:</b> {cartQuantity}
                              </p>
                              <p>
                                <b>Total:</b> {formatNaira(price * cartQuantity)}
                              </p>
                              <button onClick={() => openDialog(id)}>
                                Review Product
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
              {order.cartItems.length > 5 && (
              <div className={styles.pagination}>

              <Pagination
                page={currentPage}
                totalPages={totalPages}
                onPreviousPage={() => handlePageChange(currentPage - 1)}
                onNextPage={() => handlePageChange(currentPage + 1)}
                onPageChange={handlePageChange}
                />
                </div>
             )} 
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
          {reviewProductId && <ReviewProduct onClose={closeDialog} id={reviewProductId} />}
        </Dialog>
      </div>
    </section>
  );
};

export default OrderDetails;

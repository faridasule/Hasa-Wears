import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useFetchCollection from "../../../custopm-hook/useFetchCollection";
import { setBreadCrumb } from '../../../redux/features/siteSlice';
import BreadCrumbLayout from '../../bread-crumb/index';
import {
  selectOrderHistory,
  STORE_ORDERS,
} from "../../../redux/features/orderSlice";
import Loader from "../../content-loader/index";
import styles from "./order.module.scss";
import { ChevronRightIcon, ChevronDownIcon } from "evergreen-ui";
import { Pagination } from 'evergreen-ui'; // Import Pagination component

const Orders = () => {
  const { data, isLoading } = useFetchCollection("orders");
  const orders = useSelector(selectOrderHistory);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const breadcrumb = [
    { title: 'Dashboard', url: '/dashboard' },
    { title: 'Orders' },
  ];

  useEffect(() => {
    dispatch(setBreadCrumb(breadcrumb));
    dispatch(STORE_ORDERS(data));
  }, [dispatch, data]);

  const handleClick = (id) => {
    navigate(`/admin/order-details/${id}`);
  };

  const formatNaira = (amount) => {
    return '₦' + amount.toLocaleString();
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  // Calculate page data
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const [showPreview, setShowPreview] = useState(
    Array(orders.length).fill(false)
  );

  const handlePreview = (e, index) => {
    e.stopPropagation();
    const updateShowPreview = [...showPreview];
    updateShowPreview[index] = !updateShowPreview[index];
    setShowPreview(updateShowPreview);

    // Close all previews when screen size is larger than 600px
    if (window.innerWidth > 600) {
      setShowPreview(Array(orders.length).fill(false));
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className={styles.table}>
        <div className={styles['bread-crumb']}>
          <BreadCrumbLayout title="Manage Orders" />
        </div>

        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th className={styles.hideOnMobile}>s/n</th>
                  <th>Date</th>
                  <th className={styles.hideOnMobile}>Order ID</th>
                  <th className={styles.hideOnMobile}>Order Amount</th>
                  <th className={styles.hideOnMobile}>Order Status</th>
                  <th className={styles.showOnMobile}></th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order, index) => {
                  const {
                    id,
                    orderDate,
                    orderTime,
                    orderAmount,
                    orderStatus,
                  } = order;
                  return (
                    <React.Fragment key={id}>
                      <tr onClick={() => handleClick(id)}>
                        <td className={styles.hideOnMobile}>{index + 1 + indexOfFirstOrder}</td>
                        <td>{orderDate} at {orderTime}</td>
                        <td className={styles.hideOnMobile}>{id}</td>
                        <td className={styles.hideOnMobile}>
                          {formatNaira(orderAmount)}
                        </td>
                        <td className={styles.hideOnMobile}>
                          <p
                            className={
                              orderStatus !== "Delivered"
                                ? styles.pending
                                : styles.delivered
                            }
                          >
                            {orderStatus}
                          </p>
                        </td>
                        <td className={`${styles.icons} ${styles.showOnMobile}`}>
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
                        <td className={styles.hideOnMobile}>View more</td>

                      </tr>
                      {showPreview[index] && (
                        <tr className={styles['additional-row']}>
                          <td colSpan="6">
                            <div className={styles['toggle-content']}>
                              <p>
                                <b>Id:</b> {id}
                              </p>
                              <p>
                                <b>Price:</b> {formatNaira(orderAmount)}
                              </p>
                              <p className={
                                orderStatus !== "Delivered"
                                  ? styles.pending
                                  : styles.delivered
                              }>
                                <b>Status:</b> {orderStatus}
                              </p>
                                <p style={{color: '#007AFF'}} onClick={() => handleClick(id)}> View more
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>

            {orders.length > 0 && (
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
      </div>
    </>
  );
};

export default Orders;

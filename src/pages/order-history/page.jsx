import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/content-loader/index";
import useFetchCollection from "../../custopm-hook/useFetchCollection";
import { selectUserID } from "../../redux/features/authSlice";
import { selectOrderHistory, STORE_ORDERS } from "../../redux/features/orderSlice";
import styles from "./order-history.module.scss";
import { setBreadCrumb } from '../../redux/features/siteSlice';
import BreadCrumbLayout from '../../components/bread-crumb/index';
import { ChevronDownIcon, ChevronRightIcon, Pagination } from 'evergreen-ui';
import { formatNaira } from "../../@core/utils";

const OrderHistory = () => {
  const { data, isLoading } = useFetchCollection("orders");
  const orders = useSelector(selectOrderHistory);
  const userID = useSelector(selectUserID);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of items per page

  const breadcrumb = [
    { title: 'Home', url: '/' },
    { title: 'Order History' },
  ];

  useEffect(() => {
    dispatch(setBreadCrumb(breadcrumb));
  }, [dispatch]);

  useEffect(() => {
    dispatch(STORE_ORDERS(data));
    setShowDetails(Array(data.length).fill(false));
  }, [dispatch, data]);

  const handleClick = (id) => {
    navigate(`/order-details/${id}`);
  };

  const toggleDetails = (index) => {
    const updatedShowDetails = [...showDetails];
    updatedShowDetails[index] = !updatedShowDetails[index];
    setShowDetails(updatedShowDetails);
  };

  const filteredOrders = orders.filter((order) => order.userID === userID);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <section className={styles.section}>
      <div className={`container ${styles.order}`}>
        <div className={styles['bread-crumb']}>
          <BreadCrumbLayout title="Order History" />
        </div>
        <>
          {isLoading && <Loader />}
          <div className={styles.table}>
            {filteredOrders.length === 0 ? (
              <p style={{ fontWeight: '700', fontSize: '20px', marginTop: '20px' }} className="--center-all">No order found</p>
            ) : (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>s/n</th>
                      <th>Date</th>
                      <th className={styles.hideOnMobile}>Order ID</th>
                      <th className={styles.hideOnMobile}>Order Amount</th>
                      <th className={styles.hideOnMobile}>Order Status</th>
                      <th className={styles.hideOnMobile}></th>
                      <th className={styles.showOnMobile}>Toggle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((order, index) => {
                      const {
                        id,
                        orderDate,
                        orderTime,
                        orderAmount,
                        orderStatus,
                      } = order;
                      return (
                        <React.Fragment key={id}>
                          <tr>
                            <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                            <td>{orderDate} at {orderTime}</td>
                            <td className={styles.hideOnMobile}>{id}</td>
                            <td className={styles.hideOnMobile}>{formatNaira(orderAmount)}</td>
                            <td className={styles.hideOnMobile}>
                              <p className={orderStatus !== "Delivered" ? `${styles.pending}` : `${styles.delivered}`}>
                                {orderStatus}
                              </p>
                            </td>
                            <td className={styles.hideOnMobile} onClick={() => handleClick(id)}>View More</td>
                            <td className={styles.showOnMobile}>
                              <button onClick={() => toggleDetails(index)}>
                                {!showDetails[index] ? (
                                  <ChevronRightIcon color="#007AFF" size={25} />
                                ) : (
                                  <ChevronDownIcon color="#007AFF" size={25} />
                                )}
                              </button>
                            </td>
                          </tr>
                          {showDetails[index] && (
                            <tr className={styles.additionalRow}>
                              <td colSpan="6">
                                <div className={styles.details}>
                                  <div><strong>Order Id:</strong>{id}</div>
                                  <div><strong>Order Amount:</strong>{formatNaira(orderAmount)}</div>
                                  <div style={{ display: 'flex', gap: '14px' }}><strong>Order Status:</strong>
                                    <p className={orderStatus !== "Delivered" ? `${styles.pending}` : `${styles.delivered}`}>
                                      {orderStatus}
                                    </p>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'flex-end' }} onClick={() => handleClick(id)}><strong style={{ color: '#007AFF', fontWeight: 400 }}>View More</strong></div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </>
            )}
          </div>
          {filteredOrders.length > 6 && (
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
      </div>
    </section>
  );
};

export default OrderHistory;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/content-loader/index";
import useFetchCollection from "../../custopm-hook/useFetchCollection";
import { selectUserID } from "../../redux/features/authSlice";
import { selectOrderHistory, STORE_ORDERS } from "../../redux/features/orderSlice";
import styles from "./order-history.module.scss";
import { setBreadCrumb } from '../../redux/features/siteSlice'
import BreadCrumbLayout from '../../components/layout/index'
import { ChevronDownIcon, ChevronRightIcon } from 'evergreen-ui';

const OrderHistory = () => {
  const { data, isLoading } = useFetchCollection("orders");
  const orders = useSelector(selectOrderHistory);
  const userID = useSelector(selectUserID);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(Array(data.length).fill(false));

  const breadcrumb = [
    { title: 'Home', url: '/' },
    { title: 'Order History'},
  ]

  dispatch(setBreadCrumb(breadcrumb))

  useEffect(() => {
    dispatch(STORE_ORDERS(data));
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
              <p style={{fontWeight: '700', fontSize: '20px', marginTop: '20px'}} className="--center-all">No order found</p>
            ) : (
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
                  {filteredOrders.map((order, index) => {
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
                          <td>{index + 1}</td>
                          <td>{orderDate} at {orderTime}</td>
                          <td className={styles.hideOnMobile}>{id}</td>
                          <td className={styles.hideOnMobile}>{"$"}{orderAmount}</td>
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
                            <td colSpan="7">
                              <div className={styles.details}>
                                   <div><strong>Order Id:</strong>{id}</div>

                                <div><strong>Order Amount:</strong> {"N"}{orderAmount}</div>
                                <div style={{display: 'flex', gap: '14px'}}><strong>Order Status:</strong> 
                                  <p className={orderStatus !== "Delivered" ? `${styles.pending}` : `${styles.delivered}`}>
                                    {orderStatus}
                                  </p>
                                </div>
                                <div style={{display: 'flex', justifyContent: 'flex-end', }} onClick={() => handleClick(id)}><strong style={{color: '#007AFF', fontWeight: 400}}>View More</strong></div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      </div>
    </section>
  );
};

export default OrderHistory;

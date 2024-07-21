import React, { useEffect } from "react";
import InfoBox from "../../info-box/index";
import styles from "./dashboard.module.scss";
import { AiFillDollarCircle } from "react-icons/ai";
import { BsCart4 } from "react-icons/bs";
import { FaCartArrowDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  selectProducts,
  STORE_PRODUCTS,
} from "../../../redux/features/productSlice";
import {
  CALC_TOTAL_ORDER_AMOUNT,
  selectOrderHistory,
  selectTotalOrderAmount,
  STORE_ORDERS,
} from "../../../redux/features/orderSlice";
import useFetchCollection from "../../../custopm-hook/useFetchCollection";
import Chart from "../../chart/index";
import PieChart from "../../piechart";

//Icons
const earningIcon = <AiFillDollarCircle size={20} color="#BDBDBD" />;
const productIcon = <BsCart4 size={25} color="#BDBDB" />;
const ordersIcon = <FaCartArrowDown size={20} color="#BDBDBD" />;

const Dashboard = () => {
  const products = useSelector(selectProducts);
  const orders = useSelector(selectOrderHistory);
  const totalOrderAmount = useSelector(selectTotalOrderAmount);
console.log(totalOrderAmount, 'amount')
  const fbProducts = useFetchCollection("products");
  const { data } = useFetchCollection("orders");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      STORE_PRODUCTS({
        products: fbProducts.data,
      })
    );

    dispatch(STORE_ORDERS(data));

    dispatch(CALC_TOTAL_ORDER_AMOUNT());
  }, [dispatch, data, fbProducts]);

  return (
    <div className={styles.home}>
      <h3 style={{fontWeight: "700"}}>Dashboard</h3>
      <div className={styles["info-box"]}>
        <InfoBox
          cardClass={`${styles.card} ${styles.card1}`}
          title={"Total Revenue"}
          count={`₦${totalOrderAmount}`}
          icon={earningIcon}
        />
        <InfoBox
          cardClass={`${styles.card} ${styles.card2}`}
          title={"Total Products"}
          count={products.length}
          icon={productIcon}
        />
        <InfoBox
          cardClass={`${styles.card} ${styles.card3}`}
          title={"Total Orders"}
          count={orders.length}
          icon={ordersIcon}
        />
      </div>
    <hr style={{width: '100%', marginBottom: '10px', marginTop: '15px', color: '#E4E4E7', fontWeight: '100'}} />
      <div className={styles['chart-wrapper']} style={{display: 'flex'}}>
        <Chart />
        <PieChart/>
      </div>
    </div>
  );
};

export default Dashboard;

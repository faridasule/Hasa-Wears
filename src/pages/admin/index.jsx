import React from "react";
import { Route, Routes } from "react-router-dom";
import AddProduct from "../../components/admin/add-product";
import Home from "../../components/admin/home";
import NavBar from "../../components/admin/navbar";
import OrderDetails from "../../components/admin/order-details";
import Orders from "../../components/admin/orders";
import ViewProducts from "../../components/admin/view-product";

import styles from "./admin.module.scss";

const Admin = () => {
  return (
    <div className={styles.admin}>
      <div className={styles.navbar}>
        <NavBar />
      </div>
      <div className={styles.content}>
        <Routes>
          <Route path="home" element={<Home />} />
          <Route path="all-products" element={<ViewProducts />} />
          <Route path="add-product/:id" element={<AddProduct />} />
          <Route path="orders" element={<Orders />} />
          <Route path="order-details/:id" element={<OrderDetails />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;

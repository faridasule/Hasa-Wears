import React from "react";
import { Route, Routes } from "react-router-dom";
import AddProduct from "../../components/admin/add-product";
import Dashboard from "../../components/admin/dashboard";
import NavBar from "../../components/admin/navbar";
import OrderDetails from "../../components/admin/order-details";
import Orders from "../../components/admin/orders";
import ViewProducts from "../../components/admin/view-product";

import styles from "./admin.module.scss";
import AdminLayout from "../../components/layout/admi-layout";

const Admin = () => {
  return (
    <div className={styles.admin}>
   <AdminLayout>
      <div className={styles.content}>
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="all-products" element={<ViewProducts />} />
          <Route path="add-product/:id" element={<AddProduct />} />
          <Route path="orders" element={<Orders />} />
          <Route path="order-details/:id" element={<OrderDetails />} />
        </Routes>
        </div>
        </AdminLayout>
    </div>
  );
};

export default Admin;

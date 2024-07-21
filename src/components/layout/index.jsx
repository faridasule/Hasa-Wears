import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../header/index';
// import AdminHeader from './admin-header';
import Footer from '../footer/index';
import AdminLayout from './admi-layout';

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {isAdminRoute ? null : <Header />}
      {children}
          {isAdminRoute ? null : <Footer/>}
 
    </>
  );
};

export default Layout;

import './App.scss'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/header'
import Footer from './components/footer'
import ProductDetails from './components/product/product-details/index'
import Cart from './pages/cart/page'
import CheckoutDetails from "./pages/checkout/checkout-details/page";
import OrderDetails from "./pages/order-details/page";
import OrderHistory from "./pages/order-history/page";
import ReviewProducts from "./components/review-product/index"
import ContactPage from "./pages/contact/page";
import AboutPage from "./pages/about/page";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import NotFound from './pages/not-found/page';
import AdminOnlyRoute from './components/admin-route'
import Admin from './pages/admin'
import { Home, Login, Register, Reset } from './pages'
import Layout from './components/layout'

function App() {

    // const location = useLocation();

  // Check if the current path starts with /admin
  // const isAdminRoute = location.pathname.startsWith('/admin');
  return (
    <div>
      <BrowserRouter>
        <ToastContainer />
        {/* <Header /> */}
              {/* {!isAdminRoute ? null: <Header />} */}
<Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset" element={<Reset />} />
          <Route path='/contact' element={<ContactPage />} />
          <Route path='/about' element={<AboutPage/>} />


          <Route
            path="/admin/*"
            element={
              <AdminOnlyRoute>
                <Admin />
              </AdminOnlyRoute>
            }
          />

          <Route path="/product-details/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
           <Route path="/checkout-details" element={<CheckoutDetails />} />
            <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/order-details/:id" element={<OrderDetails />} />
          <Route path="/review-product/:id" element={<ReviewProducts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
</Layout>
        {/* <Footer /> */}
      </BrowserRouter>
    </div>
  )
}

export default App

import logo from './logo.svg'
import './App.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/header'
import Footer from './components/footer'
import ProductDetails from './components/product/product-details/index'
import Cart from './pages/cart/page'
import CheckoutDetails from "./pages/checkout/checkout-details/page";
import Checkout from "./pages/checkout/page";
import OrderDetails from "./pages/order-details/page";
import OrderHistory from "./pages/order-history/page";
import ReviewProducts from "./components/review-product/index"
import Contact from "./pages/contact/page";


import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import NotFound from './pages/not-found/page';
import AdminOnlyRoute from './components/admin-route'
import Admin from './pages/admin'
import { Home, Login, Register, Reset } from './pages'

function App() {
  return (
    <div>
      <BrowserRouter>
        <ToastContainer />
        <Header />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset" element={<Reset />} />
          <Route path='/contact' element={<Contact/>} />

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
          <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/order-details/:id" element={<OrderDetails />} />
          <Route path="/review-product/:id" element={<ReviewProducts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App

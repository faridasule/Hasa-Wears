import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import styles from "./header.module.scss";
import { FaTimes, FaHeart } from "react-icons/fa";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { auth } from "../../firebase/config";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  REMOVE_ACTIVE_USER,
  SET_ACTIVE_USER,
  selectIsLoggedIn,
} from "../../redux/features/authSlice";
import { AdminOnlyLink } from "../admin-route/index";
import { Avatar, Dialog, Pane, Badge } from "evergreen-ui"; // Import Evergreen UI components
import {
  CALCULATE_TOTAL_QUANTITY,
  selectCartTotalQuantity,
} from "../../redux/features/cartSlice";
import {
  selectWishlistItems,
  selectWishlistTotalQuantity
} from "../../redux/features/wishlistSlice";
import { HiShoppingCart } from "react-icons/hi2";
import Wishlist from "../wishlist";
import AvatarPopover from "../avartar-popovers/index";

const logo = (
  <div className={styles.logo}>
    <Link to="/">
      <h2>
        Hasa<span>Wears</span>.
      </h2>
    </Link>
  </div>
);

const activeLink = ({ isActive }) => (isActive ? `${styles.active}` : "");

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [scrollPage, setScrollPage] = useState(false);
  const [showWishlistDialog, setShowWishlistDialog] = useState(false); // State for wishlist dialog

  const cartTotalQuantity = useSelector(selectCartTotalQuantity);
  const wishTotalQuantity = useSelector(selectWishlistTotalQuantity);
  const wishlistItems = useSelector(selectWishlistItems); // Assuming you have selector for wishlist items

  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const navigate = useNavigate();

  const hideMenu = () => {
    setShowMenu(false);
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const fixNavbar = () => {
    if (window.scrollY > 50) {
      setScrollPage(true);
    } else {
      setScrollPage(false);
    }
  };
  window.addEventListener("scroll", fixNavbar);

  useEffect(() => {
    dispatch(CALCULATE_TOTAL_QUANTITY());
  }, [dispatch]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.displayName == null) {
          const u1 = user.email.substring(0, user.email.indexOf("@"));
          const uName = u1.charAt(0).toUpperCase() + u1.slice(1);
          setDisplayName(uName);
        } else {
          setDisplayName(user.displayName);
        }

        dispatch(
          SET_ACTIVE_USER({
            email: user.email,
            userName: user.displayName ? user.displayName : displayName,
            userID: user.uid,
          })
        );
      } else {
        setDisplayName("");
        dispatch(REMOVE_ACTIVE_USER());
      }
    });
  }, [dispatch, displayName]);

  const logoutUser = () => {
    signOut(auth)
      .then(() => {
        toast.success("Logout successfully.");
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  // Cart Icons
  const cart = (
    <div className={styles["badge-container"]}>
      <Link to="/cart">
        <Badge
          className={styles["badge-content"]}
          color="red"
          onClick={() => navigate("/cart/")}
        >{cartTotalQuantity}</Badge>
        <HiShoppingCart size={25} color="#B0BABF" />
      </Link>
    </div>
  );

  //Wishlist Icons
  const wishlist = (
    <div className={styles["badge-container"]}>
      <div onClick={() => setShowWishlistDialog(true)}> {/* Show wishlist dialog on click */}
        <Badge
          className={styles["badge-content"]}
          color="red"
          badgeContent={wishTotalQuantity}
        >{wishTotalQuantity}</Badge>
        <FaHeart size={25} color="#B0BABF" />
      </div>
    </div>
  );

  return (
    <header className={scrollPage ? `${styles.fixed}` : null}>
      <div className={styles.header}>
        {logo}
        <nav  className={showMenu ? `${styles["show-nav"]}`:`${styles["hide-nav"]}`} >
          <div
            className={
              showMenu
                ? `${styles["nav-wrapper"]} ${styles["show-nav-wrapper"]}`
                : `${styles["nav-wrapper"]}`
            }
            onClick={hideMenu}
          ></div>

          <ul onClick={hideMenu}>
            <li className={styles["logo-mobile"]}>
              {logo}
              <FaTimes size={20} color="#252C32" onClick={hideMenu} />
            </li>
            <li className={styles["name"]}>
              {isLoggedIn && (
                <a color="#fff" href="#home">
                  <Avatar
                    name={displayName}
                    size={60}
                    hashValue="id_124"
                    marginRight={16}
                  />
                </a>
              )}
            </li>
          
            <li>
              <NavLink to="/" className={activeLink}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={activeLink}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={activeLink}>
                Contact Us
              </NavLink>
            </li>
              <li>
              <AdminOnlyLink>
                <Link to="/admin/dashboard">
                  <button className="--btn">Dashboard</button>
                </Link>
              </AdminOnlyLink>
            </li>
           <li className={styles['cart-container']}>
    Cart {cart}
  
            </li>
               <li className={styles['cart-container']}>
    Wishlist {wishlist}
</li>

          </ul>
          <div className={styles["header-right"]} onClick={hideMenu}>
            <span className={styles.links}>
            
          
              {/* {isLoggedIn && (
                <NavLink to="/order-history" className={activeLink}>
                  My Orders
                </NavLink>
              )} */}
              <div className={styles.qty}>
                <div className={styles.cart}>{cart}</div>
              <div className={styles.cart}>{wishlist}</div>
              </div>
                {!isLoggedIn && (
                <NavLink className={styles.auth} to="/login">
                  Sign In
                </NavLink>
              )}
              {/* {isLoggedIn && (
                <NavLink className={styles.auth} onClick={logoutUser} to="/">
                  Logout
                </NavLink>
              )} */}
                      <div className={styles['desktop-avartar']}>
              {isLoggedIn && (
                <a color="#fff" href="#home">
                  {/* <Avatar
                    name={displayName}
                    size={40}
                    hashValue="id_124"
                    marginLeft={16}
                  /> */}
                          <AvatarPopover displayName={displayName} />

                </a>
              )}
            </div>
            </span>
          </div>
        </nav>
        <div className={styles["menu-icon"]}>
        
          <div style={{ marginLeft: "20px" }}>
            <HiOutlineMenuAlt3 color="#252C32" size={25} onClick={toggleMenu} />
          </div>
        </div>
      </div>

      {/* Wishlist Dialog */}

       <Dialog
        isShown={showWishlistDialog}
        title="Items in Wishlist"
        onCloseComplete={() => setShowWishlistDialog(false)}
        hasFooter={false}
      >
        <Pane>
          <Wishlist closeDialog={() => setShowWishlistDialog(false)} />
        </Pane>
      </Dialog>

      
    </header>
  );
};

export default Header;

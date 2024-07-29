import styles from "./header.module.scss";
import React, { useEffect, useState } from "react";
import {onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { SideSheet, Position} from "evergreen-ui";
import { RxHamburgerMenu } from "react-icons/rx";
import NavBar from "../navbar";
import {
  REMOVE_ACTIVE_USER,
  SET_ACTIVE_USER,
  selectIsLoggedIn,
} from "../../../redux/features/authSlice";
import { auth } from "../../../firebase/config";
import AvatarPopover from "../../avartar-popovers";

const AdminHeader = ({ mode }) => {
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    // Check if a user is authenticated and set user details
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (!user.displayName) {
          const u1 = user.email.substring(0, user.email.indexOf("@"));
          const uName = u1.charAt(0).toUpperCase() + u1.slice(1);
          setDisplayName(uName);
        } else {
          setDisplayName(user.displayName);
        }

        dispatch(
          SET_ACTIVE_USER({
            email: user.email,
            userName: user.displayName || displayName,
            userID: user.uid,
          })
        );
      } else {
        setDisplayName("");
        dispatch(REMOVE_ACTIVE_USER());
      }
    });
  }, [dispatch, displayName]);

  useEffect(() => {
    // Handle resizing to close mobile nav if window width exceeds 900px
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setShowMobileNav(false);
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <header className={styles.header}>
        <span className={styles["logo-wrapper"]}>
          <RxHamburgerMenu
            size={25}
            onClick={() => setShowMobileNav(!showMobileNav)}
            color="#252C32"
          />
          {mode !== 'Full' && (
            <div className={styles.logo}>
              <Link to="/">
                <h2>
                  Hasa<span>Wears</span>.
                </h2>
              </Link>
            </div>
          )}
        </span>

        <ul className={styles.nav}>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/contact">Contact Us</a>
          </li>
        </ul>

        <ul className={styles.started}>
          {isLoggedIn && (
            <li className={styles["name"]}>
              <a color="#fff" href="#home">
                <AvatarPopover displayName={displayName} />
              </a>
            </li>
          )}
        </ul>
      </header>

      <SideSheet
        isShown={showMobileNav}
        onCloseComplete={() => setShowMobileNav(false)}
        position={Position.LEFT}
        width={"80dvw"}
        preventBodyScrolling
      >
        <div onClick={() => setShowMobileNav(false)}>
          <NavBar mode={"Full"} />
        </div>
      </SideSheet>
    </>
  );
};

export default AdminHeader;

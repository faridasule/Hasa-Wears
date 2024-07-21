import styles from "./header.module.scss";
import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import {Link } from "react-router-dom";




import { SideSheet, Position, Avatar } from "evergreen-ui";
import { RxHamburgerMenu } from "react-icons/rx";
import NavBar from "../navbar";
import {
  REMOVE_ACTIVE_USER,
  SET_ACTIVE_USER,
  selectIsLoggedIn,
} from "../../../redux/features/authSlice";
import { auth } from "../../../firebase/config";



const AdminHeader = ({mode}) => {
	const [showLogin, setShowLogin] = useState(false);
	const [showMobileNav, setShowMobileNav] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const dispatch = useDispatch();

	  const isLoggedIn = useSelector(selectIsLoggedIn);

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
	
  useEffect(() => {
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
						onClick={() => {
							setShowMobileNav(!showMobileNav);
						}}
						 color="#252C32"
					/>
					{mode !== 'Full' ?
						<div className={styles.logo}>
							<Link to="/">
								<h2>
									Hasa<span>Wears</span>.
								</h2>
							</Link>
						</div> : ''}
				</span>
				{/* {!withoutSearch && (
					<div className={styles["search-wrapper"]}>
						<Search />
					</div>
				)} */}

					<ul className={styles.nav}>
						<li>
							<a href={{ pathname: "/" }}>Home</a>
						</li>
						<li>
							<a href={{ pathname: "/courses" }}>About</a>
						</li>
						{/* <li>
							<Link href={{ pathname: "/community" }}>Community</Link>
						</li> */}
						{/* <li>
							<Link href={{ pathname: "/contact-us" }}>Contact Us</Link>
						</li> */}
						<li>
							<a href={{ pathname: "/tutors" }}>Contact Us</a>
						</li>
					</ul>
				<ul className={styles.started}>
					
					 <li className={styles["name"]}>
              {isLoggedIn && (
                <a color="#fff" href="#home">
                  <Avatar
                    name={displayName}
                    size={35}
                    hashValue="id_124"
									// marginRight={16}
									className={styles.avatar}
                  />
                </a>
              )}
            </li>
                	</ul> 
			</header>

			<SideSheet
				isShown={showMobileNav}
				onCloseComplete={() => {
					setShowMobileNav(false);
				}}
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

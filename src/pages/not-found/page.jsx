import React from "react";
import { Link } from "react-router-dom";
import styles from "./not-found.module.scss";
import notFound from "../../assets/404.png";


const NotFound = () => {
  return (
    <div className={styles["not-found"]}>
      <div>
              <img style={{backgroundColor: "transparent"}} src={notFound} width={'100%'}/>
              <div>
                <p style={{color: '#000'}}>We can't seems to find the page you seek. Kindly return back home.</p>

                   <button className="--btn">
          <Link to="/">&larr; Back To Home</Link>
        </button>
       </div>
          </div>

    </div>
  );
};

export default NotFound;

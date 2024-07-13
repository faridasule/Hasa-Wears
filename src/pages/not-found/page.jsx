import React from "react";
import { Link } from "react-router-dom";
import styles from "./not-found.module.scss";
import notFound from "../../assets/404.jpg";


const NotFound = () => {
  return (
    <div className={styles["not-found"]}>
      <div>
              <img style={{backgroundColor: "#bbd7ff"}} src={notFound} width={'100%'}/>
              <div>
                <p>Opppppsss, page not found.</p>

                   <button className="--btn">
          <Link to="/">&larr; Back To Home</Link>
        </button>
       </div>
          </div>

    </div>
  );
};

export default NotFound;

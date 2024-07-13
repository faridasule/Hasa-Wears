import { useEffect } from "react";
import styles from "./loader.module.scss";
import { ThreeDot } from "react-loading-indicators";

const Loader = () => {
  // Create a new div element as the portal container
  const portalContainer = document.createElement("div");

  useEffect(() => {
    // Append the portal container to the document body
    document.body.appendChild(portalContainer);

    // Clean up function to remove the portal container when component unmounts
    return () => {
      document.body.removeChild(portalContainer);
    };
  }, [portalContainer]);

  return (
          <div className={`${styles.wrapper}`}>

      <div className={styles.loader}>
   
      <ThreeDot color="#007AFF" size="big" text="loading..." textColor="#fff" />
       </div>
     </div>
  );
};

export default Loader;

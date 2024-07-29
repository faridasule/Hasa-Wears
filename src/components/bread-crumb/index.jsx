import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styles from "./breadcrumbLayout.module.scss";

const BreadCrumbLayout = (props) => {
  const { children, title, action, withBackground } = props;

  const { breadCrumb } = useSelector((state) => state.siteSettings);

  return (
      <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <h2>{title ?? ""}</h2>
          <div>
            <ul className={styles.breadcrumb}>
              {breadCrumb.map((item) => (
                <li key={item.title}>
                  {item.url ? (
                    <Link to={item.url}>{item.title}</Link>
                  ) : (
                    <>{item.title}</>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.action}>{action}</div>
      </div>

      <div className={`${styles.content} ${withBackground ? styles.background : ""}`}>
        {children}
      </div>
    </div>
  );
};

export default BreadCrumbLayout;

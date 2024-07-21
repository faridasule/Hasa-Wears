import React from "react";
import Card from "../card/index";
import styles from "./info-box.module.scss";

const InfoBox = ({ cardClass, title, count, icon }) => {
  return (
    <div className={styles["info-box"]}>
      <Card cardClass={cardClass}>
        <h4 style={{color: '#71717A', fontSize: '14px', fontWeight: '500'}}>{title}</h4>
        <span>
          <h3 style={{color: "#000", fontSize: '18px'}}>{count}</h3>
          {icon}
        </span>
      </Card>
    </div>
  );
};

export default InfoBox;

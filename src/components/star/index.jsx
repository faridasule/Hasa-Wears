import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { IoIosStarOutline, IoMdStarHalf,  IoMdStar} from "react-icons/io";

const StarRating = ({ count, value, size, color }) => {
  const stars = [];

  for (let i = 1; i <= count; i++) {
    if (value >= i) {
      stars.push(< IoMdStar style={{marginRight: '4px'}} key={i} size={size} color={color} />);
    } else if (value >= i - 0.5) {
      stars.push(<IoMdStarHalf style={{marginRight: '5px'}} key={i} size={size} color={color} />);
    } else {
      stars.push(<IoIosStarOutline style={{marginRight: '5px'}} key={i} size={size} color={color} />);
    }
  }

  return <div>{stars}</div>;
};

export default StarRating;

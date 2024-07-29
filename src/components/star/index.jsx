import React from 'react';
import { IoMdStarOutline, IoMdStarHalf, IoMdStar } from 'react-icons/io';

const StarRating = ({ count, value, size, color }) => {
  const stars = [];

  for (let i = 1; i <= count; i++) {
    if (value >= i) {
      stars.push(<IoMdStar key={i} size={size} color={color} style={{ marginRight: '2px' }} />);
    } else if (value >= i - 0.5) {
      stars.push(<IoMdStarHalf key={i} size={size} color={color} style={{ marginRight: '2px' }} />);
    } else {
      stars.push(<IoMdStarOutline key={i} size={size} color={color} style={{ marginRight: '2px' }} />);
    }
  }

  return <div style={{ display: 'flex' }}>{stars}</div>;
};

export default StarRating;

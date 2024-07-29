import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { HiOutlineTrash } from 'react-icons/hi2';
import { ChevronDownIcon, ChevronRightIcon } from 'evergreen-ui';
import { useNavigate } from 'react-router-dom';
import styles from './wishlist.module.scss';
import { selectWishlistItems, REMOVE_FROM_WISHLIST } from '../../redux/features/wishlistSlice';
import { ADD_TO_CART } from '../../redux/features/cartSlice';
import { formatNaira } from '../../@core/utils';

const Wishlist = ({ closeDialog }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);
  const [showPreview, setShowPreview] = useState(Array(wishlistItems.length).fill(false));
  const navigate = useNavigate();

//Functions
  const addToCart = (product) => {
    dispatch(ADD_TO_CART(product));
  };

  const removeFromWishlist = (item) => {
    dispatch(REMOVE_FROM_WISHLIST(item));
  };

  const handleSubTopicPreview = (e, index) => {
    e.stopPropagation();
    const updatedShowPreview = [...showPreview];
    updatedShowPreview[index] = !updatedShowPreview[index];
    setShowPreview(updatedShowPreview);
  };

  const goToCart = () => {
    closeDialog();
    navigate('/cart');
  };

  return (
<>
    {
    wishlistItems.length === 0 ? (
      <p style={{ fontWeight: '700', fontSize: '20px', marginTop: '20px' }} className="--center-all">No Wishlist</p>
 
    ) : (
  
      <div>
        <table className={styles.wishlistTable}>
          <thead>
            <tr>
              <th>Image</th>
              <th className={styles.showOnMobile}>Toggle</th>
              <th className={styles.hideOnMobile}>Name</th>
              <th className={styles.hideOnMobile}>Price</th>
              <th className={styles.hideOnMobile}>Cart</th>
              <th className={styles.hideOnMobile}>Action</th>
            </tr>
          </thead>
          <tbody>
            {wishlistItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <tr className={styles.productRow}>
                  <td>
                    <div className={styles.img}>
                      <img src={item.imageURL} alt={item.name} style={{ width: '80px' }} />
                    </div>
                  </td>
                  <td className={styles.showOnMobile}>
                    <button onClick={(e) => handleSubTopicPreview(e, index)}>
                      {!showPreview[index] ? (
                        <ChevronRightIcon color="#007AFF" size={25} title="right-arrow-icon" />
                      ) : (
                        <ChevronDownIcon color="#007AFF" size={25} title="down-arrow-icon" />
                      )}
                    </button>
                  </td>
                  <td className={styles.hideOnMobile}>{item.name}</td>
                  <td className={styles.hideOnMobile}>{formatNaira(item.price)}</td>
                  <td className={styles.hideOnMobile}>
                    <button className="--btn" onClick={() => addToCart(item)}>
                      Add to Cart
                    </button>
                  </td>
                  <td className={styles.hideOnMobile}>
                    <HiOutlineTrash
                      cursor="pointer"
                      size={19}
                      color="#FF3B30"
                      onClick={() => removeFromWishlist(item)}
                    />
                  </td>
                </tr>
                {showPreview[index] && (
                  <tr className={`${styles.additionalRow} ${styles.mobileOnly}`}>
                    <td colSpan="6">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div><strong>Product:</strong> {item.name}</div>
                        <div><strong>Price:</strong> {formatNaira(item.price)}</div>
                        <div>
                          <button className="--btn" onClick={() => addToCart(item)}>
                            Add to Cart
                          </button>
                        </div>
                        <div>
                          <HiOutlineTrash
                            cursor="pointer"
                            size={19}
                            color="#FF3B30"
                            onClick={() => removeFromWishlist(item)}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <button className="--btn --btn-primary" onClick={goToCart}>
            Go to Cart
          </button>
        </div>
      </div>
    )
  } </>);
};

export default Wishlist;

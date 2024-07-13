import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FILTER_BY_BRAND,
  FILTER_BY_CATEGORY,
  FILTER_BY_PRICE,
} from "../../../redux/features/filterSlice";
import {
  selectMaxPrice,
  selectMinPrice,
  selectProducts,
} from "../../../redux/features/productSlice";
import styles from "./product-filter.module.scss";

const ProductFilter = () => {
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState(3000);
  const products = useSelector(selectProducts);
  const minPrice = useSelector(selectMinPrice);
  const maxPrice = useSelector(selectMaxPrice);

  const dispatch = useDispatch();

  const allCategories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];
  const allBrands = [
    ...new Set(products.map((product) => product.brand)),
  ];

  useEffect(() => {
    if (brand) {
      dispatch(FILTER_BY_BRAND({ products, brand }));
    }
  }, [dispatch, products, brand]);

  useEffect(() => {
    dispatch(FILTER_BY_PRICE({ products, price }));
  }, [dispatch, products, price]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setBrand(""); // Clear the brand when category changes
    dispatch(FILTER_BY_CATEGORY({ products, category: cat }));
  };

  const handleBrandChange = (brd) => {
    setBrand(brd);
    setCategory(""); // Clear the category when brand changes
    dispatch(FILTER_BY_BRAND({ products, brand: brd }));
  };

  const clearFilters = () => {
    setCategory("All");
    setBrand("");
    setPrice(maxPrice);
  };

  return (
    <div className={styles.filter}>
      <h4>Categories</h4>
      <div className={styles.category}>
        {allCategories.map((cat, index) => (
          <div className={styles['input-wrap']} key={index}>
            <input
              type="checkbox"
              id={`category-${index}`}
              name="category"
              value={cat}
              checked={category === cat}
              onChange={() => handleCategoryChange(cat)}
              style={{ fontSize: '3rem' }}
            />
            <label htmlFor={`category-${index}`}>{cat}</label>
          </div>
        ))}
      </div>
      <h4>Brand</h4>
      <div className={styles.brand}>
        {allBrands.map((brd, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={`brand-${index}`}
              name="brand"
              value={brd}
              checked={brand === brd}
              onChange={() => handleBrandChange(brd)}
              style={{ fontSize: '3rem' }}
            />
            <label htmlFor={`brand-${index}`}>{brd}</label>
          </div>
        ))}
      </div>
      <h4>Price</h4>
      <p>{`$${price}`}</p>
      <div className={styles.price}>
        <input
          type="range"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min={minPrice}
          max={maxPrice}
          className={styles.range}
          
        />
      </div>
      <br />
      <button className="--btn --btn-danger" onClick={clearFilters}>
        Clear 
      </button>
    </div>
  );
};

export default ProductFilter;

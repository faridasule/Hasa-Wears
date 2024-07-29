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
import { Slider } from "@mui/material";
import styles from "./product-filter.module.scss";
import { formatNaira } from "../../../@core/utils";

const ProductFilter = () => {
  // States and Variables
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState(3000);
  const products = useSelector(selectProducts);
  const minPrice = useSelector(selectMinPrice);
  const maxPrice = useSelector(selectMaxPrice);
  const dispatch = useDispatch();

  // Create arrays of unique categories and brands from the products array
  const allCategories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];
  const allBrands = [
    ...new Set(products.map((product) => product.brand)),
  ];

  // Filter products by brand whenever the brand state changes
  useEffect(() => {
    if (brand) {
      dispatch(FILTER_BY_BRAND({ products, brand }));
    }
  }, [dispatch, products, brand]);

  // Filter products by price whenever the price state changes
  useEffect(() => {
    dispatch(FILTER_BY_PRICE({ products, price }));
  }, [dispatch, products, price]);

  // Update category state and dispatch category filter action
  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setBrand(""); // Clear the brand when category changes
    dispatch(FILTER_BY_CATEGORY({ products, category: cat }));
  };

  // Update brand state and dispatch brand filter action
  const handleBrandChange = (brd) => {
    setBrand(brd);
    setCategory(""); // Clear the category when brand changes
    dispatch(FILTER_BY_BRAND({ products, brand: brd }));
  };

  // Update price state when the slider value changes
  const handlePriceChange = (event, newValue) => {
    setPrice(newValue);
  };

  // Reset all filter states to their default values
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
      <p style={{color: '#000', fontWeight: '400'}}>{`${formatNaira(price)}`}</p>
      <div className={styles.price}>
        <Slider
          value={price}
          onChange={handlePriceChange}
          min={minPrice}
          max={maxPrice}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
          style={{width: '80%'}}
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

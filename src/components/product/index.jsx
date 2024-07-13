import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useFetchCollection from "../../custopm-hook/useFetchCollection";
import {
  GET_PRICE_RANGE,
  selectProducts,
  STORE_PRODUCTS,
} from "../../redux/features/productSlice";
import styles from "./product.module.scss";
import ProductFilter from "./prodict-filter/index";
import ProductList from "./product-list/index";
import { ThreeDot } from "react-loading-indicators";


const Product = () => {
  const { data, isLoading } = useFetchCollection("products");
  const [showFilter, setShowFilter] = useState(false);
  const products = useSelector(selectProducts);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      STORE_PRODUCTS({
        products: data,
      })
    );

    dispatch(
      GET_PRICE_RANGE({
        products: data,
      })
    );
  }, [dispatch, data]);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  return (
    <section>
      <div className={`container ${styles.product}`}>
        <aside
          className={
            showFilter ? `${styles.filter} ${styles.show}` : `${styles.filter}`
          }
        >
          {isLoading ? null : <ProductFilter />}
        </aside>
        <div className={styles.content}>
          {isLoading ? (
            


            <div className="--center-all">
      <ThreeDot color="#007AFF" size="medium" text="loading..." textColor="#252c32" />


            </div>
        
          ) : (
            <ProductList products={products} />
          )}
        </div>
      </div>
    </section>
  );
};

export default Product;

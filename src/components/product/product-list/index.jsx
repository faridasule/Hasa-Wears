import React, { useEffect, useState } from "react";
import styles from "./product-list.module.scss";
import { BsFillGridFill } from "react-icons/bs";
import { FaListAlt } from "react-icons/fa";
import Search from "../../search/index";
import ProductItem from "../product-item/index";
import { useDispatch, useSelector } from "react-redux";
import {
  FILTER_BY_SEARCH,
  selectFilteredProducts,
  SORT_PRODUCTS,
} from "../../../redux/features/filterSlice";
import { Pagination } from "evergreen-ui";

const ProductList = ({ products }) => {
  const [grid, setGrid] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const filteredProducts = useSelector(selectFilteredProducts);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);

  // Get Current Products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(SORT_PRODUCTS({ products, sort }));
  }, [dispatch, products, sort]);

  useEffect(() => {
    dispatch(FILTER_BY_SEARCH({ products, search }));
  }, [dispatch, products, search]);

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles["product-list"]} id="product">
      <div className={styles.top}>
        {/* Search Icon */}
        <div>
          <Search
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ fontSize: "16px", border: "1px solid #DDE2E4"}} // Increase font size
          />
        </div>
        {/* Sort Products */}
        <div className={styles['sort-wrap']}>
          <div className={styles.sort}>
            <label>Sort by:</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="latest">Featured</option>
              <option value="lowest-price">Lowest Price</option>
              <option value="highest-price">Highest Price</option>
              <option value="a-z">A - Z</option>
              <option value="z-a">Z - A</option>
            </select>
          </div>
          <div className={styles.icons}>
            <BsFillGridFill
              size={22}
              color="#E5E9EB"
              fill="#252C32"
              onClick={() => setGrid(true)}
              title="grid-layout"
            />
            <FaListAlt title="list-layout" size={24} color="#B0BABF" onClick={() => setGrid(false)} />
          </div>
        </div>
      </div>

      <div className={grid ? `${styles.grid}` : `${styles.list}`}>
        {currentProducts.length === 0 ? (
          <p>No product found.</p>
        ) : (
          <>
            {currentProducts.map((product) => {
              return (
                <div className={styles.product} key={product.id}>
                  <ProductItem {...product} grid={grid} product={product} />
                </div>
              );
            })}
          </>
        )}
      </div>
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          className={styles["pagination"]}
          onPreviousPage={prevPage}
          onNextPage={nextPage}
          onPageChange={(page) => onPageChange(page)}
        />
    </div>
  );
};

export default ProductList;
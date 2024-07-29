import React, { useEffect, useState } from 'react';
import styles from './product-list.module.scss';
import { BsFillGridFill } from 'react-icons/bs';
import { FaListAlt } from 'react-icons/fa';
import Search from '../../search/index';
import ProductItem from '../product-item/index';
import { useDispatch, useSelector } from 'react-redux';
import {
  FILTER_BY_SEARCH,
  selectFilteredProducts,
  SORT_PRODUCTS,
} from '../../../redux/features/filterSlice';
import { Pagination, Select } from 'evergreen-ui';

const ProductList = ({ products }) => {
  const [grid, setGrid] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('latest');
  const filteredProducts = useSelector(selectFilteredProducts);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);

  // Calculate indices for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const dispatch = useDispatch();

  // Sort products when 'sort' or 'products' changes
  useEffect(() => {
    dispatch(SORT_PRODUCTS({ products, sort }));
  }, [dispatch, products, sort]);

  // Filter products when 'search' or 'products' changes
  useEffect(() => {
    dispatch(FILTER_BY_SEARCH({ products, search }));
  }, [dispatch, products, search]);

  // Navigate to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Navigate to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle page change
  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles['product-list']} id="product">
      <div className={styles.top}>
        {/* Search Icon */}
        <div>
          <Search
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ fontSize: '16px', border: '1px solid #DDE2E4' }} // Increase font size
          />
        </div>
        {/* Sort Products */}
        <div className={styles['sort-wrap']}>
          <div className={styles.sort}>
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              border="1px solid #d8dae5"
              appearance="default"
              backgroundColor="#fff"
              width="100%"
              height={40}
              borderRadius="5px"
            >
              <option value="latest"> Sort by: Featured</option>
              <option value="lowest-price">Lowest Price</option>
              <option value="highest-price">Highest Price</option>
              <option value="a-z">A - Z</option>
              <option value="z-a">Z - A</option>
            </Select>
          </div>
          <div className={styles.icons}>
            <BsFillGridFill
              size={22}
              color="#E5E9EB"
              fill="#252C32"
              onClick={() => setGrid(true)}
              title="grid-layout"
            />
            <FaListAlt
              title="list-layout"
              size={24}
              color="#B0BABF"
              onClick={() => setGrid(false)}
            />
          </div>
        </div>
      </div>

      <div className={grid ? `${styles.grid}` : `${styles.list}`}>
        {currentProducts.length === 0 ? (
          <p>No product found.</p>
        ) : (
          <>
            {currentProducts.map((product) => (
              <div className={styles.product} key={product.id}>
                <ProductItem {...product} grid={grid} product={product} />
              </div>
            ))}
          </>
        )}
      </div>
      <Pagination
        page={currentPage}
        totalPages={totalPages}
        className={styles['pagination']}
        onPreviousPage={prevPage}
        onNextPage={nextPage}
        onPageChange={(page) => onPageChange(page)}
      />
    </div>
  );
};

export default ProductList;

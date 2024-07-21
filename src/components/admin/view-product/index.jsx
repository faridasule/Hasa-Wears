import React, { useState, useEffect } from 'react';
import {
  collection,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db, storage } from '../../../firebase/config';
import styles from './view-product.module.scss';
import { FaEdit } from 'react-icons/fa';
import Loader from '../../content-loader/index';
import { deleteObject, ref } from 'firebase/storage';
import Notiflix from 'notiflix';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectProducts,
  STORE_PRODUCTS,
} from '../../../redux/features/productSlice';
import useFetchCollection from '../../../custopm-hook/useFetchCollection';
import {
  FILTER_BY_SEARCH,
  selectFilteredProducts,
} from '../../../redux/features/filterSlice';
import Search from '../../search/index';
import { RiDeleteBin2Fill } from 'react-icons/ri';
import { setBreadCrumb } from '../../../redux/features/siteSlice';
import BreadCrumbLayout from '../../bread-crumb/index';
import { Pagination } from 'evergreen-ui';
import { ChevronDownIcon, ChevronRightIcon } from 'evergreen-ui';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AddProduct from '../../../components/admin/add-product/index';

const ViewProducts = () => {
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('ADD'); // Default mode
  const [editProductId, setEditProductId] = useState(null); // For editing

  const breadcrumb = [
    { title: 'Dashboard', url: '/dashboard' },
    { title: 'Manage Products' },
  ];
  const dispatch = useDispatch();

  dispatch(setBreadCrumb(breadcrumb));

  const { data, isLoading } = useFetchCollection('products');
  const products = useSelector(selectProducts);
  const filteredProducts = useSelector(selectFilteredProducts);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);

  // Get Current Products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

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

  useEffect(() => {
    dispatch(
      STORE_PRODUCTS({
        products: data,
      }),
    );
  }, [dispatch, data]);

  useEffect(() => {
    dispatch(FILTER_BY_SEARCH({ products, search }));
  }, [dispatch, products, search]);

  const confirmDelete = (id, imageURL) => {
    Notiflix.Confirm.show(
      'Delete Product!!!',
      'You are about to delete this product',
      'Delete',
      'Cancel',
      function okCb() {
        deleteProduct(id, imageURL);
      },
      function cancelCb() {
        console.log('Delete Canceled');
      },
      {
        width: '420px',
        borderRadius: '3px',
        titleColor: '#FF3B30',
        okButtonBackground: '#FF3B30',
        cssAnimationStyle: 'zoom',
      },
    );
  };

  const deleteProduct = async (id, imageURL) => {
    try {
      await deleteDoc(doc(db, 'products', id));

      const storageRef = ref(storage, imageURL);
      await deleteObject(storageRef);
      toast.success('Product deleted successfully.');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const [showPreview, setShowPreview] = useState(
    Array(products.length).fill(false),
  );

  const handlePreview = (e, index) => {
    e.stopPropagation();
    const updateShowPreview = [...showPreview];
    updateShowPreview[index] = !updateShowPreview[index];
    setShowPreview(updateShowPreview);

    // Close all previews when screen size is larger than 600px
    if (window.innerWidth > 600) {
      setShowPreview(Array(products.length).fill(false));
    }
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setEditProductId(null); 
  };



  const openEditProductDialog = (id) => {
    setDialogMode('EDIT');
    setEditProductId(id);
    setIsDialogOpen(true);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={styles.table}>
          <div className={styles['bread-crumb']}>
            <BreadCrumbLayout title="Manage Products" />
          </div>

          <div className={styles.search}>
            <p>
              <b>{filteredProducts.length}</b> products found
            </p>
            <Search
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {products.length === 0 ? (
            <p>No product found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th className={styles.hideOnMobile}>s/n</th>
                  <th>Image</th>
                  <th className={styles.hideOnMobile}>Name</th>
                  <th className={styles.hideOnMobile}>Category</th>
                  <th className={styles.hideOnMobile}>Price</th>
                  <th className={styles.hideOnMobile}>Actions</th>
                  <th className={styles.showOnMobile}></th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product, index) => {
                  const { id, name, price, imageURL, category } = product;
                  return (
                    <React.Fragment key={id}>
                      <tr>
                        <td className={styles.hideOnMobile}>{index + 1}</td>
                        <td>
                          <div className={styles.img}>
                            <img
                              src={imageURL}
                              alt={name}
                              style={{ width: '100px' }}
                            />
                          </div>
                        </td>
                        <td className={styles.hideOnMobile}>{name}</td>
                        <td className={styles.hideOnMobile}>{category}</td>
                        <td className={styles.hideOnMobile}>{`$${price}`}</td>
                        <td
                          className={`${styles.icons} ${styles.hideOnMobile}`}
                        >
                          <FaEdit
                            size={18}
                            color="#007AFF"
                            onClick={() => openEditProductDialog(id)}
                          />
                          <RiDeleteBin2Fill
                            size={18}
                            color="#FF3B30"
                            onClick={() => confirmDelete(id, imageURL)}
                          />
                        </td>
                        <td
                          className={`${styles.icons} ${styles.showOnMobile}`}
                        >
                            <button
                              onClick={(e) => handlePreview(e, index)}
                              title="preview-button"
                            >
                              {!showPreview[index] ? (
                                <ChevronRightIcon
                                  color="#007AFF"
                                  size={25}
                                  title="right-arrow-icon"
                                />
                              ) : (
                                <ChevronDownIcon
                                  color="#007AFF"
                                  size={25}
                                  title="down-arrow-icon"
                                />
                              )}
                            </button>
                        </td>
                      </tr>

                        {showPreview[index] && (
                        <tr className={styles['additional-row']}>
                          <td colSpan="3">
                            <div className={styles['toggle-content']}>
                              <p>
                                <b>Name:</b> {name}
                              </p>
                              <p>
                                <b>Category:</b> {category}
                              </p>
                              <p>
                                <b>Price:</b> ${price}
                              </p>
                                 <FaEdit
                            size={18}
                            color="#007AFF"
                            onClick={() => openEditProductDialog(id)}
                          />
                              &nbsp;
                              <RiDeleteBin2Fill
                                color="#FF3B30"
                                size={18}
                                onClick={() => confirmDelete(id, imageURL)}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}

          {products.length > 0 && (
            <div className={styles.pagination}>
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                onPreviousPage={prevPage}
                onNextPage={nextPage}
                onPageChange={(page) => onPageChange(page)}
              />
            </div>
          )}

          <Dialog open={isDialogOpen} fullWidth maxWidth="md">
            <DialogTitle>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: 'absolute',
                  right: 20,
                  top: 15,
                  color: (theme) => theme.palette.grey[500],
                  fontSize: 'large',
                }}
              >
                <CloseIcon size={50} />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <AddProduct dialogMode="EDIT" id={editProductId} onClose={handleClose} mode={dialogMode} />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
};

export default ViewProducts;



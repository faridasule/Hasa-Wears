import React, { useState, useEffect, useCallback } from 'react';
import {
  addDoc,
  collection,
  doc,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../../../firebase/config';
import styles from './add-product.module.scss';
import { CiShoppingCart } from 'react-icons/ci';
import { selectProducts } from '../../../redux/features/productSlice';
import { FileUploader, FileCard, Select } from 'evergreen-ui';
import LoadingIcons from 'react-loading-icons';
import { toast } from 'react-toastify';

// Categories and Sizes
const categories = [
  { id: 1, name: 'Men' },
  { id: 2, name: 'Women' },
  { id: 3, name: 'Accessories' },
  { id: 4, name: 'Footwear' },
  { id: 5, name: 'T-shirt' },
  { id: 6, name: 'Electronics' },
];

const sizes = [
  { id: 'xs', name: 'XS' },
  { id: 's', name: 'S' },
  { id: 'm', name: 'M' },
  { id: 'l', name: 'L' },
  { id: 'xl', name: 'XL' },
];

const initialState = {
  name: '',
  imageURL: '',
  price: 0,
  category: '',
  brand: '',
  desc: '',
  sizes: [],
};

const AddProduct = ({ dialogMode, onClose, id }) => {
  const products = useSelector(selectProducts);
  const productEdit = products.find((item) => item.id === id);
  const [product, setProduct] = useState({ ...initialState });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [fileRejections, setFileRejections] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (dialogMode === 'EDIT' && id && productEdit) {
      setProduct(productEdit);
      setFiles([productEdit.imageURL]);
    } else {
      setProduct({ ...initialState });
      setFiles([]);
    }
  }, [dialogMode, id, productEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSizeChange = (e) => {
    const { value, checked } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      sizes: checked
        ? [...prevProduct.sizes, value]
        : prevProduct.sizes.filter((size) => size !== value),
    }));
  };

  const handleChange = useCallback((files) => {
    if (files.length > 0) {
      const file = files[0];
      setFiles([file]);

      const storageRef = ref(storage, `hasaWears/${Date.now()}${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          toast.error(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setProduct({ ...product, imageURL: downloadURL });
            toast.success('Image uploaded successfully.');
          });
        }
      );
    }
  }, [product]);

  const handleRejected = useCallback((fileRejections) => {
    setFileRejections([fileRejections[0]]);
  }, []);

  const handleRemove = useCallback(() => {
    setFiles([]);
    setFileRejections([]);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!product.name) newErrors.name = 'Product name is required';
    if (!product.price) newErrors.price = 'Product price is required';
    if (!product.category) newErrors.category = 'Product category is required';
    if (!product.desc) newErrors.desc = 'Product description is required';
    if (product.sizes.length === 0) newErrors.sizes = 'At least one size is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addProduct = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await addDoc(collection(db, 'products'), {
        name: product.name,
        imageURL: product.imageURL,
        price: Number(product.price),
        category: product.category,
        brand: product.brand || '',
        desc: product.desc,
        sizes: product.sizes,
        createdAt: Timestamp.now().toDate(),
      });
      setIsLoading(false);
      setUploadProgress(0);
      setProduct({ ...initialState });
      setFiles([]);
      toast.success('Product uploaded successfully.');
      navigate('/admin/all-products');
      onClose();
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  const editProduct = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    if (product?.imageURL !== productEdit?.imageURL) {
      const storageRef = ref(storage, productEdit?.imageURL);
      deleteObject(storageRef);
    }

    try {
      await setDoc(doc(db, 'products', id), {
        name: product?.name,
        imageURL: product?.imageURL,
        price: Number(product?.price),
        category: product?.category,
        brand: product?.brand || '', 
        desc: product?.desc,
        sizes: product?.sizes, 
        createdAt: productEdit.createdAt,
        editedAt: Timestamp.now().toDate(),
      });
      setIsLoading(false);
      toast.success('Product Edited Successfully');
      navigate('/admin/all-products');
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className={styles.product}>
        <div className={styles['cart-icon']}>
          <CiShoppingCart color="#007AFF" size={40} />
        </div>
        <h2>{dialogMode === 'ADD' ? 'Add New Product' : 'Edit Product'}</h2>
        <form onSubmit={dialogMode === 'ADD' ? addProduct : editProduct}>
          <label>Product name:</label>
          <input
            type="text"
            required
            name="name"
            value={product.name}
            onChange={handleInputChange}
          />
          {errors.name && <div className={styles.error}>{errors.name}</div>}

          <label>Product price:</label>
          <input
            type="number"
            required
            name="price"
            value={product.price}
            onChange={handleInputChange}
          />
          {errors.price && <div className={styles.error}>{errors.price}</div>}

          <label>Product Category:</label>
          <Select
            required
            name="category"
            value={product.category}
            onChange={(e) => setProduct({ ...product, category: e.target.value })}
            border="1px solid #d8dae5"
            appearance="default"
            backgroundColor="#fff"
            width="100%"
            height={45}
            borderRadius="5px"
            className={styles.select}
            marginBottom={'2rem'}
            marginTop={"1rem"}
          >
            <option value="" disabled>
              -- choose product category --
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </Select>
          {errors.category && <div className={styles.error}>{errors.category}</div>}

          <label>Product Company/Brand:</label>
          <input
            type="text"
            name="brand"
            value={product.brand}
            onChange={handleInputChange}
          />

          <label>Product Sizes:</label>
          <div className={styles.sizes}>
            {sizes.map((size) => (
              <label key={size.id}>
                <input
                  type="checkbox"
                  value={size.id}
                  checked={product.sizes.includes(size.id)}
                  onChange={handleSizeChange}
                />
                <span className={styles.checkboxLabel}>{size.name}</span>
              </label>
            ))}
          </div>
          {errors.sizes && <div className={styles.error}>{errors.sizes}</div>}

          <label htmlFor="image">Product image:</label>
          <div className={styles.uploaderCard}>
            <FileUploader
              description="You can upload 1 file. File can be up to 50 MB."
              maxSizeInBytes={50 * 1024 ** 2}
              maxFiles={1}
              onChange={handleChange}
              onRejected={handleRejected}
              background="#fff"
              renderFile={(file) => {
                const { name, size, type } = file;
                const fileRejection = fileRejections.find(
                  (fileRejection) => fileRejection.file === file
                );
                const { message } = fileRejection || {};
                return (
                  <FileCard
                    key={name}
                    isInvalid={fileRejection != null}
                    name={name}
                    onRemove={handleRemove}
                    sizeInBytes={size}
                    type={type}
                    validationMessage={message}
                  />
                );
              }}
              values={files}
            />
          </div>

          <label>Product Description</label>
          <textarea
            name="desc"
            required
            value={product.desc}
            onChange={handleInputChange}
            cols="30"
            rows="10"
          ></textarea>
          {errors.desc && <div className={styles.error}>{errors.desc}</div>}

          <div className={styles['btn-wrap']}>
            <button className="--btn --btn-primary" type="submit">
              {isLoading ? (
                <LoadingIcons.ThreeDots height="0.5rem" />
              ) : dialogMode === 'ADD' ? (
                'Save Product'
              ) : (
                'Edit Product'
              )}
            </button>
            <button className="--btn" type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddProduct;

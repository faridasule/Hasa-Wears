import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import styles from './navbar.module.scss';
import { FaPlus } from 'react-icons/fa';
import { AiOutlineHome } from 'react-icons/ai';
import { HiOutlineChartBarSquare } from 'react-icons/hi2';
import { FaRegFolder } from 'react-icons/fa6';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AddProduct from '../../admin/add-product/index';

//Style for active links
const activeLink = ({ isActive }) => (isActive ? `${styles.active}` : '');

const NavBar = ({ mode }) => {
  //States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('ADD');

  //OpenAddProductDialog
  const openAddProductDialog = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDialogMode('ADD');
    setIsDialogOpen(true);
  };

  //CloseProductDialog
  const handleClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className={styles.navbar}>
      {mode === 'Full' ? (
        <>
          <div className={styles.logo}>
            <Link to="/">
              <h2>
                Hasa<span>Wears</span>.
              </h2>
            </Link>
          </div>
          <div className={styles.button}>
            <button className="--btn" onClick={openAddProductDialog}>
              <span>
                <FaPlus color="#fff" />
              </span>
              Add a Product
            </button>
          </div>
        </>
      ) : null}

      <nav className={styles.nav}>
        <ul>
          {mode !== 'Full' && (
            <li onClick={openAddProductDialog} style={{ paddingTop: '3rem' }}>
              <div>
                <FaPlus cursor={'pointer'} title="create product" color="#007AFF" size={20} />
              </div>
            </li>
          )}
          <li>
            <NavLink
              to="/admin/dashboard"
              className={mode === 'Full' ? activeLink : 'link'}
            >
              <div>
                <AiOutlineHome title="dashboard" color="#252C32" size={25} />
              </div>
              {mode === 'Full' ? <p>Dashboard</p> : ''}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/all-products"
              className={mode === 'Full' ? activeLink : 'link'}
            >
              <div>
                <FaRegFolder
                  title="manage product"
                  className={mode === 'Full' ? '' : 'link'}
                  color="#252C32"
                  size={20}
                />
              </div>
              {mode === 'Full' ? <p>Manage Products</p> : ''}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/orders"
              className={mode === 'Full' ? activeLink : 'link'}
            >
              <div>
                <HiOutlineChartBarSquare
                  title="manage orders"
                  color="#252C32"
                  size={25}
                />
              </div>
              {mode === 'Full' ? <p>Manage Orders</p> : ''}
            </NavLink>
          </li>
        </ul>
      </nav>

      <Dialog open={isDialogOpen} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          <IconButton
            aria-label="close"
            onClick={(event) => {
              event.stopPropagation(); // Prevents click event from closing the dialog
              handleClose();
            }}
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
        <DialogContent
          onClick={(event) => event.stopPropagation()} // Prevents clicks inside content from closing the dialog
        >
          <AddProduct dialogMode={dialogMode} onClose={handleClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NavBar;

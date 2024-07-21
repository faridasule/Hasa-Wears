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

const activeLink = ({ isActive }) => (isActive ? `${styles.active}` : '');

const NavBar = ({ mode }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('ADD');

  const openAddProductDialog = () => {
    setDialogMode('ADD');
    setIsDialogOpen(true);
  };

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
      ) : (
        ''
      )}

      <nav className={styles.nav}>
        <ul>
          <li>
            <NavLink
              to="/admin/dashboard"
              className={mode === 'Full' ? activeLink : 'link'}
            >
              <div>
                <AiOutlineHome fontWeight={'200'} color="#000000" size={25} />
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
                <FaRegFolder className={mode === 'Full' ? '' : 'link'} color="#000000" size={20} />
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
                <HiOutlineChartBarSquare color="#000000" size={25} />
              </div>
              {mode === 'Full' ? <p>Manage Orders</p> : ''}
            </NavLink>
          </li>
        </ul>
      </nav>

      <Dialog open={isDialogOpen}  fullWidth maxWidth="md">
        <DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 20,
              top: 15,
              color: (theme) => theme.palette.grey[500],
              fontSize: 'large'
            }}
          >
            <CloseIcon size={ 50} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AddProduct dialogMode={dialogMode} onClose={handleClose} />
        </DialogContent>
        {/* <DialogActions> */}
          {/* <button className="--btn --btn-primary" onClick={handleClose}>
            Close
          </button> */}
        {/* </DialogActions> */}
      </Dialog>
    </div>
  );
};

export default NavBar;

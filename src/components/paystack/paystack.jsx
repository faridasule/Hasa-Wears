import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PaystackButton } from 'react-paystack';
import style from './checkout-form.module.scss';
import { selectEmail, selectUserName } from '../../redux/features/authSlice';
import { selectCartTotalAmount, CLEAR_CART } from '../../redux/features/cartSlice';
import { useNavigate } from 'react-router-dom'


const PaystackPay = ({ onPay,  handleDialogClose}) => {
  const cart = useSelector(selectCartTotalAmount);
  const email = useSelector(selectEmail);
  const dispatch = useDispatch();
    const navigate = useNavigate()


  const config = {
    reference: new Date().getTime().toString(),
    email: email ?? "",
    amount: cart * 100, 
    publicKey: "pk_test_c67273f6978b941044483fb7028308792334df57",
  };

  const handleSuccess = () => {
    onPay();
    navigate('/order-history')
    dispatch(CLEAR_CART());
  };

  const handleClose = () => {
    handleDialogClose()
  };

  return (
    <PaystackButton
      {...config}
      text="Payment"
      onSuccess={handleSuccess}
      onClose={handleClose}
      className={style['button']}
    />
  );
};

export default PaystackPay;

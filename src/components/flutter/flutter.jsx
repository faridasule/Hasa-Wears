import React from "react";
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";
import { useSelector } from "react-redux";
import style from './checkout-form.module.scss'
import { selectEmail, selectUserName } from "../../redux/features/authSlice";
import {selectCartTotalAmount,   CLEAR_CART, } from "../../redux/features/cartSlice";
import { useDispatch} from 'react-redux'

 


const FlutterPay = ({ onPay }) => {
    const cart = useSelector(selectCartTotalAmount);
    const email = useSelector(selectEmail);
    const userName = useSelector(selectUserName);

  const dispatch = useDispatch()



  const config = {
    public_key: "FLWPUBK_TEST-d8ab65dc58a2ac1d980e96719cc1a0e7-X",
    tx_ref: Date.now().toString(),
    amount: cart,
    currency: "Naira",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: email ?? "", 
      phone_number: "",
      name: userName ?? "",
    },
    customizations: {
      title: "Hassa's wear",
      description: "Payment for items in cart",
      logo: "",
    },
  };

  const fwConfig = {
    ...config,
    text: "Payment",
    callback: (response) => {
      closePaymentModal();
          onPay();

    },
    onClose: () => {},
  };

  return <FlutterWaveButton  onClose={ () => dispatch(CLEAR_CART())} {...fwConfig} className={style["button"]} />;
};

export default FlutterPay;

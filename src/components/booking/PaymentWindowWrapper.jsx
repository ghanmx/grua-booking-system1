import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentWindow from './PaymentWindow';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentWindowWrapper = ({ isOpen, onClose, onPaymentSubmit, totalCost }) => (
  <Elements stripe={stripePromise}>
    <PaymentWindow
      isOpen={isOpen}
      onClose={onClose}
      onPaymentSubmit={onPaymentSubmit}
      totalCost={totalCost}
    />
  </Elements>
);

export default PaymentWindowWrapper;
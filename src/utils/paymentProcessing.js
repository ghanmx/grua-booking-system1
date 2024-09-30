import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import axiosRetry from 'axios-retry';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

axiosRetry(axios, { retries: 3 });

export const processPayment = async (amount, isTestMode = false, paymentData) => {
  if (isTestMode) {
    console.log('Test mode: Simulating payment processing');
    return { success: true, testMode: true };
  }

  try {
    const stripe = await stripePromise;

    if (!stripe) {
      throw new Error('Stripe initialization failed.');
    }

    // Enhanced error handling
    if (paymentData.cardNumber.length !== 16) {
      return { success: false, error: 'Payment Failed: El número de tarjeta está incompleto.' };
    }

    const expiryYear = parseInt(`20${paymentData.expiryDate.split('/')[1]}`);
    const currentYear = new Date().getFullYear();
    if (expiryYear < currentYear) {
      return { success: false, error: 'La fecha de expiración de la tarjeta ha pasado.' };
    }

    // Multiple payment methods
    const paymentMethods = {
      card: {
        type: 'card',
        card: {
          number: paymentData.cardNumber,
          exp_month: paymentData.expiryDate.split('/')[0],
          exp_year: `20${paymentData.expiryDate.split('/')[1]}`,
          cvc: paymentData.cvv,
        },
      },
      // Add other payment methods here
    };

    const selectedMethod = paymentMethods[paymentData.method] || paymentMethods.card;

    const { data: paymentIntent } = await axios.post('/api/create-payment-intent', {
      amount: Math.round(amount * 100),
      payment_method: selectedMethod,
    });

    if (paymentIntent.status === 'requires_action') {
      const { error, paymentIntent: confirmedIntent } = await stripe.confirmCardPayment(paymentIntent.client_secret);
      if (error) {
        console.error('3D Secure authentication failed:', error);
        throw error;
      } else {
        console.log('3D Secure authentication successful');
        return { success: true, paymentIntent: confirmedIntent };
      }
    }

    return { success: true, paymentIntent };
  } catch (error) {
    console.error('Error processing payment:', error);
    return { success: false, error: error.message };
  }
};
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const processPayment = async (amount, isTestMode = false, paymentData) => {
  if (isTestMode) {
    console.log('Test mode: Simulating payment processing');
    return { success: true };
  }

  try {
    if (paymentData.cardNumber.length !== 16) {
      return { success: false, error: 'Payment Failed: El número de tarjeta está incompleto.' };
    }

    const stripe = await stripePromise;

    if (!stripe) {
      throw new Error('Stripe initialization failed.');
    }

    // Create payment method object
    const paymentMethod = {
      type: 'card',
      card: {
        number: paymentData.cardNumber,
        exp_month: paymentData.expiryDate.split('/')[0],
        exp_year: `20${paymentData.expiryDate.split('/')[1]}`,
        cvc: paymentData.cvv,
      },
    };

    // Simulate creating a PaymentIntent via backend
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe works with cents
      currency: 'usd',
      payment_method: paymentMethod,
      confirm: true,
    });

    if (paymentIntent.status === 'succeeded') {
      return { success: true, paymentIntent };
    } else {
      return { success: false, error: 'Payment failed: ' + paymentIntent.status };
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    return { success: false, error: error.message };
  }
};
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const processPayment = async (amount) => {
  try {
    const stripe = await stripePromise;
    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: 'Jenny Rosen',
        },
      },
    });

    if (error) {
      console.log('[error]', error);
      return { success: false, error: error.message };
    } else {
      console.log('Payment succeeded!');
      return { success: true };
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    return { success: false, error: 'An unexpected error occurred while processing the payment.' };
  }
};
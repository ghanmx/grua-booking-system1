import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const processPayment = async (amount, isTestMode = false) => {
  if (isTestMode) {
    // Simulate a successful payment in test mode
    console.log('Test mode: Simulating payment processing');
    return { success: true };
  }

  try {
    const stripe = await stripePromise;
    // In a real implementation, you would create a PaymentIntent on your server
    // and return the client secret to the frontend
    const clientSecret = await fetchPaymentIntentClientSecret(amount);

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

// This function should be implemented on your server
const fetchPaymentIntentClientSecret = async (amount) => {
  // In a real implementation, this would make a request to your server
  // to create a PaymentIntent and return the client secret
  console.log('Simulating server request to create PaymentIntent');
  return 'dummy_client_secret';
};
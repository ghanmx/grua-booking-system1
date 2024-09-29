import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const processPayment = async (amount, isTestMode = false, paymentData) => {
  if (isTestMode) {
    console.log('Test mode: Simulating payment processing');
    return { success: true };
  }

  try {
    // Validate card number
    if (paymentData.cardNumber.length < 16) {
      return { success: false, error: 'Payment Failed: El número de tarjeta está incompleto.' };
    }

    // In a real-world scenario, you would integrate with Stripe's API here
    // For this example, we'll simulate a successful payment
    console.log('Processing payment with data:', paymentData);

    return { success: true, paymentIntent: { id: 'simulated_payment_intent_id' } };
  } catch (error) {
    console.error('Error processing payment:', error);
    return { success: false, error: error.message };
  }
};
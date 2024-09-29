import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const processPayment = async (amount, isTestMode = false) => {
  if (isTestMode) {
    console.log('Test mode: Simulating payment processing');
    return { success: true };
  }

  try {
    const stripe = await stripePromise;
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    const { clientSecret } = await response.json();

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: 'Jenny Rosen',
        },
      },
    });

    if (stripeError) {
      console.error('[error]', stripeError);
      return { success: false, error: stripeError.message };
    }

    if (paymentIntent.status === 'succeeded') {
      console.log('Payment succeeded!');
      return { success: true, paymentIntent };
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    return { success: false, error: error.message };
  }
};
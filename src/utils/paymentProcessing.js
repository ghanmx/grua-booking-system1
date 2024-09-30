import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

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

    // Retry mechanism
    let retryCount = 0;
    let paymentIntent;

    while (retryCount < 3) {
      try {
        // 3D Secure
        paymentIntent = await stripe.paymentIntents.create({
          amount: amount * 100, // Stripe works with cents
          currency: 'mxn',
          payment_method: selectedMethod,
          payment_method_types: ['card'],
          payment_method_options: {
            card: {
              request_three_d_secure: 'any',
            },
          },
          confirm: true,
        });

        // Enhanced logging
        console.log(`Processing payment for amount: ${amount}. Status: ${paymentIntent.status}`);

        if (paymentIntent.status === 'succeeded') {
          return { success: true, paymentIntent };
        } else if (paymentIntent.status === 'requires_action') {
          // Handle 3D Secure authentication
          const { error, paymentIntent: confirmedIntent } = await stripe.confirmCardPayment(paymentIntent.client_secret);
          if (error) {
            console.error('3D Secure authentication failed:', error);
            throw error;
          } else {
            console.log('3D Secure authentication successful');
            return { success: true, paymentIntent: confirmedIntent };
          }
        } else {
          throw new Error(`Payment failed: ${paymentIntent.status}`);
        }
      } catch (error) {
        console.error(`Payment attempt ${retryCount + 1} failed:`, error);
        retryCount++;
        if (retryCount === 3) {
          return { success: false, error: error.message };
        }
      }
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    return { success: false, error: error.message };
  }
};

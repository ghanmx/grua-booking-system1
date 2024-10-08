import axios from 'axios';

export const processPayment = async (amount, paymentMethodId) => {
  try {
    const response = await axios.post('/api/process-payment', {
      amount: Math.round(amount * 100), // Convert to cents
      payment_method_id: paymentMethodId,
    });

    if (response.data.success) {
      return { success: true, paymentIntent: response.data.paymentIntent };
    } else {
      throw new Error(response.data.error || 'Payment processing failed');
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    return { 
      success: false, 
      error: `Payment processing error: ${error.message}`,
      details: error.response?.data || 'No additional details available'
    };
  }
};
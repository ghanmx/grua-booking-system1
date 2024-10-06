import axios from 'axios';

export const processPayment = async (amount, paymentMethodId) => {
  try {
    const response = await axios.post('/api/process-payment', {
      amount: Math.round(amount * 100), // Convertir a centavos
      payment_method_id: paymentMethodId,
    });

    if (response.data.success) {
      return { success: true, paymentIntent: response.data.paymentIntent };
    } else {
      throw new Error(response.data.error || 'Falló el procesamiento del pago');
    }
  } catch (error) {
    console.error('Error al procesar el pago:', error);
    return { success: false, error: error.message };
  }
};
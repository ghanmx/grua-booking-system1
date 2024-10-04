export const testPayment = async (amount) => {
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate a successful payment most of the time
  const isSuccessful = Math.random() < 0.9;

  if (isSuccessful) {
    return {
      success: true,
      message: 'Payment test successful'
    };
  } else {
    return {
      success: false,
      message: 'Payment test failed. Please try again.'
    };
  }
};
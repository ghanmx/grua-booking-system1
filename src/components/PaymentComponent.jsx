import { Box, Button } from '@chakra-ui/react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const PaymentComponent = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      console.log('[error]', error);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
      // Here you would typically send the paymentMethod.id to your server
    }
  };

  return (
    <Box my={4}>
      <form onSubmit={handleSubmit}>
        <CardElement />
        <Button type="submit" disabled={!stripe} mt={4}>
          Pay
        </Button>
      </form>
    </Box>
  );
};

export default PaymentComponent;
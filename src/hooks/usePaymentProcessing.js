import { useToast } from "@chakra-ui/react";

export const usePaymentProcessing = (formData, totalCost, setIsPaymentWindowOpen, navigate) => {
  const toast = useToast();

  const handlePaymentSubmit = async (paymentResult) => {
    try {
      if (paymentResult.success) {
        // Process successful payment
        setIsPaymentWindowOpen(false);
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate('/confirmation', { state: { bookingData: formData } });
      } else {
        throw new Error(paymentResult.error || 'Payment processing failed');
      }
    } catch (error) {
      console.error('Error finalizing booking:', error);
      toast({
        title: "Payment Error",
        description: error.message || "There was an error processing your payment. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return { handlePaymentSubmit };
};
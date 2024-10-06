import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Text,
  Box,
  useToast,
} from '@chakra-ui/react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const PaymentWindow = ({ isOpen, onClose, onPaymentSubmit, totalCost }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      setError('Stripe no se ha cargado. Por favor, intente más tarde.');
      setIsProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setError(error.message);
        setIsProcessing(false);
        return;
      }

      await onPaymentSubmit(paymentMethod);
    } catch (err) {
      console.error('Error al procesar el pago:', err);
      setError(err.message || 'Ocurrió un error inesperado');
      toast({
        title: 'Error de Pago',
        description: err.message || 'Ocurrió un error inesperado durante el procesamiento del pago.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Información de Pago</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Box width="100%">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </Box>
            <Text fontWeight="bold">Costo Total: ${totalCost.toFixed(2)}</Text>
            {error && <Text color="red.500">{error}</Text>}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit} isLoading={isProcessing}>
            Procesar Pago
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PaymentWindow;
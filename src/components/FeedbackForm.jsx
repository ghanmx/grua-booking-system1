import React, { useState } from 'react';
import { Box, VStack, Heading, FormControl, FormLabel, Input, Textarea, Button, useToast } from "@chakra-ui/react";
import { supabase } from '../config/supabase.config';
import { logEvent } from '../utils/monitoring';

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('user_feedback')
        .insert([feedback]);
      
      if (error) throw error;

      logEvent('Feedback', 'Submit', 'User submitted feedback');
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setFeedback({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "There was an error submitting your feedback. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box maxWidth="500px" margin="auto" padding={4}>
      <VStack spacing={4} as="form" onSubmit={handleSubmit}>
        <Heading size="lg">We Value Your Feedback</Heading>
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            value={feedback.name}
            onChange={(e) => setFeedback({...feedback, name: e.target.value})}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={feedback.email}
            onChange={(e) => setFeedback({...feedback, email: e.target.value})}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Feedback</FormLabel>
          <Textarea
            value={feedback.message}
            onChange={(e) => setFeedback({...feedback, message: e.target.value})}
          />
        </FormControl>
        <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
          Submit Feedback
        </Button>
      </VStack>
    </Box>
  );
};

export default FeedbackForm;
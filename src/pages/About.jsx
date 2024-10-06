import React from 'react';
import { Box, VStack, Heading, Text } from "@chakra-ui/react";
import FeedbackForm from '../components/FeedbackForm';

const About = () => {
  return (
    <Box p={4}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl">About Our Towing Service</Heading>
        <Text>
          We are a reliable and efficient towing service dedicated to helping you in your time of need. 
          Our team of experienced professionals is available 24/7 to provide quick and safe towing solutions.
        </Text>
        <Text>
          With state-of-the-art equipment and a commitment to customer satisfaction, we ensure that your 
          vehicle is handled with the utmost care and delivered to its destination safely.
        </Text>
        <FeedbackForm />
      </VStack>
    </Box>
  );
};

export default About;
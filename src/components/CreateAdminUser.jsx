import React, { useState } from 'react';
import { Box, Button, Input, VStack, useToast } from "@chakra-ui/react";
import { createAdminUser } from '../server/db';

const CreateAdminUser = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const toast = useToast();

  const handleCreateAdmin = async () => {
    try {
      await createAdminUser({ email, fullName, phoneNumber });
      toast({
        title: "Admin user created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // Clear the form
      setEmail('');
      setFullName('');
      setPhoneNumber('');
    } catch (error) {
      toast({
        title: "Error creating admin user",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <VStack spacing={4}>
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <Input
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <Button colorScheme="blue" onClick={handleCreateAdmin}>
          Create Admin User
        </Button>
      </VStack>
    </Box>
  );
};

export default CreateAdminUser;
import React, { useState } from 'react';
import { Box, Button, Input, VStack } from "@chakra-ui/react";
import { createAdminUser } from '../server/db';

const CreateAdminUser = ({ showNotification }) => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleCreateAdmin = async () => {
    try {
      await createAdminUser({ email, fullName, phoneNumber });
      showNotification("Admin user created", "New admin user has been successfully created.", "success");
      // Clear the form
      setEmail('');
      setFullName('');
      setPhoneNumber('');
    } catch (error) {
      showNotification("Error creating admin user", error.message, "error");
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
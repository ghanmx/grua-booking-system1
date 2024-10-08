import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Box, Button, FormControl, FormLabel, Input, Switch, VStack, useToast } from '@chakra-ui/react';
import { saveSMTPSettings } from '../../utils/api';
import { useSupabaseAuth } from '../../integrations/supabase/auth';

const SMTPSettingsForm = () => {
  const [isCustomSMTP, setIsCustomSMTP] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const toast = useToast();
  const { session } = useSupabaseAuth();

  const mutation = useMutation({
    mutationFn: saveSMTPSettings,
    onSuccess: () => {
      toast({
        title: 'Settings saved',
        description: 'Your SMTP settings have been updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error saving settings',
        description: error.message || 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const onSubmit = (data) => {
    if (!session?.user?.id) {
      toast({
        title: 'Error',
        description: 'User not authenticated',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    mutation.mutate({ ...data, isCustomSMTP, user_id: session.user.id });
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} maxWidth="500px" margin="auto">
      <VStack spacing={4} align="stretch">
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="custom-smtp" mb="0">
            Enable Custom SMTP
          </FormLabel>
          <Switch
            id="custom-smtp"
            isChecked={isCustomSMTP}
            onChange={(e) => setIsCustomSMTP(e.target.checked)}
          />
        </FormControl>

        {isCustomSMTP && (
          <>
            <FormControl isRequired>
              <FormLabel>Sender Email</FormLabel>
              <Input {...register('senderEmail', { required: 'Sender email is required' })} />
            </FormControl>

            <FormControl>
              <FormLabel>Sender Name</FormLabel>
              <Input {...register('senderName')} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>SMTP Host</FormLabel>
              <Input {...register('smtpHost', { required: 'SMTP host is required' })} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Port Number</FormLabel>
              <Input {...register('portNumber', { required: 'Port number is required' })} type="number" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Minimum Interval Between Emails (seconds)</FormLabel>
              <Input {...register('minInterval', { required: 'Minimum interval is required' })} type="number" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input {...register('username', { required: 'Username is required' })} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input {...register('password', { required: 'Password is required' })} type="password" autoComplete="current-password" />
            </FormControl>
          </>
        )}

        <Button type="submit" colorScheme="blue" isLoading={mutation.isLoading}>
          Save Settings
        </Button>
      </VStack>
    </Box>
  );
};

export default SMTPSettingsForm;
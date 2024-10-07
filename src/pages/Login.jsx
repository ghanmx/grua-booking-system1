import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Container, Heading, VStack, Button, Checkbox, FormControl, FormLabel, Input, useToast, Tabs, TabList, Tab, TabPanels, TabPanel, Text } from '@chakra-ui/react';
import { useSupabaseAuth } from '../integrations/supabase/auth';

const LoginForm = ({ onSubmit, isLoading }) => (
  <form onSubmit={onSubmit}>
    <VStack spacing={4}>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input type="email" name="email" required />
      </FormControl>
      <FormControl>
        <FormLabel>Password</FormLabel>
        <Input type="password" name="password" required />
      </FormControl>
      <Button type="submit" colorScheme="blue" width="full" isLoading={isLoading}>
        Login
      </Button>
    </VStack>
  </form>
);

const SignupForm = ({ onSubmit, isLoading }) => (
  <form onSubmit={onSubmit}>
    <VStack spacing={4}>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input type="email" name="email" required />
      </FormControl>
      <FormControl>
        <FormLabel>Password</FormLabel>
        <Input type="password" name="password" required />
      </FormControl>
      <FormControl>
        <FormLabel>Full Name</FormLabel>
        <Input type="text" name="fullName" required />
      </FormControl>
      <FormControl>
        <FormLabel>Phone Number</FormLabel>
        <Input type="tel" name="phoneNumber" required />
      </FormControl>
      <Button type="submit" colorScheme="green" width="full" isLoading={isLoading}>
        Sign Up
      </Button>
    </VStack>
  </form>
);

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, login, signup } = useSupabaseAuth();
  const [isTestMode, setIsTestMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signupAttempts, setSignupAttempts] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (session) {
      const from = location.state?.from || '/booking';
      navigate(from);
    }
  }, [session, navigate, location]);

  const handleTestModeLogin = () => {
    localStorage.setItem('testModeUser', JSON.stringify({ isTestMode: true, isAdmin: true }));
    navigate('/admin');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      if (isTestMode) {
        handleTestModeLogin();
      } else {
        await login(email, password);
        toast({
          title: "Login successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const fullName = formData.get('fullName');
    const phoneNumber = formData.get('phoneNumber');

    const now = new Date();
    if (lastAttemptTime && now - lastAttemptTime < 60000) { // 1 minute cooldown
      toast({
        title: "Signup attempt limit",
        description: "Please wait for 1 minute before trying again.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      await signup(email, password, { fullName, phoneNumber });
      toast({
        title: "Account created",
        description: "You can now log in with your new account",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setSignupAttempts(0);
      setLastAttemptTime(null);
    } catch (error) {
      setSignupAttempts(prev => prev + 1);
      setLastAttemptTime(now);
      if (error.message.includes('Too many signup attempts')) {
        const waitTime = Math.min(Math.pow(2, signupAttempts), 30); // Max wait time of 30 minutes
        toast({
          title: "Signup failed",
          description: `Too many attempts. Please wait for ${waitTime} minutes before trying again.`,
          status: "error",
          duration: 10000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Signup failed",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box bg="#EBECF0" minHeight="calc(100vh - 60px)" py={10}>
      <Container maxW="md">
        <VStack spacing={8} align="stretch" bg="#EBECF0" p={8} borderRadius="md" boxShadow="md">
          <Heading as="h1" size="xl" textAlign="center" color="#61677C" textShadow="1px 1px 1px #FFF">Account</Heading>
          {!isTestMode ? (
            <Tabs isFitted variant="enclosed">
              <TabList mb="1em">
                <Tab>Login</Tab>
                <Tab>Sign Up</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
                </TabPanel>
                <TabPanel>
                  <SignupForm onSubmit={handleSignup} isLoading={isLoading} />
                  {signupAttempts > 0 && (
                    <Text color="red.500" mt={2}>
                      {signupAttempts === 1
                        ? "First attempt failed. Please try again."
                        : `${signupAttempts} attempts made. Please wait before trying again.`}
                    </Text>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          ) : (
            <Button onClick={handleTestModeLogin} colorScheme="blue">
              Login (Test Mode)
            </Button>
          )}
          <FormControl>
            <FormLabel htmlFor="test-mode">Test Mode</FormLabel>
            <Checkbox 
              id="test-mode" 
              isChecked={isTestMode} 
              onChange={(e) => setIsTestMode(e.target.checked)}
            >
              Enable Test Mode
            </Checkbox>
          </FormControl>
        </VStack>
      </Container>
    </Box>
  );
};

export default Login;
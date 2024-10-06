import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Container, Heading, VStack, Button, Checkbox, FormControl, FormLabel, Input, useToast, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import { useSupabaseAuth } from '../integrations/supabase/auth';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { session, login, signup } = useSupabaseAuth();
    const [isTestMode, setIsTestMode] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
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
        if (isTestMode) {
            handleTestModeLogin();
        } else {
            try {
                await login(email, password);
            } catch (error) {
                toast({
                    title: "Login failed",
                    description: error.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await signup(email, password, { full_name: fullName, phone_number: phoneNumber });
            toast({
                title: "Account created",
                description: "You can now log in with your new account",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Signup failed",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
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
                                    <form onSubmit={handleLogin}>
                                        <VStack spacing={4}>
                                            <FormControl>
                                                <FormLabel>Email</FormLabel>
                                                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Password</FormLabel>
                                                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                            </FormControl>
                                            <Button type="submit" colorScheme="blue" width="full">
                                                Login
                                            </Button>
                                        </VStack>
                                    </form>
                                </TabPanel>
                                <TabPanel>
                                    <form onSubmit={handleSignup}>
                                        <VStack spacing={4}>
                                            <FormControl>
                                                <FormLabel>Email</FormLabel>
                                                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Password</FormLabel>
                                                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Full Name</FormLabel>
                                                <Input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Phone Number</FormLabel>
                                                <Input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                                            </FormControl>
                                            <Button type="submit" colorScheme="green" width="full">
                                                Sign Up
                                            </Button>
                                        </VStack>
                                    </form>
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
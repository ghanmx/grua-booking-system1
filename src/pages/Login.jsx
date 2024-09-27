import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Heading, VStack, Text, Button, Input, FormControl, FormLabel, useToast, Tabs, TabList, TabPanels, Tab, TabPanel, Switch } from '@chakra-ui/react';
import { supabase } from '../integrations/supabase/index.js';
import { IoMdLock } from 'react-icons/io';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isTestMode, setIsTestMode] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isTestMode) {
                localStorage.setItem('testModeUser', JSON.stringify({ email: 'test@example.com', isTestMode: true }));
                toast({
                    title: "Test mode login successful",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                navigate('/booking');
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                toast({
                    title: "Login successful",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                navigate('/booking');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast({
                title: "Login failed",
                description: error.message || "An unexpected error occurred",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                }
            });
            if (error) throw error;
            toast({
                title: "Sign up successful",
                description: "Please check your email to verify your account.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Sign up error:', error);
            toast({
                title: "Sign up failed",
                description: error.message || "An unexpected error occurred",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box bg="#EBECF0" minHeight="calc(100vh - 60px)" py={10}>
            <Container maxW="md">
                <VStack spacing={8} align="stretch" bg="#EBECF0" p={8} borderRadius="md" boxShadow="md">
                    <Heading as="h1" size="xl" textAlign="center" color="#61677C" textShadow="1px 1px 1px #FFF">Account</Heading>
                    <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="test-mode" mb="0">
                            Test Mode
                        </FormLabel>
                        <Switch
                            id="test-mode"
                            isChecked={isTestMode}
                            onChange={(e) => setIsTestMode(e.target.checked)}
                        />
                    </FormControl>
                    <Tabs isFitted variant="enclosed">
                        <TabList mb="1em">
                            <Tab>Login</Tab>
                            <Tab>Sign Up</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <form onSubmit={handleLogin} style={{ padding: '16px', width: '320px', margin: '0 auto' }}>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required={!isTestMode}
                                            placeholder="Email Address"
                                            bg="#EBECF0"
                                            boxShadow="inset 2px 2px 5px #BABECC, inset -5px -5px 10px #FFF"
                                            border="0"
                                            borderRadius="32px"
                                            fontSize="16px"
                                            padding="16px"
                                            mb={4}
                                            _focus={{
                                                boxShadow: "inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF"
                                            }}
                                            disabled={isTestMode}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required={!isTestMode}
                                            placeholder="Password"
                                            bg="#EBECF0"
                                            boxShadow="inset 2px 2px 5px #BABECC, inset -5px -5px 10px #FFF"
                                            border="0"
                                            borderRadius="32px"
                                            fontSize="16px"
                                            padding="16px"
                                            mb={4}
                                            _focus={{
                                                boxShadow: "inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF"
                                            }}
                                            disabled={isTestMode}
                                        />
                                    </FormControl>
                                    <Button
                                        type="submit"
                                        width="full"
                                        bg="#EBECF0"
                                        color="#AE1100"
                                        fontWeight="bold"
                                        boxShadow="-5px -5px 20px #FFF, 5px 5px 20px #BABECC"
                                        _hover={{
                                            boxShadow: "-2px -2px 5px #FFF, 2px 2px 5px #BABECC"
                                        }}
                                        _active={{
                                            boxShadow: "inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF"
                                        }}
                                        isLoading={loading}
                                    >
                                        <IoMdLock style={{ marginRight: '8px' }} /> {isTestMode ? 'Test Login' : 'Log in'}
                                    </Button>
                                </form>
                            </TabPanel>
                            <TabPanel>
                                <form onSubmit={handleSignUp} style={{ padding: '16px', width: '320px', margin: '0 auto' }}>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            placeholder="Email Address"
                                            bg="#EBECF0"
                                            boxShadow="inset 2px 2px 5px #BABECC, inset -5px -5px 10px #FFF"
                                            border="0"
                                            borderRadius="32px"
                                            fontSize="16px"
                                            padding="16px"
                                            mb={4}
                                            _focus={{
                                                boxShadow: "inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF"
                                            }}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            placeholder="Password"
                                            bg="#EBECF0"
                                            boxShadow="inset 2px 2px 5px #BABECC, inset -5px -5px 10px #FFF"
                                            border="0"
                                            borderRadius="32px"
                                            fontSize="16px"
                                            padding="16px"
                                            mb={4}
                                            _focus={{
                                                boxShadow: "inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF"
                                            }}
                                        />
                                    </FormControl>
                                    <Button
                                        type="submit"
                                        width="full"
                                        bg="#EBECF0"
                                        color="#AE1100"
                                        fontWeight="bold"
                                        boxShadow="-5px -5px 20px #FFF, 5px 5px 20px #BABECC"
                                        _hover={{
                                            boxShadow: "-2px -2px 5px #FFF, 2px 2px 5px #BABECC"
                                        }}
                                        _active={{
                                            boxShadow: "inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF"
                                        }}
                                        isLoading={loading}
                                    >
                                        <IoMdLock style={{ marginRight: '8px' }} /> Sign Up
                                    </Button>
                                </form>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </VStack>
            </Container>
        </Box>
    );
};

export default Login;
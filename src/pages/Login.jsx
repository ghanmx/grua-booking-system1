import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Container, Heading, VStack, Button, Checkbox, FormControl, FormLabel, Input, useToast } from '@chakra-ui/react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../integrations/supabase/index.js';
import { useSupabaseAuth } from '../integrations/supabase/auth';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { session, login } = useSupabaseAuth();
    const [isTestMode, setIsTestMode] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const toast = useToast();

    useEffect(() => {
        if (session) {
            const from = location.state?.from || '/booking';
            navigate(from);
        }
    }, [session, navigate, location]);

    const handleTestModeLogin = () => {
        localStorage.setItem('testModeUser', JSON.stringify({ isTestMode: true, isAdmin: true }));
        navigate('/booking');
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

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signIn({ provider: 'google' });
            if (error) throw error;
        } catch (error) {
            toast({
                title: "Google login failed",
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
                                <Button onClick={handleGoogleLogin} colorScheme="red" width="full">
                                    Sign in with Google
                                </Button>
                            </VStack>
                        </form>
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
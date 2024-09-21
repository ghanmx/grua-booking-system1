import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase/auth.jsx';
import { Box, Container, Heading, VStack, Text, Button, Input, FormControl, FormLabel, useToast, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { supabase } from '../integrations/supabase/index.js';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { session } = useSupabaseAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            toast({
                title: "Login successful",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            navigate('/');
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
            const { error } = await supabase.auth.signUp({ email, password });
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

    if (session) {
        navigate('/');
        return null;
    }

    return (
        <Box bg="gray.50" minHeight="calc(100vh - 60px)" py={10}>
            <Container maxW="md">
                <VStack spacing={8} align="stretch" bg="white" p={8} borderRadius="md" boxShadow="md">
                    <Heading as="h1" size="xl" textAlign="center">Account</Heading>
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
                                            <Input 
                                                type="email" 
                                                value={email} 
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Password</FormLabel>
                                            <Input 
                                                type="password" 
                                                value={password} 
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </FormControl>
                                        <Button type="submit" colorScheme="blue" width="full" isLoading={loading}>
                                            Login
                                        </Button>
                                    </VStack>
                                </form>
                            </TabPanel>
                            <TabPanel>
                                <form onSubmit={handleSignUp}>
                                    <VStack spacing={4}>
                                        <FormControl>
                                            <FormLabel>Email</FormLabel>
                                            <Input 
                                                type="email" 
                                                value={email} 
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Password</FormLabel>
                                            <Input 
                                                type="password" 
                                                value={password} 
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </FormControl>
                                        <Button type="submit" colorScheme="green" width="full" isLoading={loading}>
                                            Sign Up
                                        </Button>
                                    </VStack>
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

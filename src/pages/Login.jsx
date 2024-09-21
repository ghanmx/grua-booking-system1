import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase/auth.jsx';
import { Box, Container, Heading, VStack, Text, Button, Input, FormControl, FormLabel, useToast } from '@chakra-ui/react';
import { supabase } from '../integrations/supabase/index.js';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { session } = useSupabaseAuth();
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        if (session) {
            navigate('/');
        }
    }, [session, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
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
            setError(error.message);
            toast({
                title: "Login failed",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async () => {
        setLoading(true);
        setError(null);
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
            setError(error.message);
            toast({
                title: "Sign up failed",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box bg="gray.50" minHeight="calc(100vh - 60px)" py={10}>
            <Container maxW="md">
                <VStack spacing={8} align="stretch" bg="white" p={8} borderRadius="md" boxShadow="md">
                    <Heading as="h1" size="xl" textAlign="center">Login</Heading>
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
                    <Button onClick={handleSignUp} variant="outline" width="full" isLoading={loading}>
                        Sign Up
                    </Button>
                    {error && <Text color="red.500" textAlign="center">{error}</Text>}
                </VStack>
            </Container>
        </Box>
    );
};

export default Login;

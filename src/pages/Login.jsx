import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth, SupabaseAuthUI } from '../integrations/supabase/auth.jsx';
import { Box, Container, Heading, VStack } from '@chakra-ui/react';

const Login = () => {
    const { session } = useSupabaseAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (session) {
            navigate('/');
        }
    }, [session, navigate]);

    return (
        <Box bg="gray.50" minHeight="calc(100vh - 60px)" py={10}>
            <Container maxW="md">
                <VStack spacing={8} align="stretch" bg="white" p={8} borderRadius="md" boxShadow="md">
                    <Heading as="h1" size="xl" textAlign="center">Login</Heading>
                    <SupabaseAuthUI />
                </VStack>
            </Container>
        </Box>
    );
};

export default Login;

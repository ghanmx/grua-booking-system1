import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Heading, VStack } from '@chakra-ui/react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../integrations/supabase/index.js';
import { useSupabaseAuth } from '../integrations/supabase/auth';

const Login = () => {
    const navigate = useNavigate();
    const { session } = useSupabaseAuth();

    React.useEffect(() => {
        if (session) {
            navigate('/booking');
        }
    }, [session, navigate]);

    return (
        <Box bg="#EBECF0" minHeight="calc(100vh - 60px)" py={10}>
            <Container maxW="md">
                <VStack spacing={8} align="stretch" bg="#EBECF0" p={8} borderRadius="md" boxShadow="md">
                    <Heading as="h1" size="xl" textAlign="center" color="#61677C" textShadow="1px 1px 1px #FFF">Account</Heading>
                    <Auth
                        supabaseClient={supabase}
                        appearance={{ theme: ThemeSupa }}
                        theme="dark"
                        providers={[]}
                        redirectTo={`${window.location.origin}/booking`}
                    />
                </VStack>
            </Container>
        </Box>
    );
};

export default Login;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Heading, VStack, Text, Button, FormControl, FormLabel, Input, useToast, Tabs, TabList, TabPanels, Tab, TabPanel, Switch } from '@chakra-ui/react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../integrations/supabase/index.js';
import { useSupabaseAuth } from '../integrations/supabase/auth';

const Login = () => {
    const [isTestMode, setIsTestMode] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();
    const { session } = useSupabaseAuth();

    useEffect(() => {
        if (session) {
            navigate('/booking');
        }
    }, [session, navigate]);

    const handleTestModeLogin = () => {
        localStorage.setItem('testModeUser', JSON.stringify({ email: 'test@example.com', isTestMode: true }));
        toast({
            title: "Test mode login successful",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
        navigate('/booking');
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
                    {isTestMode ? (
                        <Button
                            onClick={handleTestModeLogin}
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
                        >
                            Test Mode Login
                        </Button>
                    ) : (
                        <Auth
                            supabaseClient={supabase}
                            appearance={{ theme: ThemeSupa }}
                            theme="dark"
                            providers={[]}
                            redirectTo={`${window.location.origin}/booking`}
                        />
                    )}
                </VStack>
            </Container>
        </Box>
    );
};

export default Login;
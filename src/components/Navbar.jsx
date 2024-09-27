import { Box, Flex, Link, Spacer, Text, Button } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useSupabaseAuth } from '../integrations/supabase/auth.jsx';

const Navbar = () => {
  const { session, logout } = useSupabaseAuth();

  return (
    <Box bg="blue.500" p={4} color="white" position="sticky" top="0" zIndex="sticky">
      <Flex maxW="1200px" mx="auto" align="center">
        <Text fontSize="xl" fontWeight="bold">Tow Service</Text>
        <Spacer />
        <Flex align="center">
          <Link as={RouterLink} to="/" p={2} mx={2} _hover={{ textDecoration: "none", bg: "blue.600" }}>Home</Link>
          <Link as={RouterLink} to="/about" p={2} mx={2} _hover={{ textDecoration: "none", bg: "blue.600" }}>About</Link>
          <Link as={RouterLink} to="/contact" p={2} mx={2} _hover={{ textDecoration: "none", bg: "blue.600" }}>Contact</Link>
          <Link as={RouterLink} to="/booking" p={2} mx={2} _hover={{ textDecoration: "none", bg: "blue.600" }}>Book Now</Link>
          {session ? (
            <Button onClick={logout} colorScheme="red" size="sm" ml={2}>Logout</Button>
          ) : (
            <Link as={RouterLink} to="/login" p={2} mx={2} _hover={{ textDecoration: "none", bg: "blue.600" }}>Login</Link>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
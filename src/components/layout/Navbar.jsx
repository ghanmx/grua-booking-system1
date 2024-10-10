import React, { useEffect, useState } from "react";
import { Box, Flex, Link, Button, Image, useDisclosure, keyframes } from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useSupabaseAuth } from '../../integrations/supabase/auth';
import { getUserRole } from '../../config/supabaseClient';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Navbar = () => {
  const { session, logout } = useSupabaseAuth();
  const navigate = useNavigate();
  const { isOpen, onToggle } = useDisclosure();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkUserRole = async () => {
      if (session?.user?.id) {
        const role = await getUserRole(session.user.id);
        setUserRole(role);
      }
    };
    checkUserRole();
  }, [session]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const NavLink = ({ to, children }) => (
    <Link
      as={RouterLink}
      to={to}
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: 'blue.600',
        transform: 'translateY(-2px)',
      }}
      transition="all 0.2s"
    >
      {children}
    </Link>
  );

  return (
    <Box bg="rgba(255,255,255,0.1)" px={4} position="sticky" top="0" zIndex="sticky" backdropFilter="blur(10px)">
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Flex alignItems={'center'}>
          <Image src="/mr-gruas-logo-navbar.png" alt="M.R. Gruas Logo" h="40px" mr={4} />
          <Box display={{ base: 'none', md: 'flex' }}>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <NavLink to="/booking">Book Now</NavLink>
          </Box>
        </Flex>

        <Flex alignItems={'center'}>
          {(userRole === 'admin' || userRole === 'super_admin') && (
            <NavLink to="/admin">Admin Panel</NavLink>
          )}
          {session ? (
            <Button onClick={handleLogout} colorScheme="red" size="sm" ml={2}>Logout</Button>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </Flex>

        <Box display={{ base: 'block', md: 'none' }} onClick={onToggle}>
          {isOpen ? <CloseIcon /> : <HamburgerIcon />}
        </Box>
      </Flex>

      {isOpen && (
        <Box pb={4} display={{ md: 'none' }} animation={`${fadeIn} 0.3s ease-in`}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/booking">Book Now</NavLink>
          {(userRole === 'admin' || userRole === 'super_admin') && (
            <NavLink to="/admin">Admin Panel</NavLink>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Navbar;
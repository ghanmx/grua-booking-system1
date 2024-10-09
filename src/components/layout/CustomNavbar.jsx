import React, { useState, useEffect } from 'react';
import { Box, Flex, Link, Button, Image, useDisclosure } from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useSupabaseAuth } from '../../integrations/supabase/auth';
import { isAdmin } from '../../utils/adminUtils';

const CustomNavbar = () => {
  const { session, logout } = useSupabaseAuth();
  const navigate = useNavigate();
  const { isOpen, onToggle } = useDisclosure();
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (session?.user?.id) {
        const adminStatus = await isAdmin(session.user.id);
        setIsUserAdmin(adminStatus);
      }
    };
    checkAdminStatus();
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
      }}
    >
      {children}
    </Link>
  );

  return (
    <Box bg="blue.500" px={4}>
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
          {isUserAdmin && (
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
        <Box pb={4} display={{ md: 'none' }}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/booking">Book Now</NavLink>
          {isUserAdmin && (
            <NavLink to="/admin">Admin Panel</NavLink>
          )}
        </Box>
      )}
    </Box>
  );
};

export default CustomNavbar;
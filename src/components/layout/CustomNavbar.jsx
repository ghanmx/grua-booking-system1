import React from 'react';
import Navbar from './Navbar';

const CustomNavbar = (props) => {
  return (
    <Navbar
      {...props}
      logoSrc="/public/mr-gruas-logo-navbar.png"
    />
  );
};

export default CustomNavbar;
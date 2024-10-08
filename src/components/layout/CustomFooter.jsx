import React from 'react';
import Footer from './Footer';

const CustomFooter = (props) => {
  return (
    <Footer
      {...props}
      logoSrc="/public/mr-gruas-logo-footer.png"
    />
  );
};

export default CustomFooter;
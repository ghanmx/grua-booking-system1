import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
        color: 'white',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: '0 0 15px rgba(0, 150, 255, 0.5)',
        },
        transition: 'all 0.3s',
        position: 'relative',
        overflow: 'hidden',
        _before: {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'linear-gradient(45deg, transparent, rgba(0, 150, 255, 0.3), transparent)',
          transform: 'rotate(45deg)',
          transition: 'all 0.3s',
        },
        _hover: {
          _before: {
            left: '100%',
          },
        },
      },
    },
  },
});

export default theme;
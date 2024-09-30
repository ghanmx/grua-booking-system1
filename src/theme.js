// theme.js
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    primary: "#ff6347",
    secondary: "#4a5568",
  },
  fonts: {
    body: "system-ui, sans-serif",
    heading: "Georgia, serif",
  },
});

export default theme;

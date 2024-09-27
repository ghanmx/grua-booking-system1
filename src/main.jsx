import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App.jsx";
import { SupabaseProvider } from './integrations/supabase/index.js';
import { SupabaseAuthProvider } from './integrations/supabase/auth.jsx';

const RootComponent = () => (
  <React.StrictMode>
    <ChakraProvider>
      <SupabaseProvider>
        <SupabaseAuthProvider>
          <App />
        </SupabaseAuthProvider>
      </SupabaseProvider>
    </ChakraProvider>
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById("root")).render(<RootComponent />);

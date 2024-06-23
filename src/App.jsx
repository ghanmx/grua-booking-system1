import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import Index from "./pages/Index.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Navbar from "./components/Navbar.jsx";
import BookingForm from "./pages/BookingForm.jsx";
import Confirmation from "./pages/Confirmation.jsx";
import Payment from "./pages/Payment.jsx"; // Import Payment component
import { useSupabaseAuth } from './integrations/supabase/auth.jsx';
import Login from "./pages/Login.jsx"; // Import Login component
import ProtectedRoute from "./components/ProtectedRoute.jsx"; // Import ProtectedRoute component

function App() {
  const { session, logout } = useSupabaseAuth();

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/login" element={<Login />} /> {/* Add Login route */}
          <Route exact path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route exact path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
          <Route exact path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
          <Route exact path="/booking" element={<ProtectedRoute><BookingForm /></ProtectedRoute>} />
          <Route exact path="/confirmation" element={<ProtectedRoute><Confirmation /></ProtectedRoute>} />
          <Route exact path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} /> {/* Add Payment route */}
        </Routes>
        {session && <button onClick={logout}>Logout</button>}
      </Router>
    </>
  );
}

export default App;